import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "itcdent-agiz-ve-dis-sagligi-web-sitesi",
    title: "ItcDent — Ağız ve Diş Sağlığı Kliniği Web Sitesi",
    client: "ItcDent Diş Kliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://itcdent.com/",
    summary:
      "İstanbul Eyüpsultan merkezli ItcDent Ağız ve Diş Sağlığı Kliniği için modern, hekim ve tedavi odaklı, mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "Zirkonyum kaplama, implant tedavisi, estetik gülüş tasarımı, lamine kaplama, diş beyazlatma ve cerrahi tedavilerin hastalara detaylı ve güven verici bir dille sunulması; hekim kadrosunun tanıtılması ve hızlı randevu kanallarının (telefon, WhatsApp) kolayca erişilebilir olması hedeflendi.",
    solution:
      "Klinik hekimlerinin ve modern kliniğin ön planda olduğu, prestijli mavi-lacivert ve beyaz renk paletiyle yüksek güven veren bir sağlık arayüzü inşa edildi. Tedavilerimiz vitrini (Zirkonyum, Gülüş Tasarımı, İmplant, All On 4/6, Lamine, Kanal Tedavisi), sektörel diş sağlığı blog rehberi, randevu modülleri ve doğrudan WhatsApp danışma butonları masaüstü ve mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Tedavi & Hizmet Kataloğu Mimarisi",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Diş Sağlığı Blog & Rehber Altyapısı",
      "Online Randevu & WhatsApp Entegrasyonu",
      "SEO & Medikal İçerik Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern klinik arayüzü",
      "Zirkonyum kaplama ve implant tedavi detay sayfaları",
      "Klinik hekimleri ve kurumsal hakkımızda bölümü",
      "Diş sağlığı blogu ve hasta bilgilendirme makaleleri",
      "Tek tıkla randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/itcdent-masaustu.png",
    mobileImage: "/gorseller/referanslar/itcdent-mobil.png",
    gallery: [
      "/gorseller/referanslar/itcdent-masaustu.png",
      "/gorseller/referanslar/itcdent-mobil.png",
      "/gorseller/referanslar/itcdent-tedaviler-masaustu.png",
      "/gorseller/referanslar/itcdent-blog-mobil.png",
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

  console.log("Successfully upserted ItcDent project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
