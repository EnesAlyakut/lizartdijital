import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "zenit-dental-agiz-ve-dis-sagligi-web-sitesi",
    title: "Zenit Dental — Ağız ve Diş Sağlığı Poliklinikleri Web Sitesi",
    client: "Zenit Dental Ağız ve Diş Sağlığı Poliklinikleri",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://zenitdent.com/",
    summary:
      "Kocaeli Gebze merkezli, uluslararası sağlık turizmi ve ileri diş hekimliği standartlarında hizmet sunan Zenit Dental Poliklinikleri için; cerrahi tedaviler, dijital estetik gülüş tasarımı, çoklu şube ve online randevu odaklı kurumsal sağlık portalı.",
    problem:
      "Hastaların Gebze ve şubelerindeki modern cerrahi, implantoloji, ortodonti ve çene eklemi tedavilerini detaylıca inceleyebileceği; sağlık turizmi hastalarına ve yerel ziyaretçilere güven veren, tek tıkla şube bazlı randevu ve mesaj iletimi sağlayan kurumsal bir web deneyimi kurgulanması gerekiyordu.",
    solution:
      "Sıcak pudra-bej ve modern rose-gold kurumsal renk paletiyle premium bir sağlık arayüzü tasarlandı. 6 ana cerrahi ve estetik tedavi başlığı (Ağız ve Çene Cerrahisi, Çene Eklemi, Diş Beyazlatma, Ortodonti, Diş Eti Hastalıkları, Diş Protezleri), hekim kadrosu ve sağlık turizmi modülleri, interaktif şube seçimi ve online randevu formu hem masaüstü hem de mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi & Portal Tasarımı",
      "Tedavi & Cerrahi Kataloğu Mimarisi",
      "Şube Seçimli Online Randevu & İletişim Sistemi",
      "Uluslararası Sağlık Turizmi Bilgi Altyapısı",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Medikal SEO & Yerel Klinik Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern diş polikliniği web portalı",
      "Cerrahi, ortodonti ve estetik diş tedavileri detay sayfaları",
      "Sağlık turizmi, hekim kadrosu ve klinik tedavi vitrini",
      "Şube seçimli interaktif randevu alma ve WhatsApp iletişim entegrasyonu",
      "Yüksek hızlı yükleme ve medikal SEO odaklı içerik mimarisi",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/zenitdent-hero-pc.png",
    mobileImage: "/gorseller/referanslar/zenitdent-hero-mobil.png",
    gallery: [
      "/gorseller/referanslar/zenitdent-hero-pc.png",
      "/gorseller/referanslar/zenitdent-tedaviler-pc.png",
      "/gorseller/referanslar/zenitdent-hero-mobil.png",
      "/gorseller/referanslar/zenitdent-hakkimizda-mobil.png",
      "/gorseller/referanslar/zenitdent-randevu-mobil.png",
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
    results: JSON.stringify([
      { label: "Tedavi Kataloğu", value: "İnteraktif & Kapsamlı" },
      { label: "Şube Randevu", value: "Hızlı & Online" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "Zenit Dental Poliklinik Yönetimi",
      role: "Klinik Direktörü",
      quote: "Kliniğimizin teknolojik tedavi olanaklarını, uzman hekimlerimizi ve şubelerimizi hastalarımıza en şık ve anlaşılır şekilde aktaran, online randevu dönüşümlerimizi katlayan harika bir web sitesi oldu.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 40000), // En üstte yer alması için en güncel tarih
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted Zenit Dental project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
