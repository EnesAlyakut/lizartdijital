/** Yorumlar, blog yazıları, portföy projeleri, SSS ve yasal sayfa şablonları. */

export const REVIEWS = [
  {
    product: "vitrin-eticaret-sitesi",
    authorName: "Elif Karaca",
    authorTitle: "Kurucu, Moda Butik",
    rating: 5,
    title: "İki günde satışa başladık",
    body: "Ürünlerimizi yükledikten sonra ikinci gün ilk siparişi aldık. Sanal POS entegrasyonu ekstra hizmet olarak alındı, kurulumu bizim yerimize yaptılar. Panel gerçekten öğrenmesi kolay.",
  },
  {
    product: "atlas-kurumsal-web-sitesi",
    authorName: "Mehmet Aydın",
    authorTitle: "Genel Müdür, Aydın Mühendislik",
    rating: 5,
    title: "Kurumsal görünüm tam istediğimiz gibi",
    body: "Eski sitemiz mobilde çok yavaştı. Yeni site hem hızlı hem de referanslarımızı düzgün gösteriyor. Logo ve renk uyarlamasını ek hizmet olarak aldık, iki gün içinde tamamlandı.",
  },
  {
    product: "medica-klinik-web-sitesi",
    authorName: "Dr. Zeynep Şahin",
    authorTitle: "Diş Hekimi",
    rating: 5,
    title: "Randevu trafiği belirgin arttı",
    body: "Hastalar artık telefonla aramak yerine siteden randevu alıyor. Arapça dil desteği sayesinde yurt dışından da talep geliyor. KVKK metinleri hazır gelmesi işimizi kolaylaştırdı.",
  },
  {
    product: "sepetim-eticaret-mobil-uygulamasi",
    authorName: "Burak Demirtaş",
    authorTitle: "E-ticaret Müdürü, Tekno Mağaza",
    rating: 4,
    title: "Uygulama mağazada yayında",
    body: "Kaynak kod dahil geldiği için kendi ekibimiz de üzerinde çalışabiliyor. Yayın sürecini ek hizmet olarak aldık. Tek eksik gördüğümüz nokta bildirim şablonlarının biraz sade olması.",
  },
  {
    product: "baslangic-dijital-paketi",
    authorName: "Selin Yılmaz",
    authorTitle: "Kurucu, Selin Danışmanlık",
    rating: 5,
    title: "İlk siteme başlamak için doğru paket",
    body: "Neye ihtiyacım olduğunu bilmiyordum, süreç boyunca yönlendirdiler. Logo, site ve temel SEO ayarları bir hafta içinde bitti. Sorularıma bir ay boyunca cevap verdiler.",
  },
  {
    product: "pusula-crm-sistemi",
    authorName: "Ahmet Korkmaz",
    authorTitle: "Satış Direktörü, Korkmaz Yapı",
    rating: 5,
    title: "Satış ekibimiz artık tek ekranda",
    body: "Excel dosyalarıyla takip ettiğimiz teklifleri sisteme taşıdık. Huni görünümü sayesinde hangi işin nerede kaldığı belli oluyor. Kurulum ve eğitim desteği aldık, ekip hızlı adapte oldu.",
  },
];

export const BLOG_CATEGORIES = [
  { slug: "eticaret", name: "E-Ticaret" },
  { slug: "seo", name: "SEO" },
  { slug: "sosyal-medya", name: "Sosyal Medya" },
  { slug: "web-tasarim", name: "Web Tasarım" },
  { slug: "mobil-uygulama", name: "Mobil Uygulama" },
  { slug: "yazilim", name: "Yazılım" },
  { slug: "reklam-yonetimi", name: "Reklam Yönetimi" },
  { slug: "yapay-zeka", name: "Yapay Zekâ" },
  { slug: "saglik-turizmi", name: "Sağlık Turizmi" },
  { slug: "dijital-pazarlama", name: "Dijital Pazarlama" },
];

