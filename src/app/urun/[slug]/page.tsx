import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import {
  getProductBySlug,
  getRelatedProducts,
  parseJsonArray,
  parseJsonObject,
} from "@/lib/data/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductCard } from "@/components/product/ProductCard";
import { BuiltWith } from "@/components/portfolio/BuiltWith";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, Breadcrumb, ButtonLink, Card, Rating, SectionHeading } from "@/components/ui";
import { PRODUCT_TYPE_LABELS, SITE } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import { getAllAddOnMedia } from "@/lib/data/addon-media";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isPublished: true },
    select: { name: true, metaTitle: true, metaDescription: true, shortDesc: true, coverImage: true },
  });
  if (!product) return {};
  const title = product.metaTitle ?? product.name;
  const description = product.metaDescription ?? product.shortDesc;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/urun/${slug}` },
    openGraph: { title, description, images: [product.coverImage], type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Görüntülenme sayacı yanıt gönderildikten sonra artırılır; sayfa açılışını yavaşlatmaz.
  after(async () => {
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });
  });

  const related = await getRelatedProducts(product.id, product.categoryId, product.type);

  const features = parseJsonArray(product.features);
  const useCases = parseJsonArray(product.useCases);
  const modules = parseJsonArray(product.modules);
  const specs = parseJsonObject(product.techSpecs);
  const typeLabel = PRODUCT_TYPE_LABELS[product.type] ?? "Ürün";

  const licenses = product.licenses.map((l) => ({
    id: l.id,
    key: l.key,
    name: l.name,
    description: l.description,
    priceDelta: l.priceDelta,
    bullets: parseJsonArray(l.bullets),
    domainLimit: l.domainLimit,
    supportMonths: l.supportMonths,
    updateMonths: l.updateMonths,
    sourceIncluded: l.sourceIncluded,
  }));

  const addOnMediaMap = getAllAddOnMedia();
  const addOns = product.addOns.map((a) => {
    const media = addOnMediaMap[a.addOn.id] || addOnMediaMap[a.addOn.slug] || {
      image: "/gorseller/ajans/hizmet-web.svg",
      gallery: [],
    };
    return {
      id: a.addOn.id,
      name: a.addOn.name,
      description: a.addOn.description,
      price: a.addOn.price,
      extraDays: a.addOn.extraDays,
      group: a.addOn.group,
      isRecommended: a.isRecommended,
      image: media.image,
      gallery: media.gallery,
    };
  });

  /* --------------------------- Yapısal veri (SEO) --------------------------- */
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: `${SITE.url}${product.coverImage}`,
    category: product.category.name,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: (product.basePrice / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/urun/${product.slug}`,
    },
    ...(product.ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingAvg.toFixed(1),
            reviewCount: product.ratingCount,
          },
        }
      : {}),
    ...(product.reviews.length > 0
      ? {
          review: product.reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.authorName },
            reviewRating: { "@type": "Rating", ratingValue: r.rating },
            reviewBody: r.body,
          })),
        }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Mağaza", item: `${SITE.url}/magaza` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE.url}/urun/${product.slug}` },
    ],
  };

  const faqSchema =
    product.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page py-8 lg:py-10">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Mağaza", href: "/magaza" },
            { label: product.category.name, href: `/magaza?kategori=${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          {/* Sol sütun */}
          <div>
            {/* Rozetler ve Kurumsal Tescil */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1 text-xs font-bold text-[#15803d]">
                <span className="size-1.5 rounded-full bg-[#22c55e]" />
                Resmi Lizart Altyapısı
              </span>
              <Badge tone="brand">{typeLabel}</Badge>
              <Badge tone="outline">{product.category.name}</Badge>
              {product.isNew && <Badge tone="new">Yeni</Badge>}
              {product.isBestSeller && <Badge tone="dark">Çok satan</Badge>}
              {product.comparePrice && product.comparePrice > product.basePrice && (
                <span className="rounded-full bg-red-50 border border-red-100 px-2.5 py-0.5 text-xs font-bold text-red-500">
                  İndirimli
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-600 font-normal">
              {product.shortDesc}
            </p>

            {/* Güven ve İnceleme Metrikleri */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-ink-600">
              {product.ratingCount > 0 && (
                <div className="flex items-center gap-1.5 bg-surface-2 px-3 py-1.5 rounded-full border border-ink-100">
                  <Rating value={product.ratingAvg} count={product.ratingCount} size="sm" />
                </div>
              )}
              <span className="flex items-center gap-1 text-ink-700 font-semibold">
                <span>⚡</span>
                <span>{product.salesCount} Başarılı Kurulum</span>
              </span>
              <span className="hidden sm:inline text-ink-300">|</span>
              <span className="flex items-center gap-1">
                <span>🛡️</span>
                <span>Sözleşmeli & Faturalı</span>
              </span>
              <span className="hidden sm:inline text-ink-300">|</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Anında Dijital Teslimat</span>
              </span>
            </div>

            {/* Hızlı Erişim ve Demo Aksiyon Çubuğu */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {product.demoUrl && (
                <a
                  href={`/demo-merkezi/${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f1f17] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#1a3a25] hover:-translate-y-0.5"
                >
                  <span>🚀</span>
                  <span>Canlı Demoyu Başlat ↗</span>
                </a>
              )}
              {product.adminDemoUrl && (
                <a
                  href={`/demo-merkezi/${product.slug}#panel`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300"
                >
                  <span>⚙️</span>
                  <span>Yönetim Paneli Demosu ↗</span>
                </a>
              )}
              <a
                href="#satin-alma"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2.5 text-xs font-semibold text-[#15803d] transition-colors hover:bg-[#dcfce7]"
              >
                <span>⬇️</span>
                <span>Satın Alma & Fiyat</span>
              </a>
            </div>

            {/* 3 Görselli Cihaz Vitrini (Masaüstü Ana Sayfa -> Telefon Modu -> Tablet, 5 saniye otomatik geçiş) */}
            <div className="mt-8">
              <ProductGallery cover={product.coverImage} images={product.images} name={product.name} />
            </div>

            {/* 4'lü Kurumsal Güvence Şeridi */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🛡️", bg: "bg-[#f0fdf4]", label: "Kurumsal Lisans", desc: "Hukuki güvenceli kullanım hakkı" },
                { icon: "⚡", bg: "bg-slate-50", label: "Anahtar Teslim", desc: "Hosting & alan adı kurulumu" },
                { icon: "📱", bg: "bg-slate-50", label: "Mobil & Tablet", desc: "%100 duyarlı ve hızlı arabirim" },
                { icon: "📄", bg: "bg-slate-50", label: "Resmi E-Fatura", desc: "Yasal faturalı, gider gösterilebilir" },
              ].map(({ icon, bg, label, desc }) => (
                <div key={label} className={`rounded-2xl border border-slate-100 ${bg} p-3.5`}>
                  <div className="flex size-8 items-center justify-center rounded-xl bg-white border border-slate-100 text-base mb-2 shadow-sm">
                    {icon}
                  </div>
                  <p className="font-bold text-xs text-slate-900">{label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400 leading-snug">{desc}</p>
                </div>
              ))}
            </div>

            {/* 4 Adımda Teslimat Süreci (Resmi İşleyiş) */}
            <div className="mt-8 rounded-2xl border border-ink-100 bg-surface-2/60 p-6">
              <h3 className="text-sm font-bold tracking-tight text-ink-900 flex items-center gap-2">
                <span>📋</span>
                <span>4 Adımda Satın Alma ve Teslimat Süreci</span>
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-4 text-xs">
                <div className="relative">
                  <div className="flex size-7 items-center justify-center rounded-full bg-brand-500 text-white font-bold mb-2">
                    1
                  </div>
                  <p className="font-bold text-ink-900">Paket & Lisans</p>
                  <p className="mt-1 text-[0.72rem] text-ink-500 leading-relaxed">
                    İhtiyacınıza uygun lisans ve ek hizmetleri belirleyin.
                  </p>
                </div>

                <div className="relative">
                  <div className="flex size-7 items-center justify-center rounded-full bg-brand-500 text-white font-bold mb-2">
                    2
                  </div>
                  <p className="font-bold text-ink-900">Güvenli Ödeme</p>
                  <p className="mt-1 text-[0.72rem] text-ink-500 leading-relaxed">
                    256-Bit SSL ile Kredi Kartı veya Kurumsal Havale ile ödeyin.
                  </p>
                </div>

                <div className="relative">
                  <div className="flex size-7 items-center justify-center rounded-full bg-brand-500 text-white font-bold mb-2">
                    3
                  </div>
                  <p className="font-bold text-ink-900">Dosya & Lisans</p>
                  <p className="mt-1 text-[0.72rem] text-ink-500 leading-relaxed">
                    Lisans anahtarı ve kaynak kodlar anında hesabınıza tanımlanır.
                  </p>
                </div>

                <div className="relative">
                  <div className="flex size-7 items-center justify-center rounded-full bg-brand-500 text-white font-bold mb-2">
                    4
                  </div>
                  <p className="font-bold text-ink-900">Yayına Alma</p>
                  <p className="mt-1 text-[0.72rem] text-ink-500 leading-relaxed">
                    Ekibimiz sunucunuza kurar veya kendiniz hemen başlatırsınız.
                  </p>
                </div>
              </div>
            </div>

            {/* Açıklama */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Ürün hakkında</h2>
              <p className="mt-3 leading-relaxed text-ink-600">{product.description}</p>

              {useCases.length > 0 && (
                <>
                  <h3 className="mt-8 font-semibold text-ink-900">Kimler için uygun?</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {useCases.map((u) => (
                      <li key={u} className="flex gap-2 text-sm text-ink-600">
                        <span className="text-brand-600" aria-hidden>
                          ✓
                        </span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {features.length > 0 && (
                <>
                  <h3 className="mt-8 font-semibold text-ink-900">Öne çıkan özellikler</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-ink-600">
                        <span className="text-brand-600" aria-hidden>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {modules.length > 0 && (
                <>
                  <h3 className="mt-8 font-semibold text-ink-900">Dahil olan modüller</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {modules.map((m) => (
                      <li key={m}>
                        <Badge tone="neutral">{m}</Badge>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {/* Teknik özellikler */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Teknik özellikler</h2>
              <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-ink-100">
                <table className="w-full text-sm">
                  <caption className="sr-only">{product.name} teknik özellikleri</caption>
                  <tbody className="divide-y divide-ink-100">
                    {Object.entries(specs).map(([key, value]) => (
                      <tr key={key}>
                        <th scope="row" className="w-56 bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                          {key}
                        </th>
                        <td className="px-5 py-3 text-ink-600">{value}</td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                        Kullanılan teknoloji
                      </th>
                      <td className="px-5 py-3 text-ink-600">
                        {product.technologies.map((t) => t.technology.name).join(", ") || "—"}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                        Platformlar
                      </th>
                      <td className="px-5 py-3 text-ink-600">
                        {product.platforms.map((p) => p.platform.name).join(", ") || "—"}
                      </td>
                    </tr>
                    {product.requirements && (
                      <tr>
                        <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                          Sunucu gereksinimleri
                        </th>
                        <td className="px-5 py-3 text-ink-600">{product.requirements}</td>
                      </tr>
                    )}
                    <tr>
                      <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                        Teslimat yöntemi
                      </th>
                      <td className="px-5 py-3 text-ink-600">
                        Ödeme onayının ardından hesabınıza tanımlanan süreli ve imzalı indirme bağlantısı
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                        Güncelleme politikası
                      </th>
                      <td className="px-5 py-3 text-ink-600">{product.updatePolicy}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                        Teknik destek kapsamı
                      </th>
                      <td className="px-5 py-3 text-ink-600">{product.supportScope}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Lisans karşılaştırma */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Lisans seçenekleri</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {licenses.map((l) => (
                  <Card key={l.id} className="p-5">
                    <h3 className="font-semibold text-ink-900">{l.name}</h3>
                    <p className="mt-1 text-sm font-medium text-brand-700">
                      {l.priceDelta === 0
                        ? formatPrice(product.basePrice)
                        : formatPrice(product.basePrice + l.priceDelta)}
                      <span className="text-xs font-normal text-ink-400"> + KDV</span>
                    </p>
                    <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-ink-600">
                      {l.bullets.map((b) => (
                        <li key={b} className="flex gap-1.5">
                          <span className="text-brand-600" aria-hidden>
                            ✓
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-500">
                Ayrıntılı koşullar için{" "}
                <Link href="/kurumsal/lisans-sozlesmesi" className="text-brand-700 underline">
                  lisans sözleşmesi
                </Link>{" "}
                ve{" "}
                <Link href="/kurumsal/iptal-ve-iade-politikasi" className="text-brand-700 underline">
                  iade koşulları
                </Link>
                .
              </p>
            </section>

            {/* Sürüm geçmişi */}
            {product.versions.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight text-ink-900">Değişiklik geçmişi</h2>
                <ol className="mt-4 space-y-3">
                  {product.versions.map((v) => (
                    <li key={v.id} className="rounded-2xl border border-ink-100 bg-surface p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-ink-900">Sürüm {v.version}</p>
                        <p className="text-xs text-ink-400">{formatDate(v.releasedAt)}</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.changelog}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Yorumlar */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink-900">Müşteri yorumları</h2>
              {product.reviews.length === 0 ? (
                <p className="mt-3 text-sm text-ink-500">
                  Bu ürün için henüz yorum yok. Yorumlar yalnızca ürünü satın almış müşteriler tarafından
                  yazılabilir.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {product.reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl border border-ink-100 bg-surface p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-ink-900">{r.authorName}</p>
                          {r.authorTitle && <p className="text-xs text-ink-500">{r.authorTitle}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          {r.isVerified && <Badge tone="brand">Onaylı alıcı</Badge>}
                          <Rating value={r.rating} />
                        </div>
                      </div>
                      {r.title && <p className="mt-3 font-medium text-ink-800">{r.title}</p>}
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Ürün SSS */}
            {product.faqs.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold tracking-tight text-ink-900">Bu ürün hakkında sorulanlar</h2>
                <Accordion
                  className="mt-4"
                  items={product.faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
                />
              </section>
            )}
          </div>

          {/* Sağ sütun: satın alma paneli */}
          <div id="satin-alma" className="scroll-mt-24 lg:sticky lg:top-24 lg:h-fit">
            <PurchasePanel
              productId={product.id}
              productName={product.name}
              basePrice={product.basePrice}
              comparePrice={product.comparePrice}
              deliveryDays={product.deliveryDays}
              licenses={licenses}
              addOns={addOns}
            />
          </div>
        </div>
      </div>

      {/* Bu ürüne benzer kurguda yayına aldığımız gerçek siteler */}
      <div className="container-page">
        <BuiltWith productCategorySlug={product.category.slug} productType={product.type} />
      </div>

      {/* Benzer ürünler */}
      {related.length > 0 && (
        <section className="container-page py-14">
          <SectionHeading
            title="Benzer ürünler"
            description="Aynı kategoride sıkça karşılaştırılan diğer ürünler."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobilde sabit satın alma çubuğu */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-surface/95 p-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-500">{product.name}</p>
            <p className="font-semibold text-ink-900">{formatPrice(product.basePrice)} + KDV</p>
          </div>
          <a
            href="#satin-alma"
            className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-canvas"
          >
            Seçenekleri aç
          </a>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
    </div>
  );
}
