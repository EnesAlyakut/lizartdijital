import type { Metadata } from "next";
import { ShopView, type SearchParams } from "@/components/shop/ShopView";
import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { StoreReferences } from "@/components/home/sections";

export const metadata: Metadata = {
  title: "Mağaza — Hazır web siteleri, uygulamalar ve hizmetler",
  description:
    "Hazır web siteleri, mobil ve web uygulamaları, hazır sistemler ve dijital hizmet paketleri. Filtreleyin, canlı demoyu açın, sepete ekleyin.",
  alternates: { canonical: `${SITE.url}/magaza` },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  // Satın alma kararı öncesi kanıt: aynı ekibin yayındaki gerçek siteleri.
  const references = await prisma.portfolioProject.findMany({
    orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
    take: 3,
    select: {
      id: true, slug: true, title: true, client: true, sector: true,
      summary: true, coverImage: true, mobileImage: true, liveUrl: true,
    },
  });

  return (
    <>
    <ShopView
      searchParams={sp}
      title="Dijital ürün mağazası"
      description="Hazır web siteleri, mobil ve web uygulamaları, hazır sistemler, tema ve şablonlar ile dijital hizmet paketleri. Hepsinin canlı demosunu açabilir, karşılaştırabilir ve doğrudan satın alabilirsiniz."
      breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Mağaza" }]}
    />
    <StoreReferences projects={references} />
    </>
  );
}
