# Lizart Dijital — Dijital Ürün E-Ticaret Platformu

Hazır web siteleri, mobil ve web uygulamaları ile dijital hizmet paketlerinin
araştırılabildiği, canlı demosunun incelenebildiği, sepete eklenip satın alınabildiği
ve güvenli şekilde teslim edildiği bir e-ticaret platformu.

Yalnızca bir tanıtım sitesi değildir: gerçek sepet, ödeme akışı, lisans üretimi,
imzalı indirme sistemi, müşteri hesabı, proje takibi ve rol tabanlı yönetim paneli içerir.

---

## 1. Hızlı başlangıç

```bash
npm install
cp .env.example .env
docker compose up -d db phpmyadmin
npx prisma db push
npx prisma generate
npm run db:seed
npm run dev
```

Site `http://localhost:3000` adresinde açılır.
phpMyAdmin `http://localhost:8080` adresindedir.

**Demo hesapları** (seed sonrası oluşur):

| Rol | E-posta | Şifre |
|---|---|---|
| Yönetici | `admin@lizartdijital.com` | `Lizart!2026` |
| İçerik editörü | `editor@lizartdijital.com` | `Lizart!2026` |
| Destek ekibi | `destek@lizartdijital.com` | `Lizart!2026` |
| Müşteri | `musteri@ornek.com` | `Musteri!2026` |

Yönetim paneli: `/yonetim` · Müşteri paneli: `/hesabim`

---

## 2. Teknoloji seçimi ve gerekçesi

| Katman | Seçim | Neden |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Sunucu bileşenleri sayesinde ürün listeleri ve filtreler istemciye JS taşımadan render edilir; ISR ile katalog sayfaları hızlı açılır. |
| Dil | **TypeScript** | Fiyat, lisans ve sipariş gibi para/hak içeren alanlarda tip güvenliği. |
| Stil | **Tailwind CSS v4** | Tasarım tokenları CSS değişkeni olarak tanımlanır; tema tek dosyadan yönetilir. |
| ORM | **Prisma 6** | İlişkisel şema, `db push` ile senkronizasyon ve tip güvenli sorgular. |
| Veritabanı | **MySQL 8 + phpMyAdmin** | Yerelde phpMyAdmin ile yönetilebilir; Prisma ile tip güvenli sorgu ve şema senkronizasyonu sağlar. |
| Doğrulama | **Zod** | Tüm form ve action girdileri sunucuda şemayla doğrulanır. |
| Kimlik doğrulama | **Kendi oturum katmanı** | Harici bağımlılık olmadan; token'ın SHA-256 özeti saklanır, şifreler bcrypt ile hashlenir. |

Fiyatlar **kuruş cinsinden tam sayı** olarak saklanır (`₺24.900 → 2490000`); kayan noktalı
sayı kullanılmadığı için yuvarlama hatası oluşmaz.

---

## 3. Bilgi mimarisi ve sayfa haritası

