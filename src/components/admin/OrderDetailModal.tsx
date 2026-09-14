"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { updateOrderStatus, confirmBankTransfer } from "@/lib/actions/admin";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Package,
  Sparkles,
  CreditCard,
  MessageCircle,
  Clock,
  Calendar,
  Tag,
  ExternalLink,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Receipt,
  FileText,
} from "lucide-react";

export type OrderDetailData = {
  id: string;
  orderNumber: string;
  status: string;
  email: string;
  fullName: string;
  phone: string;
  customerType: string;
  companyName: string | null;
  taxOffice: string | null;
  taxNumber: string | null;
  billingCity: string | null;
  billingDistrict: string | null;
  billingLine1: string | null;
  subtotal: number;
  discount: number;
  vatTotal: number;
  total: number;
  estimatedDays: number;
  note: string | null;
  createdAt: string | Date;
  coupon?: { code: string; type: string; value: number } | null;
  items: Array<{
    id: string;
    productName: string;
    licenseName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    product?: {
      name: string;
      slug: string;
      coverImage: string | null;
      type?: string | null;
    } | null;
    addOns: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }>;
  payments: Array<{
    id?: string;
    provider: string;
    status: string;
    amount: number;
    providerRef?: string | null;
    installment?: number | null;
    createdAt?: string | Date;
  }>;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; badge: string }
