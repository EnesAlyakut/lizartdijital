import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const list = await prisma.portfolioProject.findMany({
    orderBy: [{ isFeatured: 'desc' }, { completedAt: 'desc' }],
    take: 5,
    select: {
      slug: true,
      title: true,
      liveUrl: true,
      isFeatured: true,
      completedAt: true,
    },
  });

  console.log("Top 5 portfolio items:");
  list.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.slug}]`);
    console.log(`   Title: ${item.title}`);
    console.log(`   LiveUrl: ${item.liveUrl}`);
    console.log(`   CompletedAt: ${item.completedAt}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