```
/                                Ana sayfa (1. ajans tanıtımı → 2. ürün satışı → 3. güven/CTA)
/magaza                          Tüm ürünler + gelişmiş filtreler
/magaza/[tur]                    hazir-web-siteleri · mobil-uygulamalar · web-uygulamalari
                                 hazir-sistemler · tema-sablonlar · hizmet-paketleri
/urun/[slug]                     Ürün detayı, lisans + ek hizmet seçimi, canlı fiyat
/demo-merkezi                    Demo listesi ve filtreler
/demo-merkezi/[slug]             Cihaz önizlemeleri, panel demosu, QR kod
/karsilastir                     En fazla 4 ürünün karşılaştırma tablosu
/sihirbaz                        İhtiyaca göre ürün bulma sihirbazı
/sepet                           Sepet: lisans, ek hizmet, kupon, KDV
/odeme                           Ödeme formu (üyeliksiz veya üyelikle)
/odeme/simulasyon                Geliştirme ortamı 3D Secure taklidi
/siparis/[orderNumber]           Sipariş sonucu, lisans anahtarı, indirmeler, proje takibi
/siparis/[orderNumber]/havale    Havale/EFT talimatları
/hizmetler, /hizmetler/[slug]    13 hizmet sayfası
/projeler, /projeler/[slug]      Portföy ve başarı hikâyeleri
/blog, /blog/[slug]              Blog ve rehberler
/hakkimizda /iletisim /teklif    Kurumsal sayfalar
/sss /destek                     SSS ve Destek Merkezi
/kurumsal/[slug]                 13 yasal metin
/giris /kayit                    Kimlik doğrulama
/hesabim/*                       Müşteri paneli (14 alt sayfa)
/yonetim/*                       Yönetim paneli (16 alt sayfa)
/api/odeme/webhook               İmzalı ödeme bildirimi
/api/indir                       İmzalı, süreli dosya indirme
/sitemap.xml /robots.txt         SEO
```

---

## 4. Kullanıcı akışları

**Satın alma (kartla)**
1. Ürün seçilir → lisans ve ek hizmetler işaretlenir, fiyat anlık güncellenir.
2. Sepete eklenir. Sepette lisans değiştirilebilir, ek hizmet açılıp kapatılabilir, kupon uygulanır.
3. Ödeme formunda fatura bilgileri girilir, sözleşmeler onaylanır.
4. Sipariş `bekliyor` durumunda oluşur, ödeme sağlayıcısına yönlendirilir.
5. Sağlayıcı **imzalı webhook** gönderir → imza ve tutar doğrulanır.
6. Sipariş `odendi` olur; lisans anahtarı, fatura ve indirme hakkı üretilir, e-posta gönderilir.
7. Kurulum/hizmet içeren siparişlerde proje kaydı ve 10 aşamalı takip açılır.

> Ödeme durumu **hiçbir zaman** tarayıcıdan gelen bilgiye göre belirlenmez.

**Havale/EFT:** Sipariş oluşur → banka bilgileri gösterilir → yönetim panelinden
"Ödemeyi onayla" ile aynı teslimat akışı tetiklenir.

**İndirme:** Buton → sunucuda hak kontrolü (ödeme, süre, limit) → HMAC imzalı ve süreli
adres üretilir → `/api/indir` imzayı yeniden doğrular → dosya akıtılır ve indirme kaydedilir.

**Üyeliksiz alışveriş:** Aynı e-posta ile sonradan hesap açıldığında geçmiş siparişler,
lisanslar ve indirmeler otomatik olarak hesaba bağlanır.

---

## 5. Veritabanı şeması (özet)

38 model, `prisma/schema.prisma` içinde tanımlıdır:

- **Kimlik:** `User`, `Role`, `Session`, `Address`
- **Katalog:** `Product`, `ProductCategory`, `ProductImage`, `ProductVideo`, `Technology`,
  `Platform`, `ProductTechnology`, `ProductPlatform`, `ProductVersion`, `ProductFile`,
  `ProductLicense`, `AddOnService`, `ProductAddOn`
- **Alışveriş:** `Cart`, `CartItem`, `CartItemAddOn`, `Favorite`, `Comparison`, `ComparisonItem`, `Coupon`
- **Sipariş:** `Order`, `OrderItem`, `OrderItemAddOn`, `Payment`, `Invoice`, `LicenseKey`, `Download`
- **Operasyon:** `Project`, `ProjectStage`, `SupportTicket`, `TicketMessage`, `Offer`, `Notification`
- **İçerik:** `Review`, `BlogPost`, `BlogCategory`, `PortfolioProject`, `Faq`, `Page`, `Setting`
- **Sistem:** `AuditLog`, `NewsletterSubscriber`, `ContactMessage`

