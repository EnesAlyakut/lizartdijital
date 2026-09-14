import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "gorseller", "blog");

const BLOG_IMAGES = {
  "hazir-web-sitesi-mi-ozel-tasarim-mi.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1329"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="readyGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="customGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg1)"/>
  <circle cx="250" cy="180" r="280" fill="#10b981" opacity="0.08" filter="blur(60px)"/>
  <circle cx="950" cy="450" r="320" fill="#6366f1" opacity="0.1" filter="blur(60px)"/>

  <!-- Sol Kart: Hazır Web Sitesi -->
  <g transform="translate(100, 110)" filter="url(#shadow1)">
    <rect width="440" height="450" rx="24" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect width="440" height="54" rx="24" fill="#0f172a"/>
    <rect x="0" y="30" width="440" height="24" fill="#0f172a"/>
    <circle cx="28" cy="27" r="6" fill="#ef4444"/>
    <circle cx="48" cy="27" r="6" fill="#f59e0b"/>
    <circle cx="68" cy="27" r="6" fill="#10b981"/>
    <rect x="94" y="17" width="220" height="20" rx="10" fill="#1e293b"/>
    <text x="110" y="31" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">hazirsablon.com</text>

    <!-- Hazır Site UI Elementleri -->
    <rect x="30" y="80" width="380" height="70" rx="12" fill="url(#readyGrad)" opacity="0.9"/>
    <text x="50" y="112" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#ffffff">HAZIR ŞABLON</text>
    <text x="50" y="132" font-family="system-ui,sans-serif" font-size="12" fill="#d1fae5">Hemen Kurulum · 3 Günde Teslim</text>

    <rect x="30" y="170" width="180" height="110" rx="12" fill="#0f172a"/>
    <rect x="46" y="190" width="80" height="12" rx="6" fill="#38bdf8"/>
    <rect x="46" y="212" width="140" height="8" rx="4" fill="#475569"/>
    <rect x="46" y="228" width="110" height="8" rx="4" fill="#334155"/>
    <rect x="46" y="250" width="70" height="18" rx="9" fill="#10b981"/>

    <rect x="230" y="170" width="180" height="110" rx="12" fill="#0f172a"/>
    <rect x="246" y="190" width="90" height="12" rx="6" fill="#a855f7"/>
    <rect x="246" y="212" width="140" height="8" rx="4" fill="#475569"/>
    <rect x="246" y="228" width="120" height="8" rx="4" fill="#334155"/>
    <rect x="246" y="250" width="70" height="18" rx="9" fill="#6366f1"/>

    <!-- Avantaj Rozeti -->
    <g transform="translate(30, 310)">
      <rect width="380" height="100" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="24" y="35" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#10b981">✓ Bütçe Dostu &amp; Hızlı Yayın</text>
      <text x="24" y="60" font-family="system-ui,sans-serif" font-size="12" fill="#94a3b8">Süreçleri standart olan işletmeler için</text>
      <text x="24" y="80" font-family="system-ui,sans-serif" font-size="12" fill="#94a3b8">en pratik ve ekonomik çözüm.</text>
    </g>
  </g>

  <!-- Ortadaki VS Rozeti -->
  <g transform="translate(565, 300)">
    <circle cx="35" cy="35" r="42" fill="#0f172a" stroke="#475569" stroke-width="3"/>
    <circle cx="35" cy="35" r="34" fill="#1e293b"/>
    <text x="35" y="43" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="900" fill="#f59e0b">VS</text>
  </g>

  <!-- Sağ Kart: Özel Tasarım / Kod -->
  <g transform="translate(660, 110)" filter="url(#shadow1)">
    <rect width="440" height="450" rx="24" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <rect width="440" height="54" rx="24" fill="#0f172a"/>
    <rect x="0" y="30" width="440" height="24" fill="#0f172a"/>
    <circle cx="28" cy="27" r="6" fill="#ef4444"/>
    <circle cx="48" cy="27" r="6" fill="#f59e0b"/>
    <circle cx="68" cy="27" r="6" fill="#10b981"/>
    <rect x="94" y="17" width="220" height="20" rx="10" fill="#1e293b"/>
    <text x="110" y="31" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">ozelyazilim.dev</text>

    <!-- Özel Yazılım UI Elementleri -->
    <rect x="30" y="80" width="380" height="70" rx="12" fill="url(#customGrad)" opacity="0.9"/>
    <text x="50" y="112" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#ffffff">ÖZEL YAZILIM</text>
    <text x="50" y="132" font-family="system-ui,sans-serif" font-size="12" fill="#e0e7ff">Sıfırdan Mimari · Tam Entegrasyon</text>

    <!-- Kod Editörü Görünümü -->
    <rect x="30" y="170" width="380" height="110" rx="12" fill="#0a0f1d"/>
    <text x="46" y="196" font-family="monospace" font-size="12" fill="#38bdf8">const <tspan fill="#f43f5e">app</tspan> = new Architecture({</text>
    <text x="64" y="218" font-family="monospace" font-size="12" fill="#a7f3d0">  customWorkflows: <tspan fill="#f59e0b">true</tspan>,</text>
    <text x="64" y="238" font-family="monospace" font-size="12" fill="#a7f3d0">  fullSourceOwnership: <tspan fill="#f59e0b">true</tspan></text>
    <text x="46" y="258" font-family="monospace" font-size="12" fill="#38bdf8">});</text>

    <!-- Avantaj Rozeti -->
    <g transform="translate(30, 310)">
      <rect width="380" height="100" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="24" y="35" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#a5b4fc">★ Sınırsız Esneklik &amp; Mülkiyet</text>
      <text x="24" y="60" font-family="system-ui,sans-serif" font-size="12" fill="#94a3b8">Özel ERP, entegrasyon ve sıra dışı</text>
      <text x="24" y="80" font-family="system-ui,sans-serif" font-size="12" fill="#94a3b8">iş akışları olan projeler için ideal.</text>
    </g>
  </g>
