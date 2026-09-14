"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TransitionSliderProps {
  images: string[];
  alt?: string;
  aspectRatio?: string; // e.g. "aspect-[16/10]" or "aspect-video"
  className?: string;
  objectFit?: "cover" | "contain";
  showDots?: boolean;
  showArrows?: boolean;
  showBadge?: boolean;
  autoSlide?: boolean;
  slideInterval?: number;
}

export function TransitionSlider({
  images = [],
  alt = "Görsel",
  aspectRatio = "aspect-[16/10]",
  className,
  objectFit = "cover",
  showDots = true,
  showArrows = true,
  showBadge = true,
  autoSlide = false,
  slideInterval = 4000,
}: TransitionSliderProps) {
  const cleanImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Görsel listesi değiştiğinde taşmayı önle
  useEffect(() => {
    if (currentIndex >= cleanImages.length && cleanImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [cleanImages.length, currentIndex]);

  // Otomatik geçiş (isteğe bağlı)
  useEffect(() => {
    if (!autoSlide || cleanImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cleanImages.length);
    }, slideInterval);
    return () => clearInterval(timer);
  }, [autoSlide, cleanImages.length, slideInterval]);

  if (cleanImages.length === 0) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-slate-100 text-slate-400 overflow-hidden",
          aspectRatio,
          className
        )}
      >
        <div className="flex flex-col items-center gap-1.5 p-4 text-center">
          <Images size={28} className="stroke-[1.5] text-slate-300" />
          <span className="text-[11px] font-bold text-slate-400">Görsel Eklenmedi</span>
        </div>
      </div>
    );
  }

  const hasMultiple = cleanImages.length > 1;

  function prevSlide(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === 0 ? cleanImages.length - 1 : prev - 1));
  }

  function nextSlide(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === cleanImages.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      className={cn(
        "group/slider relative overflow-hidden select-none",
        aspectRatio,
        className
      )}
    >
      {/* Slayt Görselleri & Akıcı Geçiş Animasyonu */}
      {cleanImages.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={`${src}-${idx}`}
            className={cn(
              "absolute inset-0 size-full transition-all duration-500 ease-out",
              isActive
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-95 pointer-events-none z-0"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${alt} — Görsel ${idx + 1}`}
              className={cn(
                "size-full transition-transform duration-700",
                objectFit === "contain"
                  ? "object-contain p-2"
                  : "object-cover object-center group-hover/slider:scale-105"
              )}
            />
          </div>
        );
      })}

      {/* Karartma gradyanı */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10" />

      {/* Birden fazla görsel varsa: Sol / Sağ Geçiş Okları */}
      {hasMultiple && showArrows && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Önceki Görsel"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft size={18} className="stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Sonraki Görsel"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight size={18} className="stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Sayfa / Görsel Rozeti (1 / 3) */}
      {hasMultiple && showBadge && (
        <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 font-mono text-[10px] font-extrabold text-white backdrop-blur-md shadow-sm">
          <Images size={11} />
          {currentIndex + 1} / {cleanImages.length}
        </span>
      )}

      {/* Alt Noktalar (Dots Göstergesi) */}
      {hasMultiple && showDots && (
        <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto">
          {cleanImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(dotIdx);
              }}
              aria-label={`Görsel ${dotIdx + 1}'e git`}
              className={cn(
                "transition-all rounded-full cursor-pointer",
                dotIdx === currentIndex
                  ? "w-5 h-1.5 bg-white shadow-sm"
                  : "size-1.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
