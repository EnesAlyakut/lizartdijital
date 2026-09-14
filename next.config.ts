import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const removedAdminPages = [
      "blog-etiketleri",
      "seo",
      "musteriler",
      "ayarlar",
      "kullanicilar",
      "roller",
      "sistem",
      "kayitlar",
      "yedekleme",
      "profil",
    ];

    return removedAdminPages.flatMap((path) => [
      { source: `/admin/${path}`, destination: "/admin", permanent: false },
      { source: `/yonetim/${path}`, destination: "/admin", permanent: false },
    ]);
  },
  async rewrites() {
    return [
      { source: "/admin", destination: "/yonetim" },
      { source: "/admin/:path*", destination: "/yonetim/:path*" },
    ];
  },
  images: {
    // Referans ekran görüntüleri büyük JPEG'ler; modern formatlara dönüştürülüp
    // cihaz genişliğine göre küçültülerek sunulur.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [96, 128, 160, 224, 256, 384, 420],
    // İzin verilen kalite değerleri (Next 16 bunları açıkça ister).
    qualities: [75, 90, 92, 95],
    // Uzak kaynaklardan (Unsplash, harici URL vb.) eklenen görseller için izin
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // Optimize edilmiş görseller uzun süre önbellekte tutulur.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
