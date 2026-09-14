import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Güncellemeler", robots: { index: false, follow: false } };

export default async function UpdatesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Kullanıcının sahip olduğu ürünlerin sürüm geçmişi
  const licenses = await prisma.licenseKey.findMany({
    where: { userId: user.id },
    select: { productId: true, validUntil: true, product: { select: { name: true, slug: true } } },
  });

  if (licenses.length === 0) {
    return (
      <EmptyState
        title="Takip edeceğiniz güncelleme yok"
        description="Bir ürün satın aldığınızda, o ürüne ait yeni sürümler ve değişiklik notları burada listelenir."
        action={<ButtonLink href="/magaza">Ürünlere göz at</ButtonLink>}
      />
    );
  }

  const versions = await prisma.productVersion.findMany({
    where: { productId: { in: licenses.map((l) => l.productId) }, isPublished: true },
    orderBy: { releasedAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  const accessUntil = new Map(licenses.map((l) => [l.productId, l.validUntil]));

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Güncellemeler</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Sahip olduğunuz ürünlerin sürüm geçmişi. Lisansınızın güncelleme süresi dolmadıysa yeni sürümleri
        İndirmelerim bölümünden ücretsiz alabilirsiniz.
      </p>

      <ul className="mt-5 space-y-3">
        {versions.map((v) => {
          const until = accessUntil.get(v.productId);
          const covered = !until || until > v.releasedAt;
          return (
            <li key={v.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link href={`/urun/${v.product.slug}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {v.product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-500">Sürüm {v.version}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={covered ? "brand" : "neutral"}>
                    {covered ? "Lisansınız kapsıyor" : "Güncelleme süresi dışında"}
                  </Badge>
                  <span className="text-xs text-ink-400">{formatDate(v.releasedAt)}</span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{v.changelog}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <ButtonLink href="/hesabim/indirmelerim" variant="outline" size="sm">
          İndirmelerime git
        </ButtonLink>
      </div>
    </div>
  );
}
