import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Teklif talepleri ve form mesajları sıfırlanıyor...");

  // Teklif kayıtları
  const deletedOffers = await prisma.offer.deleteMany({});
  console.log(`Toplam ${deletedOffers.count} teklif talebi temizlendi.`);

  // İletişim / Form mesajları
  const deletedMessages = await prisma.contactMessage.deleteMany({});
  console.log(`Toplam ${deletedMessages.count} form mesajı temizlendi.`);

  console.log("Teklifler ve form mesajları başarıyla sıfırlandı!");
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