export const BLOG_POSTS = [
  {
    slug: "hazir-web-sitesi-mi-ozel-tasarim-mi",
    title: "Hazır Web Sitesi mi, Özel Tasarım mı? Karar Rehberi",
    category: "web-tasarim",
    excerpt:
      "Bütçe, süre ve esneklik açısından iki yaklaşımı karşılaştırdık. Hangi işletme hangisini seçmeli, somut örneklerle anlattık.",
    author: "Enes Alyakut",
    authorTitle: "Kurucu",
    readMinutes: 7,
    body: `## Kısa cevap

Süreçleriniz standartsa hazır bir web sitesi çoğu zaman doğru seçimdir. Rakiplerinizde olmayan bir iş akışınız varsa özel geliştirme gerekir.

## Hazır web sitesi ne zaman mantıklı?

Kurumsal tanıtım, restoran menüsü, klinik randevusu, portföy gibi ihtiyaçlar sektörde büyük ölçüde standartlaşmıştır. Bu ihtiyaçlar için hazır bir paket:

- Günler içinde yayına girer.
- Maliyeti özel geliştirmenin genellikle üçte biri kadardır.
- Yüzlerce kurulumda test edildiği için daha az hata barındırır.

## Özel geliştirme ne zaman gerekir?

- İş akışınız sektöre özgü ve hazır ürünlerde karşılığı yoksa,
- Mevcut ERP, muhasebe veya üretim sistemlerinize derin entegrasyon gerekiyorsa,
- Ürününüzün kendisi yazılımsa (SaaS iş modeli),

özel geliştirme yatırımı geri döner.

## Ara yol: hazır ürün + özel modül

Uygulamada en sık önerdiğimiz yol budur. Hazır bir ürünü temel alıp yalnızca size özgü kısmı özel modül olarak geliştiririz. Böylece hem hızlı yayına girersiniz hem de kritik ihtiyacınız karşılanır.

## Karar verirken sorulacak üç soru

1. Bu işi bugün nasıl yapıyorum ve hangi adım gerçekten bana özgü?
2. Altı ay sonra kaç kullanıcı ve kaç kayıt olacak?
3. Yayına ne zaman girmem gerekiyor?

Bu üç sorunun cevabı, kararı çoğu zaman kendiliğinden ortaya çıkarır.`,
  },
  {
    slug: "eticaret-sitesinde-donusum-artiran-7-duzenleme",
    title: "E-Ticaret Sitesinde Dönüşüm Artıran 7 Düzenleme",
    category: "eticaret",
    excerpt:
      "Trafiğinizi artırmadan satışı yükseltmenin yolları var. Sepet terk oranını düşüren yedi somut düzenlemeyi listeledik.",
    author: "Elif Demir",
    authorTitle: "E-Ticaret Danışmanı",
    readMinutes: 6,
    body: `## 1. Kargo ücretini en baştan gösterin

Sepet terk sebeplerinin başında ödeme adımında beliren sürpriz kargo ücreti gelir. Ücreti ürün sayfasında yazın.

## 2. Üyeliksiz ödemeye izin verin

Zorunlu üyelik, ilk kez alışveriş yapan kullanıcıyı caydırır. Sipariş sonrası hesap oluşturmayı teklif edin.

## 3. Ödeme adımını tek sayfaya indirin

Çok adımlı formlar mobilde terk oranını artırır. Fatura ve teslimat bilgisini tek ekranda toplayın.

## 4. Ürün görsellerini gerçek kullanımda gösterin

Stüdyo çekimi güven verir, kullanım görseli satın aldırır. İkisini birlikte kullanın.

## 5. İade koşullarını gizlemeyin

Açık bir iade politikası satın alma riskini düşürür. Ürün sayfasından bağlantı verin.

## 6. Site hızını ölçün

Mobilde üç saniyeyi aşan açılış süresi, ziyaretçilerin önemli bir kısmını kaybettirir. Görselleri optimize edin.

## 7. Terk edilen sepeti hatırlatın

Basit bir e-posta hatırlatması, kaybedilen siparişlerin bir kısmını geri getirir. Rahatsız edici sıklıkta göndermeyin.`,
  },
  {
    slug: "teknik-seo-kontrol-listesi",
    title: "Yeni Yayına Alınan Sitede Teknik SEO Kontrol Listesi",
    category: "seo",
    excerpt:
      "Site yayına girdikten sonraki ilk hafta yapılması gerekenler: indeksleme, sitemap, schema ve hız kontrolleri.",
    author: "Mert Sarı",
    authorTitle: "SEO Uzmanı",
    readMinutes: 5,
    body: `## Yayın öncesi

- robots.txt dosyasının arama motorlarını engellemediğini doğrulayın.
- Test ortamındaki "noindex" etiketlerinin kaldırıldığından emin olun.
- Her sayfanın özgün başlık ve açıklamaya sahip olduğunu kontrol edin.

## Yayın sonrası ilk hafta

- XML sitemap'i arama konsoluna gönderin.
- Canonical adreslerin doğru sayfayı işaret ettiğini kontrol edin.
- Ürün, makale ve SSS sayfalarına schema.org işaretlemesi ekleyin.
- Eski siteden gelen adresler için 301 yönlendirmelerini tanımlayın.

## Ölçüm

İlk ayda sıralama yerine indekslenme ve tarama hatalarına bakın. Sıralama etkisi genellikle ikinci aydan itibaren görünür hale gelir.`,
  },
  {
    slug: "mobil-uygulama-yayinlama-sureci",
    title: "Mobil Uygulamanızı Mağazalarda Yayınlama Süreci",
    category: "mobil-uygulama",
    excerpt:
      "Geliştirici hesabı açmaktan inceleme sürecini geçmeye kadar adım adım yayın rehberi ve sık yapılan hatalar.",
    author: "Can Öztürk",
    authorTitle: "Mobil Geliştirici",
    readMinutes: 8,
    body: `## Hesap hazırlığı

Yayın için iki geliştirici hesabı gerekir; kurumsal başvurularda şirket doğrulaması birkaç gün sürebilir. Bu süreyi projenin takvimine ekleyin.

## Mağaza içeriği

- Uygulama adı ve kısa açıklama
- En az beş ekran görüntüsü (her cihaz boyutu için)
- Gizlilik politikası adresi (zorunlu)
- Veri toplama beyanı

## Sık reddedilme sebepleri

1. Gizlilik politikası adresinin çalışmaması
2. Test hesabı verilmemesi
3. Uygulamanın yalnızca web sitesinin çerçeve içine alınmış hali olması
4. Eksik veri toplama beyanı

## Süre

İlk yayın incelemesi genellikle birkaç gün sürer. Reddedilme halinde düzeltip yeniden göndermek süreci uzatır; bu yüzden ilk gönderimi eksiksiz hazırlamak önemlidir.`,
  },
  {
    slug: "kucuk-isletmeler-icin-reklam-butcesi",
    title: "Küçük İşletmeler Reklam Bütçesini Nasıl Planlamalı?",
    category: "reklam-yonetimi",
    excerpt:
      "Aylık bütçenin kanallar arasında nasıl dağıtılacağı, test dönemi ve ölçümlenmesi gereken metrikler.",
    author: "Deniz Aksoy",
    authorTitle: "Performans Pazarlama Uzmanı",
    readMinutes: 6,
    body: `## Test dönemiyle başlayın

İlk ay öğrenme dönemidir. Bütçenin tamamını tek kanala vermek yerine iki kanalda küçük bütçelerle test edin.

## Dağıtım önerisi

Hizmet sektöründe arama ağı genellikle daha hızlı sonuç verir; görsel ağırlıklı ürünlerde sosyal medya öne çıkar. Başlangıç için dengeli bir dağıtım kurup ilk ayın verisine göre kaydırmak en güvenli yöntemdir.

## Ölçülmesi gereken metrikler

- Dönüşüm başına maliyet
- Formu dolduranların gerçekten müşteriye dönüşme oranı
- Kanal bazında müşteri kazanım maliyeti

Tıklama sayısı tek başına anlamlı bir metrik değildir; ölçümü satış tarafına kadar taşıyın.`,
  },
  {
    slug: "yapay-zeka-destekli-musteri-hizmetleri",
    title: "Yapay Zekâ Destekli Müşteri Hizmetleri Ne Zaman İşe Yarar?",
    category: "yapay-zeka",
    excerpt:
      "Otomatik yanıt sistemleri hangi durumda müşteri memnuniyetini artırır, hangi durumda zarar verir?",
    author: "Enes Alyakut",
    authorTitle: "Kurucu",
    readMinutes: 6,
    body: `## İşe yaradığı yerler

Tekrar eden ve cevabı belli sorular: kargo nerede, çalışma saatleri, iade nasıl yapılır. Bu sorular toplam trafiğin büyük kısmını oluşturur ve otomatik yanıtla anında çözülür.

## Zarar verdiği yerler

Şikâyet ve iade talepleri. Sorunu olan bir müşteriyi otomatik yanıt döngüsünde tutmak memnuniyetsizliği büyütür.

## Doğru kurgu

1. Sık sorulan soruları otomatik yanıtlayın.
2. Duygu yoğunluğu yüksek mesajları anında insana aktarın.
3. Otomatik sistemin cevap veremediği durumu açıkça belirtip yönlendirin.

Kurallar netse otomasyon ekibinizin yükünü azaltır; kurallar belirsizse müşteriyi kaybettirir.`,
  },
  {
    slug: "sosyal-medya-yonetimi-ve-icerik-stratejisi",
    title: "2026'da İşletmeler İçin Etkili Sosyal Medya Yönetimi ve İçerik Stratejisi",
    category: "sosyal-medya",
    coverImage: "/gorseller/blog/sosyal-medya-yonetimi-ve-icerik-stratejisi.webp",
    excerpt:
      "Sosyal medyada var olmak ile satış ve güven üreten bir marka olmak arasındaki fark: Algoritmaları lehinize çevirecek stratejiler ve içerik planlama rehberi.",
    author: "Elif Demir",
    authorTitle: "Sosyal Medya Direktörü",
    readMinutes: 7,
    body: `## Sosyal medyada görünürlük neden yetmiyor?

Birçok işletme sosyal medyada düzenli paylaşım yapmasına rağmen satış veya müşteri etkileşimi elde edememekten şikayet eder. Bunun temel nedeni, "paylaşım yapmak için paylaşım yapmak" ile "stratejik bir değer sunmak" arasındaki farktır. 2026 algoritmaları, sadece estetik görsellere değil; kullanıcının içeriği kaydetme, paylaşma ve yorum yapma gibi derin etkileşim metriklerine öncelik tanıyor.

## 1. Hedef kitlenin acı noktalarına odaklanın

İçerik takviminizi oluştururken ürün özelliklerini sıralamak yerine, müşterinizin hangi sorununu çözdüğünüzü anlatın:

- **Eğitici İçerikler (How-to):** Sektörünüzle ilgili pratik ipuçları ve kısa rehberler.
- **Güven Veren Kanıtlar:** Müşteri başarı hikayeleri, öncesi-sonrası karşılaştırmaları ve süreç videoları.
- **Kulis ve Ekip:** Markanın arkasındaki gerçek insanları ve üretim süreçlerini gösteren şeffaf kesitler.

## 2. Reels ve dikey video formatının gücü

Instagram, TikTok ve YouTube Shorts gibi dikey video platformları organik erişimin en güçlü motorudur. İlk 3 saniyede izleyicinin dikkatini çekecek bir kanca (hook) cümlesi belirleyin. Karmaşık ve pahalı prodüksiyonlar yerine net, samimi ve anlaşılır mobil çekimler çoğu zaman daha yüksek dönüşüm sağlar.

## 3. Topluluk yönetimi: Yorumlar ve direkt mesajlar

Sosyal medya tek yönlü bir yayın organı değil, iki yönlü bir diyalog kanalıdır. Gelen yorumlara ve DM'lere ilk 15 dakika içinde verilen kurumsal ama samimi yanıtlar, müşteri sadakatini doğrudan artırır. DM kutunuzu adeta bir mini satış hunisi (funnel) gibi konumlandırın.

## 4. Ölçümleme ve sürekli optimizasyon

Beğeni sayıları gösteriş metriğidir. Asıl takip etmeniz gereken göstergeler:

- Profil ziyaretinden web sitesine tıklama oranı
- Gönderi başına kaydetme ve paylaşma adedi
- Sosyal medyadan gelen form veya sipariş dönüşüm maliyeti

Aylık performans analizleriyle en çok dönüşüm getiren içerik formatlarını belirleyip bütçenizi bu kanallara yoğunlaştırın.`,
  },
  {
    slug: "ozel-yazilim-mi-paket-cozum-mu-rehberi",
    title: "Özel Yazılım mı, Paket Çözüm mü? İşletmeler İçin Kapsamlı Karar Rehberi",
    category: "yazilim",
    coverImage: "/gorseller/blog/ozel-yazilim-mi-paket-cozum-mu-rehberi.webp",
    excerpt:
      "Şirketinizin operasyonlarını dijitalleştirirken hazır paket yazılımlar mı yoksa terzi usulü özel yazılım geliştirme mi tercih edilmeli? Maliyet, esneklik ve ölçeklenebilirlik analizi.",
    author: "Enes Alyakut",
    authorTitle: "Kurucu & Baş Yazılım Mimarı",
    readMinutes: 8,
    body: `## Dijitalleşme yol ayrımı: Hazır mı, özel mi?

Büyüyen her işletme belirli bir aşamada mevcut Excel tablolarının ya da temel CRM araçlarının yetersiz kaldığını fark eder. Bu noktada en kritik soru gündeme gelir: Piyasada satılan hazır bir SaaS paket yazılım mı kiralanmalı, yoksa şirketin iş süreçlerine tam oturan özel bir yazılım mı geliştirilmeli?

## Paket çözümlerin avantajları ve sınırları

Paket yazılımlar (örneğin popüler CRM'ler, genel muhasebe veya standart e-ticaret altyapıları), hızlı kurulum ve düşük başlangıç maliyeti vadeder:

- **Hızlı Devreye Alma:** Günler veya haftalar içinde kullanmaya başlayabilirsiniz.
- **Öngörülebilir Başlangıç:** Aylık/yıllık kullanıcı başı lisans ücretleriyle başlar.
- **Sınırlar:** Şirketiniz büyüdükçe kullanıcı başı lisans maliyetleri katlanarak artar. Daha da önemlisi, iş modelinizi yazılımın sınırlarına uydurmak zorunda kalırsınız.

## Özel yazılım geliştirmenin sunduğu stratejik güç

Özel yazılım (Custom Software), işletmenizin DNA'sına göre kodlanır. Rekabet avantajı yaratan özgün süreçleriniz varsa hazır paketler sizi geride bırakabilir:

1. **Tam Süreç Entegrasyonu:** Depo, saha operasyonları, finans ve müşteri yönetimi tek bir merkezi veritabanında kusursuz konuşur.
2. **Sıfır Kullanıcı Başı Lisans Yükü:** Ekibinize 10 kişi de katılsa 500 kişi de katılsa ek lisans maliyeti ödemezsiniz; sistemin mülkiyeti tamamen sizdedir.
3. **Maksimum Veri Güvenliği ve Uyumluluk:** Şirketinizin kritik ticari sırları ve müşteri verileri üçüncü taraf genel sunucularda değil, kendi denetiminizdeki bulut mimarisinde saklanır.
4. **Sınırsız Ölçeklenebilirlik:** İş modeliniz değiştikçe veya yeni bir pazar açıldığında yazılımınızı dilediğiniz gibi genişletebilirsiniz.

## Hangi durumlarda hangisi seçilmeli?

- **Paket Çözüm Seçin:** Süreçleriniz sektör standardıysa, bütçeniz kısıtlıysa ve iş modelinizde yazılım kritik bir rekabet unsuru oluşturmuyorsa.
- **Özel Yazılım Seçin:** Benzersiz iş akışlarınız varsa, mevcut sistemlerle karmaşık API entegrasyonları gerekiyorsa ve uzun vadede lisans bağımlılığından kurtulup rekabet farkı yaratmak istiyorsanız.`,
  },
  {
    slug: "saglik-turizminde-dijital-donusum-ve-hasta-kazanimi",
    title: "Sağlık Turizminde Dijital Dönüşüm: Yabancı Hasta Kazanımında 6 Altın Kural",
    category: "saglik-turizmi",
    coverImage: "/gorseller/blog/saglik-turizminde-dijital-donusum-ve-hasta-kazanimi.webp",
    excerpt:
      "Türkiye'de sağlık turizmi yapan klinik ve hastaneler için dijital pazarlama, çok dilli web sitesi ve CRM süreçleriyle yabancı hasta kazanım rehberi.",
    author: "Mert Sarı",
    authorTitle: "Sağlık Turizmi Büyüme Danışmanı",
    readMinutes: 9,
    body: `## Sağlık turizminde küresel rekabet ve güven inşası

Türkiye; saç ekimi, diş tedavileri, estetik cerrahi ve genel cerrahi alanlarında dünyanın önde gelen sağlık turizmi merkezlerinden biridir. Ancak sadece kaliteli tıbbi hizmet sunmak uluslararası hasta kazanımı için yeterli değildir. Başka bir ülkeden sağlık hizmeti almayı düşünen potansiyel hasta için en belirleyici faktör dijital temas noktalarında hissettiği "güven" hissiyatıdır.

## 1. Kültürel adaptasyona sahip çok dilli web sitesi

Google Translate ile çevrilmiş web siteleri hasta gözünde güvensizlik oluşturur. Hedef pazarınız İngiltere, Almanya veya Körfez ülkeleri ise:

- Sayfa dili o ülkenin yerel tıbbi terminolojisine ve kültürel diline uygun olmalıdır.
- Hekimlerin uluslararası akreditasyonları, sertifikaları ve vaka tecrübeleri açıkça vurgulanmalıdır.
- Sayfa yüklenme hızı global CDN altyapısıyla desteklenmeli, mobil uyumluluk kusursuz olmalıdır.

## 2. Vaka galerisi ve video hasta referansları

Metin tabanlı referanslar yerine hastaların tedavi öncesi ve sonrası yolculuklarını anlatan video içerikler dönüşüm oranını 4 kata kadar artırır. Hastanın ülkesinden gelip havalimanı transferinden taburcu oluşuna kadar geçen süreci samimi bir dille aktaran hikayeler şüpheleri yok eder.

## 3. Çok dilli hasta çağrı merkezi ve CRM otomasyonu

Bir form doldurulduğunda ilk 5 dakika içinde anadiliyle dönüş alan hastanın kliniği seçme olasılığı %80 daha yüksektir:

- WhatsApp Business API entegrasyonuyla anlık yazışma imkanı sunun.
- Sağlık turizmine özel CRM yazılımı ile hastanın röntgen/fotoğraf yükleme, tedavi planı ve fiyat teklifi aşamalarını anlık takip edin.

## 4. Yetkilendirme ve teşvik yönetimi

Sağlık Bakanlığı Sağlık Turizmi Yetki Belgesi ve Ticaret Bakanlığı destekleri, yurt dışı reklam ve yazılım yatırımlarınızın önemli bir kısmını geri almanızı sağlar. Süreçlerinizi baştan mevzuata ve KVKK / GDPR standartlarına uygun kurun.

## 5. Bütüncül paket deneyimi (Konaklama, Transfer, Tedavi)

Yabancı hastalar sadece bir operasyon değil, sorunsuz bir seyahat deneyimi satın alır. Otel rezervasyonu, VIP transfer, refakatçi ve şehir rehberi gibi detayların dijital teklif aşamasında net ve şeffaf biçimde sunulması dönüşümü belirler.

## 6. Tedavi sonrası (Aftercare) takip sistemi

Ülkesine dönen hastanın iyileşme sürecini otomatik anketler ve hekim görüntülü kontrolleriyle dijital ortamda takip etmek, hem Google inceleme puanlarınızı yükseltir hem de tavsiye ile yeni hastalar kazandırır.`,
  },
  {
    slug: "360-derece-dijital-pazarlama-ve-buyume-rehberi",
    title: "Büyümek İsteyen Markalar İçin 360 Derece Dijital Pazarlama Yol Haritası",
    category: "dijital-pazarlama",
    coverImage: "/gorseller/blog/360-derece-dijital-pazarlama-ve-buyume-rehberi.webp",
    excerpt:
      "Yalnızca tek bir kanala bağlı kalmadan; SEO, performans pazarlama, içerik yönetimi ve veri analitiğini bir araya getiren bütünleşik büyüme stratejisi.",
    author: "Deniz Aksoy",
    authorTitle: "Performans Pazarlama & Büyüme Uzmanı",
    readMinutes: 8,
    body: `## Neden tek bir dijital pazarlama kanalı artık yetersiz?

Birçok işletme dijital pazarlamayı sadece Meta veya Google reklamı vermekle eşdeğer görür. Oysa reklam maliyetlerinin küresel ölçekte arttığı günümüzde, yalnızca tıklama başına maliyete (CPC) dayalı büyüme sürdürülebilir değildir. Başarılı markalar, trafiğin nereden geldiğini ve nasıl sadık bir müşteriye dönüştüğünü 360 derece bütünleşik bir modelle yönetir.

## 360 Derece pazarlamanın 4 temel sacayağı

### 1. Organik Varlık ve SEO (Arama Motoru Optimizasyonu)
Reklam bütçenizi kapattığınız gün trafiğiniz sıfıra iniyorsa markanız risk altındadır. Sektörünüzle ilgili yüksek niyetli arama terimlerinde ilk sayfada yer almak:
- Sıfır medya maliyetli, sürekli nitelikli ziyaretçi akışı sağlar.
- Marka otoritesini ve güvenilirliğini organik olarak pekiştirir.

### 2. Hedefe Yönelik Performans Reklamları (Google, Meta, TikTok)
Yeni kitlelere hızla ulaşmak ve anında sıcak dönüşüm toplamak için performans reklamları vazgeçilmezdir:
- Arama niyeti yüksek kullanıcılara Google Arama Ağı ve Alışveriş reklamları,
- Görsel ve hikaye tabanlı ürün/hizmet tanıtımlarında Meta ve TikTok reklamları,
- Sitenizi ziyaret edip satın almadan ayrılanlar için dinamik yeniden pazarlama (retargeting) kurguları.

### 3. Değer Odaklı İçerik ve Sosyal Medya
Kullanıcılar doğrudan bir reklam görmektense sorunlarına çözüm sunan içeriklerle bağ kurar. Düzenli blog yazıları, vaka analizleri ve bilgilendirici sosyal medya paylaşımları soğuk kitleyi sıcak alıcı haline getirir.

### 4. Dönüşüm Oranı Optimizasyonu (CRO) ve Veri Analitiği
Sitenize 10.000 kişi gelmesi tek başına bir anlam ifade etmez; önemli olan kaç kişinin form doldurduğu veya satın alma yaptığıdır:
- Isı haritaları ile kullanıcıların nerede takıldığını tespit edin.
- A/B testleriyle başlık, buton rengi ve form uzunluklarını optimize edin.
- Google Analytics 4 (GA4) üzerinden gerçek müşteri edinme maliyetinizi (CAC) ve müşteri yaşam boyu değerini (LTV) takip edin.

## Sürdürülebilir büyüme için entegrasyon şart

360 derece dijital pazarlama, tüm bu kanalların bir senfoni orkestrası gibi birbiriyle senkronize çalışmasıdır. SEO ile gelen kullanıcı yeniden pazarlama reklamıyla yakalanır, kaliteli içerikle eğitilir ve CRM üzerinden sadık müşteriye dönüştürülür.`,
  },
];

