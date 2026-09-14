/**
 * generate-mockup-images.mjs
 * Ürün, portföy ve ajans sayfaları için zengin SVG mockup görselleri üretir.
 * Çalıştır: node scripts/generate-mockup-images.mjs
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "gorseller");

// ─── RENK PALETLERİ ────────────────────────────────────────────────────────

const THEMES = {
  green:    { bg1: "#0f3d1a", bg2: "#1a5c2b", accent: "#3ed57f", light: "#d6fae2", muted: "#88c4a0" },
  blue:     { bg1: "#0b1f4f", bg2: "#1a3670", accent: "#4a8fff", light: "#dbeafe", muted: "#7aadee" },
  purple:   { bg1: "#2d1b69", bg2: "#4a2b99", accent: "#a78bfa", light: "#ede9fe", muted: "#b49ef5" },
  teal:     { bg1: "#083f3b", bg2: "#0f6b64", accent: "#2dd4bf", light: "#ccfbf1", muted: "#5db8b2" },
  amber:    { bg1: "#5a3805", bg2: "#92600d", accent: "#f59e0b", light: "#fdf0d5", muted: "#e0b860" },
  red:      { bg1: "#7a1f19", bg2: "#a82e26", accent: "#ef4444", light: "#fee2e2", muted: "#e88080" },
  cyan:     { bg1: "#054657", bg2: "#0a7a96", accent: "#06b6d4", light: "#cffafe", muted: "#60c8d8" },
  rose:     { bg1: "#5c0a2e", bg2: "#8c1744", accent: "#f43f5e", light: "#ffe4e6", muted: "#e87090" },
  dark:     { bg1: "#141414", bg2: "#1f1f2e", accent: "#818cf8", light: "#e0e7ff", muted: "#9099d8" },
  olive:    { bg1: "#2a3010", bg2: "#3d4520", accent: "#a3b826", light: "#ecf0c0", muted: "#b8c45a" },
};

// ─── YARDIMCI FONKSİYONLAR ─────────────────────────────────────────────────

function r(x, y, w, h, rx, fill, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${opacity < 1 ? `opacity="${opacity}"` : ""}/>`;
}
function c(cx, cy, radius, fill, opacity = 1) {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" ${opacity < 1 ? `opacity="${opacity}"` : ""}/>`;
}
function t(x, y, text, size, fill, weight = "normal", opacity = 1) {
  return `<text x="${x}" y="${y}" font-family="system-ui,Segoe UI,Arial" font-size="${size}" font-weight="${weight}" fill="${fill}" ${opacity < 1 ? `opacity="${opacity}"` : ""}>${text}</text>`;
}
function line(x1, y1, x2, y2, stroke, strokeWidth = 1, opacity = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" ${opacity < 1 ? `opacity="${opacity}"` : ""}/>`;
}

// ─── UI BILEŞEN FONKSİYONLARI ──────────────────────────────────────────────

/** Tarayıcı başlık çubuğu */
function browserBar(w, theme) {
  const bx = w - 100;
  return `
    ${r(0, 0, w, 44, 0, "#f0f0ef")}
    ${r(0, 36, w, 8, 0, "#f0f0ef")}
    ${c(22, 22, 6, "#ff5f57")}
    ${c(42, 22, 6, "#febc2e")}
    ${c(62, 22, 6, "#28c840")}
    ${r(90, 12, 280, 20, 10, "#e2e2e0")}
    ${r(108, 18, 180, 8, 4, "#d0d0ce")}
    ${r(bx, 12, 80, 20, 10, "#e2e2e0")}
  `;
}

/** Nav bar (simge menü) */
function navBar(w, theme) {
  const nb1 = w - 150;
  const nb2 = w - 40;
  return `
    ${r(0, 0, w, 56, 0, "#ffffff")}
    ${r(20, 16, 80, 24, 6, theme.bg1)}
    ${r(150, 20, 60, 16, 4, "#e8e8e8")}
    ${r(220, 20, 60, 16, 4, "#e8e8e8")}
    ${r(290, 20, 60, 16, 4, "#e8e8e8")}
    ${r(nb1, 14, 100, 28, 14, theme.accent)}
    ${r(nb2, 14, 26, 28, 14, "#f0f0ef")}
  `;
}

/** Basit kart */
function card(x, y, w, h, theme, title = "", sub = "") {
  return `
    ${r(x, y, w, h, 12, "#ffffff")}
    ${r(x, y, w, h * 0.55, 12, theme.light)}
    ${r(x, y + h * 0.55 - 4, w, 4, 0, "#e8e8e8")}
    ${r(x + 16, y + h * 0.6, w * 0.7, 14, 4, "#d4d4d4")}
    ${r(x + 16, y + h * 0.75, w * 0.5, 10, 3, "#e4e4e4")}
    ${r(x + 16, y + h * 0.85, 70, 24, 12, theme.accent)}
  `;
}

/** Stat kutusu */
function statBox(x, y, w, h, value, label, theme) {
  return `
    ${r(x, y, w, h, 10, "#ffffff")}
    ${t(x + 14, y + h * 0.5, value, 22, theme.bg1, "700")}
    ${t(x + 14, y + h * 0.75, label, 11, "#888888")}
    ${r(x + w - 46, y + 12, 34, 34, 8, theme.light)}
    ${r(x + w - 38, y + 22, 18, 4, 2, theme.accent)}
    ${r(x + w - 38, y + 30, 12, 4, 2, theme.muted)}
  `;
}

/** Chart çubuğu */
function barChart(x, y, w, h, theme) {
  const bars = [0.4, 0.7, 0.5, 0.9, 0.65, 0.8, 0.55];
  const bw = Math.floor(w / bars.length) - 6;
  return bars.map((v, i) => {
    const bh = Math.round(h * v);
    return `
      ${r(x + i * (bw + 6), y + h - bh, bw, bh, 4, i === 3 ? theme.accent : theme.light)}
    `;
  }).join("");
}

/** Çizgi grafik */
function lineChart(x, y, w, h, theme) {
  const pts = [0.6, 0.4, 0.7, 0.5, 0.8, 0.65, 0.9];
  const step = w / (pts.length - 1);
  const coords = pts.map((v, i) => `${x + i * step},${y + h - h * v}`).join(" ");
  return `<polyline points="${coords}" fill="none" stroke="${theme.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${x},${y + h} ${coords} ${x + w},${y + h}" fill="${theme.accent}" fill-opacity="0.1" stroke="none"/>
    ${pts.map((v, i) => c(x + i * step, y + h - h * v, 4, theme.accent)).join("")}
  `;
}

/** Tablo satırı */
function tableRow(x, y, w, isHeader, theme) {
  return `
    ${r(x, y, w, 32, 0, isHeader ? theme.light : (Math.floor(y / 32) % 2 === 0 ? "#f9f9f9" : "#ffffff"))}
    ${r(x + 12, y + 10, 80, 12, 3, isHeader ? theme.muted + "44" : "#e4e4e4")}
    ${r(x + 130, y + 10, 60, 12, 3, "#e4e4e4")}
    ${r(x + 220, y + 10, 50, 12, 3, "#e4e4e4")}
    ${r(x + w - 90, y + 10, 60, 12, 3, isHeader ? theme.muted + "44" : theme.light)}
  `;
}

/** Takvim grid */
function calendarGrid(x, y, theme) {
  const days = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
  let out = `${r(x, y, 280, 220, 12, "#ffffff")}`;
  out += `${r(x, y, 280, 36, 12, theme.light)}`;
  out += `${r(x, y + 24, 280, 12, 0, theme.light)}`;
  out += `${t(x + 90, y + 22, "Eylül 2026", 13, theme.bg1, "600")}`;
  days.forEach((d, i) => {
    out += `${t(x + 10 + i * 38, y + 54, d, 10, "#aaaaaa")}`;
  });
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const day = row * 7 + col + 1;
      if (day > 30) continue;
      const cx = x + 10 + col * 38 + 14;
      const cy = y + 70 + row * 30 + 14;
      if (day === 15) {
        out += `${c(cx, cy, 13, theme.accent)}`;
        out += `${t(cx - 7, cy + 5, day.toString().padStart(2, "0"), 11, "#ffffff", "700")}`;
      } else if ([8, 12, 20].includes(day)) {
        out += `${c(cx, cy, 13, theme.light)}`;
        out += `${t(cx - 7, cy + 5, day.toString().padStart(2, "0"), 11, theme.bg1)}`;
      } else {
        out += `${t(cx - 7, cy + 5, day.toString().padStart(2, "0"), 11, day > 30 ? "#dddddd" : "#555555")}`;
      }
    }
  }
  return out;
}

/** Avatar listesi */
function avatarList(x, y, theme, count = 4) {
  const colors = [theme.accent, theme.light, theme.muted, "#e8e8e8"];
  return Array.from({ length: count }, (_, i) =>
    `${c(x + i * 36, y, 16, colors[i % colors.length])}
     ${r(x + i * 36 + 20, y - 6, 80, 10, 3, "#e8e8e8")}
     ${r(x + i * 36 + 20, y + 8, 50, 8, 3, "#eeeeee")}`
  ).join("");
}

/** Ürün listesi kartı (e-ticaret) */
function productGrid(x, y, w, h, theme, cols = 3) {
  const cw = Math.floor((w - (cols - 1) * 12) / cols);
  return Array.from({ length: cols * 2 }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const px = x + col * (cw + 12);
    const py = y + row * (h / 2 + 8);
    const imgH = Math.floor(h / 2 * 0.55);
    return `
      ${r(px, py, cw, h / 2, 10, "#ffffff")}
      ${r(px, py, cw, imgH, 10, theme.light)}
      ${c(px + cw / 2, py + imgH / 2, imgH * 0.3, theme.muted, 0.5)}
      ${r(px + 10, py + imgH + 8, cw * 0.8, 10, 3, "#d4d4d4")}
      ${r(px + 10, py + imgH + 24, cw * 0.5, 8, 3, "#e8e8e8")}
      ${r(px + 10, py + imgH + 38, cw * 0.4, 18, 9, theme.accent)}
    `;
  }).join("");
}

/** Harita placeholder */
function mapPlaceholder(x, y, w, h, theme) {
  return `
    ${r(x, y, w, h, 10, "#e8ede8")}
    ${r(x + w * 0.2, y + h * 0.15, w * 0.6, 1, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.2, y + h * 0.35, w * 0.6, 1, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.2, y + h * 0.55, w * 0.6, 1, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.2, y + h * 0.75, w * 0.6, 1, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.25, y + h * 0.15, 1, h * 0.65, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.5, y + h * 0.15, 1, h * 0.65, 0, "#c8d0c8", 0.5)}
    ${r(x + w * 0.75, y + h * 0.15, 1, h * 0.65, 0, "#c8d0c8", 0.5)}
    ${c(x + w * 0.5, y + h * 0.45, 12, theme.accent)}
    ${c(x + w * 0.5, y + h * 0.45, 6, "#ffffff")}
    ${r(x + w * 0.4, y + h * 0.6, w * 0.2, h * 0.12, 4, "#ffffff")}
    ${t(x + w * 0.5 - 30, y + h * 0.72, "Gebze / Kocaeli", 8, "#555555")}
  `;
}