</svg>`,

  "eticaret-sitesinde-donusum-artiran-7-duzenleme.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#061a12"/>
      <stop offset="50%" stop-color="#062e1d"/>
      <stop offset="100%" stop-color="#021c10"/>
    </linearGradient>
    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg2)"/>
  <circle cx="850" cy="200" r="300" fill="#10b981" opacity="0.1" filter="blur(80px)"/>

  <!-- Sol Panel: E-Ticaret Sepet & Satın Alma Simülasyonu -->
  <g transform="translate(100, 90)">
    <rect width="500" height="495" rx="24" fill="#0f291e" stroke="#1b4d38" stroke-width="2"/>
    <rect width="500" height="54" rx="24" fill="#071b13"/>
    <rect x="0" y="30" width="500" height="24" fill="#071b13"/>
    <circle cx="28" cy="27" r="6" fill="#ef4444"/>
    <circle cx="48" cy="27" r="6" fill="#f59e0b"/>
    <circle cx="68" cy="27" r="6" fill="#10b981"/>
    <text x="94" y="32" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#a7f3d0">Güvenli Ödeme Akışı (Hızlı Checkout)</text>

    <!-- Ürün Kartı -->
    <rect x="30" y="80" width="440" height="90" rx="16" fill="#092017" stroke="#164e37"/>
    <rect x="46" y="96" width="58" height="58" rx="12" fill="#10b981" opacity="0.2"/>
    <text x="75" y="132" text-anchor="middle" font-size="24">🛍️</text>
    <text x="120" y="118" font-family="system-ui,sans-serif" font-size="15" font-weight="700" fill="#ffffff">Premium E-Ticaret Şablonu</text>
    <text x="120" y="138" font-family="system-ui,sans-serif" font-size="12" fill="#6ee7b7">Genişletilmiş Lisans + Kurulum</text>
    <text x="440" y="130" text-anchor="end" font-family="system-ui,sans-serif" font-size="16" font-weight="800" fill="#34d399">₺12.900</text>

    <!-- 1. Kural: Şeffaf Kargo & Hızlı Sipariş -->
    <g transform="translate(30, 190)">
      <rect width="440" height="60" rx="12" fill="#092017"/>
      <circle cx="30" cy="30" r="14" fill="#10b981"/>
      <text x="30" y="35" text-anchor="middle" font-size="12" font-weight="800" fill="#022c19">✓</text>
      <text x="56" y="27" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Ücretsiz ve Hızlı Kargo Bildirimi</text>
      <text x="56" y="45" font-family="system-ui,sans-serif" font-size="11" fill="#6ee7b7">Sürpriz ek maliyet olmadan şeffaf sepet</text>
    </g>

    <!-- 2. Kural: Tek Tıkla Ödeme -->
    <g transform="translate(30, 265)">
      <rect width="440" height="60" rx="12" fill="#092017"/>
      <circle cx="30" cy="30" r="14" fill="#10b981"/>
      <text x="30" y="35" text-anchor="middle" font-size="12" font-weight="800" fill="#022c19">✓</text>
      <text x="56" y="27" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Üyeliksiz Hızlı Sipariş Desteği</text>
      <text x="56" y="45" font-family="system-ui,sans-serif" font-size="11" fill="#6ee7b7">Sepeti terk oranını %38 oranında düşürür</text>
    </g>

    <!-- Satın Al Butonu -->
    <rect x="30" y="350" width="440" height="52" rx="26" fill="#10b981"/>
    <text x="250" y="382" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="800" fill="#022c19">Siparişi Güvenle Tamamla →</text>

    <!-- Güven Damgaları -->
    <text x="250" y="440" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#6ee7b7">🔒 256-Bit SSL · 3D Secure · Anında Teslimat</text>
  </g>

  <!-- Sağ Panel: Dönüşüm Grafiği & İstatistikler -->
  <g transform="translate(650, 110)">
    <rect width="450" height="455" rx="24" fill="#0f291e" stroke="#1b4d38" stroke-width="2"/>
    <text x="36" y="50" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#34d399" letter-spacing="1">DÖNÜŞÜM OPTİMİZASYONU</text>
    <text x="36" y="85" font-family="system-ui,sans-serif" font-size="34" font-weight="900" fill="#ffffff">+%42 Dönüşüm</text>
    <text x="36" y="110" font-family="system-ui,sans-serif" font-size="13" fill="#6ee7b7">Yapılan 7 UX düzenlemesi sonrası ortalama artış</text>

    <!-- Grafik Çizgisi -->
    <g transform="translate(36, 140)">
      <path d="M0,180 L70,160 L140,140 L210,90 L280,60 L350,20 L380,10" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
      <path d="M0,180 L70,160 L140,140 L210,90 L280,60 L350,20 L380,10 L380,200 L0,200 Z" fill="url(#chartGrad)"/>
      <circle cx="380" cy="10" r="7" fill="#34d399"/>
    </g>

    <!-- 3 İstatistik Kutusu -->
    <g transform="translate(36, 360)">
      <rect width="115" height="65" rx="12" fill="#092017"/>
      <text x="57" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#34d399">-%34</text>
      <text x="57" y="50" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Sepet Terk</text>

      <rect x="130" width="115" height="65" rx="12" fill="#092017"/>
      <text x="187" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#34d399">0.8s</text>
      <text x="187" y="50" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Sayfa Hızı</text>

      <rect x="260" width="115" height="65" rx="12" fill="#092017"/>
      <text x="317" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="800" fill="#34d399">2.8x</text>
      <text x="317" y="50" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Mobil Satış</text>
    </g>
  </g>
</svg>`,

  "kucuk-isletmeler-icin-reklam-butcesi.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#180f2b"/>
      <stop offset="50%" stop-color="#241242"/>
      <stop offset="100%" stop-color="#110821"/>
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg3)"/>
  <circle cx="300" cy="300" r="300" fill="#8b5cf6" opacity="0.1" filter="blur(70px)"/>

  <!-- Sol Bölüm: Reklam Kampanyası & Bütçe Yönetimi Dashboard -->
  <g transform="translate(100, 100)">
    <rect width="520" height="475" rx="24" fill="#20133b" stroke="#3c226e" stroke-width="2"/>
    <rect width="520" height="54" rx="24" fill="#14092b"/>
    <rect x="0" y="30" width="520" height="24" fill="#14092b"/>
    <circle cx="28" cy="27" r="6" fill="#ef4444"/>
    <circle cx="48" cy="27" r="6" fill="#f59e0b"/>
    <circle cx="68" cy="27" r="6" fill="#10b981"/>
    <text x="94" y="32" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="#c4b5fd">Google &amp; Meta Ads Bütçe Dağılımı</text>

    <!-- 3 Kampanya Kartı -->
    <g transform="translate(30, 80)">
      <rect width="460" height="70" rx="14" fill="#150b28"/>
      <circle cx="35" cy="35" r="18" fill="#3b82f6"/>
      <text x="35" y="41" text-anchor="middle" font-size="14" font-weight="900" fill="#ffffff">G</text>
      <text x="68" y="30" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Google Arama Ağı (Niyet Trafiği)</text>
      <text x="68" y="50" font-family="system-ui,sans-serif" font-size="11" fill="#a78bfa">Aylık Bütçe: ₺15.000 · ROAS: 4.8x</text>
      <rect x="360" y="24" width="75" height="24" rx="12" fill="#10b981" opacity="0.2"/>
      <text x="397" y="40" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="800" fill="#34d399">AKTİF</text>
    </g>

    <g transform="translate(30, 165)">
      <rect width="460" height="70" rx="14" fill="#150b28"/>
      <circle cx="35" cy="35" r="18" fill="#ec4899"/>
      <text x="35" y="41" text-anchor="middle" font-size="14" font-weight="900" fill="#ffffff">M</text>
      <text x="68" y="30" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Instagram Reels &amp; Hikaye Reklamı</text>
      <text x="68" y="50" font-family="system-ui,sans-serif" font-size="11" fill="#a78bfa">Aylık Bütçe: ₺10.000 · ROAS: 3.9x</text>
      <rect x="360" y="24" width="75" height="24" rx="12" fill="#10b981" opacity="0.2"/>
      <text x="397" y="40" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="800" fill="#34d399">AKTİF</text>
    </g>

    <g transform="translate(30, 250)">
      <rect width="460" height="70" rx="14" fill="#150b28"/>
      <circle cx="35" cy="35" r="18" fill="#8b5cf6"/>
      <text x="35" y="41" text-anchor="middle" font-size="14" font-weight="900" fill="#ffffff">🔄</text>
      <text x="68" y="30" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Yeniden Pazarlama (Retargeting)</text>
      <text x="68" y="50" font-family="system-ui,sans-serif" font-size="11" fill="#a78bfa">Aylık Bütçe: ₺5.000 · ROAS: 6.2x</text>
      <rect x="360" y="24" width="75" height="24" rx="12" fill="#10b981" opacity="0.2"/>
      <text x="397" y="40" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="800" fill="#34d399">AKTİF</text>
    </g>

    <!-- Bütçe Özeti -->
    <g transform="translate(30, 345)">
      <rect width="460" height="95" rx="16" fill="url(#purpleGrad)"/>
      <text x="24" y="36" font-family="system-ui,sans-serif" font-size="13" font-weight="600" fill="#e9d5ff">Önerilen Minimum Başlangıç Bütçesi</text>
      <text x="24" y="74" font-family="system-ui,sans-serif" font-size="28" font-weight="900" fill="#ffffff">₺30.000 <tspan font-size="14" font-weight="500">/ ay</tspan></text>
      <text x="435" y="60" text-anchor="end" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">4.9x Ortalama ROAS</text>
    </g>
  </g>

  <!-- Sağ Bölüm: Metrikler ve Çubuk Grafikler -->
  <g transform="translate(670, 120)">
    <rect width="430" height="435" rx="24" fill="#20133b" stroke="#3c226e" stroke-width="2"/>
    <text x="36" y="50" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#a78bfa" letter-spacing="1">GELİR &amp; GETİRİ ANALİZİ</text>
    <text x="36" y="85" font-family="system-ui,sans-serif" font-size="34" font-weight="900" fill="#ffffff">₺148.500</text>
    <text x="36" y="110" font-family="system-ui,sans-serif" font-size="13" fill="#c4b5fd">Toplam Reklam Kaynaklı Satış Hacmi</text>

    <!-- Çubuk Grafik -->
    <g transform="translate(36, 145)">
      <rect x="0" y="140" width="40" height="80" rx="8" fill="#4c1d95"/>
      <rect x="65" y="100" width="40" height="120" rx="8" fill="#6d28d9"/>
      <rect x="130" y="70" width="40" height="150" rx="8" fill="#7c3aed"/>
      <rect x="195" y="40" width="40" height="180" rx="8" fill="#8b5cf6"/>
      <rect x="260" y="15" width="40" height="205" rx="8" fill="#a78bfa"/>
      <rect x="325" y="0" width="40" height="220" rx="8" fill="#34d399"/>
    </g>

    <!-- Açıklama Notu -->
    <g transform="translate(36, 385)">
      <text x="0" y="15" font-family="system-ui,sans-serif" font-size="12" fill="#c4b5fd">💡 Bütçe kademeli artırılarak reklam körlüğü engellenir.</text>
    </g>
  </g>
