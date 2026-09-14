import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/**
 * robots.txt — hesap, sepet, ödeme ve API yolları taramaya kapatılır.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/hesabim", "/sepet", "/odeme", "/siparis", "/api/", "/yonetim", "/giris", "/kayit"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
