import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SERVICES } from "@/lib/data/services";
import { FOOTER_LEGAL, PRODUCT_TYPES, SITE } from "@/lib/constants";

/** XML sitemap — ürün, blog, portföy, hizmet ve statik sayfaları kapsar. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  const [products, posts, projects, pages] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, demoUrl: true },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.portfolioProject.findMany({ select: { slug: true, completedAt: true } }),
    prisma.page.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/magaza`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/demo-merkezi`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/hizmetler`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projeler`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/hakkimizda`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/iletisim`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sss`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/destek`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sihirbaz`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/teklif`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...staticRoutes,
    ...PRODUCT_TYPES.map((t) => ({
      url: `${base}${t.href}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...SERVICES.map((s) => ({
      url: `${base}/hizmetler/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...products
      .filter((p) => p.demoUrl)
      .map((p) => ({
        url: `${base}/demo-merkezi/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((p) => ({
      url: `${base}/projeler/${p.slug}`,
      lastModified: p.completedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...pages
      .filter((p) => FOOTER_LEGAL.some((l) => l.href === `/kurumsal/${p.slug}`))
      .map((p) => ({
        url: `${base}/kurumsal/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "yearly" as const,
        priority: 0.3,
      })),
  ];
}
