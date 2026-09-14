"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  archiveProduct,
  createProduct,
  duplicateProduct,
  publishVersion,
  toggleProductPublished,
  updateProduct,
} from "@/lib/actions/admin";
import { ActionButton, AdminForm } from "@/components/admin/ui";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Edit3,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Tag,
  UploadCloud,
} from "lucide-react";

/** Ürünü yayına alır / yayından kaldırır. */
export function PublishToggle({ productId, isPublished }: { productId: string; isPublished: boolean }) {
  return (
    <ActionButton
      action={() => toggleProductPublished(productId)}
      label={isPublished ? "Taslak" : "Yayınla"}
      size="sm"
      variant={isPublished ? "outline" : "primary"}
    />
  );
}

export function ProductRowActions({ productId, isPublished }: { productId: string; isPublished: boolean }) {
  return (
    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      <Link
        href={`/admin/urunler/${productId}`}
        className="inline-flex h-8.5 items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3 text-xs font-black text-white shadow-2xs hover:bg-[#176956] transition"
      >
        <Edit3 size={13} className="stroke-[2.5]" />
        <span>Düzenle</span>
      </Link>
      <PublishToggle productId={productId} isPublished={isPublished} />
      <ActionButton action={() => duplicateProduct(productId)} label="Kopyala" size="sm" variant="outline" />
      <ActionButton
        action={() => archiveProduct(productId)}
        label="Arşivle"
        size="sm"
        variant="danger"
        confirmText="Bu ürünü yayından kaldırıp arşive almak istiyor musunuz?"
      />
    </div>
  );
}

const PRESET_IMAGES = [
  { label: "Kurumsal Web", url: "/gorseller/urunler/atlas-kurumsal-web-sitesi-kapak.svg" },
  { label: "E-Ticaret Mağazası", url: "/gorseller/urunler/vitrin-eticaret-sitesi-kapak.svg" },
  { label: "Mobil Uygulama", url: "/gorseller/urunler/sepetim-eticaret-mobil-uygulamasi-kapak.svg" },
  { label: "Pazaryeri & Portal", url: "/gorseller/urunler/pazar-cok-saticili-pazaryeri-kapak.svg" },
  { label: "B2B & Stok Yönetimi", url: "/gorseller/urunler/depo-stok-siparis-yonetimi-kapak.svg" },
  { label: "Randevu & Rezervasyon", url: "/gorseller/urunler/zaman-randevu-sitesi-kapak.svg" },
];

