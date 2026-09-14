"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; alt: string; viewport: string };

interface ProductGalleryProps {
  cover: string;
  images: GalleryImage[];
  name: string;
}

interface ShowcaseSlide {
  id: "desktop" | "mobile" | "tablet";
  label: string;
  shortLabel: string;
  badge: string;
  icon: string;
  url: string;
  alt: string;
}

export function ProductGallery({ cover, images, name }: ProductGalleryProps) {
  // Tam olarak 3 adet görsel kurgulanır:
  // 1. Ana Sayfa (Masaüstü)
  // 2. Telefon Modu (Mobil)
  // 3. Tablet / Detay Görünümü
  const desktopImg =
    images.find((i) => i.viewport === "desktop")?.url ||
    cover.replace("-kapak.svg", "-masaustu.svg") ||
    cover;

  const mobileImg =
    images.find((i) => i.viewport === "mobile")?.url ||
    cover.replace("-kapak.svg", "-mobil.svg");

  const tabletImg =
    images.find((i) => i.viewport === "tablet")?.url ||
    images.find((i) => i.viewport === "admin")?.url ||
    cover.replace("-kapak.svg", "-tablet.svg");

  const slides: ShowcaseSlide[] = [
    {
      id: "desktop",
      label: "Ana Sayfa (Masaüstü)",
      shortLabel: "Ana Sayfa",
      badge: "Masaüstü / 1440px",
      icon: "💻",
      url: desktopImg,
      alt: `${name} ana sayfa masaüstü görünümü`,
    },
    {
      id: "mobile",
      label: "Telefon Modu (Mobil)",
      shortLabel: "Telefon Modu",
      badge: "Mobil Uyumlu / 390px",
      icon: "📱",
      url: mobileImg,
      alt: `${name} telefon modu mobil görünümü`,
    },
    {
      id: "tablet",
      label: "Tablet Görünümü",
      shortLabel: "Tablet",
      badge: "Tablet / 1024px",
      icon: "📟",
      url: tabletImg,
      alt: `${name} tablet görünümü`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeSlide = slides[currentIndex];
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

  // 5 saniye aralıklarla otomatik geçiş ve ilerleme çubuğu
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
      className="group relative overflow-hidden rounded-[1.75rem] border border-ink-200/90 bg-surface shadow-xl transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label={`${name} ürün görselleri`}
    >
      {/* 5 Saniye İlerleme Çubuğu */}
      <div className="h-1 w-full bg-ink-100/60 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Üst Cihaz Modu Seçim Barı */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 bg-surface-2/60 px-4 sm:px-5 py-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-brand-500 text-white shadow-xs ring-2 ring-brand-500/20"
                    : "bg-surface text-ink-600 hover:bg-ink-100 hover:text-ink-900 border border-ink-200/60",
                )}
                aria-pressed={isActive}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.shortLabel}</span>
                {isActive && (
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-[0.75rem] text-ink-500">
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-surface px-2.5 py-0.5 font-medium hover:bg-ink-50 transition-colors"
            title={isPaused ? "Otomatik geçişi başlat" : "Otomatik geçişi duraklat"}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse",
              )}
            />
            <span className="hidden sm:inline">
              {isPaused ? "Durduruldu" : "5sn Geçiş"}
            </span>
          </button>
        </div>
      </div>

      {/* Sahne / Görsel Alanı */}
      <div className="relative min-h-[360px] sm:min-h-[440px] flex items-center justify-center bg-gradient-to-b from-ink-50/50 via-surface to-ink-50/70 p-4 sm:p-6">
        {/* 1. MASAÜSTÜ / ANA SAYFA GÖRÜNÜMÜ */}
        {activeSlide.id === "desktop" && (
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-ink-200/90 bg-surface shadow-lg transition-all animate-fade-in">
            {/* Tarayıcı Barı */}
            <div className="flex h-9 items-center justify-between gap-2 border-b border-ink-100 bg-surface px-3">
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="size-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-ink-200/70 bg-surface-2 px-3 py-0.5 text-[0.7rem] font-medium text-ink-600">
                <span className="text-emerald-600">🔒</span>
                <span>demo.lizartdijital.com</span>
              </div>
              <span className="text-[0.65rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Ana Sayfa
              </span>
            </div>

            {/* Görsel */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-950/5">
              <Image
                src={activeSlide.url}
                alt={activeSlide.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 760px"
                className="object-cover object-top"
              />
            </div>
          </div>
        )}

        {/* 2. TELEFON MODU (MOBİL) */}
        {activeSlide.id === "mobile" && (
          <div className="flex flex-col items-center justify-center py-2 animate-fade-in w-full">
            <div className="relative w-48 sm:w-56 overflow-hidden rounded-[2.2rem] border-[8px] sm:border-[10px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-white/20">
              {/* Dynamic Island */}
              <div className="absolute top-0 inset-x-0 z-20 flex justify-center pt-2 pb-0.5 pointer-events-none">
                <div className="h-3 w-16 rounded-full bg-black/90 flex items-center justify-end px-2 gap-1">
                  <div className="size-1.5 rounded-full bg-blue-950" />
                  <div className="size-1 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Ekran Görseli */}
              <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[1.7rem] bg-slate-950">
                <Image
                  src={activeSlide.url}
                  alt={activeSlide.alt}
                  fill
                  priority
                  sizes="260px"
                  className="object-cover object-top pt-1.5"
                />
              </div>

              {/* Alt Gösterge Çizgisi */}
              <div className="absolute bottom-1.5 inset-x-0 z-20 flex justify-center pointer-events-none">
                <div className="h-0.5 w-16 rounded-full bg-white/40" />
              </div>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface border border-ink-200/80 px-3 py-0.5 text-[0.7rem] font-semibold text-ink-700 shadow-xs">
              <span>📱</span>
              <span>Telefon Modu Görünümü</span>
            </span>
          </div>
        )}

        {/* 3. TABLET GÖRÜNÜMÜ */}
        {activeSlide.id === "tablet" && (
          <div className="flex flex-col items-center justify-center py-2 animate-fade-in w-full max-w-xl">
            <div className="relative w-full overflow-hidden rounded-2xl border-[10px] sm:border-[12px] border-slate-800 bg-slate-800 shadow-xl ring-1 ring-white/10">
              <div className="absolute top-1.5 inset-x-0 z-20 flex justify-center pointer-events-none">
                <div className="size-1.5 rounded-full bg-slate-950 ring-1 ring-slate-700" />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-950">
                <Image
                  src={activeSlide.url}
                  alt={activeSlide.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 680px"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface border border-ink-200/80 px-3 py-0.5 text-[0.7rem] font-semibold text-ink-700 shadow-xs">
              <span>📟</span>
              <span>Tablet & Orta Ekran Görünümü</span>
            </span>
          </div>
        )}

        {/* Sol Ok */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-10 items-center justify-center rounded-full bg-surface/90 text-ink-800 backdrop-blur-md shadow-md border border-ink-200/80 transition-all hover:scale-105 hover:text-brand-700 active:scale-95"
          aria-label="Önceki cihaz görseli"
        >
          <svg viewBox="0 0 24 24" className="size-4 sm:size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sağ Ok */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-10 items-center justify-center rounded-full bg-surface/90 text-ink-800 backdrop-blur-md shadow-md border border-ink-200/80 transition-all hover:scale-105 hover:text-brand-700 active:scale-95"
          aria-label="Sonraki cihaz görseli"
        >
          <svg viewBox="0 0 24 24" className="size-4 sm:size-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Alt Küçük Resimler (Thumbnails - Tam 3 Adet) */}
      <div className="border-t border-ink-100 bg-surface px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Sol: 3 Küçük Görsel Kutusu */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1 max-w-sm">
            {slides.map((s, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "group/thumb relative flex flex-col items-center rounded-xl p-1.5 border transition-all text-left",
                    isActive
                      ? "border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/20"
                      : "border-ink-200/70 hover:border-ink-400 bg-surface-2/40",
                  )}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-ink-100">
                    <Image
                      src={s.url}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[0.68rem] font-semibold text-ink-700 truncate w-full justify-center">
                    <span>{s.icon}</span>
                    <span className="truncate">{s.shortLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sağ: 5 Saniye Sayacı Bilgisi */}
          <div className="hidden sm:flex flex-col items-end text-[0.72rem] text-ink-400">
            <span className="font-semibold text-ink-600">Her 5 saniyede geçiş</span>
            <span>Hover yapınca duraklar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
