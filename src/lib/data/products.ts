import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma";
import type { SortKey } from "@/lib/constants";

/** Ürün kartı için gereken minimum alanlar. */
export const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  type: true,
  shortDesc: true,
  basePrice: true,
  comparePrice: true,
  coverImage: true,
  demoUrl: true,
  ratingAvg: true,
  ratingCount: true,
  salesCount: true,
  deliveryDays: true,
  isResponsive: true,
  hasAdminPanel: true,
  includesSetup: true,
  includesSource: true,
  multiLanguage: true,
  isNew: true,
  isBestSeller: true,
  category: { select: { name: true, slug: true } },
  technologies: { select: { technology: { select: { name: true, slug: true } } } },
  // Karttan doğrudan sepete eklemek için standart lisansın kimliği
  licenses: { where: { key: "standart" }, select: { id: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export type ShopFilters = {
  q?: string;
  type?: string[];
  category?: string[];
  technology?: string[];
  platform?: string[];
  style?: string[];
  minPrice?: number;
  maxPrice?: number;
  maxDelivery?: number;
  hasAdminPanel?: boolean;
  includesSetup?: boolean;
  includesSource?: boolean;
  multiLanguage?: boolean;
  hasPayment?: boolean;
  isResponsive?: boolean;
  onlyDiscounted?: boolean;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

function buildWhere(f: ShopFilters): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [{ isPublished: true }];

  if (f.q?.trim()) {
    const q = f.q.trim();
    and.push({
      OR: [
        { name: { contains: q } },
        { shortDesc: { contains: q } },
        { description: { contains: q } },
        { category: { name: { contains: q } } },
      ],
    });
  }
  if (f.type?.length) and.push({ type: { in: f.type } });
  if (f.category?.length) and.push({ category: { slug: { in: f.category } } });
  if (f.technology?.length)
    and.push({ technologies: { some: { technology: { slug: { in: f.technology } } } } });
  if (f.platform?.length)
    and.push({ platforms: { some: { platform: { slug: { in: f.platform } } } } });
  if (f.style?.length) and.push({ designStyle: { in: f.style } });
  if (typeof f.minPrice === "number") and.push({ basePrice: { gte: f.minPrice } });
  if (typeof f.maxPrice === "number") and.push({ basePrice: { lte: f.maxPrice } });
  if (typeof f.maxDelivery === "number") and.push({ deliveryDays: { lte: f.maxDelivery } });
  if (f.hasAdminPanel) and.push({ hasAdminPanel: true });
  if (f.includesSetup) and.push({ includesSetup: true });
  if (f.includesSource) and.push({ includesSource: true });
  if (f.multiLanguage) and.push({ multiLanguage: true });
  if (f.hasPayment) and.push({ hasPayment: true });
  if (f.isResponsive) and.push({ isResponsive: true });
  if (f.onlyDiscounted) and.push({ comparePrice: { not: null } });

  return { AND: and };
}

function buildOrderBy(sort: SortKey = "onerilen"): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "yeni":
      return [{ createdAt: "desc" }, { isNew: "desc" }];
    case "cok-satan":
      return [{ salesCount: "desc" }];
    case "puan":
      return [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
    case "incelenen":
      return [{ viewCount: "desc" }];
    case "indirimli":
      // İndirim oranı SQL'de hesaplanamadığı için eski fiyatı olanlar öne alınır,
      // kesin sıralama uygulama katmanında yapılır.
      return [{ comparePrice: "desc" }];
    case "fiyat-artan":
      return [{ basePrice: "asc" }];
    case "fiyat-azalan":
      return [{ basePrice: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { salesCount: "desc" }];
  }
}

export async function searchProducts(f: ShopFilters) {
  const perPage = Math.min(f.perPage ?? 12, 48);
  const page = Math.max(1, f.page ?? 1);
  const where = buildWhere(f);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: productCardSelect,
      orderBy: buildOrderBy(f.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const sorted =
    f.sort === "indirimli"
      ? [...items].sort((a, b) => discountRate(b) - discountRate(a))
      : items;

  return { items: sorted, total, page, perPage, pageCount: Math.max(1, Math.ceil(total / perPage)) };
}

function discountRate(p: { basePrice: number; comparePrice: number | null }) {
  if (!p.comparePrice || p.comparePrice <= p.basePrice) return 0;
  return (p.comparePrice - p.basePrice) / p.comparePrice;
}

export function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      videos: true,
      technologies: { include: { technology: true } },
      platforms: { include: { platform: true } },
      licenses: { orderBy: { sortOrder: "asc" } },
      addOns: { include: { addOn: true } },
      versions: { where: { isPublished: true }, orderBy: { releasedAt: "desc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

/** Ana sayfa vitrinleri — tek turda ihtiyaç duyulan tüm listeler. */
export async function getHomeCollections() {
  const [featured, bestSellers, newest, discounted, apps] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true, isFeatured: true, type: "website" },
      select: productCardSelect,
      orderBy: { salesCount: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: productCardSelect,
      orderBy: { salesCount: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true, comparePrice: { not: null } },
      select: productCardSelect,
      orderBy: { salesCount: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { isPublished: true, type: { in: ["app", "webapp"] } },
      select: productCardSelect,
      orderBy: { salesCount: "desc" },
      take: 6,
    }),
  ]);
  return { featured, bestSellers, newest, discounted, apps };
}

export function getServicePackages() {
  return prisma.product.findMany({
    where: { isPublished: true, type: "service" },
    select: productCardSelect,
    orderBy: { basePrice: "asc" },
  });
}

/** Mağaza filtre panelinde kullanılacak seçenekler (adetleriyle birlikte). */
export async function getFilterOptions() {
  const [categories, technologies, platforms, priceRange] = await Promise.all([
    prisma.productCategory.findMany({
      where: { products: { some: { isPublished: true } } },
      select: { slug: true, name: true, kind: true, _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.technology.findMany({
      where: { products: { some: { product: { isPublished: true } } } },
      select: { slug: true, name: true, group: true, _count: { select: { products: true } } },
    }),
    prisma.platform.findMany({
      where: { products: { some: { product: { isPublished: true } } } },
      select: { slug: true, name: true, _count: { select: { products: true } } },
    }),
    prisma.product.aggregate({
      where: { isPublished: true },
      _min: { basePrice: true },
      _max: { basePrice: true },
    }),
  ]);
  return {
    categories,
    technologies,
    platforms,
    minPrice: priceRange._min.basePrice ?? 0,
    maxPrice: priceRange._max.basePrice ?? 0,
  };
}

/** Ürün detayında gösterilen benzer ürünler. */
export function getRelatedProducts(productId: string, categoryId: string, type: string) {
  return prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: productId },
      OR: [{ categoryId }, { type }],
    },
    select: productCardSelect,
    orderBy: { salesCount: "desc" },
    take: 4,
  });
}

/** JSON olarak saklanan dizi alanlarını güvenli biçimde çözer. */
export function parseJsonArray<T = string>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(value: string | null | undefined): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}
