import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { OrderStatusControl, ConfirmTransferButton } from "@/components/admin/OrderControls";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck2,
  Key,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Receipt,
  Sparkles,
  Tag,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sipariş Detayı | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
    },
    include: {
      items: {
        include: {
          addOns: true,
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              coverImage: true,
              type: true,
              basePrice: true,
            },
          },
          license: {
            select: {
              name: true,
              priceDelta: true,
            },
          },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      coupon: true,
      invoices: true,
      licenseKeys: true,
      projects: {
        include: {
          stages: { orderBy: { sortOrder: "asc" } },
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const isBankTransfer = order.payments.some((p) => p.provider === "havale");
  const cleanPhone = order.phone.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("0") ? "9" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
    `Merhaba ${order.fullName}, Lizart Dijital'den #${order.orderNumber} numaralı siparişiniz hakkında ulaşıyorum.`
  )}`;

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    bekliyor: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    odendi: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
    hazirlaniyor: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
    teslim: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
    iptal: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
    iade: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  };

  const currentStatusStyle = statusColors[order.status] || {
    bg: "bg-slate-50",
    text: "text-slate-800",
    border: "border-slate-200",
  };

  return (
    <div className="space-y-8">
      {/* ─── Geri Dön & Üst Bilgi ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68]"
        >
          <ArrowLeft size={16} />
          Sipariş Listesine Dön
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/siparis/${order.orderNumber}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Müşteri Ekranında Aç
            <ExternalLink size={14} />
          </Link>
          {order.status === "bekliyor" && isBankTransfer && (
            <ConfirmTransferButton orderId={order.id} />
          )}
        </div>
      </div>

      {/* ─── Sipariş Başlık Kartı ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-black text-[#1f7a68] sm:text-3xl">
                #{order.orderNumber}
              </span>
              <span
                className={`rounded-full border px-3.5 py-1 text-xs font-black uppercase tracking-wider ${currentStatusStyle.bg} ${currentStatusStyle.text} ${currentStatusStyle.border}`}
              >
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                {isBankTransfer ? "Havale / EFT" : "Kredi Kartı"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(order.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Tahmini Süre: {order.estimatedDays} İş Günü
              </span>
            </div>
          </div>

          {/* Hızlı Durum Değiştirici */}
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Durumu Güncelle
            </span>
            <OrderStatusControl orderId={order.id} status={order.status} />
          </div>
        </div>
      </section>

      {/* ─── Ana İçerik Grid ─── */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Sol / 2 Kolon: Satın Alınanlar & Finansal Özet ─── */}
        <div className="space-y-8 lg:col-span-2">
          {/* Müşteri Notu (Varsa) */}
          {order.note && (
            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-amber-900">
                <Sparkles size={18} className="text-amber-600" />
                Müşterinin Sipariş Notu & İstekleri:
              </div>
              <p className="mt-2 text-sm font-bold leading-relaxed text-amber-950">
                {order.note}
              </p>
            </div>
          )}

          {/* Satın Alınan Ürünler & Ek Hizmetler */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-950">Satın Alınan Ürünler & Hizmetler</h2>
                <p className="mt-0.5 text-xs font-bold text-slate-500">
                  Bu siparişte yer alan ana ürünler, lisanslar ve eklenen tüm opsiyonlar
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {order.items.length} Kalem
              </span>
            </div>

            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      {item.product?.coverImage ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                          <Image
                            src={item.product.coverImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-white text-slate-400 border border-slate-200 shadow-sm">
                          <Package size={24} />
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-black text-slate-950">
                          {item.productName}
                        </h3>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-black text-[#1f7a68]">
                            {item.licenseName}
                          </span>
                          {item.product?.type && (
                            <span className="rounded-md bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                              {item.product.type}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-500">
                            Adet: {item.quantity} × {formatPrice(item.unitPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Kalem Toplamı
                      </p>
                      <p className="text-lg font-black text-slate-950">
                        {formatPrice(item.lineTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Bu ürüne dahil edilen Ek Hizmetler */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-4 border-t border-slate-200/80 pt-3">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Dahil Edilen Ek Hizmetler:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.addOns.map((addon) => (
                          <span
                            key={addon.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900 shadow-xs"
                          >
                            <Sparkles size={12} className="text-emerald-600" />
                            {addon.name}
                            <span className="font-extrabold text-emerald-700">
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
          </div>

          {/* ─── Finansal Döküm Kartı ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <h2 className="text-xl font-black text-slate-950 mb-5 border-b border-slate-100 pb-4">
              Ödeme & Finansal Döküm
            </h2>

            <div className="space-y-3.5 text-sm font-bold">
              <div className="flex items-center justify-between text-slate-600">
                <span>Ara Toplam</span>
                <span className="font-black text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    Kupon İndirimi {order.coupon?.code ? `(${order.coupon.code})` : ""}
                  </span>
                  <span className="font-black">-{formatPrice(order.discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <span>Hesaplanan KDV (%20)</span>
                <span className="font-black text-slate-900">{formatPrice(order.vatTotal)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-lg">
                <span className="font-black text-slate-950">Genel Toplam</span>
                <span className="text-2xl font-black text-[#1f7a68]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Lisans Anahtarları (Varsa) ─── */}
          {order.licenseKeys.length > 0 && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
              <div className="flex items-center gap-2 mb-4">
                <Key size={20} className="text-[#1f7a68]" />
                <h2 className="text-lg font-black text-slate-950">Üretilen Lisans Anahtarları</h2>
              </div>
              <div className="space-y-2">
                {order.licenseKeys.map((lk) => (
                  <div
                    key={lk.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="font-mono text-sm font-black text-slate-900">{lk.key}</span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-900">
                      {lk.licenseType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Proje Durumu (Hizmet / Proje Bazlı İse) ─── */}
          {order.projects.length > 0 && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
              <div className="flex items-center gap-2 mb-4">
                <FileCheck2 size={20} className="text-[#1f7a68]" />
                <h2 className="text-lg font-black text-slate-950">Bağlı Projeler & Süreç</h2>
              </div>
              <div className="space-y-4">
                {order.projects.map((proj) => {
                  let domain = "";
                  try {
                    const brief = JSON.parse(proj.briefData || "{}");
                    domain = brief.domain || "";
                  } catch {
                    // ignore JSON parse error
                  }
                  return (
                    <div key={proj.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-slate-950">
                          {proj.title} <span className="text-xs font-bold text-slate-500">({proj.code})</span>
                        </p>
                        <span className="rounded-full bg-[#1f7a68]/10 px-3 py-0.5 text-xs font-black text-[#1f7a68]">
                          {proj.currentStage}
                        </span>
                      </div>
                      {domain && (
                        <p className="mt-1 text-xs font-bold text-slate-600">
                          Hedef Alan Adı: <span className="font-mono">{domain}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Sağ / 1 Kolon: Müşteri, Adres ve Ödeme Detayları ─── */}
        <div className="space-y-8">
          {/* ─── Müşteri Kartı ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-10 place-items-center rounded-xl bg-[#1f7a68]/10 text-[#1f7a68]">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-950">Müşteri Bilgisi</h2>
                  <p className="text-xs font-bold text-slate-500">Kişi ve iletişim kanalları</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black capitalize text-slate-700">
                {order.customerType === "kurumsal" ? "Kurumsal" : "Bireysel"}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-lg font-black text-slate-950">{order.fullName}</p>
                {order.user && (
                  <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    Sistem Kullanıcısı (Kayıtlı)
                  </span>
                )}
              </div>

              {/* Hızlı Aksiyon Butonları */}
              <div className="space-y-2 pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={18} />
                  WhatsApp'tan Yaz
                </a>

                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  <Phone size={16} />
                  {order.phone}
                </a>

                <a
                  href={`mailto:${order.email}`}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:border-[#1f7a68] hover:text-[#1f7a68] transition truncate"
                >
                  <Mail size={16} className="shrink-0" />
                  <span className="truncate">{order.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* ─── Kurumsal / Fatura Bilgileri ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-700">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">Fatura & Adres</h2>
                <p className="text-xs font-bold text-slate-500">Faturalandırma ve lokasyon</p>
              </div>
            </div>

            <div className="mt-5 space-y-3.5 text-xs font-bold text-slate-700">
              {order.customerType === "kurumsal" && (
                <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 border border-slate-100">
                  <p className="text-slate-400 uppercase tracking-wider text-[10px]">Şirket Ünvanı</p>
                  <p className="text-sm font-black text-slate-950">{order.companyName || "Belirtilmemiş"}</p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <p className="text-slate-400 text-[10px]">Vergi Dairesi</p>
                      <p className="font-black text-slate-900">{order.taxOffice || "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Vergi No / TCKN</p>
                      <p className="font-black text-slate-900 font-mono">{order.taxNumber || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 border border-slate-100">
                <p className="text-slate-400 uppercase tracking-wider text-[10px]">Adres Bilgisi</p>
                <p className="text-sm font-black text-slate-950">
                  {order.billingCity || "Şehir Belirtilmedi"}
                  {order.billingDistrict ? ` / ${order.billingDistrict}` : ""}
                </p>
                {order.billingLine1 && (
                  <p className="font-semibold text-slate-600 leading-relaxed">
                    {order.billingLine1}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ─── Ödeme Kayıtları ─── */}
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-700">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">Ödeme Detayları</h2>
                <p className="text-xs font-bold text-slate-500">İşlem geçmişi ve sağlayıcı</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order.payments.length === 0 ? (
                <p className="text-xs font-bold text-slate-500">Kayıtlı ödeme hareketi bulunmuyor.</p>
              ) : (
                order.payments.map((p) => (
                  <div key={p.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="uppercase text-slate-700">
                        {p.provider === "havale" ? "Banka Havalesi / EFT" : p.provider.toUpperCase()}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-black ${
                          p.status === "basarili"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "beklemede"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Tutar:</span>
                      <span className="font-black text-slate-900">{formatPrice(p.amount)}</span>
                    </div>

                    {p.installment > 1 && (
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Taksit:</span>
                        <span>{p.installment} Taksit</span>
                      </div>
                    )}

                    {p.providerRef && (
                      <div className="pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="text-slate-400">İşlem Ref: </span>
                        <span className="font-mono font-bold text-slate-700">{p.providerRef}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
