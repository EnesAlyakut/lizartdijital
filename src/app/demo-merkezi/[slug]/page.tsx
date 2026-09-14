import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { DemoViewer } from "@/components/demo/DemoViewer";
import { Badge, Breadcrumb, ButtonLink, Card } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { SERVICES } from "@/lib/data/services";

export const revalidate = 600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublished: true, demoUrl: { not: null } },
    select: { slug: true },
  });
  const productSlugs = products.map((p) => ({ slug: p.slug }));
  const serviceSlugs = SERVICES.map((s) => ({ slug: s.slug }));
  return [...productSlugs, ...serviceSlugs];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, shortDesc: true } });
  if (product) {
    return {
      title: `${product.name} canlı demo`,
      description: `${product.name} ürününü satın almadan önce deneyin. ${product.shortDesc}`,
      alternates: { canonical: `${SITE.url}/demo-merkezi/${slug}` },
    };
  }

  const service = SERVICES.find((s) => s.slug === slug);
  if (service) {
    return {
      title: `${service.title} canlı demo & hizmet paketi`,
      description: `${service.summary}`,
      alternates: { canonical: `${SITE.url}/demo-merkezi/${slug}` },
    };
  }

  return {};
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  let productSlugToQuery = slug;

  if (service && service.relatedProducts.length > 0) {
    productSlugToQuery = service.relatedProducts[0];
  }

  let product = await prisma.product.findFirst({
    where: { slug: productSlugToQuery, isPublished: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      platforms: { include: { platform: true } },
      licenses: { where: { key: "standart" }, select: { id: true } },
    },
  });

  if (!product && service) {
    for (const rel of service.relatedProducts) {
      product = await prisma.product.findFirst({
        where: { slug: rel, isPublished: true },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          platforms: { include: { platform: true } },
          licenses: { where: { key: "standart" }, select: { id: true } },
        },
      });
      if (product && product.demoUrl) break;
    }
  }

  if (!product || !product.demoUrl) notFound();

  // Demo açılış sayacı — raporlarda "en çok demo açılan" listesini besler.
  after(async () => {
    await prisma.product.update({
      where: { id: product.id },
      data: { demoCount: { increment: 1 } },
    });
  });

  const isMobileApp = product.platforms.some((p) => ["android", "ios"].includes(p.platform.slug));

  // Mobil uygulama demoları için QR kod sunucuda üretilir (dış servise bağımlılık yok).
  const qrDataUrl = isMobileApp
    ? await QRCode.toDataURL(product.demoUrl, { margin: 1, width: 240, color: { dark: "#12171a", light: "#ffffff" } })
    : null;

  const displayName = service ? `${service.title} — Canlı Çözüm Demosu` : `${product.name} — canlı demo`;
  const displayDesc = service ? service.summary : product.shortDesc;
  const displayCategory = service ? "Hizmet Paketi Demosu" : product.category.name;

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Demo Merkezi", href: "/demo-merkezi" },
          ...(service ? [{ label: "Hizmetler", href: "/hizmetler" }] : []),
          { label: service ? service.title : product.name },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <Badge tone="brand">{displayCategory}</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {displayName}
          </h1>
          <p className="mt-3 leading-relaxed text-ink-500">{displayDesc}</p>
        </div>
        <div className="flex flex-col gap-2">
          {service?.packages[0]?.price ? (
            <p className="text-2xl font-bold text-ink-900">
              {service.packages[0].price}
            </p>
          ) : (
            <p className="text-2xl font-semibold text-ink-900">
              {formatPrice(product.basePrice)} <span className="text-sm font-normal text-ink-400">+ KDV</span>
            </p>
          )}
          {service ? (
            <ButtonLink href={`/hizmetler/${service.slug}`} size="lg">
              Hizmet Paketini İncele
            </ButtonLink>
          ) : (
            <ButtonLink href={`/urun/${product.slug}`} size="lg">
              Ürün sayfasına git
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-10">
        <DemoViewer
          demoUrl={product.demoUrl}
          adminDemoUrl={product.adminDemoUrl}
          images={product.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, viewport: i.viewport }))}
          coverImage={product.coverImage}
          name={service ? service.title : product.name}
        />

        <aside className="space-y-5">
          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">Demo bilgileri</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-ink-400">Demo adresi</dt>
                <dd className="mt-0.5 break-all font-medium text-ink-800">{product.demoUrl}</dd>
              </div>
              {product.adminDemoUrl && (
                <div id="panel" className="scroll-mt-28">
                  <dt className="text-ink-400">Yönetim paneli</dt>
                  <dd className="mt-0.5 break-all font-medium text-ink-800">{product.adminDemoUrl}</dd>
                </div>
              )}
              {product.demoUser && (
                <div>
                  <dt className="text-ink-400">Geçici demo hesabı</dt>
                  <dd className="mt-1 space-y-1">
                    <p className="rounded-lg bg-ink-50 px-3 py-1.5 font-mono text-xs">{product.demoUser}</p>
                    <p className="rounded-lg bg-ink-50 px-3 py-1.5 font-mono text-xs">{product.demoPassword}</p>
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-xs leading-relaxed text-ink-500">
              Demo verileri örnektir ve gerçek müşteri bilgisi içermez. Ortam düzenli aralıklarla sıfırlanır;
              demo üzerinde yaptığınız değişiklikler kalıcı değildir.
            </p>
          </Card>

          {qrDataUrl && (
            <Card className="p-6 text-center">
              <h2 className="font-semibold text-ink-900">Mobilde deneyin</h2>
              <p className="mt-2 text-sm text-ink-500">
                Kamerayla okutarak demo uygulamayı telefonunuzda açın.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={`${product.name} demo bağlantısı için QR kod`}
                width={200}
                height={200}
                className="mx-auto mt-4 rounded-xl border border-ink-100"
              />
            </Card>
          )}

          <Card className="p-6">
            <h2 className="font-semibold text-ink-900">
              {service ? "Hizmeti başlatmak ister misiniz?" : "Demoyu beğendiniz mi?"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              {service
                ? "İhtiyacınıza en uygun paketi seçerek aynı hafta içinde projenizi anahtar teslim yayına alabilirsiniz."
                : "Lisans ve ek hizmetleri seçerek hemen satın alabilir veya sorularınız için bize yazabilirsiniz."}
            </p>
            {service ? (
              <>
                <ButtonLink href={`/teklif?hizmet=${service.slug}`} className="mt-4 w-full" size="sm">
                  Ücretsiz Teklif Alın
                </ButtonLink>
                <ButtonLink href={`/hizmetler/${service.slug}`} variant="outline" className="mt-2 w-full" size="sm">
                  Tüm Paket Detayları
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href={`/urun/${product.slug}#satin-alma`} className="mt-4 w-full" size="sm">
                  Satın alma seçenekleri
                </ButtonLink>
                <ButtonLink href="/teklif" variant="outline" className="mt-2 w-full" size="sm">
                  Ücretsiz danışmanlık
                </ButtonLink>
              </>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
