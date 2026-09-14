import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Layers3,
  Mail,
  Package,
  Percent,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analitik & Satış Raporları | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

async function getReportRanges() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const dayAgo = new Date(now.getTime() - 24 * 3600 * 1000);

  return { now, startOfMonth, startOfPrevMonth, endOfPrevMonth, dayAgo };
}

export default async function AdminReportsPage() {
  const { now, startOfMonth, startOfPrevMonth, endOfPrevMonth, dayAgo } = await getReportRanges();

  // Son 6 ayın dilimleri
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { start: date, end: new Date(date.getFullYear(), date.getMonth() + 1, 1), date };
  });

  const [
    totalRevenueAgg,
    monthRevenueAgg,
    prevMonthRevenueAgg,
    totalOrderCount,
    paidOrderCount,
    monthly,
    byType,
    topProducts,
    addOnUsage,
    abandoned,
    conversionBase,
  ] = await Promise.all([
    // Toplam onaylı ciro
    prisma.order.aggregate({
      where: { status: { notIn: ["bekliyor", "iptal"] } },
      _sum: { total: true },
    }),
    // Bu ayın cirosu ve sipariş adedi
    prisma.order.aggregate({
      where: { status: { notIn: ["bekliyor", "iptal"] }, createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: true,
    }),
    // Geçen ayın cirosu
    prisma.order.aggregate({
      where: {
        status: { notIn: ["bekliyor", "iptal"] },
        createdAt: { gte: startOfPrevMonth, lte: endOfPrevMonth },
      },
      _sum: { total: true },
    }),
    // Toplam sipariş sayısı
    prisma.order.count(),
    // Onaylı / ödenmiş sipariş sayısı
    prisma.order.count({ where: { status: { notIn: ["bekliyor", "iptal"] } } }),
    // Aylık döküm
    Promise.all(
      months.map(async (m) => {
        const agg = await prisma.order.aggregate({
          where: {
            status: { notIn: ["bekliyor", "iptal"] },
            createdAt: { gte: m.start, lt: m.end },
          },
          _sum: { total: true },
          _count: true,
        });
        return {
          label: new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(m.date),
          shortLabel: new Intl.DateTimeFormat("tr-TR", { month: "short" }).format(m.date),
          total: agg._sum.total ?? 0,
          count: agg._count,
        };
      }),
    ),
    // Ürün bazlı ciro toplamı
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { lineTotal: true, quantity: true },
      orderBy: { _sum: { lineTotal: "desc" } },
      take: 10,
    }),
    // En çok satan ve görüntülenen ürünler
    prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        salesCount: true,
        viewCount: true,
        demoCount: true,
        type: true,
        basePrice: true,
        category: { select: { name: true } },
      },
    }),
    // Ek hizmet satışları
    prisma.orderItemAddOn.groupBy({
      by: ["name"],
      _count: true,
      _sum: { price: true },
      orderBy: { _count: { name: "desc" } },
      take: 8,
    }),
    // Terk edilen sepetler (24 saatten eski ve dolu)
    prisma.cart.findMany({
      where: { items: { some: {} }, updatedAt: { lt: dayAgo } },
      orderBy: { updatedAt: "desc" },
      take: 20,
      include: {
        user: { select: { email: true, fullName: true, phone: true } },
        items: { include: { product: { select: { name: true, basePrice: true } } } },
      },
    }),
    // Mağaza görüntüleme ve satış tabanı
    prisma.product.aggregate({
      _sum: { viewCount: true, salesCount: true },
    }),
  ]);

  const totalRevenue = totalRevenueAgg._sum.total ?? 0;
  const monthRevenue = monthRevenueAgg._sum.total ?? 0;
  const prevMonthRevenue = prevMonthRevenueAgg._sum.total ?? 0;

  // Ay bazında büyüme oranı
  const momGrowth =
    prevMonthRevenue > 0
      ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100)
      : null;

  // Ortalama sepet tutarı (AOV)
  const averageOrderValue = paidOrderCount > 0 ? Math.round(totalRevenue / paidOrderCount) : 0;

  // Genel dönüşüm oranı
  const totalViews = conversionBase._sum.viewCount ?? 0;
  const totalSales = conversionBase._sum.salesCount ?? 0;
  const overallConversion = totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(2) : "0.00";

  // Terk edilen sepetlerin toplam tahmini değeri
  const totalAbandonedValue = abandoned.reduce((sum, cart) => {
    return (
      sum +
      cart.items.reduce((itemSum, i) => itemSum + (i.product.basePrice ?? 0) * (i.quantity ?? 1), 0)
    );
  }, 0);

  const maxMonth = Math.max(...monthly.map((m) => m.total), 1);
  const maxAddOnCount = Math.max(...addOnUsage.map((a) => a._count), 1);
  const revenueByProduct = new Map(byType.map((b) => [b.productId, b._sum.lineTotal ?? 0]));

  return (
    <div className="space-y-8">
      {/* ─── Hero & Zaman Filtre Başlığı ─── */}
      <section className="rounded-[2.25rem] border border-gray-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.35)] sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              <BarChart3 size={13} className="stroke-[2.5]" />
              Satış, Gelir & Dönüşüm Analitiği
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Raporlar & Performans İstatistikleri
            </h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] font-medium leading-7 text-slate-600">
              Aylık onaylı ciro, ürün bazlı dönüşüm oranları, en çok satan ek hizmetler ve geri kazanılabilecek terk sepetler.
            </p>
          </div>

          {/* Dönüşüm Özeti & Hızlı Kısayollar */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/siparisler"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-2xs hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
            >
              <ShoppingBag size={15} />
              Sipariş Listesi
            </Link>
            <Link
              href="/admin/urunler"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-2xs hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
            >
              <Package size={15} />
              Ürün Kataloğu
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#1f7a68] px-4 text-xs font-black text-white shadow-xs hover:bg-[#176956] transition"
            >
              <Sparkles size={14} />
              Ana Panele Dön
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5 Büyük KPI Metrik Kartı (Uygun Renkli) ─── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* 1. Toplam Onaylı Ciro - Zümrüt / Teal */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 sm:p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Toplam Ciro</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-slate-950">{formatPrice(totalRevenue)}</div>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">{paidOrderCount} tamamlanan sipariş</p>
          </div>
        </div>

        {/* 2. Bu Ayki Ciro - Mavi */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 sm:p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Bu Ayki Gelir</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-slate-950">{formatPrice(monthRevenue)}</div>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">
              {momGrowth !== null ? (
                <span className={momGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}>
                  {momGrowth >= 0 ? `+${momGrowth}%` : `${momGrowth}%`} geçen aya göre
                </span>
              ) : (
                <span>{monthRevenueAgg._count} sipariş</span>
              )}
            </p>
          </div>
        </div>

        {/* 3. Ortalama Sepet Tutarı (AOV) - Amber */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 sm:p-5 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Ort. Sepet</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-slate-950">{formatPrice(averageOrderValue)}</div>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">Sipariş başına gelir</p>
          </div>
        </div>

        {/* 4. Mağaza Dönüşüm Oranı - Mor / Indigo */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 to-white p-4 sm:p-5 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">Dönüşüm Oranı</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-xs">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-slate-950">%{overallConversion}</div>
            <p className="mt-0.5 text-[11px] font-bold text-slate-500">{totalViews} inceleme · {totalSales} satış</p>
          </div>
        </div>

        {/* 5. Terk Edilen Sepet Değeri - Rose / Kırmızı (Uyarı/Kayıp) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-200/90 bg-gradient-to-b from-rose-50/60 to-white p-4 sm:p-5 shadow-xs transition-all hover:border-rose-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">Terk Sepet</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-xs">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black tracking-tight text-rose-600">{formatPrice(totalAbandonedValue)}</div>
            <p className="mt-0.5 text-[11px] font-bold text-rose-500">{abandoned.length} kurtarılabilir sepet</p>
          </div>
        </div>
      </section>

      {/* ─── 2 Kolon: Aylık Satış Trendi & Ek Hizmetler ─── */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Aylık Satış Trendi */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#1f7a68]" />
                Son 6 Ayın Satış Trendi
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400">
                Aylık onaylı gelir dağılımı ve sipariş adetleri
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
              6 Aylık Veri
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {monthly.map((m) => {
              const ratio = maxMonth > 0 ? Math.round((m.total / maxMonth) * 100) : 0;
              return (
                <div key={m.label} className="group">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
                    <span className="text-slate-900 group-hover:text-[#1f7a68] transition">
                      {m.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                        {m.count} sipariş
                      </span>
                      <span className="font-black text-slate-950">
                        {formatPrice(m.total)}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1f7a68] to-emerald-500 transition-all duration-500"
                      style={{ width: `${Math.max(ratio, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* En Çok Satılan Ek Hizmetler */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                <Layers3 size={18} className="text-[#1f7a68]" />
                En Çok Satılan Ek Hizmetler
              </h2>
              <p className="mt-0.5 text-xs font-bold text-slate-400">
                Siparişlere eklenen popüler hizmet paketleri
              </p>
            </div>
            <Link
              href="/admin/ek-hizmetler"
              className="text-xs font-black text-[#1f7a68] hover:underline"
            >
              Yönet →
            </Link>
          </div>

          {addOnUsage.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              Henüz ek hizmet satışı kaydedilmedi.
            </div>
          ) : (
            <div className="mt-5 space-y-3.5">
              {addOnUsage.map((a, i) => {
                const ratio = Math.round((a._count / maxAddOnCount) * 100);
                return (
                  <div key={a.name} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-lg bg-white text-[11px] font-black text-[#1f7a68] shadow-2xs">
                          #{i + 1}
                        </span>
                        <span className="font-bold text-slate-900">{a.name}</span>
                      </div>
                      <span className="font-black text-slate-950">
                        {formatPrice(a._sum.price ?? 0)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#1f7a68]"
                          style={{ width: `${Math.max(ratio, 5)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 shrink-0">
                        {a._count} adet
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── Ürün Performans Matrisi ─── */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              Ürün & Paket Performans Matrisi
            </h2>
            <p className="text-xs font-bold text-slate-400">
              Katalogdaki ürünlerin satış sayısı, inceleme adedi, demo tıklamaları ve dönüşüm oranları
            </p>
          </div>
          <Link
            href="/admin/urunler"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
          >
            Tüm Ürünleri Gör →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[50rem] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Sıra & Ürün</th>
                <th className="pb-3">Kategori & Tür</th>
                <th className="pb-3 text-center">Satış</th>
                <th className="pb-3 text-center">Görüntüleme</th>
                <th className="pb-3 text-center">Demo</th>
                <th className="pb-3 text-center">Dönüşüm</th>
                <th className="pb-3 text-right pr-2">Ürün Cirosu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topProducts.map((p, idx) => {
                const conversion =
                  p.viewCount > 0 ? ((p.salesCount / p.viewCount) * 100).toFixed(2) : "0.00";
                const productRevenue = revenueByProduct.get(p.id) ?? 0;
                const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-slate-400 w-6">
                          {medal}
                        </span>
                        <div>
                          <Link
                            href={`/urun/${p.slug}`}
                            target="_blank"
                            className="font-black text-slate-900 hover:text-[#1f7a68] transition flex items-center gap-1"
                          >
                            {p.name}
                            <ArrowUpRight size={13} className="text-slate-400" />
                          </Link>
                          <span className="text-[11px] font-bold text-slate-400">
                            Birim: {formatPrice(p.basePrice)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs font-bold text-slate-600">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">
                        {p.category?.name ?? p.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-black text-slate-950">
                      {p.salesCount}
                    </td>
                    <td className="py-3.5 text-center font-semibold text-slate-600">
                      {p.viewCount.toLocaleString("tr-TR")}
                    </td>
                    <td className="py-3.5 text-center font-semibold text-slate-600">
                      {p.demoCount}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block rounded-lg px-2 py-0.5 text-xs font-black ${
                          Number(conversion) >= 5
                            ? "bg-emerald-100 text-emerald-800"
                            : Number(conversion) > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        %{conversion}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2 font-black text-slate-950">
                      {formatPrice(productRevenue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Terk Edilen Sepetler & Doğrudan Kurtarma Butonu ─── */}
      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
              <ShoppingCart size={18} className="text-rose-600" />
              Terk Edilen Sepetler & Geri Kazanım
            </h2>
            <p className="text-xs font-bold text-slate-400">
              24 saatten uzun süredir satın alma tamamlanmamış sepetler. Müşteriye doğrudan e-posta veya aramayla ulaşabilirsiniz.
            </p>
          </div>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700 border border-rose-200">
            {abandoned.length} Potansiyel Müşteri
          </span>
        </div>

        {abandoned.length === 0 ? (
          <div className="py-10 text-center text-xs font-semibold text-slate-400">
            Terk edilmiş sepet kaydı bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-2">Müşteri</th>
                  <th className="pb-3">Sepetteki Ürünler</th>
                  <th className="pb-3">Sepet Tutarı</th>
                  <th className="pb-3">Son İşlem</th>
                  <th className="pb-3 text-right pr-2">Geri Kazanım Eylemi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {abandoned.map((cart) => {
                  const cartTotal = cart.items.reduce(
                    (sum, i) => sum + (i.product.basePrice ?? 0) * (i.quantity ?? 1),
                    0,
                  );
                  const userEmail = cart.user?.email;
                  const userName = cart.user?.fullName ?? "Müşteri";
                  const productNames = cart.items.map((i) => i.product.name).join(", ");

                  return (
                    <tr key={cart.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 pl-2">
                        {cart.user ? (
                          <div>
                            <p className="font-bold text-slate-950">{cart.user.fullName}</p>
                            <p className="text-xs font-medium text-slate-400">{cart.user.email}</p>
                            {cart.user.phone && (
                              <p className="text-[11px] font-mono text-slate-600">{cart.user.phone}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">Misafir Kullanıcı</span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs font-semibold text-slate-700 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {cart.items.map((i) => (
                            <span
                              key={i.id}
                              className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-800"
                            >
                              {i.product.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 font-black text-slate-950">
                        {formatPrice(cartTotal)}
                      </td>
                      <td className="py-3.5 text-xs font-medium text-slate-500">
                        {formatDate(cart.updatedAt)}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        {userEmail ? (
                          <a
                            href={`mailto:${userEmail}?subject=${encodeURIComponent(
                              "Lizart Dijital Sepetinizdeki Ürünler Sizi Bekliyor",
                            )}&body=${encodeURIComponent(
                              `Merhaba ${userName},\n\nSepetinizde bıraktığınız "${productNames}" paket(ler)i için satın alma işleminizi kolayca tamamlayabilirsiniz.\n\nSorularınız varsa bu e-postayı yanıtlayarak bize hemen ulaşabilirsiniz.\n\nİyi çalışmalar,\nLizart Dijital Ekibi`,
                            )}`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700 transition shadow-2xs"
                          >
                            <Mail size={13} />
                            Hatırlatıcı Gönder
                          </a>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            E-posta Yok
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
