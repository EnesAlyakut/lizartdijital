import type { Metadata } from "next";
import Link from "next/link";
import { Wizard } from "@/components/wizard/Wizard";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageCircle,
  PhoneCall,
  Rocket,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Breadcrumb, ButtonLink } from "@/components/ui";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Ürün Bulma Sihirbazı — Akıllı Proje Danışmanı | Lizart Dijital",
  description:
    "6 kısa soruyla işletmeniz için en doğru hazır web sitesini, mobil uygulamayı veya özel yazılım çözümünü anında bulun, bütçenizi ve teslim sürenizi görün.",
  alternates: { canonical: `${SITE.url}/sihirbaz` },
};

export default function WizardPage() {
  return (
    <div className="bg-canvas min-h-screen">
      <div className="container-page py-6 sm:py-10 lg:py-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Ürün Bulma Sihirbazı" },
          ]}
        />

        {/* ─── 1. BÜYÜK LÜKS HERO BANNER ─── */}
        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-[#051711] via-[#0a291f] to-[#04130d] text-white shadow-2xl shadow-emerald-950/20">
          {/* Arka Plan Işık Efektleri */}
          <div className="pointer-events-none absolute -top-40 right-0 size-[550px] rounded-full bg-emerald-500/10 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-40 left-0 size-[500px] rounded-full bg-brand-600/10 blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(85,128,83,0.18),transparent_70%)]" />

          <div className="relative z-10 grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-14">
            {/* Sol Kolon: Başlık ve Değer Vaadi */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span>Akıllı Proje &amp; Ürün Danışmanı</span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
                Doğru Dijital Altyapıyı,{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-brand-300 to-teal-200 bg-clip-text text-transparent">
                  Birlikte Belirleyelim.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-emerald-100/85">
                Sektörünüz, hedefleriniz ve bütçenize göre en uygun hazır web sitesi, mobil uygulama veya özel yazılım paketini 6 hızlı soruyla eşleştiriyoruz. Yanlış yatırımı önleyin, doğrudan işinize değer katan sonuca ulaşın.
              </p>

              {/* Butonlar */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href="#sihirbaz"
                  className="group inline-flex h-13 sm:h-14 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Sihirbaza Başla (6 Soru)</span>
                  <ArrowDown size={16} className="transition-transform group-hover:translate-y-1" />
                </Link>

                <ButtonLink
                  href="/magaza"
                  variant="outline"
                  size="lg"
                  className="h-13 sm:h-14 rounded-2xl border-white/20 bg-white/5 font-bold text-white backdrop-blur-md hover:bg-white/10"
                >
                  Tüm Kataloğu İncele
                  <ArrowUpRight className="size-4" />
                </ButtonLink>
              </div>

              {/* Güven Metrikleri */}
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-7 max-w-lg">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">150+</p>
                  <p className="text-[11px] font-medium text-emerald-200/70 mt-0.5">Canlı Referans</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">%98.4</p>
                  <p className="text-[11px] font-medium text-emerald-200/70 mt-0.5">Eşleşme İsabeti</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">48 Saat</p>
                  <p className="text-[11px] font-medium text-emerald-200/70 mt-0.5">Ekspres Kurulum</p>
                </div>
              </div>
            </div>

            {/* Sağ Kolon: İnteraktif Konsol Kartı */}
            <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Danışman Analiz Süreci</h2>
                    <p className="text-[11px] text-emerald-200/70">Otomatik Doğrulama Motoru</p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-400/15 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                  Ücretsiz
                </span>
              </div>

              {/* 3 Adımlı Avantaj Maddeleri */}
              <div className="mt-5 space-y-3.5">
                {[
                  {
                    icon: Rocket,
                    title: "1. İhtiyaç & Sektör Taraması",
                    desc: "Faaliyet alanınıza özel kullanıcı deneyimi ve gerekli modüller belirlenir.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "2. Gereksiz Maliyetlerin Elenmesi",
                    desc: "Kullanmayacağınız özellikler çıkarılır, bütçenize tam oturan çözümler listelenir.",
                  },
                  {
                    icon: Zap,
                    title: "3. Canlı Demo & Şeffaf Fiyatlandırma",
                    desc: "Önerilen paketlerin canlı demosunu test eder, net bütçeyi görerek başlarsınız.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-black/20 p-4 transition-all hover:bg-black/30 hover:border-white/20"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/20">
                      <Icon className="size-4.5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{title}</h3>
                      <p className="mt-0.5 text-xs text-emerald-100/75 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alt Garanti Kutusu */}
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-950/40 p-3.5 text-center">
                <p className="text-xs font-semibold text-emerald-200">
                  ⚡ 6 soruluk analiz · Kayıt gerektirmez · 2 dakikada sonuç
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2. SİHİRBAZ FORMU BÖLÜMÜ ─── */}
        <section id="sihirbaz" className="pt-12 sm:pt-16 pb-12 sm:pb-20">
          <Wizard />
        </section>

        {/* ─── 3. CANLI YARDIM & İLETİŞİM ÇAĞRISI ─── */}
        <section className="rounded-3xl border border-ink-100 bg-white p-7 sm:p-10 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                <HelpCircle className="size-4 text-brand-600" />
                Kafanızda Farklı Bir Proje Mi Var?
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-ink-950">
                Uzman Yazılım ve Tasarım Ekibimizle Birebir Görüşün
              </h2>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-ink-600 leading-relaxed">
                Standart paketlerin dışında özel API entegrasyonu, kurumsal ERP/CRM bağlantısı veya sektörel yazılım ihtiyaçlarınız için doğrudan mühendislerimizle konuşabilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={whatsappLink("Merhaba, web sitesi ve yazılım ihtiyacımız için bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#128c7e] hover:bg-[#075e54] px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#128c7e]/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>WhatsApp Danışman Hattı</span>
              </Link>

              <Link
                href="/iletisim"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-ink-200 bg-surface px-6 text-xs sm:text-sm font-bold text-ink-800 transition-all hover:border-brand-400 hover:bg-brand-50"
              >
                <PhoneCall className="size-4" />
                <span>Bize Ulaşın</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