Notlar:
- Enum yerine `String` + Zod doğrulaması kullanıldı; Prisma tarafında MySQL ile uyumlu tutulur.
- Dizi/nesne alanları (`features`, `techSpecs`, `domains`…) JSON string olarak saklanır ve
  `parseJsonArray` / `parseJsonObject` yardımcılarıyla güvenle çözülür.
- `OrderItem` sipariş anındaki ürün adı, lisans adı ve fiyatı kopyalar; ürün sonradan
  değişse bile fatura bozulmaz.

---

## 6. Component ve klasör mimarisi

```
src/
  app/                    Sayfalar ve API rotaları (App Router)
  components/
    ui/                   Button, Badge, Price, Rating, Card, Accordion, EmptyState…
    layout/               Header, Footer, AnnouncementBar, SearchBox, NewsletterForm
    home/                 Hero, AgencyIntro (ajans tanıtımı), Capabilities, satış bölümleri
    product/              ProductCard, ProductGallery, PurchasePanel, AddToCartButton
    shop/                 ShopView, ShopFilters, ShopToolbar
    cart/ checkout/       Sepet satırı, kupon formu, ödeme formu
    account/ admin/       Müşteri ve yönetim paneli bileşenleri
    demo/ forms/ wizard/  Demo görüntüleyici, iletişim/teklif formları, sihirbaz
  lib/
    actions/              Server action'lar (cart, checkout, auth, account, admin, …)
    data/                 Sorgu katmanı (products, services)
    providers/            Ödeme / e-posta / depolama soyutlamaları + mock'lar
    auth.ts cart.ts db.ts constants.ts utils.ts markdown.tsx
  generated/prisma/       Prisma istemcisi (üretilir, sürüm kontrolüne girmez)
prisma/                   Şema ve seed dosyaları
private-files/            Dijital ürün dosyaları (public DEĞİL)
public/gorseller/         Seed tarafından üretilen ürün/blog görselleri
```

---

## 7. Tasarım sistemi

Görsel dil, yayındaki **lizartdijital.com** ile hizalandı: koyu zemin, yumuşak yeşil vurgu,
**Prompt** tipografisi ve minimal header (logo · araçlar · Menu · `Başlayalım`).

Tüm tokenlar `src/app/globals.css` içindeki `@theme` bloğunda:

- **Zemin:** yeşile çalan yumuşak koyu — `--color-canvas: #181e1a`, yüzey `#1f261f`
- **Metin:** gövde `#c4cac4`, başlık beyaz (nötr gri yerine hafif yeşil tonlu skala)
- **Vurgu:** açık ve yumuşak yeşil `--color-brand-500: #7ec978`. Açık yeşil zeminlerde metin
  daima koyu (`text-canvas`) kullanılır; beyaz metin kontrastı düşürürdü
- **Geçişler:** bölümler arasında sert sınır yerine `section-blend`, `section-glow` ve
  `divider-fade` yardımcı sınıflarıyla yumuşak degrade akış
- **Hareket:** yalnızca `opacity` ve `transform`; `prefers-reduced-motion` ile tamamen kapanır

> **Not:** Koyu temada `ink` skalası tersine tanımlıdır (`ink-50` en koyu yüzey, `ink-900`
> başlık beyazı). Böylece bileşenlerdeki `bg-surface`, `text-ink-900`, `border-ink-100` gibi
> anlamsal sınıflar değişmeden kalır; yalnızca token değerleri değişir.

Erişilebilirlik: her yerde görünür `:focus-visible` halkası, "içeriğe geç" bağlantısı,
form alanlarında gerçek `label`, durum bildirimlerinde `aria-live`, tablolarda `caption` ve
`scope`, ikon butonlarında `aria-label`.

---

## 8. Üçüncü taraf servisler (provider katmanı)

Uygulama kodu daima `src/lib/providers/types.ts` içindeki arayüzlerle konuşur.
Geliştirmede API anahtarı olmadan çalışan mock'lar devrededir:

