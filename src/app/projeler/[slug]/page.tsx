import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink, Globe2, Layers3, MonitorSmartphone, Smartphone } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseJsonArray, productCardSelect } from "@/lib/data/products";
import { ProjectShowcase, type ProjectSlideItem } from "@/components/portfolio/ProjectShowcase";
import { ReferenceCard } from "@/components/portfolio/ReferenceCard";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge, Breadcrumb, ButtonLink, Card, SectionHeading } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const revalidate = 600;

export async function generateStaticParams() {
  const projects = await prisma.portfolioProject.findMany({ select: { slug: true } });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `${SITE.url}/projeler/${slug}` },
    openGraph: { title: project.title, description: project.summary, images: [project.coverImage] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({ where: { slug } });
  if (!project) notFound();

  const [related, products] = await Promise.all([
    prisma.portfolioProject.findMany({
      where: { category: project.category, id: { not: project.id } },
      orderBy: { completedAt: "desc" },
      take: 3,
      select: {
        id: true, slug: true, title: true, client: true, sector: true,
        summary: true, coverImage: true, mobileImage: true, liveUrl: true,
      },
    }),
    // Bu projeye benzer bir işi hazır ürünle başlatmak isteyenler için öneri
    prisma.product.findMany({
      where: {
        isPublished: true,
        type: "website",
        ...(project.category === "saglik" ? { category: { slug: "klinik-saglik-siteleri" } } : {}),
      },
      select: productCardSelect,
      orderBy: { salesCount: "desc" },
      take: 3,
    }),
  ]);

  const services = parseJsonArray(project.services);
  const technologies = parseJsonArray(project.technologies);
  const deliverables = parseJsonArray(project.deliverables);
  const results = parseJsonArray<{ label: string; value: string }>(project.results);
  const gallery = parseJsonArray<string>(project.gallery);
  const isLazogluProject = project.slug === "lazoglu-kuruyemis-eticaret-sitesi";
  const isFkKuruyemisProject = project.slug === "fk-kuruyemis-eticaret-sitesi";
  const isMillwalProject = project.slug === "millwal-kurumsal-kiralama-web-sitesi";
  const isRealReferenceSiteProject = isLazogluProject || isFkKuruyemisProject || isMillwalProject;

  const lazogluShowcaseImages = [
    { id: "lazoglu-anasayfa", type: "desktop" as const, label: "1. Ana Sayfa Karşılama (Masaüstü Hero)", shortLabel: "1. Ana Sayfa", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/lazoglukuruyemis-anasayfa-masaustu.webp", alt: "Lazoğlu Kuruyemiş ana sayfa masaüstü karşılama ekranı", width: 1917, height: 908 },
    { id: "lazoglu-urunler", type: "desktop" as const, label: "2. Ürün Kataloğu & Kategoriler (Masaüstü)", shortLabel: "2. Ürünler", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/lazoglukuruyemis-urunler-masaustu.webp", alt: "Lazoğlu Kuruyemiş ürün kataloğu ve kategori filtreleme ekranı", width: 1917, height: 910 },
    { id: "lazoglu-hakkimizda", type: "desktop" as const, label: "3. Hakkımızda & Çorum Hikayesi (Masaüstü)", shortLabel: "3. Hakkımızda", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/lazoglukuruyemis-hakkimizda-masaustu.webp", alt: "Lazoğlu Kuruyemiş hakkımızda ve Çorum hikayesi sayfası", width: 1917, height: 912 },
    { id: "lazoglu-blog", type: "desktop" as const, label: "4. Blog & İçerik Sayfası (Masaüstü)", shortLabel: "4. Blog", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/lazoglukuruyemis-blog-masaustu.webp", alt: "Lazoğlu Kuruyemiş blog ve içerik sayfası", width: 1440, height: 2200 },
    { id: "lazoglu-iletisim", type: "desktop" as const, label: "5. İletişim & Mağaza Bilgileri (Masaüstü)", shortLabel: "5. İletişim", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/lazoglukuruyemis-iletisim-masaustu.webp", alt: "Lazoğlu Kuruyemiş iletişim ve mağaza bilgileri sayfası", width: 1440, height: 1370 },
    { id: "lazoglu-mobil", type: "mobile" as const, label: "6. Mobil Alışveriş Deneyimi (Mobil)", shortLabel: "6. Mobil Görünüm", badge: "Mobil Öncelikli / 390px", icon: "📱", url: "/gorseller/referanslar/lazoglukuruyemis-mobil.webp", alt: "Lazoğlu Kuruyemiş mobil alışveriş deneyimi", width: 375, height: 2600 },
  ];

  const fkKuruyemisShowcaseImages = [
    { id: "fk-anasayfa", type: "desktop" as const, label: "1. Ana Sayfa Karşılama (Masaüstü Hero)", shortLabel: "1. Ana Sayfa", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/fkkuruyemis-anasayfa-masaustu.webp", alt: "FK Kuruyemiş ana sayfa masaüstü karşılama ekranı", width: 1917, height: 906 },
    { id: "fk-urunler", type: "desktop" as const, label: "2. Ürün Kataloğu & Leblebi Çeşitleri (Masaüstü)", shortLabel: "2. Ürünler", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/fkkuruyemis-urunler-masaustu.webp", alt: "FK Kuruyemiş ürün kataloğu ve leblebi çeşitleri ekranı", width: 1917, height: 907 },
    { id: "fk-hakkimizda", type: "desktop" as const, label: "3. Hakkımızda & Çorum Leblebi Kültürü (Masaüstü)", shortLabel: "3. Hakkımızda", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/fkkuruyemis-hakkimizda-masaustu.webp", alt: "FK Kuruyemiş hakkımızda ve Çorum leblebi kültürü sayfası", width: 1440, height: 1780 },
    { id: "fk-blog", type: "desktop" as const, label: "4. Blog & İçerik Sayfası (Masaüstü)", shortLabel: "4. Blog", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/fkkuruyemis-blog-masaustu.webp", alt: "FK Kuruyemiş blog ve içerik sayfası", width: 1917, height: 911 },
    { id: "fk-iletisim", type: "desktop" as const, label: "5. İletişim & Sipariş Bilgileri (Masaüstü)", shortLabel: "5. İletişim", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/fkkuruyemis-iletisim-masaustu.webp", alt: "FK Kuruyemiş iletişim ve sipariş bilgileri sayfası", width: 1440, height: 1380 },
    { id: "fk-mobil", type: "mobile" as const, label: "6. Mobil Alışveriş Deneyimi (Mobil)", shortLabel: "6. Mobil Görünüm", badge: "Mobil Öncelikli / 390px", icon: "📱", url: "/gorseller/referanslar/fkkuruyemis-mobil.webp", alt: "FK Kuruyemiş mobil alışveriş deneyimi", width: 375, height: 2600 },
  ];

  const millwalShowcaseImages = [
    { id: "millwal-anasayfa", type: "desktop" as const, label: "1. Ana Sayfa Karşılama (Masaüstü Hero)", shortLabel: "1. Ana Sayfa", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/millwallkurumsalkiralama-anasayfa-masaustu.webp", alt: "Millwal Kurumsal Kiralama ana sayfa masaüstü karşılama ekranı", width: 1917, height: 912 },
    { id: "millwal-araclar", type: "desktop" as const, label: "2. Araç Filosu & Kiralama Seçenekleri (Masaüstü)", shortLabel: "2. Araçlar", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/millwallkurumsalkiralama-araclar-masaustu.webp", alt: "Millwal Kurumsal Kiralama araç filosu ve kiralama seçenekleri ekranı", width: 1911, height: 908 },
    { id: "millwal-kurumsal", type: "desktop" as const, label: "3. Kurumsal Kiralama Çözümleri (Masaüstü)", shortLabel: "3. Kurumsal", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/millwallkurumsalkiralama-kurumsal-masaustu.webp", alt: "Millwal Kurumsal Kiralama kurumsal kiralama çözümleri sayfası", width: 1440, height: 1600 },
    { id: "millwal-filo", type: "desktop" as const, label: "4. Filo Kiralama Hizmetleri (Masaüstü)", shortLabel: "4. Filo Kiralama", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/millwallkurumsalkiralama-filokiralama-masaustu.webp", alt: "Millwal Kurumsal Kiralama filo kiralama hizmetleri sayfası", width: 1440, height: 860 },
    { id: "millwal-iletisim", type: "desktop" as const, label: "5. İletişim & Teklif Formu (Masaüstü)", shortLabel: "5. İletişim", badge: "Geniş Ekran / 1440px", icon: "💻", url: "/gorseller/referanslar/millwallkurumsalkiralama-iletisim-masaustu.webp", alt: "Millwal Kurumsal Kiralama iletişim ve teklif formu sayfası", width: 1917, height: 911 },
    { id: "millwal-mobil", type: "mobile" as const, label: "6. Mobil Araç Kiralama Deneyimi (Mobil)", shortLabel: "6. Mobil Görünüm", badge: "Mobil Öncelikli / 390px", icon: "📱", url: "/gorseller/referanslar/millwallkurumsalkiralama-mobil.webp", alt: "Millwal Kurumsal Kiralama mobil araç kiralama deneyimi", width: 325, height: 2000 },
  ];

  const realReferenceShowcaseImages = isLazogluProject
    ? lazogluShowcaseImages
    : isFkKuruyemisProject
    ? fkKuruyemisShowcaseImages
    : isMillwalProject
    ? millwalShowcaseImages
    : [];
  const featuredReferenceImage = realReferenceShowcaseImages[0];
  const secondaryReferenceImages = realReferenceShowcaseImages.slice(1, 5);
  const mobileReferenceImage = realReferenceShowcaseImages.find((image) => image.type === "mobile");

  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;
  const impactStats = [
    { label: "Cihaz Uyumu", value: "Web + Mobil" },
    { label: "Teslimat", value: "Canlı Yayın" },
    { label: "Odak", value: project.sector },
  ];

  return (
    <div className="bg-[#fcfdfa] pb-24">
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Projeler", href: "/projeler" },
          { label: project.client },
        ]}
      />

      <section className="relative mt-6 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-[#e1eae0] bg-white text-ink-950 shadow-[0_16px_50px_-24px_rgba(20,40,25,0.08)]">
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe1ca] bg-[#eef7ed] px-3.5 py-1 text-xs font-bold text-[#1b5e39]">
                  <span className="size-2 rounded-full bg-[#22774a]" />
                  {project.sector}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">{project.client}</span>
              </div>
              <h1 className="mt-5 text-balance-title text-3xl font-black leading-tight tracking-tight text-ink-950 sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#16291f] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#22774a] hover:-translate-y-0.5"
                  >
                    <span>Siteyi canlı gör</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                <ButtonLink
                  href="/teklif"
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-ink-200 bg-[#f8faf6] text-ink-800 hover:bg-white hover:border-[#22774a]"
                >
                  Benzerini yaptır
                </ButtonLink>
              </div>
            </div>

            <dl className="mt-9 grid gap-3 sm:grid-cols-3">
              {impactStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#e5ede3] bg-[#f7faf5] px-4 py-3">
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-400">{item.label}</dt>
                  <dd className="mt-1 text-sm font-bold text-ink-950">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-h-[380px] border-t border-[#e2eae0] bg-gradient-to-br from-[#f2f7f1] via-[#ebf3ea] to-[#e2efe1] p-5 sm:p-8 lg:border-l lg:border-t-0 flex items-center justify-center">
            <div className="relative w-full h-full min-h-[340px] flex items-center justify-center">
              {/* Desktop Window Frame */}
              <div className="w-full overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-xl">
                <div className="flex h-10 items-center justify-between border-b border-ink-100 bg-[#fafbfa] px-4">
                  <div className="flex gap-1.5" aria-hidden>
                    <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="size-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-ink-200/80 bg-white px-3 py-0.5 text-[0.68rem] font-medium text-ink-700">
                    <span className="size-1.5 rounded-full bg-[#22774a]" />
                    <span className="max-w-[200px] truncate">{host ?? project.client}</span>
                  </div>
                  <div className="w-8" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              {/* Floating Mobile Phone Frame */}
              {project.mobileImage && (
                <div className="absolute -bottom-4 right-2 w-32 overflow-hidden rounded-[2rem] border-[6px] border-[#070e0a] bg-[#070e0a] shadow-2xl ring-1 ring-black/10 sm:w-36 sm:right-4">
                  {/* Dynamic Island */}
                  <div className="relative aspect-[9/18] overflow-hidden rounded-[1.5rem] bg-black">
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-10 rounded-full bg-black z-10 border border-white/10" />
                    <Image
                      src={project.mobileImage}
                      alt={`${project.client} mobil görünüm`}
                      fill
                      sizes="160px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5 Görselli İnteraktif Cihaz Vitrini */}
      <div className="mt-10">
        <ProjectShowcase
          title={project.title}
          client={project.client}
          liveUrl={project.liveUrl}
          desktopImage={project.coverImage}
          mobileImage={project.mobileImage}
          slides={
            isRealReferenceSiteProject
              ? realReferenceShowcaseImages.map((image): ProjectSlideItem => ({
                  id: image.id,
                  type: image.type,
                  label: image.label,
                  shortLabel: image.shortLabel,
                  badge: image.badge,
                  icon: image.icon,
                  url: image.url,
                  alt: image.alt,
                  width: image.width,
                  height: image.height,
                }))
            : project.slug === "gebze-cimnastik-akademi-web-sitesi"
              ? gallery.map((url, index): ProjectSlideItem => ({
                  id: "gebze-cimnastik-" + index,
                  type: index === 0 ? "desktop" : "mobile",
                  label: ["Ana Sayfa · Masaüstü", "Ana Sayfa · Mobil", "Hakkımızda · Mobil", "Salonumuz · Mobil"][index],
                  shortLabel: ["Ana Sayfa", "Mobil", "Hakkımızda", "Salonumuz"][index],
                  badge: index === 0 ? "Masaüstü" : "Mobil",
                  icon: index === 0 ? "💻" : "📱",
                  url,
                  alt: project.client + " — " + ["Ana sayfa masaüstü", "Ana sayfa mobil", "Hakkımızda", "Salonumuz"][index],
                }))
              : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/zenitdent-hero-pc.png",
                    alt: "Zenit Dental Poliklinikleri ana sayfa klinik ve tedavi karşılama ekranı",
                  },
                  {
                    id: "desktop-treatments",
                    type: "desktop",
                    label: "2. Tedavilerimiz & Cerrahi Kataloğu (Masaüstü)",
                    shortLabel: "2. Tedaviler",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/zenitdent-tedaviler-pc.png",
                    alt: "Zenit Dental Ağız ve Çene Cerrahisi, implant, beyazlatma ve ortodonti tedavi kataloğu",
                  },
                  {
                    id: "mobile-hero",
                    type: "mobile",
                    label: "3. Gebze Diş Kliniği & Randevu (Mobil Hero)",
                    shortLabel: "3. Mobil Hero",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/zenitdent-hero-mobil.png",
                    alt: "Zenit Dental mobil ana sayfa hızlı randevu ve hizmetler ekranı",
                  },
                  {
                    id: "mobile-about",
                    type: "mobile",
                    label: "4. Hakkımızda & Kurumsal Değerler (Mobil)",
                    shortLabel: "4. Hakkımızda",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/zenitdent-hakkimizda-mobil.png",
                    alt: "Zenit Dental kurumsal değerler, global hizmet ve klinik hekim vitrini",
                  },
                  {
                    id: "mobile-contact",
                    type: "mobile",
                    label: "5. Şube Randevu & Mesaj Formu (Mobil)",
                    shortLabel: "5. Randevu & İletişim",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/zenitdent-randevu-mobil.png",
                    alt: "Zenit Dental şube seçimi ve online randevu başvuru formu mobil görünümü",
                  },
                ]
              : project.slug === "solodent-agiz-ve-dis-sagligi-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Klinik Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/dentsolo-hero-pc.png",
                    alt: "SoloDent Ağız ve Diş Sağlığı Polikliniği ana sayfa klinik karşılama ekranı",
                  },
                  {
                    id: "desktop-invisalign",
                    type: "desktop",
                    label: "2. Invisalign Şeffaf Plak Tedavisi (Masaüstü)",
                    shortLabel: "2. Invisalign",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/dentsolo-invisalign-pc.png",
                    alt: "SoloDent Invisalign şeffaf plak tedavisi detay sayfası",
                  },
                  {
                    id: "mobile-treatments",
                    type: "mobile",
                    label: "3. Tedaviler & İmplantoloji Kataloğu (Mobil)",
                    shortLabel: "3. Tedaviler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/dentsolo-tedaviler-mobil.png",
                    alt: "SoloDent implant, panoramik röntgen ve çocuk diş hekimliği mobil sayfası",
                  },
                  {
                    id: "mobile-doctor",
                    type: "mobile",
                    label: "4. Uzman Hekim & Klinik Tedavi (Mobil)",
                    shortLabel: "4. Hekim & Klinik",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/dentsolo-hekim-mobil.png",
                    alt: "SoloDent uzman hekim hasta tedavi uygulama mobil görünümü",
                  },
                  {
                    id: "mobile-blog",
                    type: "mobile",
                    label: "5. Diş Sağlığı Blogu & Hasta Rehberi (Mobil)",
                    shortLabel: "5. Blog & Rehber",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/dentsolo-blog-mobil.png",
                    alt: "SoloDent dişte lezyon ve leke tedavisi rehberi mobil sayfası",
                  },
                ]
              : project.slug === "akn-akpinar-hafriyat-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Kiralık İş Makinesi (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/akpinarhafriyat-hero-pc.png",
                    alt: "AKN Akpınar Hafriyat ana sayfa iş makinesi kiralama masaüstü hero ekranı",
                  },
                  {
                    id: "desktop-fleet",
                    type: "desktop",
                    label: "2. Araçlarımız & Makine Parkuru (Masaüstü)",
                    shortLabel: "2. Araç Filosu",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/akpinarhafriyat-araclar-pc.png",
                    alt: "AKN Akpınar Hafriyat JCB, kato, kepçe ve ekskavatör araç filosu ekranı",
                  },
                  {
                    id: "mobile-hero",
                    type: "mobile",
                    label: "3. Mobil Hızlı Arama & İletişim (Mobil)",
                    shortLabel: "3. Hemen Ara (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/akpinarhafriyat-hero-mobil.png",
                    alt: "AKN Akpınar Hafriyat tek tıkla ara mobil görünümü",
                  },
                  {
                    id: "desktop-gallery",
                    type: "desktop",
                    label: "4. Şantiye Operasyon Galerimiz (Masaüstü Grid)",
                    shortLabel: "4. Şantiye Galerisi",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/akpinarhafriyat-galeri-pc.png",
                    alt: "AKN Akpınar Hafriyat şantiye hafriyat ve iş makinesi operasyon fotoğrafları",
                  },
                ]
              : project.slug === "salkim-sogut-sigorta-web-sitesi"
              ? [
                  {
                    id: "desktop-services",
                    type: "desktop",
                    label: "1. Poliçe & Hizmetlerimiz (Masaüstü Hero)",
                    shortLabel: "1. Poliçeler",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/salkimsogut-hizmetler-pc.png",
                    alt: "Salkım Söğüt Sigorta hizmetlerimiz ve poliçeler masaüstü ekranı",
                  },
                  {
                    id: "desktop-office",
                    type: "desktop",
                    label: "2. Acente Ofisimiz & Kurumsal Kadro (Masaüstü)",
                    shortLabel: "2. Ofis & Ekip",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/salkimsogut-ofis-pc.png",
                    alt: "Salkım Söğüt Sigorta acente ofis içi ve danışman ekibi masaüstü görünümü",
                  },
                  {
                    id: "mobile-services",
                    type: "mobile",
                    label: "3. Sağlık & Kasko Hizmetleri (Mobil)",
                    shortLabel: "3. Poliçeler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/salkimsogut-hizmetler-mobil.png",
                    alt: "Salkım Söğüt Sigorta sağlık ve kasko poliçeleri mobil görünümü",
                  },
                  {
                    id: "desktop-blog",
                    type: "desktop",
                    label: "4. Sigorta Rehberi & Bilgi Bankası (Masaüstü)",
                    shortLabel: "4. Blog & İMM",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/salkimsogut-blog-pc.png",
                    alt: "Salkım Söğüt Sigorta İMM ve kasko rehberi blog sayfası",
                  },
                  {
                    id: "mobile-blog",
                    type: "mobile",
                    label: "5. Sigorta Blogu & Makaleler (Mobil)",
                    shortLabel: "5. Blog (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/salkimsogut-blog-mobil.png",
                    alt: "Salkım Söğüt Sigorta sigorta rehberi mobil makale sayfası",
                  },
                ]
              : project.slug === "ndn-arsa-yatirim-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Arsa Filtreleme (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ndnarsa-hero-pc.png",
                    alt: "NDN Arsa Yatırım ana sayfa arsa filtreleme motoru masaüstü hero ekranı",
                  },
                  {
                    id: "desktop-about",
                    type: "desktop",
                    label: "2. Kurumsal Güvence & Hakkımızda (Masaüstü)",
                    shortLabel: "2. Hakkımızda",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ndnarsa-hakkimizda-pc.png",
                    alt: "NDN Arsa Yatırım kurumsal hakkımızda ve güvenceli arsa yatırımı masaüstü ekranı",
                  },
                  {
                    id: "mobile-hero",
                    type: "mobile",
                    label: "3. Mobil Ana Sayfa & Geleceğin Alanları (Mobil)",
                    shortLabel: "3. Ana Sayfa (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ndnarsa-hero-mobil.png",
                    alt: "NDN Arsa Yatırım mobil ana sayfa ve arsa arama görünümü",
                  },
                  {
                    id: "mobile-about",
                    type: "mobile",
                    label: "4. Kurumsal Güven & Standartlar (Mobil)",
                    shortLabel: "4. Hakkımızda (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ndnarsa-hakkimizda-mobil.png",
                    alt: "NDN Arsa Yatırım kurumsal hakkımızda mobil sayfası",
                  },
                  {
                    id: "desktop-blog",
                    type: "desktop",
                    label: "5. Arsa Yatırım Rehberi & Blog (Masaüstü)",
                    shortLabel: "5. Blog & Rehber",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ndnarsa-blog-pc.png",
                    alt: "NDN Arsa Yatırım sektörel arsa alım rehberi ve blog masaüstü ekranı",
                  },
                ]
              : project.slug === "mac-mekanik-ve-insaat-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Mekanik Tesisat (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/macmekanik-hero-pc.png",
                    alt: "MAC Mekanik & İnşaat ana sayfa mekanik tesisat masaüstü hero ekranı",
                  },
                  {
                    id: "desktop-villa",
                    type: "desktop",
                    label: "2. Modern Konut Projeleri & Villa (Masaüstü)",
                    shortLabel: "2. Konut & Villa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/macmekanik-villa-pc.png",
                    alt: "MAC İnşaat modern villa ve konut mimari proje ekranı",
                  },
                  {
                    id: "mobile-services",
                    type: "mobile",
                    label: "3. Mekanik Tesisat Hizmetleri (Mobil)",
                    shortLabel: "3. Hizmetler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/macmekanik-hizmet-mobil.png",
                    alt: "MAC Mekanik endüstriyel tesisat ve havalandırma hizmetleri mobil görünümü",
                  },
                  {
                    id: "desktop-projects",
                    type: "desktop",
                    label: "4. Projelerimiz & Şantiye Portföyü (Masaüstü Grid)",
                    shortLabel: "4. Projeler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/macmekanik-proje-pc.png",
                    alt: "MAC İnşaat Kartal Soğanlık ve Üsküdar Zeynep Kamil konut projeleri masaüstü ekranı",
                  },
                  {
                    id: "mobile-projects",
                    type: "mobile",
                    label: "5. Konut Projeleri Kataloğu (Mobil)",
                    shortLabel: "5. Projeler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/macmekanik-proje-mobil.png",
                    alt: "MAC İnşaat konut projeleri ve şantiye detayları mobil görünümü",
                  },
                ]
              : project.slug === "kuruoglu-kerestecilik-ve-dis-ticaret-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kuruoglukerestecilik-masaustu.png",
                    alt: "Kuruoğlu Kerestecilik ana sayfa masaüstü hero karşılama ekranı",
                  },
                  {
                    id: "mobile-products",
                    type: "mobile",
                    label: "2. Orman Ürünleri & Ürünler Kataloğu (Mobil)",
                    shortLabel: "2. Ürünler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kuruoglukerestecilik-mobil.png",
                    alt: "Kuruoğlu Kerestecilik ahşap ürünleri mobil görünümü",
                  },
                  {
                    id: "desktop-products",
                    type: "desktop",
                    label: "3. 67+ Ahşap & Kereste Ürün Kataloğu (Masaüstü)",
                    shortLabel: "3. Ürünler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kuruoglukerestecilik-urunler-masaustu.png",
                    alt: "Kuruoğlu Kerestecilik 67 çeşit ahşap ürün kataloğu masaüstü ekranı",
                  },
                  {
                    id: "desktop-gallery",
                    type: "desktop",
                    label: "4. Tomruk & Kereste Üretim Parkuru Galerisi (Masaüstü)",
                    shortLabel: "4. Fabrika Galerisi",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kuruoglukerestecilik-galeri-masaustu.png",
                    alt: "Kuruoğlu Kerestecilik fabrika tomruk ve üretim galerisi masaüstü ekranı",
                  },
                  {
                    id: "mobile-blog",
                    type: "mobile",
                    label: "5. Sektörel Ahşap Rehberi & Blog (Mobil)",
                    shortLabel: "5. Blog (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kuruoglukerestecilik-blog-mobil.png",
                    alt: "Kuruoğlu Kerestecilik sektörel kereste ve ahşap rehberi mobil görünümü",
                  },
                ]
              : project.slug === "kosuyolu-rezonans-merkezi-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama & Randevu (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kosuyolurezonans-masaustu.png",
                    alt: "Koşuyolu Rezonans ana sayfa masaüstü hero karşılama ekranı",
                  },
                  {
                    id: "mobile-home",
                    type: "mobile",
                    label: "2. Mobil Ana Sayfa & Terapi Tanıtımı (Mobil)",
                    shortLabel: "2. Ana Sayfa (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kosuyolurezonans-mobil.png",
                    alt: "Koşuyolu Rezonans mobil ana sayfa görünümü",
                  },
                  {
                    id: "desktop-treatments",
                    type: "desktop",
                    label: "3. Tedaviler & Biorezonans Terapileri (Masaüstü)",
                    shortLabel: "3. Tedaviler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kosuyolurezonans-tedaviler-masaustu.png",
                    alt: "Koşuyolu Rezonans biorezonans terapileri masaüstü ekranı",
                  },
                  {
                    id: "mobile-treatments",
                    type: "mobile",
                    label: "4. Bütüncül Tedaviler Kataloğu (Mobil)",
                    shortLabel: "4. Tedaviler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kosuyolurezonans-tedaviler-mobil.png",
                    alt: "Koşuyolu Rezonans bütüncül tedaviler mobil görünümü",
                  },
                  {
                    id: "mobile-slide2",
                    type: "mobile",
                    label: "5. Seans & Randevu Bilgilendirmesi (Mobil)",
                    shortLabel: "5. Seanslar (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kosuyolurezonans-slide2-mobil.png",
                    alt: "Koşuyolu Rezonans seans ve randevu bilgilendirmesi mobil görünümü",
                  },
                ]
              : project.slug === "ada-motor-istanbul-eticaret-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/adamotor-masaustu.png",
                    alt: "Ada Motor İstanbul ana sayfa masaüstü hero karşılama ekranı",
                  },
                  {
                    id: "mobile-products",
                    type: "mobile",
                    label: "2. Ana Sayfa & Ürünler (Mobil)",
                    shortLabel: "2. Ürünler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/adamotor-mobil.png",
                    alt: "Ada Motor İstanbul ana sayfa ve ürünler mobil görünümü",
                  },
                  {
                    id: "desktop-motorcycles",
                    type: "desktop",
                    label: "3. Motosiklet Modelleri (Masaüstü Grid)",
                    shortLabel: "3. Motosikletler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/adamotor-motosiklet-masaustu.png",
                    alt: "Ada Motor İstanbul motosiklet modelleri katalog sayfası",
                  },
                  {
                    id: "mobile-accessories",
                    type: "mobile",
                    label: "4. Aksesuar & Kasklar (Mobil)",
                    shortLabel: "4. Aksesuar (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/adamotor-aksesuar-mobil.png",
                    alt: "Ada Motor İstanbul aksesuarlar ve kasklar mobil sayfası",
                  },
                  {
                    id: "desktop-accessories",
                    type: "desktop",
                    label: "5. Kask & Aksesuarlar (Masaüstü Grid)",
                    shortLabel: "5. Aksesuar (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/adamotor-aksesuar-masaustu.png",
                    alt: "Ada Motor İstanbul kask ve aksesuarlar masaüstü grid ekranı",
                  },
                ]
              : project.slug === "ans-sigorta-aracilik-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama & Teklif Al (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ans-sigorta-masaustu.png",
                    alt: "ANS Sigorta ana sayfa hemen teklif al masaüstü karşılama ekranı",
                  },
                  {
                    id: "mobile-services",
                    type: "mobile",
                    label: "2. Trafik & Kasko Sigortası (Mobil)",
                    shortLabel: "2. Poliçeler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ans-sigorta-mobil.png",
                    alt: "ANS Sigorta trafik ve kasko poliçeleri mobil görünümü",
                  },
                  {
                    id: "desktop-services",
                    type: "desktop",
                    label: "3. Hizmetlerimiz & Poliçeler (Masaüstü Grid)",
                    shortLabel: "3. Hizmetler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ans-sigorta-hizmetler-masaustu.png",
                    alt: "ANS Sigorta hizmetlerimiz, kasko, trafik ve DASK masaüstü grid ekranı",
                  },
                  {
                    id: "mobile-why-us",
                    type: "mobile",
                    label: "4. Neden Bizi Seçmelisiniz? (Mobil)",
                    shortLabel: "4. Avantajlar (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ans-sigorta-avantajlar-mobil.png",
                    alt: "ANS Sigorta neden biz kurumsal avantajlar mobil görünümü",
                  },
                  {
                    id: "desktop-blog",
                    type: "desktop",
                    label: "5. Sağlık Sigortası & Bilgi Bankası (Masaüstü)",
                    shortLabel: "5. Bilgi Bankası (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ans-sigorta-blog-masaustu.png",
                    alt: "ANS Sigorta tamamlayıcı sağlık sigortası ve rehber blog masaüstü ekranı",
                  },
                ]
              : project.slug === "curecare-ilac-saglik-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/curecare-masaustu.png",
                    alt: "CureCare ana sayfa Önce Koru Sonra İyileştir masaüstü karşılama ekranı",
                  },
                  {
                    id: "mobile-products",
                    type: "mobile",
                    label: "2. İlaç & Ürün Kataloğu (Mobil)",
                    shortLabel: "2. Ürünler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/curecare-mobil.png",
                    alt: "CureCare ilaç ve sağlık ürünleri mobil katalog görünümü",
                  },
                  {
                    id: "desktop-products",
                    type: "desktop",
                    label: "3. Ürünlerimiz & Kategori Filtreleme (Masaüstü Grid)",
                    shortLabel: "3. Ürünler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/curecare-urunler-masaustu.png",
                    alt: "CureCare ürünlerimiz ve ilaç kategorileri masaüstü filtreleme ekranı",
                  },
                  {
                    id: "mobile-about",
                    type: "mobile",
                    label: "4. Kurumsal & Misyonumuz (Mobil)",
                    shortLabel: "4. Hakkımızda (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/curecare-hakkimizda-mobil.png",
                    alt: "CureCare kurumsal yaklaşım ve misyon mobil sayfası",
                  },
                  {
                    id: "desktop-contact",
                    type: "desktop",
                    label: "5. İletişim Formu & İş Ortaklarımız (Masaüstü)",
                    shortLabel: "5. İletişim (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/curecare-iletisim-masaustu.png",
                    alt: "CureCare iletişim formu ve kurumsal iş ortakları masaüstü sayfası",
                  },
                ]
              : project.slug === "ena-tabela-reklam-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Özel Üretim & Referanslar (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ena-reklam-masaustu.png",
                    alt: "Ena Reklam ana sayfa özel ürün üretim ve müşteri logoları masaüstü ekranı",
                  },
                  {
                    id: "mobile-print",
                    type: "mobile",
                    label: "2. Baskı Hizmetleri & Cephe Giydirme (Mobil)",
                    shortLabel: "2. Baskı & Cephe (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ena-reklam-mobil.png",
                    alt: "Ena Reklam dijital baskı ve cephe giydirme mobil görünümü",
                  },
                  {
                    id: "desktop-blog",
                    type: "desktop",
                    label: "3. Sektörel Blog & Cephe Giydirme (Masaüstü)",
                    shortLabel: "3. Blog & Hizmetler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/ena-reklam-hizmetler-masaustu.png",
                    alt: "Ena Reklam baskı hizmetleri ve sektörel blog masaüstü ekranı",
                  },
                  {
                    id: "mobile-projects",
                    type: "mobile",
                    label: "4. Işıklı Kutu Harf & Araç Giydirme (Mobil)",
                    shortLabel: "4. Kutu Harf (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ena-reklam-isler-mobil.png",
                    alt: "Ena Reklam Hasçelik kutu harf ve araç giydirme mobil görünümü",
                  },
                  {
                    id: "mobile-contact",
                    type: "mobile",
                    label: "5. İletişim Bilgileri & Kurumsal Footer (Mobil)",
                    shortLabel: "5. İletişim (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/ena-reklam-iletisim-mobil.png",
                    alt: "Ena Reklam kurumsal iletişim bilgileri ve adres mobil görünümü",
                  },
                ]
              : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Poliklinik Tanıtımı (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/everydent-masaustu.png",
                    alt: "EveryDent Diş Polikliniği ana sayfa panoramik bina ve randevu al karşılama ekranı",
                  },
                  {
                    id: "mobile-treatments",
                    type: "mobile",
                    label: "2. Klinik & Tedavilerimiz (Mobil)",
                    shortLabel: "2. Tedaviler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/everydent-mobil.png",
                    alt: "EveryDent implant ve zirkonyum kaplama tedavileri mobil görünümü",
                  },
                  {
                    id: "desktop-blog",
                    type: "desktop",
                    label: "3. Ağız & Diş Sağlığı Blog Kataloğu (Masaüstü)",
                    shortLabel: "3. Bloglar (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/everydent-blog-masaustu.png",
                    alt: "EveryDent diş sağlığı rehberi ve uzman hekim blogları masaüstü grid ekranı",
                  },
                  {
                    id: "mobile-pedodontics",
                    type: "mobile",
                    label: "4. Pediatrik Diş & Gülüş Tasarımı (Mobil)",
                    shortLabel: "4. Gülüş Tasarımı (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/everydent-tedaviler-mobil.png",
                    alt: "EveryDent çocuk diş hekimliği ve estetik gülüş tasarımı mobil sayfası",
                  },
                  {
                    id: "mobile-blog",
                    type: "mobile",
                    label: "5. Diş Sağlığı Rehberi & Bloglar (Mobil)",
                    shortLabel: "5. Bloglar (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/everydent-blog-mobil.png",
                    alt: "EveryDent diş sıkma ve diş beyazlatma blog rehberi mobil sayfası",
                  },
                ]
              : project.slug === "fms-hukuk-danismanlik-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Hakettiğiniz Adalet İçin Mücadele (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/fmshukuk-masaustu.png",
                    alt: "FMS Hukuk ana sayfa Hakettiğiniz Adalet İçin Mücadele Ediyoruz masaüstü hero ekranı",
                  },
                  {
                    id: "mobile-hero",
                    type: "mobile",
                    label: "2. Hukuksal Çözümler & Danışmanlık (Mobil)",
                    shortLabel: "2. Çözümler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/fmshukuk-mobil.png",
                    alt: "FMS Hukuk Avukat Furkan Alyakut ve hukuksal çözümler mobil sayfası",
                  },
                  {
                    id: "desktop-services",
                    type: "desktop",
                    label: "3. Hukuki Hizmetler & Müşavirlik Kataloğu (Masaüstü)",
                    shortLabel: "3. Hizmetler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/fmshukuk-hizmetler-masaustu.png",
                    alt: "FMS Hukuk kurumsal hukuk müşavirliği, iş, sözleşme ve ceza avukatlığı masaüstü ekranı",
                  },
                  {
                    id: "mobile-services",
                    type: "mobile",
                    label: "4. Kurumsal Hukuk & İşçi/İşveren Avukatı (Mobil)",
                    shortLabel: "4. Hizmetler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/fmshukuk-hizmetler-mobil.png",
                    alt: "FMS Hukuk kurumsal müşavirlik ve iş hukuku mobil sayfası",
                  },
                  {
                    id: "desktop-about",
                    type: "desktop",
                    label: "5. Kurumsal Hakkımızda & Av. Furkan Alyakut (Masaüstü)",
                    shortLabel: "5. Hakkımızda (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/fmshukuk-hakkimizda-masaustu.png",
                    alt: "FMS Hukuk kurumsal hakkında, vizyon, misyon ve avukatlık bürosu tanıtım ekranı",
                  },
                ]
              : project.slug === "gebze-bayrak-web-sitesi"
              ? [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa & Büyük Boy Atatürk Posteri (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/gebzebayrak-masaustu.png",
                    alt: "Gebze Bayrak ana sayfa büyük boy Atatürk posteri ve bayrak ürünleri masaüstü hero ekranı",
                  },
                  {
                    id: "mobile-home",
                    type: "mobile",
                    label: "2. Büyük Boy Atatürk Posteri & Bayraklar (Mobil)",
                    shortLabel: "2. Atatürk Posteri (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/gebzebayrak-mobil.png",
                    alt: "Gebze Bayrak Atatürk posteri ve Türk bayrağı ürünleri mobil ekranı",
                  },
                  {
                    id: "desktop-kanun",
                    type: "desktop",
                    label: "3. Türk Bayrak Kanunu & Tüzük Sayfası (Masaüstü)",
                    shortLabel: "3. Bayrak Kanunu (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/gebzebayrak-kanun-masaustu.png",
                    alt: "Gebze Bayrak Türk Bayrak Kanunu mevzuat ve bilgilendirme masaüstü sayfası",
                  },
                  {
                    id: "mobile-about",
                    type: "mobile",
                    label: "4. Kurumsal Hakkımızda & ENA İştiraki (Mobil)",
                    shortLabel: "4. Hakkımızda (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/gebzebayrak-hakkimizda-mobil.png",
                    alt: "Gebze Bayrak kurumsal hakkında ve ENA Reklam iştiraki mobil sayfası",
                  },
                  {
                    id: "desktop-about",
                    type: "desktop",
                    label: "5. Kurumsal Hakkımızda & Üretim Standartları (Masaüstü)",
                    shortLabel: "5. Hakkımızda (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/gebzebayrak-hakkimizda-masaustu.png",
                    alt: "Gebze Bayrak üretim tesisleri, kurumsal hakkında ve müşteri memnuniyeti masaüstü ekranı",
                  },
                ]
              : [
                  {
                    id: "desktop-hero",
                    type: "desktop",
                    label: "1. Ana Sayfa Karşılama (Masaüstü Hero)",
                    shortLabel: "1. Ana Sayfa",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kanat-musavirlik-masaustu.png",
                    alt: "Kanat Müşavirlik ana sayfa masaüstü hero karşılama ekranı",
                  },
                  {
                    id: "mobile-services",
                    type: "mobile",
                    label: "2. Hizmetlerimiz Sayfası (Mobil)",
                    shortLabel: "2. Hizmetler (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kanat-musavirlik-hizmetler-mobil.png",
                    alt: "Kanat Müşavirlik hukuki ve mali hizmetler mobil görünümü",
                  },
                  {
                    id: "desktop-services",
                    type: "desktop",
                    label: "3. Hukuki & Mali Hizmetler (Masaüstü Grid)",
                    shortLabel: "3. Hizmetler (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kanat-musavirlik-hizmetler-masaustu.png",
                    alt: "Kanat Müşavirlik hukuki ve mali hizmetler kataloğu masaüstü görünümü",
                  },
                  {
                    id: "mobile-about",
                    type: "mobile",
                    label: "4. Hakkımızda Sayfası (Mobil)",
                    shortLabel: "4. Hakkımızda (Mobil)",
                    badge: "Mobil Öncelikli / 390px",
                    icon: "📱",
                    url: "/gorseller/referanslar/kanat-musavirlik-hakkimizda-mobil.png",
                    alt: "Kanat Müşavirlik kurumsal hakkımızda mobil sayfası",
                  },
                  {
                    id: "desktop-about",
                    type: "desktop",
                    label: "5. Kurumsal & Şirket Kurucusu (Masaüstü)",
                    shortLabel: "5. Hakkımızda (PC)",
                    badge: "Geniş Ekran / 1440px",
                    icon: "💻",
                    url: "/gorseller/referanslar/kanat-musavirlik-hakkimizda-masaustu.png",
                    alt: "Kanat Müşavirlik hakkımızda ve şirket kurucusu masaüstü sayfası",
                  },
                ]
          }
          priority
        />
      </div>

      {/* Ölçülebilir sonuç yalnızca müşteriden onaylı veri varsa gösterilir */}
      {results.length > 0 && (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.label} className="rounded-lg border border-[#c9d6c4] bg-white p-6 shadow-[0_20px_52px_-46px_rgb(20_31_20/.7)]">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">{r.label}</dt>
              <dd className="mt-2 text-3xl font-bold tracking-tight text-[#17331b]">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_21rem] lg:gap-14">
        <div className="max-w-4xl space-y-10">
          <section className="rounded-2xl border border-[#dce5d9] bg-white p-7 sm:p-8 shadow-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d0e0cc] bg-[#f0f6ee] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1a5d39]">
              Projenin Başlangıç Noktası
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-ink-950">İhtiyaç & Problem</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-700">{project.problem}</p>
          </section>

          <section className="rounded-2xl border border-[#dce5d9] bg-white p-7 sm:p-8 shadow-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d0e0cc] bg-[#f0f6ee] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1a5d39]">
              Lizart Dijital Çözümü
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-ink-950">Uygulanan Strateji & Tasarım</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-700">{project.solution}</p>
          </section>

          {deliverables.length > 0 && (
            <section className="rounded-2xl border border-[#dce5d9] bg-white p-7 sm:p-8 shadow-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d0e0cc] bg-[#f0f6ee] px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1a5d39]">
                Teslim Kapsamı
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-ink-950">Teslim Edilen Bileşenler</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 rounded-xl border border-[#e2eae0] bg-[#f9fbf8] p-4 text-sm font-semibold text-ink-900 shadow-sm"
                  >
                    <span
                      aria-hidden
                      className="grid size-6 shrink-0 place-items-center rounded-full bg-[#1b5e39] text-xs font-bold text-white shadow-sm"
                    >
                      ✓
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.slug === "gebze-cimnastik-akademi-web-sitesi" ? (
            <section className="space-y-6 border-t border-ink-100 pt-8">
              <h2 className="text-xl font-semibold text-ink-900">Proje ekran görüntüleri</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {gallery.slice(1).map((url, index) => (
                  <figure key={url} className="overflow-hidden rounded-xl border border-ink-200 bg-surface">
                    <Image src={url} alt={project.client + " — " + ["Ana sayfa", "Hakkımızda", "Salonumuz"][index]} width={1172} height={2180} sizes="(max-width: 640px) 90vw, 240px" className="h-auto w-full" />
                    <figcaption className="p-3 text-sm text-ink-600">{["Ana sayfa", "Hakkımızda", "Salonumuz"][index]}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ) : isRealReferenceSiteProject ? (
            <section className="overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-xs">
              <div className="border-b border-ink-200/80 bg-[#223d26] px-6 py-7 text-white sm:px-8 lg:px-9">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#b6d8b4]">
                      <MonitorSmartphone size={14} aria-hidden />
                      Proje Görsel Vitrini
                    </span>
                    <h2 className="mt-4 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      {project.client} için hazırlanan ekran deneyimi
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#d7e9d6]">
                      Ana sayfa, ürün akışı, içerik ve iletişim sayfaları tek bir vaka sunumu içinde; masaüstü ve mobil kullanım dengesi korunarak sergilenir.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 text-center">
                    {[
                      { label: "Masaüstü", value: realReferenceShowcaseImages.filter((image) => image.type === "desktop").length },
                      { label: "Mobil", value: realReferenceShowcaseImages.filter((image) => image.type === "mobile").length },
                      { label: "Sayfa", value: realReferenceShowcaseImages.length },
                    ].map((item) => (
                      <div key={item.label} className="min-w-18 rounded-xl bg-white px-3 py-2 text-slate-900">
                        <p className="text-lg font-bold">{item.value}</p>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#f8faf7] p-4 sm:p-6 lg:p-8">
                {featuredReferenceImage && (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
                    <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-center">
                      <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                        <div className="flex h-10 items-center justify-between gap-3 border-b border-slate-100 bg-[#f9faf9] px-4">
                          <div className="flex items-center gap-1.5" aria-hidden>
                            <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                            <span className="size-2.5 rounded-full bg-[#27c93f]" />
                          </div>
                          <span className="truncate text-xs font-bold text-slate-600">{host ?? project.client}</span>
                          <span className="hidden rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[0.65rem] font-bold text-slate-600 sm:inline">1440px</span>
                        </div>
                        <div className="relative aspect-[16/9] overflow-hidden bg-slate-50">
                          <Image
                            src={featuredReferenceImage.url}
                            alt={featuredReferenceImage.alt}
                            fill
                            unoptimized
                            sizes="(max-width: 1024px) 100vw, 760px"
                            className="object-cover object-top"
                          />
                        </div>
                        <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-[#f9faf9] px-5 py-3.5">
                          <span className="text-sm font-bold text-slate-900">{featuredReferenceImage.label}</span>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
                            >
                              Canlı site
                              <ExternalLink size={14} aria-hidden />
                            </a>
                          )}
                        </figcaption>
                      </figure>

                      {mobileReferenceImage && (
                        <figure className="mx-auto w-full max-w-[13.5rem]">
                          <div className="rounded-[2rem] border-[8px] border-slate-900 bg-slate-900 p-1 shadow-xl">
                            <div className="mx-auto mb-1 h-1 w-12 rounded-full bg-white/20" />
                            <div className="relative aspect-[9/17] overflow-hidden rounded-[1.25rem] bg-black">
                              <Image
                                src={mobileReferenceImage.url}
                                alt={mobileReferenceImage.alt}
                                fill
                                unoptimized
                                sizes="220px"
                                className="object-cover object-top"
                              />
                            </div>
                          </div>
                          <figcaption className="mt-3 flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold leading-5 text-slate-800 shadow-2xs">
                            <Smartphone size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
                            {mobileReferenceImage.label}
                          </figcaption>
                        </figure>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {secondaryReferenceImages.map((image) => (
                    <figure
                      key={image.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-soft hover:-translate-y-0.5 hover:border-slate-300"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, 380px"
                          className={image.type === "mobile" ? "object-contain object-top p-3" : "object-cover object-top transition duration-500 group-hover:scale-[1.02]"}
                        />
                      </div>
                      <figcaption className="flex min-h-14 items-center gap-3 border-t border-slate-100 bg-[#f9faf9] px-4 py-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-white shadow-xs">
                          {image.type === "mobile" ? <Smartphone size={15} aria-hidden /> : <Globe2 size={15} aria-hidden />}
                        </span>
                        <span className="text-sm font-bold leading-5 text-slate-800">{image.label}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          ) : (<>
          {/* 5 Görselin Tümünü Sergileyen Detaylı Bölüm */}
          <section className="space-y-8 pt-4 border-t border-ink-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Mobil ve Masaüstü Cihaz Deneyimi
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">
                Yayındaki Sayfalar ve Ekran Görüntüleri
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {project.client} web sitesinin yayında olan tüm sayfaları, hem mobil hem de masaüstü cihazlar için özel olarak optimize edilmiştir.
              </p>
            </div>

            {/* 1. İki Mobil Ekran Yan Yana */}
            <div className="rounded-3xl border border-ink-100 bg-surface-2/60 p-6 sm:p-8">
              <h3 className="text-base font-bold text-ink-900 flex items-center gap-2">
                <span>📱</span>
                <span>
                  {project.slug === "ada-motor-istanbul-eticaret-sitesi"
                    ? "Mobil Mağaza Deneyimi (Ürünler & Aksesuarlar)"
                    : project.slug === "ans-sigorta-aracilik-web-sitesi"
                    ? "Mobil Sigorta & Teklif Deneyimi (Poliçeler & Neden Biz)"
                    : project.slug === "curecare-ilac-saglik-web-sitesi"
                    ? "Mobil Sağlık & Ürün Kataloğu (İlaçlar & Misyonumuz)"
                    : project.slug === "ena-tabela-reklam-web-sitesi"
                    ? "Mobil Reklam Vitrini (Baskı, Kutu Harf & İletişim)"
                    : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                    ? "Mobil Diş Polikliniği (Tedaviler & Blog Rehberi)"
                    : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                    ? "Mobil Hukuk & Danışmanlık (Çözümler & Hizmetlerimiz)"
                    : project.slug === "gebze-bayrak-web-sitesi"
                    ? "Mobil Bayrak Vitrini (Ürünler & Hakkımızda)"
                    : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                    ? "Mobil Dental Klinik Deneyimi (Tedaviler & Randevu)"
                    : "Mobil Kullanıcı Deneyimi (Hizmetler & Hakkımızda)"}
                </span>
              </h3>
              <p className="mt-1 text-xs text-ink-500">
                Tek tıkla arama, dinamik menü ve net tipografi ile telefon ekranında akıcı gezinme.
              </p>

              <div
                className={
                  project.slug === "ena-tabela-reklam-web-sitesi" ||
                  project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                    ? "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center"
                    : "mt-6 grid gap-6 sm:grid-cols-2 place-items-center"
                }
              >
                {/* Mobil Ekran 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-56 sm:w-60 overflow-hidden rounded-[2.2rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-white/20">
                    <div className="relative aspect-[550/1024] w-full overflow-hidden rounded-[1.6rem] bg-slate-950">
                      <Image
                        src={
                          project.slug === "ada-motor-istanbul-eticaret-sitesi"
                            ? "/gorseller/referanslar/adamotor-mobil.png"
                            : project.slug === "ans-sigorta-aracilik-web-sitesi"
                            ? "/gorseller/referanslar/ans-sigorta-mobil.png"
                            : project.slug === "curecare-ilac-saglik-web-sitesi"
                            ? "/gorseller/referanslar/curecare-mobil.png"
                            : project.slug === "ena-tabela-reklam-web-sitesi"
                            ? "/gorseller/referanslar/ena-reklam-mobil.png"
                            : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                            ? "/gorseller/referanslar/everydent-mobil.png"
                            : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                            ? "/gorseller/referanslar/fmshukuk-mobil.png"
                            : project.slug === "gebze-bayrak-web-sitesi"
                            ? "/gorseller/referanslar/gebzebayrak-mobil.png"
                            : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                            ? "/gorseller/referanslar/zenitdent-hero-mobil.png"
                            : "/gorseller/referanslar/kanat-musavirlik-hizmetler-mobil.png"
                        }
                        alt={`${project.client} Mobil Görünüm 1`}
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-ink-700 text-center">
                    {project.slug === "ada-motor-istanbul-eticaret-sitesi"
                      ? "Ana Sayfa & Ürünler (Mobil)"
                      : project.slug === "ans-sigorta-aracilik-web-sitesi"
                      ? "Trafik & Kasko Sigortası (Mobil)"
                      : project.slug === "curecare-ilac-saglik-web-sitesi"
                      ? "İlaç & Ürün Kataloğu (Mobil)"
                      : project.slug === "ena-tabela-reklam-web-sitesi"
                      ? "Baskı & Cephe Giydirme (Mobil)"
                      : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                      ? "Klinik & Tedavilerimiz (Mobil)"
                      : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                      ? "Hukuksal Çözümler (Mobil)"
                      : project.slug === "gebze-bayrak-web-sitesi"
                      ? "Büyük Boy Atatürk Posteri (Mobil)"
                      : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                      ? "Klinik Karşılama & Hızlı Randevu (Mobil)"
                      : "Hizmetlerimiz (Mobil)"}
                  </span>
                </div>

                {/* Mobil Ekran 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-56 sm:w-60 overflow-hidden rounded-[2.2rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-white/20">
                    <div className="relative aspect-[550/1024] w-full overflow-hidden rounded-[1.6rem] bg-slate-950">
                      <Image
                        src={
                          project.slug === "ada-motor-istanbul-eticaret-sitesi"
                            ? "/gorseller/referanslar/adamotor-aksesuar-mobil.png"
                            : project.slug === "ans-sigorta-aracilik-web-sitesi"
                            ? "/gorseller/referanslar/ans-sigorta-avantajlar-mobil.png"
                            : project.slug === "curecare-ilac-saglik-web-sitesi"
                            ? "/gorseller/referanslar/curecare-hakkimizda-mobil.png"
                            : project.slug === "ena-tabela-reklam-web-sitesi"
                            ? "/gorseller/referanslar/ena-reklam-isler-mobil.png"
                            : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                            ? "/gorseller/referanslar/everydent-tedaviler-mobil.png"
                            : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                            ? "/gorseller/referanslar/fmshukuk-hizmetler-mobil.png"
                            : project.slug === "gebze-bayrak-web-sitesi"
                            ? "/gorseller/referanslar/gebzebayrak-hakkimizda-mobil.png"
                            : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                            ? "/gorseller/referanslar/zenitdent-randevu-mobil.png"
                            : "/gorseller/referanslar/kanat-musavirlik-hakkimizda-mobil.png"
                        }
                        alt={`${project.client} Mobil Görünüm 2`}
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-ink-700 text-center">
                    {project.slug === "ada-motor-istanbul-eticaret-sitesi"
                      ? "Aksesuarlar & Kasklar (Mobil)"
                      : project.slug === "ans-sigorta-aracilik-web-sitesi"
                      ? "Neden Bizi Seçmelisiniz? (Mobil)"
                      : project.slug === "curecare-ilac-saglik-web-sitesi"
                      ? "Kurumsal & Misyonumuz (Mobil)"
                      : project.slug === "ena-tabela-reklam-web-sitesi"
                      ? "Kutu Harf & Araç Giydirme (Mobil)"
                      : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                      ? "Pediatrik Diş & Gülüş Tasarımı (Mobil)"
                      : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                      ? "Kurumsal Hukuk & Müşavirlik (Mobil)"
                      : project.slug === "gebze-bayrak-web-sitesi"
                      ? "Hakkımızda & ENA İştiraki (Mobil)"
                      : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                      ? "Online Randevu & Şube Akışı (Mobil)"
                      : "Hakkımızda (Mobil)"}
                  </span>
                </div>

                {/* Mobil Ekran 3 (Ena Reklam ve EveryDent için 3. Mobil Ekran) */}
                {(project.slug === "ena-tabela-reklam-web-sitesi" ||
                  project.slug === "everydent-agiz-dis-sagligi-web-sitesi") && (
                  <div className="flex flex-col items-center">
                    <div className="w-56 sm:w-60 overflow-hidden rounded-[2.2rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl ring-1 ring-white/20">
                      <div className="relative aspect-[550/1024] w-full overflow-hidden rounded-[1.6rem] bg-slate-950">
                        <Image
                          src={
                            project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                              ? "/gorseller/referanslar/everydent-blog-mobil.png"
                              : "/gorseller/referanslar/ena-reklam-iletisim-mobil.png"
                          }
                          alt={`${project.client} Mobil Görünüm 3`}
                          fill
                          unoptimized
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-ink-700 text-center">
                      {project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                        ? "Diş Sağlığı Rehberi & Bloglar (Mobil)"
                        : "İletişim & Kurumsal Footer (Mobil)"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Masaüstü Ekran 1 */}
            <div className="overflow-hidden rounded-2xl border border-ink-200 bg-surface shadow-md">
              <div className="flex h-10 items-center justify-between gap-3 border-b border-ink-100 bg-surface px-4 text-xs font-semibold text-ink-700">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span>
                  {project.slug === "ada-motor-istanbul-eticaret-sitesi"
                    ? "Motosiklet Modelleri Kataloğu (Masaüstü Grid)"
                    : project.slug === "ans-sigorta-aracilik-web-sitesi"
                    ? "Hizmetlerimiz & Poliçeler Kataloğu (Masaüstü Grid)"
                    : project.slug === "curecare-ilac-saglik-web-sitesi"
                    ? "İlaç & Ürün Kataloğu Filtreleme (Masaüstü Grid)"
                    : project.slug === "ena-tabela-reklam-web-sitesi"
                    ? "Özel Ürün Üretim & Referans Logoları (Masaüstü Hero)"
                    : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                    ? "Poliklinik Tanıtımı & Online Randevu (Masaüstü Hero)"
                    : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                    ? "Hukuki Hizmetler & Müşavirlik Kataloğu (Masaüstü Grid)"
                    : project.slug === "gebze-bayrak-web-sitesi"
                    ? "Türk Bayrak Kanunu & Tüzük Sayfası (Masaüstü)"
                    : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                    ? "Tedavi Kataloğu & Klinik Vitrini (Masaüstü)"
                    : "Hukuki ve Mali Hizmetler Kataloğu (Masaüstü Grid)"}
                </span>
                <span className="text-brand-600 font-bold">1440px</span>
              </div>
              <div className="relative aspect-[1024/538] w-full overflow-hidden bg-ink-50">
                <Image
                  src={
                    project.slug === "ada-motor-istanbul-eticaret-sitesi"
                      ? "/gorseller/referanslar/adamotor-motosiklet-masaustu.png"
                      : project.slug === "ans-sigorta-aracilik-web-sitesi"
                      ? "/gorseller/referanslar/ans-sigorta-hizmetler-masaustu.png"
                      : project.slug === "curecare-ilac-saglik-web-sitesi"
                      ? "/gorseller/referanslar/curecare-urunler-masaustu.png"
                      : project.slug === "ena-tabela-reklam-web-sitesi"
                      ? "/gorseller/referanslar/ena-reklam-masaustu.png"
                      : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                      ? "/gorseller/referanslar/everydent-masaustu.png"
                      : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                      ? "/gorseller/referanslar/fmshukuk-hizmetler-masaustu.png"
                      : project.slug === "gebze-bayrak-web-sitesi"
                      ? "/gorseller/referanslar/gebzebayrak-kanun-masaustu.png"
                      : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                      ? "/gorseller/referanslar/zenitdent-tedaviler-pc.png"
                      : "/gorseller/referanslar/kanat-musavirlik-hizmetler-masaustu.png"
                  }
                  alt={`${project.client} Masaüstü Sayfa 1`}
                  fill
                  unoptimized
                  className="object-contain sm:object-cover object-top"
                />
              </div>
            </div>

            {/* 3. Masaüstü Ekran 2 */}
            <div className="overflow-hidden rounded-2xl border border-ink-200 bg-surface shadow-md">
              <div className="flex h-10 items-center justify-between gap-3 border-b border-ink-100 bg-surface px-4 text-xs font-semibold text-ink-700">
                <div className="flex items-center gap-1.5" aria-hidden>
                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                </div>
                <span>
                  {project.slug === "ada-motor-istanbul-eticaret-sitesi"
                    ? "Kask ve Güvenlik Ekipmanları Kataloğu (Masaüstü Grid)"
                    : project.slug === "ans-sigorta-aracilik-web-sitesi"
                    ? "Sağlık Sigortası & Bilgi Bankası (Masaüstü)"
                    : project.slug === "curecare-ilac-saglik-web-sitesi"
                    ? "İletişim Formu & İş Ortakları (Masaüstü)"
                    : project.slug === "ena-tabela-reklam-web-sitesi"
                    ? "Baskı Hizmetleri & Sektörel Blog (Masaüstü)"
                    : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                    ? "Ağız & Diş Sağlığı Blog Kataloğu (Masaüstü Grid)"
                    : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                    ? "Kurumsal Hakkımızda & Av. Furkan Alyakut (Masaüstü)"
                    : project.slug === "gebze-bayrak-web-sitesi"
                    ? "Kurumsal Hakkımızda & Üretim Tesisleri (Masaüstü)"
                    : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                    ? "Kurumsal Klinik Tanıtımı & Güven Alanları (Masaüstü)"
                    : "Kurumsal Hakkımızda & Şirket Kurucusu Bölümü (Masaüstü)"}
                </span>
                <span className="text-brand-600 font-bold">1440px</span>
              </div>
              <div className="relative aspect-[1024/538] w-full overflow-hidden bg-ink-50">
                <Image
                  src={
                    project.slug === "ada-motor-istanbul-eticaret-sitesi"
                      ? "/gorseller/referanslar/adamotor-aksesuar-masaustu.png"
                      : project.slug === "ans-sigorta-aracilik-web-sitesi"
                      ? "/gorseller/referanslar/ans-sigorta-blog-masaustu.png"
                      : project.slug === "curecare-ilac-saglik-web-sitesi"
                      ? "/gorseller/referanslar/curecare-iletisim-masaustu.png"
                      : project.slug === "ena-tabela-reklam-web-sitesi"
                      ? "/gorseller/referanslar/ena-reklam-hizmetler-masaustu.png"
                      : project.slug === "everydent-agiz-dis-sagligi-web-sitesi"
                      ? "/gorseller/referanslar/everydent-blog-masaustu.png"
                      : project.slug === "fms-hukuk-danismanlik-web-sitesi"
                      ? "/gorseller/referanslar/fmshukuk-hakkimizda-masaustu.png"
                      : project.slug === "gebze-bayrak-web-sitesi"
                      ? "/gorseller/referanslar/gebzebayrak-hakkimizda-masaustu.png"
                      : project.slug === "zenit-dental-agiz-ve-dis-sagligi-web-sitesi"
                      ? "/gorseller/referanslar/zenitdent-hero-pc.png"
                      : "/gorseller/referanslar/kanat-musavirlik-hakkimizda-masaustu.png"
                  }
                  alt={`${project.client} Masaüstü Sayfa 2`}
                  fill
                  unoptimized
                  className="object-contain sm:object-cover object-top"
                />
              </div>
            </div>
          </section>

          </>)}

          {project.testimonial && (
            <figure className="rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-8">
              <blockquote className="text-lg leading-relaxed text-ink-800">
                “{project.testimonial}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-ink-600">{project.client}</figcaption>
            </figure>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-xs">
            <div className="relative overflow-hidden bg-[#223d26] px-6 py-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b6d8b4]">Proje Özeti</p>
                  <p className="mt-2 text-xl font-bold leading-tight text-white">{project.client}</p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/10 text-[#b6d8b4]">
                  <Layers3 size={20} aria-hidden />
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold">
                <span className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[#e4f1e2]">
                  <span className="size-1.5 rounded-full bg-[#82cf7f]" />
                  Canlı yayın
                </span>
                <span className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-[#e4f1e2]">
                  <span className="size-1.5 rounded-full bg-[#82cf7f]" />
                  Responsive
                </span>
              </div>
            </div>
            <div className="p-6">
              <dl className="divide-y divide-ink-100 text-sm">
                {[
                  { label: "Müşteri", value: project.client },
                  { label: "Sektör", value: project.sector },
                  { label: "Yayına alma", value: formatDate(project.completedAt) },
                ].map((item) => (
                  <div key={item.label} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3 first:pt-0">
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-600">{item.label}</dt>
                    <dd className="font-bold leading-5 text-ink-950">{item.value}</dd>
                  </div>
                ))}
                {project.liveUrl && (
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink-600">Adres</dt>
                    <dd>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#cbe1ca] bg-[#f0f7ef] px-2.5 py-1.5 font-bold text-[#1f4e27] hover:bg-[#e2f0e0]"
                      >
                        <span className="truncate">{project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                        <ExternalLink size={14} className="shrink-0" aria-hidden />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {services.length > 0 && (
                <div className="mt-5 rounded-xl border border-ink-100 bg-[#f8faf6] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-600">Verilen hizmetler</p>
                  <ul className="mt-3 space-y-2">
                    {services.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm font-semibold leading-5 text-ink-900">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2f6637]" aria-hidden />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {technologies.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-600">Teknolojiler</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {technologies.map((t) => (
                      <Badge key={t} tone="outline" className="border-ink-200 bg-white font-semibold text-ink-800">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden rounded-2xl border border-[#1d3521] bg-[#223d26] text-white shadow-md">
            <div className="border-b border-white/10 bg-[#1b321f] px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b6d8b4]">Sıradaki proje sizin olsun</p>
              <p className="mt-2 text-xl font-bold leading-snug">Benzer bir iş mi planlıyorsunuz?</p>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-[#d7e9d6]">
                Aynı titizlik ve modern yaklaşımla sizin projenizi de hayata geçirelim. İster sıfırdan özel tasarım, ister hazır altyapı ile hemen başlayın.
              </p>
              <ButtonLink href="/teklif" className="mt-5 w-full rounded-xl bg-[#396b40] font-bold text-white shadow-xs hover:bg-[#467f4f]" size="md">
                Teklif alın
              </ButtonLink>
              <a
                href="https://wa.me/902623010134"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#1a311e] py-2.5 text-sm font-bold text-[#bfe0bd] hover:bg-[#152718]"
              >
                <span>💬 WhatsApp: 0 262 301 01 34</span>
              </a>
              <ButtonLink href="/magaza" variant="outline" className="mt-2 w-full rounded-xl border-white/20 bg-white/5 font-bold text-white hover:bg-white/10" size="sm">
                Hazır paketleri inceleyin
              </ButtonLink>
            </div>
          </Card>
        </aside>
      </div>

      {/* Bu işe benzer hazır ürünler */}
      {products.length > 0 && (
        <section className="mt-16">
          <SectionHeading
            eyebrow="Hızlı başlangıç"
            title="Benzer bir siteyi hazır üründen başlatın"
            description="Bu projedeki yapının benzerini hazır ürünlerimizde bulabilir, canlı demosunu inceleyip günler içinde yayına girebilirsiniz."
            action={
              <ButtonLink href="/magaza" variant="outline" size="sm">
                Tüm ürünler
              </ButtonLink>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Benzer projeler */}
      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeading title="Aynı alandaki diğer işlerimiz" />
          <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {related.map((p) => (
              <ReferenceCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </div>
    </div>
  );
}
