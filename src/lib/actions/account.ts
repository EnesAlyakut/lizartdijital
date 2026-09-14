"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { getMailProvider } from "@/lib/providers";
import type { ActionResult } from "@/lib/actions/cart";

/* --------------------------------------------------------- Lisans domain */

const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(4, "Geçerli bir alan adı giriniz.")
  .max(253)
  .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, "Alan adı biçimi geçersiz (örn. ornek.com).");

/** Lisansa domain ekler. Yalnızca lisansın sahibi işlem yapabilir. */
export async function addLicenseDomain(licenseId: string, domain: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = domainSchema.safeParse(domain);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const license = await prisma.licenseKey.findFirst({ where: { id: licenseId, userId: user.id } });
  if (!license) return { ok: false, error: "Lisans bulunamadı." };
  if (!license.isActive) return { ok: false, error: "Bu lisans aktif değil." };

  const domains = safeArray(license.domains);
  if (domains.includes(parsed.data)) return { ok: false, error: "Bu alan adı zaten tanımlı." };
  if (domains.length >= license.domainLimit) {
    return { ok: false, error: "Lisansınızın domain hakkı doldu. Önce mevcut bir domaini kaldırın." };
  }

  await prisma.licenseKey.update({
    where: { id: license.id },
    data: { domains: JSON.stringify([...domains, parsed.data]) },
  });
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "license.domain_added",
      entity: "LicenseKey",
      entityId: license.id,
      meta: JSON.stringify({ domain: parsed.data }),
    },
  });

  revalidatePath("/hesabim/lisanslarim");
  return { ok: true, message: "Alan adı tanımlandı." };
}

export async function removeLicenseDomain(licenseId: string, domain: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const license = await prisma.licenseKey.findFirst({ where: { id: licenseId, userId: user.id } });
  if (!license) return { ok: false, error: "Lisans bulunamadı." };

  const domains = safeArray(license.domains).filter((d) => d !== domain);
  await prisma.licenseKey.update({ where: { id: license.id }, data: { domains: JSON.stringify(domains) } });

  revalidatePath("/hesabim/lisanslarim");
  return { ok: true, message: "Alan adı kaldırıldı." };
}

/* ------------------------------------------------------------ Hesap ayarları */

const profileSchema = z.object({
  fullName: z.string().trim().min(3, "Ad soyad giriniz.").max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  customerType: z.enum(["bireysel", "kurumsal"]),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  taxOffice: z.string().trim().max(120).optional().or(z.literal("")),
  taxNumber: z.string().trim().max(20).optional().or(z.literal("")),
});

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const d = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      fullName: d.fullName,
      phone: d.phone || null,
      customerType: d.customerType,
      companyName: d.companyName || null,
      taxOffice: d.taxOffice || null,
      taxNumber: d.taxNumber || null,
    },
  });

  revalidatePath("/hesabim/ayarlar");
  revalidatePath("/hesabim", "layout");
  return { ok: true, message: "Bilgileriniz güncellendi." };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifrenizi giriniz."),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalıdır.")
      .regex(/[a-zA-Z]/, "Şifre en az bir harf içermelidir.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermelidir."),
    newPasswordConfirm: z.string(),
  })
  .refine((d) => d.newPassword === d.newPasswordConfirm, {
    message: "Yeni şifreler eşleşmiyor.",
    path: ["newPasswordConfirm"],
  });

export async function changePassword(formData: FormData): Promise<ActionResult> {
  const current = await getCurrentUser();
  if (!current) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const user = await prisma.user.findUnique({ where: { id: current.id } });
  if (!user || !(await verifyPassword(parsed.data.currentPassword, user.passwordHash))) {
    return { ok: false, error: "Mevcut şifreniz hatalı." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });
  // Şifre değişince diğer oturumlar sonlandırılır.
  await prisma.session.deleteMany({ where: { userId: user.id } });

  return { ok: true, message: "Şifreniz güncellendi. Diğer cihazlardaki oturumlar kapatıldı." };
}

/* ---------------------------------------------------------------- Adresler */

const addressSchema = z.object({
  title: z.string().trim().min(2, "Adres başlığı giriniz.").max(60),
  fullName: z.string().trim().min(3, "Ad soyad giriniz.").max(120),
  phone: z.string().trim().min(10, "Telefon giriniz.").max(30),
  city: z.string().trim().min(2, "İl giriniz.").max(60),
  district: z.string().trim().min(2, "İlçe giriniz.").max(60),
  line1: z.string().trim().min(5, "Adres giriniz.").max(300),
  postalCode: z.string().trim().max(12).optional().or(z.literal("")),
});

