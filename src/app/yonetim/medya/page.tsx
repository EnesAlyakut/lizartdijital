import type { Metadata } from "next";
import { FileImage, GalleryHorizontalEnd, Images, UploadCloud } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Medya Kütüphanesi | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [products, productImages, blogs, portfolio] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true, coverImage: true, slug: true }, orderBy: { updatedAt: "desc" } }),
    prisma.productImage.findMany({ include: { product: { select: { name: true, slug: true } } }, orderBy: { sortOrder: "asc" } }),
    prisma.blogPost.findMany({ select: { id: true, title: true, coverImage: true, slug: true }, orderBy: { updatedAt: "desc" } }),
    prisma.portfolioProject.findMany({ orderBy: { completedAt: "desc" } }),
  ]);

  const assets = [
    ...products.map((item) => ({ id: `product-cover-${item.id}`, title: item.name, type: "Ürün Kapak", url: item.coverImage, location: `/urun/${item.slug}` })),
    ...productImages.map((item) => ({ id: item.id, title: item.alt || item.product.name, type: `Ürün ${item.viewport}`, url: item.url, location: `/urun/${item.product.slug}` })),
    ...blogs.map((item) => ({ id: `blog-${item.id}`, title: item.title, type: "Blog Kapak", url: item.coverImage, location: `/blog/${item.slug}` })),
    ...portfolio.flatMap((item) => [
      { id: `portfolio-cover-${item.id}`, title: item.title, type: "Referans Kapak", url: item.coverImage, location: `/projeler/${item.slug}` },
      ...(item.mobileImage ? [{ id: `portfolio-mobile-${item.id}`, title: item.title, type: "Mobil Ekran", url: item.mobileImage, location: `/projeler/${item.slug}` }] : []),
      ...parseList(item.gallery).map((url, index) => ({ id: `portfolio-gallery-${item.id}-${index}`, title: item.title, type: "Referans Galeri", url: String(url), location: `/projeler/${item.slug}` })),
    ]),
  ].filter((asset) => asset.url);

  const localAssets = assets.filter((asset) => asset.url.startsWith("/")).length;
  const remoteAssets = assets.length - localAssets;
  const uniqueAssets = new Set(assets.map((asset) => asset.url)).size;

  return (
    <div className="space-y-8">
      {/* ─── Hero ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_26rem]">
          <div>
            <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              Görsel & Medya Varlıkları
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Medya Kütüphanesi
            </h1>
            <p className="mt-3 max-w-2xl text-base font-bold leading-7 text-slate-700">
              Ürün paketleri, blog makaleleri ve referans projelerinde kullanılan tüm görsel varlıklar tek ekranda izlenir. URL doğrulaması ve görsel optimizasyonu doğrudan kontrol edilebilir.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <Metric icon={Images} label="Toplam Varlık" value={String(assets.length)} />
            <Metric icon={FileImage} label="Benzersiz" value={String(uniqueAssets)} />
            <Metric icon={GalleryHorizontalEnd} label="Yerel Dosya" value={String(localAssets)} />
          </div>
        </div>
      </section>

      {/* ─── Medya Izgarası & Yükleme Alanı ─── */}
      <section className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="grid size-14 place-items-center rounded-2xl bg-[#1f7a68]/10 text-[#1f7a68]">
              <UploadCloud size={28} className="stroke-[2.5]" />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">Medya Yükleme Alanı</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              Görselleri sürükleyip bırakarak veya dosya seçerek doğrudan WebP/AVIF formatlarına optimize edip sisteme yükleyebilirsiniz.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Dağılım İstatistiği</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              <strong className="text-slate-950 font-black">{remoteAssets}</strong> harici CDN URL &bull;{" "}
              <strong className="text-slate-950 font-black">{localAssets}</strong> yerel varlık
            </p>
          </div>
        </aside>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:border-slate-300"
            >
              <div
                className="aspect-[16/10] bg-slate-100 bg-cover bg-center border-b border-slate-100"
                style={{ backgroundImage: `url("${asset.url.replace(/"/g, "%22")}")` }}
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">{asset.title}</p>
                    <p className="mt-0.5 text-xs font-bold text-[#1f7a68]">{asset.type}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                    {asset.url.startsWith("/") ? "Yerel" : "URL"}
                  </span>
                </div>
                <p className="mt-2.5 truncate rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-semibold text-slate-700 border border-slate-100">
                  {asset.url}
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">Kullanıldığı sayfa: {asset.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Images; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <Icon size={20} className="text-[#1f7a68]" />
      <p className="mt-2 text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
