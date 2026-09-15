"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Search, Layers, Images } from "lucide-react";
import type { Service } from "@/lib/data/services";
import { TransitionSlider } from "@/components/ui/TransitionSlider";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Kategoriler (Sıralı 01, 02, 03...)                                 */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  { key: "all", num: "01", label: "Tüm Hizmetler" },
  { key: "web", num: "02", label: "Web & E-Ticaret" },
  { key: "yazilim", num: "03", label: "Mobil & Özel Yazılım" },
  { key: "buyume", num: "04", label: "SEO & Büyüme" },
  { key: "pazarlama", num: "05", label: "Dijital Reklam" },
  { key: "tasarim", num: "06", label: "Tasarım & Prodüksiyon" },
] as const;

type CatKey = (typeof CATEGORIES)[number]["key"];

const DEFAULT_META: Record<string, { image: string; gallery: string[]; category: CatKey; badge: string }> = {
  "web-sitesi-kurulumu": {
    image: "/gorseller/hizmetler/web-kurulum-v2-real.webp",
    gallery: ["/gorseller/hizmetler/web-tasarim-studio-real.webp"],
    category: "web",
    badge: "En Çok Tercih Edilen",
  },
  "eticaret-cozumleri": {
    image: "/gorseller/hizmetler/eticaret-real.webp",
    gallery: ["/gorseller/hizmetler/hero-eticaret-realistic.webp"],
    category: "web",
    badge: "Dönüşüm Odaklı",
  },
  "mobil-uygulama-gelistirme": {
    image: "/gorseller/hizmetler/mobil-uygulama-real.webp",
    gallery: ["/gorseller/hizmetler/hero-mobil-realistic.webp"],
    category: "yazilim",
    badge: "iOS & Android",
  },
  "ozel-yazilim-gelistirme": {
    image: "/gorseller/hizmetler/hizmet-ozel-yazilim.webp",
    gallery: ["/gorseller/hizmetler/hero-ozel-yazilim-realistic.webp"],
    category: "yazilim",
    badge: "Kurumsal Çözüm",
  },
  "seo-hizmetleri": {
    image: "/gorseller/hizmetler/hero-seo-realistic.webp",
    gallery: ["/gorseller/hizmetler/hizmet-seo.webp"],
    category: "buyume",
    badge: "1. Sıra Odaklı",
  },
  "sosyal-medya-yonetimi": {
    image: "/gorseller/hizmetler/hizmet-reklam-pazarlama.webp",
    gallery: ["/gorseller/hizmetler/hero-reklam-realistic.webp"],
    category: "pazarlama",
    badge: "Aylık Yönetim",
  },
  "meta-reklam-yonetimi": {
    image: "/gorseller/hizmetler/hero-reklam-realistic.webp",
    gallery: ["/gorseller/hizmetler/hizmet-reklam-pazarlama.webp"],
    category: "pazarlama",
    badge: "Yüksek ROI",
  },
  "google-ads-yonetimi": {
    image: "/gorseller/hizmetler/google-ads-real.webp",
    gallery: ["/gorseller/hizmetler/hero-seo-realistic.webp"],
    category: "pazarlama",
    badge: "Arama & Alışveriş",
  },
  "saglik-turizmi-cozumleri": {
    image: "/gorseller/hizmetler/health-tourism-real.webp",
    gallery: ["/gorseller/referanslar/zenitdent-masaustu.webp"],
    category: "web",
    badge: "Çok Dilli Altyapı",
  },
  "grafik-tasarim": {
    image: "/gorseller/hizmetler/branding-design-real.webp",
    gallery: ["/gorseller/hizmetler/web-tasarim-studio-real.webp"],
    category: "tasarim",
    badge: "Kreatif Dil",
  },
  "kurumsal-kimlik": {
    image: "/gorseller/hizmetler/branding-design-real.webp",
    gallery: ["/gorseller/hizmetler/hizmet-web-tasarim.webp"],
    category: "tasarim",
    badge: "Logo & Kılavuz",
  },
  "video-ve-icerik-uretimi": {
    image: "/gorseller/hizmetler/video-content-real.webp",
    gallery: ["/gorseller/ajans/hizmet-video-1.svg"],
    category: "tasarim",
    badge: "4K & Reels",
  },
  "teknik-destek-ve-bakim": {
    image: "/gorseller/hizmetler/hero-ozel-yazilim-realistic.webp",
    gallery: ["/gorseller/hizmetler/web-kurulum-v2-real.webp"],
    category: "yazilim",
    badge: "Kesintisiz Destek",
  },
};

