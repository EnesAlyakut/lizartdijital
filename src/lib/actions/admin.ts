"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasPermission, isStaff, type SessionUser } from "@/lib/auth";
import { getMailProvider } from "@/lib/providers";
import { PROJECT_STAGES } from "@/lib/constants";
import { readingMinutes, slugify } from "@/lib/utils";
import { getService, saveCustomService, removeCustomService, type Service } from "@/lib/data/services";
import { saveAddOnMedia, deleteAddOnMedia } from "@/lib/data/addon-media";
import type { ActionResult } from "@/lib/actions/cart";

/**
 * Her yönetim işlemi önce yetki kontrolünden geçer.
 * Kontrol istemcide değil, işlemin kendisinde yapılır; menüyü gizlemek yeterli değildir.
 */
async function requireStaff(permission?: string): Promise<
  { ok: true; user: SessionUser } | { ok: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user || !isStaff(user)) return { ok: false, error: "Bu işlem için yetkiniz yok." };
  if (permission && !hasPermission(user, permission)) {
    return { ok: false, error: "Bu işlem için yetkiniz yok." };
  }
  return { ok: true, user };
}

/** İşlem kaydı (audit log). Hassas alanlar kaydedilmez. */
async function log(userId: string, action: string, entity: string, entityId: string, meta: object = {}) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, meta: JSON.stringify(meta) },
  });
}

/* -------------------------------------------------------------- Siparişler */

const ORDER_STATUSES = ["bekliyor", "odendi", "hazirlaniyor", "teslim", "iptal", "iade"] as const;

export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  const parsed = z.enum(ORDER_STATUSES).safeParse(status);
  if (!parsed.success) return { ok: false, error: "Geçersiz sipariş durumu." };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: "Sipariş bulunamadı." };

  await prisma.order.update({ where: { id: orderId }, data: { status: parsed.data } });
  await log(auth.user.id, "order.status_changed", "Order", orderId, {
    from: order.status,
    to: parsed.data,
  });

  revalidatePath("/yonetim/siparisler");
  revalidatePath("/admin/siparisler");
  revalidatePath(`/yonetim/siparisler/${orderId}`);
  revalidatePath(`/admin/siparisler/${orderId}`);
  revalidatePath(`/siparis/${order.orderNumber}`);
  return { ok: true, message: "Sipariş durumu güncellendi." };
}

/**
 * Havale ödemesini manuel onaylar ve teslimatı başlatır.
 * fulfillOrder yalnızca "bekliyor" durumundaki siparişte çalışır; tekrar tetiklenmez.
 */
export async function confirmBankTransfer(orderId: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } });
  if (!order) return { ok: false, error: "Sipariş bulunamadı." };
  if (order.status !== "bekliyor") return { ok: false, error: "Bu siparişin ödemesi zaten işlenmiş." };

  const payment = order.payments.find((p) => p.provider === "havale");
  if (!payment) return { ok: false, error: "Bu siparişte havale ödeme kaydı yok." };

  const { fulfillOrder } = await import("@/lib/actions/checkout");
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "basarili", providerRef: `havale_${order.orderNumber}` },
  });
  await fulfillOrder(order.id, `havale_${order.orderNumber}`);
  await log(auth.user.id, "order.bank_transfer_confirmed", "Order", order.id, {
    orderNumber: order.orderNumber,
  });

  await getMailProvider().send({
    to: order.email,
    subject: `Ödemeniz onaylandı — ${order.orderNumber}`,
    html: `<p>Merhaba ${escapeHtml(order.fullName)},</p><p>Havale ödemeniz onaylandı. Lisans anahtarınıza ve indirme bağlantılarınıza hesabınızdan ulaşabilirsiniz.</p>`,
  });

  revalidatePath("/yonetim/siparisler");
  revalidatePath("/admin/siparisler");
  revalidatePath(`/yonetim/siparisler/${orderId}`);
  revalidatePath(`/admin/siparisler/${orderId}`);
  revalidatePath(`/siparis/${order.orderNumber}`);
  return { ok: true, message: "Ödeme onaylandı, teslimat başlatıldı." };
}

/* ---------------------------------------------------------------- Projeler */

export async function updateProjectStage(projectId: string, stageKey: string): Promise<ActionResult> {
  const auth = await requireStaff("projects.write");
  if (!auth.ok) return auth;

  const valid = PROJECT_STAGES.some((s) => s.key === stageKey);
  if (!valid) return { ok: false, error: "Geçersiz proje aşaması." };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, error: "Proje bulunamadı." };

  const targetIndex = PROJECT_STAGES.findIndex((s) => s.key === stageKey);

  await prisma.$transaction([
    prisma.project.update({ where: { id: projectId }, data: { currentStage: stageKey } }),
    // Seçilen aşamaya kadar olanlar tamamlanmış sayılır.
    prisma.projectStage.updateMany({
      where: { projectId, sortOrder: { lt: targetIndex } , completedAt: null },
      data: { completedAt: new Date() },
    }),
    prisma.projectStage.updateMany({
      where: { projectId, sortOrder: { gte: targetIndex } },
      data: { completedAt: null },
    }),
  ]);

  await log(auth.user.id, "project.stage_changed", "Project", projectId, { to: stageKey });
  revalidatePath("/yonetim/projeler");
  return { ok: true, message: "Proje aşaması güncellendi." };
}

/* ------------------------------------------------------------ Destek yanıtı */

export async function staffReplyToTicket(ticketId: string, body: string): Promise<ActionResult> {
  const auth = await requireStaff("tickets.write");
  if (!auth.ok) return auth;

  const trimmed = body.trim();
  if (trimmed.length < 2) return { ok: false, error: "Mesaj boş olamaz." };

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
    include: { user: { select: { email: true, fullName: true } } },
  });
  if (!ticket) return { ok: false, error: "Destek talebi bulunamadı." };

  await prisma.ticketMessage.create({
    data: { ticketId, authorId: auth.user.id, authorRole: "ekip", body: trimmed.slice(0, 4000) },
  });
  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "yanitlandi" } });

  await getMailProvider().send({
    to: ticket.user.email,
    subject: `Destek talebiniz yanıtlandı — ${ticket.code}`,
    html: `<p>Merhaba ${escapeHtml(ticket.user.fullName)},</p><p>${escapeHtml(ticket.code)} numaralı talebiniz yanıtlandı. Hesabınızdan görüntüleyebilirsiniz.</p>`,
  });

  revalidatePath("/yonetim/destek");
  return { ok: true, message: "Yanıtınız gönderildi." };
}

export async function closeTicket(ticketId: string): Promise<ActionResult> {
  const auth = await requireStaff("tickets.write");
  if (!auth.ok) return auth;

  await prisma.supportTicket.update({ where: { id: ticketId }, data: { status: "kapali" } });
  await log(auth.user.id, "ticket.closed", "SupportTicket", ticketId);
  revalidatePath("/yonetim/destek");
  return { ok: true, message: "Talep kapatıldı." };
}

