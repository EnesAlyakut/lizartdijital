import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Breadcrumb, ButtonLink } from "@/components/ui";
import { FAQ_CATEGORIES, SITE, whatsappLink } from "@/lib/constants";
import { FaqClientView } from "@/components/faq/FaqClientView";
import {
  ArrowDown,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Headphones,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular — Müşteri Rehberi & Şeffaf Süreçler | Lizart Dijital",
  description:
    "Satın alma adımları, lisanslama hakları, 48 saatlik hızlı kurulum, güvenli online ödeme ve 12 aylık teknik destek garantisine dair sık sorulan sorular ve detaylı yanıtlar.",
  alternates: { canonical: `${SITE.url}/sss` },
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Sözleşmeli ve Lisanslı Teslim",
    text: "Satın aldığınız her ürün resmi lisans anahtarı, adınıza kesilen fatura ve yasal mülkiyet haklarıyla birlikte güvenle teslim edilir.",
  },
  {
    icon: Clock,
    title: "48 Saatte Canlı Yayın Garantisi",
    text: "Hazır vitrin paketlerimizde alan adı, kurumsal e-posta, SSL ve demo içerikleri 2 iş günü içinde anahtar teslim kurulup yayına alınır.",
  },
  {
    icon: Headphones,
    title: "12 Ay Kesintisiz Teknik Destek",
    text: "Teslimattan sonra sistem güncellemeleri, güvenlik yedeklemeleri ve karşılaşabileceğiniz tüm teknik sorularınız için ekibimiz yanınızdadır.",
  },
  {
    icon: Lock,
    title: "Gizlilik ve Veri Güvenliği (NDA)",
    text: "Özel yazılım ve kurumsal projelerinizde tüm ticari sırlarınız ve fikirleriniz Gizlilik Sözleşmesi (NDA) ile yasal güvence altındadır.",
  },
];

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { productId: null },
    orderBy: { sortOrder: "asc" },
  });

  const faqStats = [
    { value: `${faqs.length}+`, label: "Rehber Yanıt" },
    { value: "48 Saat", label: "Ortalama Kurulum" },
    { value: "12 Ay", label: "Teknik Destek & Bakım" },
    { value: "%100", label: "Sözleşmeli & Lisanslı" },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="bg-canvas text-ink-900">
      {/* Breadcrumb */}
      <div className="container-page pt-4 lg:pt-6">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Sık Sorulan Sorular" },
          ]}
        />
      </div>

      {/* =====================================================
          1. TAM GENİŞLİK FOTOĞRAFLI KAHRAMAN (HAKKIMIZDA GİBİ)
          ===================================================== */}
      <section className="relative mt-4 flex min-h-[66vh] items-end overflow-hidden sm:min-h-[72vh]">
        <Image
          src="/gorseller/hizmetler/hero-web-tasarim-realistic.png"
          alt="Lizart Dijital sık sorulan sorular ve müşteri rehberi stüdyosu"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-ink-950/55" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/15" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/35 to-transparent lg:from-ink-950/90 lg:via-ink-950/45 lg:to-transparent" />

        <div className="container-page relative z-10 pb-20 sm:pb-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-100 shadow-[0_2px_16px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Müşteri Rehberi &amp; Şeffaf Süreçler
          </span>

          <h1 className="mt-6 max-w-2xl text-[2.1rem] font-bold leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-[3.4rem]">
            Aklınızdaki sorulara
            <br />
            <span className="font-serif italic font-medium text-brand-100">
              şeffaf ve net yanıtlar.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:text-base">
            Satın alma adımları, lisanslama hakları, 48 saatlik hızlı kurulum, güvenli online ödeme ve 12 aylık teknik destek garantisine dair aklınızdaki tüm soruları derledik.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#sorular" size="lg" className="font-bold">
              Soruları İncele
              <ArrowDown className="size-4" />
            </ButtonLink>
            <a
              href={whatsappLink("Merhaba, web sitenizdeki sık sorulan sorular sayfasından ulaşıyorum. Bir konu hakkında danışmak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition hover:border-emerald-400/40 hover:bg-white/20 cursor-pointer"
            >
              <MessageCircle className="size-4 text-emerald-400" />
              <span>WhatsApp ile Danış</span>
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. KAHRAMANIN ÜZERİNE TAŞAN İSTATİSTİK KARTI (HAKKIMIZDA GİBİ)
          ===================================================== */}
      <div className="container-page">
        <div className="relative z-20 -mt-12 grid grid-cols-2 gap-3 rounded-3xl border border-ink-100 bg-surface p-5 shadow-[var(--shadow-lift)] sm:-mt-14 sm:grid-cols-4 sm:p-7">
          {faqStats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="font-serif text-2xl font-semibold text-brand-700 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wider text-ink-400 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          3. SORULAR & YANITLAR (CANLI ARAMA & KATEGORİLER)
          ===================================================== */}
      <div className="container-page">
        <section id="sorular" className="py-16 sm:py-24 scroll-mt-20">
          <div className="mx-auto max-w-xl text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              Rehber &amp; Bilgi Bankası
            </span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-ink-950 sm:text-4xl">
              Tüm süreçler, <em className="italic text-brand-700">en ince ayrıntısına kadar.</em>
            </h2>
            <p className="mt-3 text-sm text-ink-500 leading-relaxed">
              Aradığınız konuyu arama çubuğundan anında bulabilir veya kategorilere tıklayarak filtreleyebilirsiniz.
            </p>
          </div>

          <FaqClientView
            faqs={faqs.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
              category: f.category,
              sortOrder: f.sortOrder,
            }))}
            categories={FAQ_CATEGORIES.map((c) => ({ key: c.key, label: c.label }))}
          />
        </section>

        {/* =====================================================
            4. ŞEFFAF İLKELERİMİZ (HAKKIMIZDA DEĞERLER ŞABLONU)
            ===================================================== */}
        <section className="border-t border-ink-100 py-16 lg:py-20">
          <div className="mx-auto max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              Güvencelerimiz
            </span>
            <h2 className="mt-3 font-serif text-3xl font-medium text-ink-950 sm:text-4xl">
              Şeffaf ve güven veren yaklaşımımız.
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Sözleşmeden canlı yayına, her adımda kurumsal standartlara sadık kalırız.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl divide-y divide-ink-100">
            {principles.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-5 py-6 first:pt-0 last:pb-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            5. STÜDYO DANIŞMANLIK & İLETİŞİM ÇAĞRISI (MAT MARKA STİLİ)
            ===================================================== */}
        <section className="pb-16 sm:pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-[#1d3521] bg-gradient-to-br from-[#1f3722] via-[#243f27] to-[#1c3220] text-white shadow-xl">
            {/* Arka Plan Mat Işık Efekti */}
            <div className="pointer-events-none absolute -left-20 -top-20 size-[380px] rounded-full bg-[#82cf7f]/10 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-20 right-0 size-[380px] rounded-full bg-[#82cf7f]/8 blur-[100px]" />

            <div className="relative z-10 p-8 sm:p-12 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                {/* Sol Sütun: Başlık ve Değer Vaadi (7 Sütun) */}
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b6d8b4]">
                    <Sparkles className="size-3.5 text-[#82cf7f]" />
                    Cevabınızı Bulamadınız mı?
                  </span>

                  <h3 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] leading-[1.15]">
                    Aklınızdaki soruyu doğrudan{" "}
                    <span className="text-[#b6d8b4]">ekibimize danışın.</span>
                  </h3>

                  <p className="mt-4 max-w-xl text-base leading-relaxed text-[#e0ede2] font-normal">
                    Projenize en uygun hazır vitrini veya özel yazılım mimarisini birlikte belirleyelim. Teknik mimarımız sorularınızı ortalama 15 dakikada yanıtlar.
                  </p>

                  {/* Aksiyon Butonları */}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <ButtonLink
                      href="/teklif"
                      size="lg"
                      className="group rounded-xl bg-[#396b40] hover:bg-[#467f4f] px-7 py-4 text-sm font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
                    >
                      <span>Hemen Teklif Alın</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </ButtonLink>

                    <a
                      href={whatsappLink("Merhaba, sık sorulan sorular sayfanızdan ulaşıyorum. Bir konu hakkında detaylı bilgi almak istiyorum.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#1a311e] hover:bg-[#203c26] px-6 text-sm font-bold text-[#bfe0bd] shadow-xs transition"
                    >
                      <MessageCircle className="size-4 text-[#82cf7f]" />
                      <span>WhatsApp ile Yazın</span>
                    </a>

                    <Link
                      href="/iletisim"
                      className="inline-flex h-13 items-center justify-center rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 text-sm font-semibold text-[#e0ede2] transition hover:text-white"
                    >
                      İletişim
                    </Link>
                  </div>

                  {/* Alt Güven ve Taahhüt Rozetleri */}
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-white/15 pt-6 text-sm font-medium text-[#e0ede2]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                      <span>Sözleşmeli &amp; Lisanslı Teslim</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                      <span>24 Saatte Hızlı Başlangıç</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-[#82cf7f] shrink-0" />
                      <span>%100 Mobil &amp; SEO Standartları</span>
                    </div>
                  </div>
                </div>

                {/* Sağ Sütun: Mat Süreç Kartı (5 Sütun) */}
                <div className="lg:col-span-5">
                  <div className="relative rounded-3xl border border-white/15 bg-[#1a311e]/90 backdrop-blur-md p-6 text-white shadow-lg sm:p-7">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-[#28492d] text-[#b6d8b4] border border-white/15 font-bold text-sm">
                          LZ
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Lizart Destek Masası</h4>
                          <p className="text-xs font-medium text-[#b6d8b4] flex items-center gap-1.5 mt-0.5">
                            <Clock size={12} />
                            Ortalama 15 dk yanıt süresi
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10px] font-bold uppercase text-[#b6d8b4]">
                        Çevrimiçi
                      </span>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-start gap-3.5">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                          01
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">Ücretsiz Keşif &amp; Analiz</p>
                          <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                            Sektörünüze en uygun hazır vitrin veya özel yazılım seçimi.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                          02
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">Canlı Demo &amp; Tasarım Onayı</p>
                          <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                            Sitenizi yayından önce canlı demo ortamında test edip onaylayın.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-[#28492d] text-xs font-bold text-[#b6d8b4] border border-white/15">
                          03
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">Anahtar Teslim Canlıya Alma</p>
                          <p className="mt-1 text-xs text-[#d2e5d4] leading-relaxed font-normal">
                            SEO optimizasyonu, SSL, e-posta kurulumu ve 12 ay teknik destek.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-[#203c26] p-3.5 text-center">
                      <p className="text-xs font-semibold text-[#e4f1e3]">
                        ⚡ Sorularınız için bugün yazın, anında net yanıt alın.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SEO FAQ Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </div>
  );
}
