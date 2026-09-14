import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "kosuyolu-rezonans-merkezi-web-sitesi",
    title: "Koşuyolu Rezonans — Bütüncül Sağlık & Biorezonans Terapisi",
    client: "Koşuyolu Rezonans Merkezi",
    sector: "Sağlık & Bütüncül Terapi",
    category: "saglik",
    liveUrl: "https://kosuyolurezonans.com/",
    summary:
      "İstanbul Koşuyolu'nda 7 yılda 10.000+ danışana hizmet veren Koşuyolu Rezonans için modern, randevu odaklı, interaktif bağımlılık testi modüllü ve mobil öncelikli sağlık merkezi web sitesi.",
    problem:
      "Alman teknolojisi biorezonans terapilerinin (sigara bırakma, zayıflama/kilo verme, ruhsal dengeleme), 7 yıllık kurumsal uzmanlığın ve 10.000+ mutlu danışan güveninin hastalara net, şeffaf ve prestijli bir dijital deneyimle sunulması; interaktif testler ve tek tıkla online randevu/WhatsApp kanallarına erişimin sağlanması hedeflendi.",
    solution:
      "Canlı kırmızı ve sıcak medikal tonlarla enerji veren, yüksek prestijli bir sağlık arayüzü inşa edildi. İnteraktif Sigara Bağımlılık Testi, online randevu motoru, uzman hekim ve psikolog kadrosu tanıtımı, 10.000+ danışan başarı istatistikleri ve WhatsApp hızlı destek modülleri masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Sağlık & Terapi Web Sitesi Tasarımı",
      "İnteraktif Bağımlılık Testi Altyapısı",
      "Online Randevu & WhatsApp Entegrasyonu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "SEO & Medikal İçerik Mimarisi",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sağlık merkezi arayüzü",
      "İnteraktif Sigara Bağımlılık Testi modülü",
      "Zayıflama, sigara bırakma ve ruhsal dengeleme hizmet sayfaları",
      "7 Yılda 10.000+ mutlu danışan itibar bölümü",
      "Tek tıkla randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/kosuyolurezonans-masaustu.png",
    mobileImage: "/gorseller/referanslar/kosuyolurezonans-mobil.png",
    gallery: [
      "/gorseller/referanslar/kosuyolurezonans-masaustu.png",
      "/gorseller/referanslar/kosuyolurezonans-mobil.png",
      "/gorseller/referanslar/kosuyolurezonans-tedaviler-masaustu.png",
      "/gorseller/referanslar/kosuyolurezonans-tedaviler-mobil.png",
      "/gorseller/referanslar/kosuyolurezonans-slide2-mobil.png",
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
    results: JSON.stringify([{ label: "Mutlu Danışan", value: "10.000+" }, { label: "Hizmet Yılı", value: "7 Yıl" }]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "Koşuyolu Rezonans Yönetimi",
      role: "Kurucu & Başhekim",
      quote: "Lizart Dijital ile çalışmak 10.000+ danışanımıza dijitalde en kaliteli rezonans deneyimini sunmamızı sağladı. Randevu ve test akışlarımız harika çalışıyor.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 10000), // Fresh date to ensure top order
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted Koşuyolu Rezonans project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
