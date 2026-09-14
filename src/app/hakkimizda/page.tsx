import type React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  FileCheck2,
  Globe2,
  Heart,
  MapPin,
  MessageCircle,
  MonitorSmartphone,
  Phone,
  ShieldCheck,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { Breadcrumb, ButtonLink } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hakkımızda — Lizart Dijital",
  description:
    "Lizart Dijital; web tasarım, hazır web sitesi, e-ticaret ve özel yazılım projeleri geliştiren Gebze merkezli dijital teknoloji stüdyosu.",
  alternates: { canonical: `${SITE.url}/hakkimizda` },
};

const values = [
  { icon: ShieldCheck, title: "Güven veren teslimat", text: "Sözleşmeli, faturalı ve adım adım takip edilebilir proje süreciyle çalışırız." },
  { icon: MonitorSmartphone, title: "Mobil öncelikli tasarım", text: "Her arayüzü masaüstü, tablet ve telefon deneyimiyle birlikte düşünürüz." },
  { icon: Code2, title: "Temiz teknik altyapı", text: "Hızlı açılan, yönetilebilir, SEO uyumlu ve sürdürülebilir sistemler kurarız." },
  { icon: BadgeCheck, title: "Tam sahiplik", text: "Projeyi size teslim eder, panel, lisans ve gerekli teknik erişimleri netleştiririz." },
];

const process = [
  ["01", "Keşif", "İşinizi, hedef kitlenizi ve ihtiyacınız olan dijital yapıyı netleştiririz."],
  ["02", "Tasarım", "Markanıza yakışan renk, tipografi, sayfa akışı ve içerik düzenini kurarız."],
  ["03", "Geliştirme", "Arayüz, yönetim paneli, form, SEO ve performans tarafını yayına hazırlarız."],
  ["04", "Yayın", "Alan adı, SSL, e-posta, eğitim ve teslim kontrollerini tamamlarız."],
];

const projects = [
  {
    title: "Gebze Cimnastik Akademi",
    sector: "Spor & Eğitim",
    image: "/gorseller/referanslar/gebze-cimnastik-masaustu.webp",
    href: "/projeler/gebze-cimnastik-akademi-web-sitesi",
  },
  {
    title: "Everydent Ağız ve Diş Sağlığı",
    sector: "Sağlık",
    image: "/gorseller/referanslar/everydent-masaustu.png",
    href: "/projeler/everydent-agiz-dis-sagligi-web-sitesi",
  },
  {
    title: "Ada Motor İstanbul",
    sector: "E-Ticaret",
    image: "/gorseller/referanslar/adamotor-masaustu.png",
    href: "/projeler/ada-motor-istanbul-eticaret-sitesi",
  },
];

