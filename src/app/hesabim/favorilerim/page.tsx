import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { productCardSelect } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink, EmptyState } from "@/components/ui";

export const metadata: Metadata = { title: "Favorilerim", robots: { index: false, follow: false } };

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { select: productCardSelect } },
  });

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Favori listeniz boş"
        description="Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz."
        action={<ButtonLink href="/magaza">Ürünlere göz at</ButtonLink>}
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Favorilerim</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {favorites.map((f) => (
          <ProductCard key={f.id} product={f.product} />
        ))}
      </div>
    </div>
  );
}
