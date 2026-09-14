import Image from "next/image";
import Link from "next/link";
import { Badge, ButtonLink, Card, SectionHeading } from "@/components/ui";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { ReferenceCard, type ReferenceCardData } from "@/components/portfolio/ReferenceCard";
import type { ProductCardData } from "@/lib/data/products";
import { PRODUCT_TYPES, SITE, whatsappLink } from "@/lib/constants";
import { cn, formatPrice, formatDate } from "@/lib/utils";

/* ------------------------------------------------------------- Ürün satırı */

export function ProductRow({
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/70 py-18 lg:py-24">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-slate-200/80" />

      <div className="container-page relative">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            {eyebrow && (
              <span className="inline-flex rounded-md border border-[#b8c9b2] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#345f3a] shadow-[0_12px_30px_-24px_rgb(20_31_20/.75)]">
                {eyebrow}
              </span>
            )}
            <h2 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-[#111811] sm:text-5xl">
              {title}
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            {description && (
              <p className="text-base leading-8 text-[#354238]">
                {description}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href={href} variant="outline" size="lg" className="border-[#9daf97] bg-white font-bold text-[#162415] hover:bg-[#17331b] hover:text-white">
                Tümünü gör
              </ButtonLink>
              <ButtonLink href="/teklif" size="lg" className="bg-[#17331b] font-bold text-white hover:bg-[#244f2a]">
                Bana Uygun Olanı Seç
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-y border-[#d3dfcf] py-5 text-sm text-[#354238] sm:grid-cols-3">
          <p><strong className="text-[#111811]">Canlı demo:</strong> Satın almadan önce gerçek akışı inceleyin.</p>
          <p><strong className="text-[#111811]">Hızlı kurulum:</strong> İçeriklerinizle yayına alınmaya hazır yapı.</p>
          <p><strong className="text-[#111811]">Profesyonel destek:</strong> Kurulum ve teslim süreci Lizart ekibiyle ilerler.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p, index) => (
            <ProductCard key={p.id} product={p} featured={index === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Kategoriler */

const CATEGORY_HINTS: Record<string, string> = {
  website: "Kurumsal, e-ticaret, restoran, klinik ve daha fazlası",
  app: "iOS ve Android için yayına hazır uygulamalar",
  webapp: "CRM, stok, SaaS ve yapay zekâ uygulamaları",
  system: "Randevu, rezervasyon, personel ve abonelik sistemleri",
  template: "Hızlı başlangıç için tema ve şablonlar",
  service: "SEO, reklam, içerik ve bakım paketleri",
};

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Ana kategoriler"
        title="Ne aradığınızı biliyorsanız buradan başlayın"
        description="Altı ana ürün ailesi; her birinde canlı demosunu inceleyebileceğiniz hazır çözümler var."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_TYPES.map((type) => {
          const count = counts[type.key] ?? 0;
          // Bu ailede henüz hazır ürün yoksa kullanıcıyı boş listeye göndermek yerine
          // projeye özel çözüm için teklif sayfasına yönlendiriyoruz.
          const hasProducts = count > 0;
          return (
            <Link
              key={type.key}
              href={hasProducts ? type.href : "/teklif"}
              className="group flex flex-col justify-between rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6 transition-soft hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-ink-900">{type.label}</h3>
                  <Badge tone={hasProducts ? "brand" : "outline"}>
                    {hasProducts ? `${count} ürün` : "Talep üzerine"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {hasProducts
                    ? CATEGORY_HINTS[type.key]
                    : `${CATEGORY_HINTS[type.key]} — bu alanda şu an hazır ürün yok, projenize özel geliştiriyoruz.`}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                {hasProducts ? "İncele" : "Teklif alın"}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Demo merkezi */

export function DemoCenterTeaser({ sample }: { sample: ProductCardData[] }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="container-page">
        <div className="overflow-hidden rounded-[2rem] bg-surface-2 text-ink-900">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
                Canlı Demo Merkezi
              </p>
              <h2 className="mt-3 text-balance-title font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                Satın almadan önce <em className="italic text-brand-400">ürünü kendiniz deneyin</em>
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-ink-500">
                Her ürünün canlı demosunu masaüstü, tablet ve mobil görünümde inceleyebilir; yönetim paneli
                demosuna geçici hesapla girebilirsiniz. Demo verileri gerçek müşteri bilgisi içermez ve düzenli
                olarak sıfırlanır.
              </p>
              <ul className="mt-6 grid gap-2.5 text-sm text-ink-200 sm:grid-cols-2">
                <li>✓ Masaüstü / tablet / mobil önizleme</li>
                <li>✓ Yönetim paneli demosu</li>
                <li>✓ Mobil uygulamalar için QR kod</li>
                <li>✓ Geçici demo hesabı</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/demo-merkezi" size="lg">
                  Demo Merkezini aç
                </ButtonLink>
                <ButtonLink
                  href="/magaza"
                  size="lg"
                  variant="outline"
                  className="border-ink-200 bg-transparent text-ink-800 hover:border-ink-300 hover:bg-ink-50"
                >
                  Ürünlere göz at
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {sample.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/demo-merkezi/${p.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-ink-100 bg-surface transition-colors hover:border-brand-500"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={p.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                    <p className="px-4 py-3 text-sm font-medium">{p.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Paket karşılaştırma */

const PACKAGE_TIERS = [
  {
    key: "baslangic",
    name: "Başlangıç",
    slug: "baslangic-dijital-paketi",
    tagline: "İlk dijital adımını atan işletmeler için",
    rows: ["Hazır site kurulumu", "Logo tasarımı", "Temel SEO ayarları", "1 ay destek"],
    excluded: ["Reklam yönetimi", "Özel yazılım", "Aylık içerik"],
  },
  {
    key: "profesyonel",
    name: "Profesyonel",
    slug: "profesyonel-buyume-paketi",
    tagline: "Büyümeye odaklanan markalar için",
    rows: [
      "Başlangıç paketindeki her şey",
      "Aylık 4 içerik üretimi",
      "Teknik SEO iyileştirmeleri",
      "Reklam yönetimi",
      "Aylık performans raporu",
    ],
    excluded: ["Özel yazılım geliştirme"],
    highlighted: true,
  },
  {
    key: "kurumsal",
    name: "Kurumsal",
    slug: "kurumsal-dijital-donusum-paketi",
    tagline: "Süreçlerini dijitalleştiren kurumlar için",
    rows: [
      "Profesyonel paketteki her şey",
      "İhtiyaç analizi ve yol haritası",
      "Özel yazılım geliştirme",
      "Kurumsal kimlik uyarlaması",
      "12 ay teknik destek",
    ],
    excluded: [],
  },
];

export function PackageComparison({ prices }: { prices: Record<string, number> }) {
  return (
    <section className="container-page py-14 lg:py-20">
      <SectionHeading
        align="center"
        eyebrow="Paketler"
        title="Başlangıç, Profesyonel veya Kurumsal"
        description="Üç paketi karşılaştırın; hangisi size uyuyorsa oradan devam edin. Emin değilseniz sihirbaz size önerir."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PACKAGE_TIERS.map((tier) => (
          <Card
            key={tier.key}
            className={
              tier.highlighted
                ? "relative border-brand-300 shadow-[var(--shadow-lift)] lg:-translate-y-3"
                : undefined
            }
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-brand-500 px-3 py-1 text-[0.7rem] font-semibold text-canvas">
                En çok tercih edilen
              </span>
            )}
            <div className="p-7">
              <h3 className="text-xl font-semibold tracking-tight text-ink-900">{tier.name}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{tier.tagline}</p>
              <p className="mt-5 text-3xl font-semibold tracking-tight text-ink-900">
                {prices[tier.slug] ? formatPrice(prices[tier.slug]) : "—"}
                <span className="ml-1 text-sm font-normal text-ink-400">+ KDV başlangıç</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {tier.rows.map((r) => (
                  <li key={r} className="flex gap-2 text-ink-700">
                    <span className="text-brand-600" aria-hidden>
                      ✓
                    </span>
                    {r}
                  </li>
                ))}
                {tier.excluded.map((r) => (
                  <li key={r} className="flex gap-2 text-ink-400">
                    <span aria-hidden>–</span>
                    {r}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href={`/urun/${tier.slug}`}
                variant={tier.highlighted ? "primary" : "outline"}
                className="mt-7 w-full"
              >
                Paketi incele
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- Süreç */

const STEPS = [
  {
    title: "Ürünü seçin",
    body: "Canlı demoyu inceleyin, karşılaştırın ve ihtiyacınıza uyan ürünü belirleyin.",
  },
  {
    title: "Lisans ve ek hizmetleri belirleyin",
    body: "Lisans türünü seçin; kurulum, içerik girişi veya entegrasyon gibi ek hizmetleri ekleyin. Fiyat anında güncellenir.",
  },
  {
    title: "Güvenle ödeyin",
    body: "Kart veya havale ile ödeyin. Kart bilgileriniz bizde saklanmaz; ödeme lisanslı kuruluş üzerinden alınır.",
  },
  {
    title: "Teslimatı alın",
    body: "Ödeme onaylanınca lisans anahtarınız ve güvenli indirme bağlantınız hesabınıza tanımlanır.",
  },
  {
    title: "Kurulum ve destek",
    body: "Kurulum hizmeti aldıysanız süreci Hesabım > Projelerim üzerinden aşama aşama izlersiniz.",
  },
];

export function ProcessSection() {
  return (
    <section className="section-blend py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Süreç"
          title="Satın almadan teslimata kadar ne oluyor?"
          description="Sürpriz ücret yok, belirsiz süre yok. Her adımda ne olacağını önceden görürsünüz."
        />
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl border border-ink-100 bg-surface-2 p-6 transition-soft hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-ink-900 text-sm font-semibold text-canvas">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Neden biz */

const REASONS = [
  {
    title: "Demosu olmayan ürün satmıyoruz",
    body: "Her ürünün canlı demosu ve yönetim paneli erişimi vardır. Ne aldığınızı satın almadan önce görürsünüz.",
  },
  {
    title: "Fiyat baştan bellidir",
    body: "Lisans, kurulum ve ek hizmet ücretleri sepette açıkça gösterilir. Ödeme adımında sürpriz kalem çıkmaz.",
  },
  {
    title: "Teslimat otomatiktir",
    body: "Ödeme onayının ardından lisans anahtarı ve indirme bağlantısı hesabınıza anında tanımlanır.",
  },
  {
    title: "Kurulumu biz yapabiliriz",
    body: "Teknik ekibiniz yoksa kurulum, domain bağlantısı ve içerik girişini ek hizmet olarak biz üstleniriz.",
  },
  {
    title: "Kaynak kodu devredilebilir",
    body: "Size Özel lisansta kaynak kodun tam devri ve ürünün mağazadan kaldırılması seçenekleri değerlendirilir.",
  },
  {
    title: "Destek gerçek kişilerden",
    body: "Destek talepleriniz hesabınızdan izlenir; acil konularda WhatsApp üzerinden doğrudan ulaşırsınız.",
  },
];

export function WhyUs() {
  return (
    <section className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Neden Lizart Dijital?"
        title="Hazır ürün almanın belirsizliğini kaldırdık"
        description="Dijital ürün satın alırken en büyük endişe, ürünün gerçekte ne yaptığını bilmemektir. Bu yüzden her şeyi önceden gösteriyoruz."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r) => (
          <div key={r.title} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <h3 className="font-semibold text-ink-900">{r.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ İstatistikler */

export function StatsSection({ stats }: { stats: Record<string, string> }) {
  const items = [
    { label: "Tamamlanan proje", value: stats["stats.projects"] ?? "—" },
    { label: "Müşteri", value: stats["stats.customers"] ?? "—" },
    { label: "Yıllık deneyim", value: stats["stats.years"] ?? "—" },
    { label: "Ortalama müşteri puanı", value: `${stats["stats.satisfaction"] ?? "—"}/5` },
  ];
  return (
    <section className="bg-surface-2 py-14 text-ink-900 lg:py-16">
      <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <div key={s.label}>
            <p className="text-4xl font-semibold tracking-tight text-brand-400">{s.value}</p>
            <p className="mt-2 text-sm text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Yorumlar */

export function Testimonials({
  reviews,
}: {
  reviews: { id: string; authorName: string; authorTitle: string | null; body: string; rating: number; product: { name: string; slug: string } }[];
}) {
  if (reviews.length === 0) return null;
  return (
    <section className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Müşteri yorumları"
        title="Ürünlerimizi kullananlar ne diyor?"
        description="Yorumlar yalnızca ürünü satın almış müşteriler tarafından yazılır."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 6).map((r) => (
          <figure key={r.id} className="flex flex-col rounded-2xl border border-ink-100 bg-surface p-6 transition-soft hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]">
            <div className="flex gap-0.5" aria-label={`5 üzerinden ${r.rating} puan`}>
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} viewBox="0 0 20 20" className={`size-4 ${i < r.rating ? "fill-[#f4b400]" : "fill-ink-200"}`} aria-hidden>
                  <path d="M10 1.6l2.47 5.24 5.53.79-4 4.06.95 5.71L10 14.7l-4.95 2.7.95-5.71-4-4.06 5.53-.79z" />
                </svg>
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">“{r.body}”</blockquote>
            <figcaption className="mt-5 border-t border-ink-100 pt-4 text-sm">
              <p className="font-semibold text-ink-900">{r.authorName}</p>
              {r.authorTitle && <p className="text-ink-500">{r.authorTitle}</p>}
              <Link href={`/urun/${r.product.slug}`} className="mt-1 inline-block text-xs text-brand-700 hover:underline">
                {r.product.name}
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Logolar */

/**
 * "Birlikte çalıştığımız markalar" şeridi.
 * 25 yıllık kurumsal web mimarisi standartlarında:
 * Çizgilerle ayrılmış, sektör rozetli, kurumsal grid tablosu.
 */
export function ClientLogos({
  clients,
}: {
  clients: { slug: string; client: string; sector?: string | null }[];
}) {
  if (clients.length === 0) return null;

  return (
    <section className="border-b border-ink-200/90 bg-canvas py-14 lg:py-16">
      <div className="container-page">
        {/* Bölüm Başlığı & Çizgili Ayrım */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-ink-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/90 bg-surface px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-800 shadow-2xs">
              <span className="size-1.5 rounded-full bg-brand-600" />
              Kurumsal Referans Ağı
            </div>
            <h2 className="mt-2.5 text-xl sm:text-2xl font-bold tracking-tight text-ink-950">
              Birlikte Başarıya Ulaştığımız Markalar
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-ink-500">
              Farklı sektörlerdeki kurumsal işletmelere özel dijital mimariler ve yazılım altyapıları geliştirdik.
            </p>
          </div>
          <Link
            href="/projeler"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors self-start sm:self-auto group"
          >
            <span>Tüm canlı vaka çalışmalarını incele</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Kurumsal Referans Kartları Tablosu / Grid */}
        <div className="mt-8 rounded-2xl border border-ink-200/90 bg-surface shadow-xs overflow-hidden">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-ink-200/80">
            {clients.map((c, i) => (
              <li
                key={c.slug}
                className={cn(
                  "group relative p-5 sm:p-6 transition-all duration-300 hover:bg-surface-2/60",
                  i >= 4 && "sm:border-t sm:border-ink-200/80"
                )}
              >
                <Link href={`/projeler/${c.slug}`} className="flex flex-col h-full justify-between gap-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.68rem] font-bold font-mono tracking-wider text-ink-400">
                      0{i + 1}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-ink-100 px-2 py-0.5 text-[0.68rem] font-semibold text-ink-600 group-hover:border-brand-300 group-hover:text-brand-800 transition-colors">
                      <span className="size-1 rounded-full bg-brand-500" />
                      {c.sector || "Canlı Proje"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[0.95rem] font-bold tracking-tight text-ink-900 group-hover:text-brand-800 transition-colors line-clamp-1">
                      {c.client}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-ink-100 text-[0.72rem] font-medium text-ink-400 group-hover:text-ink-700 transition-colors">
                    <span>Vaka Analizi</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Portföy */

/**
 * Ana sayfadaki referans vitrini.
 * Müşterilerin yayındaki sitelerinin gerçek ekran görüntüleri, tarayıcı
 * çerçevesi içinde gösterilir — "bu işleri yaptık" mesajını doğrudan verir.
 */
export const PortfolioTeaser = LiveProjectsShowcase;

export function LiveProjectsShowcase({
  projects,
  totalCount,
}: {
  projects: ReferenceCardData[];
  totalCount: number;
}) {
  if (projects.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 py-20 lg:py-28">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-slate-200/80" />

      <div className="container-page relative">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md border border-[#b8c9b2] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#345f3a] shadow-[0_12px_30px_-24px_rgb(20_31_20/.75)]">
              Yayındaki İşler
            </span>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-[1.05] tracking-tight text-[#111811] sm:text-5xl lg:text-6xl">
              Satışa hazır, <em className="italic text-brand-700">canlıda çalışan web siteleri</em>
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-8 text-[#354238] sm:text-lg">
              Buradaki projeler sadece görsel tasarım değil; ziyaretçi karşılayan, randevu ve sipariş akışı kuran gerçek dijital vitrinlerdir. Kendi markanız için nasıl bir sonuç alacağınızı canlı örneklerle görün.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ButtonLink href="/projeler" variant="outline" size="lg" className="border-[#9daf97] bg-white font-bold text-[#162415] hover:bg-[#17331b] hover:text-white">
                Tüm Referansları Gör ({totalCount}) →
              </ButtonLink>
              <ButtonLink href="/teklif" size="lg" className="bg-[#17331b] font-bold text-white hover:bg-[#244f2a]">
                Benzerini Yaptır
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
            <ReferenceCard key={p.id} project={p} size="lg" />
          ))}
        </div>

        <div className="mt-10 grid gap-4 border-y border-[#c8d7c2] py-6 text-sm text-[#354238] sm:grid-cols-3">
          <p><strong className="text-[#111811]">Gerçek ekranlar:</strong> Kartlarda yayındaki projelerin görselleri kullanılır.</p>
          <p><strong className="text-[#111811]">Sektöre uygun yapı:</strong> Sağlık, hizmet ve satış odaklı sayfalar ayrı kurgulanır.</p>
          <p><strong className="text-[#111811]">Satışa yakın akış:</strong> Ziyaretçiyi inceleme, iletişim ve teklif adımlarına taşır.</p>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------- Mağaza tarafı referans vitrini */

/**
 * Ürün satışı bölümünün başında gösterilen kanıt şeridi.
 *
 * Hazır bir web sitesi satın almayı düşünen ziyaretçi, aynı ekibin gerçekten
 * yayına aldığı siteleri satın almadan önce inceleyebilsin diye eklendi.
 */
export function StoreReferences({ projects }: { projects: ReferenceCardData[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="section-blend py-16 lg:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Satın almadan önce"
          title="Aldığınız işin gerçek karşılığı"
          description="Mağazadaki ürünler, aşağıdaki gibi yayına aldığımız sitelerle aynı ekip ve aynı altyapıyla hazırlanıyor. İçeriğe yakından bakmak için projeyi açın ya da doğrudan canlı siteyi ziyaret edin."
          action={
            <ButtonLink href="/projeler" variant="outline" size="sm">
              Tüm referanslar
            </ButtonLink>
          }
        />
        <div className="mt-9 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ReferenceCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- SSS */

export function FaqSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 py-16 lg:py-24">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-slate-200/80" />

      <div className="container-page relative grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
        <div className="rounded-lg border border-[#c8d6c1] bg-white/82 p-5 shadow-[0_26px_80px_-66px_rgba(15,35,18,.72)] sm:p-8">
          <span className="inline-flex rounded-md border border-[#b8c9b2] bg-[#eef3ea] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#345f3a]">
            Sık sorulan sorular
          </span>
          <h2 className="mt-5 max-w-md font-serif text-2xl font-medium leading-tight text-[#111811] sm:text-4xl">
            Satın almadan önce <em className="italic text-brand-700">aklınızda soru kalmasın.</em>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#556055] sm:text-base sm:leading-8">
            Ürün teslimi, lisans, fatura ve demo süreçlerini net anlattık. Aradığınız cevabı bulamazsanız ekibimiz size aynı gün dönüş yapar.
          </p>

          <div className="mt-7 grid gap-3 text-sm font-bold text-[#243024] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {["Canlı demo ile inceleme", "Faturalı teslim", "Lisans ve kod devri", "Kurulum desteği"].map((item) => (
              <span key={item} className="rounded-md border border-[#d7e1d2] bg-[#f8fbf4] px-3.5 py-3 sm:px-4">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/sss" variant="outline" size="sm">
              Tüm sorular
            </ButtonLink>
            <ButtonLink href={whatsappLink("Merhaba, hazır web sitesi satın alma süreci hakkında bilgi almak istiyorum.")} size="sm">
              Destek Al
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-lg border border-[#c8d6c1] bg-white p-2 shadow-[0_32px_95px_-72px_rgba(15,35,18,.9)]">
          <div className="flex items-center justify-between border-b border-[#d7e1d2] px-4 py-3 sm:px-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4f7755]">Yardım merkezi</p>
              <p className="mt-1 text-sm font-bold text-[#111811]">En çok merak edilen konular</p>
            </div>
            <span className="rounded-md bg-[#17331b] px-3 py-1.5 text-xs font-black text-white">
              {faqs.length} soru
            </span>
          </div>
          <Accordion
            className="border-0 bg-transparent shadow-none [&>div>h3>button]:px-4 [&>div>h3>button]:py-5 [&>div>h3>button]:font-extrabold [&>div>h3>button]:text-[#111811] [&>div>h3>button:hover]:bg-[#f7f9f5] [&>div>div]:px-4 [&>div>div]:text-[0.95rem] [&>div>div]:leading-7 [&>div>div]:text-[#556055] sm:[&>div>h3>button]:px-5 sm:[&>div>div]:px-5"
            items={faqs.map((f) => ({ id: f.id, title: f.question, content: f.answer }))}
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Blog kartı */

export function BlogTeaser({
  posts,
}: {
  posts: { id: string; slug: string; title: string; excerpt: string; coverImage: string; publishedAt: Date; readMinutes: number; category: { name: string } }[];
}) {
  if (posts.length === 0) return null;
  return (
    <section className="container-page py-14 lg:py-20">
      <SectionHeading
        eyebrow="Blog ve rehberler"
        title="Karar vermenize yardımcı içerikler"
        action={
          <ButtonLink href="/blog" variant="outline" size="sm">
            Tüm yazılar
          </ButtonLink>
        }
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-surface transition-soft hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-ink-50">
              <Image
                src={post.coverImage}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Badge tone="brand">{post.category.name}</Badge>
                <span>{post.readMinutes} dk okuma</span>
              </div>
              <h3 className="mt-3 font-serif text-lg font-medium leading-snug tracking-tight text-ink-900">{post.title}</h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
              <p className="mt-4 text-xs text-ink-400">{formatDate(post.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- CTA */

export function ContactCta() {
  return (
    <section className="container-page py-14 lg:py-20">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-brand-200 bg-brand-50 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-14">
        <div>
          <h2 className="text-balance-title font-serif text-2xl font-medium tracking-tight text-ink-900 sm:text-3xl">
            Hazır ürünlerden <em className="italic text-brand-700">hiçbiri tam olarak uymuyor mu?</em>
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-600">
            İhtiyacınızı anlatın, size uygun ürünü önerelim veya özel geliştirme için teklif hazırlayalım.
            İlk görüşme ücretsizdir.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <ButtonLink href="/teklif" size="lg">
            Özel teklif isteyin
          </ButtonLink>
          <a
            href={whatsappLink("Merhaba, ihtiyacıma uygun bir ürün önerisi almak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center justify-center rounded-full border border-ink-900 px-7 text-base font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-canvas"
          >
            WhatsApp&apos;tan yazın
          </a>
          <a href={SITE.phoneHref} className="text-center text-sm text-ink-500 hover:text-ink-800">
            veya arayın: {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
