"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAddOnService,
  updateAddOnService,
  toggleAddOnService,
  deleteAddOnService,
} from "@/lib/actions/admin";
import { ActionButton } from "@/components/admin/ui";
import { TransitionSlider } from "@/components/ui/TransitionSlider";
import {
  Layers3,
  Edit3,
  Plus,
  Sparkles,
  ArrowLeft,
  Check,
  X,
  UploadCloud,
  RefreshCw,
  Image as ImageIcon,
  Monitor,
  Trash2,
  ExternalLink,
  Tag,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ADDON_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export { ADDON_GROUPS };

export type AddOnItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  extraDays: number;
  group: string;
  isActive: boolean;
  image?: string | null;
  gallery?: string[] | string | null;
};

export function AddOnCreateForm({
  initialData,
  redirectTo = "/admin/ek-hizmetler",
}: {
  initialData?: AddOnItem | null;
  redirectTo?: string;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  // Temel Alanlar
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState<number | string>(
    initialData ? Math.round(initialData.price / 100) : 1500
  );
  const [extraDays, setExtraDays] = useState<number>(initialData?.extraDays ?? 1);
  const [group, setGroup] = useState(initialData?.group ?? "kurulum");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Ana Görsel
  const [image, setImage] = useState(
    initialData?.image || "/gorseller/ajans/hizmet-web.svg"
  );
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isMainUploading, setIsMainUploading] = useState(false);
  const [mainUploadError, setMainUploadError] = useState<string | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement>(null);

  // Çoklu Galeri Görselleri (Geçişli Slayt)
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    if (!initialData?.gallery) return [];
    if (Array.isArray(initialData.gallery)) return initialData.gallery;
    return initialData.gallery.split("\n").map((s) => s.trim()).filter(Boolean);
  });
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Form Durumları
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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

  function handleNameChange(val: string) {
    setName(val);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(val));
    }
  }

  // Ana görsel yükleme
  async function handleMainFileUpload(file: File) {
    if (!file) return;
    setMainUploadError(null);
    setIsMainUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) setImage(result);
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
        setImage(data.url);
      } else if (data.error) {
        setMainUploadError(data.error);
      }
    } catch {
      // Yerel önizleme kalır
    } finally {
      setIsMainUploading(false);
    }
  }

  // Çoklu galeri görseli yükleme
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
        // Devam et
      }
    }

    if (newUrls.length > 0) {
      setGalleryImages((prev) => [...prev, ...newUrls]);
    } else {
      setGalleryUploadError("Görseller yüklenirken bir sorun oluştu.");
    }
    setIsGalleryUploading(false);
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== index));
  }

  // Kaydetme İşlemi
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("extraDays", String(extraDays));
    formData.append("group", group);
    if (isActive) formData.append("isActive", "on");
    formData.append("image", image);
    formData.append("gallery", galleryImages.join("\n"));

    try {
      const result = isEditing && initialData
        ? await updateAddOnService(initialData.id, formData)
        : await createAddOnService(formData);

      if (result.ok) {
        setFormSuccess(result.message || "Ek hizmet başarıyla kaydedildi!");
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

  const allPreviewImages = [image, ...galleryImages].filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ─── 1. ÜST BAR: Navigasyon ve Eylem Butonları ─── */}
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
                <Layers3 size={13} className="stroke-[2.5]" />
                {isEditing ? "Ek Hizmeti Düzenle" : "Yeni Ek Hizmet"}
              </span>
              {isEditing && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                  {slug}
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {isEditing ? `"${initialData!.name}" Düzenle` : "Yeni Ek Hizmet Tanımla"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isEditing && initialData && (
            <>
              <ActionButton
                action={() => toggleAddOnService(initialData.id)}
                label={isActive ? "Pasifleştir" : "Aktifleştir"}
                variant={isActive ? "outline" : "primary"}
              />
              <ActionButton
                action={() => deleteAddOnService(initialData.id)}
                label="Hizmeti Sil"
                variant="danger"
                confirmText={`"${initialData.name}" ek hizmetini kalıcı olarak silmek istediğinizden emin misiniz?`}
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
                {isEditing ? "Değişiklikleri Kaydet" : "Ek Hizmeti Oluştur"}
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

      {/* ─── 2. FERAH 2 SÜTUNLU YAPI ─── */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* ── SOL SÜTUN: Form Verileri & Kapsam (7 Kolon) ── */}
        <div className="space-y-6 lg:col-span-7">
          {/* Kart 1: Temel Bilgiler */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag size={18} className="text-[#1f7a68]" />
              <h3 className="text-base font-black text-slate-950">
                Ek Hizmet Tanımı & Paket Ayarları
              </h3>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Hizmet Adı <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Sanal POS & Ödeme Sistemi Entegrasyonu"
                required
                className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-base font-black text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] focus:outline-none transition"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Kalıcı Bağlantı (Slug) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(name))}
                    className="text-[11px] font-black text-[#1f7a68] hover:underline"
                  >
                    Yenile ↺
                  </button>
                </div>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="odeme-sistemi-entegrasyonu"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 font-mono text-sm font-bold text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Hizmet Grubu <span className="text-red-500">*</span>
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm font-black text-slate-900 focus:bg-white focus:border-[#1f7a68] outline-none transition"
                >
                  {ADDON_GROUPS.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Fiyat (₺ KDV Hariç) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 focus-within:border-[#1f7a68] focus-within:bg-white transition">
                  <DollarSign size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min={0}
                    required
                    className="h-11 w-full min-w-0 bg-transparent px-2 text-sm font-black text-slate-900 outline-none"
                  />
                  <span className="font-bold text-xs text-slate-400">TL</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                  Ek Teslim Süresi (İş Günü)
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 focus-within:border-[#1f7a68] focus-within:bg-white transition">
                  <Clock size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="number"
                    value={extraDays}
                    onChange={(e) => setExtraDays(Number(e.target.value))}
                    min={0}
                    className="h-11 w-full min-w-0 bg-transparent px-2 text-sm font-black text-slate-900 outline-none"
                  />
                  <span className="font-bold text-xs text-slate-400">Gün</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kart 2: Açıklama ve Durum */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Hizmet Açıklaması <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Bu ek hizmetin kapsamı, sunduğu faydalar ve neleri içerdiği..."
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-bold leading-relaxed text-slate-950 focus:bg-white focus:border-[#1f7a68] focus:outline-none transition"
              />
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-black text-slate-900">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-5 rounded-md accent-[#1f7a68] cursor-pointer"
                />
                <div>
                  <span>Bu ek hizmet hemen sitede aktif olarak sunulsun</span>
                  <p className="text-xs font-medium text-slate-500">
                    İşareti kaldırırsanız ek hizmet mağazada ve sepet adımlarında gizlenir.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ── SAĞ SÜTUN: Çoklu Görsel Yükleyici & Geçişli Önizleme (5 Kolon) ── */}
        <div className="space-y-6 lg:col-span-5">
          {/* Kart 3: Ana Görsel & Yükleme */}
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

            {/* Dosya Seçici */}
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
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/gorseller/... veya görsel adresi"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-bold text-slate-950 placeholder:text-slate-400 focus:bg-white focus:border-[#1f7a68] outline-none"
                />
              </div>

              {image && (
                <button
                  type="button"
                  onClick={() => setImage("")}
                  title="Görseli Temizle"
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {mainUploadError && (
              <p className="text-xs font-bold text-red-500">{mainUploadError}</p>
            )}

            {/* Hızlı Seçim ve Sığdır / Kapsa */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Hızlı Seç:</span>
                <button
                  type="button"
                  onClick={() => setImage("/gorseller/ajans/hizmet-web.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Kurulum
                </button>
                <button
                  type="button"
                  onClick={() => setImage("/gorseller/ajans/hizmet-eticaret.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Ödeme
                </button>
                <button
                  type="button"
                  onClick={() => setImage("/gorseller/ajans/surec.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Kargo
                </button>
                <button
                  type="button"
                  onClick={() => setImage("/gorseller/ajans/studyo.svg")}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
                >
                  Eğitim
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
          </div>

          {/* Kart 4: Çoklu Galeri Görselleri (Birden Fazla Görsel Ekleme) */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers3 size={18} className="text-[#1f7a68]" />
                <h3 className="text-base font-black text-slate-950">
                  Çoklu Görsel Galerisi ({galleryImages.length})
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-black text-[#1f7a68]">
                Çoklu & Geçişli
              </span>
            </div>

            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Ek hizmetin detaylarını, adımlarını veya belgelerini gösteren birden fazla görsel ekleyin.
            </p>

            {/* Çoklu Dosya Seçici */}
            <input
              type="file"
              ref={galleryFileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={(e) => handleGalleryFilesUpload(e.target.files)}
              className="hidden"
            />

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

            {galleryUploadError && (
              <p className="text-xs font-bold text-red-500">{galleryUploadError}</p>
            )}

            {/* Küçük Resimler Gridi */}
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
                      alt={`Ek Görsel ${idx + 1}`}
                      className="size-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition cursor-pointer"
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
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
                <ImageIcon size={22} className="mx-auto text-slate-300" />
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Henüz ek galeri görseli eklenmedi.
                </p>
                <p className="text-[11px] text-slate-400">
                  Yukarıdaki butonla aynı anda birden fazla fotoğraf seçebilirsiniz.
                </p>
              </div>
            )}

            {/* Satır Satır URL */}
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
                placeholder="/gorseller/ek-1.jpg&#10;/gorseller/ek-2.jpg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-mono text-xs font-bold text-slate-800 focus:bg-white focus:border-[#1f7a68] outline-none"
              />
            </div>
          </div>

          {/* Kart 5: CANLI GEÇİŞLİ MOCKUP ÖNİZLEMESİ (GEÇİŞLİ SLIDER) */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-[#1f7a68]" />
                <h3 className="text-base font-black text-slate-950">
                  Canlı Geçişli Önizleme
                </h3>
              </div>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-[#1f7a68]">
                {allPreviewImages.length} Görsel Geçişli
              </span>
            </div>

            <p className="text-xs font-bold text-slate-500">
              Aşağıdaki kutuda görseller arasındaki geçişi test edebilirsiniz (Oklarla ve noktalarla geçiş yapılabilir):
            </p>

            {/* Masaüstü Mockup Çerçevesi */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200/80 px-3.5 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 max-w-xs mx-3 rounded-md bg-white/80 px-2.5 py-0.5 text-center font-mono text-[10px] text-slate-500 truncate">
                  https://lizartdijital.com/ek-hizmetler/{slug || "yeni"}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {fitMode === "contain" ? "Sığdırıldı" : "Kapsama"}
                </span>
              </div>

              {/* Geçişli Slider Bileşeni */}
              <div className="relative aspect-[16/10] w-full bg-slate-900/5">
                <TransitionSlider
                  images={allPreviewImages}
                  alt={name || "Ek Hizmet"}
                  aspectRatio="aspect-[16/10]"
                  objectFit={fitMode}
                  showDots={true}
                  showArrows={true}
                  showBadge={true}
                  autoSlide={allPreviewImages.length > 1}
                  slideInterval={3500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function AddOnRowActions({
  addOnId,
  isActive,
}: {
  addOnId: string;
  isActive: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      <Link
        href={`/admin/ek-hizmetler/${addOnId}`}
        className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3 text-xs font-black text-white shadow-2xs transition hover:bg-[#176956]"
      >
        <Edit3 size={13} className="stroke-[2.5]" />
        <span>Düzenle</span>
      </Link>
      <ActionButton
        action={() => toggleAddOnService(addOnId)}
        label={isActive ? "Pasifleştir" : "Aktifleştir"}
        size="sm"
        variant={isActive ? "outline" : "primary"}
      />
      <ActionButton
        action={() => deleteAddOnService(addOnId)}
        label="Sil"
        size="sm"
        variant="danger"
        icon={<Trash2 size={12} className="stroke-[2.5]" />}
        confirmText="Bu ek hizmeti silmek istediğinizden emin misiniz?"
      />
    </div>
  );
}
