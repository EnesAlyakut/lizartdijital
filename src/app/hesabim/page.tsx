import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card, EmptyState, ButtonLink, Badge } from "@/components/ui";
import { ORDER_STATUS_LABELS, PROJECT_STAGES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Hesabım",
  robots: { index: false, follow: false },
};

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orders, licenses, downloads, projects, tickets, favorites] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: { select: { productName: true } } },
    }),
    prisma.licenseKey.count({ where: { userId: user.id, isActive: true } }),
    prisma.download.count({ where: { userId: user.id } }),
    prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 2,
    }),
    prisma.supportTicket.count({ where: { userId: user.id, status: { not: "kapali" } } }),
    prisma.favorite.count({ where: { userId: user.id } }),
  ]);

  const stats = [
    { label: "Sipariş", value: await prisma.order.count({ where: { userId: user.id } }), href: "/hesabim/siparislerim" },
    { label: "Aktif lisans", value: licenses, href: "/hesabim/lisanslarim" },
    { label: "İndirme hakkı", value: downloads, href: "/hesabim/indirmelerim" },
    { label: "Açık destek talebi", value: tickets, href: "/hesabim/destek" },
    { label: "Favori", value: favorites, href: "/hesabim/favorilerim" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="sr-only">Özet</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-ink-100 bg-surface p-5 transition-soft hover:border-brand-300 hover:shadow-[var(--shadow-card)]"
            >
              <p className="text-2xl font-semibold tracking-tight text-ink-900">{s.value}</p>
              <p className="mt-1 text-xs text-ink-500">{s.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-ink-900">Son siparişler</h2>
          <Link href="/hesabim/siparislerim" className="text-sm text-brand-700 hover:underline">
            Tümünü gör
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Henüz siparişiniz yok"
              description="Mağazadan bir ürün seçtiğinizde siparişleriniz burada listelenir."
              action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/siparis/${order.orderNumber}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-surface p-5 transition-soft hover:border-brand-300 hover:shadow-[var(--shadow-card)]"
                >
                  <div>
                    <p className="font-semibold text-ink-900">{order.orderNumber}</p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {order.items.map((i) => i.productName).join(", ")}
                    </p>
                    <p className="mt-1 text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink-900">{formatPrice(order.total)}</p>
                    <Badge tone={order.status === "bekliyor" ? "neutral" : "brand"}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {projects.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-ink-900">Devam eden projeler</h2>
            <Link href="/hesabim/projelerim" className="text-sm text-brand-700 hover:underline">
              Tümünü gör
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {projects.map((p) => {
              const stageIndex = PROJECT_STAGES.findIndex((s) => s.key === p.currentStage);
              const percent = Math.round(((stageIndex + 1) / PROJECT_STAGES.length) * 100);
              return (
                <li key={p.id}>
                  <Link
                    href="/hesabim/projelerim"
                    className="block rounded-2xl border border-ink-100 bg-surface p-5 transition-soft hover:border-brand-300 hover:shadow-[var(--shadow-card)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-ink-900">{p.title}</p>
                      <Badge tone="brand">
                        {PROJECT_STAGES[stageIndex]?.name ?? "Başlatıldı"}
                      </Badge>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-ink-500">%{percent} tamamlandı · {p.code}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <Card className="p-6">
        <h2 className="font-semibold text-ink-900">Yardım mı gerekiyor?</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Kurulum, lisans veya güncelleme konularında destek talebi oluşturabilirsiniz. Hafta içi 09:00–18:30
          arasında yanıt veriyoruz.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <ButtonLink href="/hesabim/destek" size="sm">
            Destek talebi oluştur
          </ButtonLink>
          <ButtonLink href="/destek" variant="outline" size="sm">
            Destek Merkezi
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
