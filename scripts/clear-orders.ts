import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Siparişler sıfırlanıyor...");

  // Siparişe bağlı ilişkili kayıtlar
  const deletedInvoices = await prisma.invoice.deleteMany({});
  const deletedDownloads = await prisma.download.deleteMany({});
  const deletedLicenses = await prisma.licenseKey.deleteMany({});
  const deletedProjects = await prisma.project.deleteMany({});
  const deletedAddOns = await prisma.orderItemAddOn.deleteMany({});
  const deletedItems = await prisma.orderItem.deleteMany({});
  const deletedPayments = await prisma.payment.deleteMany({});

  // Ana sipariş kayıtları
  const deletedOrders = await prisma.order.deleteMany({});

  console.log(`Tamamlandı! Toplam ${deletedOrders.count} sipariş ve ilişkili tüm kayıtlar temizlendi.`);
}

main()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
