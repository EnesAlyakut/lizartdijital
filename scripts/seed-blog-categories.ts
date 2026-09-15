import { PrismaClient } from "../src/generated/prisma";
import { BLOG_CATEGORIES, BLOG_POSTS } from "../prisma/seed-content";

const prisma = new PrismaClient();

async function main() {
  console.info("Starting blog category & post sync...");

  // 1. Upsert all categories
  const catMap: Record<string, string> = {};
  for (const cat of BLOG_CATEGORIES) {
    const row = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { slug: cat.slug, name: cat.name },
    });
    catMap[cat.slug] = row.id;
    console.info(`Category synced: [${cat.slug}] -> ${row.name}`);
  }

  // 2. Upsert all blog posts
  for (const [i, post] of BLOG_POSTS.entries()) {
    const categoryId = catMap[post.category];
    if (!categoryId) {
      console.warn(`Category not found for post ${post.slug}: ${post.category}`);
      continue;
    }

    const coverImage = (post as any).coverImage || `/gorseller/blog/${post.slug}.webp`;

    const row = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        coverImage,
        authorName: post.author,
        authorTitle: post.authorTitle,
        categoryId,
        readMinutes: post.readMinutes,
        isPublished: true,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        coverImage,
        authorName: post.author,
        authorTitle: post.authorTitle,
        categoryId,
        readMinutes: post.readMinutes,
        isPublished: true,
        publishedAt: new Date(Date.now() - (i + 1) * 3 * 24 * 3600 * 1000),
        metaTitle: post.title,
        metaDescription: post.excerpt,
      },
    });

    console.info(`Post upserted: [${row.slug}] in category [${post.category}] (cover: ${row.coverImage})`);
  }

  // 3. Verify counts per category
  console.info("\n--- Category Verification Summary ---");
  const allCategories = await prisma.blogCategory.findMany({
    include: {
      posts: {
        where: { isPublished: true },
        select: { slug: true, title: true, coverImage: true },
      },
    },
  });

  let allPassed = true;
  for (const cat of allCategories) {
    const count = cat.posts.length;
    console.info(`Category: "${cat.name}" (${cat.slug}) -> ${count} published post(s)`);
    for (const p of cat.posts) {
      console.info(`   - "${p.title}" | Cover: ${p.coverImage}`);
    }
    if (count === 0) {
      allPassed = false;
    }
  }

  if (allPassed) {
    console.info("\nSUCCESS: All blog categories have at least 1 published post with cover image!");
  } else {
    console.warn("\nWARNING: Some categories still have 0 posts!");
  }
}

main()
  .catch((e) => {
    console.error("Error in sync:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
