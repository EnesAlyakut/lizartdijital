import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { FAQ_CATEGORIES } from "@/lib/constants";
import { PageAndFaqManager } from "@/components/admin/PageAndFaqControls";

export const metadata: Metadata = {
  title: "Sayfalar ve SSS Yönetimi | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const [pages, faqs] = await Promise.all([
    prisma.page.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        body: true,
        group: true,
        metaTitle: true,
        metaDescription: true,
        updatedAt: true,
      },
    }),
    prisma.faq.findMany({
      where: { productId: null },
      orderBy: [{ sortOrder: "asc" }, { question: "asc" }],
      select: {
        id: true,
        category: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
    }),
  ]);

  return (
    <PageAndFaqManager
      pages={pages}
      faqs={faqs}
      faqCategories={FAQ_CATEGORIES}
    />
  );
}
