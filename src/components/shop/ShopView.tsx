import Link from "next/link";
import type React from "react";
import { Suspense } from "react";
import { 
  AppWindow, 
  Box, 
  Brush, 
  CheckCircle2, 
  Cpu, 
  ExternalLink,
  Globe2, 
  Monitor, 
  Smartphone, 
  Sparkles,
  Zap
} from "lucide-react";
import { getFilterOptions, searchProducts, type ShopFilters as Filters } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { ShopHeroShowcase } from "@/components/shop/ShopHeroShowcase";
import { SearchBox } from "@/components/layout/SearchBox";
import { Breadcrumb, ButtonLink, EmptyState, Skeleton } from "@/components/ui";
import { PRODUCT_TYPES, type SortKey } from "@/lib/constants";
import { getComparisonProductIds, getFavoriteIds } from "@/lib/actions/wishlist";
import { cn } from "@/lib/utils";

export type SearchParams = Record<string, string | string[] | undefined>;

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Monitor,
  app: Smartphone,
  webapp: AppWindow,
  system: Cpu,
  template: Brush,
  service: Box,
};

/** URL parametrelerini güvenli biçimde filtre nesnesine çevirir. */
export function parseFilters(sp: SearchParams): Filters & { view: "grid" | "list" } {
  const many = (key: string) => {
    const v = sp[key];
    if (!v) return undefined;
    return Array.isArray(v) ? v : [v];
  };
  const one = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const num = (key: string) => {
    const parsed = Number(one(key));
    return Number.isFinite(parsed) && parsed >= 0 && one(key) ? parsed : undefined;
  };
  const flag = (key: string) => (one(key) === "1" ? true : undefined);

  const minLira = num("minFiyat");
  const maxLira = num("maxFiyat");

  return {
    q: one("q"),
    type: many("tur"),
    category: many("kategori"),
    technology: many("teknoloji"),
    platform: many("platform"),
    style: many("stil"),
    minPrice: minLira !== undefined ? minLira * 100 : undefined,
    maxPrice: maxLira !== undefined ? maxLira * 100 : undefined,
    maxDelivery: num("teslim"),
    hasAdminPanel: flag("panel"),
    includesSetup: flag("kurulum"),
    includesSource: flag("kaynak"),
    multiLanguage: flag("dil"),
    hasPayment: flag("odeme"),
    isResponsive: flag("mobil"),
    onlyDiscounted: flag("indirimli"),
    sort: (one("siralama") as SortKey) ?? "onerilen",
    page: num("sayfa") ?? 1,
    perPage: 12,
    view: one("gorunum") === "list" ? "list" : "grid",
  };
}