/* ----------------------------------------------------------------- Ürünler */

const productSchema = z.object({
  name: z.string().trim().min(3, "Ürün adı giriniz.").max(160),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(160),
  type: z.enum(["website", "app", "webapp", "system", "template", "service"]),
  categoryId: z.string().min(1, "Kategori seçiniz."),
  shortDesc: z.string().trim().min(10, "Kısa açıklama giriniz.").max(300),
  description: z.string().trim().min(20, "Açıklama giriniz.").max(8000),
  // Fiyatlar formda TL girilir, veritabanına kuruş olarak yazılır.
  basePrice: z.coerce.number().min(0, "Fiyat 0'dan küçük olamaz."),
  comparePrice: z.coerce.number().min(0).optional(),
  deliveryDays: z.coerce.number().int().min(0).max(365),
  isPublished: z.union([z.literal("on"), z.undefined()]).optional(),
  isFeatured: z.union([z.literal("on"), z.undefined()]).optional(),
  hasAdminPanel: z.union([z.literal("on"), z.undefined()]).optional(),
  includesSource: z.union([z.literal("on"), z.undefined()]).optional(),
  multiLanguage: z.union([z.literal("on"), z.undefined()]).optional(),
});

function entriesWithAutoSlug(formData: FormData): Record<string, any> {
  const entries = Object.fromEntries(formData);
  const name = String(entries.name ?? entries.title ?? "");
  const currentSlug = String(entries.slug ?? "").trim();
  return {
    ...entries,
    slug: currentSlug || slugify(name),
  };
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const parsed = productSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const slugConflict = await prisma.product.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (slugConflict) return { ok: false, error: "Bu slug başka bir üründe kullanılıyor." };

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug: d.slug,
      type: d.type,
      categoryId: d.categoryId,
      shortDesc: d.shortDesc,
      description: d.description,
      features: JSON.stringify(
        String(formData.get("features") ?? "")
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
      basePrice: Math.round(d.basePrice * 100),
      comparePrice: d.comparePrice ? Math.round(d.comparePrice * 100) : null,
      deliveryDays: d.deliveryDays,
      coverImage: String(formData.get("coverImage") ?? "").trim() || "/lizart-logo-original.png",
      demoUrl: String(formData.get("demoUrl") ?? "").trim() || null,
      adminDemoUrl: String(formData.get("adminDemoUrl") ?? "").trim() || null,
      metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
      metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
      isPublished: d.isPublished === "on",
      isFeatured: d.isFeatured === "on",
      hasAdminPanel: d.hasAdminPanel === "on",
      includesSource: d.includesSource === "on",
      multiLanguage: d.multiLanguage === "on",
    },
  });

  await prisma.productLicense.createMany({
    data: [
      {
        productId: product.id,
        key: "standart",
        name: "Standart Lisans",
        description: "Tek marka ve tek domain için standart kullanım hakkı.",
        priceDelta: 0,
        bullets: JSON.stringify(["Tek domain kullanımı", "6 ay destek", "6 ay güncelleme erişimi"]),
        domainLimit: 1,
        supportMonths: 6,
        updateMonths: 6,
        sortOrder: 0,
      },
      {
        productId: product.id,
        key: "genisletilmis",
        name: "Genişletilmiş Lisans",
        description: "Birden fazla marka veya domain için genişletilmiş kullanım hakkı.",
        priceDelta: Math.round(d.basePrice * 35),
        bullets: JSON.stringify(["3 domain kullanımı", "12 ay destek", "12 ay güncelleme erişimi"]),
        domainLimit: 3,
        supportMonths: 12,
        updateMonths: 12,
        sortOrder: 1,
      },
    ],
  });

  await log(auth.user.id, "product.created", "Product", product.id, { slug: d.slug });
  revalidatePath("/yonetim/urunler");
  revalidatePath("/magaza");
  return { ok: true, message: "Ürün oluşturuldu." };
}

/** Ürünün temel alanlarını günceller. Fiyat TL olarak alınır, kuruşa çevrilir. */
export async function updateProduct(productId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return { ok: false, error: "Ürün bulunamadı." };

  const slugConflict = await prisma.product.findFirst({
    where: { slug: d.slug, id: { not: productId } },
    select: { id: true },
  });
  if (slugConflict) return { ok: false, error: "Bu slug başka bir üründe kullanılıyor." };

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: d.name,
      slug: d.slug,
      type: d.type,
      categoryId: d.categoryId,
      shortDesc: d.shortDesc,
      description: d.description,
      basePrice: Math.round(d.basePrice * 100),
      comparePrice: d.comparePrice ? Math.round(d.comparePrice * 100) : null,
      deliveryDays: d.deliveryDays,
      isPublished: d.isPublished === "on",
      isFeatured: d.isFeatured === "on",
      hasAdminPanel: d.hasAdminPanel === "on",
      includesSource: d.includesSource === "on",
      multiLanguage: d.multiLanguage === "on",
    },
  });

  await log(auth.user.id, "product.updated", "Product", productId, { slug: d.slug });
  revalidatePath("/yonetim/urunler");
  revalidatePath(`/urun/${d.slug}`);
  revalidatePath("/magaza");
  return { ok: true, message: "Ürün güncellendi." };
}

export async function toggleProductPublished(productId: string): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  await prisma.product.update({
    where: { id: productId },
    data: { isPublished: !product.isPublished },
  });
  await log(auth.user.id, "product.publish_toggled", "Product", productId, {
    isPublished: !product.isPublished,
  });

  revalidatePath("/yonetim/urunler");
  revalidatePath("/magaza");
  return { ok: true, message: product.isPublished ? "Ürün yayından kaldırıldı." : "Ürün yayınlandı." };
}