export async function saveAddress(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const count = await prisma.address.count({ where: { userId: user.id } });
  await prisma.address.create({
    data: { ...parsed.data, postalCode: parsed.data.postalCode || null, userId: user.id, isDefault: count === 0 },
  });

  revalidatePath("/hesabim/adreslerim");
  return { ok: true, message: "Adres kaydedildi." };
}

export async function deleteAddress(addressId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
  if (!address) return { ok: false, error: "Adres bulunamadı." };

  await prisma.address.delete({ where: { id: address.id } });
  revalidatePath("/hesabim/adreslerim");
  return { ok: true, message: "Adres silindi." };
}

/* ------------------------------------------------------------ Destek talebi */

const ticketSchema = z.object({
  subject: z.string().trim().min(4, "Konu giriniz.").max(160),
  topic: z.enum(["kurulum", "lisans", "odeme", "teknik", "diger"]),
  body: z.string().trim().min(10, "Talebinizi biraz daha ayrıntılı yazınız.").max(4000),
});

export async function createTicket(formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = ticketSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const count = await prisma.supportTicket.count();
  const ticket = await prisma.supportTicket.create({
    data: {
      code: `DST-${String(count + 1).padStart(5, "0")}`,
      userId: user.id,
      subject: parsed.data.subject,
      topic: parsed.data.topic,
      messages: {
        create: { authorId: user.id, authorRole: "musteri", body: parsed.data.body },
      },
    },
  });

  await getMailProvider().send({
    to: process.env.SUPPORT_INBOX ?? "destek@lizartdijital.com",
    subject: `Yeni destek talebi ${ticket.code}: ${parsed.data.subject}`,
    html: `<p>${escapeHtml(user.fullName)} (${escapeHtml(user.email)}) yeni bir destek talebi oluşturdu.</p><p>${escapeHtml(parsed.data.body)}</p>`,
  });

  revalidatePath("/hesabim/destek");
  return { ok: true, message: `Talebiniz oluşturuldu. Takip numarası: ${ticket.code}` };
}

export async function replyToTicket(ticketId: string, body: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const trimmed = body.trim();
  if (trimmed.length < 2) return { ok: false, error: "Mesaj boş olamaz." };

  const ticket = await prisma.supportTicket.findFirst({ where: { id: ticketId, userId: user.id } });
  if (!ticket) return { ok: false, error: "Destek talebi bulunamadı." };
  if (ticket.status === "kapali") return { ok: false, error: "Bu talep kapatılmış." };

  await prisma.ticketMessage.create({
    data: { ticketId: ticket.id, authorId: user.id, authorRole: "musteri", body: trimmed.slice(0, 4000) },
  });
  await prisma.supportTicket.update({ where: { id: ticket.id }, data: { status: "acik" } });

  revalidatePath("/hesabim/destek");
  return { ok: true, message: "Mesajınız iletildi." };
}

/* -------------------------------------------------- Proje bilgi formu (brief) */

const briefSchema = z.object({
  domain: z.string().trim().max(253).optional().or(z.literal("")),
  hosting: z.string().trim().max(300).optional().or(z.literal("")),
  brandName: z.string().trim().max(160).optional().or(z.literal("")),
  brandColors: z.string().trim().max(160).optional().or(z.literal("")),
  contactInfo: z.string().trim().max(500).optional().or(z.literal("")),
  socialLinks: z.string().trim().max(500).optional().or(z.literal("")),
  contentNotes: z.string().trim().max(4000).optional().or(z.literal("")),
  specialRequests: z.string().trim().max(4000).optional().or(z.literal("")),
});

/** Kurulum içeren siparişlerde müşteriden alınan proje bilgileri. */
export async function saveProjectBrief(projectId: string, formData: FormData): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Bu işlem için giriş yapmalısınız." };

  const parsed = briefSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
  if (!project) return { ok: false, error: "Proje bulunamadı." };

  await prisma.project.update({
    where: { id: project.id },
    data: {
      briefData: JSON.stringify(parsed.data),
      // Bilgiler alındıysa proje bir sonraki aşamaya geçer.
      currentStage: project.currentStage === "bilgi-bekleniyor" ? "planlandi" : project.currentStage,
    },
  });

  await prisma.projectStage.updateMany({
    where: { projectId: project.id, key: "bilgi-bekleniyor" },
    data: { completedAt: new Date() },
  });

  revalidatePath("/hesabim/projelerim");
  return { ok: true, message: "Proje bilgileriniz kaydedildi. Ekibimiz süreci başlatacak." };
}

function safeArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
