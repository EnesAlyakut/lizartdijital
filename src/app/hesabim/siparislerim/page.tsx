import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Siparişlerim", robots: { index: false, follow: false } };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true, productName: true, licenseName: true, lineTotal: true } },
      invoices: { select: { number: true } },
    },
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Henüz siparişiniz yok"
        description="Satın aldığınız ürünler, lisanslarınız ve indirme bağlantılarınız burada listelenir."
        action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Siparişlerim</h2>
      <ul className="mt-5 space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink-900">{order.orderNumber}</p>
                <p className="mt-0.5 text-sm text-ink-500">{formatDate(order.createdAt)}</p>
                {order.invoices[0] && (
                  <p className="mt-0.5 text-xs text-ink-400">Fatura: {order.invoices[0].number}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-ink-900">{formatPrice(order.total)}</p>
                <Badge tone={order.status === "bekliyor" ? "neutral" : "brand"}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </Badge>
              </div>
            </div>

            <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex flex-wrap justify-between gap-2">
                  <span className="text-ink-700">
                    {item.productName} <span className="text-ink-400">· {item.licenseName}</span>
                  </span>
                  <span className="text-ink-600">{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/siparis/${order.orderNumber}`}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                Sipariş detayı
              </Link>
              {order.status === "bekliyor" && (
                <Link
                  href={`/siparis/${order.orderNumber}/havale`}
                  className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-canvas hover:bg-brand-400"
                >
                  Ödeme bilgileri
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