export async function duplicateProduct(productId: string): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, licenses: true, technologies: true, platforms: true, addOns: true, faqs: true },
  });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  const baseSlug = `${product.slug}-kopya`;
  let nextSlug = baseSlug;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: nextSlug }, select: { id: true } })) {
    nextSlug = `${baseSlug}-${suffix++}`;
  }

  const created = await prisma.product.create({
    data: {
      slug: nextSlug,
      name: `${product.name} Kopya`,
      type: product.type,
      categoryId: product.categoryId,
      shortDesc: product.shortDesc,
      description: product.description,
      features: product.features,
      useCases: product.useCases,
      modules: product.modules,
      techSpecs: product.techSpecs,
      requirements: product.requirements,
      supportScope: product.supportScope,
      updatePolicy: product.updatePolicy,
      basePrice: product.basePrice,
      comparePrice: product.comparePrice,
      currency: product.currency,
      vatRate: product.vatRate,
      coverImage: product.coverImage,
      demoUrl: product.demoUrl,
      adminDemoUrl: product.adminDemoUrl,
      demoUser: product.demoUser,
      demoPassword: product.demoPassword,
      videoUrl: product.videoUrl,
      designStyle: product.designStyle,
      deliveryDays: product.deliveryDays,
      isResponsive: product.isResponsive,
      hasAdminPanel: product.hasAdminPanel,
      includesSetup: product.includesSetup,
      includesSource: product.includesSource,
      multiLanguage: product.multiLanguage,
      hasPayment: product.hasPayment,
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      isPublished: false,
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
    },
  });

  await Promise.all([
    prisma.productImage.createMany({
      data: product.images.map((image) => ({
        productId: created.id,
        url: image.url,
        alt: image.alt,
        viewport: image.viewport,
        sortOrder: image.sortOrder,
      })),
    }),
    prisma.productLicense.createMany({
      data: product.licenses.map((license) => ({
        productId: created.id,
        key: license.key,
        name: license.name,
        description: license.description,
        priceDelta: license.priceDelta,
        bullets: license.bullets,
        domainLimit: license.domainLimit,
        supportMonths: license.supportMonths,
        updateMonths: license.updateMonths,
        resaleRights: license.resaleRights,
        sourceIncluded: license.sourceIncluded,
        sortOrder: license.sortOrder,
      })),
    }),
    prisma.productTechnology.createMany({
      data: product.technologies.map((item) => ({ productId: created.id, technologyId: item.technologyId })),
    }),
    prisma.productPlatform.createMany({
      data: product.platforms.map((item) => ({ productId: created.id, platformId: item.platformId })),
    }),
    prisma.productAddOn.createMany({
      data: product.addOns.map((item) => ({ productId: created.id, addOnId: item.addOnId, isRecommended: item.isRecommended })),
    }),
    prisma.faq.createMany({
      data: product.faqs.map((faq) => ({
        productId: created.id,
        category: faq.category,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
      })),
    }),
  ]);

  await log(auth.user.id, "product.duplicated", "Product", created.id, { from: productId });
  revalidatePath("/yonetim/urunler");
  return { ok: true, message: "Ürün taslak olarak kopyalandı." };
}

export async function archiveProduct(productId: string): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  await prisma.product.update({
    where: { id: productId },
    data: { isPublished: false, isFeatured: false, isBestSeller: false },
  });
  await log(auth.user.id, "product.archived", "Product", productId);
  revalidatePath("/yonetim/urunler");
  revalidatePath(`/urun/${product.slug}`);
  revalidatePath("/magaza");
  return { ok: true, message: "Ürün arşive alındı." };
}

/* ------------------------------------------------------------------- Blog */

const blogPostSchema = z.object({
  title: z.string().trim().min(2, "Başlık giriniz.").max(200),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(180),
  excerpt: z.string().trim().min(1, "Kısa açıklama giriniz.").max(400),
  body: z.string().trim().min(5, "İçerik en az 5 karakter olmalıdır.").max(50000),
  coverImage: z.string().trim().min(1, "Kapak görseli giriniz.").max(600),
  authorName: z.string().trim().max(120).optional().default("Lizart Dijital"),
  authorTitle: z.string().trim().max(120).optional(),
  categoryId: z.string().min(1, "Kategori seçiniz."),
  metaTitle: z.string().trim().max(100).optional(),
  metaDescription: z.string().trim().max(200).optional(),
  keywords: z.string().trim().max(300).optional(),
  publishedAt: z.string().optional(),
  isPublished: z.union([
    z.literal("on"),
    z.literal("true"),
    z.literal("1"),
    z.literal("false"),
    z.literal("0"),
    z.undefined(),
  ]).optional(),
});

export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const rawEntries = entriesWithAutoSlug(formData);

  // Eksik veya çok kısa özet varsa içerikten/başlıktan otomatik tamamla
  if (!rawEntries.excerpt || String(rawEntries.excerpt).trim().length < 3) {
    const rawBody = String(rawEntries.body || "").replace(/[#*`_\[\]()]/g, "").trim();
    rawEntries.excerpt = rawBody.slice(0, 160) || String(rawEntries.title || "Lizart Dijital Rehber");
  }

  // Eksik kapak görseli varsa varsayılan logo yap
  if (!rawEntries.coverImage || !String(rawEntries.coverImage).trim()) {
    rawEntries.coverImage = "/logo.svg";
  }

  // İçerik çok kısaysa veya boşsa en az 5 karakterlik varsayılan sağla
  if (!rawEntries.body || String(rawEntries.body).trim().length < 5) {
    rawEntries.body = "## " + (rawEntries.title || "Giriş") + "\n\nBu rehber hazırlanıyor...";
  }

  const parsed = blogPostSchema.safeParse(rawEntries);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const slugConflict = await prisma.blogPost.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (slugConflict) return { ok: false, error: "Bu slug başka bir blog yazısında kullanılıyor. Lütfen başlığı veya slug'ı değiştirin." };

  const now = new Date();
  let pubDate = now;
  if (d.publishedAt && !isNaN(new Date(d.publishedAt).getTime())) {
    const customDate = new Date(d.publishedAt);
    if (customDate.toDateString() === now.toDateString()) {
      pubDate = now;
    } else {
      pubDate = customDate;
    }
  }

  // Yeni yazılarda aksi açıkça belirtilmedikçe ("false" veya "0") varsayılan olarak yayında kabul et
  const isPub = d.isPublished === "false" || d.isPublished === "0" ? false : true;

  const post = await prisma.blogPost.create({
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      body: d.body,
      coverImage: d.coverImage,
      authorName: d.authorName || "Lizart Dijital",
      authorTitle: d.authorTitle || (d.keywords ? d.keywords : null),
      categoryId: d.categoryId,
      readMinutes: readingMinutes(d.body),
      isPublished: isPub,
      publishedAt: pubDate,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });

  await log(auth.user.id, "blog.created", "BlogPost", post.id, { slug: d.slug });
  revalidatePath("/yonetim/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${d.slug}`);
  revalidatePath("/");
  return { ok: true, slug: d.slug, message: "Blog yazısı başarıyla oluşturuldu ve yayınlandı." };
}

export async function updateBlogPost(postId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) return { ok: false, error: "Blog yazısı bulunamadı." };

  const rawEntries = entriesWithAutoSlug(formData);
  if (!rawEntries.excerpt || String(rawEntries.excerpt).trim().length < 3) {
    const rawBody = String(rawEntries.body || "").replace(/[#*`_\[\]()]/g, "").trim();
    rawEntries.excerpt = rawBody.slice(0, 160) || String(rawEntries.title || existing.title);
  }

  const parsed = blogPostSchema.safeParse(rawEntries);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  if (d.slug !== existing.slug) {
    const slugConflict = await prisma.blogPost.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (slugConflict && slugConflict.id !== postId) {
      return { ok: false, error: "Bu slug başka bir blog yazısında kullanılıyor." };
    }
  }

  const pubDate = d.publishedAt && !isNaN(new Date(d.publishedAt).getTime())
    ? new Date(d.publishedAt)
    : undefined;

  const isPub =
    d.isPublished === "false" || d.isPublished === "0"
      ? false
      : d.isPublished === "on" || d.isPublished === "true" || d.isPublished === "1";

  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      body: d.body,
      coverImage: d.coverImage,
      authorName: d.authorName || existing.authorName || "Lizart Dijital",
      authorTitle: d.authorTitle || (d.keywords ? d.keywords : null),
      categoryId: d.categoryId,
      readMinutes: readingMinutes(d.body),
      isPublished: isPub,
      ...(pubDate ? { publishedAt: pubDate } : {}),
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });

  await log(auth.user.id, "blog.updated", "BlogPost", postId, { slug: d.slug });
  revalidatePath("/yonetim/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${d.slug}`);
  revalidatePath("/");
  return { ok: true, message: "Blog yazısı güncellendi." };
}


export async function toggleBlogPublished(postId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return { ok: false, error: "Blog yazısı bulunamadı." };

  await prisma.blogPost.update({ where: { id: postId }, data: { isPublished: !post.isPublished } });
  await log(auth.user.id, "blog.publish_toggled", "BlogPost", postId, { isPublished: !post.isPublished });
  revalidatePath("/yonetim/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return { ok: true, message: post.isPublished ? "Yazı taslağa alındı." : "Yazı yayınlandı." };
}

export async function deleteBlogPost(postId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const post = await prisma.blogPost.findUnique({ where: { id: postId }, select: { slug: true } });
  if (!post) return { ok: false, error: "Blog yazısı bulunamadı." };

  await prisma.blogPost.delete({ where: { id: postId } });
  await log(auth.user.id, "blog.deleted", "BlogPost", postId, { slug: post.slug });
  revalidatePath("/yonetim/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return { ok: true, message: "Blog yazısı silindi." };
}

const blogCategorySchema = z.object({
  name: z.string().trim().min(2, "Kategori adı en az 2 karakter olmalıdır.").max(80),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(100),
});

export async function createBlogCategory(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const parsed = blogCategorySchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const conflict = await prisma.blogCategory.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (conflict) return { ok: false, error: "Bu slug başka bir blog kategorisinde kullanılıyor." };

  const cat = await prisma.blogCategory.create({
    data: {
      name: d.name,
      slug: d.slug,
    },
  });

  await log(auth.user.id, "blog.category_created", "BlogCategory", cat.id, { slug: d.slug, name: d.name });
  revalidatePath("/yonetim/kategoriler");
  revalidatePath("/admin/kategoriler");
  revalidatePath("/yonetim/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/yonetim/blog/yeni");
  revalidatePath("/admin/blog/yeni");
  revalidatePath("/blog");
  return { ok: true, slug: d.slug, id: cat.id, name: cat.name, message: "Blog kategorisi oluşturuldu." };
}

export async function deleteBlogCategory(categoryId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const cat = await prisma.blogCategory.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { posts: true } } },
  });
  if (!cat) return { ok: false, error: "Kategori bulunamadı." };

  if (cat._count.posts > 0) {
    return {
      ok: false,
      error: `Bu kategoriye bağlı ${cat._count.posts} adet blog yazısı bulunmaktadır. Kategoriyi silmek için önce bu yazıların kategorisini değiştirin veya silin.`,
    };
  }

  await prisma.blogCategory.delete({ where: { id: categoryId } });
  await log(auth.user.id, "blog.category_deleted", "BlogCategory", categoryId, { slug: cat.slug });
  revalidatePath("/yonetim/kategoriler");
  revalidatePath("/admin/kategoriler");
  revalidatePath("/yonetim/blog");
  revalidatePath("/admin/blog");
  revalidatePath("/yonetim/blog/yeni");
  revalidatePath("/admin/blog/yeni");
  revalidatePath("/blog");
  return { ok: true, message: "Blog kategorisi silindi." };
}