/** Video oynatıcı */
function videoPlayer(x, y, w, h, theme) {
  return `
    ${r(x, y, w, h, 10, "#1a1a2e")}
    ${c(x + w / 2, y + h / 2 - 10, h * 0.25, theme.accent, 0.2)}
    <polygon points="${x + w / 2 - 10},${y + h / 2 - 22} ${x + w / 2 + 18},${y + h / 2 - 10} ${x + w / 2 - 10},${y + h / 2 + 2}" fill="${theme.accent}"/>
    ${r(x, y + h - 32, w, 32, 0, "#000000", 0.5)}
    ${r(x + 12, y + h - 20, w * 0.6, 4, 2, theme.accent)}
    ${r(x + w * 0.6 + 12, y + h - 20, w * 0.3, 4, 2, "#444444")}
  `;
}

/** Menü (restoran) */
function menuCard(x, y, w, theme) {
  const items = ["Mercimek Çorbası", "Izgara Tavuk", "Levrek Fileto", "Cheesecake"];
  const prices = ["₺95", "₺220", "₺310", "₺150"];
  let out = `${r(x, y, w, 220, 12, "#ffffff")}`;
  out += `${t(x + 16, y + 26, "Menümüz", 14, theme.bg1, "700")}`;
  items.forEach((item, i) => {
    out += `${r(x, y + 40 + i * 44, w, 44, 0, i % 2 === 0 ? "#f9f9f9" : "#ffffff")}`;
    out += `${c(x + 22, y + 62 + i * 44, 12, theme.light)}`;
    out += `${t(x + 44, y + 66 + i * 44, item, 12, "#333333")}`;
    out += `${t(x + w - 60, y + 66 + i * 44, prices[i], 12, theme.accent, "600")}`;
  });
  return out;
}

/** Randevu takvim satırı */
function appointmentSlot(x, y, w, time, status, theme) {
  const colors = { boş: "#e8e8e8", dolu: theme.light, bekliyor: theme.accent + "33" };
  return `
    ${r(x, y, w, 38, 6, colors[status] || "#e8e8e8")}
    ${r(x, y, 4, 38, 6, status === "dolu" ? theme.accent : "#cccccc")}
    ${t(x + 14, y + 24, time, 11, "#555555")}
    ${status === "dolu" ? `${r(x + 80, y + 10, 80, 18, 9, theme.accent + "44")}${t(x + 90, y + 22, "Randevulu", 10, theme.bg1)}` : ""}
  `;
}

// ─── SAYFA TEMPLATE'LERİ ───────────────────────────────────────────────────

