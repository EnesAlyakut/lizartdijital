import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { PortfolioExperience, type ProjectItem } from "@/components/portfolio/PortfolioExperience";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Referanslarımız — Tasarımdan Gerçeğe Dijital Eserler",
  description:
    "Lizart Dijital imzasını taşıyan kurumsal web tasarım, e-ticaret ve özel yazılım projeleri. Markalara özel tasarladığımız yüksek performanslı dijital deneyimleri keşfedin.",
  alternates: { canonical: `${SITE.url}/projeler` },
  openGraph: {
    title: "Referanslarımız | Lizart Dijital",
    description: "Tasarımla fark yaratan, kodla güçlenen kurumsal dijital projelerimiz.",
    url: `${SITE.url}/projeler`,
  },
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ alan?: string }>;
}) {
  const { alan } = await searchParams;

  const [projectsRaw, categoriesRaw] = await Promise.all([
    prisma.portfolioProject.findMany({
      orderBy: [{ isFeatured: "desc" }, { completedAt: "desc" }],
      select: {
        id: true,
        slug: true,
        client: true,
        title: true,
        sector: true,
        category: true,
        summary: true,
        coverImage: true,
        mobileImage: true,
        liveUrl: true,
        deliverables: true,
        technologies: true,
        results: true,
        isFeatured: true,
      },
    }),
    prisma.portfolioProject.groupBy({
      by: ["category"],
      _count: true,
    }),
  ]);

  const categories = categoriesRaw.map((c) => ({
    category: c.category,
    count: c._count,
  }));

  const totalCount = categories.reduce((sum, item) => sum + item.count, 0);

  const projects: ProjectItem[] = projectsRaw.map((p) => ({
    ...p,
    deliverables: p.deliverables ? JSON.parse(p.deliverables || "[]") : [],
    technologies: p.technologies ? JSON.parse(p.technologies || "[]") : [],
    results: p.results ? JSON.parse(p.results || "[]") : [],
  }));

  return (
    <div className="bg-canvas">
      <PortfolioExperience
        projects={projects}
        categories={categories}
        totalCount={totalCount}
        initialCategory={alan || "all"}
      />
    </div>
  );
}