/* ------------------------------------------------------------ Hizmetler */

const serviceSchema = z.object({
  title: z.string().trim().min(3, "Hizmet adı en az 3 karakter olmalıdır.").max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(120),
  summary: z.string().trim().min(10, "Kısa özet en az 10 karakter olmalıdır.").max(300),
  hero: z.string().trim().min(10, "Tanıtım açıklaması en az 10 karakter olmalıdır.").max(800),
  metaTitle: z.string().trim().max(120).optional(),
  price: z.string().trim().max(80).optional(),
  image: z.string().trim().max(600).optional(),
  gallery: z.string().trim().optional(),
  category: z.string().trim().max(60).optional(),
  badge: z.string().trim().max(60).optional(),
  benefits: z.string().trim().optional(),
  process: z.string().trim().optional(),
});

export async function createService(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("service.write");
  if (!auth.ok) return auth;

  const parsed = serviceSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = getService(d.slug);
  if (existing) return { ok: false, error: "Bu URL bağlantısı (slug) başka bir hizmette kullanılıyor." };

  const benefitLines = (d.benefits || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const processLines = (d.process || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const galleryImages = (d.gallery || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const mainImage = d.image?.trim() || (galleryImages.length > 0 ? galleryImages[0] : "/logo.svg");

  const newService: Service = {
    slug: d.slug,
    title: d.title,
    metaTitle: d.metaTitle || `${d.title} — Profesyonel Dijital Çözümler | Lizart`,
    summary: d.summary,
    hero: d.hero,
    image: mainImage,
    gallery: galleryImages.length > 0 ? galleryImages : [mainImage],
    category: d.category || "web",
    badge: d.badge || "Yeni Hizmet",
    benefits: benefitLines.length
      ? benefitLines.map((line) => {
          const parts = line.split(":");
          return {
            title: parts[0]?.trim() || line,
            body: parts[1]?.trim() || "Detaylı profesyonel hizmet adımı ve kapsamı.",
          };
        })
      : [
          { title: "Hızlı ve Güvenilir Teslimat", body: "Sözleşmeli ve planlı süreç yönetimi." },
          { title: "Uzman Ekip Desteği", body: "Alanında deneyimli yazılım ve tasarım ekibi." },
          { title: "Teknik Garanti", body: "Teslimat sonrası kesintisiz teknik destek garantisi." },
        ],
    process: processLines.length
      ? processLines
      : ["1. Keşif & Analiz", "2. Tasarım & Mimari", "3. Geliştirme & Test", "4. Yayına Alma & Destek"],
    packages: [
      {
        name: "Standart Hizmet Paketi",
        price: d.price || "4.500 ₺'den başlayan",
        bullets: ["Anahtar teslim süreç", "Teknik destek", "Kapsamlı teslimat raporu"],
        highlighted: true,
      },
    ],
    faqs: [
      {
        question: "Bu hizmet ne kadar sürede tamamlanır?",
        answer: "Proje kapsamına göre ortalama 1-3 hafta içinde tamamlanıp teslim edilir.",
      },
      {
        question: "Hizmet sonrası teknik destek var mı?",
        answer: "Evet, tüm kurumsal hizmetlerimiz teslimat sonrası destek garantisiyle sunulur.",
      },
    ],
    relatedProducts: [],
  };

  saveCustomService(newService);
  await log(auth.user.id, "service.created", "Service", d.slug, { title: d.title });
  revalidatePath("/yonetim/hizmetler");
  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  revalidatePath(`/hizmetler/${d.slug}`);
  return { ok: true, slug: d.slug, message: "Hizmet başarıyla oluşturuldu." };
}

export async function updateService(prevSlug: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("service.write");
  if (!auth.ok) return auth;

  const parsed = serviceSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = getService(prevSlug);
  if (!existing) return { ok: false, error: "Düzenlenecek hizmet bulunamadı." };

  if (d.slug !== prevSlug) {
    const slugConflict = getService(d.slug);
    if (slugConflict) {
      return { ok: false, error: "Bu URL bağlantısı (slug) başka bir hizmette kullanılıyor." };
    }
  }

  const benefitLines = (d.benefits || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const processLines = (d.process || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const galleryImages = (d.gallery || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const mainImage = d.image?.trim() || (galleryImages.length > 0 ? galleryImages[0] : existing.image || "/logo.svg");

  const updatedService: Service = {
    ...existing,
    slug: d.slug,
    title: d.title,
    metaTitle: d.metaTitle || `${d.title} — Profesyonel Dijital Çözümler | Lizart`,
    summary: d.summary,
    hero: d.hero,
    image: mainImage,
    gallery: galleryImages.length > 0 ? galleryImages : [mainImage],
    category: d.category || existing.category || "web",
    badge: d.badge || existing.badge,
    benefits: benefitLines.length
      ? benefitLines.map((line) => {
          const parts = line.split(":");
          return {
            title: parts[0]?.trim() || line,
            body: parts[1]?.trim() || "Detaylı profesyonel hizmet adımı ve kapsamı.",
          };
        })
      : existing.benefits,
    process: processLines.length ? processLines : existing.process,
    packages: [
      {
        name: existing.packages?.[0]?.name || "Standart Hizmet Paketi",
        price: d.price || existing.packages?.[0]?.price || "Teklif Alın",
        bullets: existing.packages?.[0]?.bullets || ["Anahtar teslim süreç", "Teknik destek", "Teslimat garantisi"],
        highlighted: true,
      },
      ...(existing.packages?.slice(1) || []),
    ],
  };

  saveCustomService(updatedService, prevSlug);
  await log(auth.user.id, "service.updated", "Service", d.slug, { title: d.title, prevSlug });
  revalidatePath("/yonetim/hizmetler");
  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  revalidatePath(`/hizmetler/${d.slug}`);
  if (prevSlug !== d.slug) {
    revalidatePath(`/hizmetler/${prevSlug}`);
  }
  return { ok: true, slug: d.slug, message: "Hizmet başarıyla güncellendi." };
}

export async function deleteService(slug: string): Promise<ActionResult> {
  const auth = await requireStaff("service.write");
  if (!auth.ok) return auth;

  removeCustomService(slug);
  await log(auth.user.id, "service.deleted", "Service", slug);
  revalidatePath("/yonetim/hizmetler");
  revalidatePath("/admin/hizmetler");
  revalidatePath("/hizmetler");
  revalidatePath(`/hizmetler/${slug}`);
  return { ok: true, message: "Hizmet başarıyla silindi." };
}

/* -------------------------------------------------------------- Portföy */

const portfolioSchema = z.object({
  title: z.string().trim().min(3, "Proje adı giriniz.").max(160),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(160),
  client: z.string().trim().min(2, "Müşteri adı giriniz.").max(140),
  sector: z.string().trim().min(2, "Sektör giriniz.").max(120),
  category: z.string().trim().min(2, "Kategori giriniz.").max(80),
  summary: z.string().trim().min(20, "Proje özeti giriniz.").max(500),
  problem: z.string().trim().min(20, "Problem alanı giriniz.").max(1500),
  solution: z.string().trim().min(20, "Çözüm alanı giriniz.").max(1500),
  coverImage: z.string().trim().min(1, "Kapak görseli giriniz.").max(600),
  mobileImage: z.string().trim().max(600).optional(),
  liveUrl: z.string().trim().max(600).optional(),
  isFeatured: z.union([z.literal("on"), z.undefined()]).optional(),
});

export async function createPortfolioProject(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("portfolio.write");
  if (!auth.ok) return auth;

  const parsed = portfolioSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const slugConflict = await prisma.portfolioProject.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (slugConflict) return { ok: false, error: "Bu slug başka bir referansta kullanılıyor." };

  const splitLines = (key: string) =>
    String(formData.get(key) ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const project = await prisma.portfolioProject.create({
    data: {
      title: d.title,
      slug: d.slug,
      client: d.client,
      sector: d.sector,
      category: d.category,
      summary: d.summary,
      problem: d.problem,
      solution: d.solution,
      services: JSON.stringify(splitLines("services")),
      technologies: JSON.stringify(splitLines("technologies")),
      results: JSON.stringify(splitLines("results").map((item) => ({ label: item, value: "Tamamlandı" }))),
      coverImage: d.coverImage,
      mobileImage: d.mobileImage || null,
      liveUrl: d.liveUrl || null,
      deliverables: JSON.stringify(splitLines("deliverables")),
      gallery: JSON.stringify(splitLines("gallery")),
      isFeatured: d.isFeatured === "on",
    },
  });

  await log(auth.user.id, "portfolio.created", "PortfolioProject", project.id, { slug: d.slug });
  revalidatePath("/yonetim/portfoy");
  revalidatePath("/projeler");
  return { ok: true, message: "Referans projesi oluşturuldu." };
}

export async function togglePortfolioFeatured(projectId: string): Promise<ActionResult> {
  const auth = await requireStaff("portfolio.write");
  if (!auth.ok) return auth;

  const project = await prisma.portfolioProject.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, error: "Referans bulunamadı." };

  await prisma.portfolioProject.update({ where: { id: projectId }, data: { isFeatured: !project.isFeatured } });
  await log(auth.user.id, "portfolio.featured_toggled", "PortfolioProject", projectId, { isFeatured: !project.isFeatured });
  revalidatePath("/yonetim/portfoy");
  revalidatePath("/projeler");
  revalidatePath(`/projeler/${project.slug}`);
  return { ok: true, message: project.isFeatured ? "Öne çıkan kapatıldı." : "Öne çıkan yapıldı." };
}

export async function deletePortfolioProject(projectId: string): Promise<ActionResult> {
  const auth = await requireStaff("portfolio.write");
  if (!auth.ok) return auth;

  const project = await prisma.portfolioProject.findUnique({ where: { id: projectId }, select: { slug: true } });
  if (!project) return { ok: false, error: "Referans bulunamadı." };

  await prisma.portfolioProject.delete({ where: { id: projectId } });
  await log(auth.user.id, "portfolio.deleted", "PortfolioProject", projectId, { slug: project.slug });
  revalidatePath("/yonetim/portfoy");
  revalidatePath("/projeler");
  revalidatePath(`/projeler/${project.slug}`);
  return { ok: true, message: "Referans silindi." };
}

export async function updatePortfolioProject(projectId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("portfolio.write");
  if (!auth.ok) return auth;

  const existing = await prisma.portfolioProject.findUnique({ where: { id: projectId } });
  if (!existing) return { ok: false, error: "Referans bulunamadı." };

  const parsed = portfolioSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  if (d.slug !== existing.slug) {
    const slugConflict = await prisma.portfolioProject.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (slugConflict && slugConflict.id !== projectId) {
      return { ok: false, error: "Bu slug başka bir referansta kullanılıyor." };
    }
  }

  const splitLines = (key: string) =>
    String(formData.get(key) ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  await prisma.portfolioProject.update({
    where: { id: projectId },
    data: {
      title: d.title,
      slug: d.slug,
      client: d.client,
      sector: d.sector,
      category: d.category,
      summary: d.summary,
      problem: d.problem,
      solution: d.solution,
      services: JSON.stringify(splitLines("services")),
      technologies: JSON.stringify(splitLines("technologies")),
      results: JSON.stringify(splitLines("results").map((item) => ({ label: item, value: "Tamamlandı" }))),
      coverImage: d.coverImage,
      mobileImage: d.mobileImage || null,
      liveUrl: d.liveUrl || null,
      deliverables: JSON.stringify(splitLines("deliverables")),
      gallery: JSON.stringify(splitLines("gallery")),
      isFeatured: d.isFeatured === "on",
    },
  });

  await log(auth.user.id, "portfolio.updated", "PortfolioProject", projectId, { slug: d.slug });
  revalidatePath("/yonetim/portfoy");
  revalidatePath("/projeler");
  revalidatePath(`/projeler/${d.slug}`);
  return { ok: true, message: "Referans başarıyla güncellendi." };
}

/* -------------------------------------------------------- Ürün sürümleri */

const versionSchema = z.object({
  version: z.string().trim().regex(/^\d+\.\d+\.\d+$/, "Sürüm 1.2.3 biçiminde olmalıdır."),
  changelog: z.string().trim().min(10, "Değişiklik notu giriniz.").max(4000),
});

export async function publishVersion(productId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const parsed = versionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false, error: "Ürün bulunamadı." };

  await prisma.productVersion.create({
    data: {
      productId,
      version: parsed.data.version,
      changelog: parsed.data.changelog,
    },
  });

  await log(auth.user.id, "product.version_published", "Product", productId, {
    version: parsed.data.version,
  });

  revalidatePath(`/urun/${product.slug}`);
  revalidatePath("/yonetim/urunler");
  return { ok: true, message: `Sürüm ${parsed.data.version} yayınlandı.` };
}

/* ------------------------------------------------------------ Yorum onayı */

export async function setReviewApproval(reviewId: string, approved: boolean): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { ok: false, error: "Yorum bulunamadı." };

  await prisma.review.update({ where: { id: reviewId }, data: { isApproved: approved } });

  // Ürün puan ortalaması yeniden hesaplanır.
  const agg = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: review.productId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
  });

  await log(auth.user.id, "review.approval_changed", "Review", reviewId, { approved });
  revalidatePath("/yonetim/yorumlar");
  revalidatePath("/admin/yorumlar");
  return { ok: true, message: approved ? "Yorum onaylandı ve yayına alındı." : "Yorum yayından kaldırıldı." };
}

export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return { ok: false, error: "Yorum bulunamadı." };

  await prisma.review.delete({ where: { id: reviewId } });

  const agg = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.product.update({
    where: { id: review.productId },
    data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
  });

  await log(auth.user.id, "review.deleted", "Review", reviewId, {});
  revalidatePath("/yonetim/yorumlar");
  revalidatePath("/admin/yorumlar");
  return { ok: true, message: "Yorum kalıcı olarak silindi." };
}

const reviewInputSchema = z.object({
  productId: z.string().min(1, "Lütfen bir ürün seçin."),
  authorName: z.string().trim().min(2, "İsim en az 2 karakter olmalıdır.").max(80),
  authorTitle: z.string().trim().max(100).optional(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(5, "Yorum metni en az 5 karakter olmalıdır.").max(2000),
  isApproved: z.coerce.boolean().default(false),
});

export async function createAdminReview(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const raw = Object.fromEntries(formData);
  const parsed = reviewInputSchema.safeParse({
    ...raw,
    isApproved: raw.isApproved === "true" || raw.isApproved === "on",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      authorName: parsed.data.authorName,
      authorTitle: parsed.data.authorTitle || null,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      body: parsed.data.body,
      isApproved: parsed.data.isApproved,
    },
  });

  if (parsed.data.isApproved) {
    const agg = await prisma.review.aggregate({
      where: { productId: parsed.data.productId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: parsed.data.productId },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
  }

  revalidatePath("/yonetim/yorumlar");
  revalidatePath("/admin/yorumlar");
  return { ok: true, message: "Yorum başarıyla eklendi." };
}

/* ---------------------------------------------------------------- Kuponlar */

const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{4,32}$/, "Kod 4-32 karakter, harf ve rakam olmalıdır."),
  type: z.enum(["yuzde", "tutar"]),
  value: z.coerce.number().min(1, "Değer giriniz."),
  minSubtotal: z.coerce.number().min(0).default(0),
  maxUses: z.coerce.number().int().min(0).optional(),
});

export async function createCoupon(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("*");
  if (!auth.ok) return auth;

  const parsed = couponSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  if (d.type === "yuzde" && d.value > 90) {
    return { ok: false, error: "Yüzde indirim en fazla %90 olabilir." };
  }

  const existing = await prisma.coupon.findUnique({ where: { code: d.code } });
  if (existing) return { ok: false, error: "Bu kupon kodu zaten var." };

  await prisma.coupon.create({
    data: {
      code: d.code,
      type: d.type,
      // Yüzde ise oran, tutar ise kuruş olarak saklanır.
      value: d.type === "yuzde" ? d.value : Math.round(d.value * 100),
      minSubtotal: Math.round(d.minSubtotal * 100),
      maxUses: d.maxUses || null,
    },
  });

  await log(auth.user.id, "coupon.created", "Coupon", d.code, { type: d.type });
  revalidatePath("/yonetim/kuponlar");
  return { ok: true, message: "Kupon oluşturuldu." };
}

export async function toggleCoupon(couponId: string): Promise<ActionResult> {
  const auth = await requireStaff("*");
  if (!auth.ok) return auth;

  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) return { ok: false, error: "Kupon bulunamadı." };

  await prisma.coupon.update({ where: { id: couponId }, data: { isActive: !coupon.isActive } });
  revalidatePath("/yonetim/kuponlar");
  return { ok: true, message: coupon.isActive ? "Kupon pasifleştirildi." : "Kupon etkinleştirildi." };
}

