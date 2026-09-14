import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductEditForm, VersionForm } from "@/components/admin/ProductControls";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Ürün Düzenle | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        versions: { orderBy: { releasedAt: "desc" } },
        files: true,
        licenses: { orderBy: { sortOrder: "asc" } },
        addOns: { include: { addOn: true } },
        images: true,
        _count: { select: { orderItems: true, reviews: true } },
      },
    }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/yonetim/urunler"
            className="inline-flex items-center gap-1 text-sm font-black text-[#1f7a68] hover:underline"
          >
            ← Tüm Ürünlere Dön
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{product.name}</h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                product.isPublished ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"
              }`}
            >
              {product.isPublished ? "Yayında" : "Taslak"}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            /{product.slug} · Son güncelleme: {formatDate(product.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/urun/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-900 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68]"
          >
            Sitede Görüntüle ↗
          </Link>
        </div>
      </div>

      {/* Özet göstergeler */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Toplam Satış" value={String(product.salesCount)} helper="Tamamlanan adet" />
        <Stat label="Görüntüleme" value={String(product.viewCount)} helper="Tekil ziyaretçi" />
        <Stat label="Sipariş Kalemi" value={String(product._count.orderItems)} helper="Sepet girişi" />
        <Stat label="Müşteri Yorumu" value={String(product._count.reviews)} helper="Onaylı değerlendirme" />
      </div>

      {/* Ana Ürün Formu */}
      <section>
        <ProductEditForm
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            type: product.type,
            categoryId: product.categoryId,
            shortDesc: product.shortDesc,
            description: product.description,
            basePrice: product.basePrice,
            comparePrice: product.comparePrice,
            deliveryDays: product.deliveryDays,
            isPublished: product.isPublished,
            isFeatured: product.isFeatured,
            hasAdminPanel: product.hasAdminPanel,
            includesSource: product.includesSource,
            multiLanguage: product.multiLanguage,
          }}
          categories={categories}
        />
      </section>

      {/* Sürüm Formu */}
      <section>
        <VersionForm productId={product.id} />
      </section>

      {/* Sürümler */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Sürüm Geçmişi</h2>
            <p className="mt-0.5 text-sm font-semibold text-slate-600">Yayınlanan güncellemeler ve sürüm notları</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-800">
            {product.versions.length} Sürüm
          </span>
        </div>
        <ul className="mt-5 space-y-3">
          {product.versions.map((v) => (
            <li key={v.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-black text-slate-950 text-base">v{v.version}</span>
                <span className="text-xs font-bold text-slate-500">{formatDate(v.releasedAt)}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-700 whitespace-pre-line">{v.changelog}</p>
            </li>
          ))}
          {product.versions.length === 0 && (
            <p className="text-sm font-bold text-slate-500">Henüz yayınlanmış sürüm geçmişi bulunmuyor.</p>
          )}
        </ul>
      </section>

      {/* Lisanslar */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <h2 className="text-xl font-black text-slate-950">Lisans Paketleri</h2>
        <p className="mt-0.5 text-sm font-semibold text-slate-600">Bu ürün için tanımlı lisans türleri ve fiyat farkları</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {product.licenses.map((l) => (
            <div key={l.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-950 text-base">{l.name}</p>
              <p className="mt-1 text-lg font-black text-[#1f7a68]">
                {l.priceDelta === 0 ? "Taban Fiyat" : `+${formatPrice(l.priceDelta)}`}
              </p>
              <p className="mt-2 text-xs font-bold text-slate-600">
                {l.domainLimit >= 999 ? "Sınırsız Domain" : `${l.domainLimit} Domain`} · {l.supportMonths} Ay Destek
              </p>
            </div>
          ))}
          {product.licenses.length === 0 && (
            <p className="col-span-3 text-sm font-bold text-slate-500">Lisans tanımlanmamış (standart lisans geçerli).</p>
          )}
        </div>
      </section>

      {/* Dosyalar */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <h2 className="text-xl font-black text-slate-950">Dijital Teslim Dosyaları</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Dosyalar güvenli depoda saklanır; erişim yalnızca müşterinin sipariş panelindeki imzalı bağlantı ile verilir.
        </p>
        <ul className="mt-5 space-y-3">
          {product.files.map((f) => (
            <li key={f.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-950 text-base">{f.label}</p>
                <span className="text-xs font-black text-slate-500">{(f.sizeBytes / 1024).toFixed(1)} KB</span>
              </div>
              <p className="mt-1 font-mono text-xs font-bold text-slate-600">{f.storageKey}</p>
            </li>
          ))}
          {product.files.length === 0 && (
            <li className="text-sm font-bold text-slate-500">Bu ürüne henüz dosya tanımlanmamış.</li>
          )}
        </ul>
      </section>

      {/* Ek hizmetler */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
        <h2 className="text-xl font-black text-slate-950">Sunulan Ek Hizmetler</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">Müşterinin satın alırken sepete ekleyebileceği hizmetler</p>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {product.addOns.map((a) => (
            <li
              key={a.addOnId}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900"
            >
              <span>{a.addOn.name}</span>
              <span className="font-black text-[#1f7a68]">+{formatPrice(a.addOn.price)}</span>
              {a.isRecommended && (
                <span className="rounded-full bg-[#1f7a68]/15 px-2 py-0.5 text-xs font-black text-[#1f7a68]">
                  Önerilen
                </span>
              )}
            </li>
          ))}
          {product.addOns.length === 0 && (
            <li className="text-sm font-bold text-slate-500">Bağlı ek hizmet bulunmuyor.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      {helper && <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>}
    </div>
  );
}
