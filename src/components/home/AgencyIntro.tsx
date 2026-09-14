"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Ana sayfanın ajans tanıtımı.
 * Ürün satışından önce "Lizart Dijital kimdir, nasıl çalışır" sorusunu yanıtlar.
 */
export function AgencyIntro({
  images,
  stats,
  productCount,
  projectCount,
}: {
  images: { studio: string; process: string; results: string };
  stats: Record<string, string>;
  productCount: number;
  projectCount: number;
}) {
  const highlights = [
    {
      title: "Tasarım ve geliştirme aynı ekipte",
      body: "Arayüz tasarımından sunucu tarafına kadar tek ekip çalışır; iş taşerona devredilmez, sorumluluk bölünmez.",
    },
    {
      title: "Önce gösterir, sonra satarız",
      body: "Her ürünün canlı demosu ve yönetim paneli erişimi yayında. Ne aldığınızı ödeme yapmadan önce görürsünüz.",
    },
    {
      title: "Yayına aldıktan sonra da buradayız",
      body: "SEO, reklam yönetimi, bakım ve teknik destek ile projeyi teslimden sonra da büyütmeye devam ederiz.",
    },
  ];

  return (
    <section className="container-page py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        {/* Metin */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            Lizart Dijital
          </p>
          <h2 className="text-balance-title font-serif text-3xl font-medium leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem]">
            İşletmeleri dijitale taşıyan
            <br />
            <em className="italic text-brand-700">yaratıcı bir dijital ajansıyız</em>
          </h2>

          <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-ink-600">
            <p>
              Dokuz yıldır web siteleri, mobil uygulamalar ve özel yazılımlar geliştiriyoruz. Bu süre
              boyunca aynı ihtiyaçların defalarca sıfırdan yazıldığını gördük: kurumsal tanıtım sitesi,
              e-ticaret altyapısı, randevu sistemi, klinik paneli…
            </p>
            <p>
              Bu yüzden yaklaşımımızı değiştirdik. En sık ihtiyaç duyulan çözümleri{" "}
              <strong className="font-semibold text-ink-900">hazır ürünler</strong> haline getirdik ve
              canlı demolarıyla yayınladık. Süreçleri kendine özgü olan işletmeler için ise{" "}
              <strong className="font-semibold text-ink-900">özel geliştirme</strong> yapmaya devam
              ediyoruz.
            </p>
            <p>
              Bugün {productCount} hazır dijital ürün, {projectCount} yayınlanmış vaka çalışması ve uçtan
              uca hizmet paketleriyle çalışıyoruz.
            </p>
          </div>

          <ul className="mt-8 space-y-5">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
                >
                  ✓
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/hakkimizda" size="lg">
              Hakkımızda
            </ButtonLink>
            <ButtonLink href="/projeler" variant="outline" size="lg">
              Yaptığımız işler
            </ButtonLink>
          </div>
        </div>

        {/* Görsel kolaj */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-[var(--shadow-lift)]">
            <Image
              src={images.studio}
              alt="Lizart Dijital ekibinin tasarım ve geliştirme çalışma alanını gösteren illüstrasyon"
              width={900}
              height={620}
              className="h-auto w-full"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-[var(--shadow-card)]">
              <Image
                src={images.process}
                alt="Analiz, tasarım, geliştirme ve yayın aşamalarını gösteren proje panosu illüstrasyonu"
                width={820}
                height={520}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-xs text-ink-500">
                Şeffaf süreç: her aşamayı hesabınızdan izlersiniz
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-ink-100 bg-surface shadow-[var(--shadow-card)]">
              <Image
                src={images.results}
                alt="Trafik ve dönüşüm artışını gösteren rapor panosu illüstrasyonu"
                width={820}
                height={520}
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-3 text-xs text-ink-500">
                Ölçülebilir sonuç: aylık raporlarla takip
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Rakamlar şeridi — görsellerin üzerine taşan yüzen kart */}
      <dl className="relative z-10 mx-auto mt-10 grid max-w-4xl gap-6 rounded-3xl border border-ink-100 bg-surface p-8 shadow-[var(--shadow-lift)] sm:grid-cols-2 lg:-mt-12 lg:grid-cols-4 lg:p-10">
        {[
          { label: "Tamamlanan proje", value: stats["stats.projects"] ?? "—" },
          { label: "Mutlu müşteri", value: stats["stats.customers"] ?? "—" },
          { label: "Yıllık deneyim", value: stats["stats.years"] ?? "—" },
          { label: "Ortalama müşteri puanı", value: `${stats["stats.satisfaction"] ?? "—"}/5` },
        ].map((s) => (
          <div key={s.label}>
            <dt className="text-sm text-ink-500">{s.label}</dt>
            <dd className="mt-1 font-serif text-3xl font-medium tracking-tight text-brand-700">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------------------------------------- Ne yapıyoruz */

const CAPABILITY_LIST = [
  {
    key: "web",
    category: "Web & Portal",
    title: "Web tasarım ve geliştirme",
    body: "Kurumsal tanıtım sitelerinden landing page'lere kadar hızlı açılan, mobil uyumlu ve yönetimi kolay siteler.",
    bullets: ["Kurumsal siteler", "Landing page", "Portföy ve blog"],
    href: "/hizmetler/web-sitesi-kurulumu",
    images: ["/gorseller/hizmetler/hero-web-tasarim-realistic.png", "/gorseller/hizmetler/hero-ozel-yazilim-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "commerce",
    category: "E-Ticaret",
    title: "E-ticaret çözümleri",
    body: "Sanal POS, kargo ve stok entegrasyonlarıyla satışa hazır mağaza; dönüşüm odaklı sepet ve ödeme akışı.",
    bullets: ["Mağaza kurulumu", "Ödeme entegrasyonu", "Pazaryeri altyapısı"],
    href: "/hizmetler/eticaret-cozumleri",
    images: ["/gorseller/hizmetler/hero-eticaret-realistic.png", "/gorseller/hizmetler/hero-reklam-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "mobile",
    category: "Mobil Uygulama",
    title: "Mobil uygulama geliştirme",
    body: "iOS ve Android için uygulama; mağaza yayın süreçlerini de biz yürütürüz.",
    bullets: ["Flutter / React Native", "Mağaza yayını", "Bildirim altyapısı"],
    href: "/hizmetler/mobil-uygulama-gelistirme",
    images: ["/gorseller/hizmetler/hero-mobil-realistic.png", "/gorseller/hizmetler/hero-web-tasarim-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "software",
    category: "Özel Yazılım",
    title: "Özel yazılım geliştirme",
    body: "Hazır ürünlerin karşılamadığı iş akışları için analizden teslime kendi ekibimizle geliştirme.",
    bullets: ["CRM ve panel sistemleri", "Entegrasyonlar", "Kaynak kod devri"],
    href: "/hizmetler/ozel-yazilim-gelistirme",
    images: ["/gorseller/hizmetler/hero-ozel-yazilim-realistic.png", "/gorseller/hizmetler/hero-seo-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "growth",
    category: "SEO & Reklam",
    title: "SEO ve reklam yönetimi",
    body: "Organik görünürlük ve reklam kampanyalarıyla siteyi trafiğe, trafiği satışa çeviririz.",
    bullets: ["Teknik SEO", "Google Ads", "Meta reklamları"],
    href: "/hizmetler/seo-hizmetleri",
    images: ["/gorseller/hizmetler/hero-seo-realistic.png", "/gorseller/hizmetler/hero-reklam-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "brand",
    category: "Marka & Kimlik",
    title: "Marka ve içerik tasarımı",
    body: "Logo, kurumsal kimlik, sosyal medya içerikleri ve tanıtım videolarıyla bütünlüklü bir görsel dil.",
    bullets: ["Kurumsal kimlik", "Sosyal medya içerikleri", "Video prodüksiyon"],
    href: "/hizmetler/kurumsal-kimlik",
    images: ["/gorseller/hizmetler/hero-reklam-realistic.png", "/gorseller/hizmetler/hero-web-tasarim-realistic.png"] as [string, string],
    theme: { dot: "bg-brand-700" },
  },
  {
    key: "video",
    category: "Video & Medya",
    title: "Video Çekimi & Kurgu",
    body: "Ürün tanıtımından kurumsal videolara, sosyal medya reels içeriklerinden eğitim videolarına kadar profesyonel prodüksiyon.",
    bullets: ["Tanıtım videoları", "Sosyal medya reels", "Kurgu ve altyazı"],
    href: "/hizmetler/video-ve-icerik-uretimi",
    images: ["/gorseller/ajans/hizmet-video-1.svg", "/gorseller/ajans/hizmet-video-2.svg"] as [string, string],
    theme: {
      accentGradient: "from-red-600 via-rose-600 to-orange-500",
      borderHover: "hover:border-red-400/80 hover:shadow-red-500/10",
      badge: "bg-red-50 text-red-800 border-red-200/90",
      tag: "bg-red-50/75 text-red-800 border-red-200/80 hover:bg-red-100/70",
      tagDot: "bg-red-500",
      buttonHover: "hover:bg-red-600 hover:text-white hover:border-red-600",
      dot: "bg-red-600",
    },
  },
  {
    key: "seo-analiz",
    category: "Teknik Analiz",
    title: "SEO Analizi & Site Öne Çıkarma",
    body: "Teknik denetimden anahtar kelime stratejisine, sayfa hızı optimizasyonundan Core Web Vitals'a kadar kapsamlı SEO analizi.",
    bullets: ["Teknik SEO denetimi", "Core Web Vitals", "Sayfa hızı optimizasyonu"],
    href: "/hizmetler/seo-hizmetleri",
    images: ["/gorseller/ajans/hizmet-seo-analiz-1.svg", "/gorseller/ajans/hizmet-seo-analiz-2.svg"] as [string, string],
    theme: {
      accentGradient: "from-sky-500 via-cyan-600 to-blue-600",
      borderHover: "hover:border-sky-400/80 hover:shadow-sky-500/10",
      badge: "bg-sky-50 text-sky-800 border-sky-200/90",
      tag: "bg-sky-50/75 text-sky-800 border-sky-200/80 hover:bg-sky-100/70",
      tagDot: "bg-sky-500",
      buttonHover: "hover:bg-sky-600 hover:text-white hover:border-sky-600",
      dot: "bg-sky-600",
    },
  },
  {
    key: "satin-alma",
    category: "Hazır Paketler",
    title: "Hizmet Satın Alma",
    body: "İhtiyacınıza uygun hizmet paketini seçin, güvenle ödeyin — aynı gün süreç başlasın. Kurulum, entegrasyon ve içerik dahil.",
    bullets: ["Esnek paketler", "Güvenli ödeme", "Aynı gün başlangıç"],
    href: "/hizmetler",
    images: ["/gorseller/ajans/hizmet-satin-alma-1.svg", "/gorseller/ajans/hizmet-satin-alma-2.svg"] as [string, string],
    theme: {
      accentGradient: "from-emerald-600 via-brand-600 to-teal-600",
      borderHover: "hover:border-brand-400/80 hover:shadow-brand-500/10",
      badge: "bg-brand-50 text-brand-900 border-brand-200/90",
      tag: "bg-brand-50/75 text-brand-900 border-brand-200/80 hover:bg-brand-100/70",
      tagDot: "bg-brand-500",
      buttonHover: "hover:bg-brand-600 hover:text-white hover:border-brand-600",
      dot: "bg-brand-600",
    },
  },
];

/** Otomatik kaydırmalı 2-görsel slider bileşeni */
function ServiceImageSlider({
  images,
  title,
  dotColor = "bg-brand-600",
}: {
  images: [string, string];
  title: string;
  dotColor?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev === 0 ? 1 : 0));
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden border-b border-ink-200/80 bg-[#f7f9f5]">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-full shrink-0 p-4 sm:p-5">
            <div className="overflow-hidden rounded-lg border border-ink-200/80 bg-white shadow-[0_16px_34px_-30px_rgb(20_26_20/.55)]">
              <Image
                src={src}
                alt={`${title} görsel ${i + 1}`}
                width={640}
                height={440}
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2.5 left-0 right-0 z-10 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Görsel ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              active === i ? cn("w-6", dotColor) : "w-1.5 bg-ink-300 hover:bg-ink-400"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Ajansın hangi işleri yaptığını görsellerle anlatan bölüm. */
export function Capabilities({}: { images: Record<string, string> }) {
  return (
    <section className="border-y border-ink-200/80 bg-[#f3f6f1] py-16 lg:py-24">
      <div className="container-page">
        <div className="grid gap-6 border-b border-ink-300/60 pb-8 lg:grid-cols-[0.75fr_1fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-sm border border-brand-300/80 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-900 shadow-2xs">
            <span className="size-1.5 rounded-full bg-brand-700" />
            Ne Yapıyoruz?
            </div>
            <h2 className="mt-4 text-balance-title font-serif text-3xl font-medium leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-[2.55rem]">
              Fikirden yayına, <em className="italic text-brand-700">yayından büyümeye</em>
            </h2>
          </div>
          <p className="max-w-2xl text-[1rem] leading-relaxed text-ink-700 lg:justify-self-end">
            Bir işletmenin dijitalde ihtiyaç duyduğu her adımı tek çatı altında yürütüyoruz. Aşağıdaki alanların her birinde hem hazır ürünlerimiz hem de projeye özel çalışmalarımız var.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITY_LIST.slice(0, 6).map((item, index) => (
            <article
              key={item.key}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border border-ink-200/90 bg-white transition-all duration-300",
                "shadow-[0_2px_8px_-5px_rgba(20,26,20,0.22),0_18px_48px_-42px_rgba(20,26,20,0.5)]",
                "hover:-translate-y-1 hover:border-brand-500/70 hover:shadow-[0_26px_58px_-42px_rgba(20,26,20,0.75)]"
              )}
            >
              <div className="h-1 w-full bg-brand-800" />

              <ServiceImageSlider
                images={item.images}
                title={item.title}
                dotColor={item.theme.dot}
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.72rem] font-bold tracking-widest text-ink-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-brand-300/80 bg-brand-50 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide text-brand-900">
                    <span className="size-1.5 rounded-full bg-brand-700" />
                    {item.category}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-950 transition-colors group-hover:text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-700">{item.body}</p>

                <ul className="mt-5 flex flex-1 flex-wrap items-start content-start gap-1.5">
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-ink-200 bg-[#f8faf6] px-2.5 py-1 text-[0.75rem] font-semibold tracking-tight text-ink-800 transition-colors duration-200 group-hover:border-brand-200 group-hover:bg-brand-50/70"
                    >
                      <span className="size-1 rounded-full bg-brand-700 opacity-75" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-ink-200/90 pt-4">
                  <Link
                    href={item.href}
                    className="group/btn inline-flex items-center gap-2 rounded-sm border border-ink-300 bg-white px-4 py-2 text-xs font-bold text-ink-900 shadow-2xs transition-all duration-300 hover:border-brand-800 hover:bg-brand-800 hover:text-white"
                  >
                    <span>Hizmeti incele</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  <span className="text-xs font-semibold text-ink-500 transition-colors group-hover:text-ink-800">
                    Detayları gör
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/hizmetler" size="lg" variant="dark">
            Tüm hizmetlerimiz
          </ButtonLink>
          <ButtonLink href="/teklif" size="lg" variant="outline">
            Projenizi konuşalım
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Mağazaya geçiş köprüsü */

/** Tanıtım bölümünden ürün satışı bölümüne geçişi anlatan ayraç. */
export function StoreIntro({ productCount }: { productCount: number }) {
  return (
    <section className="container-page pt-16 lg:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
          Dijital ürün mağazası
        </p>
        <h2 className="text-balance-title text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-[2.75rem]">
          Aylarca beklemek istemiyorsanız: hazır ürünlerimiz
        </h2>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-600">
          Yıllar içinde geliştirdiğimiz çözümleri {productCount} hazır ürün haline getirdik. Canlı
          demosunu inceleyin, lisansı ve ek hizmetleri seçin, günler içinde yayına girin. Kurulumu
          ister siz yapın, ister biz üstlenelim.
        </p>
      </div>
    </section>
  );
}
