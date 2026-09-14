import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Sistem Ayarları", robots: { index: false, follow: false } };

export default function AdminSystemPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Sistem"
      title="Güvenlik, oturum, e-posta ve entegrasyon ayarları."
      description="Rate limiting, güvenli oturum, e-posta sağlayıcıları, ödeme sağlayıcıları ve bakım modu gibi teknik ayarlar için merkezi ekran."
      features={["Güvenli session ve HTTPOnly cookie altyapısı", "Giriş denemesi hız sınırlama", "E-posta/ödeme provider ayarları", "Hata ve bakım modu yönetimi"]}
      primaryHref="/yonetim/kayitlar"
      primaryLabel="Logları incele"
    />
  );
}