const PRESET_TEMPLATES = [
  {
    label: "🏢 Kurumsal Web Sitesi",
    data: {
      name: "Kurumsal Web Sitesi & CMS Paketi",
      type: "website",
      basePrice: "18500",
      comparePrice: "24000",
      deliveryDays: "5",
      coverImage: "/gorseller/urunler/atlas-kurumsal-web-sitesi-kapak.svg",
      shortDesc: "Şirketinizi dijital dünyada öne çıkaran modern, ultra hızlı ve SEO altyapılı kurumsal web sitesi.",
      description: "Kurumsal kimliğinize özel modern web tasarımı. Yönetilebilir admin paneli, tam mobil uyumluluk (responsive), kurumsal e-posta kurulumu ve Google arama motorunda yükselmenizi sağlayan teknik SEO mimarisiyle anahtar teslim sunulmaktadır.",
      features: "Özel Kurumsal Tasarım\nKolay Yönetilebilir Admin Paneli\n100% Mobil & Tablet Uyumlu\nTeknik SEO & Meta Yönetimi\nSSL Güvenlik Sertifikası\nKurumsal E-Posta Entegrasyonu\nGoogle Harita & İletişim Formu\n1 Yıl Ücretsiz Teknik Destek",
      demoUrl: "https://demo.lizartdijital.com/kurumsal",
      hasAdminPanel: true,
      includesSource: false,
      multiLanguage: false,
    },
  },
  {
    label: "🛍️ E-Ticaret Mağazası",
    data: {
      name: "E-Ticaret & Online Satış Paketi",
      type: "website",
      basePrice: "29500",
      comparePrice: "38000",
      deliveryDays: "7",
      coverImage: "/gorseller/urunler/vitrin-eticaret-sitesi-kapak.svg",
      shortDesc: "İyzico ve PayTR sanal POS entegrasyonlu, sınırsız ürün ve sipariş yönetimli profesyonel e-ticaret mağazası.",
      description: "Hemen online satışa başlayabileceğiniz anahtar teslim e-ticaret çözümü. Sanal POS altyapısı, varyantlı ürünler, stok takibi, kupon kodları ve anlık SMS/E-posta sipariş bildirimleriyle eksiksiz.",
      features: "İyzico & PayTR Sanal POS Kurulumu\nGelişmiş Sipariş & Stok Yönetimi\nKupon & İndirim Kodu Sistemi\nVaryantlı Ürün Yönetimi (Beden/Renk)\nAnlık SMS & E-Posta Bildirimleri\nKargo Takip Entegrasyonu\nFatura / PDF Sipariş Çıktısı\n7/24 Güvenli Altyapı",
      demoUrl: "https://demo.lizartdijital.com/eticaret",
      hasAdminPanel: true,
      includesSource: true,
      multiLanguage: false,
    },
  },
  {
    label: "📱 Mobil Uygulama",
    data: {
      name: "iOS & Android Mobil Uygulama Paketi",
      type: "app",
      basePrice: "42000",
      comparePrice: "55000",
      deliveryDays: "14",
      coverImage: "/gorseller/urunler/sepetim-eticaret-mobil-uygulamasi-kapak.svg",
      shortDesc: "React Native & Expo altyapısıyla App Store ve Google Play için hazır native mobil uygulama.",
      description: "Müşterilerinizin telefonunda doğrudan yer alın. OneSignal anlık push bildirimleri, yüksek hız, modern mobil kullanıcı deneyimi ve App Store & Google Play mağaza teslimi dahil.",
      features: "App Store & Google Play Yayını\nAnlık Push Bildirimleri (OneSignal)\nKaranlık / Aydınlık Mod Desteği\nBiyometrik Giriş (FaceID / Parmak İzi)\nÇevrimdışı Çalışma Kabiliyeti\nGelişmiş Kullanıcı Profili\n1 Yıl Sürüm Güncelleme Desteği",
      demoUrl: "https://demo.lizartdijital.com/mobil",
      hasAdminPanel: true,
      includesSource: true,
      multiLanguage: true,
    },
  },
  {
    label: "⚡ B2B & SaaS Portalı",
    data: {
      name: "B2B Bayi & Müşteri Yönetim Portalı",
      type: "webapp",
      basePrice: "36000",
      comparePrice: "48000",
      deliveryDays: "10",
      coverImage: "/gorseller/urunler/depo-stok-siparis-yonetimi-kapak.svg",
      shortDesc: "Bayileriniz ve kurumsal müşterileriniz için sipariş, cari bakiye ve yetkilendirmeli SaaS portalı.",
      description: "Çok kullanıcılı rol ve yetkilendirme altyapısı, Excel / PDF veri aktarımı, cari hesap ve özel fiyat listesi yönetimi sunan modern B2B bulut web uygulaması.",
      features: "Çoklu Rol ve Yetkilendirme\nCari Hesap & Bakiye Takibi\nExcel / PDF Veri Dışa Aktarma\nBayilere Özel Fiyat Listeleri\nBayi Sipariş & Talep Yönetimi\nDetaylı Finans & Raporlama Paneli",
      demoUrl: "https://demo.lizartdijital.com/b2b",
      hasAdminPanel: true,
      includesSource: true,
      multiLanguage: true,
    },
  },
];

const QUICK_FEATURES = [
  "100% Mobil & Tablet Uyumlu",
  "Kolay Yönetilebilir Admin Paneli",
  "SEO Altyapısı & Meta Yönetimi",
  "SSL Güvenlik Sertifikası",
  "WhatsApp Hızlı Sipariş Butonu",
  "İyzico & PayTR Sanal POS",
  "Kurumsal E-Posta Entegrasyonu",
  "Çoklu Dil Desteği",
  "Blog & İçerik Yönetimi",
  "1 Yıl Ücretsiz Teknik Destek",
];