</svg>`,

  "mobil-uygulama-yayinlama-sureci.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg4)"/>
  <circle cx="600" cy="300" r="300" fill="#38bdf8" opacity="0.08" filter="blur(80px)"/>

  <!-- Sol Telefon: iOS / App Store -->
  <g transform="translate(220, 90)">
    <rect width="240" height="480" rx="36" fill="#000000" stroke="#334155" stroke-width="4"/>
    <rect x="8" y="8" width="224" height="464" rx="28" fill="#0f172a"/>
    <!-- Çentik -->
    <rect x="80" y="16" width="80" height="18" rx="9" fill="#000000"/>
    <circle cx="140" cy="25" r="3" fill="#1e293b"/>

    <!-- App Store Arayüzü -->
    <rect x="25" y="55" width="48" height="48" rx="12" fill="#0284c7"/>
    <text x="49" y="86" text-anchor="middle" font-size="24">📱</text>
    <text x="82" y="72" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sepetim Mobil</text>
    <text x="82" y="88" font-family="system-ui,sans-serif" font-size="10" fill="#38bdf8">Alışveriş &amp; Mağaza</text>
    <rect x="82" y="94" width="55" height="18" rx="9" fill="#0284c7"/>
    <text x="109" y="106" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="700" fill="#ffffff">YÜKLE</text>

    <!-- Ekran Görüntüsü Önizleme -->
    <rect x="25" y="130" width="190" height="230" rx="14" fill="#1e293b"/>
    <rect x="40" y="150" width="160" height="70" rx="8" fill="#334155"/>
    <rect x="40" y="235" width="75" height="100" rx="8" fill="#334155"/>
    <rect x="125" y="235" width="75" height="100" rx="8" fill="#334155"/>

    <!-- Onay Damgası -->
    <g transform="translate(25, 380)">
      <rect width="190" height="60" rx="12" fill="#0284c7" opacity="0.2" stroke="#0284c7"/>
      <text x="95" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="#38bdf8">✓ App Store Onaylı</text>
      <text x="95" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">Apple Review Geçildi</text>
    </g>
  </g>

  <!-- Ortadaki Yayın Hattı Adımları -->
  <g transform="translate(500, 160)">
    <g transform="translate(0, 0)">
      <circle cx="20" cy="20" r="18" fill="#10b981"/>
      <text x="20" y="25" text-anchor="middle" font-weight="800" fill="#022c19">1</text>
      <text x="50" y="18" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Hesap Kurulumu</text>
      <text x="50" y="34" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Apple &amp; Google Console</text>
    </g>
    <line x1="20" y1="45" x2="20" y2="85" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>

    <g transform="translate(0, 95)">
      <circle cx="20" cy="20" r="18" fill="#10b981"/>
      <text x="20" y="25" text-anchor="middle" font-weight="800" fill="#022c19">2</text>
      <text x="50" y="18" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Derleme &amp; İmzalar</text>
      <text x="50" y="34" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Keystore &amp; Provisioning</text>
    </g>
    <line x1="20" y1="140" x2="20" y2="180" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>

    <g transform="translate(0, 190)">
      <circle cx="20" cy="20" r="18" fill="#10b981"/>
      <text x="20" y="25" text-anchor="middle" font-weight="800" fill="#022c19">3</text>
      <text x="50" y="18" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">İnceleme &amp; Onay</text>
      <text x="50" y="34" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Mağaza İnceleme Süreci</text>
    </g>
    <line x1="20" y1="235" x2="20" y2="275" stroke="#334155" stroke-width="2" stroke-dasharray="4 4"/>

    <g transform="translate(0, 285)">
      <circle cx="20" cy="20" r="18" fill="#38bdf8"/>
      <text x="20" y="25" text-anchor="middle" font-weight="800" fill="#0c4a6e">4</text>
      <text x="50" y="18" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#38bdf8">Canlı Yayın 🚀</text>
      <text x="50" y="34" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">İndirilmeye Hazır</text>
    </g>
  </g>

  <!-- Sağ Telefon: Android / Google Play -->
  <g transform="translate(740, 90)">
    <rect width="240" height="480" rx="36" fill="#000000" stroke="#334155" stroke-width="4"/>
    <rect x="8" y="8" width="224" height="464" rx="28" fill="#0f172a"/>
    <!-- Kamera Deliği -->
    <circle cx="120" cy="22" r="5" fill="#000000"/>

    <!-- Google Play Arayüzü -->
    <rect x="25" y="55" width="48" height="48" rx="12" fill="#059669"/>
    <text x="49" y="86" text-anchor="middle" font-size="24">🛒</text>
    <text x="82" y="72" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Sepetim Mobil</text>
    <text x="82" y="88" font-family="system-ui,sans-serif" font-size="10" fill="#34d399">4.9 ★ · 10B+ İndirme</text>
    <rect x="82" y="94" width="60" height="18" rx="9" fill="#059669"/>
    <text x="112" y="106" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="700" fill="#ffffff">YÜKLE</text>

    <!-- Ekran Görüntüsü Önizleme -->
    <rect x="25" y="130" width="190" height="230" rx="14" fill="#1e293b"/>
    <rect x="40" y="150" width="160" height="70" rx="8" fill="#334155"/>
    <rect x="40" y="235" width="75" height="100" rx="8" fill="#334155"/>
    <rect x="125" y="235" width="75" height="100" rx="8" fill="#334155"/>

    <!-- Onay Damgası -->
    <g transform="translate(25, 380)">
      <rect width="190" height="60" rx="12" fill="#059669" opacity="0.2" stroke="#059669"/>
      <text x="95" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="800" fill="#34d399">✓ Google Play Onaylı</text>
      <text x="95" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">Play Protect Taraması Tamam</text>
    </g>
  </g>
</svg>`,

  "teknik-seo-kontrol-listesi.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#022014"/>
      <stop offset="50%" stop-color="#063a25"/>
      <stop offset="100%" stop-color="#01140c"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg5)"/>
  <circle cx="850" cy="200" r="300" fill="#10b981" opacity="0.12" filter="blur(70px)"/>

  <!-- Sol Taraf: Google Arama ve 1. Sıra Simülasyonu -->
  <g transform="translate(100, 100)">
    <rect width="530" height="475" rx="24" fill="#0a2a1b" stroke="#1b5a3a" stroke-width="2"/>

    <!-- Arama Çubuğu -->
    <rect x="30" y="30" width="470" height="50" rx="25" fill="#04180f" stroke="#165335"/>
    <circle cx="60" cy="55" r="10" fill="none" stroke="#6ee7b7" stroke-width="2.5"/>
    <line x1="68" y1="63" x2="76" y2="71" stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round"/>
    <text x="90" y="60" font-family="system-ui,sans-serif" font-size="13" fill="#ffffff">en iyi kurumsal web sitesi tasarımı</text>
    <rect x="420" y="38" width="65" height="34" rx="17" fill="#10b981"/>
    <text x="452" y="60" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="800" fill="#022c19">ARA</text>

    <!-- 1. Sıra Sonucu (Öne Çıkan) -->
    <g transform="translate(30, 110)">
      <rect width="470" height="150" rx="18" fill="#051f14" stroke="#10b981" stroke-width="2"/>
      <rect x="20" y="18" width="60" height="20" rx="10" fill="#10b981"/>
      <text x="50" y="32" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" font-weight="900" fill="#022c19">1. SIRA</text>
      <text x="90" y="32" font-family="system-ui,sans-serif" font-size="11" fill="#6ee7b7">https://lizartdijital.com</text>

      <text x="20" y="68" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#38bdf8">
        Hazır Web Siteleri &amp; Kurumsal Dijital Çözümler
      </text>

      <text x="20" y="98" font-family="system-ui,sans-serif" font-size="12" fill="#a7f3d0" line-height="1.4">
        Hızlı açılan, Core Web Vitals uyumlu, mobil dostu ve SEO altyapısı hazır
      </text>
      <text x="20" y="118" font-family="system-ui,sans-serif" font-size="12" fill="#a7f3d0">
        kurumsal tanıtım ve e-ticaret çözümleri.
      </text>

      <rect x="20" y="128" width="80" height="12" rx="4" fill="#10b981" opacity="0.3"/>
      <rect x="110" y="128" width="100" height="12" rx="4" fill="#10b981" opacity="0.3"/>
    </g>

    <!-- 2. Sıra Sonucu (Soluk) -->
    <g transform="translate(30, 280)">
      <rect width="470" height="80" rx="14" fill="#051f14" opacity="0.6"/>
      <text x="20" y="28" font-family="system-ui,sans-serif" font-size="10" fill="#475569">https://rakipsite.com</text>
      <text x="20" y="50" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#94a3b8">Web Tasarım Ajansı Hizmetleri</text>
    </g>

    <!-- 3. Sıra Sonucu -->
    <g transform="translate(30, 375)">
      <rect width="470" height="70" rx="14" fill="#051f14" opacity="0.4"/>
      <text x="20" y="28" font-family="system-ui,sans-serif" font-size="10" fill="#475569">https://baskasite.com</text>
      <text x="20" y="50" font-family="system-ui,sans-serif" font-size="14" font-weight="600" fill="#64748b">Site Yaptırma Fiyatları</text>
    </g>
  </g>

  <!-- Sağ Taraf: SEO Puanları & Kontrol Listesi -->
  <g transform="translate(670, 100)">
    <rect width="430" height="475" rx="24" fill="#0a2a1b" stroke="#1b5a3a" stroke-width="2"/>

    <!-- Lighthouse Puanı -->
    <g transform="translate(30, 30)">
      <rect width="370" height="110" rx="18" fill="#04180f"/>
      <circle cx="65" cy="55" r="38" fill="none" stroke="#10b981" stroke-width="6"/>
      <text x="65" y="63" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="900" fill="#34d399">100</text>
      <text x="125" y="48" font-family="system-ui,sans-serif" font-size="16" font-weight="800" fill="#ffffff">Google Lighthouse</text>
      <text x="125" y="68" font-family="system-ui,sans-serif" font-size="12" fill="#34d399">Maksimum Performans &amp; SEO</text>
      <text x="125" y="86" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">LCP: 0.8s · CLS: 0.00 · FID: 12ms</text>
    </g>

    <!-- Kontrol Listesi Maddeleri -->
    <g transform="translate(30, 160)">
      <rect width="370" height="52" rx="12" fill="#04180f"/>
      <circle cx="26" cy="26" r="10" fill="#10b981"/>
      <text x="26" y="30" text-anchor="middle" font-size="10" font-weight="900" fill="#022c19">✓</text>
      <text x="48" y="24" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#ffffff">Schema.org Yapısal Veri (JSON-LD)</text>
      <text x="48" y="40" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Zengin snippet &amp; arama kartları aktif</text>
    </g>

    <g transform="translate(30, 225)">
      <rect width="370" height="52" rx="12" fill="#04180f"/>
      <circle cx="26" cy="26" r="10" fill="#10b981"/>
      <text x="26" y="30" text-anchor="middle" font-size="10" font-weight="900" fill="#022c19">✓</text>
      <text x="48" y="24" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#ffffff">Otomatik Dinamik Sitemap.xml</text>
      <text x="48" y="40" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Tüm ürün ve sayfalar anında dizine girer</text>
    </g>

    <g transform="translate(30, 290)">
      <rect width="370" height="52" rx="12" fill="#04180f"/>
      <circle cx="26" cy="26" r="10" fill="#10b981"/>
      <text x="26" y="30" text-anchor="middle" font-size="10" font-weight="900" fill="#022c19">✓</text>
      <text x="48" y="24" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#ffffff">Görsel Optimizasyonu &amp; WebP/AVIF</text>
      <text x="48" y="40" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Kayıpsız sıkıştırma ve responsive src</text>
    </g>

    <g transform="translate(30, 355)">
      <rect width="370" height="52" rx="12" fill="#04180f"/>
      <circle cx="26" cy="26" r="10" fill="#10b981"/>
      <text x="26" y="30" text-anchor="middle" font-size="10" font-weight="900" fill="#022c19">✓</text>
      <text x="48" y="24" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#ffffff">Kanonik URL &amp; Robots.txt Hijyeni</text>
      <text x="48" y="40" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Kopya içerik ve tarama bütçesi optimizasyonu</text>
    </g>
  </g>
