# MAKSEF İnşaat — Kurumsal Web Sitesi

**MAKSEF İnşaat** için **Astro 5** ve **TypeScript** kullanılarak geliştirilmiş, statik olarak derlenen (SSG), çift dilli (**TR** `/` ve **EN** `/en/`) kurumsal web sitesi ve proje portföyü.

---

## Proje Özeti & Tasarım Yaklaşımı

Site, mühendislik ve mimari teknik çizim kültüründen esinlenen **"Pafta"** tasarım sistemi üzerine kuruludur:

- **Çift Tema (Açık / Koyu Mod):** Açık modda aydınger kâğıdı dokusu (`#F3F0E8`), koyu modda ozalit/blueprint (`#0D3466`) görünümü sunar.
- **Etkileşimli Teknik Çizimler:** Ana sayfada saydam zeminli, tema uyumlu animasyonlu betonarme kesit / 3D karkas çizimi (`HeroDrawing.astro`), kentsel dönüşüm sayfasında deprem simülasyonu (`Quake.astro`) ve koordinat/kot HUD göstergesi bulunur.
- **Geniş Ekran Proje Detayları:** Proje detay sayfaları tam ekran genişliğini verimli kullanacak şekilde (`max-width: 1680px`) kurgulanmıştır; breadcrumb altında doğrudan 4 kolonlu mozaik fotoğraf galerisi (Lightbox destekli), ardından proje başlığı, iş kapsamı ve proje künyesi yer alır.
- **Otomatik Görsel Optimizasyonu & SEO:** Tüm proje fotoğrafları Astro `<Image>` ile derleme aşamasında otomatik boyutlandırılır ve WebP formatına dönüştürülür. `hreflang` destekli çok dilli `sitemap-index.xml`, Open Graph etiketleri ve JSON-LD yapılandırılmış verileri otomatik üretilir.

---

## Teknoloji Yığını

- **Framework:** [Astro](https://astro.build/) `5.18.2` (Static Output)
- **Dil & Tip Güvenliği:** TypeScript `5.9`, Zod şema doğrulamalı Astro Content Collections
- **SEO & Site Haritası:** `@astrojs/sitemap` (TR/EN çift dil eşlemeli)
- **Stil & Etkileşim:** Vanilla CSS (`src/styles/global.css`, CSS Custom Properties) ve hafif istemci betiği (`src/scripts/main.js`) — harici UI kütüphanesi veya ağır JS framework bağımlılığı yoktur.

---

## Dizin Yapısı

```text
├── astro.config.mjs           # Astro ve çok dilli sitemap yapılandırması
├── public/                    # Statik dosyalar ve ham proje görsel arşivi
└── src/
    ├── config/
    │   └── site.mjs           # Firma bilgileri, iletişim, harita, istatistikler, form URL'leri
    ├── content.config.ts      # Content Collections şemaları (projeler, projelerEn, kurumlar)
    ├── content/
    │   ├── kurumlar.yaml      # Referans işveren kurumlar (Hakkımızda sayfasını besler)
    │   └── projeler/          # Proje klasörleri (tr.md, en.md ve optimize edilecek görseller)
    ├── i18n/
    │   ├── routes.mjs         # TR / EN rota eşlemeleri
    │   └── ui.ts              # Tüm arayüz metinleri (TR & EN)
    ├── layouts/
    │   └── Base.astro         # Ana sayfa iskeleti, header, footer, SEO/JSON-LD
    ├── lib/
    │   └── projects.ts        # Proje ve referans kurum sorgu yardımcıları
    ├── components/            # Tekrar kullanılabilir bileşenler (HeroDrawing, ProjectCard, vb.)
    ├── views/                 # Sayfa görünümleri (HomePage, ProjectPage, AboutPage, vb.)
    ├── pages/                 # TR (/) ve EN (/en/) dosya tabanlı rotalar
    ├── scripts/
    │   └── main.js            # Tema geçişi, mobil menü, filtreleme, lightbox, HUD
    └── styles/
        └── global.css         # "Pafta" tasarım sistemi stilleri
```

---

## İçerik ve Portföy Kapsamı

Sitede firmanın kamu taahhüt, tesis bakım-onarım, prefabrik/çelik yapı, kentsel donatı ve kentsel dönüşüm alanlarında tamamladığı **14 proje** ve **8 referans kurum** yer almaktadır:

- **Kategoriler:** Taahhüt (`/taahhut/`, `/en/contracting/`) ve Kentsel Dönüşüm (`/kentsel-donusum/`, `/en/urban-renewal/`)
- **Referans Kurumlar:** İBB Tesisler Bakım Onarım, İBB Yeşil Alan Tesisler, İstanbul Üniversitesi-Cerrahpaşa (İÜC), Sağlık Bilimleri Üniversitesi (SBÜ), İSTON A.Ş., Gül İnşaat, Hakim İnşaat, Ufuk Proje & Mutlu Gün İş Ortaklığı.

---

## Komutlar

```sh
npm install        # Bağımlılıkları kur
npm run dev        # Geliştirme sunucusunu başlat (http://localhost:4321)
npm run build      # Yayına hazır statik siteyi üret → dist/
npm run preview    # Derlenen dist/ çıktısını yerelde önizle
npm run check      # Astro ve TypeScript tür/içerik doğrulaması
```

---

## Nereyi Düzenlerim?

| Ne | Dosya |
|---|---|
| Proje ekle / düzenle | `src/content/projeler/<proje-adi>/` → [Proje ekleme rehberi](src/content/projeler/README.md) |
| Referans kurumlar | `src/content/kurumlar.yaml` |
| Firma bilgileri, adres, harita konumu, rakamlar, form servisi | `src/config/site.mjs` |
| Tüm arayüz metinleri (TR + EN) | `src/i18n/ui.ts` |
| Sayfa adresleri | `src/i18n/routes.mjs` |
| Genel görünüm ve tema stilleri | `src/styles/global.css` |

> Fotoğraflar derleme sırasında otomatik olarak boyutlandırılır ve WebP'ye çevrilir; orijinal boyutlarında eklenebilir.

---

## Formlar

İletişim ve kentsel dönüşüm formları sunucusuz bir form servisine gönderilir (ör. [Formspree](https://formspree.io)). Servisten alınan uç nokta adresini `src/config/site.mjs` → `forms` alanına yazın. Adres boş bırakılırsa form geçici olarak ziyaretçinin e-posta uygulamasını açar.

---

## Yayınlama (Deploy)

Netlify, Cloudflare Pages, Vercel veya GitHub Pages için:
- **Derleme komutu:** `npm run build`
- **Yayın klasörü:** `dist`

`src/config/site.mjs` içindeki `url` alanı yayına alınacak gerçek alan adı olmalıdır (sitemap, canonical, Open Graph görselleri ve `hreflang` bağlantıları bu adresten üretilir).

> **Not:** Proje dosyalarındaki `ihale` bloğu (İKN, bedel, kırım, sözleşme tarihleri vb.) yalnızca iç kayıt içindir; hiçbir sayfada kullanılmadığı için yayınlanan siteye dahil edilmez. Depo herkese açıksa bu alanların depoda görünür olacağını göz önünde bulundurun.
