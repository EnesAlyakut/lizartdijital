import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getComparisonProductIds } from "@/lib/actions/wishlist";
import { parseJsonArray } from "@/lib/data/products";
import { ClearComparisonButton } from "@/components/product/CompareButton";
import { Breadcrumb, ButtonLink, EmptyState } from "@/components/ui";
import { LICENSE_LABELS, PRODUCT_TYPE_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ürün karşılaştırma",
  description: "En fazla dört ürünü fiyat, teknoloji, lisans ve özellik bazında karşılaştırın.",
  robots: { index: false, follow: false },
};

export default async function ComparePage() {
  const ids = await getComparisonProductIds();

  const products = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids }, isPublished: true },
        include: {
          category: true,
          technologies: { include: { technology: true } },
          licenses: { orderBy: { sortOrder: "asc" } },
        },
      })
    : [];

  if (products.length === 0) {
    return (
      <div className="container-page py-12">
        <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Karşılaştırma" }]} />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900">Ürün karşılaştırma</h1>
        <div className="mt-8">
          <EmptyState
            title="Karşılaştırma listeniz boş"
            description="Ürün kartlarındaki karşılaştırma butonunu kullanarak en fazla dört ürünü yan yana inceleyebilirsiniz."
            action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
          />
        </div>
      </div>
    );
  }

  const rows: { label: string; render: (p: (typeof products)[number]) => React.ReactNode }[] = [
    { label: "Ürün türü", render: (p) => PRODUCT_TYPE_LABELS[p.type] ?? p.type },
    { label: "Kategori", render: (p) => p.category.name },
    {
      label: "Fiyat",
      render: (p) => (
        <span className="font-semibold text-ink-900">
          {formatPrice(p.basePrice)}
          <span className="text-xs font-normal text-ink-400"> + KDV</span>
        </span>
      ),
    },
    {
      label: "Teknoloji",
      render: (p) => p.technologies.map((t) => t.technology.name).join(", ") || "—",
    },
    {
      label: "Lisans seçenekleri",
      render: (p) => p.licenses.map((l) => LICENSE_LABELS[l.key] ?? l.name).join(", "),
    },
    { label: "Yönetim paneli", render: (p) => yesNo(p.hasAdminPanel) },
    { label: "Mobil uyumluluk", render: (p) => yesNo(p.isResponsive) },
    { label: "Çoklu dil", render: (p) => yesNo(p.multiLanguage) },
    { label: "Ödeme sistemi", render: (p) => yesNo(p.hasPayment) },
    { label: "Kurulum dahil", render: (p) => yesNo(p.includesSetup) },
    { label: "Kaynak kod", render: (p) => yesNo(p.includesSource) },
    {
      label: "Destek süresi",
      render: (p) => `${p.licenses[0]?.supportMonths ?? 3} ay (standart lisans)`,
    },
    {
      label: "Güncelleme süresi",
      render: (p) => `${p.licenses[0]?.updateMonths ?? 6} ay (standart lisans)`,
    },
    {
      label: "Özelleştirme",
      render: (p) =>
        p.licenses.some((l) => l.key === "ozel")
          ? "Size Özel lisansla mümkün"
          : "Ek hizmet olarak sunulur",
    },
    { label: "Teslim süresi", render: (p) => `${p.deliveryDays} iş günü` },
    {
      label: "İçerdiği modüller",
      render: (p) => (
        <ul className="space-y-1 text-xs">
          {parseJsonArray(p.modules).map((m) => (
            <li key={m}>• {m}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Karşılaştırma" }]} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Ürün karşılaştırma</h1>
          <p className="mt-2 text-ink-500">{products.length} ürün karşılaştırılıyor (en fazla 4).</p>
        </div>
        <ClearComparisonButton />
      </div>

      <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-ink-100">
        <table className="w-full min-w-[48rem] text-sm">
          <caption className="sr-only">Ürün karşılaştırma tablosu</caption>
          <thead>
            <tr className="bg-surface-2">
              <th scope="col" className="w-44 px-5 py-4 text-left font-medium text-ink-600">
                Özellik
              </th>
              {products.map((p) => (
                <th key={p.id} scope="col" className="px-5 py-4 text-left align-top">
                  <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-xl bg-ink-50">
                    <Image src={p.coverImage} alt="" fill sizes="240px" className="object-cover" />
                  </div>
                  <Link href={`/urun/${p.slug}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-surface">
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="bg-surface-2 px-5 py-3 text-left font-medium text-ink-700">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.id} className="px-5 py-3 align-top text-ink-600">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="bg-surface-2 px-5 py-3" />
              {products.map((p) => (
                <td key={p.id} className="px-5 py-4">
                  <ButtonLink href={`/urun/${p.slug}#satin-alma`} size="sm" className="w-full">
                    İncele ve satın al
                  </ButtonLink>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function yesNo(value: boolean) {
  return value ? <span className="font-medium text-brand-700">Var</span> : <span className="text-ink-400">Yok</span>;
}
