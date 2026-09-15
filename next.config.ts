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
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Referans ekran görüntüleri ve zengin medya
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1200, 1440, 1920],
    imageSizes: [96, 128, 160, 224, 256, 384, 420],
    qualities: [75, 90, 92, 95],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/gorseller/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(svg|jpg|jpeg|png|webp|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