export const PORTFOLIO = [
  {
    slug: "moda-butik-eticaret-donusumu",
    title: "Moda Butik E-Ticaret Dönüşümü",
    client: "Moda Butik",
    sector: "Perakende",
    category: "eticaret",
    summary: "Instagram üzerinden satış yapan butiğin kendi e-ticaret altyapısına geçişi.",
    problem:
      "Siparişler sosyal medya mesajlarından manuel toplanıyordu. Stok takibi yapılamadığı için satılan ürünler tekrar satılıyor, müşteri iptalleri yaşanıyordu.",
    solution:
      "Vitrin E-Ticaret Sitesi kuruldu, ürün girişleri ve varyasyon yapısı tarafımızca oluşturuldu. Sanal POS ve kargo entegrasyonu tamamlandı, terk edilen sepet hatırlatması devreye alındı.",
    services: ["E-ticaret kurulumu", "Ürün girişi", "Ödeme entegrasyonu", "Kargo entegrasyonu"],
    technologies: ["WordPress", "WooCommerce", "PHP"],
    results: [
      { label: "Aylık sipariş", value: "3,4 kat" },
      { label: "Sipariş hatası", value: "%92 azalma" },
      { label: "Yayına alma", value: "9 gün" },
    ],
    testimonial: "Siparişleri artık tek panelden yönetiyoruz, stok karışıklığı tamamen bitti.",
    isFeatured: true,
  },
  {
    slug: "dis-klinigi-saglik-turizmi",
    title: "Diş Kliniği Sağlık Turizmi Projesi",
    client: "Dentaline Klinik",
    sector: "Sağlık",
    category: "saglik",
    summary: "Yurt dışı hasta adayı toplamak için çok dilli site ve reklam yönetimi.",
    problem:
      "Klinik yalnızca yerel hastalara hizmet veriyordu. Yurt dışı talebi için ne bir dil altyapısı ne de takip edilebilir bir başvuru akışı vardı.",
    solution:
      "Medica Klinik Web Sitesi dört dilde kuruldu. Hasta adayı formu CRM'e bağlandı, WhatsApp yönlendirmesi eklendi ve hedef ülkelerde reklam kampanyaları yürütüldü.",
    services: ["Çok dilli site kurulumu", "Reklam yönetimi", "CRM entegrasyonu", "SEO"],
    technologies: ["Next.js", "PostgreSQL", "React"],
    results: [
      { label: "Aylık hasta adayı", value: "0 → 140" },
      { label: "Form dönüşüm oranı", value: "%6,2" },
      { label: "Hedef ülke", value: "4 ülke" },
    ],
    testimonial: "Yurt dışı başvuruları artık düzenli geliyor ve hepsini tek yerden takip edebiliyoruz.",
    isFeatured: true,
  },
  {
    slug: "restoran-zinciri-siparis-uygulamasi",
    title: "Restoran Zinciri Sipariş Uygulaması",
    client: "Sofra Lezzet",
    sector: "Yiyecek & İçecek",
    category: "mobil",
    summary: "Beş şubeli restoran zinciri için kendi sipariş uygulaması.",
    problem:
      "Siparişlerin tamamı aracı platformlar üzerinden geliyordu ve her siparişte yüksek komisyon ödeniyordu. Müşteri verisine erişim yoktu.",
    solution:
      "Hızlı Sipariş Restoran Uygulaması beş şube için yapılandırıldı. Mutfak ekranı ve kurye takibi devreye alındı, mağaza yayın süreçleri tamamlandı.",
    services: ["Mobil uygulama kurulumu", "Mağaza yayını", "Eğitim", "Teknik destek"],
    technologies: ["Flutter", "Node.js", "PostgreSQL"],
    results: [
      { label: "Komisyonsuz sipariş payı", value: "%38" },
      { label: "Ortalama teslim süresi", value: "7 dk kısaldı" },
      { label: "Uygulama indirme", value: "12.400" },
    ],
    testimonial: "Kendi müşterimizi tanımaya başladık, kampanyaları artık doğrudan biz kurguluyoruz.",
    isFeatured: true,
  },
  {
    slug: "muhendislik-firmasi-kurumsal-site",
    title: "Mühendislik Firması Kurumsal Site Yenileme",
    client: "Aydın Mühendislik",
    sector: "Sanayi",
    category: "web",
    summary: "On yıllık kurumsal sitenin yenilenmesi ve arama görünürlüğünün artırılması.",
    problem:
      "Mevcut site mobil uyumlu değildi, mobilde açılış süresi sekiz saniyeyi aşıyordu. Referans projeler siteye girilememişti.",
    solution:
      "Atlas Kurumsal Web Sitesi kuruldu, 42 referans projesi görselleriyle sisteme aktarıldı. Teknik SEO çalışması yapıldı ve İngilizce dil desteği eklendi.",
    services: ["Kurumsal site kurulumu", "İçerik girişi", "SEO", "Çoklu dil"],
    technologies: ["WordPress", "PHP", "MySQL"],
    results: [
      { label: "Mobil açılış süresi", value: "8,1 sn → 1,4 sn" },
      { label: "Organik trafik", value: "%210 artış" },
      { label: "Teklif talebi", value: "Aylık 6 → 23" },
    ],
    testimonial: "Site artık firmamızı hak ettiği gibi temsil ediyor.",
    isFeatured: false,
  },
  {
    slug: "yapi-firmasi-crm-kurulumu",
    title: "Yapı Firması CRM Kurulumu",
    client: "Korkmaz Yapı",
    sector: "İnşaat",
    category: "yazilim",
    summary: "Satış ekibinin teklif ve müşteri takibinin sisteme taşınması.",
    problem:
      "Teklifler farklı bilgisayarlardaki tablolarda tutuluyordu. Bir satış temsilcisi ayrıldığında müşteri geçmişi kayboluyordu.",
    solution:
      "Pusula CRM Sistemi kuruldu, mevcut 1.800 müşteri kaydı sisteme aktarıldı. Ekibe iki oturumluk eğitim verildi ve teklif şablonları firmaya uyarlandı.",
    services: ["CRM kurulumu", "Veri aktarımı", "Özel modül geliştirme", "Eğitim"],
    technologies: ["Next.js", "PostgreSQL", "TypeScript"],
    results: [
      { label: "Teklif hazırlama süresi", value: "45 dk → 8 dk" },
      { label: "Takip edilen fırsat", value: "1.800 kayıt" },
      { label: "Kapanan satış", value: "%19 artış" },
    ],
    testimonial: "Hangi teklifin nerede kaldığını artık herkes görüyor.",
    isFeatured: false,
  },
  {
    slug: "spor-salonu-uyelik-uygulamasi",
    title: "Spor Salonu Üyelik Uygulaması",
    client: "Formda Spor",
    sector: "Spor & Sağlık",
    category: "mobil",
    summary: "Üye takibi ve abonelik yenilemesinin uygulamaya taşınması.",
    problem:
      "Üyelik yenilemeleri telefonla hatırlatılıyor, ölçüm kayıtları kâğıt üzerinde tutuluyordu. Yenilenmeyen üyelikler geç fark ediliyordu.",
    solution:
      "Formda Fitness Uygulaması kuruldu. Abonelik satışı uygulamaya taşındı, antrenörler için plan atama ve ölçüm takibi devreye alındı.",
    services: ["Mobil uygulama kurulumu", "Ödeme entegrasyonu", "Mağaza yayını", "Bakım"],
    technologies: ["React Native", "Node.js", "PostgreSQL"],
    results: [
      { label: "Üyelik yenileme oranı", value: "%54 → %78" },
      { label: "Aktif kullanıcı", value: "2.100" },
      { label: "Kâğıt kayıt", value: "Tamamen kaldırıldı" },
    ],
    testimonial: "Üyelerimiz gelişimlerini görünce salona bağlılıkları arttı.",
    isFeatured: false,
  },
];

