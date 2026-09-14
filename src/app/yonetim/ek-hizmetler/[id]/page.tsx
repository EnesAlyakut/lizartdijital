import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AddOnCreateForm } from "@/components/admin/AddOnControls";
import { getAddOnMedia } from "@/lib/data/addon-media";

export const metadata: Metadata = {
  title: "Ek Hizmeti Düzenle | Lizart Yönetim",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminEditAddOnPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const addOn = await prisma.addOnService.findUnique({
    where: { id },
  });

  if (!addOn) {
    notFound();
  }

  const media = getAddOnMedia(addOn.id) || getAddOnMedia(addOn.slug);

  const initialData = {
    ...addOn,
    image: media.image,
    gallery: media.gallery,
  };

  return (
    <div className="space-y-6">
      <AddOnCreateForm initialData={initialData} redirectTo="/admin/ek-hizmetler" />
    </div>
  );
}
