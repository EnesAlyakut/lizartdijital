import type { Metadata, Viewport } from "next";
import { Prompt, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteChrome, SiteFooter } from "@/components/layout/SiteChrome";
import { cartItemCount } from "@/lib/cart";
import { SITE } from "@/lib/constants";
import { prisma } from "@/lib/db";

const sans = Prompt({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-var",
  display: "swap",
});

/** Editoryal başlıklar ve vurgu kelimeleri için — Hakkımızda, Blog gibi sayfalarda kullanılır. */
const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-var",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo-kare.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#15171c",
  width: "device-width",
  initialScale: 1,
};

/** Organizasyon schema'sı — tüm sayfalarda geçerli. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  logo: `${SITE.url}/logo.svg?v=4`,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", streetAddress: SITE.address, addressCountry: "TR" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, announcement] = await Promise.all([
    cartItemCount(),
    getAnnouncement(),
  ]);

  return (
    <html lang="tr" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/logo-kare.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preload" as="image" href="/gorseller/hero/slide-1.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <a href="#icerik" className="skip-link">
          İçeriğe geç
        </a>
        <SiteChrome announcement={announcement} cartCount={cartCount} />
        <main id="icerik">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}

/** Duyuru bandı içeriği yönetim panelinden düzenlenen ayarlardan gelir. */
async function getAnnouncement() {
  try {
    const rows = await prisma.setting.findMany({
      where: { key: { in: ["announcement.text", "announcement.href", "announcement.active"] } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    if (map["announcement.active"] !== "true" || !map["announcement.text"]) return null;
    return { text: map["announcement.text"], href: map["announcement.href"] ?? "/magaza" };
  } catch {
    // Veritabanı henüz hazır değilse site yine de açılmalı.
    return null;
  }
}
