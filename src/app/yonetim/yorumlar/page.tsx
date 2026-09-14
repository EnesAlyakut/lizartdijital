import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  DeleteReviewButton,
  ReviewApprovalButton,
} from "@/components/admin/ReviewControls";
import { EmptyState, Rating } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, MessageSquare, Star, Trash2, Boxes, Search, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Yorum Moderasyon Merkezi | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "Tümü" },
  { value: "bekleyen", label: "Onay Bekleyenler" },
  { value: "yayinda", label: "Sitede Yayında" },
];

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; q?: string }>;
}) {
  const { durum, q } = await searchParams;

  const [reviews, totalCount, pendingCount, approvedCount, avgRating] = await Promise.all([
    prisma.review.findMany({
      where: {
        ...(durum === "bekleyen"
          ? { isApproved: false }
          : durum === "yayinda"
            ? { isApproved: true }
            : {}),
        ...(q
          ? {
              OR: [
                { authorName: { contains: q } },
                { authorTitle: { contains: q } },
                { title: { contains: q } },
                { body: { contains: q } },
                { product: { name: { contains: q } } },
              ],
            }
          : {}),
      },
      orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
      take: 100,
      include: {
        product: { select: { name: true, slug: true } },
      },
    }),
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.review.count({ where: { isApproved: true } }),
    prisma.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* ─── Hero & Metrikler ─── */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_60px_-45px_rgb(15_23_42/.35)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223d26]/15 bg-[#223d26]/[0.06] px-3.5 py-1 text-xs font-semibold text-[#223d26]">
              <MessageSquare className="h-3.5 w-3.5 text-[#223d26]" />
              <span>Yorum & Moderasyon Yönetimi</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] leading-tight">
              Müşteri Yorumları & Denetim
            </h1>
            <p className="mt-2.5 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
              Müşterilerden gelen tüm yorumlar moderasyon kuyruğuna düşer. Uygunsuz yorumları engelleyip silebilir, olumlu yorumlara <strong className="font-semibold text-slate-700">&quot;Yayına İzin Ver&quot;</strong> diyerek sitede yayınlayabilirsiniz.
            </p>
          </div>

          {/* Mat Koyu Yeşil İstatistik Kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0 lg:w-[32rem]">
            {/* Toplam - Mavi */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                  <Boxes className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalCount}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kayıtlı Yorum</p>
              </div>
            </div>

            {/* Bekleyen - Turuncu/Amber (Dikkat) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Bekleyen</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600">{pendingCount}</div>
                <p className="mt-0.5 text-[11px] font-bold text-amber-500">Moderasyon</p>
              </div>
            </div>

            {/* Yayında - Zümrüt Yeşil (Onaylı) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Yayında</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{approvedCount}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Onaylandı</p>
              </div>
            </div>

            {/* Ort. Puan - Mor/Moruk (Puan/Yıldız) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-200/90 bg-gradient-to-b from-purple-50/60 to-white p-4 shadow-xs transition-all hover:border-purple-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">Ortalama</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xs">
                  <Star className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  {avgRating._avg.rating ? avgRating._avg.rating.toFixed(1) : "5.0"}
                </div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Yıldız Puan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arama & Filtreleme */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <form className="flex w-full sm:w-auto items-center gap-2" role="search">
              <div className="relative flex-1 sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Müşteri adı, ürün, başlık veya yorum içeriği..."
                  aria-label="Yorum ara"
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
                  href="/yonetim/yorumlar"
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Temizle</span>
                </Link>
              )}
            </form>

            <div className="text-xs font-medium text-slate-500 shrink-0 self-start sm:self-center">
              Toplam <span className="font-bold text-slate-800">{reviews.length}</span> yorum listeleniyor
            </div>
          </div>

          <nav aria-label="Yorum filtreleri" className="no-scrollbar flex flex-wrap items-center gap-1.5 pt-1">
            {FILTERS.map((f) => {
              const isActive = (durum ?? "") === f.value;
              return (
                <Link
                  key={f.value}
                  href={f.value ? `/yonetim/yorumlar?durum=${f.value}` : "/yonetim/yorumlar"}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-[#223d26] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  {f.label}
                  {f.value === "bekleyen" && pendingCount > 0 && (
                    <span className="ml-1.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* ─── Yorumlar Listesi ─── */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Yorum Listesi</h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {durum === "bekleyen"
                ? "Henüz onaylanmamış moderasyon bekleyen yorumlar"
                : durum === "yayinda"
                  ? "Sitede aktif yayınlanan onaylı müşteri yorumları"
                  : "Tüm yorumlar"}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700">
            {reviews.length} Yorum
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="Yorum bulunamadı"
              description="Seçtiğiniz filtreye uygun yorum kaydı bulunmuyor."
            />
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              return (
                <article
                  key={r.id}
                  className={`rounded-2xl border p-6 transition ${
                    !r.isApproved
                      ? "border-amber-300 bg-amber-50/30 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-base font-bold text-slate-900">
                          {r.authorName}
                        </span>
                        {r.authorTitle && (
                          <span className="text-xs font-medium text-slate-500">
                            ({r.authorTitle})
                          </span>
                        )}
                        {r.isVerified && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                            Onaylı Müşteri
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                        <span>İlgili Ürün:</span>
                        <Link
                          href={`/urun/${r.product.slug}`}
                          target="_blank"
                          className="text-[#223d26] hover:underline font-semibold"
                        >
                          {r.product.name}
                        </Link>
                        <span>·</span>
                        <span>{formatDate(r.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Rating value={r.rating} />
                      {!r.isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 shadow-2xs">
                          <Clock size={12} />
                          Onay Bekliyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          Yayında
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Yorum Başlığı ve İçeriği */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                    {r.title && (
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        {r.title}
                      </h3>
                    )}
                    <p className="text-sm font-medium leading-relaxed text-slate-800 whitespace-pre-line">
                      {r.body}
                    </p>
                  </div>

                  {/* İşlem Butonları */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2.5">
                      <ReviewApprovalButton reviewId={r.id} isApproved={r.isApproved} />
                    </div>

                    <div className="flex items-center gap-2">
                      <DeleteReviewButton reviewId={r.id} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
