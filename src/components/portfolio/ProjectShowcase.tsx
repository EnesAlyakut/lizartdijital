"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

export type ViewMode = "desktop" | "mobile";

export interface ProjectSlideItem {
  id: string;
  type: ViewMode;
  label: string;
  shortLabel: string;
  badge: string;
  icon: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export type ProjectShowcaseProps = {
  title: string;
  client: string;
  liveUrl?: string | null;
  desktopImage?: string;
  mobileImage?: string | null;
  slides?: ProjectSlideItem[];
  priority?: boolean;
};

export function ProjectShowcase({
  title,
  client,
  liveUrl,
  desktopImage = "",
  mobileImage,
  slides: customSlides,
  priority = true,
}: ProjectShowcaseProps) {
  const host = liveUrl
    ? liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  // Yalnızca bilgisayar ve telefon modları kullanılır (tablet tamamen kaldırıldı)
  const slides: ProjectSlideItem[] = useMemo(() => {
    if (customSlides && customSlides.length > 0) {
      return customSlides.filter((s) => s.type === "desktop" || s.type === "mobile");
    }
    return [
      {
        id: "desktop",
        type: "desktop",
        label: "Bilgisayar Görünümü",
        shortLabel: "Bilgisayar",
        badge: "Geniş Ekran / 1440px",
        icon: "💻",
        url: desktopImage,
        alt: `${client} bilgisayar masaüstü görünümü`,
      },
      {
        id: "mobile",
        type: "mobile",
        label: "Telefon Görünümü",
        shortLabel: "Telefon",
        badge: "Mobil Öncelikli / 390px",
        icon: "📱",
        url: mobileImage || desktopImage,
        alt: `${client} telefon mobil görünümü`,
      },
    ];
  }, [customSlides, desktopImage, mobileImage, client]);

  const desktopSlides = useMemo(() => slides.filter((s) => s.type === "desktop"), [slides]);
  const mobileSlides = useMemo(() => slides.filter((s) => s.type === "mobile"), [slides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeSlide = slides[currentIndex] || slides[0];
  const activeMode: ViewMode = activeSlide?.type || "desktop";

  const INTERVAL_MS = 5000;
  const STEP_MS = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const switchMode = (mode: ViewMode) => {
    const targetSlides = mode === "desktop" ? desktopSlides : mobileSlides;
    if (targetSlides.length > 0) {
      const targetIdx = slides.findIndex((s) => s.id === targetSlides[0].id);
      if (targetIdx !== -1) {
        goToSlide(targetIdx);
      }
    }
  };

  // 5 saniye aralıklarla otomatik geçiş
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (STEP_MS / INTERVAL_MS) * 100;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.07)] transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${client} cihaz görselleri vitrini`}
    >
      {/* 5 Saniye İlerleme Çubuğu */}
      <div className="h-1 w-full overflow-hidden bg-slate-100">
        <div
          className="h-full bg-[#22774a] transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Üst Navigasyon: Ana Cihaz Seçici (Bilgisayar vs Telefon) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-[#fafbfa] px-4 py-3.5 sm:px-6">
        {/* Sol: 2 Ana Cihaz Modu Butonları (Bilgisayar ve Telefon) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchMode("desktop")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer",
              activeMode === "desktop"
                ? "bg-[#223d26] text-white shadow-xs"
                : "bg-white text-ink-800 hover:bg-ink-50 border border-ink-200/90",
            )}
            aria-pressed={activeMode === "desktop"}
          >
            <span>💻</span>
            <span>Bilgisayar Modu</span>
            <span
              className={cn(
                "text-[0.7rem] px-2 py-0.5 rounded-full font-black",
                activeMode === "desktop" ? "bg-white/20 text-white" : "bg-ink-100 text-ink-700",
              )}
            >
              {desktopSlides.length} Ekran
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchMode("mobile")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer",
              activeMode === "mobile"
                ? "bg-[#223d26] text-white shadow-xs"
                : "bg-white text-ink-800 hover:bg-ink-50 border border-ink-200/90",
            )}
            aria-pressed={activeMode === "mobile"}
          >
            <span>📱</span>
            <span>Telefon Modu</span>
            <span
              className={cn(
                "text-[0.7rem] px-2 py-0.5 rounded-full font-black",
                activeMode === "mobile" ? "bg-white/20 text-white" : "bg-ink-100 text-ink-700",
              )}
            >
              {mobileSlides.length} Ekran
            </span>
          </button>
        </div>

        {/* Sağ: Otomatik Geçiş Durumu & Canlı Link */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-600">
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:inline-flex cursor-pointer shadow-2xs"
            title={isPaused ? "Otomatik geçişi başlat" : "Otomatik geçişi duraklat"}
          >
            <span className={cn("size-2 rounded-full", isPaused ? "bg-amber-400" : "bg-emerald-500 animate-pulse")} />
            <span>{isPaused ? "Durduruldu" : "5sn Otomatik Geçiş"}</span>
          </button>

          {host && (
            <a
              href={liveUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <span>{host}</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Alt Navigasyon: Aktif Cihazın Ekran Seçim Düğmeleri */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-white px-4 py-2.5 sm:px-6">
        <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">
          {activeMode === "desktop" ? "Bilgisayar Sayfaları:" : "Telefon Sayfaları:"}
        </span>
        {(activeMode === "desktop" ? desktopSlides : mobileSlides).map((s) => {
          const globalIdx = slides.findIndex((slide) => slide.id === s.id);
          const isActive = globalIdx === currentIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSlide(globalIdx)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-[#22774a] text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60",
              )}
            >
              {s.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Sahne / Görsel Alanı (Aydınlık Lüks Stüdyo Sahnesi) */}
      <div className="relative flex min-h-[440px] items-center justify-center bg-gradient-to-b from-[#f4f7f3] via-[#eaf0e8] to-[#f4f7f3] p-4 sm:min-h-[540px] sm:p-8 lg:min-h-[640px] lg:p-10">
        {/* 1. BİLGİSAYAR GÖRÜNÜMÜ */}
        {activeSlide.type === "desktop" && (
          <div className="w-full max-w-5xl animate-fade-in overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.15)]">
            {/* Tarayıcı Üst Çubuğu */}
            <div className="flex h-11 items-center justify-between gap-3 border-b border-slate-200/80 bg-[#f9faf9] px-4">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="size-3 rounded-full bg-[#ff5f56]" />
                <span className="size-3 rounded-full bg-[#ffbd2e]" />
                <span className="size-3 rounded-full bg-[#27c93f]" />
              </div>

              {host && (
                <div className="flex min-w-0 max-w-[360px] items-center gap-2 truncate rounded-lg border border-slate-200 bg-white px-3.5 py-1 text-xs font-bold text-slate-700 shadow-2xs">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="size-3.5 shrink-0 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  <span className="truncate">{host}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                  {activeSlide.label}
                </span>
              </div>
            </div>

            {/* Bilgisayar Ekran Görüntüsü */}
            <div
              className="relative w-full overflow-hidden bg-slate-50 transition-[aspect-ratio] duration-300 ease-out"
              style={{
                aspectRatio:
                  activeSlide.width && activeSlide.height
                    ? `${activeSlide.width} / ${activeSlide.height}`
                    : "1024 / 538",
                maxHeight: "640px",
              }}
            >
              <Image
                src={activeSlide.url}
                alt={activeSlide.alt}
                fill
                unoptimized
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* 2. TELEFON GÖRÜNÜMÜ */}
        {activeSlide.type === "mobile" && (
          <div className="flex flex-col items-center justify-center py-2 sm:py-6 animate-fade-in w-full">
            {/* Telefon Çerçevesi (Realistic iPhone Style) */}
            <div className="relative mx-auto w-64 sm:w-72 md:w-80 overflow-hidden rounded-[2.8rem] border-[10px] sm:border-[12px] border-slate-900 bg-slate-900 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
              {/* Dynamic Island / Hoparlör Çentiği */}
              <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-2.5 pb-1 pointer-events-none">
                <div className="h-4 w-24 rounded-full bg-black/90 flex items-center justify-end px-2.5 gap-1.5 shadow-inner">
                  <div className="size-2 rounded-full bg-blue-950/60 ring-1 ring-slate-800" />
                  <div className="size-1.5 rounded-full bg-emerald-500/80" />
                </div>
              </div>

              {/* Ekran İçeriği */}
              <div className="relative aspect-[550/1024] w-full overflow-hidden rounded-[2.1rem] bg-slate-950">
                <Image
                  src={activeSlide.url}
                  alt={activeSlide.alt}
                  fill
                  unoptimized
                  priority={priority}
                  sizes="(max-width: 768px) 90vw, 400px"
                  className="object-cover object-top"
                />
              </div>

              {/* Alt Gösterge Çubuğu (Home Indicator) */}
              <div className="absolute bottom-1 inset-x-0 flex justify-center pb-1 pointer-events-none">
                <div className="h-1 w-28 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Ekran Etiketi */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 shadow-xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeSlide.label}</span>
            </div>
          </div>
        )}

        {/* Gezinme Okları (Minimalist Beyaz Düğmeler) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex size-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#22774a] cursor-pointer sm:left-6"
              aria-label="Önceki cihaz görünümü"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex size-11 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-800 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#22774a] cursor-pointer sm:right-6"
              aria-label="Sonraki cihaz görünümü"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Alt Kontrol & Nokta Göstergeleri */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-white px-6 py-3.5">
        {/* Sol: Aktif Görünüm Bilgisi */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Görünüm:</span>
          <span className="text-xs font-bold text-slate-900">{activeSlide.label}</span>
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[0.7rem] font-bold text-slate-700 border border-slate-200 hidden sm:inline">
            {activeSlide.badge}
          </span>
        </div>

        {/* Orta: Nokta Göstergesi */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                idx === currentIndex
                  ? "w-6 bg-[#22774a]"
                  : "w-2 bg-slate-200 hover:bg-slate-300",
              )}
              aria-label={`Görünüm ${idx + 1}`}
            />
          ))}
        </div>

        {/* Sağ: Bilgilendirme */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>5 saniye aralıkla otomatik geçiş</span>
        </div>
      </div>
    </div>
  );
}
