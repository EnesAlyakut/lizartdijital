const { PrismaClient } = require("../src/generated/prisma");
const fs = require("node:fs");
const path = require("node:path");

const prisma = new PrismaClient();

async function main() {
  const targetDir = path.join(__dirname, "../public/gorseller/blog");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Görselleri kopyala
  const artifactDir = "C:\\Users\\enesa\\.gemini\\antigravity-ide\\brain\\9d16917c-26f4-4369-b414-a04782f54a52";
  
  const imageFiles = [
    {
      src: path.join(artifactDir, "dijital_pazarlama_rehberi_1789375108718.jpg"),
      dest: path.join(targetDir, "dijital-pazarlama-rehberi.jpg"),
      url: "/gorseller/blog/dijital-pazarlama-rehberi.jpg",
    },
    {
      src: path.join(artifactDir, "saglik_turizmi_rehberi_1789375126002.jpg"),
      dest: path.join(targetDir, "saglik-turizmi-rehberi.jpg"),
      url: "/gorseller/blog/saglik-turizmi-rehberi.jpg",
    },
    {
      src: path.join(artifactDir, "sosyal_medya_yonetimi_1789375145744.jpg"),
      dest: path.join(targetDir, "sosyal-medya-yonetimi.jpg"),
      url: "/gorseller/blog/sosyal-medya-yonetimi.jpg",
    },
    {
      src: path.join(artifactDir, "ozel_yazilim_rehberi_1789375168693.jpg"),
      dest: path.join(targetDir, "ozel-yazilim-rehberi.jpg"),
      url: "/gorseller/blog/ozel-yazilim-rehberi.jpg",
    },
  ];

  for (const img of imageFiles) {
    if (fs.existsSync(img.src)) {
      fs.copyFileSync(img.src, img.dest);
      console.log(`Görsel kopyalandı: ${img.dest}`);
    } else {
      console.warn(`Kaynak görsel bulunamadı: ${img.src}`);
    }
  }

  // 2. Kategorileri çek
  const categories = await prisma.blogCategory.findMany();
  const catMap = {};
  for (const c of categories) {
    catMap[c.slug] = c.id;
  }

  // 3. Web Tasarım kategorisindeki taslağı yayına al
  await prisma.blogPost.updateMany({
    where: { slug: "hazir-web-sitesi-mi-ozel-tasarim-mi" },
    data: { isPublished: true },
  });
  console.log("Web Tasarım taslağı yayına alındı.");

  // 4. Yeni makaleleri oluştur / güncelle
  const postsToPublish = [
    // 1. DİJİTAL PAZARLAMA
    {
      slug: "b2b-ve-kobiler-icin-butunlesik-dijital-pazarlama-stratejisi",
      title: "2026'da KOBİ ve B2B Firmalar İçin Bütünleşik Dijital Pazarlama Rehberi",
      categorySlug: "dijital-pazarlama",
      coverImage: "/gorseller/blog/dijital-pazarlama-rehberi.jpg",
      readMinutes: 6,
      excerpt: "Parçalı reklam harcamaları yerine SEO, performans pazarlaması, içerik mimarisi ve CRM'i tek çatı altında buluşturan bütünleşik büyüme stratejisi.",
      metaTitle: "KOBİ'ler İçin Bütünleşik Dijital Pazarlama Stratejisi | Lizart Blog",
      metaDescription: "Dijital pazarlamada bütçenizi verimli kullanarak sürdürülebilir müşteri edinimi sağlamanın yolları. SEO, Google Ads, e-posta ve dönüşüm optimizasyonu rehberi.",
      body: `Dijital pazarlama dünyası son yıllarda radikal bir değişim geçirdi. Yalnızca sosyal medya gönderisi paylaşmak ya da plansız Google Ads reklamları vermek, artan tıklama maliyetleri (CPC) karşısında kârlı bir büyüme sağlamak için artık yeterli değil. 

Günümüzün rekabetçi pazarında başarıya ulaşan şirketler, tüm temas noktalarını tek bir müşteri yolculuğunda birleştiren **bütünleşik dijital pazarlama (Integrated Digital Marketing)** modelini benimsiyor.

---

## 1. Neden Bütünleşik Strateji?

Pazarlama kanallarını birbirinden bağımsız adacıklar olarak yönettiğinizde aşağıdaki sorunlarla karşılaşırsınız:
- **Veri Kopukluğu:** Reklamdan gelen kullanıcının web sitesindeki davranışları ölçülemez, dönüşüm hunisindeki (funnel) tıkanmalar tespit edilemez.
- **Yüksek Müşteri Edinme Maliyeti (CAC):** Yalnızca ücretli reklama bağımlı kalındığında, reklam bütçesi durduğu an müşteri akışı da durur.
- **Marka Tutarsızlığı:** Sosyal medyada verilen mesaj ile web sitesindeki açılış sayfası (landing page) birbiriyle örtüşmediğinde güven kaybı yaşanır.

Bütünleşik strateji ise **SEO (organik arama)**, **performans reklamları**, **e-posta otomasyonu** ve **dönüşüm odaklı web arayüzünü** birbiriyle konuşturarak her harcanan liranın çarpan etkisi yaratmasını sağlar.

---

## 2. Bütünleşik Pazarlama Hunisinin (Funnel) 4 Aşaması

### 1. Aşama: Farkındalık ve Niyet Trafiği (TOFU)
Kullanıcı henüz markanızı tanımaz ancak bir sorunu çözmek istemektedir. Bu aşamada:
- Sorun odaklı blog yazıları ve rehber içerikler (SEO odaklı),
- Sektörel YouTube videoları ve kısa formatlı reels/shorts analizleri,
- Google Arama Ağı'nda bilgilendirici anahtar kelimelere yönelik reklamlar devreye girer.

### 2. Aşama: İnceleme ve Değerlendirme (MOFU)
Müşteri adayı çözüm alternatiflerini karşılaştırmaktadır:
- Canlı ürün demoları ve vaka çalışmaları (case study),
- Karşılaştırma tabloları ve şeffaf hizmet paket sayfaları,
- Remarketing (yeniden pazarlama) kurgularıyla önceki ziyaretçilere referans hikayeleri göstermek.

### 3. Aşama: Karar ve Satın Alma (BOFU)
Kullanıcı teklif almaya veya satın almaya hazırdır:
- Hızlı teklif formları ve tek tıkla WhatsApp danışma hattı,
- Net fiyatlandırma, sözleşmeli teslimat ve müşteri referansları,
- Sepet terk otomasyonları ve sınırlı süreli teşvikler.

### 4. Aşama: Sadakat ve Tavsiye (Advocacy)
- Satış sonrası düzenli teknik destek ve memnuniyet aramaları,
- Faydalı sektör bültenleri,
- Ek hizmet ve çapraz satış (cross-sell) fırsatları.

---

## 3. Ölçümleme: Hangi Metrikleri Takip Etmelisiniz?

Doğru kurulmamış bir Google Analytics 4 (GA4) ve Meta Pixel altyapısı, gözü kapalı araba kullanmaya benzer. İzlenmesi gereken temel göstergeler:
- **ROAS (Reklam Harcaması Getirisi):** Reklama yatırılan her 1 TL'nin kaç TL ciro ürettiği.
- **Dönüşüm Oranı (Conversion Rate):** Siteye gelen her 100 kişiden kaçının form doldurduğu veya satın alma yaptığı.
- **LTV (Müşteri Yaşam Boyu Değeri):** Bir müşterinin firmanızla çalıştığı süre boyunca sağladığı toplam gelir.

---

## Sonuç ve Eylem Planı

Dijital pazarlama tek seferlik bir kampanya değil, sürekli test ve optimizasyon gerektiren bir büyüme motorudur. Lizart Dijital olarak web mimarinizden reklam yönetiminize kadar tüm süreci uçtan uca yönetiyor, şeffaf raporlama ile büyümenizi güvence altına alıyoruz.`,
    },

    // 2. SAĞLIK TURİZMİ
    {
      slug: "saglik-turizminde-dijital-hasta-edinimi-ve-web-sitesi-standartlari",
      title: "Sağlık Turizminde Dijital Hasta Edinimi ve Çok Dilli Web Sitesi Kılavuzu",
      categorySlug: "saglik-turizmi",
      coverImage: "/gorseller/blog/saglik-turizmi-rehberi.jpg",
      readMinutes: 7,
      excerpt: "Yurt dışından hasta çeken klinikler için çok dilli web sitesi mimarisi, güven inşa eden öncesi-sonrası sunumu ve mevzuata uygun dönüşüm akışı.",
      metaTitle: "Sağlık Turizminde Dijital Hasta Edinimi & Web Mimarisi | Lizart Blog",
      metaDescription: "Estetik, diş ve cerrahi kliniklerinin uluslararası hasta kazanımını artıran çok dilli web sitesi özellikleri, KVKK/GDPR uyumu ve dijital reklam stratejileri.",
      body: `Türkiye, sağlık turizminde dünyanın en çok tercih edilen destinasyonlarından biri haline geldi. Ancak rekabetin yoğunlaşmasıyla birlikte, yabancı hastaların güvenini kazanmak ve tedavi için seyahat etmelerini sağlamak artık sıradan bir web sitesiyle mümkün olmuyor.

Birleşik Krallık, Almanya, İtalya veya Körfez ülkelerinden hasta çeken kliniklerin dijital varlıklarında dikkat etmesi gereken kritik standartları inceledik.

---

## 1. İlk İzlenim ve Güven Mimarisi (Trust Building)

Yurt dışından gelen bir hasta için binlerce kilometre yol kat edip cerrahi bir işlem yaptırmak yüksek bir duygusal ve finansal risk barındırır. Web sitenizin bu kaygıyı ilk 10 saniyede gidermesi gerekir:
- **Hekim Özgeçmişleri ve Akreditasyonlar:** Doktorların uluslararası sertifikaları, uzmanlık yılları ve vaka sayıları şeffaf bir şekilde listelenmelidir.
- **Klinik ve Ameliyathane Sanal Turu:** Kliniğin hijyen standartlarını, modern teknolojik donanımını ve hasta odalarını gösteren 4K fotoğraf ve videolar güven katsayısını %70 artırır.
- **Doğrulanmış Hasta Yorumları ve Video Hikayeleri:** Kendi ana dilinde konuşan hastaların samimi video deneyimleri en güçlü satış argümanıdır.

---

## 2. Çok Dilli Altyapı Nasıl Kurgulanmalı?

Otomatik Google Translate eklentileri sağlık turizmi için yetersiz ve risklidir. Tıbbi terimlerin yanlış çevrilmesi hastada güvensizlik yaratır:
- **Hedef Ülkeye Özel Dil Desteği:** İngilizce, Almanca, Fransızca, İtalyanca, Arapça ve Rusça dillerinde anadili o dil olan tıbbi çevirmenler tarafından hazırlanmış lokalize içerikler.
- **Alt Dizin (Subdirectory) Mimarisi:** \`/en/\`, \`/de/\`, \`/fr/\` şeklinde kurgulanan alt dizinler uluslararası SEO (Hreflang) puanını maksimize eder.
- **Para Birimi ve Paket Kapsamı:** Tedavi + konaklama + transfer paketlerinin Euro, Sterlin veya Dolar bazında net olarak belirtilmesi.

---

## 3. Yüksek Dönüşümlü İletişim Akışı

Yabancı hastalar karmaşık ve uzun formları doldurmaktan kaçınırlar:
- **Anında WhatsApp & Telegram Entegrasyonu:** Hastanın kendi dilinde yanıt verebilen çok dilli hasta koordinatörü hattı.
- **Hızlı Fotoğraf Yükleme ve Ücretsiz Ön Değerlendirme:** Saç ekimi veya diş estetiği için hastanın fotoğraf yükleyip 15 dakika içinde hekim görüşü alabileceği sade formlar.
- **GDPR ve Hasta Gizliliği Uyumu:** Avrupa Birliği Genel Veri Koruma Tüzüğü'ne (GDPR) tam uyumlu aydınlatma metinleri ve güvenli veri saklama altyapısı.

---

## 4. Dijital Reklam Stratejisi

Sağlık turizmi reklamlarında doğrudan tıbbi iddialar yerine hastanın yaşam kalitesine ve Türkiye'deki konforlu transfer/otel deneyimine odaklanan kreatifter daha yüksek dönüşüm sağlar. Google Arama Ağı'nda "Dental Implants Istanbul", "Hair Transplant Turkey" gibi niyet aramalarına özel açılış sayfaları (Landing Pages) kurgulanmalıdır.`,
    },

    // 3. SOSYAL MEDYA
    {
      slug: "markalar-icin-organik-sosyal-medya-buyumesi-ve-topluluk-yonetimi",
      title: "Markalar İçin Organik Sosyal Medya Büyümesi ve Topluluk Yönetimi Rehberi",
      categorySlug: "sosyal-medya",
      coverImage: "/gorseller/blog/sosyal-medya-yonetimi.jpg",
      readMinutes: 5,
      excerpt: "Takipçi sayısına takılmadan gerçek müşteriye dönüşen sadık bir topluluk inşa etmenin formülü: İçerik sütunları, reels stratejisi ve etkileşim döngüsü.",
      metaTitle: "Markalar İçin Organik Sosyal Medya Büyümesi Rehberi | Lizart Blog",
      metaDescription: "Instagram, LinkedIn ve TikTok'ta organik erişim kazanma, içerik matrisi oluşturma ve takipçileri sadık müşterilere dönüştürme taktikleri.",
      body: `Sosyal medya platformlarının algoritma güncellemeleriyle birlikte organik erişim oranlarının düştüğü bir gerçek. Ancak bu, organik büyümenin bittiği anlamına gelmiyor; tam tersine, **değer üreten ve topluluk kurabilen** markaların öne çıktığı yeni bir dönem başladı.

Yalnızca ürün afişi paylaşan hesaplar sessizliğe gömülürken, kitleleriyle gerçek bir diyalog kuran markalar organik olarak viral hale gelebiliyor.

---

## 1. İçerik Sütunları (Content Pillars) Belirleme

Hergün "Bugün ne paylaşsak?" stresi yaşamamak için içeriklerinizi 4 ana sütuna ayırmalısınız:

1. **Eğitici İçerikler (%40):** Sektörünüze dair pratik ipuçları, "nasıl yapılır" rehberleri, sektördeki yaygın hatalar ve çözümleri.
2. **Güven & İtibar İçerikleri (%25):** Kamera arkası hazırlıklar, üretim süreçleri, müşteri geri bildirimleri ve teslim edilen projelerin canlı sonuçları.
3. **Etkileşim & Eğlence İçerikleri (%20):** Soru-cevap anketleri, sektörel mizah, trend seslerle hazırlanan yaratıcı kurgular.
4. **Dönüşüm & Tanıtım İçerikleri (%15):** Özel fırsatlar, yeni ürün/hizmet duyuruları ve doğrudan eyleme çağrı (CTA) mesajları.

---

## 2. Kısa Formatlı Video (Reels / TikTok / Shorts) Hakimiyeti

Statik görsellere kıyasla video formatı ortalama 4 ila 6 kat daha fazla keşfet erişimi sağlar:
- **İlk 3 Saniye Kuralı (Hook):** İzleyicinin parmağını durduran vurucu bir soru veya şaşırtıcı bir görsel başlangıç kullanın.
- **Altyazı Kullanımı:** Kullanıcıların %70'inden fazlası sosyal medya videolarını sessiz ortamda tüketir. Otomatik veya tasarımlı altyazı eklemek izlenme süresini katlar.
- **Değer Odaklı Çözüm:** Video sonunda izleyici "Bunu öğrendiğim iyi oldu" diyerek kaydetmeli veya arkadaşına göndermelidir.

---

## 3. Yorumları Satışa Dönüştürme (Sosyal CRM)

Takipçileriniz bir gönderinin altına soru yazdığında veya özel mesaj (DM) attığında geçen süre kritik önem taşır:
- İlk 15 dakika içinde verilen samimi yanıtlar hem algoritmayı tetikler hem de potansiyel müşteriye profesyonellik hissi verir.
- Otomatik chatbot yanıtlarını kişiselleştirilmiş hediye veya broşür akışıyla zenginleştirin.`,
    },

    // 4. YAZILIM
    {
      slug: "kurumsal-isletmeler-icin-ozel-yazilim-vs-paket-yazilim-karsilastirmasi",
      title: "Kurumsal İşletmeler İçin Özel Yazılım vs Paket Yazılım: Hangisi Ne Zaman Seçilmeli?",
      categorySlug: "yazilim",
      coverImage: "/gorseller/blog/ozel-yazilim-rehberi.jpg",
      readMinutes: 6,
      excerpt: "Hazır SaaS çözümlerinin sınırları nerede başlar? Şirketinize özel geliştirilen yazılımların maliyet, güvenlik, tam kod mülkiyeti ve ölçeklenebilirlik analizi.",
      metaTitle: "Özel Yazılım vs Paket Yazılım Karşılaştırması | Lizart Blog",
      metaDescription: "İşletmeniz için hazır paket yazılım mı yoksa özel yazılım mı mantıklı? Maliyet, kaynak kod mülkiyeti, entegrasyon ve sürdürülebilirlik karşılaştırması.",
      body: `Bir işletmenin dijital altyapısını kurarken verdiği en kritik kararlardan biri şudur: *Piyasadaki hazır bir SaaS (Hizmet Olarak Yazılım) paketini mi kullanmalıyız, yoksa şirketimizin iş akışına özel bir yazılım mı geliştirmeliyiz?*

Her iki yaklaşımın da kendine has avantajları ve dezavantajları vardır. Yanlış seçim yapmak, binlerce saatlik iş gücü kaybına veya fahiş aylık lisans ücretlerine yol açabilir.

---

## Karşılaştırma Matrisi

| Kriter | Paket (Hazır) Yazılım | Özel (Custom) Yazılım |
| :--- | :--- | :--- |
| **Başlangıç Maliyeti** | Düşük (Aylık/Yıllık abonelik) | Orta / Yüksek (Tek seferlik geliştirme) |
| **Uzun Vadeli Maliyet** | Kullanıcı sayısı arttıkça katlanır | Sabit (Kullanıcı başına lisans ücreti yok) |
| **Kaynak Kod Mülkiyeti**| Sağlayıcı firmaya aittir | **%100 Sizin şirketinize aittir** |
| **İş Akışına Uyum** | Şirketiniz yazılıma uymak zorundadır | Yazılım sizin şirketinizin kurallarına göre yazılır |
| **Entegrasyon Esnekliği** | Yalnızca izin verilen API'lar | ERP, muhasebe, kargo, CRM ile sınırsız entegrasyon |
| **Veri Güvenliği** | Ortak bulut sunucularında tutulur | Kendi özel sunucularınızda şifreli barındırılır |

---

## Paket Yazılım Ne Zaman Doğru Tercihtir?
- Standart muhasebe, basit e-posta bülteni veya standart bir CRM ihtiyacınız varsa,
- Projeyi hemen aynı gün kullanmaya başlamanız gerekiyorsa,
- Şirketinizin henüz kendine has karmaşık bir operasyonel iş akışı oturmamışsa.

---

## Özel Yazılım Ne Zaman Kaçınılmaz Hale Gelir?
1. **Rekabet Avantajı Yaratan Süreçler:** Rakiplerinizden farklılaşmanızı sağlayan teklif hesaplama motoru, özel B2B bayi sipariş ekranı veya lojistik rotalama algoritması hazır paketlerde bulunmaz.
2. **Kullanıcı Sayısı ve Lisans Maliyetleri:** 50 veya 100 kişilik bir ekip için kullanıcı başına ayda $30-$50 ödemek, birkaç yıl içinde özel yazılım maliyetini katlar.
3. **Teknoloji Bağımsızlığı ve Şirket Değeri:** Kendi mülkiyetinizdeki kaynak kod ve veritabanı, şirketinize yatırım alma veya satış aşamasında somut bir entelektüel sermaye (IP) değeri katar.

---

## Lizart Yaklaşımı: Hibrit & Modüler Mimari

Lizart Dijital olarak kurumsal müşterilerimize tekerleği sıfırdan icat etmek yerine, modern açık kaynak framework'ler (Next.js 16, React 19, Node.js, PostgreSQL) üzerinde esnek, ölçeklenebilir ve tam kaynak kod devirli özel çözümler üretiyoruz.`,
    },
  ];

  for (const post of postsToPublish) {
    const categoryId = catMap[post.categorySlug];
    if (!categoryId) {
      console.error(`Kategori ID bulunamadı: ${post.categorySlug}`);
      continue;
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (existing) {
      await prisma.blogPost.update({
        where: { slug: post.slug },
        data: {
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage,
          categoryId: categoryId,
          readMinutes: post.readMinutes,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          isPublished: true,
        }
      });
      console.log(`Güncellendi: ${post.title}`);
    } else {
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage,
          authorName: "Lizart Dijital",
          authorTitle: "Büyüme & Yazılım Mimarisi Ekibi",
          categoryId: categoryId,
          readMinutes: post.readMinutes,
          isPublished: true,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
        }
      });
      console.log(`Oluşturuldu: ${post.title}`);
    }
  }

  // Son durumu yazdır
  const finalCats = await prisma.blogCategory.findMany({
    include: {
      posts: {
        where: { isPublished: true },
        select: { id: true, title: true, slug: true }
      }
    }
  });

  console.log("\n=== YAYINLANAN BLOG MAKALESİ SAYILARI ===");
  for (const c of finalCats) {
    console.log(`- ${c.name}: ${c.posts.length} yayında`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
