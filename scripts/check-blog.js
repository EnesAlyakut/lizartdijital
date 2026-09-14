const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.blogCategory.findMany({
    include: {
      posts: {
        select: { id: true, title: true, slug: true, isPublished: true }
      }
    }
  });

  console.log("=== BLOG KATEGORİLERİ VE MAKALELERİ ===");
  for (const c of cats) {
    console.log(`\nKategori: ${c.name} (slug: ${c.slug}, id: ${c.id}) - Toplam Makale: ${c.posts.length}`);
    for (const p of c.posts) {
      console.log(`  - [${p.isPublished ? 'YAYINDA' : 'TASLAK'}] ${p.title} (/blog/${p.slug})`);
    }
  }

  const authors = await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, role: true }
  });
  console.log("\n=== YAZARLAR ===");
  console.log(authors);
}

main().finally(() => prisma.$disconnect());