| Servis | Mock davranışı | Gerçek servise geçiş |
|---|---|---|
| Ödeme | `/odeme/simulasyon` sayfasında onay/ret; imzalı webhook gönderir | `PaymentProvider` arayüzünü uygulayan sınıf yazın (`init` + `verify`), `providers/index.ts` switch'ine ekleyin, `PAYMENT_PROVIDER` değerini değiştirin. `verify()` içinde sağlayıcının imza doğrulaması uygulanır; başka hiçbir dosya değişmez. |
| E-posta | `.mail-outbox/` klasörüne `.html` yazar | `MailProvider` arayüzünü uygulayan sınıf (`send`), `MAIL_PROVIDER` değişkeni. |
| Depolama | `private-files/` klasöründen okur, HMAC imzalı yerel adres üretir | `StorageProvider` arayüzünü uygulayın; `signedDownloadUrl` içinde S3/R2 imzalı URL döndürün. Çağrı yerleri değişmez. |

---

## 9. Güvenlik

- Şifreler **bcrypt** (12 tur) ile hashlenir; düz metin saklanmaz.
- Oturum çerezi `httpOnly` + `sameSite=lax` + üretimde `secure`; veritabanında token'ın
  yalnızca **SHA-256 özeti** tutulur.
- Rol tabanlı yetkilendirme; `/yonetim` hem layout'ta hem **her server action içinde** kontrol edilir.
- Tüm form ve action girdileri **Zod** ile sunucuda doğrulanır.
- Sepet ve sipariş tutarları **daima veritabanındaki fiyatlardan** yeniden hesaplanır;
  istemciden gelen hiçbir tutar kabul edilmez.
- Ödeme durumu yalnızca **imzası doğrulanmış** webhook ile belirlenir; tutar uyuşmazlığında reddedilir.
- Dijital dosyalar `public/` altında **değildir**; erişim süreli + imzalı bağlantı ve hak
  kontrolüyle yapılır, path traversal engellenir, her indirme kaydedilir.
- Giriş denemelerinde hız sınırlama; kullanıcı numaralandırmasını önlemek için tek tip hata mesajı.
- Şifre değişiminde tüm oturumlar sonlandırılır.
- `AuditLog` kritik işlemleri kaydeder; şifre, kart bilgisi ve tam IP adresi **loglanmaz**
  (IP yalnızca özetlenerek saklanır).
- Sırlar ortam değişkenlerinde tutulur, veritabanına veya panele yazılmaz.
- React'in varsayılan kaçışı XSS'e karşı korur; Markdown işleyici ham HTML kabul etmez.
  Prisma parametreli sorgu kullandığı için SQL injection riski yoktur.

---

## 10. SEO

Dinamik `title`/`description`, canonical URL, Open Graph ve Twitter kartları, `sitemap.xml`,
`robots.txt` (hesap/sepet/ödeme/api kapalı), semantik HTML ve şu schema.org işaretlemeleri:
`Organization`, `Product`, `Offer`, `AggregateRating`, `Review`, `BreadcrumbList`, `FAQPage`, `Article`.

---

## 11. Demo verileri

`npm run db:seed` şunları oluşturur:

- 12 hazır web sitesi, 8 uygulama/sistem, 6 dijital hizmet paketi (**toplam 26 ürün**)
- 32 kategori, 14 teknoloji, 6 platform, 19 ek hizmet
- Her üründe 3 lisans seçeneği, sürüm geçmişi ve indirilebilir dosya
- 6 müşteri yorumu, 6 blog yazısı, 6 portföy projesi, 15 SSS, 13 yasal sayfa, 2 kupon
- 4 kullanıcı (yönetici, editör, destek, müşteri)

Görseller dış servise bağımlı kalmamak için seed sırasında **SVG olarak üretilir** — kırık
görsel oluşmaz:

- `prisma/seed-images.ts` → ürün kapakları, cihaz önizlemeleri, blog ve portföy görselleri
- `prisma/seed-brand-images.ts` → ana sayfadaki ajans tanıtımı ve hizmet illüstrasyonları

Bunlar markanın renk paletiyle çizilmiş soyut illüstrasyonlardır; olmayan bir ofis veya ekip
fotoğrafı varmış gibi gösterilmez. Gerçek kullanımda dosyaların yerine kendi ürün ekran
görüntüleriniz ve stüdyo fotoğraflarınız konur.

---

## 12. Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm run start` | Üretim derlemesi / sunucusu |
| `npm run typecheck` | TypeScript kontrolü |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Şemayı MySQL veritabanına uygula |
| `npm run db:seed` | Demo verilerini yükle |
| `npm run db:reset` | Veritabanını sıfırla ve yeniden doldur |
| `npm run db:studio` | Prisma Studio |
| `npm run setup` | db push + generate + seed |

---

## 13. Test talimatları

Otomatik test paketi bu sürümde yer almıyor; aşağıdaki manuel senaryolar tüm kritik
akışları kapsar ve her biri doğrulanmıştır.

**A. Katalog ve filtreler**
1. `/magaza` → sol panelden "Yönetim paneli var" + "WordPress" seçin; sonuç sayısı düşmeli, filtreler URL'e yazılmalı.
2. Sayfayı yenileyin → filtreler korunmalı. "Filtreleri temizle" hepsini kaldırmalı.
3. Sıralamayı "Fiyat: düşükten yükseğe" yapın → ilk ürün en ucuz olmalı.

**B. Ürün ve fiyat hesabı**
1. `/urun/vitrin-eticaret-sitesi` açın. Lisansı "Genişletilmiş" yapın → fiyat lisans farkı kadar artmalı.
2. "Profesyonel kurulum" ek hizmetini işaretleyin → fiyat ve tahmini teslim süresi artmalı.
3. Sepete ekleyin → sepette aynı lisans ve ek hizmet görünmeli, tutar eşleşmeli.

**C. Kupon ve KDV**
1. Sepette `HOSGELDIN10` girin → %10 indirim satırı çıkmalı (min. sepet 5.000 ₺).
2. KDV, indirim düşülmüş tutar üzerinden %20 hesaplanmalı.

**D. Ödeme ve teslimat (uçtan uca)**
1. `/odeme` formunu doldurun, iki sözleşmeyi onaylayın, "Ödemeye geç".
2. Simülasyon sayfasında **"Ödemeyi onayla"** → sipariş sayfasında "Ödemeniz alındı" görünmeli.
3. Lisans anahtarı (`LZ-XXXX-…`), fatura numarası ve indirme satırı listelenmeli.
4. Aynı akışı **"Ödemeyi reddet"** ile tekrarlayın → sipariş `bekliyor` kalmalı, lisans üretilmemeli.

**E. Güvenli indirme**
1. Sipariş sayfasında "İndir" → dosya inmeli, kalan hak 1 azalmalı.
2. İnen bağlantıyı kopyalayıp `sig` parametresini bozun → **403** dönmeli.
3. `/private-files/...` yolunu doğrudan açın → **404** dönmeli.

**F. Hesap**
1. Sipariş verdiğiniz e-posta ile `/kayit` üzerinden hesap açın → sipariş, lisans ve indirmeler hesaba bağlanmalı.
2. `/hesabim/lisanslarim` → domain ekleyin; limit dolunca hata mesajı çıkmalı.
3. `/hesabim/ayarlar` → şifre değiştirin; diğer oturumların kapandığı bilgisi görünmeli.

**G. Yetkilendirme**
1. Müşteri hesabıyla `/yonetim` açın → `/hesabim`'a yönlendirilmelisiniz.
2. Çıkış yapıp `/hesabim` açın → `/giris` sayfasına yönlendirilmelisiniz.