export async function ShopView({
  searchParams,
  basePath = "/magaza",
  forcedType,
  title,
  description,
  breadcrumb,
}: {
  searchParams: SearchParams;
  basePath?: string;
  forcedType?: string;
  title: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
}) {
  const filters = parseFilters(searchParams);
  if (forcedType) filters.type = [forcedType];

  const [{ items, total, page, pageCount }, options, favoriteIds, compareIds] = await Promise.all([
    searchProducts(filters),
    getFilterOptions(),
    getFavoriteIds(),
    getComparisonProductIds(),
  ]);
  const favorites = new Set(favoriteIds);
  const comparing = new Set(compareIds);

  return (
    <div className="bg-canvas py-6 sm:py-8 lg:py-10">
      <div className="container-page">
        <Breadcrumb items={breadcrumb} />

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-ink-100 bg-white">
          <div className="grid lg:grid-cols-[1fr_1.1fr] lg:items-stretch">

            {/* ─── SOL: Metin & CTA ─── */}
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:py-14">
              {/* Rozetler */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-surface-2 px-3 py-1.5 text-[11px] font-semibold text-ink-600">
                  <Sparkles className="size-3 text-brand-500" />
                  Lizart Store
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
                  <Zap className="size-3" />
                  {total}+ hazır çözüm
                </span>
              </div>

              {/* Başlık */}
              <h1 className="mt-5 text-[2.2rem] font-black leading-[1.06] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.2rem]">
                Hazır altyapını seç,{" "}
                <span className="text-brand-600">markanı hızlıca</span>{" "}
                yayına al.
              </h1>

              {/* Açıklama */}
              <p className="mt-4 max-w-md text-sm leading-7 text-ink-500 sm:text-base sm:leading-8">
                {description || (
                  <>
                    Canlı demolu web siteleri, uygulamalar ve hazır sistemler.{" "}
                    <strong className="font-semibold text-ink-700">İnceleyin, karşılaştırın, satın alın</strong> — kurulumu Lizart yönetsin.
                  </>
                )}
              </p>

              {/* Butonlar */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#urunler"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-800 shadow-md shadow-ink-900/20"
                >
                  <span>Ürünleri İncele</span>
                  <ExternalLink className="size-3.5" />
                </Link>
                <Link
                  href="/teklif"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-ink-200 px-6 text-sm font-bold text-ink-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
                >
                  Projeme Uygununu Bul
                </Link>
              </div>

              {/* Arama */}
              <div className="mt-6 hidden max-w-md sm:block">
                <Suspense fallback={<Skeleton className="h-11 rounded-full" />}>
                  <SearchBox size="lg" placeholder="Klinik sitesi, e-ticaret, randevu sistemi..." />
                </Suspense>
              </div>

              {/* Özellik listesi */}
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 max-w-sm">
                {["Canlı demo erişimi", "48 saatte kurulum", "Sözleşmeli lisans", "12 ay destek"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 text-xs font-medium text-ink-500">
                    <CheckCircle2 className="size-3.5 shrink-0 text-brand-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* ─── SAĞ: Otomatik Değişen Referanslar Vitrini ─── */}
            <ShopHeroShowcase totalCount={total} />
          </div>
        </section>

        <nav id="urunler" aria-label="Ürün türleri" className="no-scrollbar mt-6 -mx-4 flex scroll-mt-28 gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
          <QuickTab href="/magaza" label="Tüm Ürünler" icon={Globe2} active={basePath === "/magaza"} />
          {PRODUCT_TYPES.map((t) => (
            <QuickTab
              key={t.key}
              href={t.href}
              label={t.label}
              icon={TYPE_ICONS[t.key] || Box}
              active={basePath === t.href}
            />
          ))}
        </nav>

        <div className="mt-8 grid gap-7 lg:grid-cols-[18rem_1fr] lg:gap-9">
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <ShopFilters options={options} resultCount={total} />
          </Suspense>

          <div>
            <Suspense fallback={<Skeleton className="h-12" />}>
              <ShopToolbar total={total} view={filters.view} />
            </Suspense>

            {items.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  title="Aradığınız kriterlere uygun ürün bulunamadı"
                  description="Filtreleri azaltmayı veya farklı bir kelime ile aramayı deneyin. Aradığınız altyapı hazır katalogda yoksa sizin için özel olarak geliştirebiliriz."
                  action={
                    <div className="flex flex-wrap justify-center gap-3">
                      <ButtonLink href={basePath} variant="outline">
                        Filtreleri Temizle
                      </ButtonLink>
                      <ButtonLink href="/teklif">Özel Teklif İste →</ButtonLink>
                    </div>
                  }
                />
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "mt-6 grid items-stretch gap-6",
                    filters.view === "grid" ? "sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1",
                  )}
                >
                  {items.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      view={filters.view}
                      isFavorite={favorites.has(p.id)}
                      isComparing={comparing.has(p.id)}
                    />
                  ))}
                </div>

                {pageCount > 1 && (
                  <Pagination page={page} pageCount={pageCount} sp={searchParams} basePath={basePath} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickTab({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  const Icon = icon;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200 shadow-2xs",
        active
          ? "border-ink-900 bg-ink-900 text-white shadow-md shadow-ink-900/20"
          : "border-ink-200 bg-surface text-ink-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800",
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      <span>{label}</span>
    </Link>
  );
}

function Pagination({
  page,
  pageCount,
  sp,
  basePath,
}: {
  page: number;
  pageCount: number;
  sp: SearchParams;
  basePath: string;
}) {
  function pageHref(n: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (v === undefined || k === "sayfa") continue;
      if (Array.isArray(v)) v.forEach((item) => next.append(k, item));
      else next.set(k, v);
    }
    if (n > 1) next.set("sayfa", String(n));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav aria-label="Sayfalama" className="mt-12 flex items-center justify-center gap-2 border-t border-ink-100 pt-8">
      {page > 1 && (
        <Link
          href={pageHref(page - 1)}
          className="flex h-10 items-center justify-center rounded-full border border-ink-200 bg-surface px-4 text-xs font-bold text-ink-700 hover:border-brand-300 hover:bg-brand-50"
        >
          ← Önceki
        </Link>
      )}

      <div className="flex items-center gap-1.5">
        {pages.map((n) => {
          const isCurrent = n === page;
          return (
            <Link
              key={n}
              href={pageHref(n)}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-full text-xs font-bold transition-all",
                isCurrent
                  ? "bg-ink-900 text-white shadow-md"
                  : "border border-ink-200 bg-surface text-ink-600 hover:border-brand-300 hover:bg-brand-50",
              )}
            >
              {n}
            </Link>
          );
        })}
      </div>

      {page < pageCount && (
        <Link
          href={pageHref(page + 1)}
          className="flex h-10 items-center justify-center rounded-full border border-ink-200 bg-surface px-4 text-xs font-bold text-ink-700 hover:border-brand-300 hover:bg-brand-50"
        >
          Sonraki →
        </Link>
      )}
    </nav>
  );
}
