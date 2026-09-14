import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FAQ_CATEGORIES } from "@/lib/constants";
import { FaqFormStudio } from "@/components/admin/PageAndFaqControls";

export const metadata: Metadata = {
  title: "Yeni SSS Sorusu Ekle | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminNewFaqPage() {
  return (
    <div className="space-y-6">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/sayfalar"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          Sayfalar ve SSS Listesine Dön
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/admin/sayfalar" className="hover:text-slate-900 transition">
            SSS Yönetimi
          </Link>
          <span>/</span>
          <span className="font-black text-[#1f7a68]">Yeni Soru</span>
        </div>
      </div>

      <FaqFormStudio categories={FAQ_CATEGORIES} redirectTo="/admin/sayfalar" />
    </div>
  );
}
