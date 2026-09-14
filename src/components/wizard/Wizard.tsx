"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Cpu,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  HeartPulse,
  HelpCircle,
  Home,
  Languages,
  Laptop,
  Layers,
  Palette,
  Palmtree,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Wrench,
  Zap,
} from "lucide-react";
import { findMatchingProducts, type WizardResult } from "@/lib/actions/wizard";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui";
import { cn, formatPrice } from "@/lib/utils";

export const WIZARD_STEPS = [
  {
    key: "productType",
    shortTitle: "Çözüm Ailesi",
    question: "Hangi dijital çözüme ihtiyacınız var?",
    helper: "İşletmenizin öncelikli hedefine en uygun temel kategoriyi seçin.",
    type: "single" as const,
    options: [
      {
        value: "website",
        label: "Web Sitesi",
        desc: "Kurumsal vitrin, klinik, restoran, portföy veya marka tanıtım sitesi.",
        icon: Globe,
        badge: "En Çok Tercih Edilen",
      },
      {
        value: "app",
        label: "Mobil Uygulama",
        desc: "iOS & Android uygulama mağazalarında çalışan yerel müşteri deneyimi.",
        icon: Smartphone,
        badge: "Mobil Öncelikli",
      },
      {
        value: "webapp",
        label: "Web Uygulaması",
        desc: "Yönetim paneli, SaaS platformu, müşteri portalı veya özel iş akışı.",
        icon: Layers,
        badge: "B2B & SaaS",
      },
      {
        value: "system",
        label: "Hazır Otomasyon Sistemi",
        desc: "Randevu takip, otel rezervasyon, şube stok veya sipariş altyapısı.",
        icon: Cpu,
        badge: "İşletme Yönetimi",
      },
      {
        value: "service",
        label: "Dijital Hizmet Paketi",
        desc: "SEO optimizasyonu, reklam yönetimi, kurumsal kimlik veya bakım desteği.",
        icon: Sparkles,
        badge: "Büyüme & Pazarlama",
      },
      {
        value: "bilmiyorum",
        label: "Emin Değilim, Öneri İstiyorum",
        desc: "İhtiyacınızı ve hedeflerinizi birlikte analiz edip en doğru çözümü belirleyelim.",
        icon: Compass,
        badge: "Danışman Rehberliği",
      },
    ],
  },
  {
    key: "sector",
    shortTitle: "Sektör",
    question: "İşletmeniz hangi sektörde faaliyet gösteriyor?",
    helper: "Sektörünüz, size özel önereceğimiz tasarım dili, kullanıcı akışı ve özellikleri belirler.",
    type: "single" as const,
    options: [
      { value: "kurumsal", label: "Kurumsal & Danışmanlık", desc: "Mali müşavirlik, holding, lojistik, danışmanlık", icon: Building2 },
      { value: "eticaret", label: "Perakende & E-Ticaret", desc: "Online mağaza, giyim, yedek parça, pazar yeri", icon: ShoppingBag },
      { value: "restoran", label: "Restoran, Kafe & Gıda", desc: "QR menü, paket servis, rezervasyon, gıda üretimi", icon: UtensilsCrossed },
      { value: "saglik", label: "Sağlık, Diş & Klinik", desc: "Diş polikliniği, sağlık turizmi, hekim tanıtımı", icon: HeartPulse },
      { value: "emlak", label: "Emlak & Gayrimenkul", desc: "Arsa, konut ilanları, proje tanıtımı, portföy", icon: Home },
      { value: "turizm", label: "Turizm, Otel & Transfer", desc: "Butik otel, filo araç kiralama, tur acentesi", icon: Palmtree },
      { value: "egitim", label: "Eğitim & Akademi", desc: "Kurs, spor okulu, özel ders, online sertifika", icon: GraduationCap },
      { value: "hizmet", label: "Randevulu Hizmetler", desc: "Güzellik salonu, oto ekspertiz, mimarlık stüdyosu", icon: CalendarCheck },
      { value: "yazilim", label: "Yazılım, Teknoloji & B2B", desc: "Sanayi makine, IoT, bulut yazılım, B2B katalog", icon: Laptop },
    ],
  },
  {
    key: "pages",
    shortTitle: "Kapsam",
    question: "Projeniz yaklaşık kaç sayfa veya ekrandan oluşacak?",
    helper: "Sayfa ve ekran derinliği, teslimat süresi ve bütçe planlamasının en kritik faktörüdür.",
    type: "single" as const,
    options: [
      {
        value: "1-5",
        label: "1 – 5 Sayfa (Kompakt / Tanıtım)",
        desc: "Ana sayfa, hakkımızda, hizmetler, iletişim ve dönüşüm odaklı temel sayfalar.",
        icon: FileText,
      },
      {
        value: "6-15",
        label: "6 – 15 Sayfa (Standart Kurumsal)",
        desc: "Detaylı hizmet sayfaları, referans galerisi, blog ve kurumsal içerikler.",
        icon: Layers,
      },
      {
        value: "16-40",
        label: "16 – 40 Sayfa (Genişletilmiş Katalog)",
        desc: "Kapsamlı ürün katalogları, çoklu kategoriler ve zengin alt sayfalar.",
        icon: ShoppingBag,
      },
      {
        value: "40+",
        label: "40+ Sayfa (Büyük Ölçekli Portal)",
        desc: "Zengin veri tabanı, çok şubeli yapı veya yüksek hacimli içerik mimarisi.",
        icon: Laptop,
      },
    ],
  },
  {
    key: "features",
    shortTitle: "Özellikler",
    question: "Projenizde hangi özelliklerin bulunmasını istersiniz?",
    helper: "Birden fazla seçenek işaretleyebilirsiniz. En uygun hazır paketi ve ek modülleri buna göre seçeceğiz.",
    type: "multi" as const,
    options: [
      { value: "panel", label: "Kolay Yönetim Paneli", desc: "Kod bilmeden içerik ve görsel güncelleme", icon: ShieldCheck },
      { value: "eticaret", label: "E-Ticaret & Ürün Kataloğu", desc: "Sepet, stok ve ürün varyasyon yönetimi", icon: ShoppingBag },
      { value: "odeme", label: "Online Sanal POS & Ödeme", desc: "İyzico, PayTR, Stripe kredi kartı tahsilatı", icon: CreditCard },
      { value: "coklu-dil", label: "Çoklu Dil Altyapısı", desc: "İngilizce, Arapça, Almanca vb. global yayın", icon: Languages },
      { value: "randevu", label: "Online Randevu & Takvim", desc: "SMS/E-posta onaylı otomatik randevu akışı", icon: Calendar },
      { value: "uyelik", label: "Kullanıcı & Üyelik Sistemi", desc: "Giriş yap, profil yönetimi, sipariş geçmişi", icon: Users },
      { value: "kargo", label: "Otomatik Kargo Entegrasyonu", desc: "Yurtiçi, MNG, Aras kargo fişi ve takip", icon: Truck },
      { value: "mobil", label: "Mobil Uyumlu & Responsive", desc: "iPhone, iPad ve tüm ekranlarda kusursuz deneyim", icon: Smartphone },
      { value: "seo", label: "İleri Düzey SEO Optimizasyonu", desc: "Google aramalarında üst sıralara çıkma altyapısı", icon: TrendingUp },
      { value: "logo", label: "Logo & Kurumsal Kimlik Desteği", desc: "Renk paleti, yazı tipi ve tipografi rehberi", icon: Palette },
      { value: "icerik", label: "İçerik & Metin Girişi", desc: "Hizmet ve ürün içeriklerinin uzman ekipçe girilmesi", icon: FileText },
      { value: "kurulum", label: "Anahtar Teslim Kurulum", desc: "Domain, SSL ve hosting kurulumunun üstlenilmesi", icon: Wrench },
      { value: "bakim", label: "12 Ay Teknik Destek & Bakım", desc: "Yıllık güvenlik, yedekleme ve sistem güncellemeleri", icon: Headphones },
      { value: "kaynak-kod", label: "Tam Kaynak Kod Mülkiyeti", desc: "Tüm kaynak kodların işletmenize devredilmesi", icon: Code2 },
    ],
  },
  {
    key: "timeline",
    shortTitle: "Teslimat",
    question: "Projenizin ne zaman yayına alınmasını hedefliyorsunuz?",
    helper: "Acil ihtiyaçlarınızda 48 saatte kurulan satışa hazır vitrinlerimizi önceliklendiriyoruz.",
    type: "single" as const,
    options: [
      {
        value: "hemen",
        label: "Hemen / 48 Saat İçinde",
        desc: "Satışa hazır şablon ve ekspres kurulumla 2 günde canlı yayında.",
        icon: Zap,
        badge: "Ekspres Teslimat",
      },
      {
        value: "1-hafta",
        label: "1 Hafta İçinde",
        desc: "Hızlı içerik aktarımı, domain/e-posta ayarları ve test süreci.",
        icon: Clock,
        badge: "Hızlı Kurulum",
      },
      {
        value: "1-ay",
        label: "1 Ay İçinde",
        desc: "Özelleştirilmiş tasarım detayları, kurumsal revizyonlar ve tam uyum.",
        icon: CalendarDays,
        badge: "Özel Planlama",
      },
      {
        value: "esnek",
        label: "Esnek / Planlama Aşamasındayız",
        desc: "Adım adım, en yüksek kalite ve titizlikle geliştirme süreci.",
        icon: CalendarRange,
        badge: "Stratejik Süreç",
      },
    ],
  },
  {
    key: "budget",
    shortTitle: "Bütçe",
    question: "Bu yatırım için öngördüğünüz yaklaşık bütçe aralığı nedir?",
    helper: "Bütçenize tam oturan hazır ürünleri listeler, bütçenizi aşan gereksiz masrafları eleriz.",
    type: "single" as const,
    options: [
      {
        value: "10-25",
        label: "10.000 ₺ – 25.000 ₺",
        desc: "Hazır kurumsal web siteleri, tek sayfa landing pageler ve hızlı vitrinler.",
        icon: Sparkles,
      },
      {
        value: "25-50",
        label: "25.000 ₺ – 50.000 ₺",
        desc: "Gelişmiş e-ticaret siteleri, randevulu klinik portalları ve çok dilli siteler.",
        icon: ShoppingBag,
      },
      {
        value: "50-100",
        label: "50.000 ₺ – 100.000 ₺",
        desc: "Özel yazılım altyapısı, mobil uygulama veya yüksek hacimli rezervasyon sistemleri.",
        icon: Laptop,
      },
      {
        value: "100+",
        label: "100.000 ₺ ve Üzeri",
        desc: "Kapsamlı özel SaaS platformları, B2B bayi portalları ve entegre dijital ekosistemler.",
        icon: Building2,
      },
      {
        value: "bilmiyorum",
        label: "Henüz Belirlemedim",
        desc: "Uzman danışmanımızın sunacağı öneri ve fiyat tablosuna göre karar vereceğim.",
        icon: HelpCircle,
      },
    ],
  },
];

