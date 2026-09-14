"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getMailProvider } from "@/lib/providers";
import type { ActionResult } from "@/lib/actions/cart";

const emailSchema = z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi giriniz.").max(160);

/** Bülten aboneliği. Aynı adres tekrar gönderilirse kayıt yeniden etkinleştirilir. */
export async function subscribeToNewsletter(formData: FormData): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data },
    update: { isActive: true },
    create: { email: parsed.data, source: "site" },
  });

  revalidatePath("/admin/formlar");
  revalidatePath("/yonetim/formlar");

  return { ok: true, message: "Kaydınız alındı, teşekkürler." };
}

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Adınızı giriniz.").max(120),
  email: emailSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  department: z.enum(["satis", "destek", "proje", "kurumsal"], {
    message: "Departman seçiniz.",
  }),
  subject: z.string().trim().min(3, "Konu giriniz.").max(160),
  body: z.string().trim().min(10, "Mesajınızı biraz daha ayrıntılı yazınız.").max(4000),
  consent: z.literal("on", { message: "Devam etmek için aydınlatma metnini onaylayın." }),
});

const DEPARTMENT_LABELS: Record<string, string> = {
  satis: "Satış & Fiyatlandırma",
  destek: "Teknik Destek",
  proje: "Proje / Teklif",
  kurumsal: "Kurumsal / İş Birliği",
};

/** İletişim formu. Kayıt veritabanına yazılır ve info@lizartdijital.com adresine eksiksiz bildirim e-postası gönderilir. */
export async function submitContactForm(formData: FormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  // 1. Admin paneline kayıt (SQLite / PostgreSQL / MySQL)
  await prisma.contactMessage.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      department: data.department,
      subject: data.subject,
      body: data.body,
    },
  });

  // 2. info@lizartdijital.com adresine eksiksiz kurumsal e-posta bildirimi
  const targetEmail = process.env.CONTACT_INBOX?.trim() || "info@lizartdijital.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lizartdijital.com";
  const adminPanelUrl = `${siteUrl}/yonetim/formlar`;
  const submittedAt = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "long",
    timeStyle: "short",
  });

  const emailSubject = `Yeni İletişim Mesajı: ${data.subject} — ${data.fullName}`;

  const emailHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(emailSubject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Başlık Alanı -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b 0%,#047857 100%);padding:28px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#a7f3d0;margin-bottom:6px;">
                Lizart Dijital · Web İletişim Bildirimi
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;line-height:1.3;color:#ffffff;">
                Yeni İletişim Formu Mesajı Alındı
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#e2e8f0;">
                Bu mesaj doğrudan web sitesi iletişim sayfasından gönderilmiştir ve yönetim paneline kaydedilmiştir.
              </p>
            </td>
          </tr>

          <!-- Detaylar Tablosu -->
          <tr>
            <td style="padding:28px 32px 20px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;width:140px;font-size:13px;font-weight:700;color:#64748b;">Ad Soyad:</td>
                  <td style="padding:10px 0;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(data.fullName)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">E-posta:</td>
                  <td style="padding:10px 0;font-size:14px;color:#047857;font-weight:600;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color:#047857;text-decoration:none;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Telefon:</td>
                  <td style="padding:10px 0;font-size:14px;color:#0f172a;">
                    ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color:#0f172a;text-decoration:none;font-weight:600;">${escapeHtml(data.phone)}</a>` : '<span style="color:#94a3b8;font-style:italic;">Belirtilmedi</span>'}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Departman:</td>
                  <td style="padding:10px 0;font-size:14px;color:#0f172a;">
                    <span style="display:inline-block;padding:3px 10px;border-radius:12px;background-color:#ecfdf5;color:#065f46;font-weight:700;font-size:12px;">
                      ${DEPARTMENT_LABELS[data.department] ?? data.department}
                    </span>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Konu:</td>
                  <td style="padding:10px 0;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(data.subject)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Tarih / Saat:</td>
                  <td style="padding:10px 0;font-size:13px;color:#64748b;">${submittedAt}</td>
                </tr>
              </table>

              <!-- Mesaj Metni -->
              <div style="margin-top:24px;">
                <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;">İletilen Mesaj:</div>
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #059669;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${escapeHtml(data.body)}</div>
              </div>

              <!-- Hızlı Butonlar -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-top:28px;width:100%;">
                <tr>
                  <td align="center">
                    <a href="${adminPanelUrl}" style="display:inline-block;background-color:#047857;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;box-shadow:0 2px 6px rgba(4,120,87,0.3);">
                      Yönetim Panelinde Görüntüle ve Yanıtla
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alt Bilgi -->
          <tr>
            <td style="background-color:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
              Lizart Dijital İletişim Sistemi · Bu e-posta otomatik olarak <strong>${escapeHtml(targetEmail)}</strong> adresine iletilmiştir.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const emailText = `
YENİ İLETİŞİM FORMU MESAJI
------------------------------------
Ad Soyad: ${data.fullName}
E-posta: ${data.email}
Telefon: ${data.phone || "Belirtilmedi"}
Departman: ${DEPARTMENT_LABELS[data.department] ?? data.department}
Konu: ${data.subject}
Tarih: ${submittedAt}

MESAJ:
${data.body}

Yönetim Paneli: ${adminPanelUrl}
  `.trim();

  try {
    await getMailProvider().send({
      to: targetEmail,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });
  } catch (err) {
    console.error("Mail bildirim gönderim hatası (kayıt veritabanına başarıyla oluşturuldu):", err);
  }

  try {
    revalidatePath("/admin/formlar");
    revalidatePath("/yonetim/formlar");
    revalidatePath("/admin");
    revalidatePath("/yonetim");
  } catch {
    // Next.js request context check
  }

  return { ok: true, message: "Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız." };
}

