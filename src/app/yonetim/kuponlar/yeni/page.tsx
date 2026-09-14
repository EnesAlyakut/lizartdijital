import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/CouponControls";

export const metadata: Metadata = {
  title: "Yeni Kupon Oluştur | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminNewCouponPage() {
  return (
    <div className="space-y-6">
      {/* Üst Geri Dön Navigasyonu */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/kuponlar"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#1f7a68] hover:text-[#1f7a68] hover:bg-[#1f7a68]/5"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
          Kupon Listesine Dön
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/admin/kuponlar" className="hover:text-slate-900 transition">
            Kupon Yönetimi
          </Link>
          <span>/</span>
          <span className="font-black text-[#1f7a68]">Yeni Kupon</span>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Yeni İndirim Kuponu Oluştur</h2>
        <p className="mt-1 text-sm font-bold text-slate-600">
          Müşterilerinizin ödeme aşamasında kullanabileceği yüzde veya sabit tutarlı indirim kuponları tanımlayın.
        </p>
        <CouponForm redirectTo="/admin/kuponlar" />
      </div>
    </div>
  );
}
