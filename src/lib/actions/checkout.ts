"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { calculateTotals, getCart, lineTotal } from "@/lib/cart";
import { getPaymentProvider } from "@/lib/providers";
import { SITE } from "@/lib/constants";

const checkoutSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz."),
    fullName: z.string().trim().min(3, "Ad soyad giriniz.").max(120),
    phone: z.string().trim().min(10, "Telefon numarası giriniz.").max(30),
    customerType: z.enum(["bireysel", "kurumsal"]),
    companyName: z.string().trim().max(160).optional().or(z.literal("")),
    taxOffice: z.string().trim().max(120).optional().or(z.literal("")),
    taxNumber: z.string().trim().max(20).optional().or(z.literal("")),
    billingCity: z.string().trim().min(2, "İl giriniz.").max(60),
    billingDistrict: z.string().trim().min(2, "İlçe giriniz.").max(60),
    billingLine1: z.string().trim().min(5, "Adres giriniz.").max(300),
    paymentMethod: z.enum(["kart", "havale"]),
    note: z.string().trim().max(1000).optional().or(z.literal("")),
    terms: z.literal("on", { message: "Sözleşmeleri onaylamanız gerekiyor." }),
    distanceSales: z.literal("on", { message: "Mesafeli satış sözleşmesini onaylamanız gerekiyor." }),
  })
  .refine((d) => d.customerType !== "kurumsal" || (d.companyName && d.taxNumber), {
    message: "Kurumsal müşteriler için firma adı ve vergi numarası zorunludur.",
    path: ["companyName"],
  });

export type CheckoutResult = { ok: false; error: string } | { ok: true; redirectUrl: string };

/** Sipariş numarası: LZ-2026-000123 */
async function nextOrderNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count();
  return `LZ-${year}-${String(count + 1).padStart(6, "0")}`;
}

/**
 * Siparişi oluşturur ve ödeme oturumunu başlatır.
 * Tutarlar istemciden değil, sepetteki ürünlerin güncel fiyatlarından hesaplanır.
 */
