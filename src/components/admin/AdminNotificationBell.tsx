"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Package,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import {
  playLoudBellChime,
  requestNotificationPermission,
  sendDesktopNotification,
} from "@/lib/audioNotification";
import { formatDate, cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: "order" | "offer" | "message";
  title: string;
  sender: string;
  company?: string | null;
  details: string;
  meta?: string | null;
  status: string;
  isUnread: boolean;
  href: string;
  createdAt: string;
}

interface NotificationData {
  totalUnread: number;
  counts: {
    orders: number;
    offers: number;
    messages: number;
  };
  notifications: NotificationItem[];
}

export function AdminNotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "order" | "offer" | "message">("all");
  const [data, setData] = useState<NotificationData>({
    totalUnread: 0,
    counts: { orders: 0, offers: 0, messages: 0 },
    notifications: [],
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const prevTotalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.ok) return;

      const newTotal = json.totalUnread;

      // Eğer önceki sayıdan daha fazla yeni bildirim geldiyse:
      if (prevTotalRef.current !== null && newTotal > prevTotalRef.current) {
        // ZARİF "TİNG" ZİLİ ÇAL!
        playLoudBellChime();

        // En son gelen bildirimin başlığını tespit et
        const latest = json.notifications?.[0];
        const toastText = latest
          ? `${latest.title}: ${latest.sender}`
          : "Yeni bildirim veya talep geldi!";

        setToastMessage(toastText);
        setTimeout(() => setToastMessage(null), 7000);

        sendDesktopNotification("Lizart Yönetim — Yeni Bildirim!", toastText);
      }

      prevTotalRef.current = newTotal;
      setData(json);
    } catch (err) {
      console.warn("Bildirimler alınamadı:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    // İlk yüklemede bildirim izni iste ve verileri çek
    requestNotificationPermission();
    fetchNotifications();

    // 10 saniyede bir yeni sipariş, teklif veya mesaj olup olmadığını kontrol et
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const filteredNotifications =
    filter === "all"
      ? data.notifications
      : data.notifications.filter((n) => n.type === filter);

  const markAllAsRead = async () => {
    try {
      setData((prev) => ({
        ...prev,
        totalUnread: 0,
        counts: { orders: 0, offers: 0, messages: 0 },
        notifications: prev.notifications.map((n) => ({ ...n, isUnread: false })),
      }));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("admin_notifications_cleared"));
      }
      await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "all" }),
      });
    } catch (e) {
      console.error("Bildirimler işaretlenirken hata:", e);
    }
  };

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    playLoudBellChime();
    setToastMessage("Sistem bildirim zili ve üst bildirim kartı aktif edildi.");
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ─── Zil Butonu ─── */}
      <button
        type="button"
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);
          if (nextState) {
            markAllAsRead();
          }
        }}
        aria-label="Bildirimler"
        aria-expanded={isOpen}
        className="relative grid size-10 place-items-center rounded-xl border border-gray-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none cursor-pointer"
      >
        <Bell size={18} />

        {/* Bildirim Noktası */}
        {data.totalUnread > 0 && (
          <>
            <span className="absolute right-2 top-2 size-2 rounded-full bg-[#223d26] ring-2 ring-white" />
            <span className="sr-only">{data.totalUnread} yeni bildirim</span>
          </>
        )}
      </button>

      {/* ─── Yeni Bildirim Geldiğinde Ekranda Çıkan Mat Toast Banner ─── */}
      {mounted &&
        toastMessage &&
        createPortal(
          <aside
            aria-label="Yeni bildirim bildirisi"
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[999999] flex w-[94vw] max-w-md items-center gap-3.5 rounded-2xl border border-[#2e4734] bg-[#1c2b20] p-3.5 sm:p-4 text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-6 fade-in ease-out"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#263a2c] text-[#8ce087] border border-[#354f3b]">
              <Bell size={18} />
            </div>
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-[#82cf7f]" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9ae296]">
                  Yeni Bildirim
                </p>
              </div>
              <p className="mt-0.5 text-sm font-medium text-slate-100 leading-snug break-words">
                {toastMessage}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              title="Kapat"
            >
              <X size={16} />
            </button>
          </aside>,
          document.body
        )}

      {/* ─── Açılır Bildirim Menüsü (Popover) ─── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[26rem] max-w-[94vw] rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] z-50 overflow-hidden">
          {/* Başlık */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Gelen Bildirimler</span>
              {data.totalUnread > 0 ? (
                <span className="rounded-full bg-[#223d26] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {data.totalUnread} Yeni
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  Hepsi Güncel
                </span>
              )}
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-center gap-1.5">
              {data.totalUnread > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Tümünü okundu say"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#223d26] transition shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 size={13} className="text-[#223d26]" />
                  Okundu Say
                </button>
              )}

              {/* Zil Sesi Test Butonu */}
              <button
                type="button"
                onClick={handleTestSound}
                title="Zil sesini dene"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#223d26] transition shadow-2xs cursor-pointer"
              >
                <Volume2 size={13} className="text-[#223d26]" />
                Sesi Çal
              </button>
            </div>
          </div>

          {/* Filtre Butonları */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 px-3.5 py-2 bg-white text-xs">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer",
                filter === "all"
                  ? "bg-[#223d26] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Tümü ({data.notifications.length})
            </button>
            <button
              onClick={() => setFilter("order")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer",
                filter === "order"
                  ? "bg-[#223d26] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Sipariş ({data.counts.orders})
            </button>
            <button
              onClick={() => setFilter("offer")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer",
                filter === "offer"
                  ? "bg-amber-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Teklif ({data.counts.offers})
            </button>
            <button
              onClick={() => setFilter("message")}
              className={cn(
                "rounded-lg px-2.5 py-1 font-semibold transition cursor-pointer",
                filter === "message"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              Form ({data.counts.messages})
            </button>
          </div>

          {/* Bildirim Listesi */}
          <div className="max-h-[24rem] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs font-medium text-slate-400">
                Bu kategoride bildirim bulunmuyor.
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isOrder = item.type === "order";
                const isOffer = item.type === "offer";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      markAllAsRead();
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3.5 transition hover:bg-slate-50/90 cursor-pointer relative",
                      item.isUnread ? "bg-slate-50/60" : ""
                    )}
                  >
                    {/* İkon */}
                    <div
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                        isOrder
                          ? "bg-[#223d26]/10 text-[#223d26]"
                          : isOffer
                            ? "bg-amber-500/15 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {isOrder ? (
                        <Package size={17} />
                      ) : isOffer ? (
                        <Sparkles size={17} />
                      ) : (
                        <MessageSquare size={17} />
                      )}
                    </div>

                    {/* Detay Bilgisi */}
                    <div className="min-w-0 flex-1">
                      {/* Gönderen & Tarih */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {item.sender}
                          {item.company ? (
                            <span className="font-normal text-slate-500"> · {item.company}</span>
                          ) : null}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-medium text-slate-400">
                            {formatDate(new Date(item.createdAt))}
                          </span>
                          {item.isUnread && (
                            <span className="size-1.5 rounded-full bg-[#223d26]" />
                          )}
                        </div>
                      </div>

                      {/* Başlık / Konu */}
                      <p className="mt-0.5 text-xs font-medium text-slate-700 truncate">
                        {item.title}
                      </p>

                      {/* Mesaj Özeti (2 satır okunaklı) */}
                      <p className="mt-1 text-[11px] font-normal text-slate-500 line-clamp-2 leading-relaxed">
                        {item.details}
                      </p>

                      {/* Meta Rozetleri */}
                      {item.meta && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium",
                              item.meta.includes("₺")
                                ? "bg-[#223d26]/8 text-[#223d26] font-semibold"
                                : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {item.meta}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                            {isOrder ? "Sipariş" : isOffer ? "Teklif" : "Form"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Alt Kısayollar */}
          <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/70 p-2 text-center text-xs font-semibold">
            <Link
              href="/admin/siparisler"
              onClick={() => {
                setIsOpen(false);
                markAllAsRead();
              }}
              className="rounded-lg py-1.5 text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
            >
              Siparişler
            </Link>
            <Link
              href="/admin/teklifler"
              onClick={() => {
                setIsOpen(false);
                markAllAsRead();
              }}
              className="rounded-lg py-1.5 text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
            >
              Teklifler
            </Link>
            <Link
              href="/admin/formlar"
              onClick={() => {
                setIsOpen(false);
                markAllAsRead();
              }}
              className="rounded-lg py-1.5 text-slate-600 hover:text-slate-900 hover:bg-white transition cursor-pointer"
            >
              Formlar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
