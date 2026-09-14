import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  DeleteOfferButton,
  OfferAmountForm,
  OfferStatusControl,
  OFFER_STATUSES,
} from "@/components/admin/OfferControls";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Sparkles,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Teklif Talebi Detayı | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const offer = await prisma.offer.findFirst({
    where: {
      OR: [{ id }, { code: id }],
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
  });

  if (!offer) {
    notFound();
  }

  const answers = safeAnswers(offer.answers);
  const interests: string[] = Array.isArray(answers.interests)
    ? (answers.interests as string[])
    : [];

  const cleanPhone = offer.phone ? offer.phone.replace(/[^0-9]/g, "") : "";
  const waPhone = cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone;
  const waLink = cleanPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
        `Merhaba ${offer.fullName}, Lizart Dijital'den #${offer.code} kodlu özel proje teklif talebiniz hakkında iletişime geçiyorum.`
      )}`
    : "";

  const statusLabel =
    OFFER_STATUSES.find((s) => s.value === offer.status)?.label || offer.status;

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    yeni: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    incelemede: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
    "teklif-gonderildi": { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
    kazanildi: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
    kaybedildi: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  };

  const statusStyle = statusColors[offer.status] || {
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
  };

  return (
    <div className="space-y-8">
      {/* ─── Geri Dön & Üst Bilgi ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/teklifler"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68]"
        >
          <ArrowLeft size={16} />
          Teklif Taleplerine Dön
        </Link>

        <div className="flex items-center gap-2">
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
            >
              <MessageCircle size={14} />
              WhatsApp'tan Yanıtla
            </a>
          )}
        </div>
      </div>

      {/* ─── Teklif Başlık Kartı ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-black text-[#1f7a68] sm:text-3xl">
                #{offer.code}
              </span>
              <span
                className={`rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
              >
                {statusLabel}
              </span>
              {offer.company && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                  {offer.company}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                Talep Tarihi: {formatDate(offer.createdAt)}
              </span>
              {offer.budget && (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <Coins size={14} />
                  Müşteri Bütçesi: {offer.budget}
                </span>
              )}
            </div>
          </div>

          {/* Durum Değiştirici */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Teklif Durumu
            </span>
            <OfferStatusControl offerId={offer.id} status={offer.status} />
          </div>
        </div>
      </section>

      {/* ─── Ana İçerik Grid ─── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Sol / 2 Kolon: Proje Talepleri, Mesaj ve Bütçe ─── */}
        <div className="space-y-8 lg:col-span-2">
          {/* Müşteri Mesajı ve Proje Açıklaması */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
              <MessageSquare size={20} className="text-[#1f7a68]" />
              <h2 className="text-xl font-black text-slate-950">Müşterinin Proje Talebi & Açıklaması</h2>
            </div>

            {offer.message ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm font-semibold leading-relaxed text-slate-900 whitespace-pre-line">
                {offer.message}
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-400 italic">
                Ek bir mesaj veya açıklama girilmedi.
              </p>
            )}
          </div>

          {/* İlgilendiği Hizmetler */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
              <Briefcase size={20} className="text-[#1f7a68]" />
              <h2 className="text-xl font-black text-slate-950">Talep Edilen Hizmetler & Çözümler</h2>
            </div>

            {interests.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-black text-slate-900 shadow-xs"
                  >
                    <Sparkles size={16} className="text-[#1f7a68] shrink-0" />
                    <span>{interest}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-slate-400 italic">
                Hizmet seçimi belirtilmemiş.
              </p>
            )}
          </div>

          {/* ─── Bütçe & Teklif Tutarı Belirleme Kartı ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
              <Coins size={20} className="text-[#1f7a68]" />
              <h2 className="text-xl font-black text-slate-950">Bütçe & Teklif Tutarı</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-amber-800">
                  Müşterinin Belirttiği Bütçe
                </p>
                <p className="mt-1 text-xl font-black text-amber-950">
                  {offer.budget || "Belirtilmedi"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Belirlenen Teklif Tutarı
                </p>
                <p className="mt-1 text-xl font-black text-[#1f7a68]">
                  {offer.amount ? formatPrice(offer.amount) : "Henüz Belirlenmedi"}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Teklif Tutarını Belirle veya Güncelle:
              </p>
              <OfferAmountForm offerId={offer.id} currentAmount={offer.amount} />
            </div>
          </div>
        </div>

        {/* ─── Sağ / 1 Kolon: Müşteri Bilgisi & İşlemler ─── */}
        <div className="space-y-8">
          {/* Müşteri Kartı */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="grid size-10 place-items-center rounded-xl bg-[#1f7a68]/10 text-[#1f7a68]">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">Müşteri & Yetkili</h2>
                <p className="text-xs font-bold text-slate-500">İletişim ve firma bilgisi</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-lg font-black text-slate-950">{offer.fullName}</p>
                {offer.company && (
                  <p className="mt-0.5 text-xs font-bold text-slate-600 inline-flex items-center gap-1.5">
                    <Building2 size={13} className="text-slate-400" />
                    {offer.company}
                  </p>
                )}
                {offer.user && (
                  <span className="mt-1.5 block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    Sistemde Kayıtlı Kullanıcı
                  </span>
                )}
              </div>

              {/* Hızlı Aksiyon Butonları */}
              <div className="space-y-2 pt-2">
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <MessageCircle size={18} />
                    WhatsApp'tan Yaz
                  </a>
                )}

                {offer.phone && (
                  <a
                    href={`tel:${offer.phone}`}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                  >
                    <Phone size={16} />
                    {offer.phone}
                  </a>
                )}

                <a
                  href={`mailto:${offer.email}?subject=${encodeURIComponent(
                    `Lizart Dijital — #${offer.code} Numaralı Proje Teklifiniz`
                  )}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:border-[#1f7a68] hover:text-[#1f7a68] transition truncate"
                >
                  <Mail size={16} className="shrink-0" />
                  <span className="truncate">{offer.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* ─── Süreç & Durum İlerlemesi ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <h2 className="text-base font-black text-slate-950 mb-4 border-b border-slate-100 pb-3">
              Teklif Aşaması
            </h2>

            <div className="space-y-3 text-xs font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <CheckCircle2 size={16} />
                <span>1. Talep Alındı</span>
              </div>
              <div
                className={`flex items-center gap-2.5 ${
                  offer.status !== "yeni" ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                <CheckCircle2 size={16} />
                <span>2. Ön İnceleme Yapıldı</span>
              </div>
              <div
                className={`flex items-center gap-2.5 ${
                  offer.status === "teklif-gonderildi" || offer.status === "kazanildi"
                    ? "text-emerald-700"
                    : "text-slate-400"
                }`}
              >
                <CheckCircle2 size={16} />
                <span>3. Teklif Müşteriye İletildi</span>
              </div>
              <div
                className={`flex items-center gap-2.5 ${
                  offer.status === "kazanildi"
                    ? "text-emerald-700"
                    : offer.status === "kaybedildi"
                      ? "text-rose-700"
                      : "text-slate-400"
                }`}
              >
                <CheckCircle2 size={16} />
                <span>
                  {offer.status === "kazanildi"
                    ? "4. Anlaşma Sağlandı (Kazanıldı)"
                    : offer.status === "kaybedildi"
                      ? "4. Teklif Reddedildi (Kaybedildi)"
                      : "4. Anlaşma & Proje Başlangıcı"}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Yönetimsel Aksiyonlar ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <h2 className="text-base font-black text-slate-950 mb-3">Talebi Yönet</h2>
            <p className="text-xs font-bold text-slate-500 mb-4">
              Geçersiz veya test amaçlı gönderilen teklif taleplerini silebilirsiniz.
            </p>
            <DeleteOfferButton offerId={offer.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function safeAnswers(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
