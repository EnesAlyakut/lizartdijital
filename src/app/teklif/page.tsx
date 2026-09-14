import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  HelpCircle,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { OfferForm } from "@/components/forms/OfferForm";
import { Breadcrumb } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Özel Teklif İsteyin — Sabit Fiyat ve Net Kapsam | Lizart Dijital",
  description:
    "Hazır kurumsal çözümler veya özel yazılım projeleriniz için aynı iş gününde şeffaf kapsam ve sabit fiyat teklifinizi alın. Ücretsiz keşif görüşmesi dahildir.",
  alternates: { canonical: `${SITE.url}/teklif` },
};

const GUARANTEES = [
  "Aynı iş günü detaylı teknik inceleme ve yanıt",
  "Gizlilik sözleşmesi (NDA) ile %100 yasal güvence",
  "Sabit fiyat garantisi — sürpriz ek maliyet yok",
  "30 dakikalık ücretsiz online keşif & strateji toplantısı",
];

const STEPS = [
  {
    num: "01",
    title: "Talebinizi İletiyorsunuz",
    desc: "4 adımlı kısa formu tamamlayın. Teknik mimarımız aynı iş gününde analizi tamamlar.",
  },
  {
    num: "02",
    title: "Ücretsiz Keşif & Analiz",
    desc: "Gerektiğinde 30 dakikalık online toplantıda hedeflerinizi netleştirip sorularınızı yanıtlarız.",
  },
  {
    num: "03",
    title: "Kapsam & Sabit Fiyat Teklifi",
    desc: "Tüm ekranlar, entegrasyonlar, teslimat takvimi ve kesin maliyet resmi dosya olarak sunulur.",
  },
  {
    num: "04",
    title: "Sözleşme & Canlı Yayın",
    desc: "NDA ve sözleşme imzalanır, geliştirme başlar ve anahtar teslim canlı yayına alınır.",
  },
];

