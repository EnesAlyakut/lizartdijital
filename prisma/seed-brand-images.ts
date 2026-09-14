import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Ana sayfadaki ajans tanıtımı ve "ne yapıyoruz" bölümü için görseller.
 *
 * Gerçek fotoğraf yerine, markanın koyu renk paletiyle çizilmiş soyut
 * illüstrasyonlar üretilir. Böylece hem dış servise bağımlılık olmaz hem de
 * olmayan bir ofis / ekip fotoğrafı varmış gibi gösterilmez.
 * Gerçek kullanımda bu dosyaların yerine kendi stüdyo ve proje fotoğraflarınız konur.
 */

/* Koyu tema paleti — src/app/globals.css ile aynı değerler */
const BG = "#f3f5f1";        // bölüm zemini (kırık beyaz)
const SURFACE = "#ffffff";   // kart / panel
const SURFACE_HI = "#eaeee7"; // ikincil panel
const DEEP = "#232a22";      // cihaz gövdesi, koyu
const LINE = "#c6cec2";      // kenarlık
const TXT = "#141a14";       // başlık çubuğu
const TXT_DIM = "#6b7569";   // gövde metni çubuğu
const BRAND = "#558053";     // marka yeşili (logodan)
const BRAND_HI = "#6b9268";  // açık yeşil
const BRAND_DEEP = "#cfe1cd"; // yeşil dolgu (açık)
const WARN = "#b8801a";

const OUT = path.join(process.cwd(), "public", "gorseller", "ajans");

async function write(name: string, svg: string) {
  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(path.join(OUT, `${name}.svg`), svg, "utf8");
  return `/gorseller/ajans/${name}.svg`;
}

