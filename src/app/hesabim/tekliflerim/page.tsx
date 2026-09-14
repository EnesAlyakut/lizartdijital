import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Tekliflerim", robots: { index: false, follow: false } };

const STATUS_LABELS: Record<string, string> = {
  yeni: "Alındı",
  incelemede: "İnceleniyor",
  "teklif-gonderildi": "Teklif gönderildi",
  kazanildi: "Onaylandı",
  kaybedildi: "Kapandı",
};

export default async function OffersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Hesaba bağlı veya aynı e-posta ile oluşturulmuş teklifler
  const offers = await prisma.offer.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    orderBy: { createdAt: "desc" },
  });

  if (offers.length === 0) {
    return (
      <EmptyState
        title="Teklif talebiniz yok"
        description="Hazır ürünler ihtiyacınızı karşılamıyorsa özel teklif isteyebilirsiniz. İlk görüşme ücretsizdir."
        action={<ButtonLink href="/teklif">Özel teklif iste</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Tekliflerim</h2>
      <ul className="mt-5 space-y-3">
        {offers.map((offer) => (
          <li key={offer.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">{offer.code}</p>
                <p className="mt-0.5 text-sm text-ink-500">{formatDate(offer.createdAt)}</p>
              </div>
              <div className="text-right">
                <Badge tone={offer.status === "kazanildi" ? "brand" : "neutral"}>
                  {STATUS_LABELS[offer.status] ?? offer.status}
                </Badge>
                {offer.amount && (
                  <p className="mt-2 font-semibold text-ink-900">{formatPrice(offer.amount)}</p>
                )}
              </div>
            </div>
            {offer.budget && <p className="mt-3 text-sm text-ink-600">Belirtilen bütçe: {offer.budget}</p>}
            {offer.message && <p className="mt-2 text-sm leading-relaxed text-ink-600">{offer.message}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
