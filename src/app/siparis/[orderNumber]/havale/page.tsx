import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Breadcrumb, ButtonLink, Card } from "@/components/ui";
import { SITE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Havale / EFT bilgileri",
  robots: { index: false, follow: false },
};

/** Havale/EFT talimatları. Banka bilgileri ortam değişkeninden okunur. */
export default async function BankTransferPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) notFound();

  const bank = {
    name: process.env.BANK_NAME ?? "Örnek Bank",
    accountName: process.env.BANK_ACCOUNT_NAME ?? "Lizart Dijital",
    iban: process.env.BANK_IBAN ?? "TR00 0000 0000 0000 0000 0000 00",
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: `Sipariş ${order.orderNumber}`, href: `/siparis/${order.orderNumber}` },
          { label: "Havale / EFT" },
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Havale / EFT ile ödeme</h1>
        <p className="mt-3 leading-relaxed text-ink-500">
          Siparişiniz oluşturuldu. Aşağıdaki hesaba ödeme yaptıktan sonra teslimat otomatik olarak
          başlatılır. Açıklama alanına <strong className="text-ink-800">sipariş numaranızı</strong> yazmayı
          unutmayın.
        </p>

        <Card className="mt-8 p-6">
          <dl className="space-y-4 text-sm">
            <Row label="Banka" value={bank.name} />
            <Row label="Hesap adı" value={bank.accountName} />
            <Row label="IBAN" value={bank.iban} mono />
            <Row label="Açıklama" value={order.orderNumber} mono />
            <Row label="Tutar" value={formatPrice(order.total)} strong />
          </dl>
        </Card>

        <div className="mt-6 rounded-2xl border border-ink-100 bg-surface-2 p-5 text-sm leading-relaxed text-ink-600">
          <p className="font-medium text-ink-900">Sonraki adımlar</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5">
            <li>Ödemeyi yukarıdaki hesaba gönderin.</li>
            <li>Ödeme hesabımıza geçtiğinde siparişiniz otomatik olarak &quot;ödendi&quot; durumuna geçer.</li>
            <li>
              Lisans anahtarınız ve indirme bağlantılarınız sipariş sayfanızda ve e-postanızda görünür.
            </li>
          </ol>
          <p className="mt-4 text-xs text-ink-500">
            Banka transferleri hafta sonu ve tatil günlerinde gecikebilir. Ödemenizi yaptıysanız ve 1 iş günü
            içinde durum değişmediyse {SITE.email} adresine yazabilirsiniz.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/siparis/${order.orderNumber}`}>Sipariş sayfasına dön</ButtonLink>
          <ButtonLink href="/iletisim" variant="outline">
            Destek ekibine yaz
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  strong,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-100 pb-3 last:border-0 last:pb-0">
      <dt className="text-ink-500">{label}</dt>
      <dd
        className={`select-all ${mono ? "font-mono text-sm" : ""} ${
          strong ? "text-lg font-semibold" : "font-medium"
        } text-ink-900`}
      >
        {value}
      </dd>
    </div>
  );
}
