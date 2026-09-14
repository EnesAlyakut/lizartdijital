import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService } from "@/lib/data/services";
import { ServiceForm } from "@/components/admin/ServiceControls";

export const metadata: Metadata = {
  title: "Hizmeti Düzenle | Lizart Yönetim",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ServiceForm service={service} isEditing redirectTo="/admin/hizmetler" />
    </div>
  );
}
