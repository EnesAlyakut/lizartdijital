import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";
import { AccountNav } from "@/components/account/AccountNav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/giris?devam=/hesabim");

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-500">Hoş geldiniz</p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{user.fullName}</h1>
          <p className="mt-0.5 text-sm text-ink-500">{user.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Çıkış yap
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-10">
        <AccountNav isStaff={["admin", "editor", "support"].includes(user.role.key)} />
        <div>{children}</div>
      </div>
    </div>
  );
}