**H. Yönetim paneli**
1. Yönetici ile `/yonetim` → gösterge değerleri gerçek verilerle dolmalı.
2. `/yonetim/urunler` → bir ürünü "Yayından kaldır" → mağazada görünmemeli.
3. `/yonetim/kayitlar` → yaptığınız işlemler kayıtta listelenmeli.

**I. Erişilebilirlik ve responsive**
1. Yalnızca klavye ile menü → filtre → sepete ekleme akışını tamamlayın; odak her adımda görünür olmalı.
2. 375 px genişlikte ürün sayfasında alt sabit satın alma çubuğu görünmeli; yatay kaydırma olmamalı.

---

## 14. Deployment

**Ortak adımlar**
1. MySQL veritabanını oluşturun ve `DATABASE_URL` değerini gerçek bağlantı adresine alın.
2. `npx prisma db push` ile şemayı uygulayın, ardından `npx prisma generate` çalıştırın.
3. Ortam değişkenlerini tanımlayın; `PAYMENT_WEBHOOK_SECRET` ve `DOWNLOAD_SIGNING_SECRET`
   için uzun rastgele değerler üretin:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. `npm run build` → `npm run start`

**Docker**
```bash
docker compose up --build
docker compose exec web npx prisma db push
docker compose exec web npm run db:seed   # yalnızca demo veri isteniyorsa
```

**Yayın öncesi kontrol listesi**
- [ ] `PAYMENT_PROVIDER` gerçek sağlayıcıya alındı ve webhook adresi sağlayıcı panelinde tanımlandı
- [ ] `MAIL_PROVIDER` gerçek servise alındı
- [ ] `private-files/` kalıcı bir birime bağlandı ve web sunucusundan doğrudan erişime kapatıldı
- [ ] `NEXT_PUBLIC_SITE_URL` gerçek alan adı
- [ ] HTTPS zorunlu (oturum çerezleri `secure` bayrağını buna göre kullanır)
- [ ] Veritabanı yedekleme planı
- [ ] **Yasal metinler bir hukuk uzmanı tarafından incelendi**

---

## 15. Bilinen sınırlar

Bu maddeler bilinçli olarak kapsam dışı bırakılmıştır; hiçbiri "çalışıyormuş gibi görünen
sahte özellik" değildir:

- **Ödeme sağlayıcısı mock'tur.** Gerçek tahsilat yapmaz; akışın tamamı (init → 3D sayfası →
  imzalı webhook → teslimat) birebir gerçek yapıdadır, yalnızca sağlayıcı sınıfı değiştirilir.
- **E-posta mock'tur.** Mesajlar `.mail-outbox/` klasörüne yazılır.
- **Blog, portföy ve yasal sayfa içerikleri** panelde görüntülenir ancak düzenleme formu
  eklenmemiştir; içerik seed dosyasından yönetilir. Şema ve yetkilendirme hazırdır.
- **Dosya yükleme** arayüzü yoktur; ürün dosyaları `private-files/` klasörüne konur ve
  `ProductFile` kaydıyla eşleştirilir. Müşteri dosyaları destek talebi üzerinden alınır.
- **Hız sınırlama bellek içidir**; birden fazla sunucu çalıştırılacaksa Redis tabanlı bir
  sayaçla değiştirilmelidir.
- **Otomatik test paketi yoktur**; 13. bölümdeki manuel senaryolar kritik akışları kapsar.

---

## 16. Yasal uyarı

`/kurumsal/*` altındaki metinler (gizlilik politikası, KVKK aydınlatma metni, mesafeli satış
sözleşmesi, lisans sözleşmesi vb.) **bilgilendirme amaçlı taslaklardır ve hukuki danışmanlık
niteliği taşımaz.** Yayına almadan önce şirketinizin faaliyet modeline göre bir hukuk uzmanı
tarafından incelenmeli ve gerekiyorsa değiştirilmelidir.
