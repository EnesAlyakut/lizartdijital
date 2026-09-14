"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceSlideItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  image: string;
  detailUrl: string;
  tags: string[];
}

export const SERVICES_SLIDES: ServiceSlideItem[] = [
  {
    id: "web-tasarim",
    title: "Kurumsal Web Tasarım & Özel Yazılım",
    category: "Özel Tasarım & Web Çözümleri",
    badge: "Awwwards Seviyesi",
    description: "Markanıza özel arayüz tasarımı, mobil öncelikli hızlı mimari, SEO altyapısı ve kolay yönetilebilir içerik paneli.",
    image: "/gorseller/hizmetler/web-kurulum-v2-real.jpg",
    detailUrl: "/hizmetler/web-sitesi-kurulumu",
    tags: ["Next.js & React", "Mobil Öncelikli", "SEO 99/100", "Özel CMS"],
  },
  {
    id: "eticaret",
    title: "E-Ticaret & B2B Satış Mağazaları",
    category: "E-Ticaret & Satış Sistemleri",
    badge: "Satışa Hazır",
    description: "Sanal POS, anlaşmalı kargo, gelişmiş sepet ve stok yönetimiyle cironuzu artıran yüksek dönüşümlü e-ticaret siteleri.",
    image: "/gorseller/hizmetler/eticaret-real.jpg",
    detailUrl: "/hizmetler/eticaret-cozumleri",
    tags: ["Sanal POS & İyzico", "Kargo Takip", "Pazaryeri", "Hızlı Sepet"],
  },
  {
    id: "ozel-yazilim",
    title: "Özel Yazılım & Bulut Otomasyonu",
    category: "Yazılım Mühendisliği & Cloud",
    badge: "Uçtan Uca Çözüm",
    description: "İşletmenizin benzersiz iş akışlarına tam uyan ERP, CRM, bayi yönetim sistemleri ve kurumsal API entegrasyonları.",
    image: "/gorseller/hizmetler/hero-ozel-yazilim-realistic.png",
    detailUrl: "/hizmetler/ozel-yazilim-gelistirme",
    tags: ["ERP & CRM", "Süreç Otomasyonu", "Kaynak Kod", "Yüksek Güvenlik"],
  },
  {
    id: "mobil-uygulama",
    title: "Mobil Uygulama Geliştirme (iOS & Android)",
    category: "Mobil Teknolojiler",
    badge: "App Store & Google Play",
    description: "Kullanıcı dostu, hızlı ve mağaza onay süreçleri dahil yüksek performanslı native ve cross-platform mobil uygulamalar.",
    image: "/gorseller/hizmetler/mobil-uygulama-real.jpg",
    detailUrl: "/hizmetler/mobil-uygulama-gelistirme",
    tags: ["iOS & Android", "Push Bildirim", "API Mimarisi", "Mağaza Yayını"],
  },
  {
    id: "seo",
    title: "SEO & Organik Büyüme Stratejisi",
    category: "Arama Motoru Optimizasyonu",
    badge: "Kalıcı Trafik",
    description: "Google aramalarında ilk sayfaya taşıyan teknik SEO denetimleri, hız optimizasyonu ve ölçümlenebilir aylık büyüme raporu.",
    image: "/gorseller/hizmetler/hero-seo-realistic.png",
    detailUrl: "/hizmetler/seo-hizmetleri",
    tags: ["Teknik SEO", "PageSpeed 99+", "Kelime Analizi", "Aylık Rapor"],
  },
  {
    id: "reklam",
    title: "Meta & Google Reklam Yönetimi",
    category: "Performans Pazarlama & Ads",
    badge: "Yüksek ROAS",
    description: "Bütçenizi en verimli şekilde ciroya ve müşteriye dönüştüren veri odaklı Google Ads ve Instagram/Facebook reklam yönetimi.",
    image: "/gorseller/hizmetler/google-ads-real.jpg",
    detailUrl: "/hizmetler/meta-reklam-yonetimi",
    tags: ["Google Ads", "Instagram & Meta", "Dönüşüm Takibi", "5x ROAS"],
  },
];

export function HeroSlider({ slides = SERVICES_SLIDES }: { slides?: ServiceSlideItem[] }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;

  // Otomatik geçiş (6 saniyede bir)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  if (!total) return null;
  const active = slides[current % total];

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-black/50 p-5 sm:p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl text-white"
      role="region"
      aria-label="Lizart Dijital Hizmetleri"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Üst Çubuk & Mac Pencere Butonları */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="size-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-300">
            <Sparkles className="size-3.5 text-emerald-400" />
            Lizart Uzmanlık Alanları
          </span>
        </div>

        <Link
          href="/hizmetler"
          className="group inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition"
        >
          <span>Tüm Hizmetler</span>
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* Görsel Kart Alanı */}
      <Link
        href={active.detailUrl}
        className="group/slide relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-950 border border-white/10 shadow-lg cursor-pointer"
        aria-label={`${active.title} hizmetini incele`}
      >
        <Image
          key={active.id}
          src={active.image}
          alt={active.title}
          fill
          priority
          sizes="(max-width: 900px) 90vw, 700px"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Üst Rozet */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/50 px-3.5 py-1 text-xs font-black text-white shadow-lg backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {active.badge}
          </span>
        </div>

        {/* Alt Etiketler */}
        <div className="absolute bottom-3.5 left-3.5 z-10 hidden sm:flex flex-wrap gap-1.5 max-w-[80%]">
          {active.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-white/20 bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-md shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Büyütme / Ok Butonu */}
        <span className="absolute bottom-3.5 right-3.5 z-10 grid size-10 place-items-center rounded-xl bg-white text-slate-950 shadow-xl transition-transform duration-200 group-hover/slide:scale-110">
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </span>
      </Link>

      {/* Alt Bilgi ve Kontroller */}
      <div className="mt-4 flex items-center justify-between gap-4 pt-1">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
            {active.category}
          </span>
          <Link href={active.detailUrl} className="group/title block">
            <h3 className="line-clamp-1 text-base sm:text-lg font-black text-white transition-colors group-hover/title:text-emerald-300">
              {active.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-300">
            {active.description}
          </p>
        </div>

        {/* Kontrol Butonları */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">
            <strong className="text-white">{String(current + 1).padStart(2, "0")}</strong> / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Önceki Hizmet"
            onClick={() => setCurrent((current - 1 + total) % total)}
            className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Sonraki Hizmet"
            onClick={() => setCurrent((current + 1) % total)}
            className="grid size-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15 hover:text-white transition cursor-pointer"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* İlerleme Çizgileri */}
      <div className="mt-4 flex items-center gap-1.5 pt-1">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            aria-label={slide.title}
            aria-pressed={index === current}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer",
              index === current
                ? "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-sm"
                : "bg-white/15 hover:bg-white/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
