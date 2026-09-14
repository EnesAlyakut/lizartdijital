import type { Metadata } from "next";
import { Users, Building2, CreditCard } from "lucide-react";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/ui";
import { EmptyState } from "@/components/ui";
import { formatDate, formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Müşteriler", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const customers = await prisma.user.findMany({
    where: {
      role: { key: "customer" },
      ...(q ? { OR: [{ fullName: { contains: q } }, { email: { contains: q } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { orders: true, licenseKeys: true, tickets: true } },
      orders: { where: { status: { notIn: ["bekliyor", "iptal"] } }, select: { total: true } },
    },
  });

  const totalCustomers = customers.length;
  const corporateCount = customers.filter((c) => c.customerType === "kurumsal").length;
  const totalSpent = customers.reduce((acc, c) => acc + c.orders.reduce((sum, o) => sum + o.total, 0), 0);

  return (
    <div className="space-y-6">
      {/* ─── Hero & İstatistik Kartları ─── */}
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
            Müşteri Yönetimi
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Müşteriler & Hesaplar
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-medium leading-relaxed text-slate-600">
            Kayıtlı müşterileri, sipariş geçmişlerini ve toplam harcama tutarlarını tek ekrandan inceleyin.
          </p>

          <form className="mt-5 flex flex-wrap gap-2" role="search">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Ad veya e-posta ile ara..."
              aria-label="Müşteri ara"
              className="h-10 w-72 rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#1f7a68] focus:bg-white"
            />
            <button type="submit" className="h-10 rounded-xl bg-[#1f7a68] px-4 text-xs font-bold text-white hover:bg-[#176956] transition">
              Filtrele
            </button>
          </form>
        </div>

        {/* Uygun Renkli İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
          {/* Toplam Müşteri - Mavi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalCustomers}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kayıtlı Hesap</p>
            </div>
          </div>

          {/* Kurumsal - Mor / İndigo */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 to-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">Kurumsal</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-xs">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{corporateCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Şirket / Ajans</p>
            </div>
          </div>

          {/* Toplam Harcama - Zümrüt / Teal */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Harcama</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">{formatPrice(totalSpent)}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Toplam Ciro</p>
            </div>
          </div>
        </div>
      </section>

      {customers.length === 0 ? (
        <EmptyState title="Müşteri bulunamadı" description="Arama kriterlerinize uyan müşteri yok." />
      ) : (
        <AdminTable headers={["Müşteri", "Tip", "Sipariş", "Toplam harcama", "Lisans", "Destek", "Kayıt"]}>
          {customers.map((c) => {
            const total = c.orders.reduce((sum, o) => sum + o.total, 0);
            return (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <p className="font-bold text-[#111]">{c.fullName}</p>
                  <p className="text-sm text-[#777]">{c.email}</p>
                </td>
                <td className="px-4 py-3 text-[#555]">
                  {c.customerType === "kurumsal" ? c.companyName || "Kurumsal" : "Bireysel"}
                </td>
                <td className="px-4 py-3 text-[#555]">{c._count.orders}</td>
                <td className="px-4 py-3 font-bold text-[#111]">{formatPrice(total)}</td>
                <td className="px-4 py-3 text-[#555]">{c._count.licenseKeys}</td>
                <td className="px-4 py-3 text-[#555]">{c._count.tickets}</td>
                <td className="px-4 py-3 text-[#555]">{formatDate(c.createdAt)}</td>
              </tr>
            );
          })}
        </AdminTable>
      )}
    </div>
  );
}