export const FAQS = [
  { category: "satin-alma", question: "Ürünü satın aldıktan sonra ne oluyor?", answer: "Ödeme onaylandığı anda hesabınıza sipariş özeti, lisans anahtarı ve indirme bağlantısı tanımlanır. Kurulum hizmeti seçtiyseniz ekibimiz aynı iş günü içinde proje bilgi formunu göndererek süreci başlatır." },
  { category: "satin-alma", question: "Satın almadan önce ürünü deneyebilir miyim?", answer: "Evet. Demo Merkezi üzerinden ürünlerin canlı demosunu, yönetim paneli demosunu ve mobil görünümünü inceleyebilirsiniz. Demo hesapları gerçek sistemden izole çalışır ve düzenli olarak sıfırlanır." },
  { category: "satin-alma", question: "Fatura kesiliyor mu?", answer: "Evet, tüm siparişler için e-fatura veya e-arşiv fatura düzenlenir. Ödeme sayfasında kurumsal müşteri seçeneğini işaretleyip vergi bilgilerinizi girmeniz yeterlidir." },
  { category: "odeme", question: "Hangi ödeme yöntemlerini kullanabilirim?", answer: "Kredi ve banka kartıyla online ödeme ile havale/EFT seçenekleri sunulur. Kart bilgileriniz sistemimizde saklanmaz; ödeme, lisanslı ödeme kuruluşunun güvenli sayfası üzerinden tamamlanır." },
  { category: "odeme", question: "Taksit imkânı var mı?", answer: "Kartınızın bankasına ve tutara bağlı olarak taksit seçenekleri ödeme adımında görüntülenir. Taksit seçenekleri bankalar tarafından belirlenir." },
  { category: "lisans", question: "Lisans türleri arasındaki fark nedir?", answer: "Standart lisans tek bir domain veya proje içindir. Genişletilmiş lisans daha geniş ticari kullanım ve daha uzun destek sunar. Size Özel lisansta ürün markanıza uyarlanır ve talebe bağlı olarak kaynak kodun tam devri ile ürünün satıştan kaldırılması seçenekleri değerlendirilir." },
  { category: "lisans", question: "Aldığım ürünü başka müşterilere satabilir miyim?", answer: "Standart ve genişletilmiş lisanslar yeniden satış hakkı içermez. Yeniden satış veya devir gerektiren durumlar yalnızca Size Özel lisans kapsamında, ayrı bir sözleşmeyle değerlendirilir." },
  { category: "lisans", question: "Lisansımı başka bir domaine taşıyabilir miyim?", answer: "Evet. Hesabım > Lisanslarım bölümünden mevcut domaini kaldırıp yenisini tanımlayabilirsiniz. Lisansın izin verdiği domain sayısı lisans türüne göre değişir." },
  { category: "indirme", question: "İndirme bağlantım ne kadar süre geçerli?", answer: "İndirme bağlantıları hesabınıza bağlıdır ve süreli çalışır. Bağlantının süresi dolduğunda Hesabım > İndirmelerim bölümünden yeni bir bağlantı oluşturabilirsiniz. Her indirme işlemi güvenlik amacıyla kayıt altına alınır." },
  { category: "kurulum", question: "Kurulumu kendim yapabilir miyim?", answer: "Evet. Her üründe adım adım kurulum dokümanı ve kurulum videosu bulunur. Kendiniz yapmak istemiyorsanız, sepete eklerken profesyonel kurulum hizmetini seçebilirsiniz." },
  { category: "kurulum", question: "Kurulum için hangi bilgileri vermem gerekiyor?", answer: "Domain adı, hosting erişim bilgileri, logo, kurumsal renkler ve iletişim bilgileri yeterlidir. Bu bilgileri sipariş sonrası açılan proje bilgi formundan güvenli şekilde iletebilirsiniz." },
  { category: "teslimat", question: "Teslim süresi ne kadar?", answer: "Yalnızca dosya teslimi seçilen ürünlerde teslimat ödeme onayının hemen ardından yapılır. Kurulum ve ek hizmet seçilen siparişlerde tahmini süre ürün sayfasında ve sepette gösterilir; ek hizmet ekledikçe süre güncellenir." },
  { category: "guncelleme", question: "Güncellemeler ücretsiz mi?", answer: "Lisansınızın kapsadığı güncelleme süresi boyunca yeni sürümler ücretsizdir. Süre dolduktan sonra ürünü kullanmaya devam edebilir, dilerseniz güncelleme sürenizi uzatabilirsiniz." },
  { category: "destek", question: "Teknik destek neleri kapsıyor?", answer: "Destek; kurulum sorunları, ürün hataları ve kullanım soruları ile sınırlıdır. Yeni özellik geliştirme ve tasarım değişiklikleri özelleştirme hizmeti kapsamında ayrıca fiyatlandırılır." },
  { category: "iade", question: "Dijital ürünlerde iade mümkün mü?", answer: "Dijital ürünlerde indirme başlatıldıktan veya lisans anahtarı kullanıldıktan sonra mevzuat gereği cayma hakkı kullanılamaz. Ürün tanıtımıyla uyuşmayan veya çalışmayan bir durum söz konusuysa öncelikle destek kaydı açmanızı, çözülemezse iade talebi oluşturmanızı rica ederiz." },
];

