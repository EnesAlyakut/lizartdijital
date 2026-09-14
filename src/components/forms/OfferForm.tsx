"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Globe,
  Layers,
  Lock,
  Mail,
  Megaphone,
  Palette,
  Phone,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { createOffer } from "@/lib/actions/marketing";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/constants";

const BUDGETS = [
  { label: "15.000 – 35.000 ₺", desc: "Kompakt kurumsal vitrin ve hazır paketler" },
  { label: "35.000 – 75.000 ₺", desc: "Özelleştirilmiş web & gelişmiş e-ticaret" },
  { label: "75.000 – 150.000 ₺", desc: "Özel yazılım altyapısı & mobil uygulama" },
  { label: "150.000 ₺ ve Üzeri", desc: "Kapsamlı kurumsal portal & SaaS ekosistemi" },
  { label: "Birlikte Belirleyelim", desc: "Teknik analize göre kapsam & bütçelendirme" },
];

const TIMELINES = [
  { id: "urgent", label: "Acil (1-2 Hafta)", desc: "Hazır şablon ile ekspres canlı yayın", icon: Zap },
  { id: "1month", label: "1 Ay İçinde", desc: "Standart tasarım & geliştirme sprinti", icon: Clock },
  { id: "2-3months", label: "2-3 Ay İçinde", desc: "Geniş kapsamlı özel mimari & testler", icon: Calendar },
  { id: "planning", label: "Planlama Aşamasında", desc: "Fizibilite, teklif ve bütçe araştırması", icon: Sparkles },
];

const SERVICES = [
  {
    id: "Hazır web sitesi",
    label: "Hazır Web Sitesi",
    sub: "Hızlı, şık ve sektörel hazır vitrin",
    icon: Globe,
    badge: "48s Teslim",
  },
  {
    id: "E-ticaret sitesi",
    label: "E-Ticaret Platformu",
    sub: "Online ödeme, kargo & stok yönetimi",
    icon: ShoppingBag,
    badge: "Satış Odaklı",
  },
  {
    id: "Mobil uygulama",
    label: "Mobil Uygulama",
    sub: "iOS & Android (React Native)",
    icon: Smartphone,
    badge: "Mobil Öncelikli",
  },
  {
    id: "Özel yazılım",
    label: "Özel Yazılım & ERP",
    sub: "Şirketinize özel iş süreçleri & API",
    icon: Cpu,
    badge: "Özel Mimari",
  },
  {
    id: "Web portalı / panel",
    label: "Web Portalı & Panel",
    sub: "B2B bayi veya müşteri yönetim portalı",
    icon: Layers,
    badge: "Yönetim Paneli",
  },
  {
    id: "SEO & Organik Büyüme",
    label: "SEO & Organik Büyüme",
    sub: "Google aramalarında üst sıralara çıkış",
    icon: TrendingUp,
    badge: "Sıralama Artışı",
  },
  {
    id: "Reklam yönetimi",
    label: "Dijital Reklam Yönetimi",
    sub: "Google Ads ve Meta reklam optimizasyonu",
    icon: Megaphone,
    badge: "Dönüşüm Odaklı",
  },
  {
    id: "Sosyal medya",
    label: "Sosyal Medya Yönetimi",
    sub: "Görsel içerik, marka kimliği ve etkileşim",
    icon: Share2,
    badge: "Marka İtibarı",
  },
  {
    id: "Kurumsal kimlik / tasarım",
    label: "Kurumsal Kimlik & UI/UX",
    sub: "Logo, renk rehberi ve arayüz tasarımı",
    icon: Palette,
    badge: "Prestij Tasarım",
  },
];

const FORM_STEPS = [
  { num: 1, title: "Kapsam & Servisler" },
  { num: 2, title: "Bütçe & Takvim" },
  { num: 3, title: "Yetkili Bilgileri" },
  { num: 4, title: "Proje Notları" },
];

