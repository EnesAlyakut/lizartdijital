import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample site orders...");

  // Products
  const vitrin = await prisma.product.findUnique({
    where: { slug: "vitrin-eticaret-sitesi" },
    include: { licenses: true },
  });
  const medica = await prisma.product.findUnique({
    where: { slug: "medica-klinik-web-sitesi" },
    include: { licenses: true },
  });
  const marina = await prisma.product.findUnique({
    where: { slug: "marina-otel-rezervasyon-sitesi" },
    include: { licenses: true },
  });
  const sofra = await prisma.product.findUnique({
    where: { slug: "sofra-restoran-web-sitesi" },
    include: { licenses: true },
  });
  const arsa = await prisma.product.findUnique({
    where: { slug: "arsa-emlak-portali" },
    include: { licenses: true },
  });

  const addOns = await prisma.addOnService.findMany();
  const getAddOn = (slug: string) => addOns.find((a) => a.slug === slug) || addOns[0];

  const sampleOrders = [
    {
      orderNumber: "LZ-2026-000002",
      status: "odendi",
      email: "mehmet@trendmoda.com",
      fullName: "Mehmet Yılmaz",
      phone: "05324567890",
      customerType: "kurumsal",
      companyName: "Trend Moda Tekstil San. Tic. Ltd. Şti.",
      taxOffice: "Beyoğlu",
      taxNumber: "8472910482",
      billingCity: "İstanbul",
      billingDistrict: "Şişli",
      billingLine1: "Halaskargazi Cad. No:142 Kat:3",
      product: vitrin,
      licenseKey: "genisletilmis",
      addOns: [getAddOn("profesyonel-kurulum"), getAddOn("kurumsal-kimlik-uyarlamasi")].filter(Boolean),
      paymentMethod: "kart",
      estimatedDays: 4,
      note: "E-ticaret sitemiz için İyzico ve Yurtiçi Kargo modüllerinin de entegre edilmesini rica ediyoruz.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 saat önce
    },
    {
      orderNumber: "LZ-2026-000003",
      status: "bekliyor",
      email: "dr.selin@erdemklinik.com",
      fullName: "Dr. Selin Erdem",
      phone: "05443219876",
      customerType: "bireysel",
      companyName: null,
      taxOffice: null,
      taxNumber: null,
      billingCity: "Ankara",
      billingDistrict: "Çankaya",
      billingLine1: "Tunalı Hilmi Cad. 78/12",
      product: medica,
      licenseKey: "standart",
      addOns: [getAddOn("profesyonel-kurulum")].filter(Boolean),
      paymentMethod: "havale",
      estimatedDays: 2,
      note: "Havale dekontunu WhatsApp üzerinden ilettim. Randevu modülü kurulumu önceliklidir.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 saat önce
    },
    {
      orderNumber: "LZ-2026-000004",
      status: "hazirlaniyor",
      email: "burak@marinahotel.com",
      fullName: "Burak Demir",
      phone: "05339871234",
      customerType: "kurumsal",
      companyName: "Marina Turizm ve Otelcilik A.Ş.",
      taxOffice: "Bodrum",
      taxNumber: "5938102947",
      billingCity: "Muğla",
      billingDistrict: "Bodrum",
      billingLine1: "Yalıkavak Yat Limanı Yanı No:12",
      product: marina,
      licenseKey: "ozel",
      addOns: [getAddOn("icerik-girisi"), getAddOn("profesyonel-kurulum")].filter(Boolean),
      paymentMethod: "kart",
      estimatedDays: 7,
      note: "Yaz sezonu açılışı öncesi çok dilli (TR / EN / DE / RU) rezervasyon motoru aktif edilecek.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 gün önce
    },
    {
      orderNumber: "LZ-2026-000005",
      status: "teslim",
      email: "caner@sofralezzetleri.com",
      fullName: "Caner Özkan",
      phone: "05556781290",
      customerType: "bireysel",
      companyName: null,
      taxOffice: null,
      taxNumber: null,
      billingCity: "İzmir",
      billingDistrict: "Alsancak",
      billingLine1: "1448 Sok. No:9",
      product: sofra,
      licenseKey: "standart",
      addOns: [getAddOn("profesyonel-kurulum")].filter(Boolean),
      paymentMethod: "kart",
      estimatedDays: 3,
      note: "Menü PDF ve QR kod bağlantısı başarıyla oluşturuldu. Çok teşekkürler.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 gün önce
    },
    {
      orderNumber: "LZ-2026-000006",
      status: "teslim",
      email: "hakan@prestijemlak.net",
      fullName: "Hakan Şahin",
      phone: "05051239845",
      customerType: "kurumsal",
      companyName: "Prestij Gayrimenkul Yatırım Danışmanlığı",
      taxOffice: "Kadıköy",
      taxNumber: "9182736450",
      billingCity: "İstanbul",
      billingDistrict: "Kadıköy",
      billingLine1: "Bağdat Cad. No:310 D:5",
      product: arsa,
      licenseKey: "genisletilmis",
      addOns: [getAddOn("kurumsal-kimlik-uyarlamasi")].filter(Boolean),
      paymentMethod: "kart",
      estimatedDays: 4,
      note: "Harita API entegrasyonu tamamlandı, yayına alındı.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 gün önce
    },
  ];

  for (const o of sampleOrders) {
    if (!o.product) continue;
    const license = o.product.licenses.find((l) => l.key === o.licenseKey) || o.product.licenses[0];
    const unitPrice = o.product.basePrice + license.priceDelta;
    const addOnTotal = o.addOns.reduce((sum, a) => sum + a.price, 0);
    const subtotal = unitPrice + addOnTotal;
    const vatTotal = Math.round(subtotal * 0.2);
    const total = subtotal + vatTotal;

    const existing = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (existing) {
      console.log(`Order ${o.orderNumber} already exists.`);
      continue;
    }

    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        status: o.status,
        email: o.email,
        fullName: o.fullName,
        phone: o.phone,
        customerType: o.customerType,
        companyName: o.companyName,
        taxOffice: o.taxOffice,
        taxNumber: o.taxNumber,
        billingCity: o.billingCity,
        billingDistrict: o.billingDistrict,
        billingLine1: o.billingLine1,
        subtotal,
        discount: 0,
        vatTotal,
        total,
        estimatedDays: o.estimatedDays,
        note: o.note,
        createdAt: o.createdAt,
        items: {
          create: [
            {
              productId: o.product.id,
              licenseId: license.id,
              productName: o.product.name,
              licenseName: license.name,
              unitPrice,
              quantity: 1,
              addOnTotal,
              lineTotal: subtotal,
              addOns: {
                create: o.addOns.map((a) => ({
                  addOnId: a.id,
                  name: a.name,
                  price: a.price,
                })),
              },
            },
          ],
        },
        payments: {
          create: [
            {
              provider: o.paymentMethod === "kart" ? "mock" : "havale",
              status: o.status === "bekliyor" ? "beklemede" : "basarili",
              amount: total,
              providerRef: `${o.paymentMethod}_${Math.random().toString(36).substring(2, 10)}`,
              installment: 1,
            },
          ],
        },
      },
    });
    console.log(`Created order ${o.orderNumber} for ${o.fullName}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
