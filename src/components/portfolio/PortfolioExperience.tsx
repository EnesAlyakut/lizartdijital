"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Search,
  X,
  Lock,
  Globe2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE, whatsappLink } from "@/lib/constants";

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  category: string;
  summary: string;
  coverImage: string;
  mobileImage: string | null;
  liveUrl: string | null;
  deliverables?: string | string[];
  technologies?: string | string[];
  results?: string | { label: string; value: string }[];
  isFeatured?: boolean;
};

type Props = {
  projects: ProjectItem[];
  categories: { category: string; count: number }[];
  totalCount: number;
  initialCategory?: string;
};

const CATEGORY_NAMES: Record<string, string> = {
  all: "Tüm Çalışmalar",
  web: "Web Tasarım & Yazılım",
  eticaret: "E-Ticaret",
  saglik: "Sağlık & Medikal",
  reklam: "Reklam & Tabela",
  mobil: "Mobil Uygulama",
  yazilim: "Özel Yazılım",
  marka: "Marka & Kurumsal",
};

function cleanDomain(url?: string | null) {
  if (!url) return null;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function PortfolioExperience({
  projects,
  categories,
  totalCount,
  initialCategory = "all",
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = activeCategory === "all" || project.category === activeCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.client.toLowerCase().includes(query) ||
        project.sector.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8faf7] pb-24 text-ink-900">
      {/* =====================================================
          1. FERAH, AYDINLIK VE LÜKS KAHRAMAN ALANI (HERO)
          ===================================================== */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-[#f2f6f1] via-[#f7faf5] to-[#f8faf7] py-14 sm:py-20">
        {/* Zarif arka plan radial ışıkları */}
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-[#22774a]/12 to-transparent blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#1b5e39]/8 blur-3xl" />

        <div className="container-page relative text-center">
          {/* Üst Rozet */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2b543c]/25 bg-white/90 px-4 py-1.5 text-xs font-bold text-[#1a5d38] shadow-xs backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22774a] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#22774a]" />
            </span>
            <span>Lizart Dijital · Canlı Portföy &amp; Seçkin Projeler</span>
          </div>

          {/* Ana Başlık */}
          <h1 className="mx-auto mt-5 max-w-4xl text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-ink-950 leading-[1.14]">
            Fikirleri Yaşayan, Kazandıran <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#174e30] via-[#22774a] to-[#2c935d] bg-clip-text text-transparent">
              Dijital Başarılara
            </span>{" "}
            Dönüştürüyoruz.
          </h1>

          {/* Alt Açıklama */}
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-ink-600 font-normal">
            Kurumsal web sitelerinden yüksek performanslı e-ticaret platformlarına; Google PageSpeed 95+ skorlu,
            mobil öncelikli ve yayında olan canlı müşteri referanslarımız.
          </p>

          {/* Hızlı Güven & Metrik Rozetleri */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-semibold text-ink-700">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5e2d1] bg-white px-3.5 py-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-[#22774a]" />
              <strong>{totalCount}+</strong> Canlı Proje
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5e2d1] bg-white px-3.5 py-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-[#22774a]" />
              <strong>%100</strong> Mobil &amp; Retina Uyum
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5e2d1] bg-white px-3.5 py-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-[#22774a]" />
              <strong>PageSpeed 95+</strong> Hız Optimizasyonu
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d5e2d1] bg-white px-3.5 py-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-[#22774a]" />
              <strong>4.9 / 5</strong> Müşteri Memnuniyeti
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. FİLTRE VE ARAMA KONTROL ŞERİDİ (STICKY)
          ===================================================== */}
      <section id="vitrin" className="sticky top-20 z-30 mb-8 border-b border-ink-200/80 bg-white/95 py-3.5 backdrop-blur-md shadow-xs">
        <div className="container-page">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Kategori Seçicileri */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:pb-0">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200",
                  activeCategory === "all"
                    ? "bg-[#16291f] text-white shadow-xs"
                    : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-800"
                )}
              >
                <span>Tüm Çalışmalar</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.65rem] font-black",
                    activeCategory === "all" ? "bg-[#274837] text-white" : "bg-ink-100 text-ink-600"
                  )}
                >
                  {totalCount}
                </span>
              </button>

              {categories.map((c) => {
                const label = CATEGORY_NAMES[c.category] ?? c.category;
                const isActive = activeCategory === c.category;
                return (
                  <button
                    key={c.category}
                    type="button"
                    onClick={() => setActiveCategory(c.category)}
                    className={cn(
                      "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200",
                      isActive
                        ? "bg-[#16291f] text-white shadow-xs"
                        : "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-800"
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[0.65rem] font-black",
                        isActive ? "bg-[#274837] text-white" : "bg-ink-100 text-ink-600"
                      )}
                    >
                      {c.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Arama Kutusu */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Müşteri, sektör veya teknoloji ara..."
                  className="w-full rounded-full border border-ink-200 bg-[#f8faf7] py-2 pl-9 pr-8 text-xs font-medium text-ink-900 placeholder:text-ink-400 focus:border-[#22774a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#22774a]/15"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-ink-500 whitespace-nowrap">
                {filteredProjects.length} Proje
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          3. SEÇKİN PROJELER VİTRİNİ (BROWSER + MOBİL MOCKUP)
          ===================================================== */}
      <div className="container-page">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-white py-20 px-4 text-center shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <Search className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-900">Aradığınız kriterlere uygun proje bulunamadı</h3>
            <p className="mt-2 max-w-md text-sm text-ink-500">
              Farklı bir arama kelimesi deneyebilir veya tüm çalışmaları görmek için filtreleri sıfırlayabilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#16291f] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-10">
            {filteredProjects.map((project, index) => {
              const host = cleanDomain(project.liveUrl);

              const techs = Array.isArray(project.technologies) ? project.technologies : [];
              const results = Array.isArray(project.results) ? project.results : [];
              const highlightTags =
                techs.length > 0
                  ? techs.slice(0, 3)
                  : ["Mobil Uyum %100", "Hızlı Açılış & SEO", "Özel Arayüz"];

              return (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#e1e9de] bg-white shadow-[0_8px_25px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#22774a]/50 hover:shadow-[0_20px_45px_-12px_rgba(20,50,30,0.12)]"
                >
                  <div>
                    {/* Görsel Vitrin Alanı (Modern Glass Header & Web Preview) */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0c1812]">
                      {/* Üst Cam Çubuk (Browser Bar) */}
                      <div className="absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-md">
                        {/* Trafik Işıkları */}
                        <div className="flex items-center gap-1.5" aria-hidden>
                          <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="size-2.5 rounded-full bg-[#27c93f]" />
                        </div>

                        {/* Domain Adresi */}
                        <div className="flex max-w-[200px] items-center gap-1.5 truncate rounded-full border border-white/15 bg-white/10 px-3 py-0.5 font-mono text-[0.68rem] font-medium text-white/90">
                          <span className="size-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                          <span className="truncate">{host ?? `${project.slug}.com`}</span>
                        </div>

                        {/* Canlı Yayında Göstergesi */}
                        <span className="text-[0.68rem] font-bold text-[#86e2b1]">Canlı Yayın</span>
                      </div>

                      {/* Masaüstü Ekran Görseli */}
                      <Link
                        href={`/projeler/${project.slug}`}
                        className="relative block h-full w-full pt-10"
                      >
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          priority={index < 2}
                          sizes="(max-width: 1024px) 100vw, 650px"
                          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>

                      {/* Yüzen Akıllı Telefon (Mobil) Çerçevesi */}
                      {project.mobileImage && (
                        <div className="absolute bottom-2.5 right-3.5 z-20 hidden w-20 overflow-hidden rounded-[1.2rem] border-[3px] border-[#070e0a] bg-[#070e0a] shadow-2xl transition-all duration-300 group-hover:-translate-y-1 sm:block sm:w-24">
                          <div className="mx-auto my-1 h-0.5 w-5 rounded-full bg-white/30" />
                          <div className="relative aspect-[9/18] w-full overflow-hidden rounded-b-[0.9rem] bg-black">
                            <Image
                              src={project.mobileImage}
                              alt={`${project.client} mobil`}
                              fill
                              sizes="100px"
                              className="object-cover object-top"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Proje Başlığı ve İçeriği */}
                    <div className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#d2e4d0] bg-[#edf5eb] px-3 py-0.5 text-xs font-bold text-[#1b5e39]">
                          {project.sector}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                          {project.client}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-ink-950 transition-colors group-hover:text-[#22774a] leading-snug">
                        <Link href={`/projeler/${project.slug}`}>{project.title}</Link>
                      </h2>

                      <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-600 font-normal">
                        {project.summary}
                      </p>

                      {/* Ölçülebilir Başarı Metrikleri */}
                      {results.length > 0 && (
                        <div className="mt-3.5 flex flex-wrap gap-2">
                          {results.slice(0, 2).map((r) => (
                            <span
                              key={r.label}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#ecf6ee] border border-[#d1e8d4] px-3 py-1 text-[0.72rem] font-bold text-[#1a5d39]"
                            >
                              <TrendingUp className="size-3 text-[#22774a]" />
                              {r.value} {r.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Teslimat / Teknoloji Etiketleri */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {highlightTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-ink-100 bg-[#f7faf5] px-2.5 py-1 text-[0.7rem] font-semibold text-ink-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alt Aksiyon Butonları */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-[#fbfdfa] px-6 py-4 sm:px-7">
                    <Link
                      href={`/projeler/${project.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#16291f] hover:bg-[#22774a] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <span>Vaka İncelemesi</span>
                      <ArrowRight className="size-3.5" />
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-xs font-bold text-ink-700 shadow-2xs transition-colors hover:border-[#22774a] hover:text-[#1b5e39]"
                      >
                        <Globe2 className="size-3.5 text-[#22774a]" />
                        <span>Canlı Site</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          4. GERÇEK MÜŞTERİ REFERANSLARI & İTİBAR ALANI
          ===================================================== */}
      <section className="mt-24 border-t border-ink-100 bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1a6b3a]">
              Güven veren iş ortaklığı, ölçülebilir sonuçlar
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
              İş Ortaklarımızın Gözünden Lizart
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-500">
              Yalnızca kod ve tasarım teslim etmiyor; markanızın büyüme yolculuğunda kalıcı bir teknik yol arkadaşı oluyoruz.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Koşuyolu Rezonans */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-brand-500/20 bg-gradient-to-b from-brand-50/40 via-white to-white p-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-sm font-bold text-amber-500">★★★★★</div>
                  <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    Öne Çıkan
                  </span>
                </div>
                <p className="mt-4 text-sm font-normal italic leading-relaxed text-ink-700">
                  &ldquo;10.000&apos;i aşkın danışanımıza biorezonans terapilerimizi sunuyoruz. Lizart
                  Dijital&apos;in hazırladığı yeni web sitemiz ve randevu akışımız
                  sayesinde başvurularımız rekor seviyeye ulaştı.&rdquo;
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-brand-200/50 pt-4">
                <div>
                  <p className="text-sm font-bold text-ink-950">Koşuyolu Rezonans</p>
                  <p className="text-xs text-ink-500">Bütüncül Sağlık &amp; Terapi</p>
                </div>
                <a
                  href="https://kosuyolurezonans.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                >
                  <span>Canlı Site</span>
                  <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>

            {/* Diğer 3 Referans */}
            {[
              {
                quote:
                  "Lizart Dijital ile çalışmak ofisimizin kurumsallığını bambaşka bir seviyeye taşıdı. Hem müvekkillerimizden harika geri dönüşler alıyoruz hem de mobil hızımız mükemmel.",
                name: "Tuğba Kanat",
                role: "Kanat Mali Müşavirlik",
              },
              {
                quote:
                  "E-ticaret mağazamızın açılış hızı ve motosiklet katalog filtreleri tam istediğimiz gibi oldu. Satışlarımız ve WhatsApp danışma dönüşümlerimiz belirgin şekilde arttı.",
                name: "Ada Motor Yönetimi",
                role: "Ada Motor İstanbul",
              },
              {
                quote:
                  "Tabela ve dijital baskı portföyümüzü kurumsal müşterilerimize gururla sunabileceğimiz yüksek prestijli ve modern bir vitrine kavuştuk.",
                name: "ENA Reklam Ekibi",
                role: "ENA Tabela & Reklam",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-ink-200 bg-surface-2 p-6 shadow-xs"
              >
                <div>
                  <div className="flex gap-1 text-sm font-bold text-amber-500">★★★★★</div>
                  <p className="mt-4 text-sm italic leading-relaxed text-ink-700 font-normal">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="mt-6 border-t border-ink-200 pt-4">
                  <p className="text-sm font-bold text-ink-950">{t.name}</p>
                  <p className="text-xs text-ink-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          5. MAT VE ASİL KAPANIŞ DÖNÜŞÜM ÇAĞRISI (CTA)
          ===================================================== */}
      <section className="mt-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#1d3521] bg-gradient-to-br from-[#1f3722] via-[#243f27] to-[#1c3220] px-7 py-12 sm:px-14 sm:py-16 text-white shadow-xl">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b6d8b4]">
                <span className="size-2 rounded-full bg-[#82cf7f]" />
                <span>Yeni Bir Proje Mi Planlıyorsunuz?</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
                Sıradaki başarı hikâyesi, <br className="hidden sm:inline" />
                <span className="text-[#b6d8b4]">sizin markanız olsun.</span>
              </h2>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#e0ede2] font-normal">
                İşinizi, hedeflerinizi ve beklentilerinizi konuşalım. Aynı iş gününde şeffaf kapsam ve sabit fiyat teklifinizi hazırlayalım.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/teklif"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#396b40] hover:bg-[#467f4f] px-7 py-4 text-sm font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
                >
                  <span>Ücretsiz Teklif &amp; Analiz Al</span>
                  <ArrowRight className="size-4" />
                </Link>

                <a
                  href={whatsappLink("Merhaba, portföyünüzü inceledim. Yeni projemiz için görüşmek istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#1a311e] hover:bg-[#203c26] px-6 py-4 text-sm font-bold text-[#bfe0bd] shadow-xs transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="size-4 text-[#82cf7f]" />
                  <span>WhatsApp ile Hızlı Danışın</span>
                </a>

                <span className="text-xs font-medium text-[#d4ded8] sm:ml-2">
                  veya arayın: <strong className="font-bold text-white">{SITE.phone}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
