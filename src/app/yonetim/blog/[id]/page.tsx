import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { BlogCreateForm } from "@/components/admin/BlogControls";

export const metadata: Metadata = {
  title: "Blog Yazısını Düzenle | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
    }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Üst Navigasyon & Geri Dön Linki */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          Blog Listesine Dön
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/admin/blog" className="hover:text-slate-900 transition">
            Blog Yönetimi
          </Link>
          <span>/</span>
          <span className="font-black text-[#1f7a68]">Yazıyı Düzenle</span>
        </div>
      </div>

      {/* Blog Düzenleme Stüdyo Formu */}
      <BlogCreateForm
        categories={categories}
        post={post}
        redirectTo="/admin/blog"
      />
    </div>
  );
}
