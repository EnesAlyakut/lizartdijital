import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AddressList } from "@/components/account/AddressList";

export const metadata: Metadata = { title: "Adreslerim", robots: { index: false, follow: false } };

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { title: "asc" }],
  });

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Adreslerim</h2>
      <p className="mt-2 text-sm text-ink-500">
        Fatura adreslerinizi kaydedip ödeme adımında hızlıca kullanabilirsiniz.
      </p>
      <AddressList addresses={addresses} />
    </div>
  );
}
