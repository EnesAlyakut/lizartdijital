import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Atom,
  Box,
  Container,
  Database,
  FileCode2,
  Gem,
  KeyRound,
  MessageCircle,
  Rocket,
  Search,
  Shield,
  ShieldCheck,
  Star,
  TrendingUp,
  Triangle,
  Zap,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getService, getAllServices } from "@/lib/data/services";
import { productCardSelect } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, ButtonLink, Card, SectionHeading } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.summary,
    alternates: { canonical: `${SITE.url}/hizmetler/${slug}` },
    openGraph: { title: service.metaTitle, description: service.summary },
  };
}

const SERVICE_IMAGES: Record<string, string> = {
  "web-sitesi-kurulumu": "/gorseller/hizmetler/web-kurulum-v2-real.jpg",
  "eticaret-cozumleri": "/gorseller/hizmetler/eticaret-real.jpg",
  "mobil-uygulama-gelistirme": "/gorseller/hizmetler/mobil-uygulama-real.jpg",
  "ozel-yazilim-gelistirme": "/gorseller/hizmetler/hizmet-ozel-yazilim.jpg",
  "seo-hizmetleri": "/gorseller/hizmetler/hizmet-seo.jpg",
  "sosyal-medya-yonetimi": "/gorseller/hizmetler/google-ads-real.jpg",
  "meta-reklam-yonetimi": "/gorseller/hizmetler/google-ads-real.jpg",
  "google-ads-yonetimi": "/gorseller/hizmetler/google-ads-real.jpg",
  "saglik-turizmi-cozumleri": "/gorseller/hizmetler/health-tourism-real.jpg",
  "grafik-tasarim": "/gorseller/hizmetler/branding-design-real.jpg",
  "kurumsal-kimlik": "/gorseller/hizmetler/branding-design-real.jpg",
  "video-ve-icerik-uretimi": "/gorseller/hizmetler/video-content-real.jpg",
  "teknik-destek-ve-bakim": "/gorseller/hizmetler/hizmet-ozel-yazilim.jpg",
};

const BENEFIT_ICONS = [Search, Zap, KeyRound, ShieldCheck, TrendingUp, Rocket];

