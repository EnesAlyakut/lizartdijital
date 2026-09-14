import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "salkim-sogut-sigorta-web-sitesi",
    title: "Salkım Söğüt Sigorta — Bireysel & Kurumsal Sigorta Acenteliği Web Sitesi",
    client: "Salkım Söğüt Sigorta Aracılık Hizmetleri",
    sector: "Sigortacılık & Finans",
    category: "web",
    liveUrl: "https://salkimsogutsigorta.com/tr/ana-sayfa/",
    summary:
      "Bireyler, aileler ve işletmeler için kapsamlı sigorta çözümleri sunan Salkım Söğüt Sigorta için modern poliçe kataloğu, hasar anında destek modülü, sektörel blog ve mobil öncelikli kurumsal acente web sitesi.",
    problem:
      "Özel sağlık sigortası, tamamlayıcı sağlık, işyeri, kasko ve konut sigortalarının anlaşılır ve güven verici bir arayüzle sunulması; hasar anında acil yardım hattına tek tıkla ulaşım ve sigorta rehberi blog içerikleri hedeflendi.",
    solution:
      "Ferah gökyüzü mavisi ve kurumsal lacivert tonlarında prestijli bir finans/sigorta arayüzü inşa edildi. 6 ana branşta poliçe hizmetleri vitrini, modern acente ofisi ve uzman danışman kadrosu tanıtımı, İMM ve kasko rehberi blogu ve doğrudan WhatsApp/çağrı destek hatları masaüstü ve mobil ekranlar için optimize edildi.",
    services: [
      "Kurumsal Web Tasarım",
      "Poliçe & Hizmet Kataloğu Mimarisi",
      "Hasar Anında Destek & Acil Hat",
      "Sigorta Rehberi & Blog Altyapısı",
      "Mobil Öncelikli (Responsive) Tasarım",
      "SEO ve Dönüşüm Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern sigorta acentesi web sitesi",
      "Özel sağlık, tamamlayıcı sağlık, kasko ve işyeri poliçe modülleri",
      "Hasar anında hızlı yardım ve acil telefon / WhatsApp entegrasyonu",
      "Sektörel sigorta blogu ve bilgilendirici makaleler modülü",
      "Acente ofisi ve uzman kadro kurumsal tanıtım sayfası",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/salkimsogut-hizmetler-pc.png",
    mobileImage: "/gorseller/referanslar/salkimsogut-hizmetler-mobil.png",
    gallery: [
      "/gorseller/referanslar/salkimsogut-hizmetler-pc.png",
      "/gorseller/referanslar/salkimsogut-ofis-pc.png",
      "/gorseller/referanslar/salkimsogut-hizmetler-mobil.png",
      "/gorseller/referanslar/salkimsogut-blog-pc.png",
      "/gorseller/referanslar/salkimsogut-blog-mobil.png",
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
      { label: "Poliçe Branşı", value: "Tam Kapsam" },
      { label: "Mobil Uyum", value: "%100 Responsive" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "Salkım Söğüt Sigorta Yönetimi",
      role: "Acente Yöneticisi",
      quote: "Danışanlarımızın poliçelerini güvenle incelediği, hasar anında anında bize ulaştığı ve ofisimizin prestijini yansıtan çok şık bir web sitesine kavuştuk.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 20000), // En üstte yer alsın
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted Salkım Söğüt Sigorta project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