export default async function AboutPage() {
  const [productCount, projectCount] = await Promise.all([
    prisma.product.count({ where: { isPublished: true } }).catch(() => 26),
    prisma.portfolioProject.count().catch(() => 9),
  ]);

  const heroStats = [
    { value: "9+", label: "Yıllık deneyim" },
    { value: "150+", label: "Tamamlanan proje" },
    { value: `${productCount || 26}+`, label: "Hazır dijital ürün" },
    { value: `${projectCount || 9}+`, label: "Yayınlanan referans" },
  ];

  return (
    <div className="bg-canvas text-ink-900">
      <div className="container-page pt-4 lg:pt-6">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]} />
      </div>

      {/* =====================================================
          1. TAM GENİŞLİK FOTOĞRAFLI KAHRAMAN
          ===================================================== */}
      <section className="relative mt-4 flex min-h-[68vh] items-end overflow-hidden sm:min-h-[74vh]">
        <Image
          src="/gorseller/hizmetler/hero-web-tasarim-realistic.png"
          alt="Lizart Dijital tasarım ve geliştirme stüdyosu"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-ink-950/55" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/15" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/35 to-transparent lg:from-ink-950/90 lg:via-ink-950/45 lg:to-transparent" />

        <div className="container-page relative z-10 pb-20 sm:pb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-100 shadow-[0_2px_16px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Gebze merkezli dijital teknoloji stüdyosu
          </span>

          <h1 className="mt-6 max-w-2xl text-[2.1rem] font-bold leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-[3.4rem]">
            Markanız için güven veren
            <br />
            <span className="font-serif italic font-medium text-brand-100">dijital vitrinler kuruyoruz.</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:text-base">
            Web tasarım, hazır web sitesi, e-ticaret ve özel yazılım projelerinde işletmelere resmi görünen,
            hızlı açılan ve satışa yakın çalışan dijital sistemler hazırlıyoruz.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/teklif" size="lg" className="font-bold">
              Projem İçin Teklif Al
              <ArrowUpRight className="size-4" />
            </ButtonLink>
            <ButtonLink
              href="/projeler"
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 font-bold text-white backdrop-blur-sm hover:bg-white/15"
            >
              Referansları İncele
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Kahramanın üzerine taşan istatistik kartı */}
      <div className="container-page">
        <div className="relative z-20 -mt-12 grid grid-cols-2 gap-3 rounded-3xl border border-ink-100 bg-surface p-5 shadow-[var(--shadow-lift)] sm:-mt-14 sm:grid-cols-4 sm:p-7">
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-serif text-2xl font-semibold text-brand-700 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wider text-ink-400 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page">
        {/* =====================================================
            2. HİKAYEMİZ
            ===================================================== */}
        <section className="grid gap-10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:py-24">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Hikayemiz</span>
            <h2 className="mt-3 max-w-md font-serif text-3xl font-medium leading-[1.15] text-ink-950 sm:text-4xl">
              Doğru yapı, <em className="italic text-brand-700">güven veren</em> bir marka kurar.
            </h2>

            <div className="mt-8 space-y-4 text-[0.98rem] leading-relaxed text-ink-600">
              <p>
                Lizart Dijital olarak yolculuğumuza, işletmelerin dijitalde de gerçek hayattaki kadar güvenilir ve
                profesyonel görünmesi gerektiği inancıyla başladık. Bir web sitesi yalnızca güzel görünen birkaç
                sayfa değildir; doğru kurulduğunda markanızın sözünü tutar.
              </p>
              <p>
                Dokuz yıldır Gebze merkezli olarak; kurumsal web siteleri, e-ticaret altyapıları, mobil uygulamalar
                ve özel yazılımlar geliştiriyoruz. Her projede resmi duran bir marka dili, hızlı çalışan teknik
                altyapı ve teslimden sonra da sürdürülebilir bir sistem arıyoruz.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border-l-4 border-brand-500 bg-surface-2 p-6">
              <p className="font-serif text-lg italic leading-relaxed text-ink-800">
                &ldquo;Kendi markamıza yakıştırmayacağımız hiçbir tasarımı sizin sitenize koymuyoruz. En sade
                kurumsal sayfadan en karmaşık özel yazılıma kadar aynı özeni gösteriyoruz.&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="overflow-hidden rounded-2xl border border-ink-100 shadow-[var(--shadow-card)]">
              <Image
                src="/gorseller/referanslar/zenitdent-hero-pc.png"
                alt="Lizart Dijital tarafından hazırlanan canlı bir proje"
                width={900}
                height={620}
                className="h-auto w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              <div className="overflow-hidden rounded-2xl border border-ink-100 shadow-[var(--shadow-card)]">
                <Image
                  src="/gorseller/referanslar/dentsolo-hero-pc.png"
                  alt="Lizart Dijital tarafından hazırlanan bir diğer canlı proje"
                  width={480}
                  height={420}
                  className="aspect-[4/3] w-full object-cover object-center"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-ink-100 shadow-[var(--shadow-card)]">
                <Image
                  src="/gorseller/referanslar/macmekanik-hero-pc.png"
                  alt="Lizart Dijital tarafından hazırlanan bir kurumsal proje"
                  width={480}
                  height={420}
                  className="aspect-[4/3] w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            3. NEDEN BİZ — İkonlu liste
            ===================================================== */}
        <section className="border-t border-ink-100 py-16 lg:py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Neden Lizart?</span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-ink-950 sm:text-4xl">
              Bizi farklı kılan yaklaşım.
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-2xl divide-y divide-ink-100">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-5 py-6 first:pt-0 last:pb-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            4. CANLI REFERANSLAR
            ===================================================== */}
        <section className="border-t border-ink-100 py-16 lg:py-20">
          <div className="flex flex-col justify-between gap-5 pb-8 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Canlı referanslar</span>
              <h2 className="mt-3 font-serif text-3xl font-medium text-ink-950 sm:text-4xl">
                Yayına aldığımız işlerden seçkiler.
              </h2>
            </div>
            <Link
              href="/projeler"
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-surface px-4 py-2 text-sm font-bold text-brand-800 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              Tüm referanslar
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.title}
                href={project.href}
                className="group overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-700">{project.sector}</p>
                  <h3 className="mt-2 flex items-center justify-between gap-3 text-lg font-bold text-ink-950">
                    {project.title}
                    <ArrowUpRight className="size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =====================================================
            5. SÜREÇ
            ===================================================== */}
        <section className="border-t border-ink-100 py-16 lg:py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Çalışma akışı</span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-ink-950 sm:text-4xl">Süreç sade, kontrol sizde.</h2>
          </div>

          <div className="relative mt-10 grid gap-4 lg:grid-cols-4">
            <div aria-hidden className="absolute inset-x-0 top-8 hidden h-px bg-ink-200 lg:block" />
            {process.map(([no, title, text]) => (
              <article
                key={no}
                className="relative rounded-2xl border border-ink-100 bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="relative z-10 inline-flex size-9 items-center justify-center rounded-full border-2 border-surface bg-brand-600 font-mono text-sm font-bold text-white">
                  {no}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================
            6. RESMİ BİLGİLER
            ===================================================== */}
        <section className="grid gap-8 rounded-3xl border border-ink-100 bg-surface-2 p-6 shadow-xs sm:p-9 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">Resmi bilgiler</span>
            <h2 className="mt-3 font-serif text-2xl font-medium text-ink-950 sm:text-3xl">
              Açık, ulaşılabilir ve güvenilir.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Proje öncesinde kiminle çalıştığınızı bilmeniz bizim için önemli. İletişim, fatura ve destek
              süreçleri net ilerler.
            </p>
          </div>

          <div className="grid gap-3">
            <InfoRow icon={Globe2} label="Marka" value="Lizart Dijital Yazılım ve Danışmanlık" />
            <InfoRow icon={MapPin} label="Merkez" value={SITE.address} />
            <InfoRow icon={Phone} label="Telefon" value={SITE.phone} href={SITE.phoneHref} />
            <InfoRow icon={FileCheck2} label="E-posta" value={SITE.email} href={`mailto:${SITE.email}`} />
            <InfoRow icon={Timer} label="Çalışma saatleri" value={SITE.workingHours} />
          </div>
        </section>

        {/* =====================================================
            7. KAPANIŞ ÇAĞRISI — Mat Kurumsal Prestij Vitrini
            ===================================================== */}
        <section className="my-16 lg:my-24">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#1d3521] bg-gradient-to-br from-[#1f3722] via-[#243f27] to-[#1c3220] text-white shadow-xl">
            {/* Arka Plan Görseli - Doğal ve Mat Karartma */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/gorseller/ajans/cta-banner-bg.jpg"
                alt="Lizart Dijital Tasarım ve Yazılım Stüdyosu"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center brightness-[0.22] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b321e]/96 via-[#223d26]/92 to-[#1b321e]/88 lg:bg-gradient-to-r lg:from-[#1b321e]/98 lg:via-[#223d26]/94 lg:to-[#1b321e]/90" />
            </div>

            {/* İçerik Izgarası - Asimetrik & Modern 2 Sütun */}
            <div className="relative z-10 grid gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-16">
              {/* Sol Sütun: Ana Mesaj, Değer Önerisi ve Eylemler (7 Sütun) */}
              <div className="lg:col-span-7">
                {/* Üst Rozet */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b6d8b4]">
                  <span className="size-2 rounded-full bg-[#82cf7f]" />
                  <span>Canlı Proje Masası &amp; Dijital Ortaklık</span>
                </div>

                {/* Ana Başlık */}
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.18]">
                  Markanızı dijitalde bir adım{" "}
                  <span className="text-[#b6d8b4]">
                    öne taşımaya hazır mısınız?
                  </span>
                </h2>

                {/* Açıklama Metni */}
                <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#e0ede2] font-normal">
                  Yüksek hızlı modern web sitesi, anahtar teslim e-ticaret altyapısı ya da işletmenize özel yazılım... 
                  Markanıza en uygun mimariyi birlikte belirleyelim, canlı demo ve yol haritanızı hızla hazırlayalım.
                </p>

                {/* Aksiyon Butonları */}
                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <ButtonLink
                    href="/teklif"
                    size="lg"
                    className="group rounded-xl bg-[#396b40] hover:bg-[#467f4f] px-7 py-4 text-sm font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
                  >
                    <span>Hemen Teklif Alın</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </ButtonLink>

                  <a
                    href={whatsappLink("Merhaba, hakkınızda sayfanızdan ulaşıyorum. Yeni bir proje için görüşmek istiyorum.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#1a311e] hover:bg-[#203c26] px-6 text-sm font-bold text-[#bfe0bd] shadow-xs transition"
                  >
                    <MessageCircle className="size-4 text-[#82cf7f]" />
                    <span>WhatsApp ile Yazın</span>
                  </a>

                  <Link
                    href="/iletisim"
                    className="inline-flex h-13 items-center justify-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 text-sm font-semibold text-[#e0ede2] transition hover:text-white"
                  >
                    İletişim
                  </Link>
                </div>

                {/* Alt Güven ve Taahhüt Rozetleri */}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-white/15 pt-6 text-sm font-medium text-[#e0ede2]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                    <span>Sözleşmeli &amp; Lisanslı Teslim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                    <span>24 Saatte Hızlı Başlangıç</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                    <span>%100 Mobil &amp; SEO Standartları</span>
                  </div>
                </div>
              </div>

              {/* Sağ Sütun: Mat Süreç & Güvence Kartı (5 Sütun) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl border border-white/15 bg-[#1a311e]/90 backdrop-blur-md p-6 text-white shadow-lg sm:p-7">
                  {/* Kart Başlığı */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-[#28492d] text-[#b6d8b4] border border-white/15 font-bold text-sm">
                        LZ
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Lizart Proje Masası</h4>
                        <p className="text-xs font-medium text-[#b6d8b4] flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} />
                          Ortalama 15 dk teklif yanıtı
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-bold uppercase text-[#b6d8b4]">
                      Ücretsiz Keşif
                    </span>
                  </div>

                  {/* 3 Aşamalı Yol Haritası */}
                  <div className="mt-5 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                        01
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">İhtiyaç Analizi &amp; Strateji</p>
                        <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                          Sektörünüze en uygun tasarım dili, sayfa mimarisi ve altyapı seçimi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                        02
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">Canlı Demo &amp; Tasarım Onayı</p>
                        <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                          Sitenizi yayından önce canlı demo ortamında test edip onaylayın.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                        03
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white">Anahtar Teslim Canlıya Alma</p>
                        <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                          SEO optimizasyonu, SSL, e-posta kurulumu ve 7/24 teknik destek.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kart Altı Vurgu Şeridi */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-[#203c26] p-3.5 text-center">
                    <p className="text-xs font-semibold text-[#e4f1e3]">
                      🚀 Projeniz için bugün ilk adımı atın, 24 saatte hazır demo görün.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-brand-600" />
      <span className="w-28 shrink-0 text-[0.68rem] font-semibold uppercase tracking-[.12em] text-ink-400">{label}</span>
      <span className="min-w-0 text-sm font-medium text-ink-800">{value}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-surface px-4 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50/50">
        {content}
      </a>
    );
  }

  return <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-surface px-4 py-3">{content}</div>;
}
