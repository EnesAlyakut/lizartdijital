"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReferenceShowcaseItem {
  id: string;
  title: string;
  desc: string;
  client: string;
  sector: string;
  href: string;
  image: string;
  price: string;
  badge: string;
}

export const REFERENCE_SHOWCASE_ITEMS: ReferenceShowcaseItem[] = [
  {
    id: "ada-motor",
    title: "Vitrin E-Ticaret",
    desc: "Ada Motor · Satışa hazır mağaza",
    client: "Ada Motor",
    sector: "Motosiklet & Ekipman",
    href: "/urun/vitrin-eticaret-sitesi",
    image: "/gorseller/referanslar/adamotor-masaustu.png",
    price: "24.900 TL",
    badge: "Çok Satan",
  },
  {
    id: "zenit-dent",
    title: "Medica Klinik",
    desc: "Zenit Dent · Randevu odaklı sağlık sitesi",
    client: "Zenit Dent",
    sector: "Ağız & Diş Sağlığı",
    href: "/urun/medica-klinik-web-sitesi",
    image: "/gorseller/referanslar/zenitdent-hero-pc.png",
    price: "21.900 TL",
    badge: "Klinik & Randevu",
  },
  {
    id: "lazoglu-kuruyemis",
    title: "Gurme E-Ticaret Mağazası",
    desc: "Lazoğlu Kuruyemiş · Satış & Kargo Altyapısı",
    client: "Lazoğlu Kuruyemiş",
    sector: "Gıda & E-Ticaret",
    href: "/projeler/lazoglu-kuruyemis-eticaret-sitesi",
    image: "/gorseller/referanslar/lazoglukuruyemis-anasayfa-masaustu.png",
    price: "26.500 TL",
    badge: "Canlı Referans",
  },
  {
    id: "kanat-musavirlik",
    title: "Atlas Kurumsal Vitrin",
    desc: "Kanat Müşavirlik · Resmi kurumsal site",
    client: "Kanat Müşavirlik",
    sector: "Mali Müşavirlik & Finans",
    href: "/urun/atlas-kurumsal-web-sitesi",
    image: "/gorseller/referanslar/kanat-musavirlik-masaustu.png",
    price: "14.900 TL",
    badge: "Kurumsal Vitrin",
  },
  {
    id: "millwall-filo",
    title: "Filo Araç Kiralama Sistemi",
    desc: "Millwall · Online Rezervasyon & Filo",
    client: "Millwall Kurumsal Kiralama",
    sector: "Otomotiv & Filo Kiralama",
    href: "/projeler/millwal-kurumsal-kiralama-web-sitesi",
    image: "/gorseller/referanslar/millwallkurumsalkiralama-anasayfa-masaustu.png",
    price: "28.000 TL",
    badge: "Filo & Rezervasyon",
  },
  {
    id: "fms-hukuk",
    title: "Prestij Hukuk Bürosu",
    desc: "FMS Hukuk · Yetkin Avukatlık Portalı",
    client: "FMS Hukuk Bürosu",
    sector: "Hukuk & Danışmanlık",
    href: "/projeler/fms-hukuk-danismanlik-web-sitesi",
    image: "/gorseller/referanslar/fmshukuk-masaustu.png",
    price: "16.500 TL",
    badge: "Prestij Proje",
  },
  {
    id: "fk-kuruyemis",
    title: "Yüksek Hızlı E-Ticaret",
    desc: "FK Kuruyemiş · Hızlı Alışveriş Deneyimi",
    client: "FK Kuruyemiş",
    sector: "Gıda & E-Ticaret",
    href: "/projeler/fk-kuruyemis-eticaret-sitesi",
    image: "/gorseller/referanslar/fkkuruyemis-anasayfa-masaustu.png",
    price: "24.900 TL",
    badge: "E-Ticaret",
  },
  {
    id: "mac-mekanik",
    title: "Sanayi & Mühendislik B2B",
    desc: "Maç Mekanik · Endüstriyel Ürün Kataloğu",
    client: "Maç Mekanik",
    sector: "Mühendislik & Makine",
    href: "/projeler/mac-mekanik-ve-insaat-web-sitesi",
    image: "/gorseller/referanslar/macmekanik-hero-pc.png",
    price: "18.900 TL",
    badge: "B2B Çözüm",
  },
];

interface ShopHeroShowcaseProps {
  totalCount: number;
}

