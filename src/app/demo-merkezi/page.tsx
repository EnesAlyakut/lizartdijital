import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge, Breadcrumb, ButtonLink, EmptyState } from "@/components/ui";
import { SearchBox } from "@/components/layout/SearchBox";
import { PRODUCT_TYPE_LABELS, SITE } from "@/lib/constants";
import { SERVICES } from "@/lib/data/services";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Canlı Demo Merkezi — Hazır Web Siteleri & Hizmet Paketleri",
  description:
    "Satın almadan önce ürünleri ve hizmet paketlerini deneyin. Canlı web sitesi demoları, yönetim paneli demoları, mobil görünümler ve hizmet çözümleri.",
  alternates: { canonical: `${SITE.url}/demo-merkezi` },
};

/* ------------------------------------------------------------------ Hizmet Görselleri */

const SERVICE_IMAGES: Record<string, string> = {
  "web-sitesi-kurulumu":         "/gorseller/ajans/hizmet-web.svg",
  "eticaret-cozumleri":          "/gorseller/ajans/hizmet-eticaret.svg",
  "mobil-uygulama-gelistirme":   "/gorseller/ajans/hizmet-mobil.svg",
  "ozel-yazilim-gelistirme":     "/gorseller/ajans/hizmet-yazilim.svg",
  "seo-hizmetleri":              "/gorseller/ajans/hizmet-seo-analiz-1.svg",
  "sosyal-medya-yonetimi":       "/gorseller/ajans/hizmet-buyume.svg",
  "meta-reklam-yonetimi":        "/gorseller/ajans/sonuclar.svg",
  "google-ads-yonetimi":         "/gorseller/ajans/surec.svg",
  "saglik-turizmi-cozumleri":    "/gorseller/ajans/hizmet-marka.svg",
  "grafik-tasarim":              "/gorseller/ajans/hizmet-marka.svg",
  "kurumsal-kimlik":             "/gorseller/ajans/hizmet-marka.svg",
  "video-ve-icerik-uretimi":     "/gorseller/ajans/hizmet-video-1.svg",
  "teknik-destek-ve-bakim":      "/gorseller/ajans/hizmet-yazilim.svg",
};

