"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createService, updateService, deleteService } from "@/lib/actions/admin";
import { ActionButton } from "@/components/admin/ui";
import { TransitionSlider } from "@/components/ui/TransitionSlider";
import type { Service } from "@/lib/data/services";
import {
  BriefcaseBusiness,
  ExternalLink,
  Sparkles,
  Trash2,
  CheckCircle2,
  Monitor,
  UploadCloud,
  RefreshCw,
  X,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
  Layers,
  Check,
  Tag,
  ListOrdered,
  FileText,
  DollarSign,
  ArrowUpRight,
  Eye,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Kategori Listesi
const SERVICE_CATEGORIES = [
  { value: "web", label: "Web & E-Ticaret" },
  { value: "yazilim", label: "Mobil & Özel Yazılım" },
  { value: "buyume", label: "SEO & Organik Büyüme" },
  { value: "pazarlama", label: "Dijital Reklam & Sosyal Medya" },
  { value: "tasarim", label: "Marka, Tasarım & Prodüksiyon" },
];

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

export function ServiceForm({
  service,
  isEditing = false,
  redirectTo = "/admin/hizmetler",
}: {
  service?: Service | null;
  isEditing?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();

  // Form States
  const [title, setTitle] = useState(service?.title || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [category, setCategory] = useState(service?.category || "web");
  const [badge, setBadge] = useState(service?.badge || "Popüler Hizmet");
  const [price, setPrice] = useState(service?.packages?.[0]?.price || "4.500 ₺'den başlayan");
  const [summary, setSummary] = useState(service?.summary || "");
  const [hero, setHero] = useState(service?.hero || "");
  const [metaTitle, setMetaTitle] = useState(service?.metaTitle || "");

  // Main Image State
  const [mainImage, setMainImage] = useState(
    service?.image || "/gorseller/ajans/hizmet-web.svg"
  );
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isMainUploading, setIsMainUploading] = useState(false);
  const [mainUploadError, setMainUploadError] = useState<string | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  // Gallery Images State
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (service?.gallery && Array.isArray(service.gallery)) {
      return service.gallery;
    }
    return [];
  });
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Benefits & Process
  const initialBenefits = service?.benefits
    ? service.benefits.map((b) => `${b.title}: ${b.body || ""}`).join("\n")
    : "Aynı Hafta Yayında: Standart süreçler ortalama 3-5 iş günü içinde tamamlanır.\nKurumsal Kimlik Uyumu: Renk, logo ve tipografi markanıza özel tasarlanır.\nSözleşmeli & Garantili: Teslimat sonrası teknik destek ve garanti dahildir.";

  const initialProcess = service?.process
    ? service.process.join("\n")
    : "1. Keşif ve İhtiyaç Analizi: İşletme gereksinimleri ve hedef kitle belirlenir.\n2. Tasarım & Mimari Planlama: Mobil uyumlu arayüz ve sistem şeması hazırlanır.\n3. Geliştirme & Entegrasyonlar: Temiz kod ve güvenlik testleriyle inşa edilir.\n4. Test ve Yayına Alma: Domain, SSL ve sunucu bağlantısıyla canlıya alınır.";

  const [benefits, setBenefits] = useState(initialBenefits);
  const [processSteps, setProcessSteps] = useState(initialProcess);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEditing && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
    if (!metaTitle || metaTitle === `${title} | Lizart Ajans`) {
      setMetaTitle(`${val} | Lizart Ajans`);
    }
  }

  // Upload single main image
  async function handleMainFileUpload(file: File) {
    if (!file) return;
    setMainUploadError(null);
    setIsMainUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) setMainImage(result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        setMainImage(data.url);
      } else if (data.error) {
        setMainUploadError(data.error);
      }
    } catch {
      // Keep local preview
    } finally {
      setIsMainUploading(false);
    }
  }

  // Upload multiple gallery images
  async function handleGalleryFilesUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setGalleryUploadError(null);
    setIsGalleryUploading(true);

    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.ok && data.url) {
          newUrls.push(data.url);
        }
      } catch {
        // continue
      }
    }

    if (newUrls.length > 0) {
      setGalleryImages((prev) => [...prev, ...newUrls]);
    } else {
      setGalleryUploadError("Görseller yüklenirken bir sorun oluştu.");
    }
    setIsGalleryUploading(false);
  }

  function removeGalleryImage(indexToRemove: number) {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function addGalleryUrl(url: string) {
    const trimmed = url.trim();
    if (trimmed && !galleryImages.includes(trimmed)) {
      setGalleryImages((prev) => [...prev, trimmed]);
    }
  }

  // Submit Handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("category", category);
    formData.append("badge", badge);
    formData.append("price", price);
    formData.append("summary", summary);
    formData.append("hero", hero);
    formData.append("metaTitle", metaTitle || `${title} | Lizart Ajans`);
    formData.append("mainImage", mainImage);
    formData.append("galleryImages", galleryImages.join("\n"));
    formData.append("benefits", benefits);
    formData.append("process", processSteps);

    try {
      const result = isEditing && service
        ? await updateService(service.slug, formData)
        : await createService(formData);

      if (result.ok) {
        setFormSuccess(result.message || "İşlem başarıyla kaydedildi!");
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 800);
      } else {
        setFormError(result.error || "Hata oluştu.");
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Bir hata meydana geldi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Preset Templates
  const templates = [
    {
      title: "Google Ads & PPC Reklam Yönetimi",
      price: "6.500 ₺/ay",
      category: "pazarlama",
      badge: "Yüksek Dönüşüm",
      image: "/gorseller/ajans/surec.svg",
      summary: "Arama ve görüntülü reklam ağlarında yüksek dönüşümlü profesyonel reklam yönetimi.",
      hero: "Doğru anahtar kelimeler ve optimize edilmiş açılış sayfalarıyla reklam bütçenizi maksimum ciroya dönüştürün.",
    },
    {
      title: "Kurumsal Web Sitesi Yenileme (Redesign)",
      price: "18.000 ₺'den başlayan",
      category: "web",
      badge: "En Çok Tercih Edilen",
      image: "/gorseller/ajans/hizmet-web.svg",
      summary: "Mevcut web sitenizi modern kod mimarisi ve yüksek dönüşüm getiren arayüzle sıfırdan yenileyin.",
      hero: "Markanızın dijital vitrinini estetik, hızlı ve kullanıcı dostu arayüzlerle baştan tasarlayın.",
    },
    {
      title: "Mobil Uygulama Geliştirme (iOS & Android)",
      price: "45.000 ₺'den başlayan",
      category: "yazilim",
      badge: "Native Kalite",
      image: "/gorseller/ajans/hizmet-mobil.svg",
      summary: "İşletmeniz veya startup projeniz için App Store & Play Store uyumlu mobil uygulama geliştirme.",
      hero: "Kullanıcı deneyimi odaklı, yüksek hızlı ve güvenli mobil uygulamalarla müşterilerinize her an ulaşın.",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ─── 1. ÜST BAR: Durum, Navigasyon ve Kaydet Butonları ─── */}
      <div className="flex flex-col gap-4 rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={redirectTo}
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            title="Listeye Dön"
          >
            <ArrowLeft size={18} className="stroke-[2.5]" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
                <BriefcaseBusiness size={13} className="stroke-[2.5]" />
                {isEditing ? "Hizmeti Düzenle" : "Hizmet Stüdyosu"}
              </span>
              {isEditing && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                  /hizmetler/{service?.slug}
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {isEditing ? `"${service?.title}" Düzenle` : "Yeni Hizmet Oluştur"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEditing && service && (
            <>
              <Link
                href={`/hizmetler/${service.slug}`}
                target="_blank"
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68]"
              >
                <Eye size={14} />
                <span>Sitede Gör</span>
                <ExternalLink size={12} className="text-slate-400" />
              </Link>
              <ActionButton
                action={() => deleteService(service.slug)}
                label="Hizmeti Sil"
                variant="danger"
                confirmText={`"${service.title}" hizmetini kalıcı olarak silmek istediğinize emin misiniz?`}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1f7a68] px-6 text-sm font-black text-white shadow-md transition hover:bg-[#176956] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Kaydediliyor…
              </>
            ) : (
              <>
                <Check size={16} className="stroke-[3]" />
                {isEditing ? "Değişiklikleri Kaydet" : "Hizmeti Yayınla"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mesaj Bildirimleri */}
      {formSuccess && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm font-black text-emerald-900 shadow-sm animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {formError && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm font-black text-red-900 shadow-sm">
          <X size={20} className="text-red-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Hazır Şablonlar (Sadece Yeni Oluştururken) */}
      {!isEditing && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs font-bold text-slate-600">
          <span className="font-black text-slate-800">Hızlı Şablonlar:</span>
          {templates.map((tpl) => (
            <button
              key={tpl.title}
              type="button"
              onClick={() => {
                setTitle(tpl.title);
                setSlug(slugify(tpl.title));
                setPrice(tpl.price);
                setCategory(tpl.category);
                setBadge(tpl.badge);
                setMainImage(tpl.image);
                setSummary(tpl.summary);
                setHero(tpl.hero);
                setMetaTitle(`${tpl.title} | Lizart Ajans`);
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-emerald-50/30"
            >
              + {tpl.title.split("&")[0].trim()}
            </button>
          ))}
        </div>
      )}

      {/* ─── 2. FERAH 2 SÜTUNLU YAPI ─── */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── SOL SÜTUN: Bilgiler, Metinler ve Süreç (7 Kolon) ── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Kart 1: Temel Bilgiler */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag size={18} className="text-[#1f7a68]" />
              <h3 className="text-base font-black text-slate-950">
                Temel Hizmet Tanımı & Fiyatlandırma
              </h3>
            </div>

            <div>
              <label htmlFor="srv-title" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Hizmet Başlığı <span className="text-red-500">*</span>
              </label>
              <input
                id="srv-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: E-Ticaret Çözümleri & Sanal Mağaza Kurulumu"
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-base font-black text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none transition"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="srv-slug" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Kalıcı Bağlantı (Slug) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="text-[11px] font-black text-[#1f7a68] hover:underline"
                  >
                    Yenile ↺
                  </button>
                </div>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 focus-within:border-[#1f7a68] focus-within:bg-white transition">
                  <span className="font-mono text-xs font-bold text-slate-400">/hizmetler/</span>
                  <input
                    id="srv-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="hizmet-adi"
                    required
                    className="h-11 w-full min-w-0 bg-transparent px-1 font-mono text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="srv-price" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Başlangıç Fiyatı / Paket Ücreti
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 focus-within:border-[#1f7a68] focus-within:bg-white transition">
                  <DollarSign size={15} className="text-slate-400 shrink-0" />
                  <input
                    id="srv-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Örn: 4.500 ₺'den başlayan"
                    className="h-11 w-full min-w-0 bg-transparent px-2 text-sm font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="srv-category" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Hizmet Kategorisi
                </label>
                <select
                  id="srv-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-black text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none transition"
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="srv-badge" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Vitrin Rozeti (Badge)
                </label>
                <input
                  id="srv-badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Örn: En Çok Tercih Edilen, Yüksek ROI"
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Kart 2: Metinler & Açıklamalar */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={18} className="text-[#1f7a68]" />
              <h3 className="text-base font-black text-slate-950">
                Açıklama & Tanıtım Metinleri
              </h3>
            </div>

            <div>
              <label htmlFor="srv-summary" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Kısa Özet (Vitrin Kartları ve Listelerde Görünen Metin) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="srv-summary"
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Müşteriye ne sağladığını anlatan 1-2 cümlelik net özet..."
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-bold text-slate-950 focus:bg-white focus:border-[#1f7a68] focus:outline-none transition leading-relaxed"
              />
            </div>

            <div>
              <label htmlFor="srv-hero" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Detaylı Hero Açıklaması (Sayfa Başındaki Büyük Açıklama) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="srv-hero"
                rows={3}
                value={hero}
                onChange={(e) => setHero(e.target.value)}
                placeholder="Sayfanın en üstünde yer alacak derinlemesine vizyon, teslimat ve değer metni..."
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm font-bold text-slate-950 focus:bg-white focus:border-[#1f7a68] focus:outline-none transition leading-relaxed"
              />
            </div>

            <div>
              <label htmlFor="srv-meta" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                SEO Başlığı (Meta Title)
              </label>
              <input
                id="srv-meta"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Örn: E-Ticaret Paketleri ve Çözümleri | Lizart Ajans"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-bold text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none transition"
              />
            </div>
          </div>

          {/* Kart 3: Kapsam Maddeleri ve Süreç */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ListOrdered size={18} className="text-[#1f7a68]" />
              <h3 className="text-base font-black text-slate-950">
                Faydalar & Çalışma Süreci Adımları
              </h3>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="srv-benefits" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Faydalar & Avantajlar (Her satıra bir madde)
                </label>
                <span className="text-[11px] font-bold text-slate-400">Format: Başlık: Açıklama</span>
              </div>
              <textarea
                id="srv-benefits"
                rows={4}
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold leading-relaxed text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none font-mono transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="srv-process" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Çalışma Süreci Adımları (Her satıra bir adım)
                </label>
                <span className="text-[11px] font-bold text-slate-400">Format: 1. Başlık: Açıklama</span>
              </div>
              <textarea
                id="srv-process"
                rows={4}
                value={processSteps}
                onChange={(e) => setProcessSteps(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-bold leading-relaxed text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none font-mono transition"
              />
            </div>
          </div>
        </div>

        {/* ── SAĞ SÜTUN: Çoklu Görsel Yönetimi ve Mockup Vitrini (5 Kolon) ── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Kart 4: Ana Kapak Görseli ve Canlı Mockup Önizlemesi */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Monitor size={18} className="text-[#1f7a68]" />
                <h3 className="text-base font-black text-slate-950">Ana Kapak Görseli</h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                16:10 Formatı
              </span>
            </div>

            {/* Dosya Seçici ve URL */}
            <input
              type="file"
              ref={mainFileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMainFileUpload(file);
              }}
              className="hidden"
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={isMainUploading}
                onClick={() => mainFileInputRef.current?.click()}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1f7a68] px-3.5 text-xs font-black text-white shadow-xs hover:bg-[#176956] transition cursor-pointer disabled:opacity-60"
              >
                {isMainUploading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Yükleniyor…
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} />
                    Bilgisayardan Seç
                  </>
                )}
              </button>

              <div className="relative flex-1">
                <input
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="/gorseller/... veya görsel URL"
                  required
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] outline-none"
                />
              </div>

              {mainImage && (
                <button
                  type="button"
                  onClick={() => setMainImage("")}
                  title="Temizle"
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:border-red-200 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {mainUploadError && (
              <p className="text-xs font-bold text-red-500">{mainUploadError}</p>
            )}

            {/* Hızlı Seçim ve Sığdırma Kontrolleri */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Hızlı Seç:</span>
                <button
                  type="button"
                  onClick={() => setMainImage("/gorseller/ajans/hizmet-web.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Web
                </button>
                <button
                  type="button"
                  onClick={() => setMainImage("/gorseller/ajans/hizmet-eticaret.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  E-Ticaret
                </button>
                <button
                  type="button"
                  onClick={() => setMainImage("/gorseller/ajans/hizmet-mobil.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Mobil
                </button>
                <button
                  type="button"
                  onClick={() => setMainImage("/gorseller/ajans/hizmet-seo-analiz-1.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  SEO
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setFitMode("contain")}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-black transition",
                    fitMode === "contain"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  Sığdır
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode("cover")}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-black transition",
                    fitMode === "cover"
                      ? "bg-white text-slate-950 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  Kapsa
                </button>
              </div>
            </div>

            {/* Masaüstü Mockup Önizleme Kutusu */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200/80 px-3.5 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 max-w-xs mx-3 rounded-md bg-white/80 px-2.5 py-0.5 text-center font-mono text-[10px] text-slate-500 truncate">
                  https://lizartdijital.com/hizmetler/{slug || "yeni"}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {fitMode === "contain" ? "Oran Korundu" : "Kırpma"}
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full bg-slate-900/5">
                <TransitionSlider
                  images={[mainImage, ...galleryImages].filter(Boolean)}
                  alt={title || "Hizmet Görseli"}
                  aspectRatio="aspect-[16/10]"
                  objectFit={fitMode}
                  showDots={true}
                  showArrows={true}
                  showBadge={true}
                  autoSlide={[mainImage, ...galleryImages].filter(Boolean).length > 1}
                  slideInterval={3500}
                />
              </div>
            </div>
          </div>

          {/* Kart 5: Hizmet Galerisi (Çoklu Görsel Yükleme & Yönetimi) */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#1f7a68]" />
                <h3 className="text-base font-black text-slate-950">
                  Çoklu Görsel Galerisi ({galleryImages.length})
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-[#1f7a68]">
                Çoklu Yükleme
              </span>
            </div>

            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Bu hizmete ait detaylı ekran görüntüleri, portfolio örnekleri veya infografikleri galerisine ekleyin.
            </p>

            {/* Gizli Çoklu Dosya Seçici */}
            <input
              type="file"
              ref={galleryFileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={(e) => handleGalleryFilesUpload(e.target.files)}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isGalleryUploading}
                onClick={() => galleryFileInputRef.current?.click()}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black text-white shadow-sm hover:bg-slate-800 transition cursor-pointer disabled:opacity-60"
              >
                {isGalleryUploading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    Görseller Yükleniyor…
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} />
                    + Bilgisayardan Çoklu Görsel Ekle
                  </>
                )}
              </button>
            </div>

            {galleryUploadError && (
              <p className="text-xs font-bold text-red-500">{galleryUploadError}</p>
            )}

            {/* Yüklenen Galeri Görselleri Grid */}
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {galleryImages.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`Galeri ${idx + 1}`}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition"
                        title="Bu görseli sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur-xs">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <ImageIcon size={24} className="mx-auto text-slate-300" />
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Henüz galeri görseli eklenmedi.
                </p>
                <p className="text-[11px] text-slate-400">
                  Yukarıdaki butona tıklayarak bilgisayarınızdan aynı anda birden fazla görsel seçebilirsiniz.
                </p>
              </div>
            )}

            {/* Metin Alanından Hızlı URL Ekleme */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Veya Galeri URL&apos;lerini Satır Satır Girin:
              </label>
              <textarea
                rows={2}
                value={galleryImages.join("\n")}
                onChange={(e) => {
                  const lines = e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean);
                  setGalleryImages(lines);
                }}
                placeholder="/gorseller/galeri-1.jpg&#10;/gorseller/galeri-2.jpg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-mono text-xs font-bold text-slate-800 focus:bg-white focus:border-[#1f7a68] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

// Geriye dönük uyumluluk için alias
export function ServiceCreateForm({
  redirectTo = "/admin/hizmetler",
}: {
  redirectTo?: string;
} = {}) {
  return <ServiceForm redirectTo={redirectTo} />;
}

export function ServiceRowActions({ slug }: { slug: string }) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      <Link
        href={`/admin/hizmetler/${slug}`}
        className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3 text-xs font-black text-white shadow-2xs hover:bg-[#176956] transition"
      >
        <Edit3 size={13} className="stroke-[2.5]" />
        <span>Düzenle</span>
      </Link>
      <Link
        href={`/hizmetler/${slug}`}
        target="_blank"
        className="inline-flex h-8.5 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        title="Sitede İncele"
      >
        <ArrowUpRight size={13} />
        <span>Gör</span>
      </Link>
      <ActionButton
        action={() => deleteService(slug)}
        label="Sil"
        size="sm"
        variant="danger"
        icon={<Trash2 size={12} className="stroke-[2.5]" />}
        confirmText="Bu hizmeti yayından kaldırmak istediğinize emin misiniz?"
      />
    </div>
  );
}