type Answers = {
  productType?: string;
  sector?: string;
  pages?: string;
  features: string[];
  timeline?: string;
  budget?: string;
};

export function Wizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ features: [] });
  const [result, setResult] = useState<WizardResult | null>(null);
  const [pending, startTransition] = useTransition();

  const current = WIZARD_STEPS[step];
  const isLast = step === WIZARD_STEPS.length - 1;

  const selected =
    current.type === "multi"
      ? answers.features
      : [(answers[current.key as keyof Answers] as string | undefined) ?? ""];

  function choose(value: string) {
    if (current.type === "multi") {
      setAnswers((prev) => ({
        ...prev,
        features: prev.features.includes(value)
          ? prev.features.filter((f) => f !== value)
          : [...prev.features, value],
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [current.key]: value }));
    }
  }

  function next() {
    if (!isLast) {
      setStep((s) => s + 1);
      // Smooth scroll to top of wizard on mobile
      const el = document.getElementById("sihirbaz-karti");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    startTransition(async () => {
      const res = await findMatchingProducts({
        productType: answers.productType ?? "bilmiyorum",
        sector: answers.sector ?? "",
        pages: answers.pages as any,
        features: answers.features,
        budget: answers.budget ?? "bilmiyorum",
        timeline: answers.timeline ?? "esnek",
      });
      setResult(res);
      const el = document.getElementById("sihirbaz-karti");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const canProceed =
    current.type === "multi"
      ? answers.features.length > 0
      : Boolean(answers[current.key as keyof Answers]);

  const progressPercent = Math.round(((step + 1) / WIZARD_STEPS.length) * 100);

  /* ═════════════════════════════════════════════════════════════
     SONUÇ EKRANI (Önerilen Ürünler ve Bütçe)
     ═════════════════════════════════════════════════════════════ */
  if (result) {
    return (
      <div id="sihirbaz-karti" className="mx-auto max-w-5xl scroll-mt-24">
        {/* Başarı Başlığı */}
        <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-xl shadow-ink-900/5">
          {/* Üst Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#07241a] via-[#0d3d2c] to-[#081a13] p-6 sm:p-10 text-white">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 size-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                  <CheckCircle2 className="size-4" />
                  Kişiselleştirilmiş Analiz Tamamlandı
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                  <Sparkles className="size-3.5 text-amber-300" />
                  %98 İhtiyaç Uyumu
                </span>
              </div>

              <h2 className="mt-5 text-2xl sm:text-4xl font-black tracking-tight text-white">
                İşletmeniz İçin En Doğru Çözümler Belirlendi
              </h2>
              <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-emerald-100/90">
                {result.note}
              </p>

              {/* Bütçe ve Kapsam Göstergesi */}
              {result.estimateMax > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 max-w-2xl">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                      Öngörülen Bütçe Aralığı
                    </p>
                    <p className="mt-1.5 text-2xl sm:text-3xl font-black text-white">
                      {formatPrice(result.estimateMin)} – {formatPrice(result.estimateMax)}
                      <span className="ml-1.5 text-xs font-medium text-emerald-200">+ KDV</span>
                    </p>
                    <p className="mt-1 text-xs text-emerald-200/80">
                      Seçilen modüller ve tahmini sayfa derinliğine göre hesaplanmıştır.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                        Teslimat Güvencesi
                      </p>
                      <p className="mt-1.5 text-lg font-bold text-white">
                        {answers.timeline === "hemen" ? "48 Saatte Kurulum" : "Sözleşmeli & Garantili"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-emerald-200/90">
                      <ShieldCheck className="size-4 text-emerald-300 shrink-0" />
                      <span>12 ay teknik destek &amp; SSL dahil</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Eşleşen Ürünler */}
          <div className="p-6 sm:p-10">
            {result.products.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-ink-950">
                      Sizin İçin Eşleşen Katalog Paketleri
                    </h3>
                    <p className="text-xs text-ink-500 mt-0.5">
                      Canlı demoları inceleyebilir, paketi doğrudan sepete ekleyebilirsiniz.
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-700">
                    {result.products.length} Çözüm Önerildi
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {result.products.map((p, index) => (
                    <ProductCard key={p.id} product={p} featured={index === 0} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-4">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="text-lg font-black text-ink-900">Özel Geliştirme Önerisi</h3>
                <p className="mt-2 max-w-md mx-auto text-sm text-ink-600 leading-relaxed">
                  Belirttiğiniz kapsam standart hazır şablonların ötesinde özel entegrasyonlar içeriyor. Sizin için anahtar teslim özel bir mimari hazırlayalım.
                </p>
              </div>
            )}

            {/* Aksiyon Butonları */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-ink-100">
              <div className="flex flex-wrap items-center gap-3">
                {result.needsCustomOffer && (
                  <ButtonLink
                    href="/teklif"
                    size="lg"
                    className="rounded-2xl bg-brand-600 font-bold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
                  >
                    <span>Özel Teklif İste</span>
                    <ArrowUpRight className="size-4" />
                  </ButtonLink>
                )}
                <ButtonLink
                  href="/magaza"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-ink-200 bg-white font-bold text-ink-800 hover:border-brand-400 hover:bg-brand-50"
                >
                  Tüm Kataloğu İncele
                </ButtonLink>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setStep(0);
                  setAnswers({ features: [] });
                }}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-4" />
                Sihirbazı Baştan Başlat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     ADIM ADIM SORU FORMU EKRANI
     ═════════════════════════════════════════════════════════════ */
  return (
    <div id="sihirbaz-karti" className="mx-auto max-w-5xl scroll-mt-24">
      {/* ─── Modern Stepper Göstergesi ─── */}
      <div className="mb-6 hidden sm:grid grid-cols-6 gap-2">
        {WIZARD_STEPS.map((s, idx) => {
          const isCurrent = idx === step;
          const isDone = idx < step;
          return (
            <button
              key={s.key}
              type="button"
              disabled={idx > step}
              onClick={() => {
                if (idx < step) setStep(idx);
              }}
              className={cn(
                "flex flex-col items-center text-center p-3 rounded-2xl border transition-all text-xs font-bold",
                isCurrent && "border-brand-500 bg-white shadow-md shadow-brand-500/10 text-brand-700 ring-2 ring-brand-500/20",
                isDone && "border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/70 cursor-pointer",
                !isCurrent && !isDone && "border-ink-100 bg-white/70 text-ink-400 opacity-60 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "size-7 rounded-full flex items-center justify-center text-xs font-black mb-1.5 transition-colors",
                  isCurrent && "bg-brand-600 text-white",
                  isDone && "bg-emerald-600 text-white",
                  !isCurrent && !isDone && "bg-ink-100 text-ink-500"
                )}
              >
                {isDone ? <Check className="size-3.5" /> : idx + 1}
              </span>
              <span className="truncate w-full font-semibold">{s.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Ana Kart ─── */}
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-xl shadow-ink-900/5">
        {/* Üst İlerleme ve Adım Barı */}
        <div className="border-b border-ink-100 bg-surface-2/60 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-700">
                <Sparkles className="size-3 text-brand-600" />
                Adım {step + 1} / {WIZARD_STEPS.length}
              </span>
              <span className="text-xs font-medium text-ink-500">· {current.shortTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-brand-700">%{progressPercent} Tamamlandı</span>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-ink-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Soru Başlığı */}
        <div className="px-6 pt-8 sm:px-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink-950">
              {current.question}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-500 leading-relaxed">
              {current.helper}
            </p>
          </div>

          {current.type === "multi" && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs font-bold text-amber-800">
              <span>{answers.features.length} özellik seçildi</span>
              <span className="text-amber-500">•</span>
              <span className="font-normal text-amber-700">Birden fazla işaretleyebilirsiniz</span>
            </div>
          )}
        </div>

        {/* Seçenekler Listesi (Zengin Görsel Kartlar) */}
        <div className="p-6 sm:p-10">
          <div
            className={cn(
              "grid gap-3.5",
              current.options.length <= 4
                ? "sm:grid-cols-2"
                : current.key === "sector"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : current.key === "features"
                ? "sm:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {current.options.map((option) => {
              const active = selected.includes(option.value);
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(option.value)}
                  className={cn(
                    "group relative flex items-start gap-4 rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer",
                    active
                      ? "border-brand-600 bg-gradient-to-br from-brand-50/70 to-emerald-50/40 shadow-md shadow-brand-600/10 ring-2 ring-brand-600/20 translate-y-[-1px]"
                      : "border-ink-100 bg-white hover:border-brand-300 hover:bg-surface-2 hover:shadow-sm"
                  )}
                >
                  {/* İkon */}
                  {Icon && (
                    <div
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-xl border transition-colors",
                        active
                          ? "border-brand-300 bg-brand-600 text-white shadow-xs"
                          : "border-ink-100 bg-surface-2 text-ink-600 group-hover:border-brand-200 group-hover:text-brand-600 group-hover:bg-white"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                  )}

                  {/* İçerik */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "block text-sm font-bold tracking-tight transition-colors",
                          active ? "text-brand-900" : "text-ink-900 group-hover:text-ink-950"
                        )}
                      >
                        {option.label}
                      </span>

                      {/* Seçim Rozeti (Radio / Checkbox) */}
                      <span
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border transition-all",
                          active
                            ? "border-brand-600 bg-brand-600 text-white scale-110 shadow-xs"
                            : "border-ink-200 bg-white text-transparent group-hover:border-brand-400"
                        )}
                      >
                        <Check className="size-3 stroke-[3]" />
                      </span>
                    </div>

                    {"desc" in option && option.desc && (
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed transition-colors",
                          active ? "text-brand-800/80" : "text-ink-500"
                        )}
                      >
                        {option.desc}
                      </p>
                    )}

                    {"badge" in option && option.badge && (
                      <span
                        className={cn(
                          "mt-2.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          active
                            ? "bg-brand-600 text-white"
                            : "bg-ink-100 text-ink-600 group-hover:bg-brand-100 group-hover:text-brand-700"
                        )}
                      >
                        {option.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Alt Kontrol & İlerleme Barı ─── */}
        <div className="flex items-center justify-between gap-4 border-t border-ink-100 bg-surface-2/70 px-6 py-5 sm:px-10">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-ink-700 transition-all hover:bg-ink-50 hover:border-ink-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-4" />
            <span>Önceki Adım</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-ink-500">
            <span>Soru {step + 1} / {WIZARD_STEPS.length}</span>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={!canProceed || pending}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all cursor-pointer",
              canProceed
                ? "bg-brand-600 hover:bg-brand-700 shadow-brand-600/25 hover:scale-[1.02]"
                : "bg-ink-300 opacity-60 cursor-not-allowed"
            )}
          >
            <span>
              {pending
                ? "Analiz Ediliyor..."
                : isLast
                ? "En Uygun Paketleri Göster"
                : "Devam Et"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ─── Alt Danışman & Güvence Kartı ─── */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-2xs">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Zap className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900">48 Saatte Canlı Yayın</p>
            <p className="text-[11px] text-ink-500">Hazır ürünlerde ekspres kurulum</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-2xs">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900">12 Ay Garanti &amp; Destek</p>
            <p className="text-[11px] text-ink-500">Teknik bakım ve güvenlik güvencesi</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-ink-100 bg-white p-4 shadow-2xs">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900">Özel Teklif Esnekliği</p>
            <p className="text-[11px] text-ink-500">Katalog dışı özel yazılım çözümleri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