/**
 * Yasal sayfa şablonları.
 * ÖNEMLİ: Bu metinler bilgilendirme amaçlı taslaklardır, hukuki danışmanlık değildir.
 * Yayına almadan önce faaliyet modelinize göre bir hukuk uzmanı tarafından incelenmelidir.
 */
const LEGAL_NOTE =
  "\n\n> **Not:** Bu metin genel bir taslaktır ve hukuki danışmanlık niteliği taşımaz. Yayına almadan önce şirketinizin faaliyet modeline göre bir hukuk uzmanı tarafından gözden geçirilmelidir.";

export const PAGES = [
  {
    slug: "gizlilik-politikasi",
    title: "Gizlilik Politikası",
    group: "yasal",
    body: `## Toplanan veriler

Site üzerinden ad, soyad, e-posta, telefon, fatura bilgileri ve sipariş kayıtları toplanır. Ödeme kartı bilgileri sistemimizde saklanmaz; ödeme işlemi lisanslı ödeme kuruluşu tarafından yürütülür.

## Verilerin kullanım amacı

Veriler sipariş oluşturma, dijital teslimat, fatura düzenleme, teknik destek ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.

## Saklama süresi

Sipariş ve fatura kayıtları ilgili mevzuatın öngördüğü süre boyunca saklanır. Bu sürenin sonunda veriler silinir veya anonim hale getirilir.

## Haklarınız

Verilerinize erişme, düzeltme, silme ve işlenmesine itiraz etme haklarına sahipsiniz. Taleplerinizi iletişim sayfasındaki adrese iletebilirsiniz.${LEGAL_NOTE}`,
  },
  {
    slug: "kvkk-aydinlatma-metni",
    title: "KVKK Aydınlatma Metni",
    group: "yasal",
    body: `## Veri sorumlusu

Kişisel verileriniz, veri sorumlusu sıfatıyla Lizart Dijital tarafından işlenmektedir.

## İşlenen veriler ve hukuki sebep

Kimlik, iletişim, müşteri işlem ve işlem güvenliği verileri; sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi ve meşru menfaat hukuki sebeplerine dayanılarak işlenir.

## Aktarım

Veriler; ödeme hizmet sağlayıcıları, e-fatura entegratörü, barındırma hizmeti sağlayıcıları ve yetkili kamu kurumlarıyla, yalnızca hizmetin gerektirdiği ölçüde paylaşılır.

## İlgili kişi hakları

KVKK'nın 11. maddesi kapsamındaki haklarınızı kullanmak için başvurularınızı yazılı olarak iletebilirsiniz.${LEGAL_NOTE}`,
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    group: "yasal",
    body: `## Kullanılan çerezler

**Zorunlu çerezler:** Oturum yönetimi ve sepetin çalışması için gereklidir, devre dışı bırakılamaz.

**Tercih çerezleri:** Dil ve görünüm tercihlerinizi hatırlar.

**Analitik çerezler:** Site kullanımını ölçmek için kullanılır ve yalnızca onayınızla çalışır.

## Tercihlerinizi yönetme

Çerez tercihlerinizi sayfanın alt kısmındaki çerez tercihleri bağlantısından veya tarayıcı ayarlarınızdan istediğiniz zaman değiştirebilirsiniz.${LEGAL_NOTE}`,
  },
  {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    group: "yasal",
    body: `## Kapsam

Bu koşullar, siteyi ziyaret eden ve sitede satılan dijital ürün ve hizmetleri satın alan tüm kullanıcılar için geçerlidir.

## Kullanıcı yükümlülükleri

Hesap bilgilerinizin güvenliğinden siz sorumlusunuz. Satın alınan ürünlerin lisans koşullarına aykırı şekilde çoğaltılması, dağıtılması veya yeniden satılması yasaktır.

## Hizmetin sürekliliği

Planlı bakım çalışmaları önceden duyurulur. Teknik zorunluluk hallerinde hizmete kısa süreli ara verilebilir.${LEGAL_NOTE}`,
  },
  {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    group: "yasal",
    body: `## Taraflar ve konu

İşbu sözleşme, satıcı Lizart Dijital ile alıcı arasında, sipariş formunda belirtilen dijital ürün ve hizmetlerin satışına ilişkin olarak düzenlenmiştir.

## Ürün bilgileri ve bedel

Satın alınan ürünün adı, lisans türü, seçilen ek hizmetler ve KDV dahil toplam bedel sipariş özetinde yer alır.

## Teslimat

Dijital ürünler, ödemenin onaylanmasının ardından alıcının hesabına tanımlanan güvenli indirme bağlantısı ve lisans anahtarı ile teslim edilir. Kurulum içeren siparişlerde teslim, kurulumun tamamlanmasıyla gerçekleşir.

## Cayma hakkı

Elektronik ortamda anında ifa edilen ve tüketiciye anında teslim edilen gayrimaddi mallarda, ifaya başlanmasının ardından cayma hakkı kullanılamaz.${LEGAL_NOTE}`,
  },
  {
    slug: "on-bilgilendirme-formu",
    title: "Ön Bilgilendirme Formu",
    group: "yasal",
    body: `## Satıcı bilgileri

Unvan, adres ve iletişim bilgileri iletişim sayfasında yer almaktadır.

## Sipariş konusu

Sipariş özetinde belirtilen dijital ürün, lisans türü ve ek hizmetler.

## Ödeme ve teslimat

Ödeme, online kart ödemesi veya havale/EFT ile yapılır. Teslimat, ödeme onayının ardından dijital ortamda gerçekleştirilir.

## Cayma hakkına ilişkin bilgilendirme

Dijital içeriklerin ifasına başlanmasının ardından cayma hakkının kullanılamayacağı hususunda bilgilendirilmiş sayılırsınız.${LEGAL_NOTE}`,
  },
  {
    slug: "iptal-ve-iade-politikasi",
    title: "İptal ve İade Politikası",
    group: "yasal",
    body: `## İptal

Ödemesi tamamlanmamış siparişler hesabınızdan iptal edilebilir.

## İade

İndirme başlatılmamış ve lisans anahtarı kullanılmamış siparişlerde iade talebi değerlendirilir. Ürünün tanıtımında belirtilen şekilde çalışmadığı ve teknik destekle çözülemediği durumlarda iade yapılır.

## Hizmet siparişleri

Başlanmış hizmet siparişlerinde, tamamlanan iş kalemleri düşülerek kalan tutar iade edilir.${LEGAL_NOTE}`,
  },
  {
    slug: "dijital-urun-teslimat-politikasi",
    title: "Dijital Ürün Teslimat Politikası",
    group: "yasal",
    body: `## Teslim yöntemi

Dijital ürünler, müşteri hesabına tanımlanan süreli ve imzalı indirme bağlantıları ile teslim edilir. Dosyalar herkese açık bağlantılarda tutulmaz.

## İndirme koşulları

Her indirme bağlantısı belirli bir süre ve indirme sayısı ile sınırlıdır. Limit dolduğunda hesabınızdan yeni bağlantı oluşturabilirsiniz.

## Kurulum içeren siparişler

Kurulum hizmeti seçilen siparişlerde teslim, kurulumun tamamlanıp müşteri onayının alınmasıyla gerçekleşir.${LEGAL_NOTE}`,
  },
  {
    slug: "dijital-hizmet-kullanim-kosullari",
    title: "Dijital Hizmet Kullanım Koşulları",
    group: "yasal",
    body: `## Hizmet kapsamı

Her hizmet paketinin kapsamı, teslim süresi ve revizyon hakkı ilgili ürün sayfasında belirtilir.

## Müşteri sorumlulukları

Hizmetin zamanında tamamlanabilmesi için gerekli içerik, erişim ve onayların süresi içinde iletilmesi gerekir. Gecikmeler teslim süresini uzatır.

## Fikri mülkiyet

Hizmet kapsamında üretilen özgün çalışmaların kullanım hakkı, bedelin tamamının ödenmesiyle müşteriye geçer.${LEGAL_NOTE}`,
  },
  {
    slug: "lisans-sozlesmesi",
    title: "Lisans Sözleşmesi",
    group: "yasal",
    body: `## Standart lisans

Tek domain veya tek proje için kullanım hakkı verir. Yeniden satış ve dağıtım hakkı içermez.

## Genişletilmiş lisans

Daha geniş ticari kullanım, daha uzun destek ve güncelleme süresi sağlar. Ürünün olduğu gibi yeniden satışına izin vermez.

## Size özel lisans

Ürünün markanıza uyarlanmasını kapsar. Talebe bağlı olarak kaynak kodun tam devri ve ürünün mağazadan kaldırılması ayrı bir sözleşmeyle değerlendirilir.

## Ortak hükümler

Lisans devredilemez; lisans koşullarına aykırı kullanım tespit edildiğinde lisans iptal edilebilir.${LEGAL_NOTE}`,
  },
  {
    slug: "uyelik-sozlesmesi",
    title: "Üyelik Sözleşmesi",
    group: "yasal",
    body: `## Üyelik

Üyelik, formun doldurulup koşulların onaylanmasıyla kurulur. Verdiğiniz bilgilerin doğruluğundan siz sorumlusunuz.

## Hesap güvenliği

Şifrenizi üçüncü kişilerle paylaşmayınız. Hesabınız üzerinden yapılan işlemlerden siz sorumlu tutulursunuz.

## Üyeliğin sona ermesi

Üyeliğinizi istediğiniz zaman sonlandırabilirsiniz. Satın alınmış ürünlere ilişkin kayıtlar yasal saklama süresi boyunca korunur.${LEGAL_NOTE}`,
  },
  {
    slug: "acik-riza-metni",
    title: "Açık Rıza Metni",
    group: "yasal",
    body: `Ticari elektronik ileti gönderilmesi ve pazarlama amaçlı analiz çalışmaları yapılabilmesi için kişisel verilerimin işlenmesine açık rıza veriyorum.

Bu rızayı istediğim zaman geri çekebileceğimi, geri çekmemin sipariş ve destek süreçlerini etkilemeyeceğini biliyorum. Rıza geri çekildiğinde ticari ileti gönderimi durdurulur.${LEGAL_NOTE}`,
  },
  {
    slug: "cerez-tercihleri",
    title: "Çerez Tercihleri",
    group: "yasal",
    body: `Çerez tercihlerinizi bu sayfadan veya sayfanın altında yer alan çerez tercihleri bağlantısından yönetebilirsiniz.

Zorunlu çerezler sitenin çalışması için gereklidir ve kapatılamaz. Analitik ve pazarlama çerezleri yalnızca onay verdiğinizde çalışır; onayınızı istediğiniz zaman geri alabilirsiniz.${LEGAL_NOTE}`,
  },
];
