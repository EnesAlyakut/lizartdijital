import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenText,
  Clock3,
  FileText,
  Search,
  Sparkles,
  ExternalLink,
  Plus,
  Filter,
  Layers,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { BlogRowActions } from "@/components/admin/BlogControls";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog Yönetimi | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; durum?: string; kategori?: string }>;
}) {
  const { q, durum, kategori } = await searchParams;

  const [posts, categories, totalPosts, publishedPosts, draftPosts] =
    await Promise.all([
      prisma.blogPost.findMany({
        where: {
          ...(q
            ? {
                OR: [
                  { title: { contains: q } },
                  { slug: { contains: q } },
                  { excerpt: { contains: q } },
                  { body: { contains: q } },
                  { authorName: { contains: q } },
                ],
              }
            : {}),
          ...(kategori ? { categoryId: kategori } : {}),
          ...(durum === "yayinda"
            ? { isPublished: true }
            : durum === "taslak"
            ? { isPublished: false }
            : {}),
        },
        orderBy: [{ isPublished: "desc" }, { publishedAt: "desc" }],
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: false } }),
    ]);

  return (
    <div className="space-y-8">
      {/* ══════════════════════════════════════════════════════════════════
          1. EN ÜST BAŞLIK & "YENİ YAZI OLUŞTUR" BUTONU
      ══════════════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════
          1. EN ÜST BAŞLIK & "YENİ YAZI OLUŞTUR" BUTONU
      ══════════════════════════════════════════════════════════════════ */}
      <section className="flex flex-col gap-5 rounded-[2rem] border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#223d26]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#223d26]">
            <BookOpenText size={14} className="stroke-[2]" />
            Blog CMS & İçerik Yönetimi
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Blog Yönetimi
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-normal">
            Yayınlanan makalelerinizi inceleyin, filtreleyin, düzenleyin veya hemen yeni bir yazı oluşturun.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/kategoriler"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-[#223d26] hover:bg-white shadow-2xs"
          >
            <Layers size={16} className="text-[#223d26]" />
            Kategoriler
          </Link>
          <Link
            href="/admin/blog/yeni"
            className="inline-flex items-center gap-2 rounded-xl bg-[#223d26] hover:bg-[#2b4c30] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition"
          >
            <Plus size={18} className="stroke-[2.5]" />
            Yeni Yazı Oluştur
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. ARAMA, FİLTRELEME & İSTATİSTİKLER
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="blog-arama-filtre"
        className="rounded-[2rem] border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Search size={14} className="stroke-[2]" />
              Arama & Filtreleme
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              İstenilen Blog Yazısını Ara
            </h2>
            <p className="mt-1 text-sm text-slate-600 font-normal">
              Yazı başlığı, makale metni veya yazara göre anında arayın ve yayın durumuna göre filtreleyin.
            </p>
          </div>

          {/* Uygun Renkli İstatistik Kartları */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
            {/* Toplam İçerik - Mavi */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                  <BookOpenText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalPosts}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Makale & İçerik</p>
              </div>
            </div>

            {/* Yayında - Zümrüt Yeşil (Canlı) */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Yayında</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{publishedPosts}</div>
                <p className="mt-0.5 text-[11px] font-bold text-slate-500">Canlı Yayında</p>
              </div>
            </div>

            {/* Taslak - Amber/Turuncu */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Taslak</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600">{draftPosts}</div>
                <p className="mt-0.5 text-[11px] font-bold text-amber-500">Hazırlanıyor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arama Formu */}
        <form
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_11rem_auto_auto]"
          role="search"
        >
          <label className="flex h-11 items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 px-3.5 focus-within:border-[#223d26] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#82cf7f]/15 transition sm:col-span-2 lg:col-span-1">
            <Search size={17} className="text-slate-400 shrink-0" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="İstediğiniz blog yazısını veya anahtar kelimeyi arayın..."
              aria-label="Blog yazısı ara"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <select
            name="kategori"
            defaultValue={kategori ?? ""}
            aria-label="Kategoriye göre filtrele"
            className="h-11 rounded-xl border border-slate-200/90 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 outline-none cursor-pointer shadow-2xs"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category._count.posts})
              </option>
            ))}
          </select>

          <select
            name="durum"
            defaultValue={durum ?? ""}
            aria-label="Yayın durumuna göre filtrele"
            className="h-11 rounded-xl border border-slate-200/90 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 outline-none cursor-pointer shadow-2xs"
          >
            <option value="">Tüm Durumlar</option>
            <option value="yayinda">Yalnızca Yayında Olanlar</option>
            <option value="taslak">Yalnızca Taslaklar</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#223d26] hover:bg-[#2b4c30] px-5 text-sm font-bold text-white shadow-xs transition"
          >
            <Filter size={15} />
            Filtrele
          </button>

          {(q || durum || kategori) && (
            <Link
              href="/admin/blog"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200/90 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Filtreyi Temizle
            </Link>
          )}
        </form>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. ESKİ YAZILAN BLOGLAR (ARŞİV & LİSTE)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="eski-yazilar" className="grid gap-6 xl:grid-cols-[1fr_17rem] 2xl:grid-cols-[1fr_18.5rem] items-start">
        {/* Yazı Listesi Tablosu */}
        <div className="min-w-0 w-full overflow-hidden rounded-[2rem] border border-slate-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#223d26]">
                <BookOpenText size={14} />
                Yayın Arşivi
              </span>
              <h3 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
                Eski Yazılan Bloglar
              </h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {posts.length} yazı listeleniyor (en yeni yayınlar üsttedir)
              </p>
            </div>
            <Link
              href="/admin/blog/yeni"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#223d26] hover:bg-[#2b4c30] px-4 py-2 text-xs font-bold text-white shadow-xs transition"
            >
              <Plus size={15} className="stroke-[2.5]" />
              Yeni Yazı Oluştur
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={28} />
              </div>
              <p className="mt-3 text-base font-bold text-slate-950">
                Aradığınız kritere uygun blog yazısı bulunamadı
              </p>
              <p className="mt-1 text-xs font-normal text-slate-500">
                Farklı bir arama kelimesi deneyebilir veya yeni bir yazı oluşturabilirsiniz.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/admin/blog"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Filtreleri Temizle
                </Link>
                <Link
                  href="/admin/blog/yeni"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#223d26] hover:bg-[#2b4c30] px-4 py-2 text-xs font-bold text-white"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  Yeni Yazı Oluştur
                </Link>
              </div>
            </div>
          ) : (
            <AdminTable
              minWidth="min-w-[48rem]"
              headers={[
                { label: "Yazı Bilgisi", align: "left" },
                { label: "Kategori", align: "left" },
                { label: "Yazar", align: "left" },
                { label: "SEO Skoru", align: "center" },
                { label: "Okuma / Tarih", align: "left" },
                { label: "Durum", align: "center" },
                { label: "İşlemler", align: "right" },
              ]}
            >
              {posts.map((p) => {
                const score = scoreBlogSeo(p);
                return (
                  <tr
                    key={p.id}
                    className="align-middle border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition"
                  >
                    {/* Görsel + Başlık + Slug */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3.5">
                        <Link
                          href={`/admin/blog/${p.id}`}
                          title="Yazıyı Düzenle"
                          className="size-13 shrink-0 rounded-xl bg-slate-100 bg-cover bg-center border border-slate-200 transition hover:opacity-85 hover:border-[#1f7a68] shadow-2xs"
                          style={{
                            backgroundImage: `url("${(
                              p.coverImage || "/logo.svg"
                            ).replace(/"/g, "%22")}")`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/admin/blog/${p.id}`}
                              className="text-sm font-black text-slate-950 hover:text-[#1f7a68] transition"
                            >
                              <span className="line-clamp-1">{p.title}</span>
                            </Link>
                            <Link
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              title="Sitede Canlı Önizle"
                              className="inline-flex items-center text-slate-400 hover:text-[#1f7a68] transition shrink-0"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-relaxed text-slate-500">
                            {p.excerpt}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-[11px] font-semibold text-slate-400">
                              /blog/{p.slug}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Yazar */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 leading-tight">
                          {p.authorName}
                        </span>
                        {p.authorTitle && (
                          <span className="mt-1 inline-flex items-center rounded-md bg-emerald-50/90 px-2 py-0.5 text-[10px] font-black text-[#1f7a68] border border-emerald-200/70 w-fit">
                            {p.authorTitle}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* SEO Skoru */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <Score value={score} />
                      </div>
                    </td>

                    {/* Okuma & Tarih */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-1 font-black text-slate-900">
                          <Clock3 size={12} className="text-[#1f7a68]" />
                          {p.readMinutes} dk
                        </span>
                        <span className="mt-0.5 text-[11px] font-semibold text-slate-400">
                          {formatDate(p.publishedAt)}
                        </span>
                      </div>
                    </td>

                    {/* Yayın Durumu */}
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wider ${
                          p.isPublished
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            p.isPublished ? "bg-emerald-600 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        {p.isPublished ? "Yayında" : "Taslak"}
                      </span>
                    </td>

                    {/* İşlemler */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <BlogRowActions
                        postId={p.id}
                        isPublished={p.isPublished}
                      />
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
        </div>

        {/* Sağ Sütun: Kategoriler Dağılımı */}
        <aside className="w-full xl:w-[17rem] 2xl:w-[18.5rem] shrink-0 space-y-6">
          <div className="rounded-[2rem] border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                <Layers size={17} className="text-[#223d26]" />
                Blog Kategorileri
              </div>
              <Link
                href="/admin/kategoriler"
                className="text-xs font-bold text-[#223d26] hover:underline"
              >
                Yönet →
              </Link>
            </div>
            <p className="mt-1 text-xs text-slate-500 font-normal">
              Kategoriye göre hızlı filtrele
            </p>

            <div className="mt-4 space-y-1.5">
              <Link
                href="/admin/blog"
                className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition ${
                  !kategori
                    ? "border-[#223d26] bg-[#223d26] text-white"
                    : "border-slate-200/90 bg-slate-50/70 text-slate-800 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <span>Tümü</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    !kategori
                      ? "bg-white text-[#223d26]"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {totalPosts}
                </span>
              </Link>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/admin/blog?kategori=${category.id}`}
                  className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition ${
                    kategori === category.id
                      ? "border-[#223d26] bg-[#223d26] text-white"
                      : "border-slate-200/90 bg-slate-50/70 text-slate-800 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="truncate pr-2">{category.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${
                      kategori === category.id
                        ? "bg-white text-[#223d26]"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {category._count.posts}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Link
                href="/admin/blog/yeni"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#223d26]/10 py-2.5 text-xs font-bold text-[#223d26] hover:bg-[#223d26] hover:text-white transition"
              >
                <Plus size={14} className="stroke-[2.5]" />
                Yeni Makale Yaz
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="w-24">
      <span
        className={`text-sm font-black ${
          value >= 80
            ? "text-[#1f7a68]"
            : value >= 55
            ? "text-amber-600"
            : "text-red-600"
        }`}
      >
        {value}/100
      </span>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            value >= 80
              ? "bg-[#1f7a68]"
              : value >= 55
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function scoreBlogSeo(post: {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  metaTitle: string | null;
  metaDescription: string | null;
}) {
  let score = 15;
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  if (title.length >= 30 && title.length <= 70) score += 20;
  if (description.length >= 90 && description.length <= 165) score += 25;
  if (post.slug.length >= 5 && post.slug.length <= 80) score += 15;
  if (post.body.length >= 600) score += 15;
  if (post.coverImage) score += 10;
  return Math.min(score, 100);
}
