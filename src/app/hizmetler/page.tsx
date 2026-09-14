import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Check, Code2, Gauge, Headset, MessageCircle, ShieldCheck } from "lucide-react";
import { getAllServices } from "@/lib/data/services";
import { Breadcrumb, ButtonLink } from "@/components/ui";
import { ServicesDirectory } from "@/components/services/ServicesDirectory";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Hizmetlerimiz — Web, Yazılım, SEO & Dijital Reklam",
  description:
    "Web sitesi kurulumundan e-ticarete, özel yazılımlardan SEO ve dijital reklam yönetimine kadar tüm hizmetlerimiz. Şeffaf fiyatlandırma, sözleşmeli teslimat.",
  alternates: { canonical: `${SITE.url}/hizmetler` },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <div className="container-page py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Hizmetlerimiz" }]} />

      {/* ── SAYFA BAŞLIĞI ──────────────────────────────────────── */}
      <section className="relative mt-6 overflow-hidden rounded-[2.5rem] border border-ink-100 bg-surface p-8 lg:p-12 shadow-sm">
        {/* Subtle background gradient accent */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-50/70 via-transparent to-surface" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-brand-700">
              <Code2 className="size-3.5" />
              Web, Yazılım ve Büyüme Mimarisi
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.6rem]">
              İşletmenizi dijitale taşıyan,{" "}
              <span className="text-gradient-brand">satışa dönüşen</span> profesyonel hizmetler.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Web sitesi kurulumundan e-ticarete, SEO&apos;dan reklam yönetimine kadar tüm adımları tek çatı
              altında, <strong className="font-bold text-ink-900">şeffaf fiyatlarla</strong> ve{" "}
              <strong className="font-bold text-ink-900">sözleşmeli teslimatla</strong> yürütüyoruz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/teklif" size="lg" className="rounded-full bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/25 font-bold">
                Ücretsiz Keşif & Teklif Alın
                <ArrowUpRight className="size-4" />
              </ButtonLink>
              <a href="#hizmetler" className="inline-flex h-13 items-center gap-2 rounded-full border border-ink-200 bg-surface px-6 text-sm font-semibold text-ink-700 hover:border-brand-300 hover:bg-brand-50 transition-colors">
                Hizmetleri Keşfet
                <ArrowDown className="size-4" />
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-ink-500">
              {["Ücretsiz keşif görüşmesi", "Sözleşmeli teslimat", "Şeffaf, sabit fiyat"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3.5 text-sm">
            {[
              { icon: Gauge, val: "150+", lbl: "Tamamlanan Proje" },
              { icon: ShieldCheck, val: "3-5 Gün", lbl: "Planlı Teslimat Süresi" },
              { icon: Headset, val: "7/24", lbl: "Kesintisiz Destek Akışı" },
            ].map(({ icon: Icon, val, lbl }) => (
              <div key={lbl} className="flex items-center justify-between rounded-2xl border border-ink-100 bg-surface px-6 py-4 shadow-xs transition-all hover:border-brand-200 hover:shadow-[var(--shadow-card)]">
                <span className="flex items-center gap-3.5 text-ink-700 font-semibold">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon className="size-5" />
                  </span>
                  {lbl}
                </span>
                <strong className="text-xl font-bold text-ink-950">{val}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HİZMET KATALOĞU (SIRALI & FERAH)
          ===================================================== */}
      <section id="hizmetler" className="mt-16 scroll-mt-20">
        <ServicesDirectory services={services} />
      </section>

      {/* =====================================================
          NASIL ÇALIŞIYORUZ — Sıralı Adımlar
          ===================================================== */}
      <section className="mt-24">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Süreç Mimarisi</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            Süreç Nasıl İlerliyor?
          </h2>
          <p className="mt-2 text-sm text-ink-500 mx-auto max-w-xl">
            Her aşamada şeffaf bilgi akışı ve sizin onayınızla, sıfır sürpriz politikasıyla çalışıyoruz.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              n: "01",
              title: "Keşif & Analiz",
              desc: "İşletmenizin hedeflerini dinler, doğru strateji ve teknoloji planını çıkarırız.",
            },
            {
              n: "02",
              title: "Tasarım & Mimari",
              desc: "Mobil uyumlu, kullanıcı dostu arayüz tasarımlarını onayınıza sunarız.",
            },
            {
              n: "03",
              title: "Geliştirme & Test",
              desc: "Temiz kod, SEO uyumu ve güvenlik testleriyle projeyi çalışır hale getiririz.",
            },
            {
              n: "04",
              title: "Yayına Alma & Destek",
              desc: "Domain, SSL bağlantılarını kurar, eğitim verir ve kesintisiz destek başlatırız.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="group relative rounded-2xl border border-ink-100 bg-surface p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-brand-400 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-600 font-mono text-sm font-extrabold text-white shadow-xs">
                {step.n}
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          CTA — Danışma / Teklif (Mat Marka Paleti)
          ===================================================== */}
      <section className="mt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#1d3521] bg-gradient-to-br from-[#1f3722] via-[#243f27] to-[#1c3220] px-8 py-12 text-center shadow-xl sm:px-14 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 -z-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#82cf7f]/10 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#b6d8b4]">
              Ücretsiz ve yükümlülük içermez
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Hangi Hizmete İhtiyacınız Var?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#e0ede2] font-normal sm:text-lg">
              Projenizin kapsamını ve bütçesini konuşalım. Uzman ekibimiz size{" "}
              <strong className="font-semibold text-white">en uygun çözümü ücretsiz olarak</strong> planlasın.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/teklif"
                size="lg"
                className="group rounded-xl bg-[#396b40] hover:bg-[#467f4f] px-7 py-4 text-sm font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
              >
                <span>Ücretsiz Teklif Alın</span>
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </ButtonLink>
              <a
                href={whatsappLink("Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-[#1a311e] hover:bg-[#203c26] px-6 text-sm font-bold text-[#bfe0bd] shadow-xs transition"
              >
                <MessageCircle className="size-4 text-[#82cf7f]" />
                <span>WhatsApp&apos;tan Yazın</span>
              </a>
              <ButtonLink
                href="/iletisim"
                variant="outline"
                size="lg"
                className="rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-5 text-sm font-semibold text-[#e0ede2] transition hover:text-white"
              >
                İletişim
              </ButtonLink>
            </div>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#d2e5d4]">
              {["Ortalama 15 dk içinde dönüş", "Sözleşmeli, garantili teslim", "Gizli ek maliyet yok"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-[#82cf7f]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
