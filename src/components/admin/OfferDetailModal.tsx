"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { updateOfferStatus, updateOfferAmount, deleteOffer } from "@/lib/actions/admin";
import {
  X,
  User,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Coins,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  Printer,
  CheckCircle2,
  FileText,
  ChevronRight,
  Tag,
  AlertCircle,
  Briefcase,
} from "lucide-react";

export type OfferDetailData = {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  answers: string;
  budget: string | null;
  message: string | null;
  status: string;
  amount: number | null;
  createdAt: string | Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  } | null;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; badge: string }
> = {
  yeni: {
    label: "Yeni Talep",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-500",
  },
  incelemede: {
    label: "İnceleniyor",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    badge: "bg-blue-500",
  },
  "teklif-gonderildi": {
    label: "Teklif Gönderildi",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    badge: "bg-purple-500",
  },
  kazanildi: {
    label: "Kazanıldı",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    badge: "bg-emerald-500",
  },
  kaybedildi: {
    label: "Kaybedildi",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    badge: "bg-rose-500",
  },
};

export function OfferDetailModal({
  offer,
  isOpen,
  onClose,
  onOfferUpdated,
}: {
  offer: OfferDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onOfferUpdated?: (offerId: string, updates: Partial<OfferDetailData>) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(offer?.status || "yeni");
  const [amountInput, setAmountInput] = useState<string>(
    offer?.amount ? String(offer.amount) : ""
  );
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (offer) {
      setCurrentStatus(offer.status);
      setAmountInput(offer.amount ? String(offer.amount) : "");
      setFeedback(null);
    }
  }, [offer]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !offer) return null;

  // Parse answers JSON safely
  let parsedInterests: string[] = [];
  let otherAnswers: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(offer.answers || "{}");
    if (parsed && typeof parsed === "object") {
      if (Array.isArray(parsed.interests)) {
        parsedInterests = parsed.interests as string[];
      }
      otherAnswers = { ...parsed };
      delete otherAnswers.interests;
    }
  } catch {
    // ignore
  }

  const cleanPhone = offer.phone ? offer.phone.replace(/[^0-9]/g, "") : "";
  const waPhone = cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone;

  const waOfferText = `Merhaba ${offer.fullName}, Lizart Dijital'den #${offer.code} kodlu özel proje teklif talebiniz hakkında iletişime geçiyorum.`;
  const waLink = cleanPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waOfferText)}` : "";

  const waProposalText = `Merhaba ${offer.fullName}, #${offer.code} kodlu proje teklif talebiniz için hazırladığımız özel teklif çalışması hakkında görüşmek isteriz.${
    offer.amount ? ` Belirlenen teklif tutarımız: ${formatPrice(offer.amount)}.` : ""
  }`;
  const waProposalLink = cleanPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waProposalText)}`
    : "";

  const statusStyle = STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
    badge: "bg-slate-500",
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    startTransition(async () => {
      const res = await updateOfferStatus(offer.id, newStatus);
      if (res.ok) {
        setFeedback("Teklif durumu başarıyla güncellendi.");
        onOfferUpdated?.(offer.id, { status: newStatus });
      } else {
        setFeedback(res.error || "Güncelleme başarısız.");
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const handleSaveAmount = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const num = amountInput.trim() ? parseInt(amountInput.replace(/[^0-9]/g, ""), 10) : null;
      const res = await updateOfferAmount(offer.id, num);
      if (res.ok) {
        setFeedback("Teklif tutarı başarıyla kaydedildi.");
        onOfferUpdated?.(offer.id, { amount: num });
      } else {
        setFeedback(res.error || "Tutar kaydedilemedi.");
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-[#1f7a68]">
                #{offer.code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Teklif kodunu kopyala"
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider",
                statusStyle.bg,
                statusStyle.text,
                statusStyle.border
              )}
            >
              <span className={cn("size-2 rounded-full", statusStyle.badge)} />
              {statusStyle.label}
            </span>

            {offer.company && (
              <span className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-black text-slate-700 flex items-center gap-1">
                <Building2 size={12} className="text-slate-500" />
                {offer.company}
              </span>
            )}

            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(offer.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Teklif Talebini Yazdır"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Yazdır</span>
            </button>

            <Link
              href={`/admin/teklifler/${offer.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Tam sayfada aç"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Tam Sayfa</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-xl bg-slate-200/80 text-slate-700 hover:bg-slate-300 hover:text-slate-900 transition"
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-bold text-emerald-900 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              {feedback}
            </span>
            <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Üst Bilgi Kartları: Müşteri & Bütçe & Tutar & Durum */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* 1. Müşteri & İletişim Kartı */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-950 font-black text-sm">
                    <div className="grid size-7 place-items-center rounded-lg bg-[#1f7a68]/10 text-[#1f7a68]">
                      <User size={15} />
                    </div>
                    Müşteri & İletişim
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">
                    {offer.company ? "Kurumsal" : "Bireysel"}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2">
                  <p className="text-base font-black text-slate-950">{offer.fullName}</p>
                  
                  {offer.company && (
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Building2 size={13} className="text-slate-400 shrink-0" />
                      {offer.company}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs font-bold text-slate-600 pt-1">
                    {offer.phone ? (
                      <a
                        href={`tel:${offer.phone}`}
                        className="flex items-center gap-2 hover:text-[#1f7a68] transition"
                      >
                        <Phone size={13} className="text-slate-400" />
                        {offer.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400">Telefon girilmedi</span>
                    )}

                    <a
                      href={`mailto:${offer.email}`}
                      className="flex items-center gap-2 hover:text-[#1f7a68] transition truncate"
                    >
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{offer.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Hızlı WhatsApp & Telefon Butonları */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400"
                  >
                    WhatsApp Yok
                  </button>
                )}

                {offer.phone && (
                  <a
                    href={`tel:${offer.phone}`}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Phone size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* 2. Müşteri Bütçesi & Teklif Tutarı */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-black text-sm">
                  <div className="grid size-7 place-items-center rounded-lg bg-amber-500/10 text-amber-700">
                    <Coins size={15} />
                  </div>
                  Bütçe & Belirlenen Teklif
                </div>

                <div className="mt-3.5 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                      Müşterinin Belirttiği Bütçe
                    </span>
                    <span className="inline-block rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900">
                      {offer.budget || "Belirtilmedi"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1">
                      Hazırlanan / Verilen Teklif
                    </span>
                    {offer.amount ? (
                      <p className="text-xl font-black text-[#1f7a68]">
                        {formatPrice(offer.amount)}
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-slate-400 italic">
                        Henüz teklif tutarı girilmedi
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tutar Belirleme / Düzenleme Formu */}
              <form onSubmit={handleSaveAmount} className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Teklif Tutarını Belirle (₺):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="Örn: 50000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-[#1f7a68] transition"
                  />
                  <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 rounded-xl bg-[#1f7a68] px-3 py-2 text-xs font-black text-white hover:bg-[#176956] transition shadow-xs disabled:opacity-50"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>

            {/* 3. Durum Yönetimi & Hızlı İletişim */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-black text-sm">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-700">
                    <Tag size={15} />
                  </div>
                  Teklif Süreci & Durum
                </div>

                <div className="mt-3.5 space-y-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Talebin Anlık Durumu:
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isPending}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-[#1f7a68] transition"
                    >
                      <option value="yeni">Yeni Talep</option>
                      <option value="incelemede">İnceleniyor</option>
                      <option value="teklif-gonderildi">Teklif Gönderildi</option>
                      <option value="kazanildi">Kazanıldı (Anlaşıldı)</option>
                      <option value="kaybedildi">Kaybedildi / İptal</option>
                    </select>
                  </div>

                  <p className="text-[11px] font-bold text-slate-500">
                    Durum değişikliği sistemde anında güncellenir ve audit log kayıtlarına işlenir.
                  </p>
                </div>
              </div>

              {/* WhatsApp Teklif Mesajı Butonu */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {waProposalLink ? (
                  <a
                    href={waProposalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
                  >
                    <MessageCircle size={15} />
                    WhatsApp'tan Teklif İlet
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400"
                  >
                    Telefon Kaydı Yok
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Talep Edilen Hizmetler & İhtiyaçlar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-950">Talep Edilen Hizmetler & Çözümler</h3>
                <p className="text-xs font-bold text-slate-500">
                  Müşterinin formda işaretlediği ilgi alanları ve talep ettiği modüller
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {parsedInterests.length} Hizmet
              </span>
            </div>

            {parsedInterests.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {parsedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-black text-emerald-900 shadow-xs"
                  >
                    <Sparkles size={13} className="text-emerald-600" />
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400 italic">
                Belirli bir hizmet kategorisi seçilmedi veya genel talep olarak iletildi.
              </p>
            )}

            {/* Varsa diğer anket yanıtları */}
            {Object.keys(otherAnswers).length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid gap-3 sm:grid-cols-2 text-xs">
                {Object.entries(otherAnswers).map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      {k}
                    </span>
                    <span className="font-bold text-slate-900">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Müşterinin Proje Mesajı & İstekleri */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <div className="grid size-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <FileText size={15} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">Müşterinin Proje Açıklaması & Notları</h3>
                <p className="text-xs font-bold text-slate-500">
                  Müşterinin ilettiği tam metin ve proje gereksinimleri
                </p>
              </div>
            </div>

            {offer.message ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {offer.message}
                </p>
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400 italic">
                Müşteri ek bir açıklama metni yazmadı.
              </p>
            )}
          </div>

          {/* Alt Hızlı İletişim Şeridi */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-950">Doğrudan İletişim & Teklif İletimi</p>
              <p className="text-xs font-bold text-slate-500">
                Müşteriye teklif dosyasını veya detayları WhatsApp hattı üzerinden hemen iletebilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
                >
                  <MessageCircle size={15} />
                  WhatsApp İle Görüş
                </a>
              )}

              <Link
                href={`/admin/teklifler/${offer.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                Tam Detay Sayfası
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-white px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
