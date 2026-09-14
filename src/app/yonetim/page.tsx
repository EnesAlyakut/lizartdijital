import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Eye,
  FolderKanban,
  LifeBuoy,
  MessageSquareText,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { ConfirmTransferButton, OrderStatusControl } from "@/components/admin/OrderControls";

export const metadata: Metadata = { title: "Dashboard | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function getTimeRanges() {
  const now = new Date();
  return {
    now,
    monthStart: new Date(now.getFullYear(), now.getMonth(), 1),
    weekAgo: new Date(now.getTime() - 7 * 24 * 3600 * 1000),
    dayAgo: new Date(now.getTime() - 24 * 3600 * 1000),
  };
}

export default async function AdminDashboard() {
  const { monthStart, weekAgo, dayAgo } = await getTimeRanges();

  const [
    revenue,
    monthRevenue,
    orderCount,
    pendingOrders,
    customerCount,
    productCount,
    serviceProductCount,
    portfolioCount,
    blogCount,
    publishedBlogs,
    draftBlogs,
    categoriesCount,
    openTickets,
    newOffers,
    abandonedCarts,
    recentOrders,
    topProducts,
    mostViewed,
    recentLogs,
    recentOffers,
    unreadMessages,
    pendingReviews,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { status: { notIn: ["bekliyor", "iptal"] } }, _sum: { total: true } }),
    prisma.order.aggregate({
      where: { status: { notIn: ["bekliyor", "iptal"] }, createdAt: { gte: monthStart } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "bekliyor" } }),
    prisma.user.count({ where: { role: { key: "customer" } } }),
    prisma.product.count(),
    prisma.product.count({ where: { type: "service" } }),
    prisma.portfolioProject.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.blogPost.count({ where: { isPublished: false } }),
    prisma.blogCategory.count(),
    prisma.supportTicket.count({ where: { status: { not: "kapali" } } }),
    prisma.offer.count({ where: { status: "yeni" } }),
    prisma.cart.count({ where: { items: { some: {} }, updatedAt: { lt: dayAgo } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, orderNumber: true, fullName: true, total: true, status: true, createdAt: true },
    }),
    prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, salesCount: true, basePrice: true },
    }),
    prisma.product.findMany({
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { id: true, name: true, slug: true, viewCount: true, demoCount: true },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 7,
      include: { user: { select: { fullName: true } } },
    }),
    prisma.offer.findMany({
      where: { createdAt: { gte: weekAgo } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, code: true, fullName: true, status: true, budget: true, createdAt: true },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const conversionBase = await prisma.product.aggregate({ _sum: { viewCount: true, salesCount: true } });
  const views = conversionBase._sum.viewCount ?? 0;
  const sales = conversionBase._sum.salesCount ?? 0;
  const conversionRate = views > 0 ? (sales / views) * 100 : 0;

  const stats = [
    { label: "Toplam ciro", value: formatPrice(revenue._sum.total ?? 0), change: `${monthRevenue._count} yeni sipariş`, icon: ShoppingBag, tone: "teal" },
    { label: "Bu ay", value: formatPrice(monthRevenue._sum.total ?? 0), change: "Aylık onaylı gelir", icon: BarChart3, tone: "blue" },
    { label: "Ürün / Paket", value: String(productCount), change: `${serviceProductCount} hizmet ürünü`, icon: Package, tone: "amber" },
    { label: "Referans", value: String(portfolioCount), change: "Canlı portföy verisi", icon: FolderKanban, tone: "violet" },
    { label: "Blog", value: String(blogCount), change: `${publishedBlogs} yayında, ${draftBlogs} taslak`, icon: BookOpenText, tone: "teal" },
    { label: "Blog kategori", value: String(categoriesCount), change: "İçerik sınıflandırma", icon: Sparkles, tone: "amber" },
    { label: "Hesap", value: String(customerCount), change: "Kayıtlı kullanıcı", icon: Users, tone: "blue" },
    { label: "Bekleyen işler", value: String(pendingOrders + openTickets + newOffers + unreadMessages + pendingReviews), change: `${pendingOrders} sipariş, ${openTickets} destek`, icon: MessageSquareText, tone: "rose" },
  ];

  const contentBars = [
    { label: "Ürünler", value: productCount },
    { label: "Referanslar", value: portfolioCount },
    { label: "Bloglar", value: blogCount },
    { label: "Kategoriler", value: categoriesCount },
  ];
  const maxContent = Math.max(...contentBars.map((item) => item.value), 1);

  return (
    <div className="space-y-8">
      {/* ─── Hero & Hızlı Eylem Kısayolları ─── */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 p-6 shadow-xs sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_21rem] lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles size={13} className="stroke-[2.5]" />
              Lizart Dijital Yönetim Merkezi
            </div>
            <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              İçerik, satış ve operasyonu tek ekrandan yönetin.
            </h1>
            <p className="mt-2.5 max-w-2xl text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
              Gerçek veritabanından beslenen yönetim paneli; ürün, blog, referans, sipariş, teklif, destek ve müşteri yorumlarını tek merkezde toplar.
            </p>

            {/* Hızlı İşlem Kısayolları */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/urunler"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f7a68] to-[#155e4f] px-4 text-xs font-black text-white shadow-sm shadow-[#1f7a68]/25 hover:from-[#176956] hover:to-[#104a3e] transition cursor-pointer"
              >
                <Plus size={15} className="stroke-[3]" />
                Yeni Paket / Ürün
              </Link>
              <Link
                href="/admin/blog"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5 shadow-2xs"
              >
                <BookOpenText size={15} />
                Yeni Blog
              </Link>
              <Link
                href="/admin/siparisler"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5 shadow-2xs"
              >
                <ShoppingBag size={15} />
                Siparişleri Gör
              </Link>
              <Link
                href="/admin/formlar"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5 shadow-2xs"
              >
                <MessageSquareText size={15} />
                Gelen Mesajlar
              </Link>
              <Link
                href="/admin/raporlar"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 text-xs font-bold text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5 shadow-2xs"
              >
                <BarChart3 size={15} />
                Detaylı Analitik
              </Link>
            </div>
          </div>

          {/* Dönüşüm Oranı Kartı (Vibrant Dark Emerald) */}
          <div className="relative overflow-hidden flex flex-col justify-between rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-[#0e3b33] via-[#145649] to-[#092923] p-5 text-white shadow-xl shadow-[#0e3b33]/20">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                  Dönüşüm Oranı
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black text-emerald-200">
                  <TrendingUp size={11} />
                  Canlı
                </span>
              </div>
              <p className="mt-2.5 text-4xl font-black tracking-tight text-white">%{conversionRate.toFixed(2)}</p>
              <p className="mt-1.5 text-xs font-medium text-emerald-100/75 leading-relaxed">
                {views.toLocaleString("tr-TR")} ürün incelemesinden {sales.toLocaleString("tr-TR")} satış gerçekleşti.
              </p>
            </div>
            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-teal-200 shadow-sm"
                  style={{ width: `${Math.min(Math.max(conversionRate, 5), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIZLI EYLEM & DURUM YÖNETİM MERKEZİ ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[#1f7a68]/10 text-[#1f7a68]">
              <Sparkles size={15} className="stroke-[2.5]" />
            </span>
            <h2 className="text-base font-black text-slate-950">Acil Eylem & Bekleyen Durumlar</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Tek tıkla ilgili duruma geçin</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Ödeme Bekleyen Siparişler */}
          <Link
            href="/admin/siparisler?durum=bekliyor"
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-sm shadow-amber-500/30">
                <ShoppingBag size={17} />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                pendingOrders > 0 ? "bg-amber-500 text-white animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                {pendingOrders} Bekleyen
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">Bekleyen Siparişler</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Havale / onay bekleyen</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-800">
              <span>Hemen İncele</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Açık Destek Talepleri */}
          <Link
            href="/admin/destek"
            className="group relative flex flex-col justify-between rounded-2xl border border-rose-200/90 bg-gradient-to-b from-rose-50/60 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-sm shadow-rose-500/30">
                <LifeBuoy size={17} />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                openTickets > 0 ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                {openTickets} Açık Talep
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">Destek Talepleri</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Müşteri teknik talepleri</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-rose-800">
              <span>Taleplere Git</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Yeni Teklifler */}
          <Link
            href="/admin/teklifler"
            className="group relative flex flex-col justify-between rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-sm shadow-blue-500/30">
                <BriefcaseBusiness size={17} />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                newOffers > 0 ? "bg-blue-600 text-white animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                {newOffers} Yeni Teklif
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">Fiyat Teklifleri</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Özel proje talepleri</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-800">
              <span>Teklifleri Gör</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Okunmamış Form Mesajları */}
          <Link
            href="/admin/formlar"
            className="group relative flex flex-col justify-between rounded-2xl border border-teal-200/90 bg-gradient-to-b from-teal-50/60 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:shadow-md hover:shadow-teal-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-[#1f7a68] to-teal-500 text-white shadow-sm shadow-[#1f7a68]/30">
                <MessageSquareText size={17} />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                unreadMessages > 0 ? "bg-[#1f7a68] text-white animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                {unreadMessages} Okunmamış
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">İletişim Mesajları</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Web formu mesajları</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#1f7a68]">
              <span>Mesajları Aç</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Moderasyon Bekleyen Yorumlar */}
          <Link
            href="/admin/yorumlar?durum=bekleyen"
            className="group relative flex flex-col justify-between rounded-2xl border border-purple-200/90 bg-gradient-to-b from-purple-50/60 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-sm shadow-purple-500/30">
                <Star size={17} />
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                pendingReviews > 0 ? "bg-purple-600 text-white animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                {pendingReviews} Bekleyen
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">Yorum Moderasyonu</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Müşteri değerlendirmeleri</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-purple-800">
              <span>Yayına İzin Ver</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Terk Edilen Sepetler */}
          <Link
            href="/admin/raporlar"
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-sm">
                <TrendingUp size={17} />
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-700">
                {abandonedCarts} Sepet
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-slate-900">Terk Sepetler</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Kurtarılabilir satışlar</p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <span>Analize Git</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* ─── Stats Grid ─── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <MetricCard key={s.label} {...s} />
        ))}
      </section>

      {/* ─── Son Siparişler (Doğrudan Durum Değiştirme ile) & Son Aktiviteler ─── */}
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <DashboardPanel title="Son Siparişler (Hızlı Durum Yönetimi)" actionHref="/admin/siparisler">
          {recentOrders.length === 0 ? (
            <EmptyAdminState text="Henüz sipariş yok." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-3 pl-1">Sipariş No</th>
                    <th className="pb-3">Müşteri</th>
                    <th className="pb-3">Tutar</th>
                    <th className="pb-3">Durum & Hızlı İşlem</th>
                    <th className="pb-3 text-right pr-1">İncele</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 pl-1">
                        <Link href={`/admin/siparisler/${o.id}`} className="font-extrabold text-[#1f7a68] hover:underline">
                          #{o.orderNumber}
                        </Link>
                        <p className="text-[10px] font-bold text-slate-400">{formatDate(o.createdAt)}</p>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid size-7 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-slate-700">
                            {o.fullName.slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-bold text-slate-900">{o.fullName}</span>
                        </div>
                      </td>
                      <td className="py-3 font-black text-slate-950">{formatPrice(o.total)}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <OrderStatusControl orderId={o.id} status={o.status} />
                          {o.status === "bekliyor" && (
                            <ConfirmTransferButton orderId={o.id} />
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right pr-1">
                        <Link
                          href={`/admin/siparisler/${o.id}`}
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200/90 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition shadow-2xs"
                        >
                          Detay →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel title="Sistem Aktiviteleri" actionHref="/admin">
          {recentLogs.length === 0 ? (
            <EmptyAdminState text="Henüz aktivite kaydı yok." />
          ) : (
            <ol className="space-y-2.5">
              {recentLogs.map((log) => (
                <li key={log.id} className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-200 hover:bg-slate-50">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white text-[#1f7a68] shadow-2xs border border-slate-200/60">
                    <Clock3 size={13} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-slate-900">
                      <span className="font-extrabold text-[#1f7a68]">{log.user?.fullName ?? "Sistem"}</span> · {log.action}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                      {log.entity} · {formatDate(log.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </DashboardPanel>
      </section>

      {/* ─── İçerik Dağılımı ve Sıralamalar ─── */}
      <section className="grid gap-5 xl:grid-cols-3">
        <RankCard
          title="En Çok Satan Paketler"
          items={topProducts.map((p) => ({ id: p.id, href: `/urun/${p.slug}`, name: p.name, value: `${p.salesCount} satış` }))}
        />
        <RankCard
          title="En Çok İncelenen Ürünler"
          items={mostViewed.map((p) => ({ id: p.id, href: `/urun/${p.slug}`, name: p.name, value: `${p.viewCount} görüntüleme` }))}
        />
        <RankCard
          title="Son Teklif Talepleri"
          items={recentOffers.map((o) => ({ id: o.id, href: "/admin/teklifler", name: `${o.fullName} · ${o.code}`, value: o.budget ?? o.status }))}
        />
      </section>
    </div>
  );
}

/* ─── Sub-components ─── */

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Package;
  tone: string;
}) {
  const styles: Record<
    string,
    { badge: string; border: string; glow: string; pill: string }
  > = {
    teal: {
      badge: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20",
      border: "hover:border-emerald-300",
      glow: "from-emerald-50/50 to-white",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
    blue: {
      badge: "bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-md shadow-blue-600/20",
      border: "hover:border-blue-300",
      glow: "from-blue-50/50 to-white",
      pill: "bg-blue-50 text-blue-700 border-blue-200/60",
    },
    amber: {
      badge: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20",
      border: "hover:border-amber-300",
      glow: "from-amber-50/50 to-white",
      pill: "bg-amber-50 text-amber-800 border-amber-200/60",
    },
    violet: {
      badge: "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md shadow-purple-600/20",
      border: "hover:border-purple-300",
      glow: "from-purple-50/50 to-white",
      pill: "bg-purple-50 text-purple-700 border-purple-200/60",
    },
    rose: {
      badge: "bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-md shadow-rose-600/20",
      border: "hover:border-rose-300",
      glow: "from-rose-50/50 to-white",
      pill: "bg-rose-50 text-rose-700 border-rose-200/60",
    },
  };

  const current = styles[tone] ?? styles.teal;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        current.glow,
        current.border,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105",
            current.badge,
          )}
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold",
            current.pill,
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

function DashboardPanel({
  title,
  actionHref,
  children,
}: {
  title: string;
  actionHref: string;
  children: React.ReactNode;
}) {
  const href = actionHref.replace(/^\/yonetim/, "/admin");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#1f7a68]" />
          <h2 className="text-sm font-black text-slate-900 sm:text-base">{title}</h2>
        </div>
        <Link
          href={href}
          className="group inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 transition hover:bg-[#1f7a68]/10 hover:text-[#1f7a68]"
        >
          Tümünü Gör
          <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      {children}
    </div>
  );
}

function BarRow({ label, value, max, tone = "cool" }: { label: string; value: number; max: number; tone?: "cool" | "warm" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-bold text-slate-600">{label}</span>
        <span className="font-black text-slate-950">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            tone === "cool"
              ? "bg-gradient-to-r from-[#1f7a68] to-teal-400"
              : "bg-gradient-to-r from-amber-500 to-orange-400",
          )}
          style={{ width: `${Math.max(7, (value / max) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-50/80 px-2.5 py-0.5 text-[11px] font-black text-emerald-800">
      {label}
    </span>
  );
}

function EmptyAdminState({ text }: { text: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-xs font-bold text-slate-400">
      {text}
    </div>
  );
}

function RankCard({
  title,
  items,
}: {
  title: string;
  items: { id: string; href: string; name: string; value: string }[];
}) {
  const getBadgeStyle = (index: number) => {
    if (index === 0) return "bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 font-black shadow-xs shadow-amber-500/30";
    if (index === 1) return "bg-gradient-to-tr from-slate-200 to-slate-300 text-slate-800 font-bold";
    if (index === 2) return "bg-gradient-to-tr from-orange-200 to-orange-300 text-orange-900 font-bold";
    return "bg-slate-100 text-slate-500 font-bold";
  };

  return (
    <DashboardPanel title={title} actionHref={items[0]?.href ?? "/yonetim"}>
      {items.length === 0 ? (
        <EmptyAdminState text="Gösterilecek veri yok." />
      ) : (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-transparent p-2 transition hover:border-slate-200/80 hover:bg-slate-50/80"
            >
              <Link href={item.href} className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-lg text-[11px]",
                    getBadgeStyle(i),
                  )}
                >
                  {i + 1}
                </span>
                <span className="truncate text-xs font-bold text-slate-800 group-hover:text-[#1f7a68] transition">
                  {item.name}
                </span>
              </Link>
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                {item.value}
              </span>
            </li>
          ))}
        </ol>
      )}
    </DashboardPanel>
  );
}
