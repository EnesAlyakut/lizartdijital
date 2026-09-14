import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/ServiceControls";

export const metadata: Metadata = {
  title: "Yeni Hizmet Oluştur | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminNewServicePage() {
  return (
    <div className="space-y-6">
      <ServiceForm redirectTo="/admin/hizmetler" />
    </div>
  );
}
