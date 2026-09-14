import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst();
  if (!product) {
    console.log("Ürün bulunamadı.");
    return;
  }

  const existingPending = await prisma.review.findFirst({ where: { isApproved: false } });
  if (!existingPending) {
    await prisma.review.create({
      data: {
        productId: product.id,
        authorName: "Kaan Arslan",
        authorTitle: "E-Ticaret Yöneticisi, Arslan Grup",
        rating: 5,
        title: "Harika bir tema ve hızlı kurulum desteği",
        body: "Web sitemizi 3 günde sorunsuz kurdular. Yönetim paneli çok pratik ve hızlı çalışıyor. Emeği geçen tüm ekibe teşekkür ederiz.",
        isApproved: false,
        isVerified: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: product.id,
        authorName: "Hakan Uğur",
        authorTitle: "Serbest Tasarımcı",
        rating: 4,
        title: "Mobil görünüm başarılı",
        body: "Mobil performansı gayet akıcı ve modern. Fiyat/performans olarak kesinlikle tavsiye ediyorum.",
        isApproved: false,
        isVerified: false,
      },
    });

    console.log("2 adet onay bekleyen demo müşteri yorumu oluşturuldu.");
  } else {
    console.log("Zaten onay bekleyen yorum mevcut.");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
