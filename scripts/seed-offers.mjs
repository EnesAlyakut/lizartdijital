import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.offer.count();
  if (count > 0) {
    console.log(`Zaten ${count} adet teklif mevcut, atlanıyor.`);
    return;
  }

  const sampleOffers = [
    {
      code: "LZT-2026-8812",
      fullName: "Murat Yıldız",
      email: "murat@yildizlojistik.com",
      phone: "05328901234",
      company: "Yıldız Uluslararası Lojistik A.Ş.",
      answers: JSON.stringify({
        interests: ["Özel yazılım", "Web uygulaması / sistem", "SEO"],
      }),
      budget: "75.000 – 150.000 ₺",
      message:
        "Depo yönetim ve filo takip panelimiz için modern Next.js ve Node.js altyapılı bir web portalı ve API entegrasyonu talep ediyoruz. 3 ay içinde canlıya alınması planlanmaktadır.",
      status: "yeni",
      amount: null,
    },
    {
      code: "LZT-2026-4421",
      fullName: "Banu Demir",
      email: "banu@demirmimarlik.com",
      phone: "05425556789",
      company: "Demir Mimarlık & Restorasyon",
      answers: JSON.stringify({
        interests: ["Hazır web sitesi", "Kurumsal kimlik / tasarım", "SEO"],
      }),
      budget: "35.000 – 75.000 ₺",
      message:
        "Lüks mimari projelerimizin sergilendiği, interaktif portföy alanları ve çok dilli (İngilizce/Türkçe) kurumsal web sitesi istiyoruz. Ayrıca logo yenileme ve kartvizit tasarımı da dahil olsun.",
      status: "incelemede",
      amount: 54000,
    },
    {
      code: "LZT-2026-9934",
      fullName: "Serkan Çelik",
      email: "serkan@trendmoda.com.tr",
      phone: "05051112233",
      company: "Trend Moda Tekstil Ltd.",
      answers: JSON.stringify({
        interests: ["E-ticaret sitesi", "Mobil uygulama", "Reklam yönetimi"],
      }),
      budget: "150.000 ₺ ve üzeri",
      message:
        "Pazaryeri entegrasyonlu (Trendyol, Hepsiburada), iyzico sanal POS altyapılı, iOS/Android mobil uygulaması olan kapsamlı B2C e-ticaret platformu kurulmasını istiyoruz.",
      status: "teklif-gonderildi",
      amount: 185000,
    },
    {
      code: "LZT-2026-2105",
      fullName: "Dr. Aylin Kaya",
      email: "aylin@draylinkaya.com",
      phone: "05553334455",
      company: "Kaya Estetik & Dermatoloji Kliniği",
      answers: JSON.stringify({
        interests: ["Hazır web sitesi", "SEO", "Sosyal medya"],
      }),
      budget: "35.000 – 75.000 ₺",
      message:
        "Randevu entegrasyonlu, klinik öncesi-sonrası fotoğraf galerisi olan ve medikal SEO kurallarına uygun özel klinik web sitesi.",
      status: "kazanildi",
      amount: 48000,
    },
  ];

  for (const o of sampleOffers) {
    await prisma.offer.create({ data: o });
  }

  console.log(`Başarıyla ${sampleOffers.length} adet demo teklif talebi oluşturuldu.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