function frame(w: number, h: number, body: string, bg = BG) {
  // Düz zemin yerine hafif degrade + tüm kompozisyona ortak yumuşak gölge:
  // illüstrasyonlar "boş ve soluk" değil, katmanlı görünür.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="lz-bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="55%" stop-color="${SURFACE}"/>
      <stop offset="100%" stop-color="${bg}"/>
    </linearGradient>
    <filter id="lz-sh" x="-12%" y="-12%" width="124%" height="128%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#141a14" flood-opacity="0.13"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#lz-bg)"/>
  <g filter="url(#lz-sh)">${body}</g>
</svg>`;
}

/* ------------------------------------------------ Ajans tanıtım görselleri */

/** Çalışma alanı: iki ekran, üzerinde tasarım ve kod görünümü. */
function studioSvg() {
  return frame(
    900,
    620,
    `
  <circle cx="750" cy="110" r="150" fill="${BRAND_DEEP}" opacity="0.5"/>

  <!-- masa -->
  <rect x="60" y="470" width="780" height="12" rx="6" fill="${LINE}"/>
  <rect x="150" y="482" width="14" height="66" fill="${SURFACE}"/>
  <rect x="736" y="482" width="14" height="66" fill="${SURFACE}"/>

  <!-- büyük ekran: tasarım -->
  <rect x="110" y="128" width="440" height="302" rx="14" fill="${DEEP}" stroke="${LINE}"/>
  <rect x="122" y="140" width="416" height="278" rx="8" fill="${SURFACE}"/>
  <rect x="122" y="140" width="416" height="26" rx="8" fill="${SURFACE_HI}"/>
  <rect x="122" y="158" width="416" height="8" fill="${SURFACE_HI}"/>
  <circle cx="140" cy="153" r="4" fill="${LINE}"/><circle cx="154" cy="153" r="4" fill="${LINE}"/><circle cx="168" cy="153" r="4" fill="${LINE}"/>
  <rect x="140" y="192" width="152" height="16" rx="6" fill="${TXT}"/>
  <rect x="140" y="220" width="220" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.85"/>
  <rect x="140" y="238" width="178" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>
  <rect x="140" y="266" width="98" height="28" rx="14" fill="${BRAND}"/>
  <rect x="140" y="316" width="120" height="84" rx="10" fill="${SURFACE_HI}"/>
  <rect x="272" y="316" width="120" height="84" rx="10" fill="${SURFACE_HI}"/>
  <rect x="404" y="316" width="120" height="84" rx="10" fill="${BRAND_DEEP}"/>
  <rect x="330" y="430" width="60" height="40" fill="${SURFACE}"/>
  <rect x="286" y="464" width="148" height="10" rx="5" fill="${SURFACE}"/>

  <!-- küçük ekran: kod -->
  <rect x="586" y="180" width="252" height="250" rx="14" fill="${DEEP}" stroke="${LINE}"/>
  <rect x="596" y="190" width="232" height="230" rx="8" fill="${SURFACE}"/>
  ${[0, 1, 2, 3, 4, 5, 6]
    .map((i) => {
      const w = [120, 86, 150, 64, 108, 140, 78][i];
      const c = i % 3 === 0 ? BRAND_HI : TXT_DIM;
      return `<rect x="${614 + (i % 2) * 14}" y="${212 + i * 26}" width="${w}" height="9" rx="4.5" fill="${c}" opacity="${i % 3 === 0 ? 1 : 0.7}"/>`;
    })
    .join("")}
  <rect x="688" y="430" width="48" height="40" fill="${SURFACE}"/>
  <rect x="652" y="464" width="120" height="10" rx="5" fill="${SURFACE}"/>

  <!-- klavye ve kupa -->
  <rect x="230" y="498" width="220" height="42" rx="10" fill="${SURFACE}" stroke="${LINE}"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${244 + i * 34}" y="510" width="24" height="8" rx="4" fill="${LINE}"/>`).join("")}
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${258 + i * 34}" y="524" width="24" height="8" rx="4" fill="${LINE}"/>`).join("")}
  <rect x="500" y="502" width="44" height="38" rx="8" fill="${BRAND}"/>
  <path d="M544 512h14a9 9 0 010 18h-14z" fill="none" stroke="${BRAND}" stroke-width="5"/>
`,
    BG,
  );
}

/** Süreç panosu: aşamalara bölünmüş kartlar ve ilerleme çizgisi. */
function processSvg() {
  const cols = [
    { x: 60, w: 52, cards: 2, tone: SURFACE_HI },
    { x: 250, w: 62, cards: 3, tone: BRAND_DEEP },
    { x: 440, w: 78, cards: 2, tone: SURFACE_HI },
    { x: 630, w: 44, cards: 1, tone: BRAND_DEEP },
  ];
  return frame(
    820,
    520,
    `
  <circle cx="110" cy="80" r="120" fill="${BRAND_DEEP}" opacity="0.5"/>
  ${cols
    .map(
      (c) => `
    <rect x="${c.x}" y="60" width="150" height="${120 + c.cards * 74}" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
    <rect x="${c.x + 18}" y="84" width="${c.w}" height="11" rx="5.5" fill="${TXT}"/>
    ${Array.from({ length: c.cards })
      .map(
        (_, i) => `
      <rect x="${c.x + 16}" y="${118 + i * 74}" width="118" height="58" rx="10" fill="${c.tone}"/>
      <rect x="${c.x + 30}" y="${134 + i * 74}" width="72" height="9" rx="4.5" fill="${TXT_DIM}"/>
      <rect x="${c.x + 30}" y="${150 + i * 74}" width="48" height="8" rx="4" fill="${TXT_DIM}" opacity="0.5"/>`,
      )
      .join("")}`,
    )
    .join("")}

  <path d="M100 470 H720" stroke="${LINE}" stroke-width="6" stroke-linecap="round"/>
  <path d="M100 470 H520" stroke="${BRAND}" stroke-width="6" stroke-linecap="round"/>
  ${[100, 240, 380, 520, 660]
    .map(
      (x, i) =>
        `<circle cx="${x}" cy="470" r="11" fill="${i < 4 ? BRAND : SURFACE}" stroke="${i < 4 ? BRAND_HI : LINE}" stroke-width="3"/>`,
    )
    .join("")}
`,
    BG,
  );
}

/** Sonuç panosu: göstergeler ve yükselen grafik. */
function resultsSvg() {
  const bars = [70, 110, 95, 150, 175, 220];
  return frame(
    820,
    520,
    `
  <circle cx="700" cy="430" r="140" fill="${BRAND_DEEP}" opacity="0.5"/>
  <rect x="70" y="60" width="680" height="380" rx="18" fill="${SURFACE}" stroke="${LINE}"/>
  <rect x="104" y="96" width="150" height="13" rx="6.5" fill="${TXT}"/>
  <rect x="104" y="122" width="228" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>

  ${[0, 1, 2]
    .map(
      (i) => `
    <rect x="${104 + i * 152}" y="156" width="132" height="76" rx="12" fill="${SURFACE_HI}"/>
    <rect x="${120 + i * 152}" y="176" width="${[64, 48, 72][i]}" height="15" rx="7.5" fill="${BRAND_HI}"/>
    <rect x="${120 + i * 152}" y="202" width="88" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.85"/>`,
    )
    .join("")}

  ${bars
    .map(
      (h, i) =>
        `<rect x="${112 + i * 62}" y="${400 - h}" width="40" height="${h}" rx="8" fill="${i === bars.length - 1 ? BRAND_HI : BRAND}" opacity="${i === bars.length - 1 ? 1 : 0.55}"/>`,
    )
    .join("")}
  <path d="M132 ${400 - bars[0]} L${112 + 5 * 62 + 20} ${400 - bars[5] - 26}" stroke="${TXT_DIM}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 12"/>
  <circle cx="${112 + 5 * 62 + 20}" cy="${400 - bars[5] - 26}" r="9" fill="${BRAND_HI}"/>

  <path d="M104 400 H716" stroke="${LINE}" stroke-width="3"/>
  <rect x="536" y="156" width="180" height="76" rx="12" fill="${DEEP}" stroke="${LINE}"/>
  <rect x="556" y="176" width="90" height="14" rx="7" fill="${BRAND_HI}"/>
  <rect x="556" y="200" width="126" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>
`,
    BG,
  );
}

/* ------------------------------------------------- "Ne yapıyoruz" görselleri */

/** Web tasarım: tarayıcı penceresi ve yerleşim blokları. */
function webSvg() {
  return frame(
    640,
    440,
    `
  <rect x="60" y="60" width="520" height="320" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  <rect x="60" y="60" width="520" height="34" rx="14" fill="${SURFACE_HI}"/>
  <rect x="60" y="80" width="520" height="14" fill="${SURFACE_HI}"/>
  <circle cx="84" cy="77" r="5" fill="${LINE}"/><circle cx="102" cy="77" r="5" fill="${LINE}"/><circle cx="120" cy="77" r="5" fill="${LINE}"/>
  <rect x="150" y="70" width="180" height="14" rx="7" fill="${LINE}"/>
  <rect x="88" y="122" width="200" height="20" rx="8" fill="${TXT}"/>
  <rect x="88" y="156" width="280" height="10" rx="5" fill="${TXT_DIM}" opacity="0.82"/>
  <rect x="88" y="176" width="230" height="10" rx="5" fill="${TXT_DIM}" opacity="0.5"/>
  <rect x="88" y="208" width="114" height="34" rx="17" fill="${BRAND}"/>
  <rect x="392" y="122" width="160" height="120" rx="12" fill="${BRAND_DEEP}"/>
  ${[0, 1, 2]
    .map(
      (i) => `<rect x="${88 + i * 160}" y="272" width="140" height="80" rx="12" fill="${SURFACE_HI}"/>
  <rect x="${104 + i * 160}" y="292" width="72" height="10" rx="5" fill="${BRAND_HI}" opacity="0.8"/>
  <rect x="${104 + i * 160}" y="310" width="100" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>`,
    )
    .join("")}
`,
  );
}

/** E-ticaret: ürün ızgarası ve sepet kartı. */
function commerceSvg() {
  return frame(
    640,
    440,
    `
  <rect x="60" y="60" width="380" height="320" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  ${[0, 1, 2, 3]
    .map((i) => {
      const x = 88 + (i % 2) * 176;
      const y = 90 + Math.floor(i / 2) * 146;
      return `<rect x="${x}" y="${y}" width="148" height="122" rx="12" fill="${SURFACE_HI}"/>
      <rect x="${x + 14}" y="${y + 14}" width="120" height="56" rx="8" fill="${i === 0 ? BRAND_DEEP : LINE}"/>
      <rect x="${x + 14}" y="${y + 80}" width="84" height="10" rx="5" fill="${TXT_DIM}" opacity="0.8"/>
      <rect x="${x + 14}" y="${y + 98}" width="52" height="10" rx="5" fill="${BRAND_HI}"/>`;
    })
    .join("")}

  <rect x="400" y="130" width="184" height="200" rx="14" fill="${DEEP}" stroke="${LINE}"/>
  <path d="M424 168h12l9 52a10 10 0 0010 8h38a10 10 0 0010-9l6-38h-64" fill="none" stroke="${BRAND_HI}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="452" cy="240" r="6" fill="${BRAND_HI}"/><circle cx="490" cy="240" r="6" fill="${BRAND_HI}"/>
  <rect x="424" y="266" width="88" height="11" rx="5.5" fill="${TXT_DIM}"/>
  <rect x="424" y="288" width="136" height="26" rx="13" fill="${BRAND}"/>
`,
  );
}

/** Mobil uygulama: iki telefon. */
function mobileAppSvg() {
  const phone = (x: number, y: number, scale: number, accent: boolean) => `
    <g transform="translate(${x} ${y}) scale(${scale})">
      <rect width="180" height="330" rx="28" fill="${accent ? BRAND : DEEP}" stroke="${LINE}"/>
      <rect x="8" y="8" width="164" height="314" rx="22" fill="${SURFACE}"/>
      <rect x="66" y="18" width="48" height="8" rx="4" fill="${SURFACE_HI}"/>
      <rect x="24" y="46" width="80" height="13" rx="6.5" fill="${TXT}"/>
      <rect x="24" y="70" width="132" height="70" rx="12" fill="${accent ? BRAND_DEEP : SURFACE_HI}"/>
      ${[0, 1, 2]
        .map(
          (i) => `<rect x="24" y="${154 + i * 44}" width="132" height="34" rx="10" fill="${SURFACE_HI}"/>
      <rect x="36" y="${166 + i * 44}" width="60" height="9" rx="4.5" fill="${BRAND_HI}" opacity="0.85"/>`,
        )
        .join("")}
      <rect x="24" y="290" width="132" height="22" rx="11" fill="${accent ? BRAND_HI : BRAND}"/>
    </g>`;
  return frame(
    640,
    440,
    `
  <circle cx="470" cy="150" r="120" fill="${BRAND_DEEP}" opacity="0.85"/>
  ${phone(120, 70, 0.9, false)}
  ${phone(320, 40, 1.05, true)}
`,
  );
}

/** Özel yazılım: pano, veri akışı ve kod parçacığı. */
function softwareSvg() {
  return frame(
    640,
    440,
    `
  <rect x="60" y="60" width="330" height="200" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  <rect x="84" y="86" width="110" height="12" rx="6" fill="${TXT}"/>
  <path d="M84 220 L140 170 L196 196 L252 130 L308 158 L364 104"
        fill="none" stroke="${BRAND_HI}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  ${[
    [84, 220],
    [140, 170],
    [196, 196],
    [252, 130],
    [308, 158],
    [364, 104],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${SURFACE}" stroke="${BRAND_HI}" stroke-width="3"/>`)
    .join("")}

  <rect x="410" y="60" width="170" height="200" rx="14" fill="${DEEP}" stroke="${LINE}"/>
  ${[0, 1, 2, 3, 4, 5]
    .map(
      (i) =>
        `<rect x="${430 + (i % 2) * 12}" y="${88 + i * 26}" width="${[92, 60, 108, 48, 84, 70][i]}" height="9" rx="4.5" fill="${i % 3 === 0 ? BRAND_HI : TXT_DIM}" opacity="${i % 3 === 0 ? 1 : 0.7}"/>`,
    )
    .join("")}

  ${[0, 1, 2]
    .map(
      (i) => `<rect x="${74 + i * 176}" y="300" width="140" height="70" rx="12" fill="${i === 1 ? BRAND_DEEP : SURFACE}" stroke="${LINE}"/>
  <rect x="${92 + i * 176}" y="322" width="76" height="10" rx="5" fill="${TXT_DIM}"/>
  <rect x="${92 + i * 176}" y="342" width="52" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.5"/>`,
    )
    .join("")}
  ${[0, 1]
    .map(
      (i) => `<path d="M${214 + i * 176} 335 H${250 + i * 176}" stroke="${BRAND_HI}" stroke-width="3" stroke-linecap="round"/>
  <path d="M${244 + i * 176} 329 l8 6 -8 6" fill="none" stroke="${BRAND_HI}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("")}
`,
  );
}

