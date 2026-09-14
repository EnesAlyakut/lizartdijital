import type { Metadata } from "next";
import { AdminModulePlaceholder } from "@/components/admin/AdminModulePlaceholder";

export const metadata: Metadata = { title: "Blog Etiketleri", robots: { index: false, follow: false } };

export default function AdminBlogTagsPage() {
  return (
    <AdminModulePlaceholder
      eyebrow="Blog etiketleri"
      title="İçerikleri etiketlerle daha kolay sınıflandırın."
      description="Blog etiketleri, SEO anahtar kelimeleri ve içerik kümeleri için ayrılmış yönetim ekranı."
      features={["Etiket oluşturma ve düzenleme", "İçerik kümeleri", "SEO anahtar kelime ilişkileri", "Toplu etiket yönetimi"]}
      primaryHref="/yonetim/blog"
      primaryLabel="Blogları yönet"
    />
  );
}
