import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample contact messages...");

  const sampleMessages = [
    {
      fullName: "Ahmet Ertekin",
      email: "ahmet@ertekininsaat.com",
      phone: "05321114477",
      department: "proje",
      subject: "Lüks Konut Projesi İçin Tanıtım Sitesi ve 3D Katalog",
      body: "Merhaba Lizart ekibi,\n\nKadıköy bölgesinde yürüttüğümüz yeni rezidans projemiz için interaktif kat planları, 3D galeri ve randevu modülü barındıran prestijli bir web sitesi yaptırmak istiyoruz.\n\nSitedeki 'Atlas Kurumsal' şablonunuz çok hoşumuza gitti. Bu şablon üzerinden özel uyarlama yapabilir miyiz? Yaklaşık teslim süresi ve bütçe planlaması için dönüşünüzü bekliyoruz.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 dakika önce
    },
    {
      fullName: "Merve Koçak",
      email: "merve@kocakdanismanlik.com",
      phone: "05459876543",
      department: "satis",
      subject: "SEO ve Sosyal Medya Yönetim Paketi Hakkında Bilgi",
      body: "İyi çalışmalar,\n\nFinansal danışmanlık firmamız için Google sıralamalarında ilk sayfada yer almak ve LinkedIn/Instagram üzerinden kurumsal paylaşımlar yapmak istiyoruz. Sitede yer alan 'SEO Hizmet Paketi' ve 'Sosyal Medya Paketi' içeriğini inceledim.\n\nİkisini bir arada alırsak özel bir kurumsal indiriminiz var mı? Detaylı teklifinizi iletirseniz çok memnun olurum.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 saat önce
    },
    {
      fullName: "Emre Akdeniz",
      email: "emre@akdenizlojistik.com.tr",
      phone: "05335552211",
      department: "destek",
      subject: "Mevcut Web Sitemizde SSL ve Alan Adı Taşıma Desteği",
      body: "Merhaba,\n\nMevcut kurumsal web sitemizin hosting ve SSL sertifikasının Lizart Dijital sunucularına taşınması konusunda teknik desteğe ihtiyacımız var. Kesinti olmadan bu geçişi nasıl planlayabiliriz?\n\nDetayları görüşmek için WhatsApp veya telefonla ulaşırsanız sevinirim.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 gün önce
    },
  ];

  for (const m of sampleMessages) {
    const existing = await prisma.contactMessage.findFirst({
      where: { email: m.email, subject: m.subject },
    });
    if (existing) continue;

    await prisma.contactMessage.create({
      data: m,
    });
    console.log(`Created message from ${m.fullName}: ${m.subject}`);
  }

  console.log("Seeding contact messages complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
