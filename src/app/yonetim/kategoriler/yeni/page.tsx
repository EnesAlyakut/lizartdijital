import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { BlogCategoryCreateForm } from "@/components/admin/CategoryControls";

export const metadata: Metadata = {
  title: "Yeni Blog Kategorisi Oluştur | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminNewCategoryPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <div className="space-y-6">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/kategoriler"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          Kategorilere Dön
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/admin/kategoriler" className="hover:text-slate-900 transition">
            Kategori Yönetimi
          </Link>
          <span>/</span>
          <span className="font-black text-[#1f7a68]">Yeni Kategori</span>
        </div>
      </div>

      <BlogCategoryCreateForm
        existingCategories={categories}
        redirectTo="/admin/kategoriler"
      />
    </div>
  );
}
