import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { CATEGORIES, TECHNOLOGIES, PLATFORMS, ADDONS } from "./seed-taxonomy";
import { PRODUCTS } from "./seed-products";
import { REVIEWS, BLOG_CATEGORIES, BLOG_POSTS, FAQS, PAGES } from "./seed-content";
import { REFERENCES } from "./seed-referanslar";
import { generateProductImages, generateContentImage } from "./seed-images";
import { generateBrandImages } from "./seed-brand-images";

const prisma = new PrismaClient();

/** Lisans tanımları — her ürüne aynı yapıda, ürüne göre fiyat farkıyla eklenir. */
function licensesFor(p: (typeof PRODUCTS)[number]) {
  return [
    {
      key: "standart",
      name: "Standart Lisans",
      description: "Tek domain veya tek proje için kullanım. Temel destek ve güncelleme içerir.",
      priceDelta: 0,
      bullets: JSON.stringify([
        "Tek domain veya tek proje",
        "3 ay teknik destek",
        "6 ay ücretsiz güncelleme",
        "Yeniden satış hakkı yoktur",
      ]),
      domainLimit: 1,
      supportMonths: 3,
      updateMonths: 6,
      resaleRights: false,
      sourceIncluded: Boolean(p.includesSource),
      sortOrder: 1,
    },
    {
      key: "genisletilmis",
      name: "Genişletilmiş Lisans",
      description: "Geniş ticari kullanım, daha uzun destek ve gelişmiş dokümantasyon.",
      priceDelta: p.licenses.genisletilmis,
      bullets: JSON.stringify([
        "3 domain veya projeye kadar kullanım",
        "12 ay öncelikli teknik destek",
        "24 ay ücretsiz güncelleme",
        "Gelişmiş dokümantasyon",
        "Ticari kullanım hakkı",
      ]),
      domainLimit: 3,
      supportMonths: 12,
      updateMonths: 24,
      resaleRights: false,
      sourceIncluded: true,
      sortOrder: 2,
    },
    {
      key: "ozel",
      name: "Size Özel Lisans",
      description:
        "Ürünün markanıza uyarlanması, özel modül geliştirme ve talebe bağlı kaynak kod devri.",
      priceDelta: p.licenses.ozel,
      bullets: JSON.stringify([
        "Sınırsız domain",
        "Özel tasarım uyarlaması ve marka entegrasyonu",
        "Özel modül geliştirme",
        "Kaynak kodun tam devri seçeneği",
        "Ürünün mağazadan kaldırılması seçeneği",
        "24 ay öncelikli destek",
      ]),
      domainLimit: 999,
      supportMonths: 24,
      updateMonths: 36,
      resaleRights: true,
      sourceIncluded: true,
      sortOrder: 3,
    },
  ];
}

/** Ürün türüne göre önerilen ek hizmetleri seçer. */
function addOnSlugsFor(type: string): { slug: string; recommended: boolean }[] {
  const base = [
    { slug: "profesyonel-kurulum", recommended: true },
    { slug: "domain-baglantisi", recommended: false },
    { slug: "hosting-kurulumu", recommended: false },
    { slug: "logo-degisimi", recommended: true },
    { slug: "renk-duzenleme", recommended: false },
    { slug: "kurumsal-kimlik-uyarlamasi", recommended: false },
    { slug: "icerik-girisi", recommended: true },
    { slug: "ek-sayfa-tasarimi", recommended: false },
    { slug: "ozel-modul-gelistirme", recommended: false },
    { slug: "egitim-destegi", recommended: false },
    { slug: "aylik-bakim-paketi", recommended: false },
    { slug: "yillik-teknik-destek", recommended: false },
  ];
  if (type === "app") {
    return [
      { slug: "mobil-uygulama-yayinlama", recommended: true },
      { slug: "app-store-yayini", recommended: true },
      { slug: "google-play-yayini", recommended: true },
      { slug: "logo-degisimi", recommended: true },
      { slug: "renk-duzenleme", recommended: false },
      { slug: "ozel-modul-gelistirme", recommended: false },
      { slug: "egitim-destegi", recommended: false },
      { slug: "yillik-teknik-destek", recommended: false },
    ];
  }
  if (type === "service") {
    return [
      { slug: "kurumsal-kimlik-uyarlamasi", recommended: false },
      { slug: "icerik-girisi", recommended: false },
      { slug: "egitim-destegi", recommended: true },
      { slug: "aylik-bakim-paketi", recommended: true },
    ];
  }
  const commerce = [
    { slug: "odeme-sistemi-entegrasyonu", recommended: true },
    { slug: "kargo-entegrasyonu", recommended: true },
    { slug: "urun-girisi", recommended: true },
    { slug: "coklu-dil-kurulumu", recommended: false },
  ];
  return [...base, ...commerce];
}