/* ---------------------------------------------------------------- Ayarlar */

export async function updateSetting(key: string, value: string): Promise<ActionResult> {
  const auth = await requireStaff("*");
  if (!auth.ok) return auth;

  const safeKey = key.trim().slice(0, 100);
  const safeValue = value.trim().slice(0, 2000);
  if (!safeKey) return { ok: false, error: "Ayar anahtarı boş olamaz." };

  await prisma.setting.upsert({
    where: { key: safeKey },
    update: { value: safeValue },
    create: { key: safeKey, value: safeValue },
  });

  await log(auth.user.id, "setting.updated", "Setting", safeKey);
  revalidatePath("/yonetim/ayarlar");
  revalidatePath("/", "layout");
  return { ok: true, message: "Ayar kaydedildi." };
}

/* ------------------------------------------------------------ Kullanıcılar */

export async function changeUserRole(userId: string, roleKey: string): Promise<ActionResult> {
  const auth = await requireStaff("*");
  if (!auth.ok) return auth;

  if (auth.user.id === userId) {
    return { ok: false, error: "Kendi rolünüzü değiştiremezsiniz." };
  }

  const role = await prisma.role.findUnique({ where: { key: roleKey } });
  if (!role) return { ok: false, error: "Rol bulunamadı." };

  await prisma.user.update({ where: { id: userId }, data: { roleId: role.id } });
  await log(auth.user.id, "user.role_changed", "User", userId, { roleKey });

  revalidatePath("/yonetim/kullanicilar");
  return { ok: true, message: "Kullanıcı rolü güncellendi." };
}

