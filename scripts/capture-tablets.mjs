import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

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

async function run() {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });

  for (const s of SITES) {
    const file = path.join(OUT, `${s.slug}-tablet.jpg`);
    if (fs.existsSync(file)) {
      console.log("Already exists:", s.slug);
      continue;
    }
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    try {
      await page.goto(s.url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: file, type: "jpeg", quality: 90 });
      console.log("✓ Captured:", s.slug);
    } catch (e) {
      console.error("✗ Error on", s.slug, e.message);
    } finally {
      await context.close();
    }
  }
  await browser.close();
  console.log("All done!");
}
run();
