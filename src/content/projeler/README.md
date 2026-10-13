# Proje ekleme rehberi

Yeni proje = yeni bir klasör. Kod değişikliği gerekmez.

```
src/content/projeler/
  yeni-proje-adi/        ← klasör adı aynı zamanda adres olur: /projeler/yeni-proje-adi/
    tr.md                ← Türkçe içerik + projenin tüm ortak bilgileri
    en.md                ← İngilizce içerik
    kapak.jpg            ← fotoğraflar (boyut/format fark etmez, otomatik optimize edilir)
    02.jpg, 03.jpg ...
    once.jpg, sonra.jpg  ← (isteğe bağlı) önce/sonra karşılaştırması
```

## tr.md

```yaml
---
baslik: "Proje adı"
kategori: taahhut          # taahhut | kentsel
durum: tamamlandi          # tamamlandi | devam
yil: 2024
isveren: iski              # (isteğe bağlı) src/content/kurumlar.yaml içindeki kimlik
konum: "Kadıköy, İstanbul"
olcek: "16 daire"          # (isteğe bağlı) kartta görünen kısa bilgi
ozet: "Bir iki cümlelik kısa açıklama."
kapak: ./kapak.jpg
galeri:
  - ./kapak.jpg
  - ./02.jpg
once: ./once.jpg           # (isteğe bağlı) once ve sonra birlikte verilmeli
sonra: ./sonra.jpg
onecikan: true             # ana sayfada gösterilsin mi
ihale:                     # (isteğe bağlı) SİTEDE GÖSTERİLMEZ, yayına girmez
  ikn: "2024/123456"
  bedel: "12.500.000 TL"
  kirim: "%15"
---

Buraya iş kapsamı (detay metni) yazılır. Madde işaretli liste kullanılabilir:

- Birinci kalem
- İkinci kalem
```

## en.md

```yaml
---
baslik: "Project name"
konum: "Kadıköy, Istanbul"
olcek: "16 flats"
ozet: "Short description."
---

Scope of work in English.
```

Bir alan eksik ya da hatalıysa `npm run build` hangi dosyada ne eksik olduğunu söyler.
en.md yoksa İngilizce sayfada Türkçe içerik gösterilir (derleme sırasında uyarı verir).