export async function toggleUserActive(userId: string): Promise<ActionResult> {
  const auth = await requireStaff("*");
  if (!auth.ok) return auth;
  if (auth.user.id === userId) return { ok: false, error: "Kendi hesabınızı kapatamazsınız." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Kullanıcı bulunamadı." };

  await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
  // Hesap kapatıldığında açık oturumları sonlandır.
  if (user.isActive) await prisma.session.deleteMany({ where: { userId } });

  await log(auth.user.id, "user.active_toggled", "User", userId, { isActive: !user.isActive });
  revalidatePath("/yonetim/kullanicilar");
  return { ok: true, message: user.isActive ? "Hesap pasifleştirildi." : "Hesap etkinleştirildi." };
}

/* ------------------------------------------------------------- Teklifler */

export async function updateOfferStatus(offerId: string, status: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  const parsed = z.enum(["yeni", "incelemede", "teklif-gonderildi", "kazanildi", "kaybedildi"]).safeParse(status);
  if (!parsed.success) return { ok: false, error: "Geçersiz durum." };

  await prisma.offer.update({ where: { id: offerId }, data: { status: parsed.data } });
  await log(auth.user.id, "offer.status_changed", "Offer", offerId, { status: parsed.data });

  revalidatePath("/yonetim/teklifler");
  revalidatePath("/admin/teklifler");
  revalidatePath(`/yonetim/teklifler/${offerId}`);
  revalidatePath(`/admin/teklifler/${offerId}`);
  return { ok: true, message: "Teklif durumu güncellendi." };
}

export async function updateOfferAmount(offerId: string, amount: number | null): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.offer.update({ where: { id: offerId }, data: { amount } });
  await log(auth.user.id, "offer.amount_updated", "Offer", offerId, { amount });

  revalidatePath("/yonetim/teklifler");
  revalidatePath("/admin/teklifler");
  revalidatePath(`/yonetim/teklifler/${offerId}`);
  revalidatePath(`/admin/teklifler/${offerId}`);
  return { ok: true, message: "Teklif tutarı güncellendi." };
}

