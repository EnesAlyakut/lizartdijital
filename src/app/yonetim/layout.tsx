import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Yönetim paneli düzeni.
 * Erişim kontrolü burada, sunucu tarafında yapılır; yalnızca personel rolleri girebilir.
 * Ayrıca her sayfa kendi işlemi için ayrıca yetki kontrolü yapar.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?devam=/admin");
  if (!isStaff(user)) redirect("/hesabim");

  return <AdminShell user={user}>{children}</AdminShell>;
}
