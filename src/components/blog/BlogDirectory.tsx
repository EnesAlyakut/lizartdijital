"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, LibraryBig, Search, Sparkles, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

type PostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  authorName: string;
  authorTitle: string | null;
  readMinutes: number;
  publishedAt: Date;
  category: {
    id: string;
    slug: string;
    name: string;
  };
};

type CategoryItem = {
  id: string;
  slug: string;
  name: string;
  _count: {
    posts: number;
  };
};

export function BlogDirectory({
  posts,
  categories,
  initialCategory,
}: {
  posts: PostItem[];
  categories: CategoryItem[];
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category.slug === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // İlk yazı "Öne Çıkan" vitrin yazısı olarak ayrılır (eğer arama yapılmıyorsa ve en az 2 yazı varsa)
  const featuredPost = searchQuery === "" && selectedCategory === "all" ? filteredPosts[0] : null;
  const standardPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div className="mt-8 space-y-12">
      {/* Öne Çıkan Yazı Vitrini (Hero Magazine Card) */}
      {featuredPost && (
        <article className="group relative overflow-hidden rounded-[2.5rem] border border-ink-100 bg-surface shadow-sm transition-all duration-300 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/10 lg:grid lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-50 lg:col-span-7 lg:h-full lg:min-h-[380px]">
            <Image
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute left-5 top-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-1 text-xs font-bold text-ink-950 shadow-md">
                <Sparkles className="size-3.5" />
                Öne Çıkan Rehber
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2.5 text-xs">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                  {featuredPost.category.name}
                </span>
                <span className="flex items-center gap-1 text-ink-500">
                  <Clock3 className="size-3.5" />
                  {featuredPost.readMinutes} dk okuma
                </span>
              </div>

              <h2 className="mt-4 font-serif text-2xl font-medium tracking-tight text-ink-950 transition-colors group-hover:text-brand-700 sm:text-3xl">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-600 line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-ink-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800 text-sm">
                  {featuredPost.authorName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{featuredPost.authorName}</p>
                  <p className="text-xs text-ink-400">{formatDate(featuredPost.publishedAt)}</p>
                </div>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-transform group-hover:translate-x-1"
              >
                Yazıyı Oku <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Arama ve Kategori Filtreleri Barı */}
      <div className="flex flex-col gap-5 border-y border-ink-100 py-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Kategori Butonları */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-ink-900 text-white shadow-sm"
                : "border border-ink-200 bg-surface text-ink-700 hover:border-brand-400 hover:text-brand-700"
            }`}
          >
            Tüm Yazılar ({posts.length})
          </button>
          {categories.map((c) => {
            const active = selectedCategory === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                    : "border border-ink-200 bg-surface text-ink-700 hover:border-brand-400 hover:text-brand-700"
                }`}
              >
                {c.name} <span className="opacity-70 text-xs">({c._count.posts})</span>
              </button>
            );
          })}
        </div>

        {/* Canlı Arama Input */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Makale veya konu arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-2xl border border-ink-200 bg-surface pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
          <Search className="absolute left-3.5 top-3.5 size-4 text-ink-400" />
        </div>
      </div>

      {/* Yazı Kartları Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {standardPosts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-ink-100 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10"
          >
            <div>
              {/* Kapak Görseli */}
              <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-50">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-ink-950/85 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                    {post.category.name}
                  </span>
                </div>
              </Link>

              {/* İçerik */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-ink-400">
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3.5" />
                    {post.readMinutes} dk okuma
                  </span>
                  <span>·</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink-900 group-hover:text-brand-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-ink-600 line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Alt Bilgi & Devamını Oku */}
            <div className="flex items-center justify-between border-t border-ink-100 p-6 pt-4 text-xs">
              <div className="flex items-center gap-1.5 text-ink-600 font-medium">
                <User className="size-3.5 text-ink-400" />
                <span>{post.authorName}</span>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 font-bold text-brand-700 transition-transform group-hover:translate-x-1"
              >
                Devamını Oku <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Sonuç Yok Durumu */}
      {filteredPosts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-ink-200 bg-surface-2 p-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <LibraryBig className="size-6" />
          </span>
          <p className="mt-4 text-lg font-bold text-ink-900">Aradığınız kriterde yazı bulunamadı</p>
          <p className="mt-1 text-sm text-ink-500">
            Farklı bir arama terimi deneyebilir veya kategorileri sıfırlayabilirsiniz.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-5 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
          >
            Tüm Yazıları Göster
          </button>
        </div>
      )}
    </div>
  );
}
