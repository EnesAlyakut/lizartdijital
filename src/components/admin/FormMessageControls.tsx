"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteContactMessage,
  markAllContactMessagesRead,
  markContactMessageRead,
  toggleContactMessageRead,
} from "@/lib/actions/admin";
import { ActionButton } from "@/components/admin/ui";
import {
  Check,
  CheckCheck,
  Trash2,
  Mail,
  Phone,
  MessageCircle,
  ShoppingBag,
  AlertCircle,
  Calendar,
  User,
  ExternalLink,
  FileText,
  Search,
  Sparkles,
  X,
  Clock,
  Briefcase,
  Printer,
  Copy,
  ChevronRight,
  Eye,
} from "lucide-react";
import { formatDate, formatPrice } from "@/lib/utils";

export const DEPARTMENT_LABELS: Record<string, string> = {
  satis: "Satış & Fiyatlandırma",
  destek: "Teknik Destek & Sorun",
  proje: "Özel Proje & Geliştirme",
  kurumsal: "Kurumsal & İştirak",
  genel: "Genel İletişim",
};

const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  bekliyor: { label: "Ödeme Bekliyor", color: "bg-amber-100 text-amber-800" },
  odendi: { label: "Ödendi / Aktif", color: "bg-emerald-100 text-emerald-800" },
  hazirlaniyor: { label: "Hazırlanıyor", color: "bg-blue-100 text-blue-800" },
  teslim: { label: "Teslim Edildi", color: "bg-purple-100 text-purple-800" },
  iptal: { label: "İptal Edildi", color: "bg-slate-100 text-slate-700" },
  iade: { label: "İade Edildi", color: "bg-red-100 text-red-800" },
};

export type MessageWithRelations = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  department: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: Date | string;
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: Date | string;
    items: {
      id: string;
      productName: string;
      licenseName: string;
      quantity: number;
      lineTotal: number;
    }[];
  }[];
  offers: {
    id: string;
    code: string;
    budget: string | null;
    status: string;
    amount: number | null;
    message: string | null;
    createdAt: Date | string;
  }[];
};

export function MarkReadButton({
  messageId,
  onSuccess,
}: {
  messageId: string;
  onSuccess?: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={(e) => {
        e.stopPropagation();
        startTransition(async () => {
          await markContactMessageRead(messageId);
          onSuccess?.();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("admin_notifications_cleared"));
          }
        });
      }}
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition cursor-pointer"
    >
      <Check size={13} />
      {pending ? "Kaydediliyor…" : "Okundu İşaretle"}
    </button>
  );
}

export function MarkAllReadButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markAllContactMessagesRead();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("admin_notifications_cleared"));
          }
        })
      }
      className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition shadow-xs cursor-pointer"
    >
      <CheckCheck size={14} className="text-[#1f7a68]" />
      {pending ? "İşleniyor…" : "Tümünü Okundu İşaretle"}
    </button>
  );
}

export function DeleteMessageButton({
  messageId,
  onDeleted,
}: {
  messageId: string;
  onDeleted?: () => void;
}) {
  return (
    <ActionButton
      action={async () => {
        const res = await deleteContactMessage(messageId);
        if (res.ok) onDeleted?.();
        return res;
      }}
      label="Sil"
      pendingLabel="Siliniyor…"
      variant="danger"
      confirmText="Bu iletişim mesajı silinecek. Emin misiniz?"
    />
  );
}

/**
 * Gelen mesajları listeleme, arama, filtreleme ve
 * "Detaylı İncele" modalında müşterinin kim olduğu, talebi ve
 * ne aldığı/satın aldığı paketleri gösteren interaktif bileşen.
 */