export function ShopHeroShowcase({ totalCount }: ShopHeroShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % REFERENCE_SHOWCASE_ITEMS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? REFERENCE_SHOWCASE_ITEMS.length - 1 : prev - 1
    );
  }, []);

  // Otomatik geçiş döngüsü (habire değişsin) - Fare üzerine gelince duraklar
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, nextSlide]);

  const currentItem = REFERENCE_SHOWCASE_ITEMS[activeIndex];
  const nextItem1 = REFERENCE_SHOWCASE_ITEMS[(activeIndex + 1) % REFERENCE_SHOWCASE_ITEMS.length];
  const nextItem2 = REFERENCE_SHOWCASE_ITEMS[(activeIndex + 2) % REFERENCE_SHOWCASE_ITEMS.length];

  return (
    <div
      className="relative border-t border-ink-100 bg-surface-2 p-5 lg:border-l lg:border-t-0 sm:p-6 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── Başlık & Durum Rozeti ─── */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-600" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Canlı Referanslarımız
            </p>
          </div>
          <h2 className="mt-0.5 text-base font-bold text-ink-900">
            Satışa Hazır Vitrin
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Slayt sayaç göstergesi */}
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/80 border border-ink-200 px-2.5 py-1 text-[11px] font-bold text-ink-600">
            <span>{activeIndex + 1}</span>
            <span className="text-ink-400">/</span>
            <span>{REFERENCE_SHOWCASE_ITEMS.length}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-ink-100 px-3 py-1.5 text-xs font-semibold text-ink-600 shadow-xs">
            <ShieldCheck className="size-3.5 text-brand-600" />
            Güvenli teslim
          </span>
        </div>
      </div>

      {/* ─── BÜYÜK VİTRİN KARTI (Habire Değişen Referans Görseli) ─── */}
      <div className="group relative block overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
        <Link href={currentItem.href} className="block">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
            {/* Arka plan referans görseli (Geçişli) */}
            {REFERENCE_SHOWCASE_ITEMS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-in-out",
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={`${item.client} — ${item.title}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              );
            })}

            {/* Rozet */}
            <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md">
              <Sparkles className="size-3 text-amber-300" />
              <span>{currentItem.badge}</span>
            </div>

            {/* Sektör Bilgisi */}
            <div className="absolute right-3 top-3 z-20 rounded-full bg-white/90 border border-black/10 px-2.5 py-1 text-[10px] font-bold text-ink-700 shadow-sm backdrop-blur-md">
              {currentItem.sector}
            </div>

            {/* Alt İlerleme Çubuğu */}
            <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-black/20">
              <div
                key={activeIndex}
                className={cn(
                  "h-full bg-brand-500",
                  !isHovered && "transition-all duration-[3500ms] ease-linear"
                )}
                style={{
                  width: !isHovered ? "100%" : "50%",
                  animation: !isHovered ? "showcaseProgress 3500ms linear" : "none",
                }}
              />
            </div>
          </div>

          {/* Kart Bilgileri */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 truncate">
                {currentItem.desc}
              </p>
              <h3 className="mt-0.5 text-sm font-bold text-ink-900 truncate">
                {currentItem.title}
              </h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-base font-black text-ink-900">{currentItem.price}</p>
              <span className="text-[10px] font-semibold text-brand-600 flex items-center gap-0.5 justify-end">
                İncele <ExternalLink className="size-2.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Manuel İleri/Geri Ok Butonları */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          aria-label="Önceki referans"
          className="absolute left-2 top-[30%] z-30 size-8 -translate-y-1/2 rounded-full bg-white/90 text-ink-800 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          aria-label="Sonraki referans"
          className="absolute right-2 top-[30%] z-30 size-8 -translate-y-1/2 rounded-full bg-white/90 text-ink-800 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ─── KÜÇÜK ÜRÜN KARTLARI (Sıradaki Referanslar - Tıklanabilir) ─── */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {[nextItem1, nextItem2].map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              const targetIdx = (activeIndex + idx + 1) % REFERENCE_SHOWCASE_ITEMS.length;
              setActiveIndex(targetIdx);
            }}
            className="group flex items-center gap-3 overflow-hidden rounded-xl border border-ink-100 bg-white p-2.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-card)] text-left cursor-pointer"
          >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-ink-100">
              <Image
                src={item.image}
                alt={`${item.title} referans görseli`}
                fill
                sizes="56px"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.08]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 truncate">
                {item.client}
              </p>
              <h3 className="mt-0.5 text-xs font-bold leading-snug text-ink-900 truncate">
                {item.title}
              </h3>
              <p className="mt-0.5 text-xs font-black text-ink-700">{item.price}</p>
            </div>
            <span className="text-[10px] font-bold text-ink-400 group-hover:text-brand-600 transition-colors">
              Görüntüle
            </span>
          </button>
        ))}
      </div>

      {/* ─── Minimal Navigasyon Noktaları (Tüm Referanslar) ─── */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {REFERENCE_SHOWCASE_ITEMS.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`${item.client} referansına geç`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                isActive
                  ? "w-6 bg-brand-600"
                  : "w-1.5 bg-ink-200 hover:bg-ink-400"
              )}
            />
          );
        })}
      </div>

      {/* ─── İstatistikler ─── */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          [String(totalCount), "ürün"],
          ["5.0★", "müşteri puanı"],
          ["SSL", "güvenli ödeme"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-xl bg-white border border-ink-100 px-3 py-2 text-center"
          >
            <p className="text-sm font-black text-ink-900">{value}</p>
            <p className="text-[11px] font-medium text-ink-400 capitalize">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
