import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { OrdersTableClient } from "@/components/admin/OrdersTableClient";
import { cn } from "@/lib/utils";
import { ShoppingBag, Clock, CheckCircle2, Search, X, Boxes } from "lucide-react";

export const metadata: Metadata = {
  title: "Siparişler | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "Tümü" },
  { value: "bekliyor", label: "Ödeme Bekleyen" },
  { value: "odendi", label: "Ödendi" },
  { value: "hazirlaniyor", label: "Hazırlanıyor" },
  { value: "teslim", label: "Teslim Edildi" },
  { value: "iptal", label: "İptal Edildi" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  const { durum, q } = await searchParams;

  const [orders, totalOrders, pendingPayment, completedOrders] = await Promise.all([
    prisma.order.findMany({
      where: {
        ...(durum ? { status: durum } : {}),
        ...(q
          ? {
              OR: [
                { orderNumber: { contains: q } },
                { fullName: { contains: q } },
                { email: { contains: q } },
                { phone: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        items: {
          include: {
            addOns: true,
            product: { select: { name: true, slug: true, coverImage: true, type: true } },
          },
        },
        payments: {
          select: {
            id: true,
            provider: true,
            status: true,
            amount: true,
            providerRef: true,
            installment: true,
            createdAt: true,
          },
        },
        coupon: true,
      },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "bekliyor" } }),
    prisma.order.count({ where: { status: "teslim" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* ─── Hero ─── */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_60px_-45px_rgb(15_23_42/.35)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223d26]/15 bg-[#223d26]/[0.06] px-3.5 py-1 text-xs font-semibold text-[#223d26]">
              <ShoppingBag className="h-3.5 w-3.5 text-[#223d26]" />
              <span>Sipariş Operasyonları</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] leading-tight">
              Sipariş Yönetim Merkezi
            </h1>
            <p className="mt-2.5 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
              Müşteri siparişlerini, paket alımlarını ve havale bildirimlerini anlık takip edin; teslimat süreçlerini tek ekrandan hızla yönetin.
            </p>
          </div>

          {/* Uygun Renkli İstatistik Kartları */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
            {/* Toplam - Mavi */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                  <Boxes className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalOrders}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kayıtlı Sipariş</p>
              </div>
            </div>

            {/* Bekleyen - Amber / Turuncu (Ödeme bekliyor) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Bekleyen</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600">{pendingPayment}</div>
                <p className="mt-0.5 text-[11px] font-bold text-amber-500">Onay Bekliyor</p>
              </div>
            </div>

            {/* Teslim - Zümrüt Yeşil (Tamamlanan) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Teslim</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{completedOrders}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Tamamlandı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arama & Durum Filtresi */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <form className="flex w-full sm:w-auto items-center gap-2" role="search">
              <div className="relative flex-1 sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Sipariş no, müşteri adı, telefon veya e-posta..."
                  aria-label="Sipariş ara"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#223d26] focus:bg-white focus:ring-2 focus:ring-[#223d26]/10"
                />
              </div>
              {durum && <input type="hidden" name="durum" value={durum} />}
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#223d26] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#2b4c30] active:scale-[0.99] transition"
              >
                Ara
              </button>
              {q && (
                <Link
                  href="/admin/siparisler"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Temizle</span>
                </Link>
              )}
            </form>

            <div className="text-xs font-medium text-slate-500 shrink-0 self-start sm:self-center">
              Toplam <span className="font-bold text-slate-800">{orders.length}</span> sipariş listeleniyor
            </div>
          </div>

          <nav aria-label="Durum filtresi" className="no-scrollbar flex flex-wrap items-center gap-1.5 pt-1">
            {FILTERS.map((f) => {
              const isActive = (durum ?? "") === f.value;
              return (
                <Link
                  key={f.value}
                  href={f.value ? `/admin/siparisler?durum=${f.value}` : "/admin/siparisler"}
                  className={cn(
                    "inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-semibold transition shadow-2xs",
                    isActive
                      ? "bg-[#223d26] text-white ring-1 ring-[#223d26]"
                      : "border border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ─── Sipariş Tablosu & Detay Yönetimi ─── */}
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Sipariş Listesi</h2>
            <p className="mt-0.5 text-sm font-semibold text-slate-600">
              {durum ? `${FILTERS.find((f) => f.value === durum)?.label} siparişler` : "Tüm kayıtlar"}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-black text-slate-800">
            {orders.length} Sipariş
          </span>
        </div>

        <OrdersTableClient initialOrders={orders} filterStatus={durum} />
      </div>
    </div>
  );
}
