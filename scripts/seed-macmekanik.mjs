import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "mac-mekanik-ve-insaat-web-sitesi",
    title: "MAC Mekanik & İnşaat — Mekanik Tesisat & Modern Konut Projeleri Web Sitesi",
    client: "MAC Mekanik & İnşaat A.Ş.",
    sector: "Mekanik Mühendislik & İnşaat",
    category: "web",
    liveUrl: "https://macmekanik.com/",
    summary:
      "Endüstriyel mekanik tesisat mühendisliği ve modern konut inşaat projelerinde faaliyet gösteren MAC Mekanik & İnşaat için modern, çift branş odaklı (Mekanik / İnşaat) ve mobil öncelikli kurumsal web sitesi.",
    problem:
      "Şirketin hem endüstriyel mekanik tesisat (havalandırma, ısıtma-soğutma, yangın tesisatı, hidrofor sistemleri) mühendisliğini hem de Kartal ve Üsküdar konut projelerini tek bir güçlü, prestijli ve kurumsal dijital kimlik altında müşterilere aktarması gerekiyordu.",
    solution:
      "Mekanik ve inşaat faaliyet kollarını tek tıkla ayrıştıran modern ve çift dinamikli kurumsal arayüz inşa edildi. Endüstriyel tesisat hizmet portföyü, konut şantiye ve mimari proje galerileri, mobil öncelikli hızlı gezinti ve doğrudan WhatsApp/teklif iletişim hatları optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Mekanik & İnşaat Çift Sektör Mimarisi",
      "Proje & Şantiye Portföy Galerisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Endüstriyel Hizmet Kataloğu",
      "SEO ve Performans Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Mekanik tesisat ve inşaat projelerini tanıtan çift branşlı kurumsal web sitesi",
      "Kartal Soğanlık ve Üsküdar Zeynep Kamil konut projeleri galeri sayfaları",
      "Endüstriyel mekanik tesisat, kazan dairesi ve havalandırma hizmet modülleri",
      "Mobil uyumlu kurumsal hakkımızda, referanslar ve iletişim modülü",
      "Tek tıkla WhatsApp ve doğrudan kurumsal teklif formu",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/macmekanik-hero-pc.png",
    mobileImage: "/gorseller/referanslar/macmekanik-hizmet-mobil.png",
    gallery: [
      "/gorseller/referanslar/macmekanik-hero-pc.png",
      "/gorseller/referanslar/macmekanik-villa-pc.png",
      "/gorseller/referanslar/macmekanik-hizmet-mobil.png",
      "/gorseller/referanslar/macmekanik-proje-pc.png",
      "/gorseller/referanslar/macmekanik-proje-mobil.png",
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
      { label: "Faaliyet Kolu", value: "Mekanik & İnşaat" },
      { label: "Mobil Uyum", value: "%100 Responsive" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "MAC Mekanik Yönetimi",
      role: "Genel Koordinatör",
      quote: "Mekanik tesisat mühendisliğimizi ve konut projelerimizi kurumsal bir zarafetle sergileyen, prestijimizi artıran ve müşterilerimize güven veren bir web sitesine kavuştuk.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 10000), // En üstte yer alsın
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted MAC Mekanik project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
