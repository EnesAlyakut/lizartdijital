import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "kuruoglu-kerestecilik-ve-dis-ticaret-web-sitesi",
    title: "Kuruoğlu Kerestecilik — Orman Ürünleri & Dış Ticaret Web Sitesi",
    client: "Kuruoğlu Kerestecilik ve Dış Tic. A.Ş.",
    sector: "Orman Ürünleri & Dış Ticaret",
    category: "web",
    liveUrl: "https://www.kuruoglukerestecilik.com/",
    summary:
      "Türkiye'nin köklü ahşap ve kereste ihracatçısı Kuruoğlu Kerestecilik A.Ş. için çok dilli (TR/EN), geniş ürün kataloglu ve mobil öncelikli kurumsal sanayi web sitesi.",
    problem:
      "Kayın, meşe, çam kereste, masif panel, kaplama, kapı sereni, lambri ve kontrplak gibi 60'ı aşkın sanayi ürün grubunun hem yurt içi hem yurt dışı müşterilere kurumsal güvenle sunulması; fabrika üretim tesisleri ve kereste stok galerisinin sergilenmesi hedeflendi.",
    solution:
      "Doğal ahşap ve sıcak kahve-antrasit tonlarında kurumsal bir sanayi görsel dili kurgulandı. Kategorize edilmiş 67+ ürünlük detaylı ahşap kataloğu, fabrika ve tomruk üretim galerisi, sektörel kereste rehberi blogu ve doğrudan WhatsApp/teklif iletişim hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Geniş Ürün Katalog Mimarisi",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Çok Dilli (TR/EN) Altyapı",
      "Fabrika & Stok Galeri Modülü",
      "SEO Altyapısı",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu sanayi & dış ticaret web sitesi",
      "60+ ürünlük ahşap ve kereste katalog filtreleme modülü",
      "Fabrika ve üretim parkuru fotoğraf galerisi",
      "Sektörel ahşap ve kereste rehberi blog sayfaları",
      "Tek tıkla WhatsApp ve teklif talep formu",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/kuruoglukerestecilik-masaustu.png",
    mobileImage: "/gorseller/referanslar/kuruoglukerestecilik-mobil.png",
    gallery: [
      "/gorseller/referanslar/kuruoglukerestecilik-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-mobil.png",
      "/gorseller/referanslar/kuruoglukerestecilik-urunler-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-galeri-masaustu.png",
      "/gorseller/referanslar/kuruoglukerestecilik-blog-mobil.png",
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
    results: JSON.stringify([{ label: "Katalog Ürün", value: "67+ Çeşit" }, { label: "İhracat", value: "Çok Dilli" }]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "Kuruoğlu Kerestecilik Yönetimi",
      role: "Dış Ticaret Direktörü",
      quote: "Ahşap ve kereste ürünlerimizi hem yurt içi hem yurt dışı alıcılara gururla sunduğumuz çok dilli ve modern bir dijital vitrine kavuştuk.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 5000), // Positioned right with Koşuyolu at top
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted Kuruoğlu Kerestecilik project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
