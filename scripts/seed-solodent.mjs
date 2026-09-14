import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const ref = {
    slug: "solodent-agiz-ve-dis-sagligi-web-sitesi",
    title: "SoloDent — Ağız ve Diş Sağlığı Polikliniği Web Sitesi",
    client: "SoloDent Ağız ve Diş Sağlığı Polikliniği",
    sector: "Sağlık & Diş Hekimliği",
    category: "saglik",
    liveUrl: "https://dentsolo.com/",
    summary:
      "Modern diş hekimliği teknolojileriyle donatılmış SoloDent Ağız ve Diş Sağlığı Polikliniği için Invisalign (şeffaf plak), implantoloji, estetik diş hekimliği ve online randevu odaklı, mobil öncelikli kurumsal klinik web sitesi.",
    problem:
      "Hastaların kliniğin modern olanaklarını, Invisalign şeffaf plak tedavilerini, implantoloji ve panoramik röntgen altyapısını güvenle inceleyebileceği; hekim kadrosunu görebileceği ve tek tıkla online randevu / WhatsApp danışma hattına ulaşabileceği bir dijital klinik deneyimi hedeflendi.",
    solution:
      "Ferah beyaz ve canlı turkuaz tonlarında güven verici kurumsal sağlık arayüzü inşa edildi. Invisalign şeffaf plak tedavisi ve estetik diş uygulamaları detay sayfaları, 4 ana tedavi kategorisi (İmplantoloji, Panoramik Röntgen, Protez Diş, Çocuk Diş Hekimliği), klinik tedavi ortamı vitrini, ağız ve diş sağlığı blog rehberi ve doğrudan WhatsApp/randevu hatları masaüstü ve mobil ekranlar için kusursuz optimize edildi.",
    services: [
      "Klinik Web Sitesi Tasarımı",
      "Invisalign & Tedavi Kataloğu Mimarisi",
      "Online Randevu & WhatsApp Entegrasyonu",
      "Mobil Öncelikli (Responsive) Arayüz",
      "Diş Sağlığı Blog & Hasta Rehberi",
      "Medikal SEO ve Yerel Harita Optimizasyonu",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    deliverables: [
      "Masaüstü ve mobil uyumlu modern diş polikliniği web sitesi",
      "Invisalign şeffaf plak ve implantoloji tedavi detay modülleri",
      "Klinik hekimleri, teknolojik ekipman ve hasta tedavi ortamı vitrini",
      "Ağız ve diş sağlığı blogu ve hasta bilgilendirme makaleleri",
      "Tek tıkla online randevu alma ve WhatsApp danışma hattı",
    ],
    isFeatured: true,
    coverImage: "/gorseller/referanslar/dentsolo-hero-pc.png",
    mobileImage: "/gorseller/referanslar/dentsolo-tedaviler-mobil.png",
    gallery: [
      "/gorseller/referanslar/dentsolo-hero-pc.png",
      "/gorseller/referanslar/dentsolo-invisalign-pc.png",
      "/gorseller/referanslar/dentsolo-tedaviler-mobil.png",
      "/gorseller/referanslar/dentsolo-hekim-mobil.png",
      "/gorseller/referanslar/dentsolo-blog-mobil.png",
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
      { label: "Tedavi Kataloğu", value: "İnteraktif & Detaylı" },
      { label: "Mobil Uyum", value: "%100 Responsive" },
    ]),
    coverImage: ref.coverImage,
    mobileImage: ref.mobileImage,
    liveUrl: ref.liveUrl,
    gallery: JSON.stringify(ref.gallery),
    testimonial: JSON.stringify({
      author: "SoloDent Poliklinik Yönetimi",
      role: "Başhekim",
      quote: "Hastalarımızın Invisalign ve implant tedavilerimizi kolayca incelediği, doğrudan randevu alabildiği ve kliniğimizin hijyenik modernliğini yansıtan mükemmel bir web sitemiz oldu.",
    }),
    isFeatured: true,
    completedAt: new Date(Date.now() + 30000), // En üstte yer alsın
  };

  const project = await prisma.portfolioProject.upsert({
    where: { slug: ref.slug },
    update: data,
    create: { slug: ref.slug, ...data },
  });

  console.log("Successfully upserted SoloDent project:", project.slug, project.title, project.liveUrl);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
