import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.contactMessage.count();
  if (count === 0) {
    await prisma.contactMessage.createMany({
      data: [
        {
          fullName: "Ali Kemal Yıldırım",
          email: "ali@yildiriminsaat.com.tr",
          phone: "05334445566",
          department: "proje",
          subject: "Katalog ve Kurumsal Web Sitesi Talebi",
          body: "Merhaba, inşaat projelerimiz için modern katalog ve kurumsal web sitesi yaptırmak istiyoruz. Fiyat ve teslim süresi hakkında görüşmek isteriz.",
          isRead: false,
        },
        {
          fullName: "Zeynep Aktaş",
          email: "zeynep@aktastekstil.com",
          phone: "05441112233",
          department: "satis",
          subject: "E-Ticaret Entegrasyonu ve Destek",
          body: "Mevcut e-ticaret sitemiz için pazaryeri entegrasyonu ve teknik destek hizmeti almak istiyoruz. Teklifinizi bekliyoruz.",
          isRead: false,
        },
      ],
    });
    console.log("2 adet demo iletişim mesajı eklendi.");
  } else {
    console.log("Mevcut mesaj sayısı:", count);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