export async function placeOrder(formData: FormData): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  const cart = await getCart();
  if (!cart || cart.items.length === 0) return { ok: false, error: "Sepetiniz boş." };

  const totals = calculateTotals(cart);
  if (totals.total <= 0) return { ok: false, error: "Sipariş tutarı hesaplanamadı." };

  const orderNumber = await nextOrderNumber();

  // Sipariş anındaki ürün adı, lisans adı ve fiyatlar kopyalanır; sonradan değişse bile fatura bozulmaz.
  const order = await prisma.order.create({
    data: {
      orderNumber,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      customerType: data.customerType,
      companyName: data.companyName || null,
      taxOffice: data.taxOffice || null,
      taxNumber: data.taxNumber || null,
      billingCity: data.billingCity,
      billingDistrict: data.billingDistrict,
      billingLine1: data.billingLine1,
      subtotal: totals.subtotal,
      discount: totals.discount,
      vatTotal: totals.vatTotal,
      total: totals.total,
      couponId: totals.couponCode ? cart.couponId : null,
      estimatedDays: totals.estimatedDays,
      note: data.note || null,
      status: "bekliyor",
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          licenseId: item.licenseId,
          productName: item.product.name,
          licenseName: item.license.name,
          unitPrice: item.product.basePrice + item.license.priceDelta,
          quantity: item.quantity,
          addOnTotal: item.addOns.reduce((s, a) => s + a.addOn.price, 0) * item.quantity,
          lineTotal: lineTotal(item),
          addOns: {
            create: item.addOns.map((a) => ({
              addOnId: a.addOnId,
              name: a.addOn.name,
              price: a.addOn.price,
            })),
          },
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "order.created",
      entity: "Order",
      entityId: order.id,
      meta: JSON.stringify({ orderNumber, total: order.total, paymentMethod: data.paymentMethod }),
    },
  });

  // Sipariş oluştuğu anda sepet boşaltılır; ödeme yarıda kalırsa müşteri
  // Hesabım > Siparişlerim üzerinden ödemeyi tamamlayabilir.
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });

  // Havale/EFT: ödeme kaydı beklemede açılır, müşteri talimat sayfasına yönlendirilir.
  if (data.paymentMethod === "havale") {
    await prisma.payment.create({
      data: { orderId: order.id, provider: "havale", status: "beklemede", amount: order.total },
    });
    return { ok: true, redirectUrl: `/siparis/${order.orderNumber}/havale` };
  }

  const provider = getPaymentProvider();
  const session = await provider.init({
    orderId: order.id,
    orderNumber: order.orderNumber,
    amount: order.total,
    email: order.email,
    fullName: order.fullName,
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url}/api/odeme/webhook`,
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: provider.name,
      status: "beklemede",
      amount: order.total,
      providerRef: session.providerRef,
    },
  });

  return { ok: true, redirectUrl: session.redirectUrl };
}

/** Ödeme sayfasından gelen form gönderimini işleyip yönlendirir. */
export async function submitCheckout(formData: FormData) {
  const result = await placeOrder(formData);
  if (!result.ok) {
    redirect(`/odeme?hata=${encodeURIComponent(result.error)}`);
  }
  redirect(result.redirectUrl);
}

/**
 * Ödeme başarıyla doğrulandığında çağrılır:
 * sipariş durumunu günceller, lisans anahtarlarını ve indirme izinlerini oluşturur.
 * Aynı ödeme iki kez bildirilirse (webhook tekrarı) işlem tekrarlanmaz.
 */
export async function fulfillOrder(orderId: string, providerRef: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { include: { files: true } }, license: true } } },
  });
  if (!order) throw new Error("Sipariş bulunamadı.");
  if (order.status !== "bekliyor") return order; // zaten işlenmiş

  const user = await prisma.user.findUnique({ where: { email: order.email } });

  const downloadDays = Number(process.env.DOWNLOAD_LINK_DAYS ?? 30);
  const downloadLimit = Number(process.env.DOWNLOAD_MAX_COUNT ?? 5);
  const expiresAt = new Date(Date.now() + downloadDays * 24 * 3600 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "odendi", userId: user?.id ?? null },
    });
    await tx.payment.updateMany({
      where: { orderId: order.id, providerRef },
      data: { status: "basarili" },
    });

    // Fatura kaydı
    const invoiceCount = await tx.invoice.count();
    await tx.invoice.create({
      data: {
        orderId: order.id,
        number: `LZF-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(6, "0")}`,
        total: order.total,
        vatTotal: order.vatTotal,
      },
    });

    for (const item of order.items) {
      // Lisans anahtarı
      await tx.licenseKey.create({
        data: {
          key: generateLicenseKey(),
          orderId: order.id,
          productId: item.productId,
          userId: user?.id ?? null,
          licenseType: item.license.key,
          domainLimit: item.license.domainLimit,
          validUntil: new Date(Date.now() + item.license.updateMonths * 30 * 24 * 3600 * 1000),
        },
      });

      // İndirme izinleri — dosyalar herkese açık değildir, erişim bu kayıtla kontrol edilir.
      for (const file of item.product.files) {
        await tx.download.create({
          data: {
            orderId: order.id,
            userId: user?.id ?? null,
            fileId: file.id,
            maxCount: downloadLimit,
            expiresAt,
          },
        });
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { salesCount: { increment: item.quantity } },
      });
    }

    // Kurulum veya hizmet içeren siparişlerde proje kaydı açılır.
    const needsProject = order.items.some(
      (i) => i.addOnTotal > 0 || i.product.type === "service" || i.product.includesSetup,
    );
    if (needsProject && user) {
      const project = await tx.project.create({
        data: {
          code: `PRJ-${order.orderNumber.split("-").pop()}`,
          userId: user.id,
          orderId: order.id,
          title: order.items.map((i) => i.productName).join(", ").slice(0, 160),
          currentStage: "odeme-alindi",
        },
      });
      const { PROJECT_STAGES } = await import("@/lib/constants");
      await tx.projectStage.createMany({
        data: PROJECT_STAGES.map((s, i) => ({
          projectId: project.id,
          key: s.key,
          name: s.name,
          sortOrder: i,
          completedAt: i === 0 ? new Date() : null,
        })),
      });
    }

    if (order.couponId) {
      await tx.coupon.update({ where: { id: order.couponId }, data: { usedCount: { increment: 1 } } });
    }

    await tx.auditLog.create({
      data: {
        action: "order.paid",
        entity: "Order",
        entityId: order.id,
        meta: JSON.stringify({ orderNumber: order.orderNumber, providerRef }),
      },
    });
  });

  return order;
}

/** LZ-XXXX-XXXX-XXXX-XXXX biçiminde okunabilir lisans anahtarı üretir. */
function generateLicenseKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // karıştırılabilecek karakterler çıkarıldı
  const group = () =>
    Array.from({ length: 4 }, () => alphabet[crypto.randomInt(alphabet.length)]).join("");
  return `LZ-${group()}-${group()}-${group()}-${group()}`;
}