function slugifyText(text: string) {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
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

export function ProductCreateForm({
  categories,
  redirectTo = "/admin/urunler",
}: {
  categories: { id: string; name: string }[];
  redirectTo?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("website");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [basePrice, setBasePrice] = useState("18500");
  const [comparePrice, setComparePrice] = useState("24000");
  const [deliveryDays, setDeliveryDays] = useState("7");
  const [coverImage, setCoverImage] = useState("/gorseller/urunler/atlas-kurumsal-web-sitesi-kapak.svg");
  const [shortDesc, setShortDesc] = useState("Modern, hızlı ve SEO uyumlu profesyonel dijital çözüm paketi.");
  const [description, setDescription] = useState(
    "Bu paket kurumsal ihtiyaçlara göre hazırlanmış, responsive arayüz, temel SEO ayarları ve yönetilebilir içerik yapısıyla teslim edilen profesyonel bir çözümdür."
  );
  const [features, setFeatures] = useState(
    "100% Mobil & Tablet Uyumlu\nKolay Yönetilebilir Admin Paneli\nSEO Altyapısı & Meta Yönetimi\nSSL Güvenlik Sertifikası\n1 Yıl Ücretsiz Teknik Destek"
  );
  const [demoUrl, setDemoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [hasAdminPanel, setHasAdminPanel] = useState(true);
  const [includesSource, setIncludesSource] = useState(false);
  const [multiLanguage, setMultiLanguage] = useState(false);

  // Görsel yükleme durumları
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  function handleNameChange(val: string) {
    setName(val);
    if (!slug || slug === slugifyText(name)) {
      setSlug(slugifyText(val));
    }
  }

  // Bilgisayardan veya telefondan görsel yükleme
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Görsel yüklenirken bir sorun oluştu.");
      }

      setCoverImage(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Görsel yüklenemedi.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Hızlı şablon doldurma
  function applyTemplate(t: (typeof PRESET_TEMPLATES)[0]) {
    setName(t.data.name);
    setSlug(slugifyText(t.data.name));
    setType(t.data.type);
    setBasePrice(t.data.basePrice);
    setComparePrice(t.data.comparePrice);
    setDeliveryDays(t.data.deliveryDays);
    setCoverImage(t.data.coverImage);
    setShortDesc(t.data.shortDesc);
    setDescription(t.data.description);
    setFeatures(t.data.features);
    setDemoUrl(t.data.demoUrl);
    setHasAdminPanel(t.data.hasAdminPanel);
    setIncludesSource(t.data.includesSource);
    setMultiLanguage(t.data.multiLanguage);
  }

  // Hızlı özellik ekle / çıkar
  function toggleFeature(feat: string) {
    const lines = features
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.includes(feat)) {
      setFeatures(lines.filter((l) => l !== feat).join("\n"));
    } else {
      setFeatures([...lines, feat].join("\n"));
    }
  }

  const featuresList = features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const numBase = Number(basePrice) || 0;
  const numCompare = Number(comparePrice) || 0;
  const discountRate =
    numCompare > numBase && numBase > 0
      ? Math.round(((numCompare - numBase) / numCompare) * 100)
      : null;

  return (
    <div className="rounded-[2.25rem] border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_-50px_rgb(15_23_42/.3)] sm:p-7 lg:p-8">
      {/* ─── Başlık ve Hızlı Şablonlar ─── */}
      <div className="border-b border-slate-100 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
              <Sparkles size={13} className="stroke-[2.5]" />
              Lizart Paket & Ürün Stüdyosu
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Web Sitesi / Hizmet Paketi Oluştur
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Görsel yükleyin, fiyat ve özellikleri belirleyin; müşterilerinizin göreceği kartı anlık inceleyin.
            </p>
          </div>

          {/* Mobilde Form / Canlı Önizleme Sekmesi */}
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100/70 p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setActiveTab("form")}
              className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "form"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Form Alanları
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-white text-[#1f7a68] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Canlı Önizleme
            </button>
          </div>
        </div>

        {/* Hızlı Hazır Şablonlar */}
        <div className="mt-5 flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Hızlı Doldurma Şablonları (Tek Tıkla Hazırla):
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TEMPLATES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => applyTemplate(t)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-[#1f7a68] hover:bg-[#1f7a68]/5 hover:text-[#1f7a68] cursor-pointer"
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdminForm
        action={createProduct}
        submitLabel="Paketi Yayına Al ve Kaydet"
        redirectTo={redirectTo}
        className="mt-6"
      >
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* ─── SOL SÜTUN: FORM BİLGİLERİ ─── */}
          <div className={`space-y-6 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
            {/* 1. Temel Bilgiler */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2">
                <Tag size={15} className="text-[#1f7a68]" />
                1. Temel Tanımlamalar
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="prod-name" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Ürün / Paket Adı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prod-name"
                    name="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Örn: Kurumsal Web Sitesi & CMS Paketi"
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="prod-slug" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Slug (URL Adresi)
                  </label>
                  <input
                    id="prod-slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kurumsal-web-sitesi-paketi"
                    className={fieldClass}
                  />
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    Boş bırakırsanız otomatik oluşturulur.
                  </p>
                </div>

                <div>
                  <label htmlFor="create-type" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Ürün Türü
                  </label>
                  <select
                    id="create-type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={fieldClass}
                  >
                    {[
                      { value: "website", label: "Web Sitesi" },
                      { value: "app", label: "Mobil Uygulama" },
                      { value: "webapp", label: "Web Uygulaması" },
                      { value: "system", label: "Hazır Sistem" },
                      { value: "template", label: "Tema / Şablon" },
                      { value: "service", label: "Hizmet Paketi" },
                    ].map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="create-category" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Kategori
                  </label>
                  <select
                    id="create-category"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={fieldClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="delivery-days" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Teslimat Süresi (İş Günü) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="delivery-days"
                    name="deliveryDays"
                    type="number"
                    min={0}
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    required
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>

            {/* 2. Görsel Yükleme Alanı (Bilgisayardan Dosya Seçme & Hazır Mockuplar) */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <ImageIcon size={15} className="text-[#1f7a68]" />
                  2. Kapak Görseli (Bilgisayardan / Telefondan Ekle)
                </h3>
                {isUploading && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#1f7a68] animate-pulse">
                    <RefreshCw size={13} className="animate-spin" /> Yükleniyor…
                  </span>
                )}
              </div>

              {/* Gizli Dosya Girişi */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
                id="product-image-upload"
              />

              <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
                {/* Görsel Önizleme Kutusu */}
                <div className="relative aspect-video sm:aspect-square w-full rounded-2xl border-2 border-dashed border-slate-200 bg-white overflow-hidden flex flex-col items-center justify-center p-2 shadow-xs group">
                  {coverImage ? (
                    <>
                      <img
                        src={coverImage}
                        alt="Kapak Görseli"
                        className="h-full w-full object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                      >
                        <UploadCloud size={20} />
                        Değiştir
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon size={32} className="mx-auto text-slate-300 mb-1" />
                      <span className="text-xs font-bold text-slate-400">Görsel Yok</span>
                    </div>
                  )}
                </div>

                {/* Yükleme Butonları & URL */}
                <div className="flex flex-col justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a68] px-4 py-2.5 text-xs font-black text-white hover:bg-[#176956] transition shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud size={16} />
                      Bilgisayardan / Telefondan Görsel Seç
                    </button>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      PNG, JPG, WEBP veya SVG yükleyebilirsiniz (Maksimum 10MB).
                    </p>
                  </div>

                  {uploadError && (
                    <div className="rounded-xl bg-rose-50 border border-rose-200 p-2 text-xs font-bold text-rose-700 flex items-center gap-2">
                      <AlertCircle size={15} />
                      {uploadError}
                    </div>
                  )}

                  {/* Manuel URL Girişi */}
                  <div>
                    <label htmlFor="cover-image-url" className="block text-[11px] font-black uppercase text-slate-500 mb-1">
                      Kapak Görseli URL Yolu
                    </label>
                    <input
                      id="cover-image-url"
                      name="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      required
                      placeholder="/gorseller/urunler/kapak.svg veya https://..."
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              {/* Hazır Mockup Galerisi */}
              <div className="mt-4 pt-4 border-t border-slate-200/60">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Veya Hazır Lizart Görsellerinden Seçin:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setCoverImage(img.url)}
                      className={`group relative aspect-video rounded-xl border-2 p-1 overflow-hidden transition cursor-pointer ${
                        coverImage === img.url
                          ? "border-[#1f7a68] bg-[#1f7a68]/5"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="h-full w-full object-cover rounded-lg"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 py-0.5 text-[9px] font-bold text-white text-center truncate px-1">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Fiyatlandırma ve İndirim */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2">
                <span>💰</span> 3. Fiyatlandırma
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="base-price" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Satış Fiyatı (TL, KDV Hariç) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="base-price"
                    name="basePrice"
                    type="number"
                    min={0}
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="compare-price" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Üstü Çizili Eski Fiyat (Opsiyonel)
                  </label>
                  <input
                    id="compare-price"
                    name="comparePrice"
                    type="number"
                    min={0}
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="Örn: 24000"
                    className={fieldClass}
                  />
                </div>
              </div>

              {discountRate !== null && discountRate > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-black text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={15} />
                  Müşteri vitrininde <strong>%{discountRate} İNDİRİM</strong> rozetiyle gösterilecek.
                </div>
              )}
            </div>

            {/* 4. Açıklamalar ve Demo Bağlantısı */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2">
                <span>📝</span> 4. Tanıtım & Demo Bağlantıları
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="short-desc" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Kısa Açıklama (Vitrin Spotu) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="short-desc"
                    name="shortDesc"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    maxLength={300}
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="long-desc" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Detaylı Açıklama <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="long-desc"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className={`${fieldClass} h-auto p-3`}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-url" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Canlı Demo Linki (URL)
                    </label>
                    <input
                      id="demo-url"
                      name="demoUrl"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://demo.lizartdijital.com/..."
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="admin-demo-url" className="block text-xs font-black uppercase tracking-wider text-slate-700">
                      Admin Panel Demo Linki (Varsa)
                    </label>
                    <input
                      id="admin-demo-url"
                      name="adminDemoUrl"
                      placeholder="https://demo.lizartdijital.com/admin"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Paket Özellikleri (Her satır bir özellik) */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#1f7a68]" />
                  5. Paket Özellikleri
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {featuresList.length} Özellik Eklendi
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-3">
                Her satıra bir özellik yazın. Müşteri ürün sayfasında tik işaretiyle listelenir.
              </p>

              {/* Hızlı Ekleme Etiketleri */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {QUICK_FEATURES.map((feat) => {
                  const isAdded = featuresList.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                        isAdded
                          ? "bg-[#1f7a68] text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-[#1f7a68]"
                      }`}
                    >
                      {isAdded ? <Check size={12} /> : <Plus size={12} />}
                      {feat}
                    </button>
                  );
                })}
              </div>

              <textarea
                name="features"
                rows={6}
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className={`${fieldClass} h-auto p-3 font-mono text-xs`}
                placeholder="Responsive tasarım&#10;Yönetim paneli&#10;SSL sertifikası..."
              />
            </div>

            {/* 6. Paket Seçenekleri & SEO */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#1f7a68]" />
                6. Paket Seçenekleri & SEO
              </h3>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <Checkbox
                  name="isPublished"
                  label="Hemen Yayına Al"
                  checked={isPublished}
                  onChange={(c) => setIsPublished(c)}
                />
                <Checkbox
                  name="isFeatured"
                  label="Öne Çıkan Paket Olarak İşaretle"
                  checked={isFeatured}
                  onChange={(c) => setIsFeatured(c)}
                />
                <Checkbox
                  name="hasAdminPanel"
                  label="Yönetim Paneli (CMS) Dahil"
                  checked={hasAdminPanel}
                  onChange={(c) => setHasAdminPanel(c)}
                />
                <Checkbox
                  name="includesSource"
                  label="Kaynak Kod Teslim Edilir"
                  checked={includesSource}
                  onChange={(c) => setIncludesSource(c)}
                />
                <Checkbox
                  name="multiLanguage"
                  label="Çoklu Dil Desteği Var"
                  checked={multiLanguage}
                  onChange={(c) => setMultiLanguage(c)}
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="meta-title" className="block text-xs font-black uppercase text-slate-600">
                    SEO Başlığı (Meta Title)
                  </label>
                  <input
                    id="meta-title"
                    name="metaTitle"
                    defaultValue={name ? `${name} | Lizart Dijital` : ""}
                    className={fieldClass}
                    placeholder="Örn: Kurumsal Web Sitesi | Lizart Dijital"
                  />
                </div>
                <div>
                  <label htmlFor="meta-desc" className="block text-xs font-black uppercase text-slate-600">
                    SEO Açıklaması (Meta Description)
                  </label>
                  <input
                    id="meta-desc"
                    name="metaDescription"
                    defaultValue={shortDesc}
                    className={fieldClass}
                    placeholder="Arama motoru snippet açıklaması..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── SAĞ SÜTUN: CANLI MÜŞTERİ VİTRİN KARTI ÖNİZLEMESİ ─── */}
          <div className={`${activeTab === "form" ? "hidden lg:block" : "block"}`}>
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye size={14} className="text-[#1f7a68]" />
                  Canlı Müşteri Önizlemesi
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                  Canlı Simülasyon
                </span>
              </div>

              {/* Vitrin Kartı */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition">
                {/* Kart Görseli */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={coverImage || "/lizart-logo-original.png"}
                    alt={name || "Paket"}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-xl bg-slate-900/80 px-3 py-1 text-[11px] font-black text-white backdrop-blur-md">
                      {type === "website"
                        ? "Web Sitesi"
                        : type === "app"
                          ? "Mobil Uygulama"
                          : type === "webapp"
                            ? "Web Uygulaması"
                            : "Hizmet"}
                    </span>
                    {isFeatured && (
                      <span className="rounded-xl bg-[#1f7a68] px-2.5 py-1 text-[11px] font-black text-white shadow-xs">
                        ⭐ Popüler
                      </span>
                    )}
                  </div>

                  {discountRate !== null && discountRate > 0 && (
                    <div className="absolute top-3 right-3 rounded-xl bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-xs">
                      %{discountRate} İndirim
                    </div>
                  )}
                </div>

                {/* Kart İçeriği */}
                <div className="p-5">
                  <h4 className="text-lg font-black text-slate-950 line-clamp-1">
                    {name || "Yeni Dijital Ürün Paketi"}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed">
                    {shortDesc || "Modern, hızlı ve SEO uyumlu profesyonel dijital çözüm paketi."}
                  </p>

                  {/* Fiyat Alanı */}
                  <div className="mt-4 flex items-baseline gap-2 border-t border-slate-100 pt-3">
                    <span className="text-2xl font-black text-slate-950">
                      {numBase ? numBase.toLocaleString("tr-TR") : "18.500"} ₺
                    </span>
                    {numCompare > numBase && (
                      <span className="text-sm font-bold text-slate-400 line-through">
                        {numCompare.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-slate-400 ml-auto">
                      +KDV
                    </span>
                  </div>

                  {/* Teslimat ve Özellikler */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#1f7a68]">
                    <Clock size={14} />
                    <span>{deliveryDays || 7} İş Gününde Teslim</span>
                  </div>

                  {/* Özellik Maddeleri (İlk 4 tanesi) */}
                  <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                    {featuresList.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Rozetler */}
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {hasAdminPanel && (
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        ✓ Admin Panel
                      </span>
                    )}
                    {includesSource && (
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        ✓ Kaynak Kod
                      </span>
                    )}
                    {multiLanguage && (
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        ✓ Çoklu Dil
                      </span>
                    )}
                  </div>

                  {/* Örnek Buton */}
                  <div className="mt-5">
                    <div className="w-full rounded-2xl bg-[#1f7a68] py-3 text-center text-xs font-black text-white shadow-xs">
                      Detayları İncele & Satın Al
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminForm>
    </div>
  );
}

type ProductFormData = {
  id: string;
  name: string;
  slug: string;
  type: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  comparePrice: number | null;
  deliveryDays: number;
  isPublished: boolean;
  isFeatured: boolean;
  hasAdminPanel: boolean;
  includesSource: boolean;
  multiLanguage: boolean;
};

/** Ürünün temel alanlarını düzenleme formu. Fiyatlar TL olarak girilir. */
export function ProductEditForm({
  product,
  categories,
}: {
  product: ProductFormData;
  categories: { id: string; name: string }[];
}) {
  return (
    <AdminForm
      action={(formData) => updateProduct(product.id, formData)}
      submitLabel="Ürünü kaydet"
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ürün adı" name="name" defaultValue={product.name} required />
        <Field label="Slug" name="slug" defaultValue={product.slug} required hint="URL'de görünen ad" />

        <div>
          <label htmlFor="type" className="block text-sm font-black text-slate-900">
            Ürün türü
          </label>
          <select
            id="type"
            name="type"
            defaultValue={product.type}
            className={fieldClass}
          >
            {[
              { value: "website", label: "Web sitesi" },
              { value: "app", label: "Mobil uygulama" },
              { value: "webapp", label: "Web uygulaması" },
              { value: "system", label: "Hazır sistem" },
              { value: "template", label: "Tema / şablon" },
              { value: "service", label: "Hizmet paketi" },
            ].map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-black text-slate-900">
            Kategori
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product.categoryId}
            className={fieldClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Fiyat (₺, KDV hariç)"
          name="basePrice"
          type="number"
          defaultValue={String(product.basePrice / 100)}
          required
        />
        <Field
          label="Eski fiyat (₺, boş bırakılabilir)"
          name="comparePrice"
          type="number"
          defaultValue={product.comparePrice ? String(product.comparePrice / 100) : ""}
        />
        <Field
          label="Teslim süresi (iş günü)"
          name="deliveryDays"
          type="number"
          defaultValue={String(product.deliveryDays)}
          required
        />
      </div>

      <div className="mt-4">
        <label htmlFor="shortDesc" className="block text-sm font-black text-slate-900">
          Kısa açıklama
        </label>
        <input
          id="shortDesc"
          name="shortDesc"
          defaultValue={product.shortDesc}
          maxLength={300}
          required
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-black text-slate-900">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={product.description}
          required
          className={`${fieldClass} h-auto p-3`}
        />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-black text-slate-900">Etiketler</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Checkbox name="isPublished" label="Yayında" defaultChecked={product.isPublished} />
          <Checkbox name="isFeatured" label="Öne çıkan" defaultChecked={product.isFeatured} />
          <Checkbox name="hasAdminPanel" label="Yönetim paneli var" defaultChecked={product.hasAdminPanel} />
          <Checkbox name="includesSource" label="Kaynak kod dahil" defaultChecked={product.includesSource} />
          <Checkbox name="multiLanguage" label="Çoklu dil desteği" defaultChecked={product.multiLanguage} />
        </div>
      </fieldset>
    </AdminForm>
  );
}

/** Yeni sürüm yayınlama formu. */
export function VersionForm({ productId }: { productId: string }) {
  return (
    <AdminForm
      action={(formData) => publishVersion(productId, formData)}
      submitLabel="Sürümü yayınla"
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-58px_rgb(15_23_42/.5)]"
    >
      <p className="text-lg font-black text-slate-950">Yeni sürüm yayınla</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        Sürüm notu, ürünün sahibi olan müşterilerin Güncellemeler sayfasında görünür.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[10rem_1fr]">
        <Field label="Sürüm" name="version" defaultValue="" required hint="Örn. 1.3.0" />
        <div>
          <label htmlFor="changelog" className="block text-sm font-black text-slate-900">
            Değişiklik notu
          </label>
          <textarea
            id="changelog"
            name="changelog"
            rows={4}
            required
            className={`${fieldClass} h-auto p-3`}
          />
        </div>
      </div>
    </AdminForm>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-black text-slate-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        defaultValue={defaultValue}
        required={required}
        className={fieldClass}
      />
      {hint && <p className="mt-1 text-xs font-semibold text-slate-500">{hint}</p>}
    </div>
  );
}

const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#1f7a68] focus:outline-none";

function Checkbox({
  name,
  label,
  defaultChecked,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-slate-900">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="size-4 accent-[#1f7a68]"
      />
      {label}
    </label>
  );
}
