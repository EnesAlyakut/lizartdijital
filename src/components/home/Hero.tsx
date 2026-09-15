"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Layers,
  LineChart,
  Monitor,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/lib/data/products";

const HERO_SLIDES = [
  {
    src: "/gorseller/hero/slide-1.webp",
    alt: "Modern Mimari Tasarım Stüdyosu",
  },
  {
    src: "/gorseller/hero/slide-2.webp",
    alt: "Minimalist Açık Ofis & Çalışma Alanı",
  },
  {
    src: "/gorseller/hero/slide-3.webp",
    alt: "Zarif İç Mimari & Ahşap Detaylar",
  },
  {
    src: "/gorseller/hero/slide-4.webp",
    alt: "Modern Mimari Cam Yapı & Su Yansıması",
  },
  {
    src: "/gorseller/hero/slide-5.webp",
    alt: "Ferah ve Aydınlık Teknoloji Çalışma Alanı",
  },
];

export function Hero({
  productCount,
}: {
  showcase?: ProductCardData[];
  productCount: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#040e0b] text-white pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-white/10">
      {/* ─── 5 Adet Geçişli Gerçekçi Arka Plan Görselleri (Görseller belirgin ve canlı) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-70" : "opacity-0",
              )}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className={cn(
                  "object-cover object-center transition-transform duration-[8000ms] ease-out",
                  isActive ? "scale-105" : "scale-100",
                )}
              />
            </div>
          );
        })}

        {/* Zarif ve Doğal Karartma: Görseller arka planda net seçilir, metinler rahat okunur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#040e0b]/80 via-black/35 to-[#040e0b]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_40%,rgba(4,14,11,0.25),rgba(4,14,11,0.75)_100%)]" />
      </div>

      {/* ─── Narin Ambient Glow (Çırtlak olmayan, doğal yumuşak ışık) ─── */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-800/6 blur-[160px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 container-page max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* ─── 1. ÜST YILDIZLI ROZET ─── */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs sm:text-sm font-medium text-slate-200 backdrop-blur-md shadow-sm mb-6 transition-transform hover:scale-[1.02]">
          <span className="text-amber-300">★</span>
          <span>Lizart Dijital · Teknoloji &amp; Yazılım Stüdyosu</span>
        </div>

        {/* ─── 2. MERKEZİ BÜYÜK BAŞLIK (Çırtlak olmayan, asil ve derin zümrüt tonu) ─── */}
        <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-white leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          İyi Bir İzlenim.{" "}
          <span className="text-[#9dc4a0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            Güçlü Bir Marka.
          </span>
          <br className="hidden sm:inline" />
          <span className="text-white sm:mt-1 inline-block">Doğru Dijital Ortak.</span>
        </h1>

        {/* ─── 3. MERKEZİ AÇIKLAMA METNİ ─── */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg font-normal leading-relaxed text-slate-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
          İşinizi anlıyor, markanıza yakışanı tasarlıyoruz. Hazır web sitelerinden yüksek performanslı e-ticaret platformlarına ve kurumsal özel yazılıma, hedeflerinizi güçlü bir dijital deneyime dönüştürüyoruz.
        </p>

        {/* ─── 4. MERKEZİ İKİLİ EYLEM BUTONLARI (Doğal, oturaklı ve çırtlak olmayan tonlar) ─── */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/teklif"
            className="group inline-flex h-13 sm:h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-[#1a6b3a] hover:bg-[#1e7d44] px-8 text-sm sm:text-base font-bold text-white shadow-lg shadow-black/40 border border-white/10 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Birlikte Başlayalım</span>
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/hizmetler"
            className="inline-flex h-13 sm:h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/25 bg-black/40 hover:bg-black/55 px-8 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-black/30"
          >
            <span>Neler Yapıyoruz?</span>
          </Link>
        </div>

        {/* ─── 5. ALT 3'LÜ YARI SAYDAM CAM KARTLAR (Arkadaki görseli yansıtır) ─── */}
        <div className="mt-12 sm:mt-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Kart 1: Deneyim */}
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md hover:bg-black/45 hover:border-white/20 transition-all shadow-lg shadow-black/30">
            <Award className="size-5 text-white/60 mb-2" />
            <span className="text-sm sm:text-base font-bold text-white">9+ Yıl Deneyim</span>
            <span className="text-xs text-white/50 mt-0.5">Sektörel Uzmanlık</span>
          </div>

          {/* Kart 2: Güvenlik & Proje */}
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md hover:bg-black/45 hover:border-white/20 transition-all shadow-lg shadow-black/30">
            <ShieldCheck className="size-5 text-white/60 mb-2" />
            <span className="text-sm sm:text-base font-bold text-white">150+ Kurumsal Proje</span>
            <span className="text-xs text-white/50 mt-0.5">Sözleşmeli &amp; Garantili Teslim</span>
          </div>

          {/* Kart 3: Hazır Çözümler */}
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md hover:bg-black/45 hover:border-white/20 transition-all shadow-lg shadow-black/30">
            <Zap className="size-5 text-white/60 mb-2" />
            <span className="text-sm sm:text-base font-bold text-white">{productCount}+ Hazır Çözüm</span>
            <span className="text-xs text-white/50 mt-0.5">Hızlı Kurulum &amp; 7/24 Destek</span>
          </div>
        </div>

        {/* ─── 5 Slayt Geçiş Göstergesi (Minimal & Asil Çizgiler) ─── */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2 z-10 relative">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Görsel ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                idx === currentSlide
                  ? "w-8 bg-white shadow-xs shadow-white/50"
                  : "w-2 bg-white/30 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    number: "01",
    title: "Web Tasarım & Özel Yazılım",
    text: "Markanızın karakterini yansıtan, mobil öncelikli ve hızlı modern web siteleri.",
    href: "/hizmetler/web-sitesi-kurulumu",
    icon: Monitor,
  },
  {
    number: "02",
    title: "E-Ticaret & Satış Sistemleri",
    text: "Sanal POS, kargo entegrasyonu ve stok yönetimiyle satışa hazır mağazalar.",
    href: "/magaza",
    icon: Layers,
  },
  {
    number: "03",
    title: "Dijital Büyüme & Reklam",
    text: "Google Ads, Meta reklamları ve SEO ile cironuzu artıran büyüme stratejileri.",
    href: "/hizmetler/meta-reklam-yonetimi",
    icon: LineChart,
  },
];

export function ServiceStrip() {
  return (
    <section id="hizmet-seridi" className="border-b border-slate-200/80 bg-white py-12 sm:py-16">
      <div className="container-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {/* Başlık Kartı */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-white p-6 shadow-xs">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1f7a68]">
                Uzmanlık Alanlarımız
              </span>
              <h2 className="mt-2 text-xl font-black text-slate-950 tracking-tight leading-snug">
                İşiniz için bütüncül bir dijital yaklaşım.
              </h2>
            </div>
            <Link
              href="/hizmetler"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1f7a68] hover:underline"
            >
              <span>Tüm Hizmetler</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Hizmet Kartları */}
          {services.map(({ icon: Icon, ...service }) => (
            <Link
              href={service.href}
              key={service.number}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#1f7a68]/40 hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-[#1f7a68] group-hover:bg-[#1f7a68] group-hover:text-white transition-colors">
                    <Icon size={21} strokeWidth={2} />
                  </span>
                  <span className="text-xs font-black text-slate-400">{service.number}</span>
                </div>
                <h3 className="mt-5 text-base font-black text-slate-900 group-hover:text-[#1f7a68] transition-colors flex items-center justify-between">
                  <span>{service.title}</span>
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-[#1f7a68] transition-colors" />
                </h3>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                  {service.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
      <span>İhtiyaca Özel Tasarım</span>
      <span className="size-1 rounded-full bg-slate-300" />
      <span>Mobil Uyumlu Deneyim</span>
      <span className="size-1 rounded-full bg-slate-300" />
      <span>Kaynak Kod Teslimi</span>
      <span className="size-1 rounded-full bg-slate-300" />
      <span>Sürdürülebilir Teknik Destek</span>
    </div>
  );
}