/** Ürün için gerçekçi bir demo dosyası ve sürüm geçmişi oluşturur. */
async function createDemoFile(slug: string) {
  const dir = path.join(process.cwd(), "private-files", "urunler");
  await fs.mkdir(dir, { recursive: true });
  const key = `urunler/${slug}-v1.2.0.zip`;
  const full = path.join(process.cwd(), "private-files", key);
  // Gerçek projede burada asıl ürün arşivi bulunur. Demo için okunabilir bir yer tutucu yazılır.
  const content = `Lizart Dijital - ${slug}\nSurum: 1.2.0\n\nBu dosya demo amaclidir. Gercek kurulumda urun arsivi bu konumda bulunur.\n`;
  await fs.writeFile(full, content, "utf8");
  const size = Buffer.byteLength(content);
  return { key, size };
}

async function main() {
  console.info("Demo verileri hazırlanıyor…");

  // Ana sayfa tanıtım görselleri (ajans ve hizmet illüstrasyonları)
  await generateBrandImages();

  // --- Roller -------------------------------------------------------------
  const roleDefs = [
    { key: "admin", name: "Yönetici", permissions: ["*"] },
    { key: "editor", name: "İçerik Editörü", permissions: ["products.write", "blog.write", "portfolio.write", "pages.write"] },
    { key: "support", name: "Destek Ekibi", permissions: ["orders.read", "tickets.write", "projects.write"] },
    { key: "customer", name: "Müşteri", permissions: ["self"] },
  ];
  const roles: Record<string, string> = {};
  for (const r of roleDefs) {
    const row = await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name, permissions: JSON.stringify(r.permissions) },
      create: { key: r.key, name: r.name, permissions: JSON.stringify(r.permissions) },
    });
    roles[r.key] = row.id;
  }

  // --- Kullanıcılar -------------------------------------------------------
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Lizart!2026";
  const users = [
    { email: "admin@lizartdijital.com", fullName: "Enes Alyakut", role: "admin", password: adminPassword },
    { email: "editor@lizartdijital.com", fullName: "Elif Demir", role: "editor", password: adminPassword },
    { email: "destek@lizartdijital.com", fullName: "Mert Sarı", role: "support", password: adminPassword },
    { email: "musteri@ornek.com", fullName: "Ayşe Kaya", role: "customer", password: "Musteri!2026" },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash: await bcrypt.hash(u.password, 12),
        roleId: roles[u.role],
        emailVerified: new Date(),
      },
    });
  }

  // --- Taksonomi ----------------------------------------------------------
  const categoryIds: Record<string, string> = {};
  for (const [i, c] of CATEGORIES.entries()) {
    const row = await prisma.productCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, kind: c.kind, sortOrder: i },
      create: { slug: c.slug, name: c.name, kind: c.kind, sortOrder: i },
    });
    categoryIds[c.slug] = row.id;
  }

  const techIds: Record<string, string> = {};
  for (const t of TECHNOLOGIES) {
    const row = await prisma.technology.upsert({
      where: { slug: t.slug },
      update: { name: t.name, group: t.group },
      create: t,
    });
    techIds[t.slug] = row.id;
  }

  const platformIds: Record<string, string> = {};
  for (const p of PLATFORMS) {
    const row = await prisma.platform.upsert({ where: { slug: p.slug }, update: { name: p.name }, create: p });
    platformIds[p.slug] = row.id;
  }

  const addOnIds: Record<string, string> = {};
  for (const a of ADDONS) {
    const row = await prisma.addOnService.upsert({ where: { slug: a.slug }, update: a, create: a });
    addOnIds[a.slug] = row.id;
  }

  // --- Ürünler ------------------------------------------------------------
  const productIds: Record<string, string> = {};
  for (const p of PRODUCTS) {
    const img = await generateProductImages(p.slug, p.name, p.shortDesc);
    const { key, size } = await createDemoFile(p.slug);

    // Ürün alanları upsert edilir; satılmış ürünler silinmez, sipariş kayıtları korunur.
    const productData = {
      name: p.name,
      type: p.type,
      categoryId: categoryIds[p.category],
      shortDesc: p.shortDesc,
      description: p.description,
      features: JSON.stringify(p.features),
      useCases: JSON.stringify(p.useCases),
      modules: JSON.stringify(p.modules),
      techSpecs: JSON.stringify(p.techSpecs),
      requirements: p.requirements,
      supportScope:
        "Kurulum sorunları, ürün hataları ve kullanım soruları destek kapsamındadır. Yeni özellik geliştirme özelleştirme hizmeti olarak ayrıca fiyatlandırılır.",
      updatePolicy:
        "Lisansınızın kapsadığı süre boyunca yayınlanan tüm sürüm güncellemeleri ücretsizdir ve hesabınızdan indirilebilir.",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice ?? null,
      coverImage: img.cover,
      demoUrl: p.type === "service" ? null : `https://demo.lizartdijital.com/${p.slug}`,
      adminDemoUrl: p.hasAdminPanel ? `https://demo.lizartdijital.com/${p.slug}/panel` : null,
      demoUser: p.hasAdminPanel ? "demo@lizartdijital.com" : null,
      demoPassword: p.hasAdminPanel ? "demo1234" : null,
      designStyle: p.designStyle,
      deliveryDays: p.deliveryDays,
      hasAdminPanel: Boolean(p.hasAdminPanel),
      includesSetup: Boolean(p.includesSetup),
      includesSource: Boolean(p.includesSource),
      multiLanguage: Boolean(p.multiLanguage),
      hasPayment: Boolean(p.hasPayment),
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      isNew: Boolean(p.isNew),
      salesCount: p.salesCount,
      viewCount: p.viewCount,
      demoCount: Math.round(p.viewCount * 0.28),
      metaTitle: p.name,
      metaDescription: p.shortDesc,
    };

    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: productData,
      create: { slug: p.slug, ...productData },
    });
    productIds[p.slug] = created.id;

    // Yeniden oluşturulması güvenli olan ilişkiler temizlenip baştan kurulur.
    await prisma.productImage.deleteMany({ where: { productId: created.id } });
    await prisma.productTechnology.deleteMany({ where: { productId: created.id } });
    await prisma.productPlatform.deleteMany({ where: { productId: created.id } });
    await prisma.productAddOn.deleteMany({ where: { productId: created.id } });
    await prisma.faq.deleteMany({ where: { productId: created.id } });

    await prisma.productImage.createMany({
      data: [
        { productId: created.id, url: img.desktop, alt: `${p.name} masaüstü görünüm`, viewport: "desktop", sortOrder: 1 },
        { productId: created.id, url: img.tablet, alt: `${p.name} tablet görünüm`, viewport: "tablet", sortOrder: 2 },
        { productId: created.id, url: img.mobile, alt: `${p.name} mobil görünüm`, viewport: "mobile", sortOrder: 3 },
        ...(p.hasAdminPanel
          ? [{ productId: created.id, url: img.admin, alt: `${p.name} yönetim paneli`, viewport: "admin", sortOrder: 4 }]
          : []),
      ],
    });
    await prisma.productTechnology.createMany({
      data: p.technologies.map((t) => ({ productId: created.id, technologyId: techIds[t] })),
    });
    await prisma.productPlatform.createMany({
      data: p.platforms.map((pl) => ({ productId: created.id, platformId: platformIds[pl] })),
    });
    await prisma.productAddOn.createMany({
      data: addOnSlugsFor(p.type)
        .filter((a) => addOnIds[a.slug])
        .map((a) => ({ productId: created.id, addOnId: addOnIds[a.slug], isRecommended: a.recommended })),
    });
    await prisma.faq.createMany({
      data: [
        {
          productId: created.id,
          category: "kurulum",
          question: `${p.name} kurulumu ne kadar sürer?`,
          answer: `Dosya teslimi anında yapılır. Profesyonel kurulum hizmetini seçerseniz kurulum ortalama ${p.deliveryDays} iş günü içinde tamamlanır.`,
          sortOrder: 1,
        },
        {
          productId: created.id,
          category: "destek",
          question: "Satın aldıktan sonra destek alabilir miyim?",
          answer:
            "Evet. Standart lisansta 3 ay, genişletilmiş lisansta 12 ay teknik destek verilir. Destek talebi hesabınızdan oluşturulur.",
          sortOrder: 2,
        },
      ],
    });

    // Lisanslar sipariş kayıtlarına bağlı olduğu için silinmez, upsert edilir.
    for (const license of licensesFor(p)) {
      await prisma.productLicense.upsert({
        where: { productId_key: { productId: created.id, key: license.key } },
        update: license,
        create: { ...license, productId: created.id },
      });
    }

    // Sürümler ve dosyalar yalnızca yoksa oluşturulur; indirme kayıtları bozulmaz.
    const versions = [
      {
        version: "1.2.0",
        changelog:
          "Yönetim paneli arayüzü sadeleştirildi. Mobil performans iyileştirmeleri yapıldı. Bilinen iki hata giderildi.",
        releasedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000),
      },
      {
        version: "1.1.0",
        changelog: "Çoklu dil altyapısı eklendi. SEO meta alanları genişletildi.",
        releasedAt: new Date(Date.now() - 68 * 24 * 3600 * 1000),
      },
    ];

    let latestVersionId: string | null = null;
    for (const v of versions) {
      const existingVersion = await prisma.productVersion.findFirst({
        where: { productId: created.id, version: v.version },
      });
      const row =
        existingVersion ??
        (await prisma.productVersion.create({ data: { ...v, productId: created.id } }));
      if (v.version === "1.2.0") latestVersionId = row.id;
    }

    const existingFile = await prisma.productFile.findFirst({
      where: { productId: created.id, storageKey: key },
    });
    if (!existingFile) {
      await prisma.productFile.create({
        data: {
          productId: created.id,
          versionId: latestVersionId,
          label: `${p.name} kurulum paketi (v1.2.0)`,
          storageKey: key,
          sizeBytes: size,
        },
      });
    }
  }

  // --- Yorumlar -----------------------------------------------------------
  await prisma.review.deleteMany();
  for (const r of REVIEWS) {
    await prisma.review.create({
      data: {
        productId: productIds[r.product],
        authorName: r.authorName,
        authorTitle: r.authorTitle,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isVerified: true,
        isApproved: true,
      },
    });
  }
  // Ürün puan ortalamalarını yorumlardan hesapla
  for (const slug of Object.keys(productIds)) {
    const agg = await prisma.review.aggregate({
      where: { productId: productIds[slug], isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: productIds[slug] },
      data: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
    });
  }

  // --- Blog ---------------------------------------------------------------
  const blogCatIds: Record<string, string> = {};
  for (const c of BLOG_CATEGORIES) {
    const row = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
    blogCatIds[c.slug] = row.id;
  }
  for (const [i, post] of BLOG_POSTS.entries()) {
    const cover = (post as any).coverImage || `/gorseller/blog/${post.slug}.webp`;
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        coverImage: cover,
        authorName: post.author,
        authorTitle: post.authorTitle,
        categoryId: blogCatIds[post.category],
        readMinutes: post.readMinutes,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        coverImage: cover,
        authorName: post.author,
        authorTitle: post.authorTitle,
        categoryId: blogCatIds[post.category],
        readMinutes: post.readMinutes,
        publishedAt: new Date(Date.now() - (i + 1) * 9 * 24 * 3600 * 1000),
        metaTitle: post.title,
        metaDescription: post.excerpt,
      },
    });
  }

  // --- Portföy: gerçek referans projeleri ---------------------------------
  // Ekran görüntüleri müşterilerin yayındaki sitelerinden alınmıştır
  // (scripts/referans-gorselleri.mjs). Uydurma sonuç metriği kullanılmaz.
  for (const [i, ref] of REFERENCES.entries()) {
    const galleryItems = ref.gallery ?? (
      ref.shot === "adamotor"
        ? [
            `/gorseller/referanslar/adamotor-masaustu.png`,
            `/gorseller/referanslar/adamotor-mobil.png`,
            `/gorseller/referanslar/adamotor-motosiklet-masaustu.png`,
            `/gorseller/referanslar/adamotor-aksesuar-mobil.png`,
            `/gorseller/referanslar/adamotor-aksesuar-masaustu.png`,
          ]
        : ref.shot === "anssigorta"
        ? [
            `/gorseller/referanslar/ans-sigorta-masaustu.png`,
            `/gorseller/referanslar/ans-sigorta-mobil.png`,
            `/gorseller/referanslar/ans-sigorta-hizmetler-masaustu.png`,
            `/gorseller/referanslar/ans-sigorta-avantajlar-mobil.png`,
            `/gorseller/referanslar/ans-sigorta-blog-masaustu.png`,
          ]
        : ref.shot === "curecare"
        ? [
            `/gorseller/referanslar/curecare-masaustu.png`,
            `/gorseller/referanslar/curecare-mobil.png`,
            `/gorseller/referanslar/curecare-urunler-masaustu.png`,
            `/gorseller/referanslar/curecare-hakkimizda-mobil.png`,
            `/gorseller/referanslar/curecare-iletisim-masaustu.png`,
          ]
        : ref.shot === "enareklam"
        ? [
            `/gorseller/referanslar/ena-reklam-masaustu.png`,
            `/gorseller/referanslar/ena-reklam-mobil.png`,
            `/gorseller/referanslar/ena-reklam-hizmetler-masaustu.png`,
            `/gorseller/referanslar/ena-reklam-isler-mobil.png`,
            `/gorseller/referanslar/ena-reklam-iletisim-mobil.png`,
          ]
        : ref.shot === "everydent"
        ? [
            `/gorseller/referanslar/everydent-masaustu.png`,
            `/gorseller/referanslar/everydent-mobil.png`,
            `/gorseller/referanslar/everydent-blog-masaustu.png`,
            `/gorseller/referanslar/everydent-tedaviler-mobil.png`,
            `/gorseller/referanslar/everydent-blog-mobil.png`,
          ]
        : ref.shot === "fmshukuk"
        ? [
            `/gorseller/referanslar/fmshukuk-masaustu.png`,
            `/gorseller/referanslar/fmshukuk-mobil.png`,
            `/gorseller/referanslar/fmshukuk-hizmetler-masaustu.png`,
            `/gorseller/referanslar/fmshukuk-hizmetler-mobil.png`,
            `/gorseller/referanslar/fmshukuk-hakkimizda-masaustu.png`,
          ]
        : ref.shot === "zenitdent"
        ? [
            `/gorseller/referanslar/zenitdent-hero-pc.png`,
            `/gorseller/referanslar/zenitdent-tedaviler-pc.png`,
            `/gorseller/referanslar/zenitdent-hero-mobil.png`,
            `/gorseller/referanslar/zenitdent-hakkimizda-mobil.png`,
            `/gorseller/referanslar/zenitdent-randevu-mobil.png`,
          ]
        : ref.shot === "dentsolo"
        ? [
            `/gorseller/referanslar/dentsolo-hero-pc.png`,
            `/gorseller/referanslar/dentsolo-invisalign-pc.png`,
            `/gorseller/referanslar/dentsolo-tedaviler-mobil.png`,
            `/gorseller/referanslar/dentsolo-hekim-mobil.png`,
            `/gorseller/referanslar/dentsolo-blog-mobil.png`,
          ]
        : ref.shot === "akpinarhafriyat"
        ? [
            `/gorseller/referanslar/akpinarhafriyat-hero-pc.png`,
            `/gorseller/referanslar/akpinarhafriyat-araclar-pc.png`,
            `/gorseller/referanslar/akpinarhafriyat-hero-mobil.png`,
            `/gorseller/referanslar/akpinarhafriyat-galeri-pc.png`,
          ]
        : ref.shot === "salkimsogut"
        ? [
            `/gorseller/referanslar/salkimsogut-hizmetler-pc.png`,
            `/gorseller/referanslar/salkimsogut-ofis-pc.png`,
            `/gorseller/referanslar/salkimsogut-hizmetler-mobil.png`,
            `/gorseller/referanslar/salkimsogut-blog-pc.png`,
            `/gorseller/referanslar/salkimsogut-blog-mobil.png`,
          ]
        : ref.shot === "ndnarsa"
        ? [
            `/gorseller/referanslar/ndnarsa-hero-pc.png`,
            `/gorseller/referanslar/ndnarsa-hakkimizda-pc.png`,
            `/gorseller/referanslar/ndnarsa-hero-mobil.png`,
            `/gorseller/referanslar/ndnarsa-hakkimizda-mobil.png`,
            `/gorseller/referanslar/ndnarsa-blog-pc.png`,
          ]
        : ref.shot === "macmekanik"
        ? [
            `/gorseller/referanslar/macmekanik-hero-pc.png`,
            `/gorseller/referanslar/macmekanik-villa-pc.png`,
            `/gorseller/referanslar/macmekanik-hizmet-mobil.png`,
            `/gorseller/referanslar/macmekanik-proje-pc.png`,
            `/gorseller/referanslar/macmekanik-proje-mobil.png`,
          ]
        : ref.shot === "kuruoglukerestecilik"
        ? [
            `/gorseller/referanslar/kuruoglukerestecilik-masaustu.png`,
            `/gorseller/referanslar/kuruoglukerestecilik-mobil.png`,
            `/gorseller/referanslar/kuruoglukerestecilik-urunler-masaustu.png`,
            `/gorseller/referanslar/kuruoglukerestecilik-galeri-masaustu.png`,
            `/gorseller/referanslar/kuruoglukerestecilik-blog-mobil.png`,
          ]
        : ref.shot === "kosuyolurezonans"
        ? [
            `/gorseller/referanslar/kosuyolurezonans-masaustu.png`,
            `/gorseller/referanslar/kosuyolurezonans-mobil.png`,
            `/gorseller/referanslar/kosuyolurezonans-tedaviler-masaustu.png`,
            `/gorseller/referanslar/kosuyolurezonans-tedaviler-mobil.png`,
            `/gorseller/referanslar/kosuyolurezonans-slide2-mobil.png`,
          ]
        : ref.shot === "itcdent"
        ? [
            `/gorseller/referanslar/itcdent-masaustu.png`,
            `/gorseller/referanslar/itcdent-mobil.png`,
            `/gorseller/referanslar/itcdent-tedaviler-masaustu.png`,
            `/gorseller/referanslar/itcdent-blog-mobil.png`,
          ]
        : ref.shot === "gisdental"
        ? [
            `/gorseller/referanslar/gisdental-masaustu.png`,
            `/gorseller/referanslar/gisdental-mobil.png`,
            `/gorseller/referanslar/gisdental-tedaviler-masaustu.png`,
            `/gorseller/referanslar/gisdental-hakkimizda-masaustu.png`,
            `/gorseller/referanslar/gisdental-tedaviler-mobil.png`,
          ]
        : ref.shot === "gebzebayrak"
        ? [
            `/gorseller/referanslar/gebzebayrak-masaustu.png`,
            `/gorseller/referanslar/gebzebayrak-mobil.png`,
            `/gorseller/referanslar/gebzebayrak-kanun-masaustu.png`,
            `/gorseller/referanslar/gebzebayrak-hakkimizda-mobil.png`,
            `/gorseller/referanslar/gebzebayrak-hakkimizda-masaustu.png`,
          ]
        : [
            `/gorseller/referanslar/kanat-musavirlik-masaustu.png`,
            `/gorseller/referanslar/kanat-musavirlik-hizmetler-mobil.png`,
            `/gorseller/referanslar/kanat-musavirlik-hizmetler-masaustu.png`,
            `/gorseller/referanslar/kanat-musavirlik-hakkimizda-mobil.png`,
            `/gorseller/referanslar/kanat-musavirlik-hakkimizda-masaustu.png`,
          ]);

    const webpGalleryItems = galleryItems.map((item) =>
      item.replace(/\.(png|jpg|jpeg)$/i, ".webp"),
    );

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
      // Ölçülebilir sonuç yalnızca müşteriden onaylı veri geldiğinde doldurulur.
      results: JSON.stringify([]),
      coverImage: webpGalleryItems[0],
      mobileImage: webpGalleryItems[1],
      liveUrl: ref.liveUrl,
      gallery: JSON.stringify(webpGalleryItems),
      testimonial: null,
      isFeatured: ref.isFeatured,
      completedAt: new Date(Date.now() - (i) * 34 * 24 * 3600 * 1000),
    };

    await prisma.portfolioProject.upsert({
      where: { slug: ref.slug },
      update: data,
      create: { slug: ref.slug, ...data },
    });
  }

  // Önceki demo portföy kayıtları temizlenir; portföyde yalnızca gerçek işler kalır.
  await prisma.portfolioProject.deleteMany({
    where: { slug: { notIn: REFERENCES.map((r) => r.slug) } },
  });

  // --- SSS ----------------------------------------------------------------
  await prisma.faq.deleteMany({ where: { productId: null } });
  for (const [i, f] of FAQS.entries()) {
    await prisma.faq.create({ data: { ...f, sortOrder: i } });
  }

  // --- Sayfalar -----------------------------------------------------------
  for (const p of PAGES) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title, body: p.body, group: p.group },
      create: {
        slug: p.slug,
        title: p.title,
        body: p.body,
        group: p.group,
        metaTitle: p.title,
        metaDescription: `${p.title} — Lizart Dijital.`,
      },
    });
  }

  // --- Kuponlar -----------------------------------------------------------
  await prisma.coupon.upsert({
    where: { code: "HOSGELDIN10" },
    update: {},
    create: { code: "HOSGELDIN10", type: "yuzde", value: 10, minSubtotal: 500000, maxUses: 500 },
  });
  await prisma.coupon.upsert({
    where: { code: "KURULUM500" },
    update: {},
    create: { code: "KURULUM500", type: "tutar", value: 50000, minSubtotal: 1500000, maxUses: 200 },
  });

  // --- Ayarlar ------------------------------------------------------------
  const settings: Record<string, string> = {
    "announcement.text": "Yeni yıl kampanyası: seçili hazır web sitelerinde %25'e varan indirim",
    "announcement.href": "/magaza?siralama=indirimli",
    "announcement.active": "true",
    "stats.projects": "480",
    "stats.customers": "310",
    "stats.years": "9",
    "stats.satisfaction": "4.8",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  const counts = {
    ürün: await prisma.product.count(),
    kategori: await prisma.productCategory.count(),
    "ek hizmet": await prisma.addOnService.count(),
    yorum: await prisma.review.count(),
    "blog yazısı": await prisma.blogPost.count(),
    "portföy projesi": await prisma.portfolioProject.count(),
    sss: await prisma.faq.count({ where: { productId: null } }),
    sayfa: await prisma.page.count(),
  };
  console.info("Tamamlandı:", counts);
  console.info(`Yönetici girişi: admin@lizartdijital.com / ${adminPassword}`);
  console.info("Müşteri girişi:  musteri@ornek.com / Musteri!2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
