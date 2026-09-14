import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Roller ve Yetkiler", robots: { index: false, follow: false } };

export default function AdminRolesPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="RBAC"
      title="Rol bazlı erişim kontrolünü detaylı şekilde yönetin."
      description="Mevcut role/permission altyapısı hazır. Bu modül Super Admin, Admin, Editor, SEO Editor ve Content Manager yetkilerini görsel olarak yönetmek için ayrıldı."
      features={["Rol bazlı menü görünürlüğü", "CRUD izin matrisleri", "Kritik işlem yetki kontrolü", "Aktivite log entegrasyonu"]}
      primaryHref="/yonetim/kullanicilar"
      primaryLabel="Kullanıcılara git"
    />
  );
}
