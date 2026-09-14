import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import {
  BlogCategoryRowActions,
} from "@/components/admin/CategoryControls";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";
import { BookOpenText, Layers, Tag, ExternalLink, Package, Cpu, Plus, Boxes, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog Kategorileri & Taksonomi | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminTaxonomyPage() {
  const [blogCategories, productCategories, technologies, platforms, totalBlogPosts] =
    await Promise.all([
      prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
      prisma.productCategory.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.technology.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.platform.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.blogPost.count(),
    ]);

  const groupedProducts = Object.entries(
    productCategories.reduce<Record<string, typeof productCategories>>((acc, c) => {
      (acc[c.kind] ??= []).push(c);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-10">
      {/* ─── Hero ─── */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-[0_20px_60px_-45px_rgb(15_23_42/.35)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#223d26]/15 bg-[#223d26]/[0.06] px-3.5 py-1 text-xs font-semibold text-[#223d26]">
              <Layers className="h-3.5 w-3.5 text-[#223d26]" />
              <span>Kategori & Taksonomi Yönetimi</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem] leading-tight">
              Blog ve İçerik Kategorileri
            </h1>
            <p className="mt-2.5 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
              Blog yazılarınızı konulara göre sınıflandırın, yeni kategoriler oluşturun ve içerik dağılımını izleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/yonetim/kategoriler/yeni"
              className="inline-flex items-center gap-2 rounded-xl bg-[#223d26] px-5 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#2b4c30] active:scale-[0.99]"
            >
              <Plus size={16} className="stroke-[2.5]" />
              Yeni Kategori Oluştur
            </Link>

            {/* İstatistik Kartları */}
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 to-white px-4 py-2.5 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs">
                <BookOpenText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Blog Kategorisi</p>
                <p className="text-lg font-black text-slate-950">{blogCategories.length} Adet</p>
              </div>
            </div>
            <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-2.5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Toplam Yazı</p>
                <p className="text-lg font-black text-slate-950">{totalBlogPosts} Makale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TÜM BLOG KATEGORİLERİ TABLOSU ─── */}
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)] lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#223d26]">
              <Tag size={13} />
              Mevcut Taksonomi
            </span>
            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Bütün Blog Kategorileri
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Sitede tanımlı tüm blog kategorileri ve ilişkili içerik sayıları
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-700">
              {blogCategories.length} Kategori Kayıtlı
            </span>
            <Link
              href="/yonetim/kategoriler/yeni"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#223d26] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#2b4c30] transition"
            >
              <Plus size={14} className="stroke-[2.5]" />
              Yeni Kategori Ekle
            </Link>
          </div>
        </div>

        {blogCategories.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-base font-semibold text-slate-900">
              Henüz blog kategorisi tanımlanmamış.
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Yukarıdaki formu kullanarak ilk kategorinizi hemen oluşturabilirsiniz.
            </p>
          </div>
        ) : (
          <AdminTable headers={["Kategori Adı", "Kalıcı Bağlantı (Slug)", "İçerik Sayısı", "İşlemler"]}>
            {blogCategories.map((c) => (
              <tr
                key={c.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-[#223d26]/10 text-[#223d26] font-semibold text-xs">
                      #
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.name}</p>
                      <p className="font-mono text-xs font-medium text-slate-400">ID: {c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    /blog?kategori={c.slug}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/yonetim/blog?kategori=${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#223d26] hover:bg-emerald-100 transition"
                  >
                    <span>{c._count.posts} Yazı</span>
                    <ExternalLink size={12} />
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/yonetim/blog?kategori=${c.id}`}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition"
                    >
                      Yazıları Gör
                    </Link>
                    <BlogCategoryRowActions
                      categoryId={c.id}
                      postCount={c._count.posts}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </section>

      {/* ─── 3. BÖLÜM: MAĞAZA VE ÜRÜN KATEGORİLERİ ─── */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Package size={14} />
            Mağaza Taksonomisi
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Ürün & Paket Kategorileri
          </h2>
          <p className="mt-1 text-sm font-normal text-slate-600">
            Hazır web siteleri, mobil uygulamalar ve dijital çözümler için tanımlı ürün kategorileri.
          </p>
        </div>

        <div className="grid gap-6">
          {groupedProducts.map(([kind, items]) => (
            <div
              key={kind}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  {PRODUCT_TYPE_LABELS[kind] ?? kind}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700">
                  {items.length} Kategori
                </span>
              </div>
              <AdminTable headers={["Kategori Adı", "Slug", "Ürün Sayısı"]}>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{c.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-600">
                      {c.slug}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">
                      {c._count.products} Paket
                    </td>
                  </tr>
                ))}
              </AdminTable>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. BÖLÜM: TEKNOLOJİ VE PLATFORM ETİKETLERİ ─── */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Cpu size={18} className="text-[#223d26]" />
            <h3 className="text-base font-bold text-slate-900">Teknoloji Etiketleri</h3>
          </div>
          <AdminTable headers={["Teknoloji", "Grup", "Kullanan Ürün"]}>
            {technologies.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-5 py-3 font-semibold text-slate-900">{t.name}</td>
                <td className="px-5 py-3 text-xs font-medium text-slate-600">{t.group}</td>
                <td className="px-5 py-3 text-sm font-semibold text-[#223d26]">
                  {t._count.products}
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#223d26]" />
            <h3 className="text-base font-bold text-slate-900">Platformlar</h3>
          </div>
          <AdminTable headers={["Platform", "Slug", "Kullanan Ürün"]}>
            {platforms.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                <td className="px-5 py-3 font-semibold text-slate-900">{p.name}</td>
                <td className="px-5 py-3 font-mono text-xs font-medium text-slate-600">{p.slug}</td>
                <td className="px-5 py-3 text-sm font-semibold text-[#223d26]">
                  {p._count.products}
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      </section>
    </div>
  );
}