function makeHeroSection(w, h, theme, title, subtitle) {
  return `
    ${r(0, 0, w, h, 0, `url(#bg)`)}
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="100%" stop-color="${theme.bg2}"/>
      </linearGradient>
    </defs>
    ${c(w * 0.75, h * 0.35, h * 0.4, theme.accent, 0.06)}
    ${c(w * 0.9, h * 0.7, h * 0.25, theme.light, 0.05)}
    ${t(40, h * 0.38, title, Math.round(w / 22), "#ffffff", "700")}
    ${t(40, h * 0.54, subtitle, Math.round(w / 40), "#ffffff", "normal", 0.75)}
    ${r(40, h * 0.62, 120, 36, 18, theme.accent)}
    ${t(58, h * 0.62 + 23, "Başla →", 13, "#ffffff", "600")}
    ${r(180, h * 0.62, 100, 36, 18, "transparent")}
  `;
}

// ─── ÜRÜN MOCKUP ŞABLONLARı ────────────────────────────────────────────────

const PRODUCT_TEMPLATES = {

  "atlas-kurumsal-web-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 112, 760, 180, 0, theme.light, 0.3)}
    ${t(44, 158, "Kurumsal", 32, theme.bg1, "800")}
    ${t(44, 194, "Çözümler", 32, theme.accent, "800")}
    ${t(44, 225, "Profesyonel hizmetler, güvenilir iş ortaklığı.", 13, "#666666")}
    ${r(44, 244, 120, 34, 17, theme.accent)}
    ${r(550, 120, 200, 150, 12, theme.light)}
    ${c(650, 195, 50, theme.muted, 0.4)}
    ${[0,1,2].map(i => `${r(20 + i * 254, 320, 240, 130, 10, "#ffffff")}
      ${r(20 + i * 254, 320, 240, 50, 10, [theme.accent, theme.light, theme.muted][i], 0.3)}
      ${r(34 + i * 254, 384, 120, 12, 4, "#d4d4d4")}
      ${r(34 + i * 254, 404, 80, 10, 4, "#e4e4e4")}`).join("")}
  `,

  "vitrin-eticaret-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 760, 44, 0, "#f8f8f8")}
    ${r(44, 110, 50, 24, 4, "#eeeeee")}
    ${r(104, 110, 50, 24, 4, "#eeeeee")}
    ${r(164, 110, 70, 24, 4, "#eeeeee")}
    ${r(244, 110, 60, 24, 4, theme.accent, 0.2)}
    ${productGrid(20, 150, 760, 160, theme, 4)}
    ${r(20, 440, 760, 36, 0, theme.bg1)}
    ${t(44, 462, "© 2026 Vitrin Mağaza | Ücretsiz Kargo | Güvenli Ödeme", 11, "#aaaaaa")}
  `,

  "sofra-restoran-web-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 760, 160, 0, theme.light, 0.4)}
    ${c(650, 180, 70, theme.muted, 0.3)}
    ${t(44, 148, "Sofra Restaurant", 28, theme.bg1, "800")}
    ${t(44, 176, "Geleneksel lezzetler, modern sunum.", 13, "#666666")}
    ${r(44, 196, 110, 32, 16, theme.accent)}
    ${t(60, 216, "Rezervasyon", 11, "#ffffff", "600")}
    ${menuCard(20, 280, 360, theme)}
    ${r(400, 280, 380, 220, 12, "#f9f9f9")}
    ${t(420, 308, "Bugünün Özel Menüsü", 13, theme.bg1, "700")}
    ${c(580, 380, 60, theme.light)}
    ${t(545, 384, "🍽", 40, "#ffffff")}
    ${r(400, 460, 380, 36, 0, theme.bg1)}
    ${t(490, 482, "📍 Gebze Merkez | 🕐 09:00 – 23:00", 11, "#aaaaaa")}
  `,

  "medica-klinik-web-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 500, 180, 0, theme.light, 0.25)}
    ${t(44, 140, "Sağlıklı Yarınlar İçin", 24, theme.bg1, "800")}
    ${t(44, 168, "Online randevu — 7/24 hizmet", 13, "#666666")}
    ${r(44, 186, 140, 34, 17, theme.accent)}
    ${t(62, 207, "Randevu Al", 12, "#ffffff", "600")}
    ${r(520, 100, 260, 180, 12, "#f0f8f4")}
    ${[0, 1, 2].map(i => appointmentSlot(536, 116 + i * 48, 228, ["09:00", "10:30", "13:00"][i], ["dolu", "boş", "dolu"][i], theme)).join("")}
    ${r(20, 300, 760, 1, 0, "#eeeeee")}
    ${[0,1,2,3].map(i => `${r(20 + i * 192, 316, 178, 120, 10, "#f9f9f9")}
      ${c(109 + i * 192, 356, 24, theme.light)}
      ${r(44 + i * 192, 392, 110, 12, 4, "#d4d4d4")}
      ${r(44 + i * 192, 410, 80, 9, 4, "#e8e8e8")}`).join("")}
  `,

  "arsa-emlak-portali": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 760, 60, 0, theme.light, 0.3)}
    ${r(36, 114, 320, 32, 16, "#ffffff")}
    ${r(52, 120, 200, 20, 10, "#eeeeee")}
    ${r(370, 114, 100, 32, 16, theme.accent)}
    ${t(392, 133, "Ara 🔍", 12, "#ffffff", "600")}
    ${mapPlaceholder(20, 168, 420, 280, theme)}
    ${r(452, 168, 328, 280, 12, "#ffffff")}
    ${t(468, 194, "Son İlanlar", 14, theme.bg1, "700")}
    ${[0,1,2,3].map(i => `${r(452, 208 + i * 58, 328, 52, 8, i % 2 === 0 ? "#f9f9f9" : "#ffffff")}
      ${r(452, 208 + i * 58, 52, 52, 8, theme.light)}
      ${c(478, 234 + i * 58, 14, theme.muted, 0.4)}
      ${r(518, 218 + i * 58, 140, 10, 3, "#d4d4d4")}
      ${r(518, 234 + i * 58, 100, 8, 3, "#e8e8e8")}
      ${t(640, 245 + i * 58, ["₺2.4M", "₺1.8M", "₺3.1M", "₺950K"][i], 12, theme.accent, "700")}`).join("")}
  `,

  "marina-otel-rezervasyon-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#1a2a3a")}
    ${r(20, 56, 760, 200, 0, theme.bg1)}
    ${c(680, 160, 80, theme.accent, 0.1)}
    ${t(44, 130, "Marina Butik Otel", 26, "#ffffff", "800")}
    ${t(44, 158, "Deniz manzaralı konaklama — Kocaeli", 13, "#aaaacc")}
    ${r(44, 176, 340, 52, 10, "#ffffff")}
    ${r(60, 188, 90, 28, 6, "#f5f5f5")}
    ${r(162, 188, 90, 28, 6, "#f5f5f5")}
    ${r(264, 188, 90, 28, 6, theme.accent)}
    ${r(20, 272, 760, 204, 0, "#f9fafb")}
    ${[0,1,2].map(i => `${r(20 + i * 256, 288, 240, 170, 12, "#ffffff")}
      ${r(20 + i * 256, 288, 240, 80, 12, theme.light, 0.5)}
      ${c(140 + i * 256, 328, 30, theme.muted, 0.3)}
      ${r(44 + i * 256, 380, 140, 13, 4, "#d4d4d4")}
      ${r(44 + i * 256, 400, 80, 10, 4, "#e8e8e8")}
      ${t(44 + i * 256, 440, ["₺2.800", "₺3.400", "₺4.200"][i] + "/gece", 12, theme.accent, "700")}`).join("")}
  `,

  "akademi-egitim-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 480, 160, 0, theme.light, 0.25)}
    ${t(44, 138, "Online Eğitim", 28, theme.bg1, "800")}
    ${t(44, 168, "Kendi hızınızda, kendi zamanınızda öğrenin.", 13, "#666666")}
    ${r(44, 186, 120, 32, 16, theme.accent)}
    ${t(60, 206, "Kurslara Bak", 11, "#ffffff", "600")}
    ${videoPlayer(512, 100, 268, 160, theme)}
    ${r(20, 282, 760, 1, 0, "#eeeeee")}
    ${[0,1,2,3].map(i => `${r(20 + i * 192, 298, 178, 120, 10, "#f9f9f9")}
      ${r(20 + i * 192, 298, 178, 60, 10, theme.light, 0.4)}
      ${r(20 + i * 192 + 14, 372, 120, 11, 4, "#d4d4d4")}
      ${r(20 + i * 192 + 14, 390, 80, 9, 4, "#e8e8e8")}
      ${r(20 + i * 192 + 14, 405, 60, 20, 10, theme.accent, 0.8)}`).join("")}
  `,

  "gundem-haber-portali": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 760, 36, 0, "#f00", 0.06)}
    ${t(44, 122, "● SON DAKİKA:", 11, "#cc0000", "700")}
    ${t(130, 122, "Gündem gelişmeleri takipte...", 11, "#333333")}
    ${r(20, 140, 500, 220, 10, theme.light, 0.2)}
    ${c(270, 250, 70, theme.muted, 0.3)}
    ${r(20, 140, 500, 28, 0, theme.bg1, 0.8)}
    ${t(32, 158, "Manşet Haberi", 13, "#ffffff", "700")}
    ${r(32, 172, 460, 12, 4, "#ffffff", 0.3)}
    ${r(32, 192, 380, 12, 4, "#ffffff", 0.2)}
    ${r(32, 332, 460, 24, 12, theme.accent, 0.9)}
    ${r(534, 140, 246, 220, 10, "#f9f9f9")}
    ${[0,1,2,3].map(i => `${r(534, 140 + i * 55, 246, 52, 0, i % 2 === 0 ? "#f9f9f9" : "#ffffff")}
      ${r(534, 140 + i * 55, 46, 52, 0, theme.light, 0.4)}
      ${r(596, 152 + i * 55, 170, 11, 4, "#d4d4d4")}
      ${r(596, 169 + i * 55, 120, 9, 4, "#e4e4e4")}`).join("")}
    ${r(20, 380, 760, 50, 0, "#f5f5f5")}
    ${["Siyaset", "Ekonomi", "Spor", "Teknoloji", "Dünya"].map((k, i) => `${r(30 + i * 148, 394, 130, 24, 8, "#ffffff")}${t(46 + i * 148, 410, k, 11, "#444444")}`).join("")}
  `,

  "studyo-portfoy-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#111111")}
    ${r(20, 56, 760, 60, 0, "#1a1a1a")}
    ${t(44, 94, "STÜDYO", 18, "#ffffff", "800")}
    ${r(480, 68, 80, 32, 16, "#333333")}
    ${r(572, 68, 100, 32, 16, theme.accent)}
    ${t(580, 87, "İletişim →", 12, "#ffffff", "600")}
    ${r(20, 116, 760, 280, 0, "#0a0a0a")}
    ${[0,1,2].map(i => `${r(20 + i * 256, 116, 248, 190, 0, ["#1a1a2e", "#2d1b1b", "#1a2a1a"][i])}
      ${c(144 + i * 256, 211, 50, theme.accent, 0.2)}`).join("")}
    ${r(20, 304, 760, 160, 0, "#111111")}
    ${[0,1,2,3].map(i => `${r(20 + i * 192, 316, 178, 130, 0, "#1c1c1c")}
      ${r(34 + i * 192, 332, 100, 70, 4, "#2a2a2a")}
      ${r(34 + i * 192, 412, 110, 11, 4, "#333333")}
      ${r(34 + i * 192, 430, 70, 9, 4, "#2a2a2a")}`).join("")}
  `,

  "donusum-landing-page-seti": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 240, 0, theme.bg1)}
    ${c(650, 176, 100, theme.accent, 0.1)}
    ${c(200, 220, 60, theme.light, 0.05)}
    ${t(44, 130, "Büyümeniz İçin", 30, "#ffffff", "800")}
    ${t(44, 162, "En hızlı dönüşümü bu sayfa sağlar.", 14, "#aaaacc")}
    ${r(44, 182, 360, 60, 10, "#ffffff", 0.1)}
    ${r(60, 194, 240, 36, 8, "#ffffff")}
    ${r(60, 196, 20, 32, 4, "#eeeeee")}
    ${t(90, 217, "E-posta adresiniz", 11, "#aaaaaa")}
    ${r(312, 194, 100, 36, 18, theme.accent)}
    ${t(328, 216, "Hemen Al", 11, "#ffffff", "700")}
    ${r(20, 296, 760, 1, 0, "#eeeeee")}
    ${[0,1,2].map(i => `
      ${r(20 + i * 256, 312, 240, 140, 10, "#f9f9f9")}
      ${r(20 + i * 256, 312, 240, 48, 10, theme.light, 0.3)}
      ${c(140 + i * 256, 336, 16, theme.accent, 0.5)}
      ${r(44 + i * 256, 374, 160, 13, 4, "#d4d4d4")}
      ${r(44 + i * 256, 394, 120, 10, 4, "#e4e4e4")}
    `).join("")}
  `,

  "zaman-randevu-sitesi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 112, 340, 60, 0, theme.light, 0.2)}
    ${t(44, 148, "Randevunuzu Alın", 22, theme.bg1, "800")}
    ${t(44, 172, "Personel ve hizmet seçin, anında onaylayın.", 12, "#666666")}
    ${calendarGrid(20, 196, theme)}
    ${r(320, 196, 460, 224, 12, "#f9f9f9")}
    ${t(336, 222, "Müsait Saatler", 13, theme.bg1, "700")}
    ${[0,1,2,3,4].map(i => appointmentSlot(336, 234 + i * 46, 428, [`${9 + i}:00`, `${9 + i}:30`][i % 2], ["dolu", "boş", "dolu", "bekliyor", "boş"][i], theme)).join("")}
    ${r(320, 432, 460, 44, 0, "#f0f0f0")}
    ${r(450, 442, 200, 24, 12, theme.accent)}
    ${t(490, 458, "Randevu Onayla →", 11, "#ffffff", "600")}
  `,

  "pazar-cok-saticili-pazaryeri": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 112, 760, 40, 0, theme.light, 0.3)}
    ${r(36, 120, 500, 24, 12, "#ffffff")}
    ${r(52, 124, 360, 16, 8, "#eeeeee")}
    ${r(548, 116, 80, 32, 8, theme.accent)}
    ${r(20, 158, 180, 310, 10, "#f9f9f9")}
    ${t(36, 182, "Kategoriler", 13, theme.bg1, "700")}
    ${["Elektronik", "Giyim", "Ev", "Kozmetik", "Spor", "Kitap"].map((k, i) => `${r(28, 194 + i * 40, 160, 32, 6, i === 0 ? theme.light : "#ffffff")}
      ${r(28, 194 + i * 40, 3, 32, 0, i === 0 ? theme.accent : "#e0e0e0")}
      ${t(40, 214 + i * 40, k, 11, "#444444")}`).join("")}
    ${productGrid(210, 158, 570, 140, theme, 3)}
    ${r(20, 440, 760, 36, 0, theme.bg1, 0.9)}
    ${t(44, 461, "Pazar — Güvenli Alışveriş Platformu", 11, "#aaaaaa")}
  `,

  "sepetim-eticaret-mobil-uygulamasi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 240, 370, 12, "#f5f5f5")}
    ${t(44, 128, "Uygulama Görünümleri", 12, theme.bg1, "700")}
    ${[0,1].map(i => `${r(36 + i * 112, 140, 100, 200, 20, i === 0 ? theme.bg1 : "#333333")}
      ${r(46 + i * 112, 150, 80, 16, 8, i === 0 ? theme.accent : "#555555", 0.5)}
      ${r(46 + i * 112, 178, 80, 100, 8, i === 0 ? theme.light : "#444444", 0.3)}
      ${r(46 + i * 112, 286, 80, 24, 12, theme.accent, i === 0 ? 1 : 0.5)}`).join("")}
    ${r(276, 100, 504, 370, 12, "#ffffff")}
    ${t(296, 128, "Özellikler", 12, theme.bg1, "700")}
    ${[0,1,2,3,4,5].map(i => `${r(296, 142 + i * 52, 460, 44, 8, "#f9f9f9")}
      ${c(318, 164 + i * 52, 12, theme.accent, 0.3)}
      ${r(340, 156 + i * 52, 200, 11, 4, "#d4d4d4")}
      ${r(340, 172 + i * 52, 140, 9, 4, "#e4e4e4")}`).join("")}
  `,

  "hizli-siparis-restoran-uygulamasi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 80, 0, theme.bg1)}
    ${t(44, 98, "Hızlı Sipariş", 22, "#ffffff", "800")}
    ${t(44, 118, "QR okut, seç, öde — 3 adımda sipariş", 12, "#aaaacc")}
    ${r(20, 136, 380, 340, 10, "#f9f9f9")}
    ${menuCard(20, 136, 380, theme)}
    ${r(412, 136, 368, 340, 10, "#ffffff")}
    ${t(428, 160, "Sepetim", 14, theme.bg1, "700")}
    ${[0,1,2].map(i => `${r(428, 172 + i * 64, 336, 56, 8, "#f9f9f9")}
      ${r(428, 172 + i * 64, 56, 56, 8, theme.light, 0.5)}
      ${r(496, 184 + i * 64, 140, 11, 4, "#d4d4d4")}
      ${r(496, 200 + i * 64, 100, 9, 4, "#e4e4e4")}
      ${t(690, 204 + i * 64, ["₺95", "₺220", "₺310"][i], 12, theme.accent, "700")}`).join("")}
    ${r(428, 368, 336, 52, 10, theme.accent)}
    ${t(520, 398, "Siparişi Tamamla — ₺625", 13, "#ffffff", "700")}
  `,

  "randevum-mobil-uygulamasi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#f5f5f5")}
    ${navBar(760, theme)}
    ${r(20, 112, 280, 364, 16, "#ffffff")}
    ${t(40, 140, "Randevu Uygulaması", 13, theme.bg1, "700")}
    ${r(36, 152, 248, 300, 16, theme.bg1)}
    ${r(46, 162, 228, 28, 10, theme.accent, 0.3)}
    ${[0,1,2,3].map(i => `${r(46, 202 + i * 58, 228, 50, 10, "#ffffff", 0.1)}
      ${c(68, 227 + i * 58, 14, theme.accent, 0.5)}
      ${r(90, 219 + i * 58, 130, 10, 4, "#ffffff", 0.4)}
      ${r(90, 234 + i * 58, 90, 8, 4, "#ffffff", 0.2)}`).join("")}
    ${r(314, 112, 466, 364, 12, "#ffffff")}
    ${t(334, 138, "Hizmetlerimiz", 14, theme.bg1, "700")}
    ${calendarGrid(334, 150, theme)}
    ${r(334, 388, 446, 80, 10, "#f9f9f9")}
    ${r(350, 400, 200, 56, 10, theme.accent, 0.15)}
    ${r(564, 400, 200, 56, 10, "#eeeeee")}
  `,

  "formda-fitness-uygulamasi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#111111")}
    ${r(20, 56, 760, 100, 0, theme.bg1)}
    ${c(700, 106, 60, theme.accent, 0.15)}
    ${t(44, 100, "FORMDA", 24, "#ffffff", "900")}
    ${t(44, 120, "Fitness & Wellness App", 12, theme.accent)}
    ${r(20, 156, 200, 320, 12, "#1a1a1a")}
    ${[0,1,2,3,4].map(i => `${r(30, 168 + i * 60, 180, 50, 10, "#222222")}
      ${r(30, 168 + i * 60, 4, 50, 0, theme.accent)}
      ${r(44, 180 + i * 60, 120, 12, 4, "#333333")}
      ${r(44, 198 + i * 60, 80, 9, 4, "#2a2a2a")}
      ${r(168, 178 + i * 60, 32, 30, 6, theme.accent, 0.2)}`).join("")}
    ${r(232, 156, 548, 320, 12, "#181818")}
    ${t(252, 182, "Haftalık Antrenman", 14, "#ffffff", "700")}
    ${barChart(252, 196, 508, 100, theme)}
    ${r(252, 316, 508, 1, 0, "#333333")}
    ${[0,1,2,3].map(i => `${statBox(252 + i * 128, 328, 116, 80, ["248", "12k", "2.4", "87%"][i], ["Kalori", "Adım", "Saat", "Hedef"][i], theme)}`).join("")}
  `,

  "hasta-takip-sistemi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 180, 420, 0, "#f8f9fa")}
    ${t(36, 88, "📋 Hasta Takip", 13, theme.bg1, "700")}
    ${["Hastalar", "Randevular", "Tahliller", "Raporlar"].map((m, i) => `${r(28, 100 + i * 44, 164, 36, 8, i === 0 ? theme.light : "#ffffff")}
      ${r(28, 100 + i * 44, 3, 36, 0, i === 0 ? theme.accent : "#e0e0e0")}
      ${t(44, 122 + i * 44, m, 12, "#444444")}`).join("")}
    ${r(200, 56, 580, 420, 0, "#ffffff")}
    ${r(200, 56, 580, 56, 0, "#f8f9fa")}
    ${t(220, 88, "Hasta Listesi", 14, theme.bg1, "700")}
    ${r(560, 68, 120, 32, 16, theme.accent)}
    ${t(574, 88, "+ Yeni Hasta", 11, "#ffffff", "600")}
    ${[0,1,2,3,4].map(i => `${r(200, 112 + i * 56, 580, 52, 0, i % 2 === 0 ? "#f9f9f9" : "#ffffff")}
      ${c(224, 138 + i * 56, 16, theme.light)}
      ${r(250, 128 + i * 56, 130, 12, 4, "#d4d4d4")}
      ${r(250, 146 + i * 56, 90, 9, 4, "#e4e4e4")}
      ${r(400, 130 + i * 56, 80, 16, 8, theme.light, 0.5)}
      ${r(680, 128 + i * 56, 80, 24, 12, "#eeeeee")}`).join("")}
  `,

  "pusula-crm-sistemi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 200, 420, 0, theme.bg1)}
    ${t(36, 90, "PUSULA", 16, "#ffffff", "800")}
    ${t(36, 110, "CRM", 11, theme.accent)}
    ${["Müşteriler", "Fırsatlar", "Görevler", "Raporlar", "Ayarlar"].map((m, i) => `${r(24, 126 + i * 48, 192, 40, 8, i === 1 ? theme.accent + "33" : "#ffffff", i === 1 ? 1 : 0.05)}
      ${r(24, 126 + i * 48, 3, 40, 0, i === 1 ? theme.accent : "#ffffff", 0.1)}
      ${t(44, 150 + i * 48, m, 12, "#ffffff", "normal", i === 1 ? 1 : 0.7)}`).join("")}
    ${r(220, 56, 560, 420, 0, "#ffffff")}
    ${r(220, 56, 560, 60, 0, "#f8f9fa")}
    ${t(240, 92, "Satış Hattı", 14, theme.bg1, "700")}
    ${[0,1,2,3].map(i => `${r(220 + i * 140, 124, 132, 300, 8, "#f5f5f5")}
      ${r(228 + i * 140, 132, 116, 28, 6, [theme.light, "#fff3cd", "#d4edda", "#d1ecf1"][i], 0.8)}
      ${t(240 + i * 140, 149, ["Aday", "Görüşme", "Teklif", "Kazanıldı"][i], 11, "#555555", "600")}
      ${[0,1,2].map(j => `${r(228 + i * 140, 168 + j * 64, 116, 56, 6, "#ffffff")}
        ${r(228 + i * 140, 168 + j * 64, 116, 16, 6, theme.light, 0.3)}
        ${r(236 + i * 140, 192 + j * 64, 90, 10, 4, "#d4d4d4")}
        ${r(236 + i * 140, 208 + j * 64, 60, 8, 4, "#e4e4e4")}`).join("")}`).join("")}
  `,

  "depo-stok-siparis-yonetimi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 56, 0, "#f8f9fa")}
    ${t(40, 88, "📦 Depo Yönetimi", 14, theme.bg1, "700")}
    ${[0,1,2,3].map(i => `${statBox(20 + i * 190, 120, 176, 80, ["1.284", "342", "56", "₺128K"][i], ["Toplam Ürün", "Stok Uyarısı", "Sipariş", "Ciro"][i], theme)}`).join("")}
    ${r(20, 220, 760, 1, 0, "#eeeeee")}
    ${r(20, 236, 760, 36, 0, "#f5f5f5")}
    ${r(20, 236, 760, 36, 0, theme.light, 0.2)}
    ${t(40, 258, "Ürün Kodu", 11, "#666666", "700")}
    ${t(180, 258, "Ürün Adı", 11, "#666666", "700")}
    ${t(480, 258, "Stok", 11, "#666666", "700")}
    ${t(560, 258, "Durum", 11, "#666666", "700")}
    ${t(660, 258, "Fiyat", 11, "#666666", "700")}
    ${[0,1,2,3,4,5].map(i => `${r(20, 272 + i * 36, 760, 36, 0, i % 2 === 0 ? "#f9f9f9" : "#ffffff")}
      ${r(40, 282 + i * 36, 60, 16, 4, "#e4e4e4")}
      ${r(180, 282 + i * 36, 180, 16, 4, "#d4d4d4")}
      ${r(480, 282 + i * 36, 50, 16, 4, i > 3 ? "#fee2e2" : "#d1fae5")}
      ${r(560, 282 + i * 36, 70, 16, 8, i > 3 ? "#fca5a5" : theme.light, 0.8)}
      ${r(660, 282 + i * 36, 80, 16, 4, "#e4e4e4")}`).join("")}
  `,

  "rota-kurye-teslimat-sistemi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 56, 0, theme.bg1)}
    ${t(44, 90, "Rota — Kurye & Teslimat", 16, "#ffffff", "700")}
    ${r(20, 112, 360, 364, 10, "#f5f5f5")}
    ${mapPlaceholder(28, 120, 344, 280, theme)}
    ${r(28, 412, 344, 52, 8, "#ffffff")}
    ${t(44, 432, "4 Aktif Kurye", 13, theme.bg1, "700")}
    ${t(44, 450, "23 teslimat tamamlandı", 11, "#888888")}
    ${r(392, 112, 388, 364, 12, "#ffffff")}
    ${t(412, 138, "Siparişler", 14, theme.bg1, "700")}
    ${[0,1,2,3,4].map(i => `${r(408, 152 + i * 60, 364, 52, 8, "#f9f9f9")}
      ${r(408, 152 + i * 60, 4, 52, 0, [theme.accent, "#f59e0b", "#10b981", theme.muted, "#ef4444"][i])}
      ${r(422, 164 + i * 60, 180, 11, 4, "#d4d4d4")}
      ${r(422, 181 + i * 60, 120, 9, 4, "#e4e4e4")}
      ${r(620, 162 + i * 60, 80, 20, 10, ["#dbeafe", "#fef3c7", "#d1fae5", "#f3f4f6", "#fee2e2"][i])}
      ${t(630, 176 + i * 60, ["Yolda", "Hazır", "Teslim", "Bekliyor", "İptal"][i], 10, "#555555")}`).join("")}
  `,

  "saglik-turizmi-dijital-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 180, 0, theme.bg1)}
    ${c(680, 146, 90, theme.accent, 0.08)}
    ${t(44, 120, "Sağlık Turizmi", 28, "#ffffff", "800")}
    ${t(44, 150, "Dijital Paketi", 28, theme.accent, "800")}
    ${t(44, 178, "Yabancı hasta akışını dijitale taşıyın.", 13, "#aaaacc")}
    ${r(44, 196, 160, 32, 16, theme.accent)}
    ${t(64, 215, "Paketi İncele →", 12, "#ffffff", "600")}
    ${r(20, 252, 760, 1, 0, "#eeeeee")}
    ${[0,1,2,3].map(i => `${r(20 + i * 192, 268, 178, 120, 10, "#f9f9f9")}
      ${c(109 + i * 192, 308, 24, theme.light)}
      ${t(85 + i * 192, 313, ["🏥", "🌍", "📱", "📊"][i], 20, "#ffffff")}
      ${r(44 + i * 192, 344, 110, 12, 4, "#d4d4d4")}
      ${r(44 + i * 192, 362, 80, 9, 4, "#e8e8e8")}`).join("")}
  `,

  "seo-hizmet-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${navBar(760, theme)}
    ${r(20, 100, 380, 120, 0, theme.light, 0.2)}
    ${t(44, 138, "SEO Performansı", 22, theme.bg1, "800")}
    ${t(44, 164, "Organik trafiğinizi büyütün", 13, "#666666")}
    ${r(44, 182, 120, 32, 16, theme.accent)}
    ${r(20, 240, 760, 240, 0, "#f9f9f9")}
    ${lineChart(40, 256, 360, 160, theme)}
    ${r(420, 240, 360, 240, 0, "#f9f9f9")}
    ${[0,1,2,3].map(i => `${statBox(432, 252 + i * 56, 336, 48, ["↑ 340%", "↑ 128", "#1 SERP", "↑ 89%"][i], ["Organik Trafik", "Anahtar Kelime", "Sıralama", "Dönüşüm"][i], theme)}`).join("")}
  `,

  "sosyal-medya-yonetim-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 56, 0, "#f8f9fa")}
    ${t(40, 88, "📱 Sosyal Medya Yönetim Paneli", 14, theme.bg1, "700")}
    ${[0,1,2,3].map(i => `${statBox(20 + i * 190, 120, 176, 80, ["12.4K", "892", "4.7%", "📈"][i], ["Takipçi", "Etkileşim", "CTR", "Trend"][i], theme)}`).join("")}
    ${r(20, 220, 380, 256, 12, "#f9f9f9")}
    ${t(36, 244, "İçerik Takvimi", 13, theme.bg1, "700")}
    ${[0,1,2].map(i => `${r(28, 258 + i * 68, 364, 60, 8, "#ffffff")}
      ${r(28, 258 + i * 68, 4, 60, 0, [theme.accent, "#f59e0b", "#10b981"][i])}
      ${r(42, 268 + i * 68, 220, 12, 4, "#d4d4d4")}
      ${r(42, 286 + i * 68, 160, 9, 4, "#e4e4e4")}
      ${r(42, 302 + i * 68, 80, 14, 7, [theme.light, "#fef3c7", "#d1fae5"][i])}`).join("")}
    ${r(412, 220, 368, 256, 12, "#f9f9f9")}
    ${t(428, 244, "Platform Performansı", 13, theme.bg1, "700")}
    ${barChart(428, 256, 340, 180, theme)}
  `,

  "baslangic-dijital-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 200, 0, theme.bg1)}
    ${c(700, 160, 100, theme.light, 0.07)}
    ${t(44, 120, "Dijital Varlığınızı", 24, "#ffffff", "800")}
    ${t(44, 148, "Bugün Başlatın 🚀", 24, theme.accent, "800")}
    ${t(44, 176, "Web sitesi + sosyal medya + SEO — hepsi bir arada.", 13, "#aaaacc")}
    ${r(44, 196, 340, 48, 10, "#ffffff", 0.1)}
    ${r(56, 208, 100, 24, 12, theme.accent)}
    ${r(166, 208, 120, 24, 12, "#ffffff", 0.2)}
    ${r(296, 208, 80, 24, 12, "#ffffff", 0.1)}
    ${r(20, 272, 760, 1, 0, "#eeeeee")}
    ${[0,1,2].map(i => `${r(20 + i * 256, 288, 240, 140, 10, "#f9f9f9")}
      ${r(20 + i * 256, 288, 240, 50, 10, theme.light, 0.3)}
      ${t(44 + i * 256, 322, ["🌐", "📣", "📈"][i], 28, "#ffffff")}
      ${r(44 + i * 256, 352, 140, 12, 4, "#d4d4d4")}
      ${r(44 + i * 256, 372, 100, 10, 4, "#e4e4e4")}
      ${r(44 + i * 256, 390, 80, 24, 12, theme.accent, 0.7)}`).join("")}
  `,

  "profesyonel-buyume-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#ffffff")}
    ${r(20, 56, 760, 180, 0, theme.bg1)}
    ${t(44, 120, "Profesyonel Büyüme", 26, "#ffffff", "800")}
    ${t(44, 148, "Paketi", 26, theme.accent, "800")}
    ${t(44, 174, "Tam kapsamlı dijital büyüme çözümü.", 13, "#aaaacc")}
    ${r(44, 196, 260, 32, 16, theme.accent)}
    ${r(20, 252, 760, 224, 0, "#f9f9f9")}
    ${lineChart(40, 268, 440, 180, theme)}
    ${r(500, 252, 280, 224, 12, "#ffffff")}
    ${[0,1,2,3].map(i => `${r(514, 264 + i * 52, 252, 44, 8, "#f9f9f9")}
      ${r(514, 264 + i * 52, 4, 44, 0, theme.accent)}
      ${r(530, 276 + i * 52, 160, 11, 4, "#d4d4d4")}
      ${r(530, 293 + i * 52, 100, 9, 4, "#e4e4e4")}`).join("")}
  `,

  "kurumsal-dijital-donusum-paketi": (theme) => `
    ${r(20, 56, 760, 420, 12, "#f8f9fa")}
    ${r(20, 56, 760, 56, 0, theme.bg1)}
    ${t(40, 90, "Kurumsal Dijital Dönüşüm", 16, "#ffffff", "700")}
    ${r(560, 68, 180, 32, 8, theme.accent, 0.3)}
    ${[0,1,2,3].map(i => `${statBox(20 + i * 190, 120, 176, 80, ["A+", "98%", "4.9★", "24/7"][i], ["Web Skoru", "Uptime", "Müşteri Memnuniyeti", "Destek"][i], theme)}`).join("")}
    ${r(20, 220, 480, 256, 12, "#ffffff")}
    ${t(36, 244, "Dijital Dönüşüm Yol Haritası", 13, theme.bg1, "700")}
    ${[0,1,2,3,4].map(i => { const bw = [120, 240, 180, 300, 400][i]; return `${r(36, 258 + i * 40, bw, 28, 4, theme.accent, [0.2, 0.4, 0.3, 0.6, 0.8][i])}
      ${t(36 + 12, 278 + i * 40, ["Analiz", "Tasarım", "Geliştirme", "Test", "Yayın"][i], 10, theme.bg1)}`; }).join("")}
    ${r(514, 220, 266, 256, 12, "#ffffff")}
    ${t(530, 244, "Teknoloji Yığını", 13, theme.bg1, "700")}
    ${["Next.js", "PostgreSQL", "TypeScript", "Docker", "CI/CD"].map((tech, i) => `${r(530, 258 + i * 40, 230, 28, 6, theme.light, 0.4)}
      ${t(546, 276 + i * 40, tech, 11, theme.bg1)}`).join("")}
  `,
};

