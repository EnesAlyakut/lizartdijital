import { prisma } from "@/lib/db";
import { getHomeCollections } from "@/lib/data/products";
import { Hero, ServiceStrip } from "@/components/home/Hero";
import { AgencyIntro, Capabilities } from "@/components/home/AgencyIntro";
import {
  BlogTeaser,
  ContactCta,
  DemoCenterTeaser,
  FaqSection,
  PortfolioTeaser,
  ProcessSection,
  ProductRow,
  Testimonials,
} from "@/components/home/sections";

// Ana sayfa içeriği veritabanından gelir; ISR ile önbelleklenir.
export const revalidate = 300;

/**
 * Ana sayfa akışı:
 *  1) Ajans tanıtımı — kimiz, ne yapıyoruz, hangi işleri çıkardık
 *  2) Ürün satışı — hazır web siteleri, uygulamalar, hizmet paketleri
 *  3) Güven ve dönüşüm — süreç, yorumlar, SSS, iletişim
 */
export default async function HomePage() {
  const [
    collections,
    settings,
    reviews,
    portfolio,
    posts,
    faqs,
    productCount,
    projectCount,
  ] = await Promise.all([
    getHomeCollections(),
    getSettings(),
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true, authorName: true, authorTitle: true, body: true, rating: true,
        product: { select: { name: true, slug: true } },
      },
    }),
    prisma.portfolioProject.findMany({
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
      take: 8,
      select: {
        id: true, slug: true, title: true, client: true, sector: true,
        summary: true, coverImage: true, mobileImage: true, liveUrl: true,
      },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true, slug: true, title: true, excerpt: true, coverImage: true,
        publishedAt: true, readMinutes: true, category: { select: { name: true } },
      },
    }),
    prisma.faq.findMany({ where: { productId: null }, orderBy: { sortOrder: "asc" }, take: 6 }),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.portfolioProject.count(),
  ]);

  const showcase = [...collections.featured, ...collections.apps].slice(0, 3);

  // Ana sayfa tanıtım görselleri seed sırasında üretilir (prisma/seed-brand-images.ts).
  const brandImages = {
    studio: "/gorseller/ajans/studyo.svg",
    process: "/gorseller/ajans/surec.svg",
    results: "/gorseller/ajans/sonuclar.svg",
  };
  const capabilityImages = {
    web: "/gorseller/ajans/hizmet-web.svg",
    commerce: "/gorseller/ajans/hizmet-eticaret.svg",
    mobile: "/gorseller/ajans/hizmet-mobil.svg",
    software: "/gorseller/ajans/hizmet-yazilim.svg",
    growth: "/gorseller/ajans/hizmet-buyume.svg",
    brand: "/gorseller/ajans/hizmet-marka.svg",
  };

  return (
    <>
      <Hero showcase={showcase} productCount={productCount} />

      <ServiceStrip />

      <AgencyIntro
        images={brandImages}
        stats={settings}
        productCount={productCount}
        projectCount={projectCount}
      />

      <Capabilities images={capabilityImages} />

      <PortfolioTeaser projects={portfolio} totalCount={projectCount} />

      <ProductRow
        eyebrow="Seçili çözümler"
        title="Yayına hızlı başlamak isteyenler için"
        description="Ana sayfayı sade tutmak için yalnızca en çok tercih edilen çözümleri gösteriyoruz. Daha fazlası mağazada."
        href="/magaza/hazir-web-siteleri"
        products={collections.featured}
      />

      <DemoCenterTeaser sample={[...collections.featured, ...collections.apps]} />

      <ProcessSection />

      <Testimonials reviews={reviews} />

      <FaqSection faqs={faqs} />

      <BlogTeaser posts={posts} />

      <ContactCta />
    </>
  );
}

async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany({ where: { key: { startsWith: "stats." } } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