export function MessagesListWithDetail({
  messages,
}: {
  messages: MessageWithRelations[];
}) {
  const [messageList, setMessageList] = useState<MessageWithRelations[]>(messages);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithRelations | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "hasOrders">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  // ESC key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedMessage(null);
    };
    if (selectedMessage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMessage]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleToggleRead = (id: string, currentRead: boolean) => {
    const newRead = !currentRead;
    startTransition(async () => {
      await toggleContactMessageRead(id, newRead);
      setMessageList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: newRead } : m))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: newRead } : null));
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("admin_notifications_cleared"));
      }
    });
  };

  const handleDeleteSuccess = (id: string) => {
    setMessageList((prev) => prev.filter((m) => m.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  };

  // Arama ve filtreleme mantığı
  const filteredMessages = messageList.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.phone && m.phone.includes(searchTerm)) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.body.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "unread") return !m.isRead;
    if (filterType === "hasOrders") return m.orders.length > 0;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* ─── Arama & Hızlı Filtre Çubuğu ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İsim, telefon, e-posta veya mesaj ara..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              filterType === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tümü ({messageList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("unread")}
            className={`rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              filterType === "unread"
                ? "bg-white text-rose-600 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Okunmamış ({messageList.filter((m) => !m.isRead).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("hasOrders")}
            className={`rounded-lg px-3 py-1.5 text-xs font-black transition cursor-pointer ${
              filterType === "hasOrders"
                ? "bg-[#1f7a68] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🛍️ Müşteriler ({messageList.filter((m) => m.orders.length > 0).length})
          </button>
        </div>
      </div>

      {/* ─── Mesaj Kartları ─── */}
      {filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
          <Mail size={36} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-black text-slate-700">Kayıt bulunamadı</p>
          <p className="text-xs text-slate-500">Arama veya filtre kriterlerinize uyan mesaj yok.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((m) => {
            const cleanPhone = m.phone ? m.phone.replace(/[^0-9]/g, "") : "";
            const waPhone = cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone;
            const waLink = cleanPhone
              ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
                  `Merhaba ${m.fullName}, Lizart Dijital iletişim formundan gönderdiğiniz "${m.subject}" konulu mesajınız hakkında iletişime geçiyorum.`
                )}`
              : null;

            const hasOrders = m.orders.length > 0;
            const latestPurchasedItem = hasOrders ? m.orders[0]?.items[0]?.productName : null;

            return (
              <article
                key={m.id}
                onClick={() => setSelectedMessage(m)}
                className={`rounded-2xl border p-5 transition hover:shadow-md cursor-pointer ${
                  !m.isRead
                    ? "border-emerald-300 bg-emerald-50/30 shadow-xs"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Başlık ve Rozetler */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-950 hover:text-[#1f7a68] transition">
                        {m.subject}
                      </h3>

                      {!m.isRead ? (
                        <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-black text-white">
                          Yeni Mesaj
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          Okundu
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                        {DEPARTMENT_LABELS[m.department] ?? m.department}
                      </span>

                      {/* Ne Aldığı / Sipariş Rozeti */}
                      {hasOrders ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-900 border border-emerald-200">
                          <ShoppingBag size={12} className="text-[#1f7a68]" />
                          <span>Aldığı: {latestPurchasedItem || "Paket"} ({m.orders.length} sipariş)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400">
                          Siparişi yok (Aday Müşteri)
                        </span>
                      )}
                    </div>

                    {/* Müşteri Kimlik Satırı */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="text-slate-950 font-black text-sm">{m.fullName}</span>
                      <span>·</span>
                      <a
                        href={`mailto:${m.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-[#1f7a68] hover:underline"
                      >
                        ✉️ {m.email}
                      </a>
                      {m.phone && (
                        <>
                          <span>·</span>
                          <a
                            href={`tel:${m.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-slate-900 hover:text-[#1f7a68] hover:underline"
                          >
                            📞 {m.phone}
                          </a>
                        </>
                      )}
                      <span>·</span>
                      <span className="text-slate-400 font-medium">
                        🕒 {formatDate(m.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Sağ Aksiyonlar */}
                  <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(m)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-[#176956] transition cursor-pointer"
                    >
                      <Eye size={13} />
                      Detaylı İncele
                    </button>
                    {!m.isRead ? (
                      <MarkReadButton
                        messageId={m.id}
                        onSuccess={() => handleToggleRead(m.id, false)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleRead(m.id, true)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        Okunmadı Yap
                      </button>
                    )}
                    <DeleteMessageButton
                      messageId={m.id}
                      onDeleted={() => handleDeleteSuccess(m.id)}
                    />
                  </div>
                </div>

                {/* Mesaj Özeti / İçerik */}
                <div className="mt-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs font-semibold leading-relaxed text-slate-900 line-clamp-2 hover:border-[#1f7a68]/40 transition">
                  {m.body}
                </div>

                {/* Hızlı İletişim Aksiyonları */}
                <div
                  className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-2xs"
                      >
                        <MessageCircle size={13} />
                        WhatsApp
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                      >
                        <Phone size={13} />
                        Ara
                      </a>
                    )}
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                    >
                      <Mail size={13} />
                      E-posta
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMessage(m)}
                    className="text-xs font-black text-[#1f7a68] hover:underline cursor-pointer"
                  >
                    Tüm Detayları Gör →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ─── DETAYLI İNCELEME MODALI ─── */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
          {/* Backdrop with click to close */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedMessage(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#1f7a68]/10 text-[#1f7a68]">
                    <FileText size={18} />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">
                      {selectedMessage.subject}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Gelen Form Mesajı Detayı & Müşteri Geçmişi
                    </p>
                  </div>
                </div>

                {!selectedMessage.isRead ? (
                  <span className="rounded-full bg-rose-500 px-3 py-0.5 text-xs font-black text-white">
                    Yeni Mesaj
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-3 py-0.5 text-xs font-bold text-slate-700">
                    Okundu
                  </span>
                )}

                <span className="rounded-full bg-[#1f7a68]/10 px-3 py-0.5 text-xs font-black text-[#1f7a68]">
                  {DEPARTMENT_LABELS[selectedMessage.department] ?? selectedMessage.department}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 sm:mt-0">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
                  title="Mesajı Yazdır"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Yazdır</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="grid size-9 place-items-center rounded-xl bg-slate-200/80 text-slate-700 hover:bg-slate-300 hover:text-slate-900 transition cursor-pointer"
                  aria-label="Kapat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">

              {/* 1. Müşteri Kimlik ve İletişim Kartı */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <User size={15} className="text-[#1f7a68]" />
                    Müşteri İletişim Bilgileri
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Clock size={13} />
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {/* İsim Soyisim */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400">İsim Soyisim:</span>
                    <p className="mt-0.5 text-base font-black text-slate-950">
                      {selectedMessage.fullName}
                    </p>
                  </div>

                  {/* Telefon Numarası */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">Telefon:</span>
                      {selectedMessage.phone && (
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMessage.phone!, "phone")}
                          className="text-[10px] text-[#1f7a68] font-bold hover:underline inline-flex items-center gap-0.5"
                        >
                          {copiedField === "phone" ? <Check size={10} /> : <Copy size={10} />}
                          {copiedField === "phone" ? "Kopyalandı" : "Kopyala"}
                        </button>
                      )}
                    </div>
                    {selectedMessage.phone ? (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="mt-0.5 font-mono text-sm font-black text-slate-950 hover:text-[#1f7a68] block"
                      >
                        {selectedMessage.phone}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm text-slate-400">Telefon girilmedi</p>
                    )}
                  </div>

                  {/* E-posta Adresi */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">E-posta:</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedMessage.email, "email")}
                        className="text-[10px] text-[#1f7a68] font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        {copiedField === "email" ? <Check size={10} /> : <Copy size={10} />}
                        {copiedField === "email" ? "Kopyalandı" : "Kopyala"}
                      </button>
                    </div>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="mt-0.5 text-sm font-bold text-slate-900 break-all hover:text-[#1f7a68] block"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {/* Hızlı İletişim Butonları */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap gap-2">
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${
                        selectedMessage.phone.replace(/[^0-9]/g, "").startsWith("0")
                          ? "9" + selectedMessage.phone.replace(/[^0-9]/g, "")
                          : selectedMessage.phone.replace(/[^0-9]/g, "")
                      }?text=${encodeURIComponent(
                        `Merhaba ${selectedMessage.fullName}, Lizart Dijital'den "${selectedMessage.subject}" konulu form mesajınız için ulaşıyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
                    >
                      <MessageCircle size={14} />
                      WhatsApp&apos;tan Yanıtla
                    </a>
                  )}

                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                    >
                      <Phone size={14} />
                      Telefonla Ara
                    </a>
                  )}

                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: ${selectedMessage.subject}`
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                  >
                    <Mail size={14} />
                    E-posta ile Yanıtla
                  </a>
                </div>
              </div>

              {/* 2. Ne Sorunu Olduğu / Talep ve Mesaj İçeriği */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <AlertCircle size={16} className="text-[#1f7a68]" />
                    Mesajın Konusu & Detaylı İçeriği
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMessage.body, "body")}
                    className="text-xs text-[#1f7a68] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    {copiedField === "body" ? <Check size={12} /> : <Copy size={12} />}
                    {copiedField === "body" ? "Metin Kopyalandı" : "Mesaj Metnini Kopyala"}
                  </button>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Konu Başlığı:</span>
                  <h4 className="text-base font-black text-slate-950 mt-1">
                    {selectedMessage.subject}
                  </h4>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tam Mesaj Metni:</span>
                  <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-semibold leading-relaxed text-slate-900 whitespace-pre-line shadow-2xs">
                    {selectedMessage.body}
                  </div>
                </div>
              </div>

              {/* 3. Ne Aldığı / Satın Alma ve Sipariş Bilgileri */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <ShoppingBag size={15} className="text-[#1f7a68]" />
                    Müşterinin Satın Aldığı Paketler & Sipariş Durumu
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedMessage.orders.length} Sipariş Kayıtlı
                  </span>
                </div>

                {selectedMessage.orders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMessage.orders.map((order) => {
                      const statusInfo = ORDER_STATUS_LABELS[order.status] ?? {
                        label: order.status,
                        color: "bg-slate-100 text-slate-700",
                      };
                      return (
                        <div
                          key={order.id}
                          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Link
                              href={`/admin/siparisler/${order.id}`}
                              target="_blank"
                              className="font-mono text-xs font-black text-[#1f7a68] hover:underline flex items-center gap-1"
                            >
                              #{order.orderNumber}
                              <ExternalLink size={11} />
                            </Link>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-xs font-black ${statusInfo.color}`}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-sm font-black text-[#1f7a68]">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 space-y-1.5 border-t border-slate-200/60 pt-2">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-xs font-bold text-slate-800"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span>📦 {item.productName}</span>
                                  {item.licenseName && (
                                    <span className="text-[11px] text-slate-500">
                                      ({item.licenseName})
                                    </span>
                                  )}
                                </span>
                                <span className="text-slate-600 font-mono">
                                  {formatPrice(item.lineTotal)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                    <p className="text-xs font-black text-slate-700">
                      Bu müşterinin henüz tamamlanmış bir ürün/paket siparişi bulunmuyor.
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Ziyaretçi doğrudan iletişim formunu kullanarak bilgi veya teklif talep etmiştir.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Teklif Talepleri (Varsa) */}
              {selectedMessage.offers.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Briefcase size={15} className="text-[#1f7a68]" />
                      İlgili Teklif Talepleri ({selectedMessage.offers.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedMessage.offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold"
                      >
                        <Link
                          href={`/admin/teklifler/${offer.id}`}
                          target="_blank"
                          className="font-mono text-[#1f7a68] hover:underline flex items-center gap-1"
                        >
                          #{offer.code}
                          <ExternalLink size={11} />
                        </Link>
                        {offer.budget && (
                          <span className="text-slate-600">Bütçe: {offer.budget}</span>
                        )}
                        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-black uppercase">
                          {offer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Aksiyonlar) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-black transition cursor-pointer ${
                    selectedMessage.isRead
                      ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      : "border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  <Check size={14} />
                  {selectedMessage.isRead ? "Okunmadı Olarak İşaretle" : "Okundu Olarak İşaretle"}
                </button>

                <DeleteMessageButton
                  messageId={selectedMessage.id}
                  onDeleted={() => handleDeleteSuccess(selectedMessage.id)}
                />
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-black text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
