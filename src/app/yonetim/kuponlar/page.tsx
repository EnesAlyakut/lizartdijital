import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Ticket, Sparkles, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { CouponToggle } from "@/components/admin/CouponControls";
import { AdminTable } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Kuponlar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { code: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  return (
    <div className="space-y-6">
      {/* ─── Hero & İstatistik Kartları ─── */}
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
            Kupon Yönetimi
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            İndirim Kuponları & Kampanyalar
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-medium leading-relaxed text-slate-600">
            İndirim kuponları tanımlayın, kullanım limitlerini ayarlayın ve sipariş performanslarını takip edin.
          </p>
          <div className="mt-5">
            <Link
              href="/admin/kuponlar/yeni"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1f7a68] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#176956]"
            >
              <Plus size={16} className="stroke-[3]" />
              Yeni Kupon Oluştur
            </Link>
          </div>
        </div>

        {/* Uygun Renkli İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
          {/* Toplam Kupon - Mor */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-200/90 bg-gradient-to-b from-purple-50/60 to-white p-4 shadow-xs transition-all hover:border-purple-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-700">Toplam</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-xs">
                <Ticket className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalCoupons}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Tanımlı Kupon</p>
            </div>
          </div>

          {/* Aktif Kupon - Zümrüt Yeşil */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Aktif</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{activeCoupons}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kullanılabilir</p>
            </div>
          </div>

          {/* Kullanım - Amber / Turuncu */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/60 to-white p-4 shadow-xs transition-all hover:border-amber-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Kullanım</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalUses}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kullanım Adedi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coupons table */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-[#111]">Mevcut kuponlar ({coupons.length})</h2>
          <Link
            href="/admin/kuponlar/yeni"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f7a68] px-3.5 py-2 text-xs font-black text-white hover:bg-[#176956] transition"
          >
            <Plus size={14} className="stroke-[3]" />
            Yeni Kupon Ekle
          </Link>
        </div>
        {coupons.length === 0 ? (
          <p className="mt-3 text-sm font-medium text-[#777]">Henüz kupon tanımlanmamış.</p>
        ) : (
          <div className="mt-4">
            <AdminTable headers={["Kod", "Tür", "Değer", "Min. sepet", "Kullanım", "Sipariş", "Durum", ""]}>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono font-bold text-[#111]">{c.code}</td>
                  <td className="px-4 py-3 text-[#555]">{c.type === "yuzde" ? "Yüzde" : "Tutar"}</td>
                  <td className="px-4 py-3 font-bold text-[#111]">
                    {c.type === "yuzde" ? `%${c.value}` : formatPrice(c.value)}
                  </td>
                  <td className="px-4 py-3 text-[#555]">
                    {c.minSubtotal > 0 ? formatPrice(c.minSubtotal) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#555]">
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-[#555]">{c._count.orders}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        c.isActive ? "bg-[#f0faf7] text-[#1f7a68]" : "bg-gray-100 text-[#555]"
                      }`}
                    >
                      {c.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <CouponToggle couponId={c.id} isActive={c.isActive} />
                  </td>
                </tr>
              ))}
            </AdminTable>
          </div>
        )}
      </section>
    </div>
  );
}
