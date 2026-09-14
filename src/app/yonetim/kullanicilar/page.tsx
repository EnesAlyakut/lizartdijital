import type { Metadata } from "next";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { RoleControl, UserActiveToggle } from "@/components/admin/UserControls";
import { AdminTable } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Kullanıcı Yönetimi | Lizart Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: { key: "asc" } }, { createdAt: "desc" }],
      include: { role: true },
      take: 200,
    }),
    prisma.role.findMany({ orderBy: { key: "asc" } }),
  ]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminStaffCount = users.filter((u) => u.role.key !== "customer").length;

  return (
    <div className="space-y-6">
      {/* ─── Hero & İstatistik Kartları ─── */}
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-[#1f7a68]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#1f7a68]">
            Erişim & Yetkilendirme
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Kullanıcılar & Roller
          </h1>
          <p className="mt-2.5 max-w-xl text-sm font-medium leading-relaxed text-slate-600">
            Ekip üyelerinin ve müşterilerin sistem yetkilerini düzenleyin. Rol değişiklikleri anında yürürlüğe girer.
          </p>
        </div>

        {/* Uygun Renkli İstatistik Kartları */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 lg:w-[28rem]">
          {/* Toplam Kullanıcı - Mavi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-xs transition-all hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">Toplam</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-xs">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{totalUsers}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Kayıtlı Hesap</p>
            </div>
          </div>

          {/* Aktif Hesaplar - Zümrüt Yeşil */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/60 to-white p-4 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Aktif</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#1f7a68] to-teal-400 text-white shadow-xs">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{activeUsers}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Giriş Yapabilir</p>
            </div>
          </div>

          {/* Yönetici & Personel - Mor / İndigo */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/60 to-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">Yönetim</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">{adminStaffCount}</div>
              <p className="mt-0.5 text-[11px] font-bold text-slate-500">Ekip Üyesi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Kullanıcılar Tablosu ─── */}
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-950">Kayıtlı Kullanıcılar</h2>
            <p className="mt-0.5 text-sm font-semibold text-slate-600">Sistemdeki tüm personel ve müşteri hesapları</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3.5 py-1 text-xs font-black text-slate-800">
            {users.length} Kullanıcı
          </span>
        </div>

        <AdminTable headers={["Kullanıcı", "Yetki Rolü", "Durum", "Kayıt Tarihi", "İşlemler"]}>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80">
              <td className="px-5 py-4">
                <p className="text-base font-black text-slate-950">{u.fullName}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-600">{u.email}</p>
              </td>
              <td className="px-5 py-4">
                <RoleControl
                  userId={u.id}
                  roleKey={u.role.key}
                  roles={roles.map((r) => ({ value: r.key, label: r.name }))}
                />
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    u.isActive ? "bg-emerald-100 text-emerald-900" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${u.isActive ? "bg-emerald-600" : "bg-slate-400"}`} />
                  {u.isActive ? "Aktif" : "Pasif"}
                </span>
              </td>
              <td className="px-5 py-4 text-sm font-bold text-slate-700">{formatDate(u.createdAt)}</td>
              <td className="px-5 py-4">
                <UserActiveToggle userId={u.id} isActive={u.isActive} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>

      {/* ─── Rol İzinleri Matrisi ─── */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_-40px_rgb(15_23_42/.4)]">
        <h2 className="text-xl font-black text-slate-950">Tanımlı Sistem Rolleri & İzinleri</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">Her rolün erişebildiği yetki alanları ve teknik izin dizeleri</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-base font-black text-slate-950">{r.name}</p>
                <span className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                  {r.key}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs font-semibold text-slate-600 break-all">{r.permissions}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
