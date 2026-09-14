/**
 * Referans (portföy) sitelerinin gerçek ekran görüntülerini alır.
 *
 * Sistemde kurulu Chrome/Edge'i kullanır; ayrıca tarayıcı indirmez.
 * Çıktı: public/gorseller/referanslar/<slug>-{masaustu,mobil}.jpg
 *
 * Kullanım:  node scripts/referans-gorselleri.mjs
 *
 * Not: Görseller müşteri sitelerinin kendi içerikleridir; portföy amacıyla
 * kullanılır. Site yayına alınmadan önce müşteri onayı alınmalıdır.
 */
import { chromium } from "playwright-core";
import { promises as fs } from "node:fs";
import path from "node:path";
import { existsSync } from "node:fs";

const CHROME_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

const SITES = [
  { slug: "zenitdent", url: "https://zenitdent.com/" },
  { slug: "atayeterdis", url: "https://atayeterdis.com/" },
  { slug: "urgendis", url: "https://urgendis.com/" },
  { slug: "gebzecapadis", url: "http://gebzecapadis.com/" },
  { slug: "kuruoglukerestecilik", url: "https://kuruoglukerestecilik.com/" },
  { slug: "marsaktesisat", url: "https://marsaktesisat.com/" },
  { slug: "birezonans", url: "https://birezonans.com/" },
  { slug: "kosuyolurezonans", url: "https://kosuyolurezonans.com/" },
  { slug: "drmurselyavuz", url: "https://drmurselyavuz.com/" },
  { slug: "meclinea", url: "https://meclinea.com/" },
  { slug: "offshoresirketkurulusu", url: "https://www.offshoresirketkurulusu.com/" },
];

const OUT = path.join(process.cwd(), "public", "gorseller", "referanslar");

/** Çerez/izin bandı gibi ekranı kapatan katmanları gizler. */
const HIDE_OVERLAYS = `
  const kill = [
    '[id*="cookie" i]','[class*="cookie" i]','[id*="cerez" i]','[class*="cerez" i]',
    '[class*="gdpr" i]','[id*="gdpr" i]','[class*="consent" i]','[id*="consent" i]',
    '[class*="popup" i]','[class*="modal" i][style*="block"]','[class*="whatsapp" i]',
    '.pum-overlay','#onetrust-consent-sdk'
  ];
  kill.forEach(sel => document.querySelectorAll(sel).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height > 40) el.style.display = 'none';
  }));
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
`;

async function main() {
  const executablePath = CHROME_PATHS.find((p) => existsSync(p));
  if (!executablePath) {
    console.error("Chrome/Edge bulunamadı. CHROME_PATHS listesine yolu ekleyin.");
    process.exit(1);
  }

  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath, headless: true });

  const results = [];

  for (const site of SITES) {
    for (const [suffix, viewport] of [
      ["masaustu", { width: 1440, height: 900 }],
      ["mobil", { width: 390, height: 780 }],
    ]) {
      const context = await browser.newContext({
        viewport,
        deviceScaleFactor: 2,
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      });
      const page = await context.newPage();
      try {
        await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 45000 });
        // Görsellerin ve yazı tiplerinin yerleşmesi için kısa bekleme
        await page.waitForTimeout(3500);
        await page.evaluate(HIDE_OVERLAYS);
        await page.waitForTimeout(600);

        const file = path.join(OUT, `${site.slug}-${suffix}.jpg`);
        await page.screenshot({ path: file, type: "jpeg", quality: 93 });
        results.push({ site: site.slug, suffix, ok: true });
        console.info(`✓ ${site.slug} (${suffix})`);
      } catch (error) {
        results.push({ site: site.slug, suffix, ok: false, error: String(error).slice(0, 80) });
        console.warn(`✗ ${site.slug} (${suffix}): ${String(error).slice(0, 80)}`);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  const ok = results.filter((r) => r.ok).length;
  console.info(`\nTamamlandı: ${ok}/${results.length} görsel alındı.`);
}

main();