export default function OfferPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      {/* ════════════════════════════════════════
          1. LÜKS HERO BANNER
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#051711] via-[#0a291f] to-[#04130d] text-white">
        {/* Glow & Ambient Aydınlatma */}
        <div className="pointer-events-none absolute -left-32 -top-32 size-[520px] rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-0 size-[420px] rounded-full bg-brand-500/10 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-emerald-600/10 blur-[140px]" />

        {/* İnce çizgi doku */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container-page relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Breadcrumb
            items={[{ label: "Ana Sayfa", href: "/" }, { label: "Özel Teklif İste" }]}
          />
        </div>

        <div className="container-page relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 pt-2">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Sol Kolon */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span>Sabit Fiyat &amp; Net Kapsam Garantisi</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-white leading-[1.08]">
                Projeniz İçin Net Kapsam,{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-brand-300 to-teal-200 bg-clip-text text-transparent">
                  Sabit Fiyat Teklifi Alın.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-emerald-100/85">
                İhtiyaçlarınızı anlatın — hazır kurumsal vitrinlerimiz varsa 48 saatte yayına alalım, yoksa markanıza özel modern ve yüksek performanslı özel yazılım geliştirelim.
              </p>

              {/* Garantiler */}
              <ul className="mt-8 space-y-3">
                {GUARANTEES.map((g) => (
                  <li key={g} className="flex items-center gap-3 text-xs sm:text-sm text-emerald-100/90 font-medium">
                    <CheckCircle className="size-4 shrink-0 text-emerald-400" strokeWidth={2.5} />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Butonları */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <a
                  href={whatsappLink("Merhaba, özel projemiz için resmi teklif ve teknik analiz almak istiyorum.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center gap-2.5 rounded-2xl bg-[#128c7e] hover:bg-[#0e7064] px-7 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#128c7e]/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp ile Hızlı Yazın</span>
                </a>

                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-13 items-center gap-2.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-all cursor-pointer"
                >
                  <Phone size={15} />
                  <span>{SITE.phone}</span>
                </a>
              </div>
            </div>

            {/* Sağ Kolon: Onaylı Müşteri Referans & İstatistik Kartı */}
            <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-amber-300 text-sm">★★★★★</div>
                  <span className="text-sm font-black text-white">4.9</span>
                  <span className="text-xs text-emerald-200/70">/ 5.0 Müşteri Memnuniyeti</span>
                </div>
                <span className="rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Doğrulanmış Referans
                </span>
              </div>

              <blockquote className="mt-5 text-xs sm:text-sm font-medium italic leading-relaxed text-emerald-100/90">
                &ldquo;Lizart&rsquo;ın hazırladığı web sitesi ve dijital altyapı, açılışından itibaren randevu ve danışan başvurularımızı rekor seviyeye taşıdı. Hem teslim hızı hem de teknik kalite açısından beklentilerimizin çok üstünde.&rdquo;
              </blockquote>

              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                  KR
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Koşuyolu Rezonans</p>
                  <p className="text-xs text-emerald-200/70">Bütüncül Sağlık &amp; Terapi Merkezi</p>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                <div>
                  <p className="text-lg sm:text-xl font-black text-white">150+</p>
                  <p className="text-[10px] text-emerald-200/70 mt-0.5 leading-tight">Teslim Edilen Proje</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-white">48 Saat</p>
                  <p className="text-[10px] text-emerald-200/70 mt-0.5 leading-tight">Hızlı Kurulum</p>
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-black text-white">%100</p>
                  <p className="text-[10px] text-emerald-200/70 mt-0.5 leading-tight">Zamanında Teslim</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. FORM + SÜREÇ PANELİ
          ════════════════════════════════════════ */}
      <section className="container-page max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] items-start">
          {/* Sol: İnteraktif Form */}
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-xs font-bold text-brand-700">
                <Sparkles className="size-3 text-brand-600" />
                Resmi Teklif Formu
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-black text-ink-950">
                Proje Kapsamını Belirleyin
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-500">
                Aşağıdaki 4 adımı tamamlayın, teknik ekibimiz aynı gün resmi teklif dosyanızı hazırlasın.
              </p>
            </div>

            <OfferForm />
          </div>

          {/* Sağ: Süreç Zaman Çizelgesi + Hızlı İletişim */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Süreç Zaman Çizelgesi */}
            <div className="rounded-3xl border border-ink-100 bg-white p-7 shadow-xs">
              <div className="flex items-center justify-between border-b border-ink-100 pb-3">
                <h3 className="text-base font-black text-ink-950">Nasıl İlerler?</h3>
                <span className="text-xs font-semibold text-brand-700">4 Adımlı Süreç</span>
              </div>
              <p className="mt-2 text-xs text-ink-500">
                Teklif talebinizden anahtar teslim yayına kadar şeffaf aşamalar:
              </p>

              <ol className="relative mt-6 space-y-6 pl-1">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-600 via-brand-200 to-transparent" />
                {STEPS.map(({ num, title, desc }) => (
                  <li key={num} className="relative flex items-start gap-4">
                    <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-2xl bg-brand-600 text-xs font-black text-white shadow-xs">
                      {num}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-xs sm:text-sm font-bold text-ink-950">{title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Hızlı Destek Konsolu */}
            <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-[#061812] to-[#0b291f] p-7 text-white shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Doğrudan İletişim</h3>
                  <p className="text-[11px] text-emerald-200/70">Form doldurmak istemiyorsanız</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Çevrimiçi
                </span>
              </div>

              <a
                href={whatsappLink("Merhaba, özel bir proje için hızlıca resmi teklif almak ve danışmanla görüşmek istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#128c7e] hover:bg-[#0e7064] p-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#128c7e]/20 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <MessageCircle size={16} />
                <span>WhatsApp ile Hemen Yazın</span>
              </a>

              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200/70">Telefon</span>
                  <a href={SITE.phoneHref} className="font-bold text-white hover:text-emerald-300 transition">
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200/70">E-posta</span>
                  <a href={`mailto:${SITE.email}`} className="font-bold text-white hover:text-emerald-300 transition">
                    {SITE.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-200/70">Çalışma Saatleri</span>
                  <span className="font-semibold text-white/90">{SITE.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Güvenlik Rozetleri */}
            <div className="flex items-center justify-around gap-2 rounded-2xl border border-ink-100 bg-white p-4 text-center text-xs font-semibold text-ink-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-brand-600" />
                Gizlilik (NDA)
              </span>
              <span className="text-ink-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-brand-600" />
                Aynı Gün Yanıt
              </span>
              <span className="text-ink-300">•</span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-brand-600" />
                Sabit Fiyat
              </span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
