import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Yedekleme", robots: { index: false, follow: false } };

export default function AdminBackupPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Yedekleme"
      title="Veritabanı ve medya varlıkları için kontrollü yedekleme merkezi."
      description="Manuel yedek oluşturma, yedek geçmişi, geri yükleme uyarıları ve dış depolama entegrasyonu için yönetim ekranı."
      features={["Manuel veritabanı yedeği", "Yedek geçmişi", "Geri yükleme güvenlik onayı", "Medya arşivi entegrasyonu"]}
      primaryHref="/yonetim"
      primaryLabel="Dashboard'a dön"
    />
  );
}