export async function deleteOffer(offerId: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.offer.delete({ where: { id: offerId } });
  await log(auth.user.id, "offer.deleted", "Offer", offerId, {});

  revalidatePath("/yonetim/teklifler");
  revalidatePath("/admin/teklifler");
  return { ok: true, message: "Teklif talebi silindi." };
}

/* -------------------------------------------------------- Form Mesajları */

export async function markContactMessageRead(messageId: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.contactMessage.update({ where: { id: messageId }, data: { isRead: true } });
  revalidatePath("/yonetim/formlar");
  revalidatePath("/admin/formlar");
  return { ok: true, message: "Mesaj okundu olarak işaretlendi." };
}

export async function toggleContactMessageRead(messageId: string, isRead: boolean): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.contactMessage.update({ where: { id: messageId }, data: { isRead } });
  revalidatePath("/yonetim/formlar");
  revalidatePath("/admin/formlar");
  return { ok: true, message: isRead ? "Mesaj okundu olarak işaretlendi." : "Mesaj okunmadı olarak işaretlendi." };
}

export async function markAllContactMessagesRead(): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.contactMessage.updateMany({ where: { isRead: false }, data: { isRead: true } });
  revalidatePath("/yonetim/formlar");
  revalidatePath("/admin/formlar");
  return { ok: true, message: "Tüm mesajlar okundu olarak işaretlendi." };
}

export async function deleteContactMessage(messageId: string): Promise<ActionResult> {
  const auth = await requireStaff("orders.read");
  if (!auth.ok) return auth;

  await prisma.contactMessage.delete({ where: { id: messageId } });
  revalidatePath("/yonetim/formlar");
  revalidatePath("/admin/formlar");
  return { ok: true, message: "Mesaj silindi." };
}

/* -------------------------------------------------------- Sayfalar ve SSS */

const pageSchema = z.object({
  title: z.string().trim().min(2, "Sayfa başlığı en az 2 karakter olmalıdır.").max(140),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(140),
  group: z.string().trim().min(1, "Grup seçiniz.").default("yasal"),
  body: z.string().trim().min(5, "Sayfa içeriği boş bırakılamaz.").max(50000),
  metaTitle: z.string().trim().max(100).optional(),
  metaDescription: z.string().trim().max(200).optional(),
});

