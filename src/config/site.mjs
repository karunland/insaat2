// =========================================================
// MAKSEF — SİTE AYARLARI
// Firma bilgileri, form servisi ve rakamlar tek yerden yönetilir.
// !!! Aşağıdaki bilgilerin çoğu ÖRNEKTİR — gerçekleriyle değiştirin.
// =========================================================
export const SITE = {
  // Sitenin yayınlanacağı tam adres (sonda / olmadan). Sitemap, canonical,
  // hreflang ve paylaşım (Open Graph) bağlantıları bundan üretilir.
  url: 'https://www.maksef.com.tr',

  name: 'MAKSEF',
  legalName: 'MAKSEF İnşaat',
  foundedYear: 2011, // "yıllık deneyim" rakamı bundan otomatik hesaplanır

  phone: '+90 212 000 00 00',
  phoneHref: '+902120000000',
  email: 'info@maksef.com.tr',
  address: {
    street: 'Örnek Mah. Örnek Cad. No: 1',
    city: 'İstanbul',
    postalCode: '34000',
    country: 'TR',
  },
  // Harita ve yapılandırılmış veri için ofis konumu
  geo: { lat: 40.9903, lon: 29.0275 }, // Kadıköy
  hours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '08:30', close: '18:00' },

  // Sosyal medya / harici profiller (LinkedIn vb.) — yapılandırılmış veride "sameAs" olarak kullanılır
  social: [],

  // Form servisi (ör. Formspree: https://formspree.io → yeni form → "https://formspree.io/f/xxxxxxx").
  // Boş bırakılırsa form, ziyaretçinin e-posta uygulamasını açar (yalnızca geçici çözüm).
  forms: {
    contact: '',
    kentsel: '',
  },

  // Ana sayfadaki rakamlar
  stats: {
    completedProjects: 60,
    infraKm: 25,
    unitsDelivered: 350,
  },
};