export function ServicesDirectory({ services }: { services: Service[] }) {
  const [activeCat, setActiveCat] = useState<CatKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Kategoriye ait hizmeti belirle
  function getServiceCategory(srv: Service): string {
    if (srv.category) return srv.category;
    return DEFAULT_META[srv.slug]?.category || "web";
  }

  // Kategori bazlı sayaçlar
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: services.length };
    CATEGORIES.forEach((c) => {
      if (c.key !== "all") {
        map[c.key] = services.filter((s) => getServiceCategory(s) === c.key).length;
      }
    });
    return map;
  }, [services]);

  // Filtreleme mantığı
  const filtered = useMemo(() => {
    return services.filter((srv) => {
      const cat = getServiceCategory(srv);
      if (activeCat !== "all" && cat !== activeCat) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = srv.title.toLowerCase().includes(q);
        const matchesSummary = srv.summary.toLowerCase().includes(q);
        const matchesSlug = srv.slug.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesSlug) return false;
      }
      return true;
    });
  }, [services, activeCat, searchQuery]);

  const activeCategoryObj = CATEGORIES.find((c) => c.key === activeCat) || CATEGORIES[0];

  return (
    <div className="space-y-10" suppressHydrationWarning>
      {/* ─── 1. SIRALI KATEGORİ MENÜSÜ & ARAMA ÇUBUĞU (FERAH VE TEMİZ) ─── */}
      <div className="rounded-[2.25rem] border border-ink-100 bg-surface p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-brand-700">
              Sıralı Hizmet Kataloğu
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
              İhtiyacınıza Uygun Hizmeti Seçin
            </h2>
            <p className="mt-1 text-sm font-semibold text-ink-500">
              Şeffaf fiyatlandırma, aşamalı teslim ve tam mülkiyet garantisiyle hizmet paketlerimiz.
            </p>
          </div>

          {/* Arama Kutusu */}
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-ink-400" />
            <input
              type="text"
              placeholder="Hizmetlerde ara (Örn: E-Ticaret, SEO, Mobil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-2xl border border-ink-200 bg-surface-2/60 pl-10 pr-9 text-xs sm:text-sm font-bold text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-ink-200 text-xs font-black text-ink-700 hover:bg-ink-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sıralı Kategori Butonları (01, 02, 03, 04, 05, 06) */}
        <div className="flex flex-wrap items-center gap-2 border-t border-ink-100/80 pt-5">
          {CATEGORIES.map((c) => {
            const isActive = activeCat === c.key;
            const count = counts[c.key] ?? 0;

            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setActiveCat(c.key)}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "bg-surface-2/80 text-ink-700 hover:bg-brand-50 hover:text-brand-800"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] font-extrabold transition",
                    isActive ? "text-white/80" : "text-brand-600"
                  )}
                >
                  {c.num}.
                </span>
                <span>{c.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    isActive ? "bg-white/20 text-white" : "bg-ink-200/70 text-ink-700"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. HİZMET KARTLARI (FERAH, GENİŞ, SIRALI & GÖRSELLİ) ─── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-ink-900">
            {activeCategoryObj.label} ({filtered.length} Hizmet)
          </h3>
          {(activeCat !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setActiveCat("all");
                setSearchQuery("");
              }}
              className="text-xs font-black text-brand-700 hover:underline"
            >
              Filtreleri Temizle ↺
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-ink-200 bg-surface p-12 text-center shadow-xs">
            <p className="text-base font-bold text-ink-900">
              Aramanıza uygun bir hizmet bulunamadı.
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Lütfen arama terimini değiştirin veya kategori filtresini sıfırlayın.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCat("all");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center rounded-2xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700"
            >
              Tüm Hizmetleri Göster
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service, index) => {
              const meta = DEFAULT_META[service.slug];
              const cardImage = service.image || meta?.image || "/gorseller/hizmetler/web-kurulum-v2-real.webp";
              const badgeText = service.badge || meta?.badge || "Profesyonel";
              const price = service.packages?.[0]?.price || "Teklif Alın";
              const itemNumber = String(index + 1).padStart(2, "0");

              const galleryImages = (service.gallery && service.gallery.length > 0 ? service.gallery : meta?.gallery) || [];
              const allImages = Array.from(new Set([cardImage, ...galleryImages].filter(Boolean)));

              return (
                <article
                  key={service.slug}
                  className="group relative flex flex-col overflow-hidden rounded-[2.25rem] border border-ink-100 bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_24px_50px_-20px_rgba(23,122,104,0.15)]"
                >
                  {/* Görsel Alanı (Geçişli Çoklu Slayt) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-ink-100 bg-surface-2">
                    <TransitionSlider
                      images={allImages}
                      alt={service.title}
                      aspectRatio="aspect-[16/10]"
                      objectFit="cover"
                      showDots={allImages.length > 1}
                      showArrows={allImages.length > 1}
                      showBadge={allImages.length > 1}
                      autoSlide={false}
                    />

                    {/* Sıra Numarası Rozeti (01, 02, 03...) */}
                    <span className="pointer-events-none absolute left-4 top-4 z-20 rounded-xl bg-ink-950/80 px-2.5 py-1 font-mono text-xs font-black text-white backdrop-blur-md">
                      #{itemNumber}
                    </span>

                    {/* Hizmet Rozeti */}
                    <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-xl bg-white/95 px-3 py-1 text-xs font-bold text-ink-900 shadow-sm backdrop-blur-md">
                      {badgeText}
                    </span>
                  </div>

                  {/* İçerik Alanı */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h4 className="text-lg font-black tracking-tight text-ink-900 transition-colors group-hover:text-brand-700">
                      <Link href={`/hizmetler/${service.slug}`} className="focus:outline-none">
                        {service.title}
                      </Link>
                    </h4>

                    <p className="mt-2.5 text-xs sm:text-sm font-medium leading-relaxed text-ink-500 line-clamp-2">
                      {service.summary}
                    </p>

                    {/* Faydalar (Madde Madde) */}
                    {service.benefits && service.benefits.length > 0 && (
                      <ul className="mt-5 space-y-2 border-t border-ink-100/80 pt-4">
                        {service.benefits.slice(0, 3).map((b) => (
                          <li key={b.title} className="flex items-center gap-2 text-xs font-bold text-ink-700">
                            <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-[#1f7a68]">
                              <Check size={10} strokeWidth={3} />
                            </span>
                            <span className="line-clamp-1">{b.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Fiyat Şeridi */}
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-surface-2/70 px-4 py-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-ink-400">
                        Başlangıç Fiyatı
                      </span>
                      <span className="text-sm font-black text-ink-950">
                        {price}
                      </span>
                    </div>

                    {/* Aksiyon Butonları */}
                    <div className="mt-5 flex items-center gap-2.5 pt-2">
                      <Link
                        href={`/hizmetler/${service.slug}`}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-600 text-xs font-bold text-white shadow-sm transition hover:bg-brand-700"
                      >
                        <span>Detaylı İncele</span>
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href={`/teklif?hizmet=${service.slug}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-ink-200 bg-white px-4 text-xs font-bold text-ink-700 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-800"
                      >
                        Teklif Al
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