export function OfferForm({ className }: { className?: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pending, startTransition] = useTransition();
  const [resultData, setResultData] = useState<{
    ok: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const [interests, setInterests] = useState<string[]>(["Hazır web sitesi"]);
  const [selectedBudget, setSelectedBudget] = useState<string>("35.000 – 75.000 ₺");
  const [selectedTimeline, setSelectedTimeline] = useState<string>("1 Ay İçinde");

  // Input states for validation
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 && interests.length === 0) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /* ═════════════════════════════════════════════════════════════
     BAŞARILI GÖNDERİM EKRANI
     ═════════════════════════════════════════════════════════════ */
  if (resultData?.ok) {
    return (
      <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-white p-8 sm:p-12 shadow-xl shadow-emerald-950/5 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-to-tr from-brand-600 to-emerald-500 text-white shadow-lg shadow-brand-600/30">
          <CheckCircle2 size={42} strokeWidth={2.5} />
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-brand-700">
          <Sparkles size={14} />
          Teklif Talebiniz Alındı
        </span>

        <h2 className="mt-3 text-2xl font-black text-ink-950 sm:text-3xl">
          Talebiniz Başarıyla Kaydedildi
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-600">
          {resultData.message}
        </p>

        <div className="mx-auto mt-6 max-w-md rounded-2xl border border-ink-100 bg-white p-5 text-left shadow-xs">
          <h4 className="text-xs font-black uppercase tracking-wider text-ink-400">
            Sırada Ne Var?
          </h4>
          <ul className="mt-3 space-y-2.5 text-xs text-ink-700">
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-black text-brand-700">
                1
              </span>
              <span>Teknik mimarımız gereksinimlerinizi inceler (Ortalama 2 saat).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-black text-brand-700">
                2
              </span>
              <span>Gerekli durumlarda 15 dakikalık online keşif görüşmesi planlanır.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-black text-brand-700">
                3
              </span>
              <span>Detaylı kapsam, teslim takvimi ve sabit fiyat teklifi e-posta ile sunulur.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappLink("Merhaba, web sitenizden resmi teklif talebi oluşturdum. Süreci hızlandırmak için bilgi alabilir miyim?")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#128c7e] hover:bg-[#0e7064] px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#128c7e]/20 transition-all hover:scale-[1.02]"
          >
            <span>WhatsApp ile Hızlı Görüş</span>
            <ArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => {
              setResultData(null);
              setCurrentStep(1);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-ink-200 bg-white px-6 text-xs sm:text-sm font-bold text-ink-700 hover:bg-surface-2 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            Yeni Teklif Formu Doldur
          </button>
        </div>
      </div>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     FORM AKIŞI
     ═════════════════════════════════════════════════════════════ */
  return (
    <form
      className={cn("space-y-6", className)}
      action={(formData) =>
        startTransition(async () => {
          formData.set(
            "answers",
            JSON.stringify({
              interests,
              timeline: selectedTimeline,
            })
          );
          formData.set("budget", selectedBudget);
          formData.set("fullName", fullName);
          formData.set("email", email);
          formData.set("phone", phone);
          formData.set("company", company);
          formData.set("message", message);

          const result = await createOffer(formData);
          if (result.ok) {
            setResultData({ ok: true, message: result.message });
          } else {
            setResultData({ ok: false, error: result.error });
          }
        })
      }
    >
      {/* ─── 4 ADIMLI İNTERAKTİF STEPPER BAR ─── */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {FORM_STEPS.map((s) => {
          const isCurrent = s.num === currentStep;
          const isDone = s.num < currentStep;

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num < currentStep) setCurrentStep(s.num);
              }}
              className={cn(
                "flex flex-col items-center sm:items-start p-3 rounded-2xl border transition-all text-left",
                isCurrent && "border-brand-500 bg-brand-50/40 text-brand-900 shadow-sm ring-1 ring-brand-500/20",
                isDone && "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50/50 cursor-pointer",
                !isCurrent && !isDone && "border-ink-100 bg-surface-2/60 text-ink-400 opacity-60 cursor-not-allowed"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-xs font-black transition-colors",
                    isCurrent && "bg-brand-600 text-white",
                    isDone && "bg-emerald-600 text-white",
                    !isCurrent && !isDone && "bg-ink-200 text-ink-500"
                  )}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : s.num}
                </span>
                <span className="hidden sm:inline text-xs font-bold truncate">
                  {s.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── ADIM 1: İLGİLENİLEN ÇÖZÜMLER & KAPSAM ───────────────────── */}
      {currentStep === 1 && (
        <section className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-200">
          <div className="border-b border-ink-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                  Adım 1 / 4
                </span>
                <h3 className="mt-1 text-lg sm:text-xl font-black text-ink-950">
                  İlgilendiğiniz Çözümler ve Servisler
                </h3>
              </div>
              <span className="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-700">
                {interests.length} Servis Seçildi
              </span>
            </div>
            <p className="mt-2 text-xs text-ink-500">
              Projeniz için ihtiyaç duyduğunuz tüm alanları işaretleyebilirsiniz.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map((s) => {
              const active = interests.includes(s.id);
              const Icon = s.icon;

              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInterest(s.id)}
                  className={cn(
                    "group relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150 cursor-pointer",
                    active
                      ? "border-brand-600 bg-gradient-to-br from-brand-50/60 to-white shadow-xs ring-2 ring-brand-600/15"
                      : "border-ink-100 bg-surface-2/40 hover:border-brand-200 hover:bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl transition-colors",
                      active
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-white text-ink-600 border border-ink-100 group-hover:border-brand-300 group-hover:text-brand-700"
                    )}
                  >
                    <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-black text-ink-950 leading-snug">
                        {s.label}
                      </p>
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full text-[10px] transition-all",
                          active
                            ? "bg-brand-600 text-white scale-110"
                            : "border border-ink-300 text-transparent"
                        )}
                      >
                        <Check size={11} strokeWidth={3} />
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-ink-500 leading-tight">
                      {s.sub}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                        active ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"
                      )}
                    >
                      {s.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer"
            >
              <span>Bütçe ve Takvime Geç</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* ─── ADIM 2: BÜTÇE & HEDEFLENEN TAKVİM ──────────────────────── */}
      {currentStep === 2 && (
        <section className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-200">
          <div className="border-b border-ink-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Adım 2 / 4
            </span>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-ink-950">
              Bütçe Planı &amp; Hedeflenen Teslim Takvimi
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              Teknik mimariyi ve kaynak tahsisini en doğru şekilde optimize etmemizi sağlar.
            </p>
          </div>

          {/* Bütçe Seçimi */}
          <div className="mt-6">
            <label className="block text-xs font-black uppercase tracking-wider text-ink-700 mb-3">
              Tahmini Bütçe Aralığınız
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BUDGETS.map((b) => {
                const active = selectedBudget === b.label;
                return (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => setSelectedBudget(b.label)}
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-150 cursor-pointer",
                      active
                        ? "border-brand-600 bg-gradient-to-br from-brand-50/60 to-white shadow-xs ring-2 ring-brand-600/15"
                        : "border-ink-100 bg-surface-2/40 hover:border-brand-200 hover:bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-ink-950">{b.label}</span>
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full text-[9px] transition-all",
                          active ? "bg-brand-600 text-white" : "border border-ink-300 text-transparent"
                        )}
                      >
                        <Check size={10} strokeWidth={3} />
                      </span>
                    </div>
                    <span className="mt-1.5 text-[11px] font-medium text-ink-500 leading-tight">
                      {b.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zamanlama / Başlangıç */}
          <div className="mt-8 pt-6 border-t border-ink-100">
            <label className="block text-xs font-black uppercase tracking-wider text-ink-700 mb-3">
              Hedeflenen Canlı Yayın &amp; Teslimat Takvimi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TIMELINES.map((t) => {
                const active = selectedTimeline === t.label;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTimeline(t.label)}
                    className={cn(
                      "rounded-2xl border p-3.5 text-left transition-all cursor-pointer flex flex-col justify-between",
                      active
                        ? "border-brand-600 bg-brand-50/50 ring-2 ring-brand-600/15"
                        : "border-ink-100 bg-surface-2/40 hover:border-brand-200 hover:bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-ink-900">{t.label}</p>
                      <Icon size={14} className={active ? "text-brand-600" : "text-ink-400"} />
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-ink-500 leading-tight">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 px-5 py-3 text-xs sm:text-sm font-bold text-ink-700 hover:bg-surface-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Geri</span>
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all cursor-pointer"
            >
              <span>İletişim Bilgilerine Geç</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* ─── ADIM 3: İLETİŞİM & ŞİRKET BİLGİLERİ ─────────────────────── */}
      {currentStep === 3 && (
        <section className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-200">
          <div className="border-b border-ink-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Adım 3 / 4
            </span>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-ink-950">
              Yetkili Kişi &amp; İletişim Bilgileri
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              Resmi teklif ve teknik analiz raporunu ileteceğimiz yetkili kişi bilgileri.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {/* Ad Soyad */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-black uppercase tracking-wider text-ink-700">
                Yetkili Adı Soyadı <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-400">
                  <User size={16} />
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Örn: Serdar Koç"
                  className="h-12 w-full rounded-2xl border border-ink-200 bg-surface-2/40 pl-10 pr-4 text-xs sm:text-sm font-bold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Kurumsal E-posta */}
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-ink-700">
                Kurumsal E-posta Adresi <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-400">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="serdar@sirketiniz.com"
                  className="h-12 w-full rounded-2xl border border-ink-200 bg-surface-2/40 pl-10 pr-4 text-xs sm:text-sm font-bold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Telefon */}
            <div>
              <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-ink-700">
                Telefon Numarası
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-400">
                  <Phone size={16} />
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0532 000 00 00"
                  className="h-12 w-full rounded-2xl border border-ink-200 bg-surface-2/40 pl-10 pr-4 text-xs sm:text-sm font-bold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            {/* Şirket / Kurum */}
            <div>
              <label htmlFor="company" className="block text-xs font-black uppercase tracking-wider text-ink-700">
                Firma / Kurum Ünvanı <span className="text-[10px] font-normal text-ink-400">(İsteğe bağlı)</span>
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-0 grid w-10 place-items-center text-ink-400">
                  <Building2 size={16} />
                </span>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Örn: Koç Teknoloji A.Ş."
                  className="h-12 w-full rounded-2xl border border-ink-200 bg-surface-2/40 pl-10 pr-4 text-xs sm:text-sm font-bold text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 px-5 py-3 text-xs sm:text-sm font-bold text-ink-700 hover:bg-surface-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Geri</span>
            </button>
            <button
              type="button"
              disabled={!fullName.trim() || !email.trim()}
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Son Adıma Geç (Proje Notu)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* ─── ADIM 4: PROJE NOTLARI & ONAY ────────────────────────────── */}
      {currentStep === 4 && (
        <section className="rounded-3xl border border-ink-100 bg-white p-6 sm:p-8 shadow-xs animate-in fade-in-50 duration-200">
          <div className="border-b border-ink-100 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
              Adım 4 / 4
            </span>
            <h3 className="mt-1 text-lg sm:text-xl font-black text-ink-950">
              Proje Detayları &amp; Onay
            </h3>
            <p className="mt-1 text-xs text-ink-500">
              Hedeflerinizi, mevcut sisteminizi veya beğendiğiniz örnek platformları belirtebilirsiniz.
            </p>
          </div>

          {/* Özet Kartı */}
          <div className="mt-5 rounded-2xl border border-brand-200 bg-brand-50/40 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700 mb-2">
              Seçim Özeti
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-white border border-brand-200 px-2.5 py-1 font-bold text-ink-800">
                {interests.join(", ")}
              </span>
              <span className="rounded-lg bg-white border border-brand-200 px-2.5 py-1 font-bold text-ink-800">
                Bütçe: {selectedBudget}
              </span>
              <span className="rounded-lg bg-white border border-brand-200 px-2.5 py-1 font-bold text-ink-800">
                Takvim: {selectedTimeline}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-ink-700 mb-2">
              Proje Açıklaması &amp; Ek İstekler
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={4000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Projeniz hakkında aklınızdakileri kısaca özetleyin:&#10;• Şirketinizin sektörü ve hedef kitlesi nedir?&#10;• Sistemde hangi temel özelliklerin (entegrasyon, kullanıcı paneli vb.) olmasını istiyorsunuz?&#10;• Varsa referans beğendiğiniz örnek platformlar..."
              className="w-full rounded-2xl border border-ink-200 bg-surface-2/40 p-4 text-xs sm:text-sm font-medium leading-relaxed text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
          </div>

          {/* NDA Güvencesi */}
          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                <Lock size={14} />
              </span>
              <div className="text-xs text-ink-700 leading-relaxed">
                <span className="font-bold text-emerald-950">Yasal Gizlilik ve NDA Koruması: </span>
                Formda paylaştığınız tüm proje detayları kurumsal gizlilik politikamız ve talep halinde karşılıklı imzalanacak <strong>Gizlilik Sözleşmesi (NDA)</strong> güvencesi altındadır.{" "}
                <Link href="/kurumsal/kvkk-aydinlatma-metni" className="font-bold text-brand-700 underline hover:text-brand-900">
                  KVKK Aydınlatma Metni
                </Link>
              </div>
            </div>
          </div>

          {/* Hata Mesajı Banner */}
          {resultData?.error && (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              ⚠️ {resultData.error}
            </div>
          )}

          {/* Submit ve Geri Butonları */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-ink-100">
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-2 rounded-2xl border border-ink-200 px-5 py-3 text-xs sm:text-sm font-bold text-ink-700 hover:bg-surface-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Geri</span>
            </button>

            <button
              type="submit"
              disabled={pending}
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-brand-600 hover:bg-brand-700 px-8 text-xs sm:text-sm font-bold text-white shadow-lg shadow-brand-600/25 transition-all hover:scale-[1.01] disabled:opacity-60 cursor-pointer"
            >
              <span className="size-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>{pending ? "Teklif Dosyanız Hazırlanıyor..." : "Resmi Teklif ve Kapsam Dosyası İste"}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
