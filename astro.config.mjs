// @ts-check
import { readdirSync, statSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.mjs';
import { ROUTES, projectPath } from './src/i18n/routes.mjs';

// Site haritasında her sayfanın iki dildeki karşılığını (hreflang) eşleştirir.
// TR ve EN adresleri farklı olduğu için (/hakkimizda/ ↔ /en/about/) eşleme tablosu gerekir.
const projectDir = './src/content/projeler';
const projectSlugs = readdirSync(projectDir).filter((d) => statSync(`${projectDir}/${d}`).isDirectory());
const pairs = [
  ...Object.values(ROUTES).filter((r) => r !== ROUTES.project),
  ...projectSlugs.map((s) => ({ tr: projectPath('tr', s), en: projectPath('en', s) })),
];
const pairByPath = new Map(pairs.flatMap((p) => [[p.tr, p], [p.en, p]]));

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const pair = pairByPath.get(new URL(item.url).pathname);
        if (pair) {
          item.links = [
            { url: new URL(pair.tr, SITE.url).href, lang: 'tr-TR' },
            { url: new URL(pair.en, SITE.url).href, lang: 'en-US' },
          ];
        }
        return item;
      },
    }),
  ],
});
