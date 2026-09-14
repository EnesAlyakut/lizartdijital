import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView, type SearchParams } from "@/components/shop/ShopView";
import { SITE } from "@/lib/constants";

/** URL parçası → ürün türü eşlemesi ve sayfa metinleri. */
const TYPE_PAGES = {
  "hazir-web-siteleri": {
    type: "website",
    title: "Hazır web siteleri",
    description:
      "Kurumsal siteden e-ticarete, restorandan kliniğe kadar sektöre özel hazır web siteleri. Canlı demoyu inceleyin, lisansı seçin, kurulumu isterseniz biz yapalım.",
    meta: "Hazır Web Siteleri — Kurumsal, e-ticaret, restoran, klinik",
  },
  "mobil-uygulamalar": {
    type: "app",
    title: "Mobil uygulamalar",
    description:
      "iOS ve Android için yayına hazır uygulamalar. Mağaza yayın süreçlerini de ek hizmet olarak üstleniyoruz.",
    meta: "Mobil Uygulamalar — iOS ve Android için hazır uygulamalar",
  },
  "web-uygulamalari": {
    type: "webapp",
    title: "Web uygulamaları",
    description: "CRM, stok yönetimi, SaaS ve yapay zekâ tabanlı web uygulamaları.",
    meta: "Web Uygulamaları — CRM, stok, SaaS ve yapay zekâ çözümleri",
  },
  "hazir-sistemler": {
    type: "system",
    title: "Hazır sistemler",
    description: "Randevu, rezervasyon, personel ve abonelik yönetimi gibi hazır iş sistemleri.",
    meta: "Hazır Sistemler — Randevu, rezervasyon ve yönetim sistemleri",
  },
  "tema-sablonlar": {
    type: "template",
    title: "Tema ve şablonlar",
    description: "Kendi geliştirme ekibiniz varsa hızlı başlangıç için tema ve şablon paketleri.",
    meta: "Tema ve Şablonlar — Hazır arayüz şablonları",
  },
  "hizmet-paketleri": {
    type: "service",
    title: "Dijital hizmet paketleri",
    description:
      "Kurulumdan SEO'ya, sosyal medyadan reklam yönetimine kadar uçtan uca yürüttüğümüz hizmet paketleri.",
    meta: "Dijital Hizmet Paketleri — SEO, reklam, içerik ve bakım",
  },
} as const;

type TypeSlug = keyof typeof TYPE_PAGES;

export function generateStaticParams() {
  return Object.keys(TYPE_PAGES).map((tur) => ({ tur }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tur: string }>;
}): Promise<Metadata> {
  const { tur } = await params;
  const page = TYPE_PAGES[tur as TypeSlug];
  if (!page) return {};
  return {
    title: page.meta,
    description: page.description,
    alternates: { canonical: `${SITE.url}/magaza/${tur}` },
    openGraph: { title: page.meta, description: page.description },
  };
}

export default async function TypePage({
  params,
  searchParams,
}: {
  params: Promise<{ tur: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { tur } = await params;
  const page = TYPE_PAGES[tur as TypeSlug];
  if (!page) notFound();

  const sp = await searchParams;

  return (
    <ShopView
      searchParams={sp}
      basePath={`/magaza/${tur}`}
      forcedType={page.type}
      title={page.title}
      description={page.description}
      breadcrumb={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Mağaza", href: "/magaza" },
        { label: page.title },
      ]}
    />
  );
}
