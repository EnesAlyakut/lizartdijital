"use client";

import { useState } from "react";
import { createBlogCategory, deleteBlogCategory } from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";
import { FolderPlus, Tag, Sparkles } from "lucide-react";

export function BlogCategoryCreateForm({
  redirectTo = "/admin/kategoriler",
  existingCategories = [],
}: {
  redirectTo?: string;
  existingCategories?: { id: string; name: string; slug: string; _count?: { posts: number } }[];
} = {}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  function slugify(text: string) {
    const trMap: Record<string, string> = {
      ç: "c",
      Ç: "c",
      ğ: "g",
      Ğ: "g",
      ı: "i",
      İ: "i",
      ö: "o",
      Ö: "o",
      ş: "s",
      Ş: "s",
      ü: "u",
      Ü: "u",
    };
    return text
      .split("")
      .map((char) => trMap[char] || char)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
  }

  function handleNameChange(val: string) {
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  }

  const suggestions = [
    { label: "Web Tasarım", emoji: "🎨", full: "Web Tasarım & UI/UX" },
    { label: "E-Ticaret", emoji: "🛍️", full: "E-Ticaret Stratejileri" },
    { label: "SEO & Arama Motoru", emoji: "🚀", full: "SEO & Arama Motoru" },
    { label: "Mobil Uygulama", emoji: "📱", full: "Mobil Uygulama Geliştirme" },
    { label: "Yapay Zeka", emoji: "🤖", full: "Yapay Zeka & Otomasyon" },
    { label: "Dijital Pazarlama", emoji: "📈", full: "Dijital Pazarlama & Büyüme" },
    { label: "SaaS & Girişimcilik", emoji: "⚡", full: "SaaS & Girişimcilik" },
    { label: "Yazılım Mimarisi", emoji: "💻", full: "Yazılım & Altyapı" },
  ];

  return (
    <AdminForm
      action={createBlogCategory}
      submitLabel="Kategoriyi Oluştur"
      redirectTo={redirectTo}
      cancelHref={redirectTo}
      className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-50px_rgb(15_23_42/.4)] lg:p-10"
    >
      {/* ─── Üst Başlık & Açıklama ─── */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
          <Sparkles size={14} className="stroke-[2.5]" />
          Kategori Yönetim Stüdyosu
        </span>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Yeni Blog Kategorisi Oluştur
        </h2>
        <p className="mt-1 text-sm font-bold text-slate-600">
          Makalelerinizi konularına göre gruplandırarak ziyaretçilerinizin aradıklarını kolayca bulmasını sağlayın.
        </p>
      </div>

      {/* ─── 2 Sütunlu Dengeli ve Şık Grid ─── */}
      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
        {/* ─── SOL KOLON: Form Girişleri & Hızlı Öneriler ─── */}
        <div className="space-y-6">
          {/* Kategori Adı Girişi */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label
                htmlFor="cat-name"
                className="flex items-center gap-2 text-sm font-black text-slate-950"
              >
                <Tag size={16} className="text-[#1f7a68]" />
                Kategori Adı <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-bold text-slate-400">
                {name.length}/60 karakter
              </span>
            </div>
            <input
              id="cat-name"
              name="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Örn: E-Ticaret ve Dijital Satış"
              required
              maxLength={60}
              className="mt-2.5 h-13 w-full rounded-xl border border-slate-200 bg-white px-4 text-base font-black text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none"
            />
          </div>

          {/* URL Slug Girişi */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label
                htmlFor="cat-slug"
                className="block text-sm font-black text-slate-950"
              >
                Kalıcı Bağlantı (URL Slug) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setSlug(slugify(name))}
                className="text-xs font-black text-[#1f7a68] hover:underline"
              >
                İsimden Otomatik Üret ↺
              </button>
            </div>
            <div className="mt-2.5 flex items-center rounded-xl border border-slate-200 bg-white px-3.5 focus-within:border-[#1f7a68] transition">
              <span className="font-mono text-xs font-black text-[#1f7a68]">
                /blog?kategori=
              </span>
              <input
                id="cat-slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e-ticaret-ve-dijital-satis"
                required
                className="h-11 w-full min-w-0 bg-transparent px-2 font-mono text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400"
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-slate-500">
              Arama motorlarında ve web adresinde görünecek bağlantı uzantısıdır.
            </p>
          </div>

          {/* Hızlı İlham & Öneri Şablonları */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#1f7a68]" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Hızlı Kategori Şablonları (Tek Tıkla Seç)
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Sık kullanılan kategorilerden birine tıklayarak adı ve slug&apos;ı anında doldurabilirsiniz:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.full}
                  type="button"
                  onClick={() => {
                    setName(sug.full);
                    setSlug(slugify(sug.full));
                  }}
                  className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 shadow-2xs transition hover:border-[#1f7a68] hover:bg-emerald-50/60 hover:text-[#1f7a68]"
                >
                  <span>{sug.emoji}</span>
                  <span>{sug.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SAĞ KOLON: Canlı Önizleme & Mevcut Durum ─── */}
        <div className="space-y-6">
          {/* Canlı Kategori Kartı Önizlemesi */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#1f7a68]">
                Canlı Önizleme
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Sitede Böyle Görünecek
              </span>
            </div>

            {/* Blog Filtre Butonu Olarak Görünüm */}
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1. Blog Filtre Hapı
              </span>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-[#1f7a68] px-4 py-2.5 text-sm font-black text-white shadow-sm">
                  <span>{name || "Yeni Kategori Adı"}</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                    0
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700">
                  <span>Tümü</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                    6
                  </span>
                </div>
              </div>
            </div>

            {/* URL ve Arama Sonucu Görünümü */}
            <div className="mt-5 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                2. Canlı Web Adresi (URL)
              </span>
              <p className="mt-1 font-mono text-xs font-black text-[#1f7a68] break-all">
                https://lizartdijital.com/blog?kategori={slug || "kategori-slug"}
              </p>
            </div>
          </div>

          {/* Mevcut Kategoriler Listesi (Bilgilendirme) */}
          {existingCategories.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Mevcut Kategoriler ({existingCategories.length})
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Mükerrer eklemeyi önleyin
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {existingCategories.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700"
                  >
                    <span>{c.name}</span>
                    <span className="rounded-full bg-slate-200/80 px-1.5 text-[10px] font-black text-slate-600">
                      {c._count?.posts ?? 0}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminForm>
  );
}

export function BlogCategoryRowActions({
  categoryId,
  postCount,
}: {
  categoryId: string;
  postCount: number;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      <ActionButton
        action={() => deleteBlogCategory(categoryId)}
        label="Sil"
        size="sm"
        variant="danger"
        confirmText={
          postCount > 0
            ? `Bu kategoride ${postCount} adet yazı bulunuyor. Silmek istediğinize emin misiniz?`
            : "Bu blog kategorisini silmek istediğinizden emin misiniz?"
        }
      />
    </div>
  );
}
