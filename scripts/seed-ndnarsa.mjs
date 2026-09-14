import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "ndn-arsa-yatirim-web-sitesi",
    title: "NDN Arsa — Arsa & Gayrimenkul Yatırım A.Ş. Web Sitesi",
    client: "NDN Arsa Yatırım A.Ş.",
    sector: "Gayrimenkul & Arsa Yatırımı",
    category: "web",
    liveUrl: "https://ndnarsa.com/",
    summary:
      "Türkiye genelinde imarlı, tapulu ve yasal güvenceli arsa portföyleri sunan NDN Arsa Yatırım A.Ş. için interaktif arsa filtreleme modüllü, güven veren ve mobil öncelikli kurumsal yatırım web sitesi.",
    problem:
      "Yatırımcılara kurumsal güven veren modern bir dille; onaylı imarlı arsa kategorilerinin, tapu durumlarının ve arsa türlerinin kolayca filtrelenmesi, arsa yatırım rehberi makalelerinin ve doğrudan WhatsApp arsa danışmanlık hattının hızlıca sunulması hedeflendi.",
    solution:
      "Doğal yeşil ve ferah gökyüzü tonlarında kurumsal bir gayrimenkul görsel dili inşa edildi. Ana sayfa karşılama ekranında anlık arsa arama/filtreleme motoru (Kategoriler, Tapu Durumu, Arsa Türü), kurumsal şeffaflık ve güvence ilkeleri, sektörel blog rehberi ve tek tıkla WhatsApp iletişim hatları masaüstü ve mobil cihazlar için kusursuz optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "İnteraktif Arsa Filtreleme Modülü",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Gayrimenkul Blog & Yatırım Rehberi",
      "WhatsApp & Hızlı İletişim Entegrasyonu",
      "SEO ve Performans Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern arsa yatırım web sitesi",
      "Kategori, tapu durumu ve arsa türüne göre anlık filtreleme motoru",
      "Yasal güvenceli ve tapulu arsa portföyü kurumsal sayfaları",
      "Sektörel arsa yatırımı rehberi blog modülü",
      "Tek tıkla WhatsApp ve doğrudan iletişim kanalları",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/ndnarsa-hero-pc.png",
    mobileImage: "/gorseller/referanslar/ndnarsa-hero-mobil.png",
    gallery: [
      "/gorseller/referanslar/ndnarsa-hero-pc.png",
      "/gorseller/referanslar/ndnarsa-hakkimizda-pc.png",
      "/gorseller/referanslar/ndnarsa-hero-mobil.png",
      "/gorseller/referanslar/ndnarsa-hakkimizda-mobil.png",
      "/gorseller/referanslar/ndnarsa-blog-pc.png",
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
      { label: "Portföy Modülü", value: "İnteraktif Filtre" },
      { label: "Mobil Uyum", value: "%100 Responsive" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "NDN Arsa Yönetimi",
      role: "Yatırım Koordinatörü",
      quote: "Yatırımcılarımızın güvenle arsa arayabileceği, tapulu ve imarlı projelerimizi kurumsal şeffaflıkla sunan harika bir dijital deneyim oldu.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 15000), // En üstte yer alsın
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted NDN Arsa project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
