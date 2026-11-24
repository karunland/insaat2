// Sayfa adresleri — her sayfanın iki dildeki karşılığı.
// Dil değiştirici, hreflang ve site haritası bu tabloyu kullanır.
export const ROUTES = {
  home:    { tr: '/',                 en: '/en/' },
  about:   { tr: '/hakkimizda/',      en: '/en/about/' },
  taahhut: { tr: '/taahhut/',         en: '/en/contracting/' },
  kentsel: { tr: '/kentsel-donusum/', en: '/en/urban-renewal/' },
  projects: { tr: '/projeler/',       en: '/en/projects/' },
  contact: { tr: '/iletisim/',        en: '/en/contact/' },
  project: { tr: '/projeler/',        en: '/en/projects/' },
};

export const LANGS = ['tr', 'en'];

/** @param {'tr'|'en'} lang @param {string} slug */
export const projectPath = (lang, slug) => `${ROUTES.project[lang]}${slug}/`;