> = {
  bekliyor: {
    label: "Ödeme Bekliyor",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-500",
  },
  odendi: {
    label: "Ödendi",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    badge: "bg-emerald-500",
  },
  hazirlaniyor: {
    label: "Hazırlanıyor",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    badge: "bg-blue-500",
  },
  teslim: {
    label: "Teslim Edildi",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    badge: "bg-purple-500",
  },
  iptal: {
    label: "İptal Edildi",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    badge: "bg-rose-500",
  },
  iade: {
    label: "İade Edildi",
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300",
    badge: "bg-slate-500",
  },
};

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusChanged,
}: {
  order: OrderDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged?: (orderId: string, newStatus: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(order?.status || "bekliyor");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setCurrentStatus(order.status);
      setMessage(null);
    }
  }, [order]);

  // ESC key to close
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

  if (!isOpen || !order) return null;

  const isBankTransfer = order.payments.some((p) => p.provider === "havale");
  const cleanPhone = order.phone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone;

  const waOrderText = `Merhaba ${order.fullName}, Lizart Dijital'den #${order.orderNumber} numaralı siparişiniz hakkında ulaşıyorum.`;
  const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waOrderText)}`;

  const waStatusText = `Merhaba ${order.fullName}, Lizart Dijital #${order.orderNumber} numaralı siparişinizin güncel durumu: "${ORDER_STATUS_LABELS[currentStatus] || currentStatus}" olarak güncellenmiştir.`;
  const waStatusLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waStatusText)}`;

  const statusStyle = STATUS_CONFIG[currentStatus] || {
    label: currentStatus,
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
    badge: "bg-slate-500",
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = (nextStatus: string) => {
    setCurrentStatus(nextStatus);
    startTransition(async () => {
      const res = await updateOrderStatus(order.id, nextStatus);
      if (res.ok) {
        setMessage("Sipariş durumu başarıyla güncellendi.");
        onStatusChanged?.(order.id, nextStatus);
      } else {
        setMessage(res.error || "Güncelleme başarısız.");
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleConfirmTransfer = () => {
    startTransition(async () => {
      const res = await confirmBankTransfer(order.id);
      if (res.ok) {
        setCurrentStatus("odendi");
        setMessage("Havale ödemesi onaylandı ve sipariş 'Ödendi' durumuna alındı.");
        onStatusChanged?.(order.id, "odendi");
      } else {
        setMessage(res.error || "Onaylama başarısız.");
      }
      setTimeout(() => setMessage(null), 4000);
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

      {/* Modal Container */}
      <div className="relative z-10 my-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-[#1f7a68]">
                #{order.orderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                title="Sipariş numarasını kopyala"
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

            <span className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-black text-slate-700">
              {isBankTransfer ? "Havale / EFT" : "Kredi Kartı"}
            </span>

            <span className="text-xs font-bold text-slate-400">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Sipariş Özeti Yazdır"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Yazdır</span>
            </button>

            <Link
              href={`/admin/siparisler/${order.id}`}
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
        {message && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs font-bold text-emerald-900 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              {message}
            </span>
            <button onClick={() => setMessage(null)} className="text-emerald-700 hover:text-emerald-900">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">

          {/* Müşteri Notu Varsa */}
          {order.note && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
              <Sparkles size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Müşterinin Sipariş Notu / Özel İstekleri:
                </p>
                <p className="mt-1 text-sm font-bold text-amber-950 leading-relaxed">
                  {order.note}
                </p>
              </div>
            </div>
          )}

          {/* Üst Bilgi Kartları Grid (Müşteri & Kurumsal & Ödeme) */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* 1. Müşteri Kartı */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 text-slate-950 font-black text-sm">
                    <div className="grid size-7 place-items-center rounded-lg bg-[#1f7a68]/10 text-[#1f7a68]">
                      <User size={15} />
                    </div>
                    Müşteri Bilgileri
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">
                    {order.customerType === "kurumsal" ? "Kurumsal" : "Bireysel"}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2">
                  <p className="text-base font-black text-slate-950">{order.fullName}</p>
                  
                  <div className="space-y-1.5 text-xs font-bold text-slate-600">
                    <a
                      href={`tel:${order.phone}`}
                      className="flex items-center gap-2 hover:text-[#1f7a68] transition"
                    >
                      <Phone size={13} className="text-slate-400" />
                      {order.phone}
                    </a>

                    <a
                      href={`mailto:${order.email}`}
                      className="flex items-center gap-2 hover:text-[#1f7a68] transition truncate"
                    >
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{order.email}</span>
                    </a>

                    {order.billingCity && (
                      <p className="flex items-start gap-2 text-slate-500 pt-1">
                        <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          {order.billingCity} {order.billingDistrict ? `/ ${order.billingDistrict}` : ""}
                          {order.billingLine1 && <span className="block text-[11px] font-normal text-slate-400 mt-0.5">{order.billingLine1}</span>}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* WhatsApp & Arama Hızlı Butonları */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a
                  href={`tel:${order.phone}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>

            {/* 2. Fatura & Kurumsal Bilgi */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-black text-sm">
                  <div className="grid size-7 place-items-center rounded-lg bg-amber-500/10 text-amber-700">
                    <Building2 size={15} />
                  </div>
                  Fatura & Kurumsal
                </div>

                <div className="mt-3.5 space-y-2.5 text-xs font-bold">
                  {order.customerType === "kurumsal" && order.companyName ? (
                    <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Şirket Ünvanı</p>
                      <p className="text-xs font-black text-slate-900">{order.companyName}</p>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 mt-2">
                        <div>
                          <p className="text-[10px] text-slate-400">Vergi Dairesi</p>
                          <p className="font-black text-slate-800">{order.taxOffice || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400">Vergi No</p>
                          <p className="font-mono font-black text-slate-800">{order.taxNumber || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                      <p className="text-[11px] font-semibold">Bireysel Müşteri Faturası</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Fatura alıcı adına T.C. mevzuatına uygun olarak e-arşiv fatura formatında düzenlenir.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Tahmini Teslim Süresi:</span>
                    <span className="font-black text-slate-900">{order.estimatedDays} İş Günü</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Receipt size={13} className="text-[#1f7a68]" />
                <span>E-Fatura Otomatik Tescil Edildi</span>
              </div>
            </div>

            {/* 3. Ödeme & Hızlı Durum Güncelleme */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-950 font-black text-sm">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-700">
                    <CreditCard size={15} />
                  </div>
                  Ödeme Durumu & İşlem
                </div>

                <div className="mt-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Ödeme Kanalı:</span>
                    <span className="text-xs font-black text-slate-900">
                      {isBankTransfer ? "Banka Havalesi / EFT" : "Kredi Kartı / Online"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Toplam Tutar:</span>
                    <span className="text-base font-black text-[#1f7a68]">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  {order.payments[0]?.providerRef && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">İşlem Ref:</span>
                      <span className="font-mono text-[11px] font-bold text-slate-700">
                        {order.payments[0].providerRef}
                      </span>
                    </div>
                  )}

                  {/* Durum Değiştirici */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                      Sipariş Durumunu Güncelle:
                    </label>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={isPending}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-900 outline-none focus:border-[#1f7a68] transition"
                    >
                      <option value="bekliyor">Ödeme Bekliyor</option>
                      <option value="odendi">Ödendi</option>
                      <option value="hazirlaniyor">Hazırlanıyor</option>
                      <option value="teslim">Teslim Edildi</option>
                      <option value="iptal">İptal Edildi</option>
                      <option value="iade">İade Edildi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Havale Onay Butonu Varsa */}
              {currentStatus === "bekliyor" && isBankTransfer && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleConfirmTransfer}
                    disabled={isPending}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2.5 text-xs font-black text-white hover:bg-amber-700 transition shadow-xs"
                  >
                    <CheckCircle2 size={14} />
                    Havale Ödemesini Onayla
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Satın Alınan Kalemler & Ek Hizmetler Listesi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-950">Satın Alınan Ürünler & Hizmet Paketleri</h3>
                <p className="text-xs font-bold text-slate-500">
                  Müşterinin sepetinde yer alan ürünler, seçilen lisans ve opsiyonel ek hizmetler
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {order.items.length} Kalem
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      {item.product?.coverImage ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                          <Image
                            src={item.product.coverImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-white text-slate-400 border border-slate-200 shadow-xs">
                          <Package size={22} />
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-950">
                          {item.productName}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-black text-[#1f7a68]">
                            {item.licenseName}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            Adet: {item.quantity} × {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Kalem Toplamı
                      </p>
                      <p className="text-base sm:text-lg font-black text-slate-950">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Ek Hizmetler Listesi */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-4 border-t border-slate-200/70 pt-3">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2">
                        Dahil Edilen Ek Hizmetler:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.addOns.map((addon) => (
                          <span
                            key={addon.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900"
                          >
                            <Sparkles size={12} className="text-emerald-600" />
                            {addon.name}
                            <span className="font-black text-emerald-700">
                              (+{formatPrice(addon.price)})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Finansal Hesap Özeti */}
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <div className="max-w-md ml-auto space-y-2.5 text-xs font-bold">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Ara Toplam:</span>
                  <span className="font-black text-slate-900">{formatPrice(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Tag size={13} />
                      Kupon İndirimi {order.coupon?.code ? `(${order.coupon.code})` : ""}:
                    </span>
                    <span className="font-black">-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>Hesaplanan KDV (%20):</span>
                  <span className="font-black text-slate-900">{formatPrice(order.vatTotal)}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-base">
                  <span className="font-black text-slate-950">Ödenecek / Ödenen Genel Toplam:</span>
                  <span className="text-xl font-black text-[#1f7a68]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Hızlı İletişim & Bildirim Aksiyonları */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-950">Müşteriye Durum Bildirimi</p>
              <p className="text-xs font-bold text-slate-500">
                Siparişin son durumunu tek tıkla müşterinin WhatsApp hattına mesaj olarak iletebilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={waStatusLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <MessageCircle size={15} />
                WhatsApp ile Durum Gönder
              </a>

              <Link
                href={`/admin/siparisler/${order.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-xs"
              >
                Tüm Detayları & Projeyi İncele
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