const TECH_STACK = [
  { name: "Next.js 16", tag: "Full-Stack Framework", icon: Triangle },
  { name: "React 19", tag: "Modern UI", icon: Atom },
  { name: "TypeScript", tag: "Tip Güvenli Kod", icon: FileCode2 },
  { name: "PostgreSQL & MySQL", tag: "İlişkisel Veritabanı", icon: Database },
  { name: "Prisma ORM", tag: "Veri Yönetimi", icon: Gem },
  { name: "Docker & CI/CD", tag: "Konteyner ve Dağıtım", icon: Container },
  { name: "REST & GraphQL", tag: "Yüksek Hızlı API", icon: Zap },
  { name: "Redis", tag: "Önbellek & Kuyruk", icon: Box },
];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const [products, projects, reviews] = await Promise.all([
    prisma.product.findMany({
      where: { slug: { in: service.relatedProducts }, isPublished: true },
      select: productCardSelect,
    }),
    service.portfolioCategory
      ? prisma.portfolioProject.findMany({
          where: { category: service.portfolioCategory },
          orderBy: { completedAt: "desc" },
          take: 2,
          select: { id: true, slug: true, title: true, client: true, summary: true, testimonial: true },
        })
      : Promise.resolve([]),
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { rating: "desc" },
      take: 2,
      select: { id: true, authorName: true, authorTitle: true, body: true },
    }),
  ]);

  const serviceImage = service.image || SERVICE_IMAGES[slug] || "/gorseller/ajans/studyo.svg";

  return (
    <div className="bg-canvas overflow-hidden">
      {/* ─── 1. HERO ALANI (2 SÜTUNLU, ZENGİN GÖRSELLİ VE ETKİLEŞİMLİ) ──────── */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-surface via-surface-2/40 to-canvas py-12 sm:py-16 lg:py-24">
        {/* Arka plan parlama halkaları */}
        <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-brand-200/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-10 size-[300px] rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="container-page relative z-10">
          <nav aria-label="Sayfa yolu" className="text-xs sm:text-sm font-medium text-ink-500 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-700 transition-colors">
              Ana Sayfa
            </Link>
            <span className="text-ink-300">/</span>
            <Link href="/hizmetler" className="hover:text-brand-700 transition-colors">
              Hizmetler
            </Link>
            <span className="text-ink-300">/</span>
            <span className="text-ink-900 font-semibold">{service.title}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            {/* Sol Sütun: Başlık, Açıklama, Güven Maddeleri ve Aksiyonlar */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200/80 px-3.5 py-1 text-xs font-bold text-brand-800">
                  <span className="size-1.5 rounded-full bg-brand-500 animate-pulse" />
                  Lizart Kurumsal Hizmetleri
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-ink-200/80 px-3 py-1 text-xs font-medium text-ink-600 shadow-2xs">
                  Sözleşmeli & Faturalı
                </span>
              </div>

              <h1 className="mt-5 text-balance-title font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-ink-950">
                {service.title}
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-ink-600 font-normal">
                {service.hero}
              </p>

              {/* Kurumsal Güvence Maddeleri */}
              <div className="mt-6 space-y-2.5 text-xs sm:text-sm text-ink-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                    <ShieldCheck className="size-3" />
                  </span>
                  <span><strong>%100 Kaynak Kod & Fikri Mülkiyet:</strong> Proje tesliminde kodlar ve telif hakları şirketinize devredilir.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                    <ShieldCheck className="size-3" />
                  </span>
                  <span><strong>Gizlilik Sözleşmesi (NDA):</strong> İş fikirleriniz ve verileriniz hukuki sözleşmeyle korunur.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                    <ShieldCheck className="size-3" />
                  </span>
                  <span><strong>Aşamalı Canlı Demolar:</strong> Geliştirme süresince çalışan sürümleri test eder, onaylayarak ilerlersiniz.</span>
                </div>
              </div>

              {/* Butonlar */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/teklif" size="lg" className="px-8 font-bold shadow-lg shadow-brand-500/10 hover:shadow-xl hover:-translate-y-0.5">
                  Ücretsiz Keşif & Teklif Al →
                </ButtonLink>
                <a
                  href={whatsappLink(`Merhaba, "${service.title}" hizmetiniz hakkında görüşmek ve proje detaylarımızı paylaşmak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/60 px-7 text-sm sm:text-base font-bold text-emerald-800 transition-all hover:bg-emerald-100 hover:border-emerald-400"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-emerald-600 shrink-0">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.894-.798-1.498-1.784-1.674-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.678-1.633-.929-2.235-.245-.587-.494-.508-.678-.517-.176-.009-.376-.01-.577-.01-.201 0-.527.076-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.495 1.716.634.722.23 1.379.197 1.9.119.58-.088 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.2-.578-.35z" />
                  </svg>
                  <span>WhatsApp Danışman</span>
                </a>
              </div>

              {/* Müşteri Memnuniyet Skoru */}
              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-ink-100 text-xs text-ink-500">
                <div className="flex gap-0.5 text-[#f4b400]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-ink-800">5.0 Müşteri Memnuniyeti</span>
                <span className="text-ink-300">·</span>
                <span>140+ Başarıyla Teslim Edilmiş Proje</span>
              </div>
            </div>

            {/* Sağ Sütun: Görsel Mimari & Canlı Kod / Arayüz Vitrini */}
            <div className="relative">
              {slug === "ozel-yazilim-gelistirme" ? (
                /* Özel Yazılım için Modern Kod & Mimari Terminal Paneli */
                <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-[#0d131a] p-5 sm:p-6 shadow-2xl text-white font-mono text-xs">
                  {/* Terminal Üst Barı */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-[#ff5f56]" />
                      <span className="size-3 rounded-full bg-[#ffbd2e]" />
                      <span className="size-3 rounded-full bg-[#27c93f]" />
                      <span className="ml-2 text-[0.7rem] text-slate-400 font-sans">app/core/architecture.ts</span>
                    </div>
                    <span className="rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 text-[0.65rem] font-sans font-bold">
                      ● Active Production
                    </span>
                  </div>

                  {/* Kod İçeriği */}
                  <div className="mt-4 space-y-1.5 leading-relaxed text-[0.8rem] overflow-x-auto">
                    <p><span className="text-purple-400">export interface</span> <span className="text-blue-300">CustomSoftwareStack</span> &#123;</p>
                    <p className="pl-4"><span className="text-slate-400">client:</span> <span className="text-emerald-300">&quot;Kurumsal İşletmeniz&quot;</span>;</p>
                    <p className="pl-4"><span className="text-slate-400">framework:</span> <span className="text-amber-300">&quot;Next.js 16 + React 19&quot;</span>;</p>
                    <p className="pl-4"><span className="text-slate-400">database:</span> <span className="text-amber-300">&quot;PostgreSQL / Prisma ORM&quot;</span>;</p>
                    <p className="pl-4"><span className="text-slate-400">security:</span> [<span className="text-emerald-300">&quot;256-bit SSL&quot;</span>, <span className="text-emerald-300">&quot;Role-based Access&quot;</span>];</p>
                    <p className="pl-4"><span className="text-slate-400">sourceCodeOwnership:</span> <span className="text-cyan-400">true</span> <span className="text-slate-500">&#47;&#47; Mülkiyet sizin</span>;</p>
                    <p>&#125;</p>
                    <div className="my-2 border-t border-slate-800/80 pt-2 text-[0.72rem] text-slate-400">
                      <p className="text-emerald-400 font-semibold font-sans">✓ Analiz & Süreç Modeli Tamamlandı</p>
                      <p className="text-emerald-400 font-semibold font-sans">✓ Otomatik Testler & CI/CD Entegre Edildi</p>
                    </div>
                  </div>

                  {/* İstatistikler ve Metrik Çubukları */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-900/90 p-3 border border-slate-800 font-sans text-center">
                    <div>
                      <p className="text-[0.65rem] text-slate-400">Yanıt Süresi</p>
                      <p className="text-sm font-bold text-emerald-400">42ms</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-slate-400">Uptime SLA</p>
                      <p className="text-sm font-bold text-blue-400">%99.99</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] text-slate-400">Kod Mülkiyeti</p>
                      <p className="text-sm font-bold text-brand-400">%100 Sizin</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Diğer Hizmetler için Fotoğraf Çerçevesi */
                <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-surface-2">
                    <Image
                      src={serviceImage}
                      alt={service.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 90vw, 560px"
                      className="object-cover"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950/35 via-transparent to-transparent" />
                  </div>
                </div>
              )}

              {/* Yüzen rozet — görselin alt kenarına taşan kart */}
              <div className="relative z-10 mx-4 -mt-6 flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-surface px-5 py-3.5 text-xs shadow-[var(--shadow-lift)] sm:mx-6">
                <span className="font-semibold text-ink-800">Lizart Mühendislik Standartları</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-brand-700">
                  <Shield className="size-3.5" />
                  Özel Mimari & Temiz Kod
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. AVANTAJLAR (NE KAZANIYORSUNUZ?) ────────────────────────────── */}
      <section className="container-page py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Somut Faydalar</p>
          <h2 className="mt-3 text-balance-title font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink-950">
            {service.title} ile <em className="italic text-brand-700">İşletmeniz Ne Kazanır?</em>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-600 leading-relaxed">
            Standart kalıpların ötesinde, firmanıza operasyonel hız ve rekabet avantajı sağlayan somut çıktılar sunuyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {service.benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <div
                key={b.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-ink-100 bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 border border-brand-200/60 shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-extrabold text-ink-300 tracking-wider">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                  {b.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                  {b.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 3. SÜREÇ (NASIL ÇALIŞIYORUZ?) ─────────────────────────────────── */}
      <section className="border-y border-ink-100 bg-surface-2/50 py-16 lg:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Adım Adım Süreç</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink-950">
              Nasıl <em className="italic text-brand-700">Çalışıyoruz?</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-600">
              Sürpriz maliyetler olmadan, her adımı şeffaf ve onaylı olarak yürütüyoruz.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <div
                key={step}
                className="relative flex flex-col justify-between rounded-2xl border border-ink-200/80 bg-surface p-6 shadow-2xs transition-all hover:border-brand-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-full bg-brand-500 font-extrabold text-white text-sm shadow-xs">
                      {i + 1}
                    </span>
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">
                      Adım {i + 1}
                    </span>
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-ink-900 leading-snug">{step}</h4>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100 text-[0.72rem] text-brand-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  <span>Müşteri Onaylı Aşama</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3.5. GÖRSEL GALERİ & ÇALIŞMA EKRANLARI (ÇOKLU GÖRSEL MEVCUTSA) ─── */}
      {service.gallery && service.gallery.length > 0 && (
        <section className="border-t border-ink-100 bg-surface-2/40 py-16 lg:py-24">
          <div className="container-page">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Görsel Vitrin</p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink-950">
                Hizmet & <em className="italic text-brand-700">Uygulama Galerisi</em>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-ink-600">
                Bu hizmet kapsamında geliştirdiğimiz sistemler, mimari tasarımlar ve örnek arayüzler.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.gallery.map((imgUrl, i) => (
                <div
                  key={`${imgUrl}-${i}`}
                  className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
                >
                  <Image
                    src={imgUrl}
                    alt={`${service.title} Galeri ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 4. TEKNOLOJİ ALTYAPISI (ÖZEL YAZILIM & ÇÖZÜMLER İÇİN) ─────────── */}
      <section className="container-page py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Teknoloji Yığını</p>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-ink-950">
            Kullandığımız <em className="italic text-brand-700">Modern ve Güvenilir Altyapılar</em>
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Geleceğe hazır, yüksek performanslı ve güvenlik açığı barındırmayan modern teknolojilerle geliştiriyoruz.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-surface p-4 shadow-2xs hover:border-brand-300 transition-colors"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <tech.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-ink-900 truncate">{tech.name}</p>
                <p className="text-[0.7rem] text-ink-500 truncate">{tech.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. PAKETLER & FİYATLANDIRMA ───────────────────────────────────── */}
      <section className="border-t border-ink-100 bg-surface py-16 lg:py-24">
        <div className="container-page">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">Şeffaf Fiyatlandırma</p>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-ink-950">
              Hizmet Paketleri ve <em className="italic text-brand-700">Başlangıç Koşulları</em>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-ink-600">
              Aşağıdaki tutarlar başlangıç referansıdır; ihtiyaçlarınız analiz edildikten sonra net kapsam teklifte sunulur.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {service.packages.map((pkg) => (
              <div
                key={pkg.name}
                className={cn(
                  "relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-8 transition-all duration-300",
                  pkg.highlighted
                    ? "border-brand-500 bg-surface shadow-2xl ring-2 ring-brand-500/15"
                    : "border-ink-200/80 bg-surface shadow-sm hover:border-ink-300 hover:shadow-md",
                )}
              >
                {pkg.highlighted && (
                  <span className="absolute -top-1 right-8 rounded-b-xl bg-brand-500 px-4 py-1 text-xs font-bold text-white shadow-xs">
                    En Çok Tercih Edilen
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-ink-900">{pkg.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-ink-950">{pkg.price}</span>
                    <span className="text-xs text-ink-400 font-medium">+ KDV</span>
                  </div>

                  <ul className="mt-6 space-y-3 border-t border-ink-100 pt-6 text-xs sm:text-sm">
                    {pkg.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-ink-700">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800 mt-0.5">
                          <ShieldCheck className="size-2.5" />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <ButtonLink
                    href="/teklif"
                    variant={pkg.highlighted ? "dark" : "outline"}
                    size="lg"
                    className="w-full justify-center font-bold"
                  >
                    Detaylı Teklif Al →
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. ÖRNEK PROJELER ──────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="container-page py-16 lg:py-24">
          <SectionHeading
            eyebrow="Örnek Projeler"
            title="Bu Alanda Teslim Ettiğimiz Başarılı İşler"
            action={
              <ButtonLink href="/projeler" variant="outline" size="sm" className="font-semibold">
                Tüm Projeleri Gör →
              </ButtonLink>
            }
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projeler/${p.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-ink-200/80 bg-surface p-7 shadow-xs transition-all hover:border-brand-400 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge tone="brand">{p.client}</Badge>
                    <span className="text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform">
                      İncele →
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600 line-clamp-2">
                    {p.summary}
                  </p>
                </div>

                {p.testimonial && (
                  <p className="mt-5 border-l-2 border-brand-400 pl-3.5 text-xs italic text-ink-600 bg-surface-2 p-3 rounded-r-xl">
                    “{p.testimonial}”
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── 7. MÜŞTERİ YORUMLARI ───────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="border-t border-ink-100 bg-surface-2/40 py-16 lg:py-20">
          <div className="container-page">
            <SectionHeading eyebrow="Müşteri Deneyimi" title="Bizimle Çalışanlar Ne Diyor?" />
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {reviews.map((r) => (
                <figure key={r.id} className="rounded-2xl border border-ink-100 bg-surface p-7 shadow-xs">
                  <div className="flex gap-0.5 text-[#f4b400] mb-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-sm sm:text-base leading-relaxed text-ink-800 font-serif italic">
                    “{r.body}”
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4 text-xs font-bold text-ink-900">
                    <span>{r.authorName}</span>
                    {r.authorTitle && <span className="text-ink-400 font-normal"> · {r.authorTitle}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. SSS (SIKÇA SORULAN SORULAR) ─────────────────────────────────── */}
      <section className="container-page py-16 lg:py-24 border-t border-ink-100/80">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] items-start">
          <div className="lg:sticky lg:top-24 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200/80 px-3.5 py-1 text-xs font-bold text-brand-800">
              <span className="size-1.5 rounded-full bg-brand-500 animate-pulse" />
              Aklınıza Takılanlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink-950">
              {service.title} Hakkında Merak Edilenler
            </h2>
            <p className="text-sm sm:text-base text-ink-600 leading-relaxed font-normal">
              Süreç, bütçe, teslimat ve çalışma modelimiz hakkında sıkça sorulan soruların yanıtlarını derledik. Farklı bir sorunuz varsa doğrudan danışmanımıza ulaşabilirsiniz.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={whatsappLink(`Merhaba, "${service.title}" hizmetiniz hakkında aklıma takılan bir soru var, danışmak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1f7a68] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#176656] transition"
              >
                <MessageCircle size={15} />
                <span>WhatsApp ile Danışın</span>
              </a>
              <ButtonLink href="/iletisim" variant="outline" size="sm" className="h-11 rounded-xl text-xs font-bold">
                Bize Ulaşın →
              </ButtonLink>
            </div>
          </div>
          <div className="w-full">
            <Accordion items={service.faqs.map((f, i) => ({ id: String(i), title: f.question, content: f.answer }))} />
          </div>
        </div>
      </section>

      {/* ─── 9. İLGİLİ HAZIR ÜRÜNLER (EĞER VARSA) ─────────────────────────── */}
      {products.length > 0 && (
        <section className="border-t border-ink-100 bg-surface-2/50 py-16 lg:py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow="Hazır Çözümler"
              title="Bu Hizmetle İlgili Hazır Ürünlerimiz"
              action={
                <ButtonLink href="/magaza" variant="outline" size="sm">
                  Tüm Ürünler →
                </ButtonLink>
              }
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 10. BÜYÜK DÖNÜŞÜM ÇAĞRISI (FINAL BANNER) ──────────────────────── */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-ink-100 bg-gradient-to-br from-brand-900 via-[#0e1e17] to-[#0a150f] p-8 text-white text-center shadow-xl sm:p-12 lg:p-16">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="rounded-full border border-[#dfe9cf]/25 bg-white/8 px-3.5 py-1 text-xs font-bold text-brand-100">
              Hemen Başlayalım
            </span>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight">
              Projenizi Birlikte <em className="italic text-brand-100">Hayata Geçirelim</em>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed">
              İş süreçlerinizi dinleyelim, 24 saat içinde detaylı analiz ve şeffaf yol haritanızı oluşturalım.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/teklif" size="lg" className="rounded-full bg-[#dfe9cf] font-bold text-[#173b30] hover:bg-white px-8">
                30 Dakikalık Keşif Toplantısı Planla
              </ButtonLink>
              <a
                href={whatsappLink(`Merhaba, ${service.title} için toplantı planlamak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/25 px-7 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="size-4" />
                <span>WhatsApp&apos;tan Yazın</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