// ─── MOBİL MOCKUP ──────────────────────────────────────────────────────────

function mobileMockup(slug, title, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 780" width="390" height="780" role="img" aria-label="${title} mobil görünüm">
    <rect width="390" height="780" rx="42" fill="${theme.bg1}"/>
    <rect x="14" y="14" width="362" height="752" rx="32" fill="#ffffff"/>
    <rect x="150" y="26" width="90" height="18" rx="9" fill="#eceee9"/>
    <rect x="0" y="56" width="390" height="52" fill="#ffffff"/>
    <rect x="14" y="68" width="60" height="28" rx="8" fill="${theme.bg1}"/>
    <rect x="260" y="68" width="60" height="28" rx="14" fill="${theme.accent}"/>
    <rect x="330" y="70" width="50" height="24" rx="8" fill="#eeeeee"/>
    <rect x="14" y="116" width="362" height="180" rx="16" fill="${theme.light}" fill-opacity="0.5"/>
    <circle cx="195" cy="206" r="40" fill="${theme.accent}" fill-opacity="0.2"/>
    <rect x="14" y="316" width="172" height="120" rx="14" fill="#f9f9f9"/>
    <rect x="14" y="316" width="172" height="48" rx="14" fill="${theme.light}" fill-opacity="0.5"/>
    <rect x="204" y="316" width="172" height="120" rx="14" fill="#f9f9f9"/>
    <rect x="204" y="316" width="172" height="48" rx="14" fill="${theme.accent}" fill-opacity="0.15"/>
    <rect x="14" y="452" width="362" height="48" rx="24" fill="${theme.accent}"/>
    <rect x="14" y="516" width="172" height="80" rx="14" fill="#f9f9f9"/>
    <rect x="204" y="516" width="172" height="80" rx="14" fill="#f9f9f9"/>
    <rect x="14" y="612" width="362" height="80" rx="14" fill="${theme.light}" fill-opacity="0.3"/>
    <rect x="34" y="632" width="200" height="14" rx="4" fill="#d4d4d4"/>
    <rect x="34" y="656" width="140" height="10" rx="4" fill="#e4e4e4"/>
    <rect x="0" y="710" width="390" height="56" fill="#ffffff"/>
    ${[0,1,2,3].map(i => `<circle cx="${50 + i * 90}" cy="736" r="14" fill="${i === 0 ? theme.accent : theme.light}" fill-opacity="${i === 0 ? 0.3 : 0.15}"/>`).join("")}
  </svg>`;
}

// ─── KAPAK SVG (Zengin versiyon) ───────────────────────────────────────────

function makeCoverSvg(slug, title, subtitle, theme) {
  const customTemplate = PRODUCT_TEMPLATES[slug];
  const innerContent = customTemplate ? customTemplate(theme) :
    PRODUCT_TEMPLATES["atlas-kurumsal-web-sitesi"](theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <circle cx="680" cy="120" r="140" fill="${theme.accent}" fill-opacity="0.05"/>
  <circle cx="100" cy="500" r="80" fill="${theme.light}" fill-opacity="0.04"/>
  <g filter="url(#shadow)">
    ${innerContent}
  </g>
  <text x="20" y="576" font-family="system-ui,Segoe UI,Arial" font-size="22" font-weight="700" fill="#ffffff">${title}</text>
  <text x="20" y="596" font-family="system-ui,Segoe UI,Arial" font-size="12" fill="#ffffff" opacity="0.7">${subtitle}</text>
</svg>`;
}

