import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ButtonLink, EmptyState } from "@/components/ui";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Kuponlarım", robots: { index: false, follow: false } };

export default async function CouponsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const now = new Date();
  // Herkese açık, aktif kampanya kuponları listelenir.
  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      OR: [{ endsAt: null }, { endsAt: { gt: now } }],
    },
    orderBy: { code: "asc" },
  });

  const usable = coupons.filter((c) => !c.maxUses || c.usedCount < c.maxUses);

  if (usable.length === 0) {
    return (
      <EmptyState
        title="Kullanılabilir kuponunuz yok"
        description="Kampanya dönemlerinde tanımlanan kuponlar burada listelenir. Bültenimize katılarak kampanyalardan haberdar olabilirsiniz."
        action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Kuponlarım</h2>
      <p className="mt-2 text-sm text-ink-500">
        Kupon kodunu sepet sayfasındaki kupon alanına yazarak kullanabilirsiniz.
      </p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {usable.map((c) => (
          <li key={c.id} className="rounded-[var(--radius-card)] border border-dashed border-brand-300 bg-brand-50 p-6">
            <p className="select-all font-mono text-lg font-bold tracking-wider text-brand-800">{c.code}</p>
            <p className="mt-2 text-sm text-ink-700">
              {c.type === "yuzde" ? `%${c.value} indirim` : `${formatPrice(c.value)} indirim`}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {c.minSubtotal > 0 && `Minimum sepet tutarı ${formatPrice(c.minSubtotal)}`}
              {c.endsAt && ` · son kullanma ${formatDate(c.endsAt)}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
