/* =========================================================
   MAKSEF — PROJE VERİLERİ
   Sitedeki tüm proje listeleri, öne çıkanlar, proje detay
   sayfaları ve referans tablosu bu dosyadan üretilir.

   YENİ PROJE EKLEMEK İÇİN: "projects" listesine bir kayıt
   ekleyin. Alanlar:
     slug      : adres çubuğunda görünen kısa ad (proje.html?p=slug)
     cat       : "taahhut" | "kentsel"
     status    : "tamamlandi" | "devam"
     year      : yıl (devam edenlerde başlangıç yılı)
     client    : aşağıdaki "clients" anahtarlarından biri
     featured  : true ise ana sayfada gösterilir
     cover     : kart görseli
     gallery   : detay sayfasındaki fotoğraflar
     before/after : (isteğe bağlı) önce/sonra karşılaştırması
     tr / en   : başlık, konum, öne çıkan bilgi, özet, iş kapsamı

   Görsel yolları site köküne göredir (img/...).
   !!! Aşağıdaki projeler ÖRNEKTİR — gerçek bilgilerle değiştirin.
   ========================================================= */
window.MAKSEF_DATA = {

  clients: {
    iski: {
      tr: { short: 'İSKİ', full: 'İstanbul Su ve Kanalizasyon İdaresi' },
      en: { short: 'İSKİ', full: 'Istanbul Water and Sewerage Administration' }
    },
    iuc: {
      tr: { short: 'İÜ-Cerrahpaşa', full: 'İstanbul Üniversitesi-Cerrahpaşa' },
      en: { short: 'IUC', full: 'Istanbul University-Cerrahpaşa' }
    },
    malikler: {
      private: true, // referans tablosunda gösterilmez
      tr: { short: 'Kat malikleri', full: 'Kat malikleri' },
      en: { short: 'Property owners', full: 'Property owners' }
    }
  },

  projects: [
    {
      slug: 'kolektor-hatti',
      cat: 'taahhut', status: 'tamamlandi', year: 2023, client: 'iski', featured: true,
      cover: 'img/ornek/kanal.svg',
      gallery: ['img/ornek/kanal.svg', 'img/ornek/sebeke.svg', 'img/ornek/temel.svg'],
      tr: {
        title: 'Atıksu Kolektör Hattı İnşaatı',
        location: 'İstanbul',
        highlight: '2,4 km kolektör',
        summary: 'Mevcut kanal sisteminin kapasitesini artırmak amacıyla yeni atıksu kolektör hattının açık kazı yöntemiyle inşası.',
        scope: ['İksa destekli açık kazı', 'Ø800–Ø1200 mm boru imalatı', 'Baca ve bağlantı yapıları', 'Yol üstyapısının yeniden yapımı']
      },
      en: {
        title: 'Wastewater Collector Line Construction',
        location: 'Istanbul',
        highlight: '2.4 km collector',
        summary: 'Construction of a new wastewater collector line by open-cut excavation to increase the capacity of the existing sewer network.',
        scope: ['Open-cut excavation with shoring', 'Ø800–Ø1200 mm pipe installation', 'Manholes and connection structures', 'Road pavement reinstatement']
      }
    },
    {
      slug: 'icme-suyu-sebeke',
      cat: 'taahhut', status: 'devam', year: 2025, client: 'iski', featured: false,
      cover: 'img/ornek/sebeke.svg',
      gallery: ['img/ornek/sebeke.svg', 'img/ornek/kanal.svg'],
      tr: {
        title: 'İçme Suyu Şebekesi Yenileme İşi',
        location: 'İstanbul',
        highlight: '18 km şebeke',
        summary: 'Ömrünü tamamlamış içme suyu şebeke hatlarının ve abone bağlantılarının yenilenmesi.',
        scope: ['HDPE şebeke hattı imalatı', 'Vana odaları ve hidrantlar', 'Abone bağlantılarının yenilenmesi', 'Kazı sonrası yol onarımı']
      },
      en: {
        title: 'Drinking Water Network Renewal',
        location: 'Istanbul',
        highlight: '18 km network',
        summary: 'Renewal of end-of-life drinking water distribution lines and service connections.',
        scope: ['HDPE distribution pipeline works', 'Valve chambers and hydrants', 'Renewal of service connections', 'Road repair after excavation']
      }
    },
    {
      slug: 'hastane-guclendirme',
      cat: 'taahhut', status: 'tamamlandi', year: 2022, client: 'iuc', featured: true,
      cover: 'img/ornek/hastane.svg',
      gallery: ['img/ornek/hastane.svg', 'img/ornek/santiye.svg', 'img/ornek/temel.svg'],
      tr: {
        title: 'Hastane Binası Onarım ve Güçlendirme İşi',
        location: 'İstanbul',
        highlight: '12.500 m²',
        summary: 'Hizmeti kesintiye uğratmadan, etaplar halinde yürütülen deprem güçlendirmesi ve iç mekân onarımı.',
        scope: ['Betonarme mantolama ve yeni perde duvarlar', 'Etaplı çalışma planı', 'Mekanik ve elektrik tesisat yenileme', 'İç mekân ve cephe onarımı']
      },
      en: {
        title: 'Hospital Building Repair and Retrofit',
        location: 'Istanbul',
        highlight: '12,500 m²',
        summary: 'Seismic retrofit and interior repair carried out in phases without interrupting hospital services.',
        scope: ['RC column jacketing and new shear walls', 'Phased works schedule', 'Mechanical and electrical renewal', 'Interior and façade repair']
      }
    },
    {
      slug: 'fakulte-yenileme',
      cat: 'taahhut', status: 'devam', year: 2025, client: 'iuc', featured: false,
      cover: 'img/ornek/fakulte.svg',
      gallery: ['img/ornek/fakulte.svg', 'img/ornek/santiye.svg'],
      tr: {
        title: 'Fakülte Binası Yenileme İşi',
        location: 'İstanbul',
        highlight: '8.200 m²',
        summary: 'Eğitim binasının cephe, çatı ve iç mekânlarının yenilenmesi ile erişilebilirlik düzenlemeleri.',
        scope: ['Cephe ve çatı yenileme', 'Derslik ve laboratuvar düzenlemeleri', 'Engelli erişimi düzenlemeleri', 'Yangın güvenliği iyileştirmeleri']
      },
      en: {
        title: 'Faculty Building Renovation',
        location: 'Istanbul',
        highlight: '8,200 m²',
        summary: 'Renovation of the façade, roof and interiors of a university building, with accessibility improvements.',
        scope: ['Façade and roof renewal', 'Classroom and laboratory fit-out', 'Accessibility improvements', 'Fire safety upgrades']
      }
    },
    {
      slug: 'cinar-apartmani',
      cat: 'kentsel', status: 'tamamlandi', year: 2023, client: 'malikler', featured: true,
      cover: 'img/ornek/yeni-bina.svg',
      gallery: ['img/ornek/yeni-bina.svg', 'img/ornek/santiye.svg', 'img/ornek/temel.svg'],
      before: 'img/ornek/eski-bina.svg',
      after: 'img/ornek/yeni-bina.svg',
      tr: {
        title: 'Çınar Apartmanı',
        location: 'Kadıköy, İstanbul',
        highlight: '16 daire + 2 dükkân',
        summary: '1978 yapımı, riskli yapı tespiti alınan apartmanın yıkılarak TBDY 2018\'e uygun şekilde yeniden inşası.',
        scope: ['Riskli yapı tespiti süreci', 'Malik uzlaşması ve sözleşmeler', 'Yıkım ve yeni yapı inşaatı', 'İskân ve anahtar teslim']
      },
      en: {
        title: 'Çınar Apartments',
        location: 'Kadıköy, Istanbul',
        highlight: '16 flats + 2 shops',
        summary: 'Demolition of a 1978 building designated as at-risk and its reconstruction in line with the 2018 Turkish Seismic Code.',
        scope: ['At-risk building assessment', 'Owner agreement and contracts', 'Demolition and new construction', 'Occupancy permit and handover']
      }
    },
    {
      slug: 'yildiz-sitesi',
      cat: 'kentsel', status: 'devam', year: 2025, client: 'malikler', featured: true,
      cover: 'img/ornek/santiye.svg',
      gallery: ['img/ornek/santiye.svg', 'img/ornek/temel.svg'],
      before: 'img/ornek/eski-bina.svg',
      after: 'img/ornek/yeni-bina.svg',
      tr: {
        title: 'Yıldız Sitesi A–B Blok',
        location: 'Bahçelievler, İstanbul',
        highlight: '2 blok · 48 daire',
        summary: 'İki bloktan oluşan sitenin, otopark ve ortak alanlarla birlikte yeniden inşası. Kaba inşaat sürüyor.',
        scope: ['Toplu malik sözleşmesi', 'Yıkım ve hafriyat', 'Kapalı otopark ve sosyal alanlar', 'Betonarme kaba inşaat (devam ediyor)']
      },
      en: {
        title: 'Yıldız Residences, Blocks A–B',
        location: 'Bahçelievler, Istanbul',
        highlight: '2 blocks · 48 flats',
        summary: 'Reconstruction of a two-block residence with parking and shared spaces. Structural works are under way.',
        scope: ['Collective owner agreement', 'Demolition and excavation', 'Underground parking and shared areas', 'RC structural works (ongoing)']
      }
    },
    {
      slug: 'gul-apartmani',
      cat: 'kentsel', status: 'tamamlandi', year: 2022, client: 'malikler', featured: false,
      cover: 'img/ornek/yeni-bina.svg',
      gallery: ['img/ornek/yeni-bina.svg', 'img/ornek/santiye.svg'],
      before: 'img/ornek/eski-bina.svg',
      after: 'img/ornek/yeni-bina.svg',
      tr: {
        title: 'Gül Apartmanı',
        location: 'Üsküdar, İstanbul',
        highlight: '10 daire',
        summary: 'Hak sahiplerinin mevcut metrekarelerini koruyarak yeniden yapılan, asansörlü ve otoparklı yeni bina.',
        scope: ['Riskli yapı tespiti süreci', 'Kat planlarının maliklerle birlikte belirlenmesi', 'Yeni yapı inşaatı', 'Anahtar teslim']
      },
      en: {
        title: 'Gül Apartments',
        location: 'Üsküdar, Istanbul',
        highlight: '10 flats',
        summary: 'A new building with lift and parking, rebuilt while preserving the owners\' existing floor areas.',
        scope: ['At-risk building assessment', 'Floor plans agreed with owners', 'New construction', 'Turnkey handover']
      }
    }
  ]
};