</svg>`,

  "yapay-zeka-destekli-musteri-hizmetleri.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <defs>
    <linearGradient id="bg6" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a192f"/>
      <stop offset="50%" stop-color="#0b2838"/>
      <stop offset="100%" stop-color="#031320"/>
    </linearGradient>
    <linearGradient id="aiGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg6)"/>
  <circle cx="400" cy="300" r="300" fill="#06b6d4" opacity="0.1" filter="blur(70px)"/>

  <!-- Sol Taraf: Canlı AI Chatbot Penceresi -->
  <g transform="translate(100, 90)">
    <rect width="540" height="495" rx="24" fill="#0f2638" stroke="#194868" stroke-width="2"/>
    <!-- Chat Başlığı -->
    <rect width="540" height="65" rx="24" fill="#081824"/>
    <rect x="0" y="30" width="540" height="35" fill="#081824"/>
    <circle cx="36" cy="32" r="16" fill="url(#aiGrad)"/>
    <text x="36" y="38" text-anchor="middle" font-size="16">🤖</text>
    <text x="64" y="28" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Lizart AI Asistan</text>
    <circle cx="68" cy="42" r="3.5" fill="#10b981"/>
    <text x="76" y="45" font-family="system-ui,sans-serif" font-size="10" fill="#6ee7b7">Çevrimiçi · 7/24 Anında Yanıt</text>

    <!-- Mesaj 1: Kullanıcı Sorusu -->
    <g transform="translate(160, 95)">
      <rect width="350" height="65" rx="16" fill="#1e3a5f"/>
      <text x="20" y="28" font-family="system-ui,sans-serif" font-size="13" fill="#ffffff">Merhaba! Klinik için randevu özellikli bir</text>
      <text x="20" y="48" font-family="system-ui,sans-serif" font-size="13" fill="#ffffff">web sitesi arıyorum, ne önerirsiniz?</text>
      <text x="330" y="58" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">14:32</text>
    </g>

    <!-- Mesaj 2: AI Asistan Yanıtı -->
    <g transform="translate(30, 180)">
      <rect width="420" height="150" rx="16" fill="#081b28" stroke="#06b6d4" stroke-width="1.5"/>
      <text x="20" y="30" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#22d3ee">✨ Lizart AI Asistan:</text>
      <text x="20" y="55" font-family="system-ui,sans-serif" font-size="12" fill="#e2e8f0">Harika bir tercih! Sizin için en uygun ürünümüz</text>
      <text x="20" y="75" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#38bdf8">"Medica Klinik Web Sitesi" şablonudur.</text>
      <text x="20" y="100" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">• Online randevu ve doktor takvimi dahildir</text>
      <text x="20" y="120" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">• 3 iş gününde anahtar teslim kurulabilir</text>
      <text x="400" y="142" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#06b6d4">Anında iletildi ⚡</text>
    </g>

    <!-- Mesaj 3: Butonlu Öneri Kartı -->
    <g transform="translate(30, 345)">
      <rect width="480" height="70" rx="14" fill="#0b2c44"/>
      <text x="24" y="32" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#ffffff">Medica Klinik Demosunu İnceleyin</text>
      <text x="24" y="52" font-family="system-ui,sans-serif" font-size="11" fill="#67e8f9">Canlı demoyu şimdi test edebilirsiniz</text>
      <rect x="360" y="18" width="100" height="34" rx="17" fill="#06b6d4"/>
      <text x="410" y="39" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="800" fill="#081824">Demoyu Aç</text>
    </g>

    <!-- Chat Giriş Alanı -->
    <g transform="translate(30, 435)">
      <rect width="480" height="42" rx="21" fill="#081824" stroke="#1e3a5f"/>
      <text x="24" y="26" font-family="system-ui,sans-serif" font-size="12" fill="#64748b">Bir soru yazın...</text>
      <circle cx="455" cy="21" r="15" fill="#06b6d4"/>
      <text x="455" y="26" text-anchor="middle" font-size="12" fill="#081824">➔</text>
    </g>
  </g>

  <!-- Sağ Taraf: Metrikler & Avantajlar -->
  <g transform="translate(680, 110)">
    <rect width="420" height="455" rx="24" fill="#0f2638" stroke="#194868" stroke-width="2"/>
    <text x="36" y="50" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#22d3ee" letter-spacing="1">MÜŞTERİ HİZMETLERİ METRİKLERİ</text>
    <text x="36" y="85" font-family="system-ui,sans-serif" font-size="34" font-weight="900" fill="#ffffff">&lt; 3 Saniye</text>
    <text x="36" y="110" font-family="system-ui,sans-serif" font-size="13" fill="#67e8f9">Ortalama İlk Yanıt &amp; Karşılama Süresi</text>

    <!-- 3 İstatistik Kutusu -->
    <g transform="translate(36, 140)">
      <rect width="348" height="75" rx="14" fill="#081824"/>
      <circle cx="35" cy="37" r="18" fill="#10b981" opacity="0.2"/>
      <text x="35" y="44" text-anchor="middle" font-size="18">⚡</text>
      <text x="70" y="32" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">%85 Çağrı Otomasyonu</text>
      <text x="70" y="52" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Sık sorulan sorular ekibe gitmeden anında çözülür</text>
    </g>

    <g transform="translate(36, 230)">
      <rect width="348" height="75" rx="14" fill="#081824"/>
      <circle cx="35" cy="37" r="18" fill="#06b6d4" opacity="0.2"/>
      <text x="35" y="44" text-anchor="middle" font-size="18">⭐</text>
      <text x="70" y="32" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">4.9/5 Memnuniyet Puanı</text>
      <text x="70" y="52" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Kullanıcılar beklemeden doğru cevaba ulaşır</text>
    </g>

    <g transform="translate(36, 320)">
      <rect width="348" height="75" rx="14" fill="#081824"/>
      <circle cx="35" cy="37" r="18" fill="#a855f7" opacity="0.2"/>
      <text x="35" y="44" text-anchor="middle" font-size="18">🤖</text>
      <text x="70" y="32" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="#ffffff">Çok Dilli Akıllı Destek</text>
      <text x="70" y="52" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">Türkçe, İngilizce ve Arapça dillerinde akıcı diyalog</text>
    </g>
  </g>
</svg>`,
};

async function main() {
  for (const [file, content] of Object.entries(BLOG_IMAGES)) {
    const p = path.join(OUT_DIR, file);
    await fs.writeFile(p, content, "utf8");
    console.log("✓", file, "oluşturuldu");
  }
  console.log("Tüm blog görselleri başarıyla güncellendi!");
}

main().catch(console.error);