export default async function DemoCenterPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tur?: string }>;
}) {
  const { q, tur } = await searchParams;

  // 1. Veritabanındaki ürün demolarını getir (eğer tur !== "service")
  const products =
    tur === "service"
      ? []
      : await prisma.product.findMany({
          where: {
            isPublished: true,
            demoUrl: { not: null },
            ...(tur ? { type: tur } : {}),
            ...(q ? { OR: [{ name: { contains: q } }, { shortDesc: { contains: q } }] } : {}),
          },
          orderBy: [{ isFeatured: "desc" }, { demoCount: "desc" }],
          select: {
            id: true,
            slug: true,
            name: true,
            type: true,
            shortDesc: true,
            coverImage: true,
            hasAdminPanel: true,
            demoCount: true,
            platforms: { select: { platform: { select: { slug: true, name: true } } } },
            category: { select: { name: true } },
          },
        });

  // 2. Hizmetler sayfasındaki 13 hizmet paketini demo olarak hazırla (eğer tur yoksa veya tur === "service")
  const showServices = !tur || tur === "service";
  const serviceItems = showServices
    ? SERVICES.filter((s) => {
        if (!q) return true;
        const query = q.toLowerCase();
        return (
          s.title.toLowerCase().includes(query) ||
          s.summary.toLowerCase().includes(query) ||
          s.hero.toLowerCase().includes(query)
        );
      }).map((s) => ({
        id: `service-${s.slug}`,
        slug: s.slug,
        name: s.title,
        type: "service",
        typeLabel: "Hizmet Paketleri",
        categoryName: s.packages[0]?.price ? `${s.packages[0].price}` : "Kurumsal Hizmet",
        shortDesc: s.summary,
        coverImage: SERVICE_IMAGES[s.slug] || "/gorseller/ajans/hizmet-web.svg",
        demoHref: `/demo-merkezi/${s.slug}`,
        serviceHref: `/hizmetler/${s.slug}`,
        isService: true,
        hasAdminPanel: s.slug.includes("yazilim") || s.slug.includes("eticaret") || s.slug.includes("web"),
        price: s.packages[0]?.price,
        badgeText: s.benefits[0]?.title || "Anahtar Teslim",
        hasMobile: s.slug.includes("mobil") || s.slug.includes("eticaret"),
      }))
    : [];

  const types = [
    { key: "website", label: "Web siteleri" },
    { key: "app", label: "Mobil uygulamalar" },
    { key: "webapp", label: "Web uygulamaları" },
    { key: "system", label: "Sistemler" },
    { key: "service", label: "Hizmet Paketleri" },
  ];

  const totalCount = products.length + serviceItems.length;

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Demo Merkezi" }]} />

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Canlı Demo Merkezi
        </h1>
        <p className="mt-3 leading-relaxed text-ink-500">
          Ürünleri ve hizmet paketlerini satın almadan önce deneyin. Her demoda masaüstü, tablet ve mobil görünümü inceleyebilir,
          yönetim paneline geçici hesapla girebilirsiniz. Demo verileri örnektir; gerçek müşteri bilgisi
          içermez ve düzenli aralıklarla sıfırlanır.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <SearchBox size="lg" placeholder="Demo veya hizmet ara…" />
          </Suspense>
        </div>
      </div>

      <nav aria-label="Demo türleri" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
        <TypePill href="/demo-merkezi" label="Tümü" active={!tur} />
        {types.map((t) => (
          <TypePill key={t.key} href={`/demo-merkezi?tur=${t.key}`} label={t.label} active={tur === t.key} />
        ))}
      </nav>

      {totalCount === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Bu kriterlere uygun demo bulunamadı"
            description="Farklı bir arama yapabilir veya tüm demoları listeleyebilirsiniz."
            action={<ButtonLink href="/demo-merkezi">Tüm demoları göster</ButtonLink>}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Ürün Demoları */}
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink-100 bg-surface transition-soft hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
            >
              <Link href={`/demo-merkezi/${p.slug}`} className="relative aspect-[4/3] overflow-hidden bg-ink-50" tabIndex={-1} aria-hidden>
                <Image
                  src={p.coverImage}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  <span className="font-medium text-brand-700">{PRODUCT_TYPE_LABELS[p.type] || p.type}</span>
                  <span aria-hidden>·</span>
                  <span>{p.category.name}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">
                  <Link href={`/demo-merkezi/${p.slug}`} className="hover:text-brand-700">
                    {p.name}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{p.shortDesc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.hasAdminPanel && <Badge tone="brand">Panel demosu</Badge>}
                  {p.platforms.some((pl) => ["android", "ios"].includes(pl.platform.slug)) && (
                    <Badge tone="outline">QR ile mobil</Badge>
                  )}
                </div>
                <ButtonLink href={`/demo-merkezi/${p.slug}`} variant="dark" size="sm" className="mt-4">
                  Demoyu aç
                </ButtonLink>
              </div>
            </article>
          ))}

          {/* 2. Hizmetler Sayfasından Eklenen Hizmet Demoları */}
          {serviceItems.map((s) => (
            <article
              key={s.id}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-brand-200/80 bg-surface transition-soft hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
            >
              <Link href={s.demoHref} className="relative aspect-[4/3] overflow-hidden bg-brand-50/40" tabIndex={-1} aria-hidden>
                <Image
                  src={s.coverImage}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-0.5 text-[0.68rem] font-bold text-white shadow-xs">
                  Hizmet Paketi
                </span>
                {s.price && (
                  <span className="absolute bottom-3 right-3 rounded-lg bg-ink-950/80 px-2 py-0.5 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
                    {s.price}
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-xs text-ink-400">
                  <span className="font-semibold text-brand-700">Hizmet Paketi</span>
                  <span aria-hidden>·</span>
                  <span className="text-ink-500">{s.categoryName}</span>
                </div>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">
                  <Link href={s.demoHref} className="hover:text-brand-700">
                    {s.name}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{s.shortDesc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="brand">Canlı Sistem Demolu</Badge>
                  <Badge tone="outline">{s.badgeText}</Badge>
                  {s.hasMobile && <Badge tone="neutral">Mobil Uyumlu</Badge>}
                </div>
                <div className="mt-4 flex gap-2">
                  <ButtonLink href={s.demoHref} variant="dark" size="sm" className="flex-1 justify-center">
                    Demoyu aç
                  </ButtonLink>
                  <Link
                    href={s.serviceHref}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-ink-200 px-3.5 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                  >
                    Paket Detayı
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function TypePill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        active ? "border-ink-900 bg-ink-900 text-canvas" : "border-ink-200 bg-surface text-ink-700 hover:border-ink-400",
      )}
    >
      {label}
    </Link>
  );
}
