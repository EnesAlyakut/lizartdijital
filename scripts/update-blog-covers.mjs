import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany();
  console.log("Current blog posts:", posts.map(p => ({ slug: p.slug, cover: p.coverImage })));

  const updates = [
    {
      slug: "hazir-web-sitesi-mi-ozel-tasarim-mi",
      coverImage: "/gorseller/blog/hazir-web-sitesi-mi-ozel-tasarim-mi.svg",
    },
    {
      slug: "eticaret-sitesinde-donusum-artiran-7-duzenleme",
      coverImage: "/gorseller/blog/eticaret-sitesinde-donusum-artiran-7-duzenleme.svg",
    },
    {
      slug: "teknik-seo-kontrol-listesi",
      coverImage: "/gorseller/blog/teknik-seo-kontrol-listesi.svg",
    },
    {
      slug: "mobil-uygulama-yayinlama-sureci",
      coverImage: "/gorseller/blog/mobil-uygulama-yayinlama-sureci.svg",
    },
    {
      slug: "kucuk-isletmeler-icin-reklam-butcesi",
      coverImage: "/gorseller/blog/kucuk-isletmeler-icin-reklam-butcesi.svg",
    },
    {
      slug: "yapay-zeka-destekli-musteri-hizmetleri",
      coverImage: "/gorseller/blog/yapay-zeka-destekli-musteri-hizmetleri.svg",
    },
  ];

  for (const u of updates) {
    const res = await prisma.blogPost.updateMany({
      where: { slug: u.slug },
      data: { coverImage: u.coverImage },
    });
    console.log(`Updated ${u.slug}: count=${res.count}`);
  }

  const updatedPosts = await prisma.blogPost.findMany();
  console.log("Updated posts:", updatedPosts.map(p => ({ slug: p.slug, cover: p.coverImage })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
