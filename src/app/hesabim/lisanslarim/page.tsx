import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { parseJsonArray } from "@/lib/data/products";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { LICENSE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { DomainManager } from "@/components/account/DomainManager";

export const metadata: Metadata = { title: "Lisanslarım", robots: { index: false, follow: false } };

export default async function LicensesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const licenses = await prisma.licenseKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, slug: true } },
      order: { select: { orderNumber: true } },
    },
  });

  if (licenses.length === 0) {
    return (
      <EmptyState
        title="Henüz lisansınız yok"
        description="Bir ürün satın aldığınızda lisans anahtarınız otomatik olarak burada görünür."
        action={<ButtonLink href="/magaza">Ürünlere göz at</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Lisanslarım</h2>
      <p className="mt-2 text-sm text-ink-500">
        Lisans anahtarınızı kurulum sırasında kullanırsınız. Domain tanımlarınızı buradan yönetebilirsiniz.
      </p>

      <ul className="mt-5 space-y-4">
        {licenses.map((license) => {
          const domains = parseJsonArray(license.domains);
          const expired = license.validUntil ? license.validUntil < new Date() : false;
          return (
            <li key={license.id} className="rounded-[var(--radius-card)] border border-ink-100 bg-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/urun/${license.product.slug}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {license.product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {LICENSE_LABELS[license.licenseType] ?? license.licenseType} · Sipariş{" "}
                    {license.order.orderNumber}
                  </p>
                </div>
                <Badge tone={license.isActive && !expired ? "brand" : "neutral"}>
                  {license.isActive && !expired ? "Aktif" : "Güncelleme süresi doldu"}
                </Badge>
              </div>

              <p className="mt-4 select-all rounded-xl bg-ink-50 px-4 py-3 font-mono text-sm font-semibold tracking-wide text-ink-900">
                {license.key}
              </p>

              <p className="mt-3 text-xs text-ink-500">
                {license.domainLimit >= 999 ? "Sınırsız domain" : `${license.domainLimit} domain hakkı`}
                {license.validUntil && ` · güncelleme erişimi ${formatDate(license.validUntil)} tarihine kadar`}
              </p>

              <DomainManager
                licenseId={license.id}
                domains={domains}
                limit={license.domainLimit}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
