import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "akn-akpinar-hafriyat-web-sitesi",
    title: "AKN Akpınar Hafriyat — Kiralık İş Makinesi & Hafriyat Web Sitesi",
    client: "AKN Akpınar Hafriyat & İş Makineleri",
    sector: "Hafriyat & İş Makineleri",
    category: "web",
    liveUrl: "https://www.akpinarhafriyat.com/",
    summary:
      "Arnavutköy ve çevre ilçelerde 25 yıllık tecrübeyle JCB, kato, kepçe, mini ekskavatör ve kiralık iş makineleri çözümleri sunan AKN Akpınar Hafriyat için doğrudan çağrı ve WhatsApp odaklı, mobil öncelikli kurumsal web sitesi.",
    problem:
      "İnşaat ve şantiye yöneticilerinin acil iş makinesi kiralama taleplerinde saatlik, günlük veya haftalık makine parkurunu (JCB, kepçe, kato, mini ekskavatör) rahatça inceleyebileceği, sahada çalışan makineleri gösteren galeriye bakabileceği ve 7/24 tek tıkla arayabileceği hızlı bir arayüz ihtiyacı vardı.",
    solution:
      "Güçlü sarı ve antrasit inşaat/makine renk paletiyle şantiye sahasında dahi tek elle kolayca kullanılabilecek mobil öncelikli arayüz kurgulandı. Büyük yeşil 'Hemen Ara' butonu, 7/24 WhatsApp hattı, makine filosu tanıtımı (Ekskavatör, Beko Loder, Telehandler) ve gerçek şantiye operasyon fotoğrafları galerisi entegre edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "İş Makinesi Filo Kataloğu",
      "Hızlı Çağrı & 'Hemen Ara' Dönüşüm Modülü",
      "Mobil Öncelikli (Responsive) Tasarım",
      "Şantiye Operasyon Galerisi",
      "Yerel SEO ve Google Harita Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern iş makinesi kiralama web sitesi",
      "Tek tıkla telefon araması ve WhatsApp teklif butonları",
      "JCB, kepçe, kato ve mini ekskavatör araç tanıtım kartları",
      "Gerçek şantiye hafriyat operasyonları fotoğraf galerisi",
      "7/24 kesintisiz hizmet ve acil kiralama iletişim paneli",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/akpinarhafriyat-hero-pc.png",
    mobileImage: "/gorseller/referanslar/akpinarhafriyat-hero-mobil.png",
    gallery: [
      "/gorseller/referanslar/akpinarhafriyat-hero-pc.png",
      "/gorseller/referanslar/akpinarhafriyat-araclar-pc.png",
      "/gorseller/referanslar/akpinarhafriyat-hero-mobil.png",
      "/gorseller/referanslar/akpinarhafriyat-galeri-pc.png",
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
      { label: "Kiralama Ağı", value: "7/24 Kesintisiz" },
      { label: "Mobil Uyum", value: "%100 Responsive" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "AKN Akpınar Hafriyat Yönetimi",
      role: "Firma Sahibi",
      quote: "Şantiyelerden ve müteahhitlerden gelen kiralama taleplerimiz web sitemiz sayesinde belirgin şekilde arttı. 'Hemen Ara' butonu ve araç galerimiz tam istediğimiz gibi oldu.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 25000), // En üstte yer alsın
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted AKN Akpınar Hafriyat project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
