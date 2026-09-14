import type { Metadata } from "next";
import { AddOnCreateForm } from "@/components/admin/AddOnControls";

export const metadata: Metadata = {
  title: "Yeni Ek Hizmet Oluştur | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminNewAddOnPage() {
  return (
    <div className="space-y-6">
      <AddOnCreateForm redirectTo="/admin/ek-hizmetler" />
    </div>
  );
}
