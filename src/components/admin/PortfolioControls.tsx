"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  createPortfolioProject,
  deletePortfolioProject,
  togglePortfolioFeatured,
  updatePortfolioProject,
} from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";
import {
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  FolderPlus,
  Layers3,
  Monitor,
  Smartphone,
  Sparkles,
  Tag,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Eye,
  Image as ImageIcon,
  UploadCloud,
  RefreshCw,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

export type PortfolioProjectItem = {
  id: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  services: string;
  technologies: string;
  results: string;
  coverImage: string;
  mobileImage: string | null;
  liveUrl: string | null;
  deliverables: string;
  gallery: string;
  isFeatured: boolean;
  completedAt: Date | string;
};

export function PortfolioManager({
  projects,
}: {
  projects: PortfolioProjectItem[];
}) {
  const [editingProject, setEditingProject] = useState<PortfolioProjectItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.sector.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || p.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sectors = Array.from(new Set(projects.map((p) => p.sector)));

  return (
    <div className="space-y-8">
      {/* ─── ÜST BAR: "+ Yeni Referans Ekle" Butonu ve Arama ─── */}
      <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex h-12 w-full max-w-sm items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 px-4 focus-within:border-[#223d26] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#82cf7f]/15 transition">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Referans adı, firma veya sektör ara..."
              className="h-full w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="h-12 rounded-2xl border border-slate-200/90 bg-white px-4 text-sm font-semibold text-slate-800 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 outline-none cursor-pointer"
          >
            <option value="">Tüm Sektörler ({projects.length})</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s} ({projects.filter((p) => p.sector === s).length})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Link
            href="/admin/portfoy/yeni"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#223d26] hover:bg-[#2b4c30] px-6 text-sm font-bold text-white shadow-xs transition"
          >
            <FolderPlus size={18} className="stroke-[2]" />
            + Yeni Referans Ekle
          </Link>
        </div>
      </section>

      {/* ─── ALT ALTA SIRALI REFERANSLAR LİSTESİ ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Kayıtlı Referanslar ({filtered.length})
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Tüm referansları aşağıdan inceleyebilir, &quot;Düzenle&quot; butonuyla tüm yazı ve görsellerini güncelleyebilirsiniz.
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-base font-black text-slate-900">Referans bulunamadı.</p>
            <p className="mt-1 text-xs font-bold text-slate-500">
              Arama filtrenizi temizleyebilir veya yukarıdaki butonla yeni referans ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((project) => {
              const services = parseList(project.services);
              const technologies = parseList(project.technologies);
              const gallery = parseList(project.gallery);

              return (
                <article
                  key={project.id}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition"
                >
                  <div className="grid gap-6 lg:grid-cols-[16rem_1fr_auto]">
                    {/* Görseller: Masaüstü & Mobil Mockup */}
                    <div className="space-y-3">
                      {/* Masaüstü Ekran Önizlemesi */}
                      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm aspect-[16/10]">
                        <div
                          className="h-full w-full bg-cover bg-center transition group-hover:scale-105 duration-300"
                          style={{
                            backgroundImage: `url("${(
                              project.coverImage || "/logo.svg"
                            ).replace(/"/g, "%22")}")`,
                          }}
                        />
                        <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">
                          <Monitor size={10} />
                          Masaüstü
                        </span>
                      </div>

                      {/* Mobil Ekran Minyatürü (Varsa) */}
                      {project.mobileImage && (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-700">
                          <span className="grid size-6 place-items-center rounded-lg bg-emerald-100 text-[#1f7a68]">
                            <Smartphone size={13} />
                          </span>
                          <span className="truncate text-xs font-bold text-slate-800">
                            Mobil Mockup Mevcut
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bilgiler & İçerik */}
                    <div className="flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-black text-slate-800">
                            {project.client}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                            {project.sector}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                            {project.category}
                          </span>
                          {project.isFeatured && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-[#1f7a68]">
                              ★ Öne Çıkan
                            </span>
                          )}
                        </div>

                        <h4 className="mt-2 text-xl font-black text-slate-950">
                          {project.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-relaxed text-slate-600">
                          {project.summary}
                        </p>
                      </div>

                      {/* Etiketler & Varlıklar */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                        {services.map((s, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-slate-100 px-2 py-1 text-slate-800"
                          >
                            {s}
                          </span>
                        ))}
                        {technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600"
                          >
                            {t}
                          </span>
                        ))}
                        {gallery.length > 0 && (
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 font-black text-[#1f7a68] border border-emerald-100">
                            +{gallery.length} Galeri Görseli
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
                        <span>Tamamlanma: {formatDate(project.completedAt)}</span>
                        <span>Kalıcı Link: /projeler/{project.slug}</span>
                      </div>
                    </div>

                    {/* Sağ Taraf: Hızlı İşlem Butonları */}
                    <div className="flex flex-col justify-between gap-2 lg:items-end">
                      <div className="flex flex-wrap items-center gap-2">
                        {project.liveUrl && (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-800 hover:bg-[#1f7a68] hover:text-white transition"
                          >
                            <span>Canlı Site</span>
                            <ExternalLink size={12} />
                          </Link>
                        )}
                        <Link
                          href={`/projeler/${project.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-800 hover:bg-slate-50 transition"
                        >
                          <span>Sayfayı Gör</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                        {/* DÜZENLE BUTONU */}
                        <Link
                          href={`/admin/portfoy/${project.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-amber-600 transition"
                        >
                          <Edit3 size={13} />
                          Düzenle
                        </Link>

                        <ActionButton
                          action={() => togglePortfolioFeatured(project.id)}
                          label={project.isFeatured ? "Öne Çıkarmayı Kapat" : "Öne Çıkar"}
                          variant={project.isFeatured ? "outline" : "primary"}
                        />

                        <ActionButton
                          action={() => deletePortfolioProject(project.id)}
                          label="Sil"
                          variant="danger"
                          confirmText="Bu referans projesini kalıcı olarak silmek istediğinizden emin misiniz?"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YAZDIKÇA AŞAĞIYA DOĞRU OTOMATİK GENİŞLEYEN METİN KUTUSU (AUTO-RESIZING)
// ─────────────────────────────────────────────────────────────────────────────
function AutoResizeTextarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  minRows = 3,
  className,
}: {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  minRows?: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      rows={minRows}
      value={value}
      onChange={(e) => {
        onChange(e);
        adjustHeight();
      }}
      placeholder={placeholder}
      required={required}
      className={cn(
        "overflow-hidden transition-[height] duration-75 resize-none",
        className
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BİLGİSAYARDAN GÖRSEL YÜKLEME VE BOZULMAYI ÖNLEYEN CANLI MOCKUP BİLEŞENİ
// ─────────────────────────────────────────────────────────────────────────────
function ImageUploadField({
  id,
  name,
  label,
  value,
  onChange,
  type = "desktop",
  required = false,
  badgeText = "16:10 Formatı",
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: "desktop" | "mobile";
  required?: boolean;
  badgeText?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [isDragOver, setIsDragOver] = useState(false);

  async function handleFile(file: File) {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);

    // 1. Kullanıcı beklemesin diye anında yerel önizleme göster
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);

    // 2. Dosyayı sunucudaki /public/uploads/ dizinine kaydet
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        onChange(data.url);
      } else if (data.error) {
        setUploadError(data.error);
      }
    } catch {
      // Bağlantı hatasında yerel görsel verisiyle devam et
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Üst Başlık ve Rozet */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800"
        >
          {type === "desktop" ? (
            <Monitor size={16} className="text-[#223d26]" />
          ) : (
            <Smartphone size={16} className="text-[#223d26]" />
          )}
          <span>{label}</span> {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
          {badgeText}
        </span>
      </div>

      {/* Bilgisayardan Yükle Butonu & URL Kutusu */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Gizli Dosya Seçici */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Bilgisayardan Seç Butonu */}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#223d26] hover:bg-[#2e5233] px-3.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer disabled:opacity-60"
        >
          {isUploading ? (
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

        {/* URL / Dosya Yolu Girişi */}
        <div className="relative flex-1">
          <input
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              type === "desktop"
                ? "/logo.svg veya görsel adresi"
                : "/gorseller/mobil-mockup.png (opsiyonel)"
            }
            required={required}
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
          />
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title="Görseli Temizle"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-200 transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {uploadError && (
        <p className="mt-1 text-xs font-bold text-red-500">{uploadError}</p>
      )}

      {/* Hızlı Seçimler & Bozulmayı Önleyen Uyum Butonları */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400">Hızlı Seç:</span>
          <button
            type="button"
            onClick={() => onChange("/logo.svg")}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
          >
            Logo
          </button>
          <button
            type="button"
            onClick={() => onChange("/lizart-logo-original.png")}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
          >
            Orijinal Logo
          </button>
          <button
            type="button"
            onClick={() => onChange("/logo-dark-mode.png")}
            className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:border-[#1f7a68] hover:text-[#1f7a68] transition"
          >
            Dark Logo
          </button>
        </div>

        {/* Görsel Bozulmasını Önleme Modu */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => setFitMode("contain")}
            title="Oranı korur, görseli kesmeden ve uzatmadan orijinal boyutlarında sığdırır"
            className={cn(
              "rounded-md px-2.5 py-0.5 text-[11px] font-black transition",
              fitMode === "contain"
                ? "bg-white text-slate-950 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Sığdır (Bozmaz)
          </button>
          <button
            type="button"
            onClick={() => setFitMode("cover")}
            title="Alanı tamamen doldurur"
            className={cn(
              "rounded-md px-2.5 py-0.5 text-[11px] font-black transition",
              fitMode === "cover"
                ? "bg-white text-slate-950 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Kapsa (Tam Ekran)
          </button>
        </div>
      </div>

      {/* Canlı Görsel Mockup Önizlemesi */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "mt-3 transition-all",
          isDragOver && "ring-2 ring-[#1f7a68] rounded-xl"
        )}
      >
        {type === "desktop" ? (
          /* MASAÜSTÜ BROWSER MOCKUP */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
            {/* Mac Browser Çubuğu */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200/80 px-3.5 py-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 max-w-xs mx-3 rounded-md bg-white/80 px-2.5 py-0.5 text-center font-mono text-[10px] text-slate-500 truncate">
                https://lizartdijital.com/projeler/...
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {fitMode === "contain" ? "Orijinal Oran" : "Tam Kapsama"}
              </span>
            </div>

            {/* Ekran Görüntüsü Alanı - Kesme ve Uzatma Yapmaz */}
            <div className="relative aspect-[16/10] w-full flex items-center justify-center overflow-hidden bg-slate-900/5 p-3">
              {value ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt={label}
                  className={cn(
                    "transition-all duration-300 rounded-lg shadow-sm",
                    fitMode === "contain"
                      ? "max-h-full max-w-full object-contain"
                      : "h-full w-full object-cover object-top"
                  )}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 text-center cursor-pointer text-slate-400 hover:text-slate-600 transition"
                >
                  <UploadCloud size={36} className="mb-2 text-[#1f7a68]" />
                  <p className="text-xs font-black text-slate-800">
                    Görseli buraya sürükleyin veya tıklayarak bilgisayardan seçin
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    PNG, JPG, WEBP veya SVG formatları
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MOBİL IPHONE MOCKUP */
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 sm:w-48 overflow-hidden rounded-[2.25rem] border-[5px] border-slate-900 bg-slate-950 p-1.5 shadow-xl">
              {/* Dynamic Island Pill */}
              <div className="mx-auto h-3 w-16 rounded-full bg-black mb-1.5 flex items-center justify-end px-1.5">
                <span className="size-1 rounded-full bg-blue-900/60" />
              </div>

              {/* Ekran */}
              <div className="relative aspect-[9/18] w-full overflow-hidden rounded-[1.6rem] bg-slate-900/50 flex items-center justify-center">
                {value ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={value}
                    alt="Mobil Ekran"
                    className={cn(
                      "transition-all duration-300",
                      fitMode === "contain"
                        ? "max-h-full max-w-full object-contain p-1"
                        : "h-full w-full object-cover object-top"
                    )}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 text-center cursor-pointer text-slate-400 hover:text-slate-300 transition"
                  >
                    <Smartphone size={28} className="mb-1 text-slate-500" />
                    <p className="text-xs font-bold text-slate-300">
                      Mobil Ekran Görseli Yok
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Tıklayıp bilgisayardan dikey görsel yükleyin
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERANS EKLEME & DÜZENLEME FORMU (GÖRSEL STÜDYOLU)
// ─────────────────────────────────────────────────────────────────────────────
export function PortfolioFormStudio({
  project,
  redirectTo = "/admin/portfoy",
  onClose,
}: {
  project?: PortfolioProjectItem | null;
  redirectTo?: string;
  onClose?: () => void;
}) {
  const isEditing = Boolean(project);

  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [client, setClient] = useState(project?.client ?? "");
  const [sector, setSector] = useState(project?.sector ?? "Kurumsal");
  const [category, setCategory] = useState(project?.category ?? "web");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [summary, setSummary] = useState(
    project?.summary ??
      "Markanın dijital varlığını güçlendiren modern, hızlı ve yönetilebilir web deneyimi hazırlandı."
  );
  const [problem, setProblem] = useState(
    project?.problem ??
      "Mevcut dijital deneyim markanın hizmet kalitesini yeterince yansıtmıyor ve kullanıcıları teklif almaya yönlendirmiyordu."
  );
  const [solution, setSolution] = useState(
    project?.solution ??
      "Net bilgi mimarisi, modern arayüz, hızlı sayfa yapısı ve dönüşüm odaklı CTA akışıyla yeni bir deneyim tasarlandı."
  );

  // Görseller
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "/logo.svg");
  const [mobileImage, setMobileImage] = useState(project?.mobileImage ?? "");
  const [gallery, setGallery] = useState(
    project ? parseList(project.gallery).join("\n") : ""
  );

  // Listeler
  const [services, setServices] = useState(
    project
      ? parseList(project.services).join("\n")
      : "Web Tasarım\nSEO Altyapısı\nİçerik Yönetimi"
  );
  const [technologies, setTechnologies] = useState(
    project
      ? parseList(project.technologies).join("\n")
      : "Next.js\nReact\nTailwind CSS"
  );
  const [deliverables, setDeliverables] = useState(
    project
      ? parseList(project.deliverables).join("\n")
      : "Responsive arayüz\nYönetilebilir sayfalar\nPerformans optimizasyonu"
  );
  const [results, setResults] = useState(
    project
      ? parseList(project.results)
          .map((r) => (typeof r === "object" && r?.label ? r.label : String(r)))
          .join("\n")
      : "Daha net teklif akışı\nDaha hızlı sayfa deneyimi"
  );
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured ?? true);

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

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slug || slug === slugify(title)) {
      setSlug(slugify(val));
    }
  }

  return (
    <AdminForm
      action={
        isEditing
          ? (formData) => updatePortfolioProject(project!.id, formData)
          : createPortfolioProject
      }
      submitLabel={isEditing ? "Değişiklikleri Kaydet" : "Referansı Oluştur & Yayınla"}
      redirectTo={redirectTo}
      className="rounded-[2.25rem] border-2 border-[#1f7a68]/40 bg-white p-6 shadow-[0_30px_90px_-40px_rgb(15_23_42/.6)] lg:p-8"
    >
      {/* Üst Bar */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
            <Sparkles size={14} className="stroke-[2.5]" />
            {isEditing ? "Referans Düzenleme Modu" : "Yeni Referans Ekleme Modu"}
          </span>
          <h3 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            {isEditing ? `${project!.title} — Düzenle` : "Yeni Referans Projesi Ekle"}
          </h3>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition"
          >
            <X size={20} />
          </button>
        ) : (
          <Link
            href="/admin/portfoy"
            className="grid size-10 place-items-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition"
          >
            <X size={20} />
          </Link>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_1fr]">
        {/* ─── SOL KOLON: Metinler, Müşteri & Süreç ─── */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Proje Adı <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="ref-title"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Zenit Diş Kliniği Web & SEO"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="ref-slug" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Slug (Kalıcı Link)
                </label>
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title))}
                  className="text-xs font-bold text-[#223d26] hover:underline"
                >
                  Otomatik ↺
                </button>
              </div>
              <div className="mt-1.5 flex items-center rounded-xl border border-slate-200/90 bg-slate-50/60 px-3 transition-all hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-[#223d26] focus-within:ring-4 focus-within:ring-[#82cf7f]/15 shadow-2xs">
                <span className="font-mono text-xs font-semibold text-slate-400 select-none">/projeler/</span>
                <input
                  id="ref-slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="proje-slug"
                  required
                  className="h-11 w-full min-w-0 bg-transparent px-1 font-mono text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="ref-client" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Firma / Müşteri <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="ref-client"
                name="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Örn: Zenit Dent"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="ref-sector" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Sektör <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="ref-sector"
                name="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Örn: Sağlık & Diş"
                required
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label htmlFor="ref-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Kategori <span className="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="ref-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3 text-sm font-medium text-slate-900 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="web">Web Sitesi</option>
                <option value="eticaret">E-Ticaret</option>
                <option value="mobil">Mobil Uygulama</option>
                <option value="yazilim">Özel Yazılım</option>
                <option value="seo">SEO & Büyüme</option>
                <option value="marka">Kurumsal Kimlik</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ref-liveUrl" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Canlı Web Sitesi URL
            </label>
            <input
              id="ref-liveUrl"
              name="liveUrl"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://zenitdent.com.tr (opsiyonel)"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="ref-summary" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Proje Özeti <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">Genel kapsam ve vizyon</span>
            </div>
            <AutoResizeTextarea
              id="ref-summary"
              name="summary"
              minRows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Projenin amacını, kapsamını ve değer önerisini yazın..."
              className="mt-1.5 min-h-[85px] w-full rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 text-sm font-normal leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="ref-problem" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Problem &amp; İhtiyaç <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">Karşılaşılan zorluklar ve eksikler</span>
            </div>
            <AutoResizeTextarea
              id="ref-problem"
              name="problem"
              minRows={4}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
              placeholder="Müşterinin yaşadığı zorlukları ve çözülmesi gereken problemleri yazın..."
              className="mt-1.5 min-h-[105px] w-full rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 text-sm font-normal leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="ref-solution" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Çözüm &amp; Mimari <span className="text-rose-500 font-bold">*</span>
              </label>
              <span className="text-[11px] font-medium text-slate-400">Uygulanan teknik ve tasarım stratejisi</span>
            </div>
            <AutoResizeTextarea
              id="ref-solution"
              name="solution"
              minRows={4}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
              placeholder="Lizart ekibi olarak geliştirdiğiniz mimariyi, tasarımı ve çözümleri yazın..."
              className="mt-1.5 min-h-[105px] w-full rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 text-sm font-normal leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:bg-white hover:border-slate-300 focus:bg-white focus:border-[#223d26] focus:ring-4 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
            />
          </div>
        </div>

        {/* ─── SAĞ KOLON: HER GÖRÜNÜME UYGUN GÖRSEL EKLEME STÜDYOSU ─── */}
        <div className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
          {/* 1. MASAÜSTÜ KAPAK GÖRSELİ */}
          <ImageUploadField
            id="ref-cover"
            name="coverImage"
            label="Masaüstü Web Kapak Görseli"
            value={coverImage}
            onChange={setCoverImage}
            type="desktop"
            required
            badgeText="16:10 / 16:9 Formatı"
          />

          {/* 2. MOBİL TELEFON EKRAN GÖRSELİ */}
          <ImageUploadField
            id="ref-mobile"
            name="mobileImage"
            label="Mobil Telefon Ekran Görseli"
            value={mobileImage}
            onChange={setMobileImage}
            type="mobile"
            required={false}
            badgeText="Dikey / Telefon Mockup"
          />

          {/* 3. GALERİ VE DİĞER ALANLAR */}
          <div className="space-y-3">
            <div>
              <label htmlFor="ref-gallery" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Galeri Görselleri <span className="text-[11px] font-normal lowercase text-slate-400">(Her satıra bir görsel adresi)</span>
              </label>
              <AutoResizeTextarea
                id="ref-gallery"
                name="gallery"
                minRows={2}
                value={gallery}
                onChange={(e) => setGallery(e.target.value)}
                placeholder="/gorsel-1.jpg&#10;/gorsel-2.jpg"
                className="mt-1.5 min-h-[65px] w-full rounded-xl border border-slate-200/90 bg-white p-3 font-mono text-xs font-medium text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ref-services" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Hizmetler <span className="text-[11px] font-normal lowercase text-slate-400">(Satır satır)</span>
                </label>
                <AutoResizeTextarea
                  id="ref-services"
                  name="services"
                  minRows={3}
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  className="mt-1.5 min-h-[75px] w-full rounded-xl border border-slate-200/90 bg-white p-3 text-xs font-medium leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label htmlFor="ref-technologies" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Teknolojiler <span className="text-[11px] font-normal lowercase text-slate-400">(Satır satır)</span>
                </label>
                <AutoResizeTextarea
                  id="ref-technologies"
                  name="technologies"
                  minRows={3}
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="mt-1.5 min-h-[75px] w-full rounded-xl border border-slate-200/90 bg-white p-3 text-xs font-medium leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ref-deliverables" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Teslim Edilenler <span className="text-[11px] font-normal lowercase text-slate-400">(Satır satır)</span>
                </label>
                <AutoResizeTextarea
                  id="ref-deliverables"
                  name="deliverables"
                  minRows={2}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="mt-1.5 min-h-[65px] w-full rounded-xl border border-slate-200/90 bg-white p-3 text-xs font-medium leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
                />
              </div>

              <div>
                <label htmlFor="ref-results" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Sonuç Notları <span className="text-[11px] font-normal lowercase text-slate-400">(Satır satır)</span>
                </label>
                <AutoResizeTextarea
                  id="ref-results"
                  name="results"
                  minRows={2}
                  value={results}
                  onChange={(e) => setResults(e.target.value)}
                  className="mt-1.5 min-h-[65px] w-full rounded-xl border border-slate-200/90 bg-white p-3 text-xs font-medium leading-relaxed text-slate-800 placeholder:text-slate-400 transition-all hover:border-slate-300 focus:border-[#223d26] focus:ring-3 focus:ring-[#82cf7f]/15 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200/90 bg-white p-3.5 text-xs font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50/50">
              <input
                type="checkbox"
                name="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="size-4 rounded accent-[#223d26]"
              />
              <span>Öne Çıkan Referans Olarak Göster</span>
            </label>
          </div>
        </div>
      </div>
    </AdminForm>
  );
}

function parseList(value: string | unknown) {
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
