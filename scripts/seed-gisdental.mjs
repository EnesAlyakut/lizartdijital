import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "gis-dental-agiz-dis-sagligi-web-sitesi",
    title: "GİS Dental — Ağız ve Diş Sağlığı Polikliniği Web Sitesi",
    client: "GİS Dental Polikliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://gisdental.com/",
    summary:
      "İstanbul Ataşehir'de faaliyet gösteren GİS Dental Ağız ve Diş Sağlığı Polikliniği için modern, randevu odaklı ve mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "İmplant, estetik gülüş tasarımı, pedodonti, ortodonti ve diş eti tedavileri gibi çok yönlü hizmetlerin hastalara güven verici ve estetik bir dille sunulması, tek tıkla online randevu ve WhatsApp iletişim kanallarına hızlıca ulaşılabilmesi gerekiyordu.",
    solution:
      "Koyu lacivert ve medikal fuşya-pembe vurgularla estetik ve güven veren bir görsel kimlik kurgulandı. Tedavilerimiz vitrini (Gülüş Tasarımı, İmplant, Pedodonti, Diş Eti Hastalıkları, Dolgu, Kanal Tedavisi), kurumsal hakkımızda bölümü, hasta randevu formu ve tek tıkla arama/WhatsApp iletişim hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Tedavi & Hizmet Kataloğu Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Online Randevu & WhatsApp Entegrasyonu",
      "SEO & Medikal İçerik Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern klinik arayüzü",
      "Gülüş tasarımı, implant ve cerrahi tedavi sayfaları",
      "Kurumsal poliklinik ve uzman hekim tanıtımı",
      "Hızlı online randevu formu ve WhatsApp hasta danışma hattı",
      "Yüksek hızlı açılış ve medikal arama motoru optimizasyonu",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/gisdental-masaustu.png",
    mobileImage: "/gorseller/referanslar/gisdental-mobil.png",
    gallery: [
      "/gorseller/referanslar/gisdental-masaustu.png",
      "/gorseller/referanslar/gisdental-mobil.png",
      "/gorseller/referanslar/gisdental-tedaviler-masaustu.png",
      "/gorseller/referanslar/gisdental-hakkimizda-masaustu.png",
      "/gorseller/referanslar/gisdental-tedaviler-mobil.png",
    ],
  };

  const data = {
    title: ref.title,
    client: ref.client,
    sector: ref.sector,
    category: ref.category,
    summary: ref.summary,
    problem: ref.problem,
    solution: ref.solution,
    services: JSON.stringify(ref.services),
    technologies: JSON.stringify(ref.technologies),
    deliverables: JSON.stringify(ref.deliverables),
    results: JSON.stringify([]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: null,
    isFeatured: ref.isFeatured,
    completedAt: new Date(),
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted project:", project.slug, project.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
