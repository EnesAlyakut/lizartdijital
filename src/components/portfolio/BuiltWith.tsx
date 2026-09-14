import { prisma } from "@/lib/db";
import { ReferenceCard, type ReferenceCardData } from "@/components/portfolio/ReferenceCard";
import { ButtonLink, SectionHeading } from "@/components/ui";

/** Ürün türüne göre hangi referans alanının gösterileceğini belirler. */
const CATEGORY_BY_PRODUCT_CATEGORY: Record<string, string> = {
  "klinik-saglik-siteleri": "saglik",
  "kurumsal-web-siteleri": "web",
  "ajans-siteleri": "web",
  "portfoy-siteleri": "web",
  "randevu-sistemleri": "saglik",
  "eticaret-siteleri": "eticaret",
};

/**
 * Ürün sayfasında gösterilen referans bölümü.
 *
 * Amaç: müşteri hazır bir ürünü satın almadan önce, aynı yaklaşımla
 * gerçekten yayına aldığımız siteleri görebilsin. Ekran görüntüleri
 * müşterilerin canlı sitelerinden alınmıştır.
 */
export async function BuiltWith({
  productCategorySlug,
  productType,
}: {
  productCategorySlug: string;
  productType: string;
}) {
  // Ürün kategorisine en yakın referans alanı; eşleşme yoksa tüm öne çıkanlar.
  const category = CATEGORY_BY_PRODUCT_CATEGORY[productCategorySlug];

  let projects: ReferenceCardData[] = await prisma.portfolioProject.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
    take: 3,
    select: {
      id: true, slug: true, title: true, client: true, sector: true,
      summary: true, coverImage: true, mobileImage: true, liveUrl: true,
    },
  });

  // Alanda referans yoksa öne çıkan işlerle doldur; bölüm boş kalmasın.
  if (projects.length === 0) {
    projects = await prisma.portfolioProject.findMany({
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
      take: 3,
      select: {
        id: true, slug: true, title: true, client: true, sector: true,
        summary: true, coverImage: true, mobileImage: true, liveUrl: true,
      },
    });
  }

  if (projects.length === 0) return null;

  const isService = productType === "service";

  return (
    <section className="mt-14">
      <SectionHeading
        eyebrow="Gerçek işler"
        title={isService ? "Bu hizmeti verdiğimiz projeler" : "Benzer kurgulardaki yayındaki sitelerimiz"}
        description="Satın almadan önce, aynı yaklaşımla yayına aldığımız siteleri inceleyin. Görseller müşterilerimizin canlı sitelerinden alınmıştır."
        action={
          <ButtonLink href="/projeler" variant="outline" size="sm">
            Tüm projeler
          </ButtonLink>
        }
      />
      <div className="mt-8 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <ReferenceCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
