import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { DownloadButton } from "@/components/order/DownloadButton";
import { ButtonLink, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "İndirmelerim", robots: { index: false, follow: false } };

export default async function DownloadsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const downloads = await prisma.download.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      file: { include: { product: { select: { name: true, slug: true } }, version: true } },
      order: { select: { orderNumber: true, status: true } },
    },
  });

  if (downloads.length === 0) {
    return (
      <EmptyState
        title="İndirilebilecek dosyanız yok"
        description="Ödemesi tamamlanan siparişlerinizin dosyaları burada listelenir ve süreli, imzalı bağlantılarla indirilir."
        action={<ButtonLink href="/magaza">Ürünlere göz at</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">İndirmelerim</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        İndirme bağlantıları güvenlik nedeniyle süreli üretilir ve her indirme kayıt altına alınır. Limitiniz
        dolarsa destek ekibimiz yeni hak tanımlayabilir.
      </p>

      <ul className="mt-5 space-y-3">
        {downloads.map((d) => {
          const expired = d.expiresAt < new Date();
          const exhausted = d.usedCount >= d.maxCount;
          const unpaid = d.order.status === "bekliyor";
          return (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-ink-100 bg-surface p-5"
            >
              <div>
                <p className="font-medium text-ink-900">{d.file.product.name}</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {d.file.label}
                  {d.file.version && ` · sürüm ${d.file.version.version}`}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  Sipariş {d.order.orderNumber} · kalan hak {Math.max(0, d.maxCount - d.usedCount)}/{d.maxCount} ·
                  son kullanma {formatDate(d.expiresAt)}
                  {d.lastAt && ` · son indirme ${formatDate(d.lastAt)}`}
                </p>
              </div>
              {unpaid ? (
                <p className="text-sm text-ink-400">Ödeme bekleniyor</p>
              ) : expired ? (
                <p className="text-sm text-ink-400">Süresi doldu</p>
              ) : (
                <DownloadButton downloadId={d.id} disabled={exhausted} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
