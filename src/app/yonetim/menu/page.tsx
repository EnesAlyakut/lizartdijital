import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Menü Yönetimi", robots: { index: false, follow: false } };

export default function AdminMenuPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Menü yönetimi"
      title="Header, footer ve alt menüleri görsel olarak düzenleyin."
      description="Ana menü, alt menüler ve footer bağlantıları için sürükle bırak sıralama ve yayın kontrolü bu modül altında genişletilebilir."
      features={["Header ve footer menü grupları", "Alt menü oluşturma", "Sıralama ve görünürlük kontrolleri", "Mobil menü önizleme"]}
      primaryHref="/admin"
      primaryLabel="Panele dön"
    />
  );
}
