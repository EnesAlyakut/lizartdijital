import type { Metadata } from "next";
import { ChartNoAxesCombined, Gauge, LibraryBig, MonitorSmartphone } from "lucide-react";
import { prisma } from "@/lib/db";
import { Breadcrumb } from "@/components/ui";
import { BlogDirectory } from "@/components/blog/BlogDirectory";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog & Dijital Büyüme Rehberleri",
  description:
    "E-ticaret, SEO, web tasarım, mobil uygulama ve dijital pazarlama üzerine uygulanabilir profesyonel rehberler.",
  alternates: { canonical: `${SITE.url}/blog` },
};

const TOPICS = [
  { label: "#ETicaret", query: "eticaret" },
  { label: "#WebTasarım", query: "web" },
  { label: "#SEORehberi", query: "seo" },
  { label: "#MobilUygulama", query: "mobil" },
  { label: "#DönüşümOptimizasyonu", query: "donusum" },
];

const EDITORS_PICKS = [
  {
    icon: Gauge,
    title: "Hız & Performans",
    desc: "1 saniyenin altındaki açılış süreleri e-ticaret dönüşümlerini %20'nin üzerinde artırır.",
  },
  {
    icon: MonitorSmartphone,
    title: "Mobil Öncelikli Deneyim",
    desc: "Ziyaretçilerin %75'i mobilden gelir; sepet adımları tek elle tamamlanabilecek sadelikte olmalıdır.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Sürekli Ölçümleme",
    desc: "Ölçmediğiniz hiçbir şeyi büyütemezsiniz. Arama niyetini ve kullanıcı davranışını aylık takip edin.",
  },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: { where: { isPublished: true } } } } },
    }),
  ]);

  return (
    <div className="container-page py-8 lg:py-14">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Blog" }]} />

      <section className="relative mt-8 overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-b from-brand-50/70 via-white to-surface-2 py-14 text-center sm:py-20">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-200/25 blur-[100px]" />

        <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-800 shadow-2xs">
            <LibraryBig className="size-3.5" />
            Lizart Bilgi Merkezi
          </span>

          <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.12] text-ink-950 sm:text-5xl">
            Dijitalde büyümeniz için
            <br />
            <em className="italic text-brand-700">stratejik rehberler.</em>
          </h1>

          <p className="mt-5 text-sm leading-7 text-ink-600 sm:text-base">
            Hazır web sitelerinden özel yazılımlara, SEO taktiklerinden reklam bütçesi yönetimine kadar
            işletmenizi bir adım öne geçirecek uygulanabilir bilgiler.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {TOPICS.map((t) => (
              <span
                key={t.label}
                className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-2xs"
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* İnteraktif Blog Listesi ve Öne Çıkan Vitrin */}
      <BlogDirectory
        posts={posts}
        categories={categories}
        initialCategory={kategori}
      />

      <section className="mt-20 rounded-3xl border border-ink-100 bg-surface-2 p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Özet Strateji</span>
          <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink-950 sm:text-3xl">
            Başarılı Bir Dijital Varlığın 3 Temel Direği
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            Yayınladığımız tüm rehberlerin ve geliştirdiğimiz projelerin merkezinde bu üç kural yer alır.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {EDITORS_PICKS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-ink-100 bg-surface p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Yenilenen Bülten Daveti — Yüksek Kontrast & Net Okunabilirlik */}
      <section className="relative mt-16 overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-brand-900 via-[#0e1e17] to-[#0a150f] p-8 text-white shadow-xl sm:p-14">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 border border-[#dfe9cf]/25 bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#dfe9cf] shadow-sm">
            <LibraryBig className="size-4" />
            Haftalık Dijital Notlar
          </span>

          <h2 className="mt-5 font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl lg:text-4xl">
            Yeni Rehberleri &amp; Analizleri Kaçırmayın
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-200 max-w-xl mx-auto font-normal">
            Ayda en fazla 2 kez, doğrudan işinize yarayacak teknik ve pazarlama ipuçlarını e-posta kutunuza gönderiyoruz. Spam yok, dilediğiniz zaman çıkabilirsiniz.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>
    </div>
  );
}
