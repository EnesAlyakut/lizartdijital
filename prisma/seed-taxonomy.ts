/**
 * Kategoriler, teknolojiler, platformlar ve ek hizmetler.
 * Fiyatlar kuruş cinsindendir (₺3.500 → 350000).
 */

export const CATEGORIES = [
  // Hazır web siteleri
  { slug: "kurumsal-web-siteleri", name: "Kurumsal Web Siteleri", kind: "website" },
  { slug: "eticaret-siteleri", name: "E-Ticaret Siteleri", kind: "website" },
  { slug: "restoran-siteleri", name: "Restoran Siteleri", kind: "website" },
  { slug: "klinik-saglik-siteleri", name: "Klinik ve Sağlık Siteleri", kind: "website" },
  { slug: "emlak-siteleri", name: "Emlak Siteleri", kind: "website" },
  { slug: "otel-turizm-siteleri", name: "Otel ve Turizm Siteleri", kind: "website" },
  { slug: "egitim-siteleri", name: "Eğitim Siteleri", kind: "website" },
  { slug: "haber-blog-siteleri", name: "Haber ve Blog Siteleri", kind: "website" },
  { slug: "portfoy-siteleri", name: "Portföy Siteleri", kind: "website" },
  { slug: "landing-page-tasarimlari", name: "Landing Page Tasarımları", kind: "website" },
  { slug: "ajans-siteleri", name: "Ajans Siteleri", kind: "website" },
  { slug: "randevu-sistemleri", name: "Randevu Sistemleri", kind: "website" },
  { slug: "ilan-siteleri", name: "İlan Siteleri", kind: "website" },
  { slug: "pazaryeri-siteleri", name: "Çok Satıcılı Pazaryerleri", kind: "website" },
  { slug: "uyelik-abonelik-siteleri", name: "Üyelik ve Abonelik Siteleri", kind: "website" },
  // Mobil uygulamalar
  { slug: "eticaret-uygulamalari", name: "E-Ticaret Uygulamaları", kind: "app" },
  { slug: "restoran-siparis-uygulamalari", name: "Restoran Sipariş Uygulamaları", kind: "app" },
  { slug: "randevu-uygulamalari", name: "Randevu Uygulamaları", kind: "app" },
  { slug: "kurye-teslimat-sistemleri", name: "Kurye ve Teslimat Sistemleri", kind: "app" },
  { slug: "emlak-uygulamalari", name: "Emlak Uygulamaları", kind: "app" },
  { slug: "egitim-uygulamalari", name: "Eğitim Uygulamaları", kind: "app" },
  { slug: "fitness-uygulamalari", name: "Fitness Uygulamaları", kind: "app" },
  { slug: "klinik-hasta-takip", name: "Klinik ve Hasta Takip Sistemleri", kind: "app" },
  // Hazır sistemler
  { slug: "crm-sistemleri", name: "CRM Sistemleri", kind: "system" },
  { slug: "stok-siparis-yonetimi", name: "Stok ve Sipariş Yönetimi", kind: "system" },
  { slug: "personel-yonetimi", name: "Personel Yönetimi", kind: "system" },
  { slug: "rezervasyon-sistemleri", name: "Rezervasyon Sistemleri", kind: "system" },
  { slug: "abonelik-sistemleri", name: "Abonelik Sistemleri", kind: "system" },
  // Web uygulamaları
  { slug: "saas-uygulamalari", name: "SaaS Uygulamaları", kind: "webapp" },
  { slug: "yapay-zeka-uygulamalari", name: "Yapay Zekâ Uygulamaları", kind: "webapp" },
  // Tema ve hizmet
  { slug: "tema-sablonlar", name: "Tema ve Şablonlar", kind: "template" },
  { slug: "dijital-hizmet-paketleri", name: "Dijital Hizmet Paketleri", kind: "service" },
];

export const TECHNOLOGIES = [
  { slug: "wordpress", name: "WordPress", group: "cms" },
  { slug: "woocommerce", name: "WooCommerce", group: "cms" },
  { slug: "shopify", name: "Shopify", group: "cms" },
  { slug: "react", name: "React", group: "frontend" },
  { slug: "nextjs", name: "Next.js", group: "frontend" },
  { slug: "vue", name: "Vue", group: "frontend" },
  { slug: "laravel", name: "Laravel", group: "backend" },
  { slug: "php", name: "PHP", group: "backend" },
  { slug: "nodejs", name: "Node.js", group: "backend" },
  { slug: "html-css-js", name: "HTML/CSS/JavaScript", group: "frontend" },
  { slug: "flutter", name: "Flutter", group: "mobile" },
  { slug: "react-native", name: "React Native", group: "mobile" },
  { slug: "postgresql", name: "PostgreSQL", group: "backend" },
  { slug: "mysql", name: "MySQL", group: "backend" },
];