/** SEO ve reklam: arama çubuğu, sonuçlar ve yükselen grafik. */
function growthSvg() {
  return frame(
    640,
    440,
    `
  <rect x="60" y="60" width="520" height="320" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  <rect x="88" y="92" width="330" height="34" rx="17" fill="${SURFACE_HI}"/>
  <circle cx="112" cy="109" r="9" fill="none" stroke="${TXT_DIM}" stroke-width="3"/>
  <path d="M119 116 l10 10" stroke="${TXT_DIM}" stroke-width="3" stroke-linecap="round"/>
  <rect x="136" y="103" width="150" height="11" rx="5.5" fill="${TXT_DIM}" opacity="0.82"/>
  <rect x="440" y="92" width="112" height="34" rx="17" fill="${BRAND}"/>

  ${[0, 1, 2]
    .map(
      (i) => `<rect x="88" y="${152 + i * 44}" width="${[300, 240, 270][i]}" height="12" rx="6" fill="${i === 0 ? TXT : TXT_DIM}" opacity="${i === 0 ? 1 : 0.6}"/>
  <rect x="88" y="${172 + i * 44}" width="${[190, 150, 210][i]}" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>`,
    )
    .join("")}

  ${[46, 74, 62, 104, 132]
    .map(
      (h, i) =>
        `<rect x="${418 + i * 32}" y="${340 - h}" width="20" height="${h}" rx="6" fill="${i === 4 ? BRAND_HI : BRAND}" opacity="${i === 4 ? 1 : 0.55}"/>`,
    )
    .join("")}
  <path d="M430 300 L546 208" stroke="${TXT_DIM}" stroke-width="3" stroke-linecap="round"/>
  <path d="M528 208 h18 v18" fill="none" stroke="${TXT_DIM}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  );
}

/** Marka ve tasarım: tipografi örneği, renk paleti ve logo kartı. */
function brandSvg() {
  const swatches = [TXT, BRAND, BRAND_HI, BRAND_DEEP, WARN];
  return frame(
    640,
    440,
    `
  <rect x="60" y="60" width="250" height="320" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  <text x="92" y="190" font-family="Georgia,serif" font-size="120" font-weight="700" fill="${TXT}">Aa</text>
  <rect x="92" y="226" width="180" height="11" rx="5.5" fill="${TXT_DIM}" opacity="0.82"/>
  <rect x="92" y="250" width="140" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.85"/>
  <rect x="92" y="286" width="118" height="34" rx="17" fill="${BRAND}"/>

  <rect x="336" y="60" width="244" height="150" rx="14" fill="${SURFACE}" stroke="${LINE}"/>
  <rect x="366" y="88" width="120" height="11" rx="5.5" fill="${TXT}"/>
  ${swatches
    .map((c) => `<circle cx="0" cy="0" r="20" fill="${c}" stroke="${LINE}" stroke-width="1.5"/>`)
    .map((s, i) => s.replace('cx="0" cy="0"', `cx="${374 + i * 46}" cy="140"`))
    .join("")}

  <rect x="336" y="230" width="244" height="150" rx="14" fill="${DEEP}" stroke="${LINE}"/>
  <rect x="370" y="266" width="68" height="68" rx="16" fill="${BRAND}"/>
  <text x="392" y="313" font-family="system-ui,Arial" font-size="34" font-weight="700" fill="#ffffff">L</text>
  <rect x="456" y="284" width="96" height="13" rx="6.5" fill="${TXT}"/>
  <rect x="456" y="308" width="70" height="9" rx="4.5" fill="${TXT_DIM}" opacity="0.82"/>
`,
  );
}

/** Ana sayfa görsellerini üretir ve yollarını döner. */
export async function generateBrandImages() {
  return {
    studio: await write("studyo", studioSvg()),
    process: await write("surec", processSvg()),
    results: await write("sonuclar", resultsSvg()),
    web: await write("hizmet-web", webSvg()),
    commerce: await write("hizmet-eticaret", commerceSvg()),
    mobile: await write("hizmet-mobil", mobileAppSvg()),
    software: await write("hizmet-yazilim", softwareSvg()),
    growth: await write("hizmet-buyume", growthSvg()),
    brand: await write("hizmet-marka", brandSvg()),
  };
}
