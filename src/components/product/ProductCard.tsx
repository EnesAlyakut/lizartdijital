import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Clock3, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge, ButtonLink, Price, Rating } from "@/components/ui";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";
import type { ProductCardData } from "@/lib/data/products";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { CompareButton, FavoriteButton } from "@/components/product/CompareButton";

/**
 * Mağaza ve vitrin listelerinde kullanılan kurumsal ve modern ürün kartı.
 * Safari / macOS tarzı tarayıcı çerçevesi ve net aksiyon düğmeleri içerir.
 */
export function ProductCard({
  product,
  view = "grid",
  isFavorite = false,
  isComparing = false,
  featured = false,
}: {
  product: ProductCardData;
  view?: "grid" | "list";
  isFavorite?: boolean;
  isComparing?: boolean;
  featured?: boolean;
}) {
  const href = `/urun/${product.slug}`;
  const techs = product.technologies.map((t) => t.technology.name).slice(0, 3);
  const defaultLicenseId = product.licenses[0]?.id;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-[#b9c8b4] bg-white shadow-[0_22px_64px_-54px_rgb(20_31_20/.85)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6f8f68] hover:shadow-[0_34px_82px_-54px_rgb(20_31_20/.95)]",
        featured && view === "grid" && "lg:-translate-y-3 lg:shadow-[0_42px_96px_-58px_rgb(20_31_20/.98)]",
        view === "list" && "sm:flex-row",
      )}
    >
      {featured && view === "grid" && (
        <div className="absolute right-4 top-4 z-20 rounded-md bg-[#17331b] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_-18px_rgb(0_0_0/.7)]">
          Öne çıkan
        </div>
      )}
      <div className={cn("flex flex-col", view === "list" && "sm:flex-row sm:flex-1")}>
        <div
          className={cn(
            "relative shrink-0 overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-100/70 via-slate-50 to-slate-100/50 p-4 sm:p-5",
            view === "list" ? "sm:w-72 sm:border-b-0 sm:border-r" : "",
          )}
        >
          <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="flex h-9 items-center justify-between border-b border-[#d7e1d2] bg-white px-3 text-xs text-[#4d5b50]">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#ff5f56]" />
                <span className="size-2 rounded-full bg-[#ffbd2e]" />
                <span className="size-2 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex min-w-0 items-center gap-1 rounded-md border border-[#d7e1d2] bg-[#f8faf6] px-2 py-0.5 font-mono text-[0.65rem] text-[#536255]">
                <ShieldCheck className="size-3 shrink-0 text-[#3f7a44]" />
                <span>demo.lizart.com.tr</span>
              </div>
              <span className="size-1.5 rounded-full bg-[#1fa15a] animate-pulse" />
            </div>

            <Link
              href={href}
              className={cn(
                "relative block w-full overflow-hidden bg-[#f6f8f3]",
                view === "list" ? "aspect-[16/10] sm:h-full" : "aspect-[16/10]",
              )}
              tabIndex={-1}
              aria-hidden
            >
              <Image
                src={product.coverImage}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-[#111811]/0 transition-colors group-hover:bg-[#111811]/8" />
            </Link>
          </div>

          <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-1.5">
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <Badge tone="sale">İndirimli</Badge>
            )}
            {product.isNew && <Badge tone="new">Yeni</Badge>}
            {product.isBestSeller && <Badge tone="dark">Çok satan</Badge>}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex min-h-5 items-center justify-between gap-2 text-xs uppercase tracking-[0.12em] text-[#6d786d]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-[#244f2a]">{PRODUCT_TYPE_LABELS[product.type] ?? "Ürün"}</span>
                <span aria-hidden>·</span>
                <span className="truncate">{product.category.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <CompareButton productId={product.id} active={isComparing} />
                <FavoriteButton productId={product.id} active={isFavorite} />
              </div>
            </div>

            <h3 className="mt-3 line-clamp-2 text-xl font-extrabold tracking-tight text-[#111811] transition-colors group-hover:text-[#244f2a]">
              <Link href={href} title={product.name}>
                {product.name}
              </Link>
            </h3>

            <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#354238]">
              {product.shortDesc}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {techs.map((t) => (
                <span
                  key={t}
                  className="inline-block rounded-md border border-[#ccd8c7] bg-[#f7f9f5] px-2.5 py-1 text-xs font-bold text-[#354238]"
                >
                  {t}
                </span>
              ))}
            </div>

            <ul className="mt-4 grid gap-2 text-xs font-semibold text-[#354238] sm:grid-cols-2">
              {product.isResponsive && <FeatureItem label="Mobil uyumlu %100" />}
              {product.hasAdminPanel && <FeatureItem label="Yönetim paneli" />}
              {product.includesSetup && <FeatureItem label="Anahtar teslim kurulum" />}
              {product.includesSource && <FeatureItem label="Kaynak kod dahil" />}
              {product.multiLanguage && <FeatureItem label="Çoklu dil desteği" />}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d7e1d2] bg-[#fbfcfa] p-5 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#6d786d]">
              LİSANS BEDELİ
            </span>
            <Price value={product.basePrice} compareValue={product.comparePrice} size="sm" />
          </div>

          <div className="text-right">
            {product.ratingCount > 0 ? (
              <Rating value={product.ratingAvg} count={product.ratingCount} size="sm" />
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#244f2a]">
                <Clock3 className="size-3.5" />
                48s Kurulum
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {product.demoUrl ? (
            <ButtonLink
              href={`/urun/${product.slug}`}
              variant="dark"
              size="sm"
              className="w-full justify-center rounded-md bg-[#111811] text-xs font-bold text-white hover:bg-[#244f2a]"
            >
              <span>İncele</span>
            </ButtonLink>
          ) : (
            <ButtonLink
              href={href}
              variant="dark"
              size="sm"
              className="w-full justify-center rounded-md bg-[#111811] text-xs font-bold text-white hover:bg-[#244f2a]"
            >
              <span>Paketi İncele</span>
            </ButtonLink>
          )}

          {defaultLicenseId ? (
            <AddToCartButton
              productId={product.id}
              licenseId={defaultLicenseId}
              size="sm"
              label="Satın Al"
            />
          ) : (
            <ButtonLink
              href={href}
              variant="primary"
              size="sm"
              className="w-full justify-center rounded-xl bg-[#1a3a25] text-xs font-bold text-white hover:bg-[#16301e]"
            >
              <span>Detaylar</span>
              <ArrowUpRight className="size-3.5" />
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}

function FeatureItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <Check className="size-3.5 text-emerald-600 shrink-0" />
      <span>{label}</span>
    </li>
  );
}