// ─── MASAÜSTÜ SVG ──────────────────────────────────────────────────────────

function makeDesktopSvg(slug, title, theme) {
  const customTemplate = PRODUCT_TEMPLATES[slug];
  const innerContent = customTemplate ? customTemplate(theme) :
    PRODUCT_TEMPLATES["atlas-kurumsal-web-sitesi"](theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800" role="img" aria-label="${title} masaüstü görünüm">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect x="80" y="40" width="1040" height="660" rx="12" fill="#ffffff" filter="url(#f1)"/>
  <defs>
    <filter id="f1"><feDropShadow dx="0" dy="10" stdDeviation="20" flood-opacity="0.3"/></filter>
  </defs>
  <!-- Browser chrome -->
  <rect x="80" y="40" width="1040" height="44" rx="12" fill="#f0f0ef"/>
  <rect x="80" y="72" width="1040" height="12" fill="#f0f0ef"/>
  <circle cx="106" cy="62" r="7" fill="#ff5f57"/>
  <circle cx="128" cy="62" r="7" fill="#febc2e"/>
  <circle cx="150" cy="62" r="7" fill="#28c840"/>
  <rect x="180" y="52" width="400" height="20" rx="10" fill="#e2e2e0"/>
  <rect x="198" y="57" width="260" height="10" rx="5" fill="#d0d0ce"/>
  <!-- Inner page (scaled version) -->
  <g transform="translate(80, 84) scale(1.04)">
    ${innerContent}
  </g>
  <!-- Monitor stand -->
  <rect x="540" y="700" width="120" height="16" rx="8" fill="${theme.bg2}" fill-opacity="0.5"/>
  <rect x="510" y="716" width="180" height="8" rx="4" fill="${theme.bg2}" fill-opacity="0.3"/>
</svg>`;
}

// ─── PANEL SVG ─────────────────────────────────────────────────────────────

function makePanelSvg(slug, title, theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" role="img" aria-label="${title} yönetim paneli">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="#f0f2f5"/>
      <stop offset="100%" stop-color="#e8ecf0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <!-- Sidebar -->
  <rect x="0" y="0" width="220" height="900" fill="${theme.bg1}"/>
  <rect x="0" y="0" width="220" height="64" fill="${theme.bg1}"/>
  <rect x="20" y="20" width="120" height="28" rx="6" fill="${theme.accent}" fill-opacity="0.3"/>
  <rect x="24" y="27" width="80" height="14" rx="4" fill="${theme.accent}"/>
  ${["Dashboard", "Ürünler", "Siparişler", "Müşteriler", "Raporlar", "Ayarlar"].map((m, i) => `
    <rect x="0" y="${88 + i * 52}" width="220" height="44" fill="${i === 0 ? theme.accent : "transparent"}" fill-opacity="${i === 0 ? 0.2 : 0}"/>
    <rect x="0" y="${88 + i * 52}" width="3" height="44" fill="${i === 0 ? theme.accent : "transparent"}"/>
    <rect x="24" y="${100 + i * 52}" width="${[60, 50, 68, 72, 54, 48][i]}" height="12" rx="4" fill="#ffffff" fill-opacity="${i === 0 ? 0.9 : 0.45}"/>
  `).join("")}
  <!-- Header -->
  <rect x="220" y="0" width="980" height="64" fill="#ffffff"/>
  <rect x="240" y="20" width="200" height="24" rx="6" fill="#f0f0ef"/>
  <rect x="256" y="26" width="140" height="12" rx="4" fill="#e0e0de"/>
  <rect x="${1200 - 200}" y="16" width="160" height="32" rx="16" fill="${theme.light}" fill-opacity="0.6"/>
  <circle cx="${1200 - 160}" cy="32" r="12" fill="${theme.accent}" fill-opacity="0.4"/>
  <!-- Stats row -->
  ${[0,1,2,3].map(i => `
    <rect x="${240 + i * 240}" y="84" width="220" height="120" rx="12" fill="#ffffff"/>
    <rect x="${240 + i * 240}" y="84" width="220" height="4" rx="2" fill="${theme.accent}" fill-opacity="${0.3 + i * 0.2}"/>
    <rect x="${256 + i * 240}" y="104" width="${[60, 80, 70, 90][i]}" height="28" rx="6" fill="${theme.bg1}" fill-opacity="0.8"/>
    <rect x="${256 + i * 240}" y="144" width="140" height="12" rx="4" fill="#d4d4d4"/>
    <rect x="${256 + i * 240}" y="164" width="100" height="10" rx="4" fill="#e4e4e4"/>
    <rect x="${440 + i * 240}" y="96" width="48" height="48" rx="10" fill="${theme.light}" fill-opacity="0.4"/>
  `).join("")}
  <!-- Main chart area -->
  <rect x="240" y="224" width="640" height="280" rx="12" fill="#ffffff"/>
  <rect x="256" y="240" width="140" height="16" rx="4" fill="#d4d4d4"/>
  ${barChart(256, 272, 600, 200, theme)}
  <!-- Right panel -->
  <rect x="900" y="224" width="280" height="280" rx="12" fill="#ffffff"/>
  <rect x="916" y="240" width="120" height="16" rx="4" fill="#d4d4d4"/>
  ${[0,1,2,3,4].map(i => `
    <rect x="916" y="${272 + i * 44}" width="248" height="36" rx="8" fill="${i % 2 === 0 ? "#f9f9f9" : "#ffffff"}"/>
    <circle cx="934" cy="${290 + i * 44}" r="10" fill="${theme.light}" fill-opacity="0.6"/>
    <rect x="952" y="${284 + i * 44}" width="140" height="10" rx="4" fill="#d4d4d4"/>
    <rect x="952" y="${300 + i * 44}" width="90" height="8" rx="4" fill="#e4e4e4"/>
  `).join("")}
  <!-- Table area -->
  <rect x="240" y="524" width="940" height="340" rx="12" fill="#ffffff"/>
  <rect x="240" y="524" width="940" height="48" rx="12" fill="${theme.light}" fill-opacity="0.3"/>
  <rect x="256" y="538" width="100" height="20" rx="6" fill="#d4d4d4"/>
  ${[0,1,2,3,4,5].map(i => `
    <rect x="240" y="${572 + i * 48}" width="940" height="48" fill="${i % 2 === 0 ? "#f9f9f9" : "#ffffff"}"/>
    <rect x="256" y="${584 + i * 48}" width="120" height="14" rx="4" fill="#d4d4d4"/>
    <rect x="420" y="${584 + i * 48}" width="180" height="14" rx="4" fill="#e0e0e0"/>
    <rect x="660" y="${584 + i * 48}" width="80" height="14" rx="4" fill="#e8e8e8"/>
    <rect x="800" y="${582 + i * 48}" width="80" height="18" rx="9" fill="${theme.light}" fill-opacity="0.6"/>
    <rect x="940" y="${582 + i * 48}" width="60" height="18" rx="9" fill="#eeeeee"/>
  `).join("")}
</svg>`;
}

// ─── TABLET SVG ────────────────────────────────────────────────────────────

function makeTabletSvg(slug, title, theme) {
  const customTemplate = PRODUCT_TEMPLATES[slug];
  const innerContent = customTemplate ? customTemplate(theme) :
    PRODUCT_TEMPLATES["atlas-kurumsal-web-sitesi"](theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024" width="768" height="1024" role="img" aria-label="${title} tablet görünüm">
  <rect width="768" height="1024" rx="24" fill="${theme.bg2}"/>
  <rect x="16" y="16" width="736" height="992" rx="16" fill="#ffffff"/>
  <!-- Home button -->
  <circle cx="384" cy="1000" r="18" fill="${theme.bg1}" fill-opacity="0.3"/>
  <!-- Camera -->
  <circle cx="384" cy="28" r="5" fill="${theme.bg1}" fill-opacity="0.3"/>
  <!-- Content -->
  <g transform="translate(16, 44) scale(0.95 0.78)">
    ${innerContent}
  </g>
</svg>`;
}

// ─── PORTFÖY GÖRSELLERİ ────────────────────────────────────────────────────

function makePortfolioSvg(title, description, theme, w = 1200, h = 675) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.32}" fill="${theme.accent}" fill-opacity="0.06"/>
  <circle cx="${w * 0.15}" cy="${h * 0.8}" r="${h * 0.2}" fill="${theme.light}" fill-opacity="0.05"/>
  <!-- Mock browser window -->
  <rect x="80" y="60" width="${w - 160}" height="${h - 120}" rx="14" fill="#ffffff" fill-opacity="0.06"/>
  <rect x="80" y="60" width="${w - 160}" height="44" rx="14" fill="#ffffff" fill-opacity="0.12"/>
  <circle cx="110" cy="82" r="7" fill="#ff5f57" fill-opacity="0.7"/>
  <circle cx="132" cy="82" r="7" fill="#febc2e" fill-opacity="0.7"/>
  <circle cx="154" cy="82" r="7" fill="#28c840" fill-opacity="0.7"/>
  <rect x="180" y="72" width="300" height="20" rx="10" fill="#ffffff" fill-opacity="0.1"/>
  <!-- Content lines -->
  ${Array.from({length: 5}, (_, i) => `
    <rect x="108" y="${124 + i * 60}" width="${(i % 2 === 0 ? 0.6 : 0.4) * (w - 240)}" height="16" rx="4" fill="#ffffff" fill-opacity="${0.08 + i * 0.02}"/>
  `).join("")}
  <!-- Labels -->
  <text x="80" y="${h - 80}" font-family="system-ui,Segoe UI,Arial" font-size="${Math.round(w / 25)}" font-weight="800" fill="#ffffff">${title}</text>
  <text x="80" y="${h - 48}" font-family="system-ui,Segoe UI,Arial" font-size="${Math.round(w / 55)}" fill="#ffffff" opacity="0.7">${description}</text>
  <rect x="80" y="${h - 36}" width="120" height="24" rx="12" fill="${theme.accent}" fill-opacity="0.6"/>
  <text x="95" y="${h - 20}" font-family="system-ui,Segoe UI,Arial" font-size="11" fill="#ffffff">Referans Proje</text>
</svg>`;
}

// ─── AJANS GÖRSELLERİ ──────────────────────────────────────────────────────

const AGENCY_IMAGES = {
  "studyo": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" width="900" height="620" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/>
    </linearGradient>
  </defs>
  <rect width="900" height="620" fill="url(#bg)"/>
  <circle cx="750" cy="110" r="150" fill="${theme.light}" fill-opacity="0.5"/>
  <!-- Desk -->
  <rect x="60" y="470" width="780" height="12" rx="6" fill="#c6cec2"/>
  <rect x="150" y="482" width="14" height="66" fill="#ffffff"/>
  <rect x="736" y="482" width="14" height="66" fill="#ffffff"/>
  <!-- Main screen -->
  <rect x="110" y="128" width="440" height="302" rx="14" fill="#232a22" stroke="#c6cec2" stroke-width="1"/>
  <rect x="122" y="140" width="416" height="278" rx="8" fill="#ffffff"/>
  <rect x="122" y="140" width="416" height="26" rx="8" fill="#eaeee7"/>
  <rect x="122" y="158" width="416" height="8" fill="#eaeee7"/>
  <circle cx="140" cy="153" r="4" fill="#c6cec2"/>
  <circle cx="154" cy="153" r="4" fill="#c6cec2"/>
  <circle cx="168" cy="153" r="4" fill="#c6cec2"/>
  <rect x="140" y="192" width="152" height="16" rx="6" fill="#141a14"/>
  <rect x="140" y="220" width="220" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.85"/>
  <rect x="140" y="238" width="178" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.82"/>
  <rect x="140" y="266" width="98" height="28" rx="14" fill="${theme.accent}"/>
  <rect x="140" y="316" width="120" height="84" rx="10" fill="#eaeee7"/>
  <rect x="272" y="316" width="120" height="84" rx="10" fill="#eaeee7"/>
  <rect x="404" y="316" width="120" height="84" rx="10" fill="${theme.light}"/>
  <rect x="330" y="430" width="60" height="40" fill="#ffffff"/>
  <rect x="286" y="464" width="148" height="10" rx="5" fill="#ffffff"/>
  <!-- Secondary screen (code) -->
  <rect x="586" y="180" width="252" height="250" rx="14" fill="#232a22" stroke="#c6cec2" stroke-width="1"/>
  <rect x="596" y="190" width="232" height="230" rx="8" fill="#ffffff"/>
  <rect x="614" y="212" width="120" height="9" rx="4.5" fill="${theme.accent}" fill-opacity="0.8"/>
  <rect x="628" y="238" width="86" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.7"/>
  <rect x="614" y="264" width="150" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.7"/>
  <rect x="628" y="290" width="64" height="9" rx="4.5" fill="${theme.accent}" fill-opacity="0.8"/>
  <rect x="614" y="316" width="108" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.7"/>
  <rect x="628" y="342" width="140" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.7"/>
  <rect x="688" y="430" width="48" height="40" fill="#ffffff"/>
  <rect x="652" y="464" width="120" height="10" rx="5" fill="#ffffff"/>
  <!-- Keyboard -->
  <rect x="230" y="498" width="220" height="42" rx="10" fill="#ffffff" stroke="#c6cec2" stroke-width="1"/>
  ${[0,1,2,3,4,5].map(i => `<rect x="${244 + i * 34}" y="510" width="24" height="8" rx="4" fill="#c6cec2"/>`).join("")}
  ${[0,1,2,3,4].map(i => `<rect x="${258 + i * 34}" y="524" width="24" height="8" rx="4" fill="#c6cec2"/>`).join("")}
  <rect x="500" y="502" width="44" height="38" rx="8" fill="${theme.accent}"/>
  <path d="M544 512h14a9 9 0 010 18h-14z" fill="none" stroke="${theme.accent}" stroke-width="5"/>
</svg>`,

  "hizmet-web": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient>
  <filter id="sh"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#141a14" flood-opacity="0.13"/></filter></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <g filter="url(#sh)">
  <rect x="60" y="60" width="520" height="320" rx="14" fill="#ffffff" stroke="#c6cec2" stroke-width="1"/>
  <rect x="60" y="60" width="520" height="34" rx="14" fill="#eaeee7"/>
  <rect x="60" y="80" width="520" height="14" fill="#eaeee7"/>
  <circle cx="84" cy="77" r="5" fill="#c6cec2"/><circle cx="102" cy="77" r="5" fill="#c6cec2"/><circle cx="120" cy="77" r="5" fill="#c6cec2"/>
  <rect x="150" y="70" width="180" height="14" rx="7" fill="#c6cec2"/>
  <rect x="88" y="122" width="200" height="20" rx="8" fill="#141a14"/>
  <rect x="88" y="156" width="280" height="10" rx="5" fill="#6b7569" fill-opacity="0.82"/>
  <rect x="88" y="176" width="230" height="10" rx="5" fill="#6b7569" fill-opacity="0.5"/>
  <rect x="88" y="208" width="114" height="34" rx="17" fill="${theme.accent}"/>
  <rect x="392" y="122" width="160" height="120" rx="12" fill="${theme.light}"/>
  <circle cx="472" cy="182" r="36" fill="${theme.muted}" fill-opacity="0.3"/>
  <rect x="88" y="272" width="140" height="80" rx="12" fill="#eaeee7"/>
  <rect x="104" y="292" width="72" height="10" rx="5" fill="${theme.accent}" fill-opacity="0.8"/>
  <rect x="104" y="310" width="100" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.82"/>
  <rect x="248" y="272" width="140" height="80" rx="12" fill="#eaeee7"/>
  <rect x="264" y="292" width="72" height="10" rx="5" fill="${theme.accent}" fill-opacity="0.8"/>
  <rect x="264" y="310" width="100" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.82"/>
  <rect x="408" y="272" width="140" height="80" rx="12" fill="#eaeee7"/>
  <rect x="424" y="292" width="72" height="10" rx="5" fill="${theme.accent}" fill-opacity="0.8"/>
  <rect x="424" y="310" width="100" height="9" rx="4.5" fill="#6b7569" fill-opacity="0.82"/>
  </g>
</svg>`,

  "hizmet-eticaret": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient>
  <filter id="sh"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#141a14" flood-opacity="0.13"/></filter></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <g filter="url(#sh)">
  <rect x="60" y="40" width="520" height="360" rx="14" fill="#ffffff"/>
  <rect x="60" y="40" width="520" height="40" rx="14" fill="#eaeee7"/>
  <rect x="80" y="56" width="80" height="18" rx="6" fill="${theme.bg1}"/>
  <rect x="400" y="52" width="60" height="28" rx="8" fill="${theme.accent}"/>
  <rect x="80" y="98" width="220" height="160" rx="12" fill="${theme.light}" fill-opacity="0.5"/>
  <circle cx="190" cy="178" r="50" fill="${theme.muted}" fill-opacity="0.3"/>
  <rect x="80" y="270" width="140" height="16" rx="6" fill="#d4d4d4"/>
  <rect x="80" y="294" width="100" height="12" rx="4" fill="#e4e4e4"/>
  <rect x="80" y="318" width="80" height="28" rx="14" fill="${theme.accent}"/>
  <rect x="320" y="98" width="240" height="260" rx="12" fill="#f9f9f9"/>
  ${[0,1,2,3].map(i => `<rect x="336" y="${114 + i * 60}" width="208" height="52" rx="8" fill="#ffffff"/>
    <rect x="336" y="${114 + i * 60}" width="52" height="52" rx="8" fill="${theme.light}" fill-opacity="0.4"/>
    <rect x="400" y="${126 + i * 60}" width="120" height="12" rx="4" fill="#d4d4d4"/>
    <rect x="400" y="${146 + i * 60}" width="80" height="10" rx="4" fill="#e4e4e4"/>`).join("")}
  </g>
</svg>`,

  "hizmet-mobil": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  ${[0,1,2].map(i => `
  <rect x="${80 + i * 170}" y="${60 - i * 20}" width="140" height="300" rx="20" fill="${theme.bg1}"/>
  <rect x="${88 + i * 170}" y="${68 - i * 20}" width="124" height="284" rx="14" fill="#ffffff"/>
  <rect x="${120 + i * 170}" y="${72 - i * 20}" width="60" height="10" rx="5" fill="#eceee9"/>
  <rect x="${96 + i * 170}" y="${92 - i * 20}" width="108" height="80" rx="8" fill="${theme.light}" fill-opacity="0.5"/>
  <rect x="${96 + i * 170}" y="${182 - i * 20}" width="108" height="12" rx="4" fill="#d4d4d4"/>
  <rect x="${96 + i * 170}" y="${202 - i * 20}" width="80" height="10" rx="4" fill="#e4e4e4"/>
  <rect x="${96 + i * 170}" y="${228 - i * 20}" width="108" height="32" rx="16" fill="${theme.accent}"/>
  `).join("")}
</svg>`,

  "hizmet-yazilim": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#0a1628"/><stop offset="100%" stop-color="#141e30"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="60" width="520" height="320" rx="14" fill="#1e2d3d"/>
  <rect x="60" y="60" width="520" height="36" rx="14" fill="#263545"/>
  <circle cx="84" cy="78" r="5" fill="#ff5f57" fill-opacity="0.7"/><circle cx="102" cy="78" r="5" fill="#febc2e" fill-opacity="0.7"/><circle cx="120" cy="78" r="5" fill="#28c840" fill-opacity="0.7"/>
  <text x="88" y="116" font-family="monospace" font-size="12" fill="${theme.accent}">import</text>
  <text x="135" y="116" font-family="monospace" font-size="12" fill="#e8e8e8">{ PrismaClient }</text>
  <text x="88" y="140" font-family="monospace" font-size="12" fill="#aaaaaa">const</text>
  <text x="122" y="140" font-family="monospace" font-size="12" fill="#e8e8e8">prisma = new PrismaClient()</text>
  ${[0,1,2,3,4,5].map(i => `<rect x="88" y="${164 + i * 24}" width="${[180, 240, 120, 280, 200, 160][i]}" height="10" rx="3" fill="${["#4a90d9", "#e8e8e8", "#6b9268", "#aaaaaa", "#e8e8e8", "#d4a017"][i]}" fill-opacity="0.7"/>`).join("")}
  <rect x="60" y="310" width="180" height="70" rx="14" fill="#263545"/>
  <rect x="256" y="310" width="180" height="70" rx="14" fill="#263545"/>
  <rect x="452" y="310" width="128" height="70" rx="14" fill="#263545"/>
  ${[0,1,2].map(i => `<rect x="${76 + i * 196}" y="326" width="120" height="10" rx="3" fill="${theme.accent}" fill-opacity="0.6"/>
    <rect x="${76 + i * 196}" y="346" width="100" height="8" rx="3" fill="#ffffff" fill-opacity="0.2"/>
    <rect x="${76 + i * 196}" y="362" width="80" height="8" rx="3" fill="#ffffff" fill-opacity="0.15"/>`).join("")}
</svg>`,

  "hizmet-marka": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <circle cx="200" cy="220" r="120" fill="${theme.light}" fill-opacity="0.4"/>
  <circle cx="200" cy="220" r="80" fill="${theme.accent}" fill-opacity="0.15"/>
  <circle cx="200" cy="220" r="40" fill="${theme.accent}" fill-opacity="0.3"/>
  <rect x="360" y="80" width="200" height="48" rx="8" fill="${theme.bg1}" fill-opacity="0.9"/>
  <rect x="375" y="96" width="120" height="16" rx="4" fill="#ffffff" fill-opacity="0.7"/>
  ${["Marka Renkleri", "Tipografi", "Logo Varyantları", "Kurumsal Şablonlar"].map((label, i) => `
    <rect x="360" y="${148 + i * 56}" width="240" height="44" rx="10" fill="#ffffff"/>
    <rect x="360" y="${148 + i * 56}" width="4" height="44" fill="${theme.accent}" fill-opacity="0.8"/>
    <rect x="376" y="${162 + i * 56}" width="100" height="14" rx="4" fill="#d4d4d4"/>
    <rect x="376" y="${182 + i * 56}" width="160" height="9" rx="4" fill="#e4e4e4"/>
  `).join("")}
</svg>`,

  "hizmet-buyume": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="60" width="520" height="320" rx="14" fill="#ffffff"/>
  <rect x="80" y="80" width="480" height="100" rx="10" fill="#f9f9f9"/>
  <text x="100" y="118" font-family="system-ui,Segoe UI,Arial" font-size="32" font-weight="800" fill="${theme.bg1}">↑ 340%</text>
  <rect x="100" y="136" width="160" height="14" rx="4" fill="#d4d4d4"/>
  ${lineChart(80, 200, 480, 140, theme)}
  ${[0,1,2].map(i => `<rect x="${80 + i * 172}" y="370" width="160" height="40" rx="8" fill="${theme.light}" fill-opacity="0.4"/>
    <rect x="${96 + i * 172}" y="380" width="100" height="10" rx="4" fill="${theme.accent}" fill-opacity="0.5"/>
    <rect x="${96 + i * 172}" y="398" width="70" height="8" rx="4" fill="#e4e4e4"/>`).join("")}
</svg>`,

  "sonuclar": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="900" height="600" fill="url(#bg)"/>
  <text x="50" y="80" font-family="system-ui,Segoe UI,Arial" font-size="28" font-weight="800" fill="${theme.bg1}">Ölçülebilir Sonuçlar</text>
  ${[
    {val: "148+", label: "Teslim Edilen Proje", icon: "🚀"},
    {val: "98%", label: "Müşteri Memnuniyeti", icon: "⭐"},
    {val: "3 Gün", label: "Ortalama Teslim Süresi", icon: "⚡"},
    {val: "24/7", label: "Teknik Destek", icon: "🛡"},
  ].map((s, i) => `
    <rect x="${50 + i * 205}" y="110" width="185" height="140" rx="14" fill="#ffffff"/>
    <rect x="${50 + i * 205}" y="110" width="185" height="4" rx="2" fill="${theme.accent}" fill-opacity="${0.4 + i * 0.15}"/>
    <text x="${85 + i * 205}" y="170" font-family="system-ui,Segoe UI,Arial" font-size="36" font-weight="800" fill="${theme.bg1}">${s.val}</text>
    <rect x="${65 + i * 205}" y="184" width="150" height="12" rx="4" fill="#d4d4d4"/>
    <rect x="${65 + i * 205}" y="204" width="100" height="10" rx="4" fill="#e4e4e4"/>
  `).join("")}
  <rect x="50" y="280" width="800" height="280" rx="14" fill="#ffffff"/>
  <text x="68" y="314" font-family="system-ui,Segoe UI,Arial" font-size="15" font-weight="700" fill="${theme.bg1}">Son 12 Ay Proje Teslimi</text>
  ${barChart(68, 324, 760, 200, theme)}
</svg>`,

  "surec": (theme) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" width="900" height="620" role="img">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="900" height="620" fill="url(#bg)"/>
  <text x="50" y="70" font-family="system-ui,Segoe UI,Arial" font-size="26" font-weight="800" fill="${theme.bg1}">Nasıl Çalışıyoruz?</text>
  ${[
    {step: "01", title: "Brifing & Analiz", desc: "İhtiyaçlarınızı dinler,\nen uygun çözümü belirleriz."},
    {step: "02", title: "Tasarım", desc: "Markanıza özel tasarım\nve prototip hazırlarız."},
    {step: "03", title: "Geliştirme", desc: "Hızlı ve güvenli şekilde\nkurulum tamamlanır."},
    {step: "04", title: "Teslim", desc: "Eğitim ve destek ile\nhazır şekilde teslim ederiz."},
  ].map((s, i) => `
    <rect x="${50 + i * 210}" y="100" width="190" height="460" rx="14" fill="#ffffff"/>
    <rect x="${50 + i * 210}" y="100" width="190" height="60" rx="14" fill="${theme.accent}" fill-opacity="${0.15 + i * 0.05}"/>
    <text x="${70 + i * 210}" y="140" font-family="system-ui,Segoe UI,Arial" font-size="28" font-weight="800" fill="${theme.accent}">${s.step}</text>
    <rect x="${65 + i * 210}" y="178" width="150" height="16" rx="4" fill="${theme.bg1}" fill-opacity="0.8"/>
    <rect x="${65 + i * 210}" y="204" width="140" height="10" rx="4" fill="#d4d4d4"/>
    <rect x="${65 + i * 210}" y="222" width="120" height="10" rx="4" fill="#e4e4e4"/>
    <circle cx="${145 + i * 210}" cy="380" r="60" fill="${theme.light}" fill-opacity="0.4"/>
    ${i < 3 ? `<line x1="${240 + i * 210}" y1="130" x2="${260 + i * 210}" y2="130" stroke="${theme.accent}" stroke-width="2" stroke-dasharray="4,4" opacity="0.5"/>` : ""}
  `).join("")}
</svg>`,
};

// ─── ANA FONKSİYON ─────────────────────────────────────────────────────────

async function write(rel, content) {
  const full = path.join(OUT, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf8");
  console.log(`  ✓ ${rel}`);
}

const PRODUCT_THEME_MAP = {
  "atlas-kurumsal-web-sitesi": THEMES.green,
  "vitrin-eticaret-sitesi": THEMES.blue,
  "sofra-restoran-web-sitesi": THEMES.amber,
  "medica-klinik-web-sitesi": THEMES.teal,
  "arsa-emlak-portali": THEMES.olive,
  "marina-otel-rezervasyon-sitesi": THEMES.cyan,
  "akademi-egitim-sitesi": THEMES.purple,
  "gundem-haber-portali": THEMES.red,
  "studyo-portfoy-sitesi": THEMES.dark,
  "donusum-landing-page-seti": THEMES.rose,
  "zaman-randevu-sitesi": THEMES.green,
  "pazar-cok-saticili-pazaryeri": THEMES.blue,
  "sepetim-eticaret-mobil-uygulamasi": THEMES.purple,
  "hizli-siparis-restoran-uygulamasi": THEMES.amber,
  "randevum-mobil-uygulamasi": THEMES.teal,
  "formda-fitness-uygulamasi": THEMES.dark,
  "hasta-takip-sistemi": THEMES.cyan,
  "pusula-crm-sistemi": THEMES.blue,
  "depo-stok-siparis-yonetimi": THEMES.olive,
  "rota-kurye-teslimat-sistemi": THEMES.amber,
  "saglik-turizmi-dijital-paketi": THEMES.teal,
  "seo-hizmet-paketi": THEMES.purple,
  "sosyal-medya-yonetim-paketi": THEMES.rose,
  "baslangic-dijital-paketi": THEMES.green,
  "profesyonel-buyume-paketi": THEMES.blue,
  "kurumsal-dijital-donusum-paketi": THEMES.dark,
};

const PRODUCTS = [
  { slug: "atlas-kurumsal-web-sitesi", name: "Atlas Kurumsal Web Sitesi", sub: "Kurumsal firmalar için hızlı ve güven veren tanıtım sitesi." },
  { slug: "vitrin-eticaret-sitesi", name: "Vitrin E-Ticaret Sitesi", sub: "Sanal POS, kargo ve stok yönetimi hazır mağaza." },
  { slug: "sofra-restoran-web-sitesi", name: "Sofra Restoran Web Sitesi", sub: "Dijital menü, rezervasyon ve online sipariş." },
  { slug: "medica-klinik-web-sitesi", name: "Medica Klinik Web Sitesi", sub: "Online randevu ve hasta bilgilendirme odaklı sağlık sitesi." },
  { slug: "arsa-emlak-portali", name: "Arsa Emlak Portalı", sub: "Harita üzerinde ilan arama ve danışman yönetimi." },
  { slug: "marina-otel-rezervasyon-sitesi", name: "Marina Otel Rezervasyon Sitesi", sub: "Oda müsaitliği ve online rezervasyon içeren otel sitesi." },
  { slug: "akademi-egitim-sitesi", name: "Akademi Eğitim Sitesi", sub: "Kurs satışı, video ders ve öğrenci paneli." },
  { slug: "gundem-haber-portali", name: "Gündem Haber Portalı", sub: "Yüksek trafiğe hazır, reklam alanları tanımlı haber sitesi." },
  { slug: "studyo-portfoy-sitesi", name: "Stüdyo Portföy Sitesi", sub: "Fotoğrafçı ve tasarımcılar için görsel odaklı portföy." },
  { slug: "donusum-landing-page-seti", name: "Dönüşüm Landing Page Seti", sub: "Reklam kampanyaları için A/B testine uygun 6 açılış sayfası." },
  { slug: "zaman-randevu-sitesi", name: "Zaman Randevu Sitesi", sub: "Personel bazlı takvim ve online ödemeli randevu sistemi." },
  { slug: "pazar-cok-saticili-pazaryeri", name: "Pazar Çok Satıcılı Pazaryeri", sub: "Satıcı paneli, komisyon ve hakediş yönetimi." },
  { slug: "sepetim-eticaret-mobil-uygulamasi", name: "Sepetim E-Ticaret Mobil Uygulaması", sub: "iOS ve Android için hazır alışveriş uygulaması." },
  { slug: "hizli-siparis-restoran-uygulamasi", name: "Hızlı Sipariş Restoran Uygulaması", sub: "QR okut, seç, öde — 3 adımda sipariş." },
  { slug: "randevum-mobil-uygulamasi", name: "Randevum Mobil Uygulaması", sub: "Mobil randevu ve takvim uygulaması." },
  { slug: "formda-fitness-uygulamasi", name: "Formda Fitness Uygulaması", sub: "Antrenman takibi, beslenme ve ilerleme grafikleri." },
  { slug: "hasta-takip-sistemi", name: "Hasta Takip Sistemi", sub: "Klinikler için kapsamlı hasta ve tahlil yönetimi." },
  { slug: "pusula-crm-sistemi", name: "Pusula CRM Sistemi", sub: "Satış hattı, müşteri yönetimi ve raporlama." },
  { slug: "depo-stok-siparis-yonetimi", name: "Depo Stok ve Sipariş Yönetimi", sub: "Envanter, stok uyarısı ve sipariş takip sistemi." },
  { slug: "rota-kurye-teslimat-sistemi", name: "Rota Kurye ve Teslimat Sistemi", sub: "Gerçek zamanlı kurye takip ve rota optimizasyonu." },
  { slug: "saglik-turizmi-dijital-paketi", name: "Sağlık Turizmi Dijital Paketi", sub: "Yabancı hasta akışını dijitale taşıyın." },
  { slug: "seo-hizmet-paketi", name: "SEO Hizmet Paketi", sub: "Organik trafiğinizi büyütün, Google'da öne çıkın." },
  { slug: "sosyal-medya-yonetim-paketi", name: "Sosyal Medya Yönetim Paketi", sub: "İçerik takvimi, takipçi büyümesi ve etkileşim analizi." },
  { slug: "baslangic-dijital-paketi", name: "Başlangıç Dijital Paketi", sub: "Web sitesi + sosyal medya + SEO — hepsi bir arada." },
  { slug: "profesyonel-buyume-paketi", name: "Profesyonel Büyüme Paketi", sub: "Tam kapsamlı dijital büyüme çözümü." },
  { slug: "kurumsal-dijital-donusum-paketi", name: "Kurumsal Dijital Dönüşüm Paketi", sub: "Kurumsal firmalara özel dönüşüm paketi." },
];

const PORTFOLIO_ITEMS = [
  { slug: "dis-klinigi-saglik-turizmi", title: "Diş Kliniği Sağlık Turizmi Projesi", desc: "Çok dilli klinik web sitesi — sağlık turizmi odaklı", theme: THEMES.red },
  { slug: "moda-butik-eticaret-donusumu", title: "Moda Butik E-Ticaret Dönüşümü", desc: "Butik markalar için mobil öncelikli e-ticaret", theme: THEMES.rose },
  { slug: "muhendislik-firmasi-kurumsal-site", title: "Mühendislik Firması Kurumsal Site", desc: "Sanayi ve üretim firması için B2B kurumsal site", theme: THEMES.dark },
  { slug: "restoran-zinciri-siparis-uygulamasi", title: "Restoran Zinciri Sipariş Uygulaması", desc: "Çok şubeli restoran zinciri için QR siparişi", theme: THEMES.amber },
  { slug: "spor-salonu-uyelik-uygulamasi", title: "Spor Salonu Üyelik Uygulaması", desc: "Fitness merkezi yönetim ve üyelik platformu", theme: THEMES.blue },
  { slug: "yapi-firmasi-crm-kurulumu", title: "Yapı Firması CRM Kurulumu", desc: "İnşaat sektörüne özel CRM ve proje yönetimi", theme: THEMES.olive },
];

async function main() {
  console.log("\n🎨 Mockup görsel üretimi başlatılıyor...\n");

  // ─── ÜRÜN GÖRSELLERİ ─────────────────────────────────────
  console.log("📦 Ürün görselleri...");
  for (const p of PRODUCTS) {
    const theme = PRODUCT_THEME_MAP[p.slug] ?? THEMES.green;
    await write(`urunler/${p.slug}-kapak.svg`, makeCoverSvg(p.slug, p.name, p.sub, theme));
    await write(`urunler/${p.slug}-masaustu.svg`, makeDesktopSvg(p.slug, p.name, theme));
    await write(`urunler/${p.slug}-mobil.svg`, mobileMockup(p.slug, p.name, theme));
    await write(`urunler/${p.slug}-tablet.svg`, makeTabletSvg(p.slug, p.name, theme));
    await write(`urunler/${p.slug}-panel.svg`, makePanelSvg(p.slug, p.name, theme));
  }

  // ─── PORTFÖY GÖRSELLERİ ──────────────────────────────────
  console.log("\n🖼 Portföy görselleri...");
  for (const item of PORTFOLIO_ITEMS) {
    await write(`portfoy/${item.slug}.svg`, makePortfolioSvg(item.title, item.desc, item.theme));
    await write(`portfoy/${item.slug}-1.svg`, makePortfolioSvg(item.title, item.desc, item.theme, 1200, 800));
    await write(`portfoy/${item.slug}-2.svg`, makePortfolioSvg(item.title, item.desc, item.theme, 800, 600));
  }

  // ─── AJANS GÖRSELLERİ ────────────────────────────────────
  console.log("\n🏢 Ajans görselleri...");
  const ajansTheme = THEMES.green;
  for (const [name, fn] of Object.entries(AGENCY_IMAGES)) {
    await write(`ajans/${name}.svg`, fn(ajansTheme));
  }

  console.log("\n✅ Tüm görseller başarıyla oluşturuldu!");
  console.log(`   Toplam: ${PRODUCTS.length * 5} ürün + ${PORTFOLIO_ITEMS.length * 3} portföy + ${Object.keys(AGENCY_IMAGES).length} ajans görseli`);
}

main().catch(console.error);
