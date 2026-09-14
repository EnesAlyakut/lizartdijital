import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Badge, ButtonLink, EmptyState } from "@/components/ui";
import { PRODUCT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Satın aldıklarım", robots: { index: false, follow: false } };

export default async function PurchasedProductsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const items = await prisma.orderItem.findMany({
    where: { order: { userId: user.id, status: { notIn: ["bekliyor", "iptal"] } } },
    orderBy: { order: { createdAt: "desc" } },
    include: {
      product: {
        select: {
          slug: true, name: true, coverImage: true, type: true,
          category: { select: { name: true } },
          versions: { orderBy: { releasedAt: "desc" }, take: 1, select: { version: true, releasedAt: true } },
        },
      },
      order: { select: { orderNumber: true, createdAt: true } },
    },
  });

  if (items.length === 0) {
    return (
      <EmptyState
        title="Henüz ürün satın almadınız"
        description="Satın aldığınız web siteleri, uygulamalar ve hizmet paketleri burada toplanır."
        action={<ButtonLink href="/magaza">Mağazaya git</ButtonLink>}
      />
    );
  }

  // Aynı ürün birden çok kez alınmışsa en son sipariş gösterilir.
  const unique = new Map<string, (typeof items)[number]>();
  for (const item of items) if (!unique.has(item.productId)) unique.set(item.productId, item);

  const websites = [...unique.values()].filter((i) => ["website", "template"].includes(i.product.type));
  const apps = [...unique.values()].filter((i) => ["app", "webapp", "system"].includes(i.product.type));
  const services = [...unique.values()].filter((i) => i.product.type === "service");

  return (
    <div className="space-y-10">
      <Group title="Satın aldığım web siteleri" items={websites} />
      <Group title="Satın aldığım uygulamalar ve sistemler" items={apps} />
      <Group title="Hizmet paketlerim" items={services} />
    </div>
  );
}

function Group({
  title,
  items,
}: {
  title: string;
  items: {
    id: string;
    productId: string;
    licenseName: string;
    order: { orderNumber: string; createdAt: Date };
    product: {
      slug: string; name: string; coverImage: string; type: string;
      category: { name: string };
      versions: { version: string; releasedAt: Date }[];
    };
  }[];
}) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="overflow-hidden rounded-[var(--radius-card)] border border-ink-100 bg-surface">
            <div className="relative aspect-[16/9] bg-ink-50">
              <Image src={item.product.coverImage} alt="" fill sizes="400px" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs text-ink-400">
                {PRODUCT_TYPE_LABELS[item.product.type]} · {item.product.category.name}
              </p>
              <h3 className="mt-1 font-semibold text-ink-900">
                <Link href={`/urun/${item.product.slug}`} className="hover:text-brand-700">
                  {item.product.name}
                </Link>
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone="brand">{item.licenseName}</Badge>
                {item.product.versions[0] && (
                  <Badge tone="outline">Son sürüm {item.product.versions[0].version}</Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-ink-400">
                {item.order.orderNumber} · {formatDate(item.order.createdAt)}
              </p>
              <div className="mt-4 flex gap-2">
                <ButtonLink href="/hesabim/indirmelerim" size="sm" variant="outline" className="flex-1">
                  İndir
                </ButtonLink>
                <ButtonLink href="/hesabim/guncellemeler" size="sm" variant="ghost" className="flex-1">
                  Güncellemeler
                </ButtonLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