export async function createPage(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const parsed = pageSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const existing = await prisma.page.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (existing) return { ok: false, error: "Bu slug ile zaten bir sayfa mevcut." };

  const page = await prisma.page.create({
    data: {
      title: d.title,
      slug: d.slug,
      group: d.group,
      body: d.body,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });

  await log(auth.user.id, "page.created", "Page", page.id, { slug: d.slug });
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  revalidatePath(`/kurumsal/${d.slug}`);
  return { ok: true, message: "Sayfa başarıyla oluşturuldu." };
}

export async function updatePage(pageId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const existing = await prisma.page.findUnique({ where: { id: pageId } });
  if (!existing) return { ok: false, error: "Sayfa bulunamadı." };

  const parsed = pageSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  if (d.slug !== existing.slug) {
    const slugConflict = await prisma.page.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (slugConflict && slugConflict.id !== pageId) {
      return { ok: false, error: "Bu slug başka bir sayfada kullanılıyor." };
    }
  }

  await prisma.page.update({
    where: { id: pageId },
    data: {
      title: d.title,
      slug: d.slug,
      group: d.group,
      body: d.body,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
    },
  });

  await log(auth.user.id, "page.updated", "Page", pageId, { slug: d.slug });
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  revalidatePath(`/kurumsal/${existing.slug}`);
  revalidatePath(`/kurumsal/${d.slug}`);
  return { ok: true, message: "Sayfa başarıyla güncellendi." };
}

export async function deletePage(pageId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return { ok: false, error: "Sayfa bulunamadı." };

  await prisma.page.delete({ where: { id: pageId } });
  await log(auth.user.id, "page.deleted", "Page", pageId, { slug: page.slug });
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  return { ok: true, message: "Sayfa başarıyla silindi." };
}

const faqSchema = z.object({
  question: z.string().trim().min(3, "Soru en az 3 karakter olmalıdır.").max(300),
  answer: z.string().trim().min(3, "Cevap en az 3 karakter olmalıdır.").max(5000),
  category: z.string().trim().min(1, "Kategori seçiniz."),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createFaq(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const faq = await prisma.faq.create({
    data: {
      question: d.question,
      answer: d.answer,
      category: d.category,
      sortOrder: d.sortOrder,
    },
  });

  await log(auth.user.id, "faq.created", "Faq", faq.id);
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  revalidatePath("/sss");
  return { ok: true, message: "SSS sorusu eklendi." };
}

export async function updateFaq(faqId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const existing = await prisma.faq.findUnique({ where: { id: faqId } });
  if (!existing) return { ok: false, error: "Soru bulunamadı." };

  const parsed = faqSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  await prisma.faq.update({
    where: { id: faqId },
    data: {
      question: d.question,
      answer: d.answer,
      category: d.category,
      sortOrder: d.sortOrder,
    },
  });

  await log(auth.user.id, "faq.updated", "Faq", faqId);
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  revalidatePath("/sss");
  return { ok: true, message: "SSS sorusu güncellendi." };
}

export async function deleteFaq(faqId: string): Promise<ActionResult> {
  const auth = await requireStaff("blog.write");
  if (!auth.ok) return auth;

  const faq = await prisma.faq.findUnique({ where: { id: faqId } });
  if (!faq) return { ok: false, error: "Soru bulunamadı." };

  await prisma.faq.delete({ where: { id: faqId } });
  await log(auth.user.id, "faq.deleted", "Faq", faqId);
  revalidatePath("/yonetim/sayfalar");
  revalidatePath("/admin/sayfalar");
  revalidatePath("/sss");
  return { ok: true, message: "SSS sorusu silindi." };
}

/* ----------------------------------------------------------- Ek Hizmetler */

const addOnServiceSchema = z.object({
  name: z.string().trim().min(2, "Hizmet adı giriniz.").max(140),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir.").max(140),
  description: z.string().trim().min(5, "Açıklama giriniz.").max(1000),
  price: z.coerce.number().min(0, "Fiyat 0 veya daha büyük olmalıdır."),
  extraDays: z.coerce.number().int().min(0).default(0),
  group: z.enum(["kurulum", "icerik", "entegrasyon", "yayin", "destek"]),
  isActive: z.union([z.literal("on"), z.undefined()]).optional(),
  image: z.string().trim().optional(),
  gallery: z.string().trim().optional(),
});

export async function createAddOnService(formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const parsed = addOnServiceSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  const slugConflict = await prisma.addOnService.findUnique({ where: { slug: d.slug }, select: { id: true } });
  if (slugConflict) return { ok: false, error: "Bu slug ile zaten bir ek hizmet tanımlı." };

  const addOn = await prisma.addOnService.create({
    data: {
      name: d.name,
      slug: d.slug,
      description: d.description,
      price: Math.round(d.price * 100),
      extraDays: d.extraDays,
      group: d.group,
      isActive: d.isActive === "on",
    },
  });

  const galleryImages = (d.gallery || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const media = {
    image: d.image || "/gorseller/ajans/hizmet-web.svg",
    gallery: galleryImages,
  };
  saveAddOnMedia(addOn.id, media);
  saveAddOnMedia(d.slug, media);

  await log(auth.user.id, "addon.created", "AddOnService", addOn.id, { slug: d.slug });
  revalidatePath("/yonetim/ek-hizmetler");
  revalidatePath("/admin/ek-hizmetler");
  return { ok: true, message: "Ek hizmet başarıyla oluşturuldu." };
}

export async function updateAddOnService(addOnId: string, formData: FormData): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const existing = await prisma.addOnService.findUnique({ where: { id: addOnId } });
  if (!existing) return { ok: false, error: "Ek hizmet bulunamadı." };

  const parsed = addOnServiceSchema.safeParse(entriesWithAutoSlug(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  if (d.slug !== existing.slug) {
    const slugConflict = await prisma.addOnService.findUnique({ where: { slug: d.slug }, select: { id: true } });
    if (slugConflict && slugConflict.id !== addOnId) {
      return { ok: false, error: "Bu slug başka bir ek hizmette kullanılıyor." };
    }
  }

  await prisma.addOnService.update({
    where: { id: addOnId },
    data: {
      name: d.name,
      slug: d.slug,
      description: d.description,
      price: Math.round(d.price * 100),
      extraDays: d.extraDays,
      group: d.group,
      isActive: d.isActive === "on",
    },
  });

  const galleryImages = (d.gallery || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const media = {
    image: d.image || "/gorseller/ajans/hizmet-web.svg",
    gallery: galleryImages,
  };
  saveAddOnMedia(addOnId, media);
  saveAddOnMedia(d.slug, media);
  if (existing.slug !== d.slug) {
    saveAddOnMedia(existing.slug, media);
  }

  await log(auth.user.id, "addon.updated", "AddOnService", addOnId, { slug: d.slug });
  revalidatePath("/yonetim/ek-hizmetler");
  revalidatePath("/admin/ek-hizmetler");
  return { ok: true, message: "Ek hizmet güncellendi." };
}

export async function toggleAddOnService(addOnId: string): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const addOn = await prisma.addOnService.findUnique({ where: { id: addOnId } });
  if (!addOn) return { ok: false, error: "Ek hizmet bulunamadı." };

  await prisma.addOnService.update({
    where: { id: addOnId },
    data: { isActive: !addOn.isActive },
  });

  await log(auth.user.id, "addon.toggled", "AddOnService", addOnId, { isActive: !addOn.isActive });
  revalidatePath("/yonetim/ek-hizmetler");
  revalidatePath("/admin/ek-hizmetler");
  return { ok: true, message: addOn.isActive ? "Ek hizmet pasifleştirildi." : "Ek hizmet aktifleştirildi." };
}

export async function deleteAddOnService(addOnId: string): Promise<ActionResult> {
  const auth = await requireStaff("products.write");
  if (!auth.ok) return auth;

  const addOn = await prisma.addOnService.findUnique({ where: { id: addOnId } });
  if (!addOn) return { ok: false, error: "Ek hizmet bulunamadı." };

  await prisma.addOnService.delete({ where: { id: addOnId } });
  deleteAddOnMedia(addOnId);
  deleteAddOnMedia(addOn.slug);

  await log(auth.user.id, "addon.deleted", "AddOnService", addOnId);
  revalidatePath("/yonetim/ek-hizmetler");
  revalidatePath("/admin/ek-hizmetler");
  return { ok: true, message: "Ek hizmet silindi." };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
