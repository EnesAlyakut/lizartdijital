import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { EmptyState, ButtonLink } from "@/components/ui";
import { formatDate, formatPriceDetailed } from "@/lib/utils";

export const metadata: Metadata = { title: "Faturalarım", robots: { index: false, follow: false } };

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const invoices = await prisma.invoice.findMany({
    where: { order: { userId: user.id } },
    orderBy: { issuedAt: "desc" },
    include: { order: { select: { orderNumber: true } } },
  });

  if (invoices.length === 0) {
    return (
      <EmptyState
        title="Faturanız bulunmuyor"
        description="Ödemesi tamamlanan her sipariş için otomatik olarak fatura düzenlenir ve burada listelenir."
        action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Faturalarım</h2>
      <p className="mt-2 text-sm text-ink-500">
        E-fatura veya e-arşiv belgeniz düzenlendiğinde e-posta adresinize gönderilir.
      </p>

      <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] border border-ink-100">
        <table className="w-full min-w-[36rem] text-sm">
          <caption className="sr-only">Fatura listesi</caption>
          <thead className="bg-surface-2 text-left text-ink-600">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Fatura no</th>
              <th scope="col" className="px-5 py-3 font-medium">Sipariş</th>
              <th scope="col" className="px-5 py-3 font-medium">Tarih</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">KDV</th>
              <th scope="col" className="px-5 py-3 text-right font-medium">Toplam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-surface">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-5 py-3 font-medium text-ink-900">{inv.number}</td>
                <td className="px-5 py-3">
                  <Link href={`/siparis/${inv.order.orderNumber}`} className="text-brand-700 hover:underline">
                    {inv.order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-600">{formatDate(inv.issuedAt)}</td>
                <td className="px-5 py-3 text-right text-ink-600">{formatPriceDetailed(inv.vatTotal)}</td>
                <td className="px-5 py-3 text-right font-semibold text-ink-900">
                  {formatPriceDetailed(inv.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
