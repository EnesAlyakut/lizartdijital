import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettingsForms } from "@/components/account/AccountSettingsForms";

export const metadata: Metadata = { title: "Hesap ayarları", robots: { index: false, follow: false } };

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-ink-900">Hesap ayarları</h2>
      <p className="mt-2 text-sm text-ink-500">
        Fatura bilgilerinizi ve şifrenizi buradan güncelleyebilirsiniz.
      </p>
      <AccountSettingsForms
        user={{
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          customerType: user.customerType,
          companyName: user.companyName,
        }}
      />
    </div>
  );
}