export const PLATFORMS = [
  { slug: "web", name: "Web" },
  { slug: "pwa", name: "PWA" },
  { slug: "android", name: "Android" },
  { slug: "ios", name: "iOS" },
  { slug: "masaustu", name: "Masaüstü" },
  { slug: "ozel-yazilim", name: "Özel Yazılım" },
];

export const ADDONS = [
  { slug: "profesyonel-kurulum", name: "Profesyonel kurulum", description: "Sunucunuza kurulum, yapılandırma ve yayına alma işlemlerini ekibimiz yapar.", price: 350000, extraDays: 2, group: "kurulum" },
  { slug: "domain-baglantisi", name: "Domain bağlantısı", description: "Alan adı yönlendirmesi, DNS ayarları ve SSL sertifikası kurulumu.", price: 90000, extraDays: 1, group: "kurulum" },
  { slug: "hosting-kurulumu", name: "Hosting kurulumu", description: "Hosting hesabınızın kurulumu, sürüm ayarları ve performans yapılandırması.", price: 120000, extraDays: 1, group: "kurulum" },
  { slug: "logo-degisimi", name: "Logo değişimi", description: "Mevcut logonuzun siteye entegrasyonu ve tüm ölçülerde optimize edilmesi.", price: 60000, extraDays: 1, group: "icerik" },
  { slug: "renk-duzenleme", name: "Renk düzenlemesi", description: "Kurumsal renklerinize göre tüm arayüzün renk paletinin uyarlanması.", price: 80000, extraDays: 1, group: "icerik" },
  { slug: "kurumsal-kimlik-uyarlamasi", name: "Kurumsal kimlik uyarlaması", description: "Tipografi, ikon seti ve görsel dilin marka kılavuzunuza göre uyarlanması.", price: 250000, extraDays: 3, group: "icerik" },
  { slug: "icerik-girisi", name: "İçerik girişi", description: "10 sayfaya kadar metin ve görsel içeriğin sisteme girilmesi.", price: 180000, extraDays: 3, group: "icerik" },
  { slug: "urun-girisi", name: "Ürün girişi", description: "50 ürüne kadar görsel, açıklama, fiyat ve varyasyon girişi.", price: 300000, extraDays: 4, group: "icerik" },
  { slug: "coklu-dil-kurulumu", name: "Çoklu dil kurulumu", description: "İkinci dilin kurulumu ve arayüz çevirilerinin tamamlanması.", price: 220000, extraDays: 3, group: "entegrasyon" },
  { slug: "odeme-sistemi-entegrasyonu", name: "Ödeme sistemi entegrasyonu", description: "Sanal POS veya ödeme kuruluşu entegrasyonu ve test işlemleri.", price: 200000, extraDays: 2, group: "entegrasyon" },
  { slug: "kargo-entegrasyonu", name: "Kargo entegrasyonu", description: "Anlaşmalı kargo firmalarıyla otomatik gönderi ve takip entegrasyonu.", price: 150000, extraDays: 2, group: "entegrasyon" },
  { slug: "ek-sayfa-tasarimi", name: "Ek sayfa tasarımı", description: "Mevcut tasarım diline uygun ek sayfa tasarımı (sayfa başına).", price: 140000, extraDays: 2, group: "icerik" },
  { slug: "ozel-modul-gelistirme", name: "Özel modül geliştirme", description: "İhtiyacınıza özel modülün analizi, geliştirilmesi ve entegrasyonu.", price: 750000, extraDays: 10, group: "entegrasyon" },
  { slug: "mobil-uygulama-yayinlama", name: "Mobil uygulama yayınlama", description: "Uygulamanın mağaza gereksinimlerine göre hazırlanması ve yayına gönderilmesi.", price: 400000, extraDays: 5, group: "yayin" },
  { slug: "app-store-yayini", name: "App Store yayını", description: "Apple App Store hesabı yapılandırması ve inceleme sürecinin yürütülmesi.", price: 250000, extraDays: 5, group: "yayin" },
  { slug: "google-play-yayini", name: "Google Play yayını", description: "Google Play Console yapılandırması ve yayın sürecinin yürütülmesi.", price: 200000, extraDays: 4, group: "yayin" },
  { slug: "egitim-destegi", name: "Eğitim ve kullanım desteği", description: "Yönetim panelinin kullanımına dair 2 saatlik canlı eğitim ve kayıt.", price: 150000, extraDays: 1, group: "destek" },
  { slug: "aylik-bakim-paketi", name: "Aylık bakım paketi", description: "Güncelleme, yedekleme, güvenlik taraması ve küçük içerik düzenlemeleri.", price: 190000, extraDays: 0, group: "destek" },
  { slug: "yillik-teknik-destek", name: "Yıllık teknik destek paketi", description: "12 ay boyunca öncelikli teknik destek ve hata giderme.", price: 1490000, extraDays: 0, group: "destek" },
];
