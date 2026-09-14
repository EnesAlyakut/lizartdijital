"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  HelpCircle,
  Plus,
  Search,
  Edit3,
  ExternalLink,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Clock3,
  X,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Filter,
} from "lucide-react";
import {
  createPage,
  updatePage,
  deletePage,
  createFaq,
  updateFaq,
  deleteFaq,
} from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

type PageItem = {
  id: string;
  slug: string;
  title: string;
  body: string;
  group: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: Date | string;
};

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

type CategoryOption = {
  key: string;
  label: string;
};

export function PageAndFaqManager({
  pages,
  faqs,
  faqCategories,
}: {
  pages: PageItem[];
  faqs: FaqItem[];
  faqCategories: readonly CategoryOption[];
}) {
  const [activeTab, setActiveTab] = useState<"pages" | "faqs">("pages");

  // Sayfalar filtreleme & arama
  const [pageSearch, setPageSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // SSS filtreleme & arama
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modallar
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);

  const [isCreatingFaq, setIsCreatingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // Kopyalama bildirimi
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  function handleCopy(slug: string) {
    navigator.clipboard.writeText(`/kurumsal/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }

  // Filtrelenmiş Sayfalar
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchSearch =
        pageSearch.trim() === "" ||
        p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(pageSearch.toLowerCase()) ||
        p.body.toLowerCase().includes(pageSearch.toLowerCase());

      const matchGroup =
        selectedGroup === "all" || p.group === selectedGroup;

      return matchSearch && matchGroup;
    });
  }, [pages, pageSearch, selectedGroup]);

  // Filtrelenmiş SSS
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch =
        faqSearch.trim() === "" ||
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || f.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [faqs, faqSearch, selectedCategory]);

  // Sayfa grup sayıları
  const yasalCount = pages.filter((p) => p.group === "yasal").length;
  const kurumsalCount = pages.filter((p) => p.group === "kurumsal").length;
  const destekCount = pages.filter((p) => p.group === "destek").length;

  return (
    <div className="space-y-8">
      {/* ─── 1. ÜST HERO & SEKMELER ─── */}
      <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)] lg:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              <ShieldCheck size={14} className="stroke-[2.5]" />
              Kurumsal & Yasal Dokümantasyon
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Sayfalar ve SSS Yönetimi
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-600">
              Yasal sözleşmeler, kurumsal sayfalar ve sıkça sorulan soruları tek merkezden kolayca düzenleyin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "pages" ? (
              <Link
                href="/admin/sayfalar/yeni"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1f7a68] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#176956]"
              >
                <Plus size={18} className="stroke-[3]" />
                Yeni Sayfa Ekle
              </Link>
            ) : (
              <Link
                href="/admin/sayfalar/sss/yeni"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1f7a68] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#176956]"
              >
                <Plus size={18} className="stroke-[3]" />
                Yeni SSS Sorusu Ekle
              </Link>
            )}
          </div>
        </div>

        {/* Sekme Butonları */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={`inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeTab === "pages"
                ? "bg-[#1f7a68] text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <FileText size={17} />
            <span>Kurumsal & Yasal Sayfalar</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-black ${
                activeTab === "pages"
                  ? "bg-white text-[#1f7a68]"
                  : "bg-white text-slate-800 border border-slate-200"
              }`}
            >
              {pages.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faqs")}
            className={`inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeTab === "faqs"
                ? "bg-[#1f7a68] text-white shadow-sm"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <HelpCircle size={17} />
            <span>Sıkça Sorulan Sorular (SSS)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-black ${
                activeTab === "faqs"
                  ? "bg-white text-[#1f7a68]"
                  : "bg-white text-slate-800 border border-slate-200"
              }`}
            >
              {faqs.length}
            </span>
          </button>
        </div>
      </section>

      {/* ─── 2. SAYFALAR SEKMESİ ─── */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          {/* İstatistikler & Filtreleme */}
          <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Arama Inputu */}
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  placeholder="Sayfa başlığı, slug veya içerikte ara..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:bg-white focus:outline-none transition"
                />
                {pageSearch && (
                  <button
                    type="button"
                    onClick={() => setPageSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Grup Filtre Butonları */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: "all", label: "Tümü", count: pages.length },
                  { key: "yasal", label: "Yasal Metinler", count: yasalCount },
                  { key: "kurumsal", label: "Kurumsal", count: kurumsalCount },
                  { key: "destek", label: "Destek", count: destekCount },
                ].map((grp) => (
                  <button
                    key={grp.key}
                    type="button"
                    onClick={() => setSelectedGroup(grp.key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition ${
                      selectedGroup === grp.key
                        ? "bg-slate-900 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{grp.label}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        selectedGroup === grp.key
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {grp.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Sayfalar Tablosu */}
          <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Kayıtlı Sayfalar
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {filteredPages.length} sayfa listeleniyor
                </p>
              </div>
              <Link
                href="/admin/sayfalar/yeni"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3.5 py-2 text-xs font-black text-white hover:bg-[#176956] transition"
              >
                <Plus size={14} className="stroke-[3]" />
                Yeni Sayfa Ekle
              </Link>
            </div>

            {filteredPages.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-black text-slate-800">
                  Aradığınız kriterlere uygun sayfa bulunamadı.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPageSearch("");
                    setSelectedGroup("all");
                  }}
                  className="mt-3 text-xs font-black text-[#1f7a68] hover:underline"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-6 py-4">Sayfa Başlığı</th>
                      <th className="px-6 py-4">Kalıcı Bağlantı (Slug)</th>
                      <th className="px-6 py-4">Grup</th>
                      <th className="px-6 py-4">Son Güncelleme</th>
                      <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPages.map((p) => {
                      const groupStyles: Record<string, string> = {
                        yasal: "bg-emerald-100 text-emerald-900 border-emerald-200",
                        kurumsal: "bg-blue-100 text-blue-900 border-blue-200",
                        destek: "bg-purple-100 text-purple-900 border-purple-200",
                      };

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                                <FileText size={18} />
                              </div>
                              <div>
                                <p className="font-black text-slate-950 text-base">
                                  {p.title}
                                </p>
                                {p.metaTitle && (
                                  <p className="text-xs font-medium text-slate-500 line-clamp-1">
                                    SEO: {p.metaTitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-800">
                                /kurumsal/{p.slug}
                              </code>
                              <button
                                type="button"
                                onClick={() => handleCopy(p.slug)}
                                title="Bağlantıyı Kopyala"
                                className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                              >
                                {copiedSlug === p.slug ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-block rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                                groupStyles[p.group] ||
                                "bg-slate-100 text-slate-800 border-slate-200"
                              }`}
                            >
                              {p.group}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-xs font-bold text-slate-600">
                            {formatDate(p.updatedAt)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/kurumsal/${p.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-50 transition"
                              >
                                <ExternalLink size={13} />
                                Görüntüle
                              </Link>
                              <button
                                type="button"
                                onClick={() => setEditingPage(p)}
                                className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-800 hover:bg-[#1f7a68] hover:text-white transition"
                              >
                                <Edit3 size={13} />
                                Düzenle
                              </button>
                              <ActionButton
                                action={() => deletePage(p.id)}
                                label="Sil"
                                variant="danger"
                                confirmText={`"${p.title}" sayfasını silmek istediğinizden emin misiniz?`}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Hukuki Uyarı Kutusu */}
          <div className="flex items-start gap-4 rounded-[2rem] border border-amber-200 bg-amber-50/70 p-6 shadow-sm">
            <AlertCircle size={24} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-black text-amber-950">
                Hukuki Metinler ve Sorumluluk Hatırlatması
              </h3>
              <p className="mt-1 text-xs font-bold leading-relaxed text-amber-800">
                Yasal metinler ve sözleşmeler bilgilendirme amaçlı şablon
                niteliklerdir. Şirketinizin gerçek faaliyet alanına, ödeme
                altyapısına ve KVKK/GDPR gerekliliklerine göre yayına almadan önce
                hukuk müşaviriniz veya avukatınız tarafından onaylanmalıdır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. SSS SEKMESİ ─── */}
      {activeTab === "faqs" && (
        <div className="space-y-6">
          {/* SSS Filtreleme Barı */}
          <section className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* SSS Arama */}
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Soru veya cevap metninde anında ara..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:border-[#1f7a68] focus:bg-white focus:outline-none transition"
                />
                {faqSearch && (
                  <button
                    type="button"
                    onClick={() => setFaqSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Kategori Seçici */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
              >
                <option value="all">Tüm Kategoriler ({faqs.length})</option>
                {faqCategories.map((c) => {
                  const count = faqs.filter((f) => f.category === c.key).length;
                  return (
                    <option key={c.key} value={c.key}>
                      {c.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>
          </section>

          {/* SSS Listesi Kartları */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black text-slate-950">
                Sıkça Sorulan Sorular ({filteredFaqs.length})
              </h2>
              <Link
                href="/admin/sayfalar/sss/yeni"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-4 py-2 text-xs font-black text-white hover:bg-[#176956] transition"
              >
                <Plus size={14} className="stroke-[3]" />
                Yeni Soru Ekle
              </Link>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-12 text-center">
                <HelpCircle size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm font-black text-slate-800">
                  Aradığınız kriterlere uygun soru bulunamadı.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFaqSearch("");
                    setSelectedCategory("all");
                  }}
                  className="mt-3 text-xs font-black text-[#1f7a68] hover:underline"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredFaqs.map((f) => {
                  const catLabel =
                    faqCategories.find((c) => c.key === f.category)?.label ||
                    f.category;

                  return (
                    <div
                      key={f.id}
                      className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:border-[#1f7a68]/40 hover:shadow-md transition"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3 py-0.5 text-xs font-black text-[#1f7a68]">
                              {catLabel}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              Sıra: {f.sortOrder}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-slate-950">
                            {f.question}
                          </h3>
                          <p className="text-sm font-bold leading-relaxed text-slate-600">
                            {f.answer}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => setEditingFaq(f)}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-800 hover:bg-[#1f7a68] hover:text-white transition"
                          >
                            <Edit3 size={13} />
                            Düzenle
                          </button>
                          <ActionButton
                            action={() => deleteFaq(f.id)}
                            label="Sil"
                            variant="danger"
                            confirmText="Bu SSS sorusunu silmek istediğinizden emin misiniz?"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL: YENİ SAYFA OLUŞTUR ─── */}
      {isCreatingPage && (
        <PageModal
          title="Yeni Sayfa Oluştur"
          onClose={() => setIsCreatingPage(false)}
          action={createPage}
          submitLabel="Sayfayı Oluştur"
        />
      )}

      {/* ─── MODAL: SAYFA DÜZENLE ─── */}
      {editingPage && (
        <PageModal
          title={`"${editingPage.title}" — Düzenle`}
          initialPage={editingPage}
          onClose={() => setEditingPage(null)}
          action={(formData) => updatePage(editingPage.id, formData)}
          submitLabel="Değişiklikleri Kaydet"
        />
      )}

      {/* ─── MODAL: YENİ SSS SORUSU EKLE ─── */}
      {isCreatingFaq && (
        <FaqModal
          title="Yeni SSS Sorusu Ekle"
          categories={faqCategories}
          onClose={() => setIsCreatingFaq(false)}
          action={createFaq}
          submitLabel="Soruyu Kaydet"
        />
      )}

      {/* ─── MODAL: SSS SORUSUNU DÜZENLE ─── */}
      {editingFaq && (
        <FaqModal
          title="SSS Sorusunu Düzenle"
          initialFaq={editingFaq}
          categories={faqCategories}
          onClose={() => setEditingFaq(null)}
          action={(formData) => updateFaq(editingFaq.id, formData)}
          submitLabel="Değişiklikleri Kaydet"
        />
      )}
    </div>
  );
}

/** Sayfa Ekleme / Düzenleme Modalı */
function PageModal({
  title,
  initialPage,
  onClose,
  action,
  submitLabel,
}: {
  title: string;
  initialPage?: PageItem;
  onClose: () => void;
  action: (formData: FormData) => Promise<any>;
  submitLabel: string;
}) {
  const [pageTitle, setPageTitle] = useState(initialPage?.title ?? "");
  const [slug, setSlug] = useState(initialPage?.slug ?? "");
  const [group, setGroup] = useState(initialPage?.group ?? "yasal");
  const [body, setBody] = useState(
    initialPage?.body ??
      "## 1. Genel Bilgilendirme\n\nBu sözleşme veya metin şirketimizin yasal yükümlülüklerini kapsar.\n\n## 2. Şartlar ve Koşullar\n\n- Birinci madde detayları\n- İkinci madde detayları"
  );
  const [metaTitle, setMetaTitle] = useState(initialPage?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialPage?.metaDescription ?? ""
  );

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
      .slice(0, 100);
  }

  function handleTitleChange(val: string) {
    setPageTitle(val);
    if (!slug || slug === slugify(pageTitle)) {
      setSlug(slugify(val));
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-2xl lg:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[#1f7a68]" />
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        <AdminForm
          action={action}
          submitLabel={submitLabel}
          onSuccess={() => onClose()}
          className="mt-6 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-black text-slate-900">
                Sayfa Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={pageTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Gizlilik Politikası"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-bold text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-slate-900">
                Kalıcı Bağlantı (URL Slug) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-[#1f7a68] focus-within:bg-white">
                <span className="font-mono text-xs text-slate-400">/kurumsal/</span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="gizlilik-politikasi"
                  required
                  className="h-11 w-full min-w-0 bg-transparent px-1 font-mono text-sm font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900">
              Grup / Kategori
            </label>
            <select
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
            >
              <option value="yasal">Yasal Metin (Sözleşme, KVKK, Çerez)</option>
              <option value="kurumsal">Kurumsal (Hakkımızda, Vizyon vb.)</option>
              <option value="destek">Destek ve Yardım Dokümanı</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-black text-slate-900">
                Sayfa İçeriği (Markdown) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-bold text-slate-400">
                Basit Markdown biçimlendirme desteklenir
              </span>
            </div>
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              required
              className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm font-medium leading-relaxed text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                SEO Meta Title (Opsiyonel)
              </label>
              <input
                name="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Arama motoru başlığı..."
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-[#1f7a68] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                SEO Meta Açıklama (Opsiyonel)
              </label>
              <input
                name="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Arama motoru açıklaması..."
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-900 focus:border-[#1f7a68] outline-none"
              />
            </div>
          </div>
        </AdminForm>
      </div>
    </div>
  );
}

/** SSS Ekleme / Düzenleme Modalı */
function FaqModal({
  title,
  initialFaq,
  categories,
  onClose,
  action,
  submitLabel,
}: {
  title: string;
  initialFaq?: FaqItem;
  categories: readonly CategoryOption[];
  onClose: () => void;
  action: (formData: FormData) => Promise<any>;
  submitLabel: string;
}) {
  const [question, setQuestion] = useState(initialFaq?.question ?? "");
  const [answer, setAnswer] = useState(initialFaq?.answer ?? "");
  const [category, setCategory] = useState(
    initialFaq?.category ?? (categories[0]?.key || "satin-alma")
  );
  const [sortOrder, setSortOrder] = useState(initialFaq?.sortOrder ?? 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-2xl lg:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-[#1f7a68]" />
            <h2 className="text-xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        <AdminForm
          action={action}
          submitLabel={submitLabel}
          onSuccess={() => onClose()}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-black text-slate-900">
              Soru Metni <span className="text-red-500">*</span>
            </label>
            <input
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Örn: Ürünü satın aldıktan sonra ne oluyor?"
              required
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-bold text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-black text-slate-900">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-black text-slate-900">
                Sıralama Önceliği (Sıra No)
              </label>
              <input
                type="number"
                name="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                min={0}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-950 focus:border-[#1f7a68] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900">
              Cevap Metni <span className="text-red-500">*</span>
            </label>
            <textarea
              name="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Müşteriye gösterilecek net ve anlaşılır yanıt..."
              required
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold leading-relaxed text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
            />
          </div>
        </AdminForm>
      </div>
    </div>
  );
}

/** Ayrı Tam Sayfa: Sayfa Oluşturma & Düzenleme Stüdyosu */
export function PageFormStudio({
  initialPage,
  redirectTo = "/admin/sayfalar",
}: {
  initialPage?: PageItem;
  redirectTo?: string;
}) {
  const [pageTitle, setPageTitle] = useState(initialPage?.title ?? "");
  const [slug, setSlug] = useState(initialPage?.slug ?? "");
  const [group, setGroup] = useState(initialPage?.group ?? "yasal");
  const [body, setBody] = useState(
    initialPage?.body ??
      "## 1. Genel Bilgilendirme\n\nBu sözleşme veya metin şirketimizin yasal yükümlülüklerini kapsar.\n\n## 2. Şartlar ve Koşullar\n\n- Birinci madde detayları\n- İkinci madde detayları"
  );
  const [metaTitle, setMetaTitle] = useState(initialPage?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialPage?.metaDescription ?? ""
  );

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
      .slice(0, 100);
  }

  function handleTitleChange(val: string) {
    setPageTitle(val);
    if (!slug || slug === slugify(pageTitle)) {
      setSlug(slugify(val));
    }
  }

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="border-b border-slate-100 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
          <FileText size={14} className="stroke-[2.5]" />
          Sayfa Editörü
        </span>
        <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
          {initialPage ? `"${initialPage.title}" — Düzenle` : "Yeni Sayfa Oluştur"}
        </h2>
        <p className="mt-1 text-sm font-bold text-slate-600">
          Yasal metin, kurumsal sayfa veya destek dokümanı içeriğini ve arama motoru etiketlerini belirleyin.
        </p>
      </div>

      <AdminForm
        action={
          initialPage
            ? (formData) => updatePage(initialPage.id, formData)
            : createPage
        }
        submitLabel={initialPage ? "Değişiklikleri Kaydet" : "Sayfayı Oluştur"}
        redirectTo={redirectTo}
        className="mt-6 space-y-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-black text-slate-900">
              Sayfa Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={pageTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Örn: Açık Rıza Metni"
              required
              className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-black text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900">
              Kalıcı Bağlantı (URL Slug) <span className="text-red-500">*</span>
            </label>
            <div className="mt-1.5 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-[#1f7a68] focus-within:bg-white transition">
              <span className="font-mono text-xs font-bold text-slate-500">/kurumsal/</span>
              <input
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="acik-riza-metni"
                required
                className="h-12 w-full min-w-0 bg-transparent px-1 font-mono text-sm font-bold text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900">
            Grup / Kategori
          </label>
          <select
            name="group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
          >
            <option value="yasal">Yasal Metin (Sözleşme, KVKK, Çerez)</option>
            <option value="kurumsal">Kurumsal (Hakkımızda, Vizyon vb.)</option>
            <option value="destek">Destek ve Yardım Dokümanı</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-black text-slate-900">
              Sayfa İçeriği (Markdown) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-bold text-slate-400">
              Başlıklar için ##, listeler için - kullanabilirsiniz
            </span>
          </div>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            required
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm font-medium leading-relaxed text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              SEO Meta Title (Opsiyonel)
            </label>
            <input
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Arama motoru başlığı..."
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-900 focus:border-[#1f7a68] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
              SEO Meta Açıklama (Opsiyonel)
            </label>
            <input
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Arama motoru açıklaması..."
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-900 focus:border-[#1f7a68] outline-none"
            />
          </div>
        </div>
      </AdminForm>
    </div>
  );
}

/** Ayrı Tam Sayfa: SSS Oluşturma & Düzenleme Stüdyosu */
export function FaqFormStudio({
  initialFaq,
  categories,
  redirectTo = "/admin/sayfalar",
}: {
  initialFaq?: FaqItem;
  categories: readonly CategoryOption[];
  redirectTo?: string;
}) {
  const [question, setQuestion] = useState(initialFaq?.question ?? "");
  const [answer, setAnswer] = useState(initialFaq?.answer ?? "");
  const [category, setCategory] = useState(
    initialFaq?.category ?? (categories[0]?.key || "satin-alma")
  );
  const [sortOrder, setSortOrder] = useState(initialFaq?.sortOrder ?? 0);

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="border-b border-slate-100 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
          <HelpCircle size={14} className="stroke-[2.5]" />
          SSS Editörü
        </span>
        <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
          {initialFaq ? "SSS Sorusunu Düzenle" : "Yeni SSS Sorusu Ekle"}
        </h2>
        <p className="mt-1 text-sm font-bold text-slate-600">
          Müşterilerinizin sık sorduğu soruları ve yanıtlarını kategoriye göre düzenleyin.
        </p>
      </div>

      <AdminForm
        action={
          initialFaq
            ? (formData) => updateFaq(initialFaq.id, formData)
            : createFaq
        }
        submitLabel={initialFaq ? "Değişiklikleri Kaydet" : "Soruyu Kaydet"}
        redirectTo={redirectTo}
        className="mt-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-black text-slate-900">
            Soru Metni <span className="text-red-500">*</span>
          </label>
          <input
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Örn: Satın aldıktan sonra destek süreci nasıl işler?"
            required
            className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-black text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-black text-slate-900">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-900 focus:border-[#1f7a68] outline-none"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-900">
              Sıralama Önceliği (Sıra No)
            </label>
            <input
              type="number"
              name="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              min={0}
              className="mt-1.5 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 focus:border-[#1f7a68] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-slate-900">
            Cevap Metni <span className="text-red-500">*</span>
          </label>
          <textarea
            name="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            placeholder="Müşteriye gösterilecek açıklayıcı yanıt metni..."
            required
            className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-relaxed text-slate-950 focus:border-[#1f7a68] focus:bg-white focus:outline-none"
          />
        </div>
      </AdminForm>
    </div>
  );
}