const offerSchema = z.object({
  fullName: z.string().trim().min(2, "Adınızı giriniz.").max(120),
  email: emailSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  answers: z.string().max(8000).optional(),
});

/** Paket sihirbazından veya teklif sayfasından gelen özel teklif talebi. */
export async function createOffer(formData: FormData): Promise<ActionResult> {
  const parsed = offerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const data = parsed.data;

  // Teklif kodu: LZT-2026-4F2A
  const code = `LZT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  await prisma.offer.create({
    data: {
      code,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      budget: data.budget || null,
      message: data.message || null,
      answers: safeJson(data.answers),
    },
  });

  const targetEmail = process.env.CONTACT_INBOX?.trim() || "info@lizartdijital.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lizartdijital.com";
  const adminOfferUrl = `${siteUrl}/yonetim/teklifler`;
  const submittedAt = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "long",
    timeStyle: "short",
  });

  const offerSubject = `Yeni Teklif Talebi: #${code} — ${data.fullName}`;

  const offerHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(offerSubject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Başlık Alanı -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#0284c7 100%);padding:28px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#bae6fd;margin-bottom:6px;">
                Lizart Dijital · Teklif / Proje Talebi
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;line-height:1.3;color:#ffffff;">
                Yeni Teklif Talebi Alındı: ${code}
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#e2e8f0;">
                Müşteri teklif sihirbazı veya form üzerinden özel proje talebinde bulundu.
              </p>
            </td>
          </tr>

          <!-- Detaylar Tablosu -->
          <tr>
            <td style="padding:28px 32px 20px 32px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;width:140px;font-size:13px;font-weight:700;color:#64748b;">Teklif Kodu:</td>
                  <td style="padding:10px 0;font-size:15px;font-weight:800;color:#0284c7;">${code}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Ad Soyad:</td>
                  <td style="padding:10px 0;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(data.fullName)}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">E-posta:</td>
                  <td style="padding:10px 0;font-size:14px;color:#0284c7;font-weight:600;">
                    <a href="mailto:${escapeHtml(data.email)}" style="color:#0284c7;text-decoration:none;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Telefon:</td>
                  <td style="padding:10px 0;font-size:14px;color:#0f172a;">
                    ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="color:#0f172a;text-decoration:none;font-weight:600;">${escapeHtml(data.phone)}</a>` : '<span style="color:#94a3b8;font-style:italic;">Belirtilmedi</span>'}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Firma:</td>
                  <td style="padding:10px 0;font-size:14px;color:#0f172a;">${escapeHtml(data.company ?? "-")}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Bütçe:</td>
                  <td style="padding:10px 0;font-size:14px;font-weight:700;color:#0f172a;">${escapeHtml(data.budget ?? "-")}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;font-size:13px;font-weight:700;color:#64748b;">Tarih / Saat:</td>
                  <td style="padding:10px 0;font-size:13px;color:#64748b;">${submittedAt}</td>
                </tr>
              </table>

              ${data.message ? `
              <div style="margin-top:20px;">
                <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;">Müşteri Açıklaması:</div>
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
              </div>` : ""}

              ${data.answers && data.answers !== "{}" ? `
              <div style="margin-top:20px;">
                <div style="font-size:13px;font-weight:700;color:#475569;margin-bottom:8px;">Sihirbaz / Anket Seçimleri:</div>
                <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px;font-size:12px;line-height:1.5;color:#475569;font-family:monospace;white-space:pre-wrap;">${escapeHtml(data.answers)}</div>
              </div>` : ""}

              <!-- Buton -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin-top:28px;width:100%;">
                <tr>
                  <td align="center">
                    <a href="${adminOfferUrl}" style="display:inline-block;background-color:#0284c7;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;box-shadow:0 2px 6px rgba(2,132,199,0.3);">
                      Yönetim Panelinde Teklifi İncele
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alt Bilgi -->
          <tr>
            <td style="background-color:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
              Lizart Dijital Teklif Sistemi · Otomatik olarak <strong>${escapeHtml(targetEmail)}</strong> adresine yönlendirilmiştir.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    await getMailProvider().send({
      to: targetEmail,
      subject: offerSubject,
      html: offerHtml,
      text: `YENİ TEKLİF TALEBİ (${code})\nAd: ${data.fullName}\nE-posta: ${data.email}\nTelefon: ${data.phone || "-"}\nBütçe: ${data.budget || "-"}\nMesaj: ${data.message || "-"}\nDetay: ${adminOfferUrl}`,
    });
  } catch (err) {
    console.error("Mail bildirim gönderim hatası (teklif başarıyla oluşturuldu):", err);
  }

  try {
    revalidatePath("/admin/teklifler");
    revalidatePath("/yonetim/teklifler");
    revalidatePath("/admin");
    revalidatePath("/yonetim");
  } catch {
    // Next.js request context check
  }

  return { ok: true, message: `Talebiniz alındı. Teklif numaranız: ${code}` };
}

function safeJson(value?: string) {
  if (!value) return "{}";
  try {
    JSON.parse(value);
    return value;
  } catch {
    return "{}";
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
