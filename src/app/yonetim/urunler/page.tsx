import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Package, Search, ShoppingBag, Sparkles, Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { ProductCreateForm, ProductRowActions } from "@/components/admin/ProductControls";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Ürünler", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tur?: string }>;
}) {
  const { q, tur } = await searchParams;

  const [products, categories, totalProducts, publishedProducts, featuredProducts, totalSales] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...(tur ? { type: tur } : {}),
        ...(q ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] } : {}),
      },
      orderBy: [{ isPublished: "desc" }, { isFeatured: "desc" }, { updatedAt: "desc" }],
      include: { category: { select: { name: true } }, _count: { select: { versions: true } } },
    }),
    prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.product.aggregate({ _sum: { salesCount: true, viewCount: true } }),
  ]);

  const types = Object.entries(PRODUCT_TYPE_LABELS);
  return (
    <div className="space-y-7">
      {/* ─── Hero ─── */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_27rem]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#1f7a68]">Ürün / web site paketleri</p>
            <h1 className="mt-2 text-2xl font-bold text-[#111]">Katalog yönetimi</h1>
            <p className="mt-2 max-w-2xl text-[0.9375rem] font-medium leading-7 text-[#555]">
              Hazır web siteleri, hizmet paketleri ve dijital ürünler gerçek veritabanı üzerinden yönetilir.
              Yayına alma, kopyalama ve arşivleme işlemleri frontend mağaza görünümünü anında etkiler.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric icon={Package} label="Toplam" value={String(totalProducts)} tone="blue" />
            <Metric icon={Sparkles} label="Yayında" value={String(publishedProducts)} tone="teal" />
            <Metric icon={ShoppingBag} label="Satış" value={String(totalSales._sum.salesCount ?? 0)} tone="emerald" />
            <Metric icon={Eye} label="Öne çıkan" value={String(featuredProducts)} tone="amber" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <form className="flex flex-wrap items-center gap-2 flex-1 min-w-0" role="search">
            <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-[#f8f9fc] px-4 sm:max-w-md">
              <Search size={17} className="text-[#999]" />
              <input
                type="search"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Ürün adı veya slug ara"
                aria-label="Ürün ara"
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111] outline-none placeholder:text-[#999]"
              />
            </label>
            {tur && <input type="hidden" name="tur" value={tur} />}
            <button type="submit" className="h-11 rounded-xl bg-[#1f7a68] px-5 text-sm font-bold text-white hover:bg-[#176956]">
              Ara
            </button>
          </form>

          <Link
            href="/admin/urunler/yeni"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1f7a68] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#176956]"
          >
            <Plus size={18} className="stroke-[3]" />
            Yeni Paket / Ürün Ekle
          </Link>
        </div>

        <nav aria-label="Ürün türü filtresi" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          <FilterPill href="/yonetim/urunler" active={!tur} label="Tümü" />
          {types.map(([key, label]) => (
            <FilterPill key={key} href={`/yonetim/urunler?tur=${key}`} active={tur === key} label={label} />
          ))}
        </nav>
      </section>

      <ProductCreateForm categories={categories} />

      {/* ─── Table ─── */}
      <AdminTable headers={["Ürün", "Kategori", "Tür", "Fiyat", "Performans", "SEO", "Durum", "İşlemler"]}>
        {products.map((p) => {
          const seoScore = scoreSeo({
            title: p.metaTitle ?? p.name,
            description: p.metaDescription ?? p.shortDesc,
            slug: p.slug,
            body: p.description,
          });
          return (
            <tr key={p.id} className="align-top">
              <td className="px-4 py-4">
                <Link href={`/yonetim/urunler/${p.id}`} className="font-bold text-[#111] hover:text-[#1f7a68]">
                  {p.name}
                </Link>
                <p className="mt-1 text-sm font-medium text-[#777]">/{p.slug}</p>
                <p className="mt-1 text-sm font-medium text-[#999]">Güncelleme: {formatDate(p.updatedAt)}</p>
              </td>
              <td className="px-4 py-4 font-semibold text-[#333]">{p.category.name}</td>
              <td className="px-4 py-4 font-semibold text-[#333]">{PRODUCT_TYPE_LABELS[p.type] ?? p.type}</td>
              <td className="px-4 py-4">
                <p className="font-bold text-[#111]">{formatPrice(p.basePrice)}</p>
                {p.comparePrice && <p className="text-sm font-medium text-[#999] line-through">{formatPrice(p.comparePrice)}</p>}
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-[#333]">
                {p.salesCount} satış
                <p className="text-sm text-[#777]">{p.viewCount} görüntüleme · {p._count.versions} sürüm</p>
              </td>
              <td className="px-4 py-4">
                <Score value={seoScore} />
              </td>
              <td className="px-4 py-4">
                <Status active={p.isPublished} label={p.isPublished ? "Yayında" : "Taslak"} />
                {p.isFeatured && <span className="mt-2 block w-fit rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">Öne çıkan</span>}
              </td>
              <td className="px-4 py-4">
                <ProductRowActions productId={p.id} isPublished={p.isPublished} />
              </td>
            </tr>
          );
        })}
      </AdminTable>
    </div>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition",
        active ? "border-[#1f7a68] bg-[#1f7a68] text-white" : "border-gray-200 bg-white text-[#333] hover:border-[#1f7a68]/40 hover:bg-[#f0faf7]",
      )}
    >
      {label}
    </Link>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "blue",
}: {
  icon: typeof Package;
  label: string;
  value: string;
  tone?: "blue" | "teal" | "emerald" | "amber";
}) {
  const styles = {
    blue: {
      border: "border-blue-200/90",
      bg: "bg-gradient-to-b from-blue-50/60 to-white",
      badge: "bg-gradient-to-tr from-blue-600 to-sky-500 text-white",
      label: "text-blue-700",
    },
    teal: {
      border: "border-teal-200/90",
      bg: "bg-gradient-to-b from-teal-50/60 to-white",
      badge: "bg-gradient-to-tr from-teal-600 to-emerald-500 text-white",
      label: "text-teal-700",
    },
    emerald: {
      border: "border-emerald-200/90",
      bg: "bg-gradient-to-b from-emerald-50/60 to-white",
      badge: "bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white",
      label: "text-emerald-700",
    },
    amber: {
      border: "border-amber-200/90",
      bg: "bg-gradient-to-b from-amber-50/60 to-white",
      badge: "bg-gradient-to-tr from-amber-500 to-orange-400 text-white",
      label: "text-amber-700",
    },
  };
  const current = styles[tone];
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border ${current.border} ${current.bg} p-4 shadow-xs transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-black uppercase tracking-wider ${current.label}`}>{label}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${current.badge} shadow-xs`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2.5">
        <div className="text-2xl font-black tracking-tight text-slate-950">{value}</div>
      </div>
    </div>
  );
}

function Status({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", active ? "bg-[#f0faf7] text-[#1f7a68]" : "bg-gray-100 text-[#555]")}>
      {label}
    </span>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="w-28">
      <div className="flex items-center justify-between text-sm font-bold">
        <span className={value >= 80 ? "text-[#1f7a68]" : value >= 55 ? "text-amber-600" : "text-red-600"}>{value}/100</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={value >= 80 ? "h-full bg-[#1f7a68]" : value >= 55 ? "h-full bg-amber-500" : "h-full bg-red-500"} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function scoreSeo(data: { title: string; description: string; slug: string; body: string }) {
  let score = 20;
  if (data.title.length >= 30 && data.title.length <= 70) score += 25;
  if (data.description.length >= 90 && data.description.length <= 165) score += 25;
  if (data.slug.length > 4 && data.slug.length < 80) score += 15;
  if (data.body.length > 300) score += 15;
  return Math.min(score, 100);
}
