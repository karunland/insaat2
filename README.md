# MAKSEF web sitesi

Astro ile üretilen statik site. Türkçe `/`, İngilizce `/en/`.

## Komutlar

```sh
npm install        # ilk kurulum
npm run dev        # geliştirme sunucusu (http://localhost:4321)
npm run build      # yayına hazır site → dist/
npm run check      # tür ve içerik kontrolü
```

## Nereyi düzenlerim?

| Ne | Dosya |
|---|---|
| Proje ekle / düzenle | `src/content/projeler/<proje-adi>/` → [rehber](src/content/projeler/README.md) |
| Referans kurumlar | `src/content/kurumlar.yaml` |
| Firma bilgileri, adres, harita konumu, rakamlar, form servisi | `src/config/site.mjs` |
| Tüm metinler (TR + EN) | `src/i18n/ui.ts` |
| Sayfa adresleri | `src/i18n/routes.mjs` |
| Görünüm | `src/styles/global.css` |

Fotoğraflar derleme sırasında otomatik olarak boyutlandırılır ve WebP'ye çevrilir;
orijinal büyüklükte yüklenebilir.

## Formlar

Formlar sunucusuz bir form servisine gönderilir (ör. [Formspree](https://formspree.io)).
Servisten alınan adresi `src/config/site.mjs` → `forms` içine yazın. Adres boşsa form,
geçici olarak ziyaretçinin e-posta uygulamasını açar.

## Yayınlama

Netlify, Cloudflare Pages, Vercel veya GitHub Pages: derleme komutu `npm run build`,
yayın klasörü `dist`. `src/config/site.mjs` içindeki `url` gerçek alan adı olmalıdır
(site haritası, paylaşım görselleri ve hreflang buna göre üretilir).

`ihale` bilgileri (İKN, bedel, kırım) yalnızca içerik dosyalarında durur; hiçbir sayfada
kullanılmadığı için yayınlanan siteye girmez. Depo herkese açıksa bu bilgiler depoda görünür.
