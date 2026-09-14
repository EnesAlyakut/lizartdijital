import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Demo görselleri: dış servise bağımlı kalmamak için proje içinde
 * deterministik SVG kapak görselleri üretilir. Gerçek projede bu dosyaların
 * yerine ürünün ekran görüntüleri yüklenir (public/gorseller/urunler/).
 */

const PALETTES: [string, string, string][] = [
  ["#0a994c", "#0b4f2e", "#d6fae2"],
  ["#12171a", "#2c3438", "#3ed57f"],
  ["#2563eb", "#0b2f6b", "#dbeafe"],
  ["#b4700a", "#5a3805", "#fdf0d5"],
  ["#0f766e", "#083f3b", "#ccfbf1"],
  ["#7c3aed", "#3b1580", "#ede9fe"],
  ["#e0453b", "#7a1f19", "#fee2e2"],
  ["#0891b2", "#054657", "#cffafe"],
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c]!,
  );
}

/** Ürün kapağı: tarayıcı çerçevesi içinde soyut bir arayüz taslağı. */
function coverSvg(title: string, subtitle: string, seed: string) {
  const [a, b, c] = PALETTES[hash(seed) % PALETTES.length];
  const rows = [72, 54, 88, 46];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <g transform="translate(80 96)">
    <rect width="640" height="408" rx="18" fill="#ffffff" opacity="0.97"/>
    <rect width="640" height="44" rx="18" fill="#f1f2f0"/>
    <rect y="30" width="640" height="14" fill="#f1f2f0"/>
    <circle cx="26" cy="22" r="6" fill="#d9dcd8"/><circle cx="48" cy="22" r="6" fill="#d9dcd8"/><circle cx="70" cy="22" r="6" fill="#d9dcd8"/>
    <rect x="104" y="14" width="220" height="16" rx="8" fill="#e7e9e5"/>
    <rect x="32" y="76" width="300" height="26" rx="8" fill="${b}" opacity="0.9"/>
    <rect x="32" y="116" width="220" height="14" rx="7" fill="#cfd4cf"/>
    <rect x="32" y="152" width="128" height="34" rx="17" fill="${c}"/>
    ${rows
      .map(
        (w, i) =>
          `<rect x="${32 + i * 152}" y="228" width="132" height="132" rx="14" fill="#f4f5f2"/>
       <rect x="${44 + i * 152}" y="244" width="${w}" height="12" rx="6" fill="${a}" opacity="0.55"/>
       <rect x="${44 + i * 152}" y="266" width="104" height="10" rx="5" fill="#dcdfda"/>
       <rect x="${44 + i * 152}" y="284" width="76" height="10" rx="5" fill="#e6e8e3"/>`,
      )
      .join("")}
  </g>
  <text x="80" y="556" font-family="system-ui,Segoe UI,Arial" font-size="26" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
  <text x="80" y="584" font-family="system-ui,Segoe UI,Arial" font-size="16" fill="#ffffff" opacity="0.78">${escapeXml(subtitle)}</text>
</svg>`;
}

/** Mobil ekran görüntüsü taslağı. */
function mobileSvg(title: string, seed: string) {
  const [a, b, c] = PALETTES[hash(seed + "m") % PALETTES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 780" width="390" height="780" role="img" aria-label="${escapeXml(title)} mobil görünüm">
  <rect width="390" height="780" rx="42" fill="${b}"/>
  <rect x="14" y="14" width="362" height="752" rx="32" fill="#ffffff"/>
  <rect x="150" y="26" width="90" height="18" rx="9" fill="#eceee9"/>
  <rect x="34" y="72" width="180" height="22" rx="8" fill="${a}"/>
  <rect x="34" y="106" width="240" height="12" rx="6" fill="#d8dbd6"/>
  <rect x="34" y="146" width="322" height="140" rx="16" fill="${c}"/>
  ${[0, 1, 2].map((i) => `<rect x="34" y="${312 + i * 92}" width="322" height="76" rx="14" fill="#f4f5f2"/><rect x="50" y="${332 + i * 92}" width="150" height="12" rx="6" fill="${a}" opacity="0.6"/><rect x="50" y="${354 + i * 92}" width="210" height="10" rx="5" fill="#dfe2dd"/>`).join("")}
  <rect x="34" y="604" width="322" height="48" rx="24" fill="${a}"/>
  <rect x="34" y="686" width="322" height="60" rx="18" fill="#f1f2ef"/>
</svg>`;
}

/** Genel amaçlı içerik görseli (blog, portföy, ekip). */
function contentSvg(title: string, seed: string, w = 1200, h = 675) {
  const [a, b, c] = PALETTES[hash(seed + "c") % PALETTES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${escapeXml(title)}">
  <defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#cg)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.3}" fill="${c}" opacity="0.22"/>
  <circle cx="${w * 0.2}" cy="${h * 0.82}" r="${h * 0.22}" fill="#ffffff" opacity="0.12"/>
  <text x="64" y="${h - 64}" font-family="system-ui,Segoe UI,Arial" font-size="${Math.round(w / 26)}" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
</svg>`;
}

const OUT = path.join(process.cwd(), "public", "gorseller");

async function write(rel: string, content: string) {
  const full = path.join(OUT, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
  return `/gorseller/${rel}`;
}

export async function generateProductImages(slug: string, title: string, subtitle: string) {
  const cover = await write(`urunler/${slug}-kapak.svg`, coverSvg(title, subtitle, slug));
  const desktop = await write(`urunler/${slug}-masaustu.svg`, coverSvg(title, "Masaüstü görünüm", slug + "1"));
  const tablet = await write(`urunler/${slug}-tablet.svg`, coverSvg(title, "Tablet görünüm", slug + "2"));
  const mobile = await write(`urunler/${slug}-mobil.svg`, mobileSvg(title, slug));
  const admin = await write(`urunler/${slug}-panel.svg`, coverSvg(title, "Yönetim paneli", slug + "3"));
  return { cover, desktop, tablet, mobile, admin };
}

export async function generateContentImage(folder: string, slug: string, title: string) {
  return write(`${folder}/${slug}.svg`, contentSvg(title, slug));
}

export async function generateSquareImage(folder: string, slug: string, title: string) {
  return write(`${folder}/${slug}.svg`, contentSvg(title, slug, 600, 600));
}
