import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "gorseller", "ajans");

const FILES = {
  "hizmet-video-1.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0f0f1a"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="40" width="520" height="290" rx="14" fill="#111122"/>
  <rect x="80" y="60" width="480" height="250" rx="8" fill="#0a0a18"/>
  <circle cx="320" cy="185" r="50" fill="#3ed57f" fill-opacity="0.15"/>
  <polygon points="305,165 305,205 345,185" fill="#3ed57f"/>
  <text x="290" y="260" font-family="monospace" font-size="11" fill="#3ed57f" fill-opacity="0.5">01:24:36 / 03:00:00</text>
  <rect x="60" y="340" width="520" height="60" rx="10" fill="#1e1e30"/>
  <rect x="80" y="358" width="320" height="6" rx="3" fill="#3ed57f" fill-opacity="0.3"/>
  <rect x="80" y="358" width="150" height="6" rx="3" fill="#3ed57f"/>
  <circle cx="416" cy="361" r="8" fill="#3ed57f"/>
  <rect x="436" y="356" width="36" height="10" rx="5" fill="#2a2a40"/>
  <rect x="480" y="356" width="36" height="10" rx="5" fill="#2a2a40"/>
  <rect x="524" y="356" width="36" height="10" rx="5" fill="#2a2a40"/>
  <text x="80" y="390" font-family="monospace" font-size="11" fill="#3ed57f" fill-opacity="0.7">00:02:34</text>
  <text x="524" y="390" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.4">4K</text>
  <rect x="400" y="50" width="50" height="22" rx="11" fill="#ef4444"/>
  <circle cx="412" cy="61" r="5" fill="#ffffff"/>
  <text x="420" y="65" font-family="system-ui" font-size="11" font-weight="700" fill="#ffffff">REC</text>
</svg>`,

  "hizmet-video-2.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="180" y="120" width="200" height="140" rx="16" fill="#232a22"/>
  <rect x="196" y="136" width="168" height="108" rx="8" fill="#1a1a1a"/>
  <circle cx="280" cy="190" r="44" fill="#333" stroke="#444" stroke-width="4"/>
  <circle cx="280" cy="190" r="30" fill="#222"/>
  <circle cx="280" cy="190" r="18" fill="#111"/>
  <circle cx="274" cy="184" r="4" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="148" y="155" width="36" height="70" rx="8" fill="#1a1a1a"/>
  <line x1="280" y1="260" x2="220" y2="380" stroke="#888" stroke-width="4"/>
  <line x1="280" y1="260" x2="280" y2="380" stroke="#888" stroke-width="4"/>
  <line x1="280" y1="260" x2="340" y2="380" stroke="#888" stroke-width="4"/>
  <rect x="250" y="253" width="60" height="10" rx="5" fill="#666"/>
  <rect x="400" y="80" width="100" height="60" rx="8" fill="#fef3c7"/>
  <rect x="420" y="64" width="6" height="16" fill="#888"/>
  <rect x="460" y="64" width="6" height="16" fill="#888"/>
  <rect x="440" y="56" width="4" height="16" fill="#888"/>
  <circle cx="450" cy="110" r="20" fill="#fbbf24" fill-opacity="0.4"/>
  <rect x="390" y="160" width="90" height="30" rx="15" fill="#ef4444"/>
  <circle cx="408" cy="175" r="6" fill="#ffffff"/>
  <text x="420" y="179" font-family="system-ui" font-size="12" font-weight="700" fill="#ffffff">REC</text>
  <rect x="490" y="120" width="24" height="60" rx="12" fill="#555"/>
  <rect x="496" y="88" width="12" height="32" rx="6" fill="#888"/>
  <text x="60" y="420" font-family="system-ui" font-size="11" fill="#888">Profesyonel çekim ekibi ile kurumsal tanıtım videoları</text>
</svg>`,

  "hizmet-seo-analiz-1.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="40" width="520" height="50" rx="25" fill="#ffffff" stroke="#d4d4d4" stroke-width="2"/>
  <circle cx="102" cy="65" r="12" fill="none" stroke="#888" stroke-width="2.5"/>
  <line x1="110" y1="73" x2="118" y2="81" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="128" y="56" width="300" height="18" rx="6" fill="#e8e8e8"/>
  <rect x="524" y="50" width="50" height="30" rx="15" fill="#3ed57f"/>
  <text x="535" y="69" font-family="system-ui" font-size="12" font-weight="700" fill="#fff">Ara</text>
  <rect x="60" y="108" width="520" height="72" rx="10" fill="#f0fdf4" stroke="#3ed57f" stroke-width="2"/>
  <text x="80" y="132" font-family="system-ui" font-size="11" fill="#888">#1 siteniz.com</text>
  <rect x="80" y="140" width="280" height="14" rx="4" fill="#2563eb" fill-opacity="0.7"/>
  <rect x="80" y="160" width="380" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="520" y="120" width="50" height="22" rx="11" fill="#3ed57f"/>
  <text x="528" y="134" font-family="system-ui" font-size="9" font-weight="700" fill="#fff">1. SIRA</text>
  <rect x="60" y="192" width="520" height="60" rx="10" fill="#ffffff"/>
  <text x="80" y="214" font-family="system-ui" font-size="11" fill="#aaa">#2 rakipsite.com</text>
  <rect x="80" y="222" width="240" height="12" rx="4" fill="#d4d4d4"/>
  <rect x="80" y="238" width="340" height="9" rx="4" fill="#e8e8e8"/>
  <rect x="60" y="264" width="520" height="60" rx="10" fill="#ffffff"/>
  <text x="80" y="286" font-family="system-ui" font-size="11" fill="#aaa">#3 diger.com</text>
  <rect x="80" y="294" width="220" height="12" rx="4" fill="#d4d4d4"/>
  <rect x="80" y="310" width="300" height="9" rx="4" fill="#e8e8e8"/>
  <rect x="60" y="338" width="160" height="72" rx="10" fill="#ffffff"/>
  <text x="80" y="368" font-family="system-ui" font-size="22" font-weight="800" fill="#0f3d1a">+340%</text>
  <rect x="80" y="376" width="110" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="240" y="338" width="160" height="72" rx="10" fill="#ffffff"/>
  <text x="260" y="368" font-family="system-ui" font-size="22" font-weight="800" fill="#0f3d1a">128</text>
  <rect x="260" y="376" width="110" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="420" y="338" width="160" height="72" rx="10" fill="#ffffff"/>
  <text x="440" y="368" font-family="system-ui" font-size="22" font-weight="800" fill="#0f3d1a">4.8★</text>
  <rect x="440" y="376" width="110" height="10" rx="4" fill="#d4d4d4"/>
</svg>`,

  "hizmet-seo-analiz-2.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="40" width="520" height="48" rx="10" fill="#0f3d1a"/>
  <text x="80" y="68" font-family="system-ui" font-size="14" font-weight="700" fill="#ffffff">SEO Denetim Raporu</text>
  <rect x="460" y="52" width="100" height="24" rx="12" fill="#3ed57f"/>
  <text x="472" y="68" font-family="system-ui" font-size="11" font-weight="700" fill="#0f3d1a">Puan: 94/100</text>
  <rect x="60" y="108" width="520" height="40" rx="8" fill="#ffffff"/>
  <text x="80" y="133" font-family="system-ui" font-size="12" fill="#333">Teknik SEO</text>
  <rect x="220" y="120" width="260" height="14" rx="7" fill="#e8e8e8"/>
  <rect x="220" y="120" width="234" height="14" rx="7" fill="#3ed57f"/>
  <text x="490" y="132" font-family="system-ui" font-size="11" font-weight="700" fill="#0f3d1a">90%</text>
  <rect x="60" y="160" width="520" height="40" rx="8" fill="#ffffff"/>
  <text x="80" y="185" font-family="system-ui" font-size="12" fill="#333">İçerik Kalitesi</text>
  <rect x="220" y="172" width="260" height="14" rx="7" fill="#e8e8e8"/>
  <rect x="220" y="172" width="247" height="14" rx="7" fill="#3ed57f"/>
  <text x="490" y="184" font-family="system-ui" font-size="11" font-weight="700" fill="#0f3d1a">95%</text>
  <rect x="60" y="212" width="520" height="40" rx="8" fill="#ffffff"/>
  <text x="80" y="237" font-family="system-ui" font-size="12" fill="#333">Sayfa Hızı</text>
  <rect x="220" y="224" width="260" height="14" rx="7" fill="#e8e8e8"/>
  <rect x="220" y="224" width="221" height="14" rx="7" fill="#f59e0b"/>
  <text x="490" y="236" font-family="system-ui" font-size="11" font-weight="700" fill="#f59e0b">85%</text>
  <rect x="60" y="264" width="520" height="40" rx="8" fill="#ffffff"/>
  <text x="80" y="289" font-family="system-ui" font-size="12" fill="#333">Backlink Profili</text>
  <rect x="220" y="276" width="260" height="14" rx="7" fill="#e8e8e8"/>
  <rect x="220" y="276" width="260" height="14" rx="7" fill="#3ed57f"/>
  <text x="490" y="288" font-family="system-ui" font-size="11" font-weight="700" fill="#0f3d1a">100%</text>
  <rect x="60" y="320" width="520" height="100" rx="10" fill="#ffffff"/>
  <text x="80" y="344" font-family="system-ui" font-size="12" font-weight="600" fill="#333">Organik Trafik Büyümesi</text>
  <polyline points="80,400 160,385 240,370 320,355 400,330 480,310 560,290" fill="none" stroke="#3ed57f" stroke-width="2.5" stroke-linecap="round"/>
  <polyline points="80,400 160,385 240,370 320,355 400,330 480,310 560,290 560,410 80,410" fill="#3ed57f" fill-opacity="0.1" stroke="none"/>
</svg>`,

  "hizmet-site-one-cikarma-1.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <text x="60" y="48" font-family="system-ui" font-size="13" font-weight="700" fill="#aaa">ÖNCE</text>
  <text x="370" y="48" font-family="system-ui" font-size="13" font-weight="700" fill="#3ed57f">SONRA</text>
  <rect x="60" y="60" width="260" height="340" rx="12" fill="#ffffff" stroke="#e8e8e8" stroke-width="2"/>
  <rect x="72" y="72" width="236" height="32" rx="6" fill="#f0f0ef"/>
  <circle cx="92" cy="88" r="5" fill="#ff5f57"/>
  <circle cx="108" cy="88" r="5" fill="#febc2e"/>
  <circle cx="124" cy="88" r="5" fill="#28c840"/>
  <rect x="80" y="116" width="220" height="14" rx="4" fill="#e8e8e8" fill-opacity="0.4"/>
  <rect x="80" y="136" width="160" height="12" rx="4" fill="#e8e8e8" fill-opacity="0.3"/>
  <rect x="80" y="160" width="220" height="80" rx="8" fill="#f5f5f5"/>
  <rect x="80" y="256" width="100" height="12" rx="4" fill="#e8e8e8" fill-opacity="0.4"/>
  <rect x="80" y="276" width="220" height="10" rx="4" fill="#e8e8e8" fill-opacity="0.3"/>
  <rect x="80" y="360" width="80" height="24" rx="12" fill="#e8e8e8"/>
  <rect x="96" y="112" width="60" height="16" rx="4" fill="#f5f5f5"/>
  <rect x="96" y="112" width="15" height="16" rx="4" fill="#f59e0b"/>
  <text x="162" y="124" font-family="system-ui" font-size="10" fill="#f59e0b">8.2s</text>
  <text x="300" y="220" font-family="system-ui" font-size="32" fill="#3ed57f">&#x2192;</text>
  <rect x="340" y="60" width="260" height="340" rx="12" fill="#ffffff" stroke="#3ed57f" stroke-width="2"/>
  <rect x="352" y="72" width="236" height="32" rx="6" fill="#f0fdf4"/>
  <circle cx="372" cy="88" r="5" fill="#ff5f57"/>
  <circle cx="388" cy="88" r="5" fill="#febc2e"/>
  <circle cx="404" cy="88" r="5" fill="#28c840"/>
  <rect x="360" y="112" width="60" height="16" rx="4" fill="#dcfce7"/>
  <rect x="360" y="112" width="54" height="16" rx="4" fill="#3ed57f"/>
  <text x="428" y="124" font-family="system-ui" font-size="10" font-weight="700" fill="#3ed57f">0.8s</text>
  <rect x="360" y="136" width="220" height="12" rx="4" fill="#0f3d1a" fill-opacity="0.15"/>
  <rect x="360" y="156" width="180" height="12" rx="4" fill="#0f3d1a" fill-opacity="0.1"/>
  <rect x="360" y="180" width="220" height="80" rx="8" fill="#d6fae2"/>
  <rect x="360" y="276" width="100" height="12" rx="4" fill="#0f3d1a" fill-opacity="0.2"/>
  <rect x="360" y="296" width="220" height="10" rx="4" fill="#0f3d1a" fill-opacity="0.1"/>
  <rect x="360" y="360" width="80" height="24" rx="12" fill="#3ed57f"/>
</svg>`,

  "hizmet-site-one-cikarma-2.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <text x="60" y="48" font-family="system-ui" font-size="15" font-weight="700" fill="#0f3d1a">Core Web Vitals Optimizasyonu</text>
  <rect x="60" y="68" width="160" height="120" rx="14" fill="#ffffff"/>
  <text x="140" y="108" font-family="system-ui" font-size="36" font-weight="800" text-anchor="middle" fill="#3ed57f">98</text>
  <text x="140" y="128" font-family="system-ui" font-size="11" text-anchor="middle" fill="#888">Performans</text>
  <circle cx="140" cy="116" r="50" fill="none" stroke="#3ed57f" stroke-width="6" stroke-dasharray="280 40"/>
  <rect x="236" y="68" width="160" height="120" rx="14" fill="#ffffff"/>
  <text x="316" y="108" font-family="system-ui" font-size="36" font-weight="800" text-anchor="middle" fill="#3ed57f">100</text>
  <text x="316" y="128" font-family="system-ui" font-size="11" text-anchor="middle" fill="#888">Erişilebilirlik</text>
  <circle cx="316" cy="116" r="50" fill="none" stroke="#3ed57f" stroke-width="6" stroke-dasharray="314 0"/>
  <rect x="412" y="68" width="160" height="120" rx="14" fill="#ffffff"/>
  <text x="492" y="108" font-family="system-ui" font-size="36" font-weight="800" text-anchor="middle" fill="#f59e0b">89</text>
  <text x="492" y="128" font-family="system-ui" font-size="11" text-anchor="middle" fill="#888">SEO</text>
  <circle cx="492" cy="116" r="50" fill="none" stroke="#f59e0b" stroke-width="6" stroke-dasharray="250 60"/>
  <rect x="60" y="210" width="520" height="60" rx="10" fill="#ffffff"/>
  <text x="80" y="246" font-family="system-ui" font-size="13" font-weight="700" fill="#0f3d1a">LCP (Largest Contentful Paint)</text>
  <rect x="340" y="228" width="220" height="16" rx="8" fill="#e8e8e8"/>
  <rect x="340" y="228" width="88" height="16" rx="8" fill="#3ed57f"/>
  <text x="575" y="241" font-family="system-ui" font-size="11" fill="#3ed57f" font-weight="700">1.2s</text>
  <rect x="60" y="282" width="520" height="60" rx="10" fill="#ffffff"/>
  <text x="80" y="318" font-family="system-ui" font-size="13" font-weight="700" fill="#0f3d1a">CLS (Cumulative Layout Shift)</text>
  <rect x="340" y="300" width="220" height="16" rx="8" fill="#e8e8e8"/>
  <rect x="340" y="300" width="22" height="16" rx="8" fill="#3ed57f"/>
  <text x="575" y="313" font-family="system-ui" font-size="11" fill="#3ed57f" font-weight="700">0.02</text>
  <rect x="60" y="354" width="520" height="60" rx="10" fill="#ffffff"/>
  <text x="80" y="390" font-family="system-ui" font-size="13" font-weight="700" fill="#0f3d1a">FID (First Input Delay)</text>
  <rect x="340" y="372" width="220" height="16" rx="8" fill="#e8e8e8"/>
  <rect x="340" y="372" width="44" height="16" rx="8" fill="#3ed57f"/>
  <text x="575" y="385" font-family="system-ui" font-size="11" fill="#3ed57f" font-weight="700">12ms</text>
</svg>`,

  "hizmet-satin-alma-1.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <rect x="60" y="40" width="155" height="240" rx="14" fill="#ffffff" stroke="#e8e8e8" stroke-width="1"/>
  <rect x="60" y="40" width="155" height="56" rx="14" fill="#f3f5f1"/>
  <rect x="60" y="84" width="155" height="12" fill="#f3f5f1"/>
  <text x="80" y="72" font-family="system-ui" font-size="13" font-weight="700" fill="#555">Başlangıç</text>
  <text x="80" y="110" font-family="system-ui" font-size="18" font-weight="800" fill="#0f3d1a">&#x20BA;3.500</text>
  <rect x="80" y="130" width="115" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="80" y="150" width="90" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="80" y="170" width="105" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="80" y="240" width="115" height="28" rx="14" fill="#e8e8e8"/>
  <rect x="233" y="20" width="175" height="280" rx="14" fill="#0f3d1a"/>
  <rect x="283" y="8" width="76" height="20" rx="10" fill="#3ed57f"/>
  <text x="291" y="21" font-family="system-ui" font-size="9" font-weight="700" fill="#0f3d1a">En Popüler</text>
  <text x="253" y="58" font-family="system-ui" font-size="14" font-weight="700" fill="#ffffff">Profesyonel</text>
  <text x="253" y="90" font-family="system-ui" font-size="22" font-weight="800" fill="#3ed57f">&#x20BA;12.900</text>
  <rect x="253" y="110" width="135" height="10" rx="4" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="253" y="130" width="110" height="10" rx="4" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="253" y="150" width="125" height="10" rx="4" fill="#ffffff" fill-opacity="0.3"/>
  <rect x="253" y="170" width="100" height="10" rx="4" fill="#ffffff" fill-opacity="0.2"/>
  <rect x="253" y="250" width="135" height="30" rx="15" fill="#3ed57f"/>
  <text x="285" y="269" font-family="system-ui" font-size="12" font-weight="700" fill="#0f3d1a">Seç &#x2192;</text>
  <rect x="426" y="40" width="155" height="240" rx="14" fill="#ffffff" stroke="#e8e8e8" stroke-width="1"/>
  <rect x="426" y="40" width="155" height="56" rx="14" fill="#f3f5f1"/>
  <rect x="426" y="84" width="155" height="12" fill="#f3f5f1"/>
  <text x="446" y="72" font-family="system-ui" font-size="13" font-weight="700" fill="#555">Kurumsal</text>
  <text x="446" y="110" font-family="system-ui" font-size="18" font-weight="800" fill="#0f3d1a">&#x20BA;24.900</text>
  <rect x="446" y="130" width="115" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="446" y="150" width="90" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="446" y="170" width="105" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="446" y="190" width="80" height="10" rx="4" fill="#e8e8e8"/>
  <rect x="446" y="240" width="115" height="28" rx="14" fill="#e8e8e8"/>
  <rect x="60" y="360" width="520" height="60" rx="12" fill="#ffffff" stroke="#d4d4d4" stroke-width="1"/>
  <text x="80" y="394" font-family="system-ui" font-size="13" fill="#555">Sipariş özeti: Profesyonel Paket</text>
  <rect x="460" y="370" width="100" height="30" rx="15" fill="#3ed57f"/>
  <text x="473" y="389" font-family="system-ui" font-size="12" font-weight="700" fill="#fff">Satın Al</text>
</svg>`,

  "hizmet-satin-alma-2.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" width="640" height="440">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0%" stop-color="#f3f5f1"/><stop offset="55%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f3f5f1"/></linearGradient></defs>
  <rect width="640" height="440" fill="url(#bg)"/>
  <text x="60" y="48" font-family="system-ui" font-size="15" font-weight="700" fill="#0f3d1a">Hizmet Satın Alma Akışı</text>
  <rect x="60" y="68" width="100" height="100" rx="12" fill="#0f3d1a"/>
  <text x="110" y="126" font-family="system-ui" font-size="11" text-anchor="middle" fill="#ffffff">Hizmet</text>
  <text x="110" y="142" font-family="system-ui" font-size="11" text-anchor="middle" fill="#ffffff">Seçin</text>
  <text x="72" y="184" font-family="system-ui" font-size="10" fill="#3ed57f" font-weight="700">1. ADIM</text>
  <text x="176" y="122" font-family="system-ui" font-size="24" fill="#3ed57f">&#x2192;</text>
  <rect x="216" y="68" width="100" height="100" rx="12" fill="#1a5c2b"/>
  <text x="266" y="126" font-family="system-ui" font-size="11" text-anchor="middle" fill="#ffffff">Güvenli</text>
  <text x="266" y="142" font-family="system-ui" font-size="11" text-anchor="middle" fill="#ffffff">Ödeme</text>
  <text x="228" y="184" font-family="system-ui" font-size="10" fill="#3ed57f" font-weight="700">2. ADIM</text>
  <text x="332" y="122" font-family="system-ui" font-size="24" fill="#3ed57f">&#x2192;</text>
  <rect x="372" y="68" width="100" height="100" rx="12" fill="#3ed57f"/>
  <text x="422" y="126" font-family="system-ui" font-size="11" text-anchor="middle" fill="#0f3d1a">Hemen</text>
  <text x="422" y="142" font-family="system-ui" font-size="11" text-anchor="middle" fill="#0f3d1a">Başlayın</text>
  <text x="384" y="184" font-family="system-ui" font-size="10" fill="#0f3d1a" font-weight="700">3. ADIM</text>
  <rect x="60" y="210" width="520" height="200" rx="14" fill="#ffffff"/>
  <text x="80" y="238" font-family="system-ui" font-size="13" font-weight="700" fill="#0f3d1a">Güvenli Alışveriş Garantisi</text>
  <rect x="80" y="256" width="14" height="14" rx="7" fill="#3ed57f"/>
  <rect x="104" y="260" width="200" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="80" y="282" width="14" height="14" rx="7" fill="#3ed57f"/>
  <rect x="104" y="286" width="240" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="80" y="308" width="14" height="14" rx="7" fill="#3ed57f"/>
  <rect x="104" y="312" width="180" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="80" y="334" width="14" height="14" rx="7" fill="#3ed57f"/>
  <rect x="104" y="338" width="220" height="10" rx="4" fill="#d4d4d4"/>
  <rect x="380" y="230" width="170" height="150" rx="10" fill="#f0fdf4"/>
  <text x="465" y="310" font-family="system-ui" font-size="52" text-anchor="middle" fill="#3ed57f">&#x2713;</text>
  <text x="465" y="350" font-family="system-ui" font-size="11" text-anchor="middle" fill="#0f3d1a">100% Güvenli</text>
</svg>`,
};

async function main() {
  for (const [name, content] of Object.entries(FILES)) {
    const fpath = `${OUT}/${name}`;
    await fs.writeFile(fpath, content, "utf8");
    console.log("✓", name);
  }
  console.log("Tüm görseller oluşturuldu!");
}

main().catch(console.error);
