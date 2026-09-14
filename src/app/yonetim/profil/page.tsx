import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Profil", robots: { index: false, follow: false } };

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  return (
    <AdminModulePlaceholder
      eyebrow="Profil"
      title={user ? `${user.fullName} profil ayarları` : "Profil ayarları"}
      description="Profil fotoğrafı, ad soyad, e-posta, telefon ve şifre değişikliği gibi kişisel yönetim ayarları için ayrılmış ekran."
      features={["Profil bilgileri", "Şifre değişikliği", "İki aşamalı doğrulama hazırlığı", "Aktif oturum yönetimi"]}
      primaryHref="/yonetim"
      primaryLabel="Dashboard'a dön"
    />
  );
}
