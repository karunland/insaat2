import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const BASE = './src/content/projeler';
// Klasör adı = proje kimliği (adres çubuğundaki kısım)
const folderId = ({ entry }: { entry: string }) => entry.split('/')[0];

const metin = { baslik: z.string(), konum: z.string(), olcek: z.string().optional(), ozet: z.string() };

const kurumlar = defineCollection({
  loader: file('src/content/kurumlar.yaml'),
  schema: z.object({
    tr: z.object({ kisa: z.string(), tam: z.string() }),
    en: z.object({ kisa: z.string(), tam: z.string() }),
  }),
});

const projeler = defineCollection({
  loader: glob({ pattern: '*/tr.md', base: BASE, generateId: folderId }),
  schema: ({ image }) =>
    z
      .object({
        ...metin,
        kategori: z.enum(['taahhut', 'kentsel']),
        durum: z.enum(['tamamlandi', 'devam']),
        yil: z.number().int().min(1950).max(2100),
        isveren: reference('kurumlar').optional(),
        kapak: image(),
        galeri: z.array(image()).default([]),
        once: image().optional(),
        sonra: image().optional(),
        onecikan: z.boolean().default(false),
        // Yalnızca iç kayıt içindir; hiçbir sayfada kullanılmaz, dolayısıyla yayına girmez.
        ihale: z
          .object({
            ikn: z.string().optional(),
            bedel: z.union([z.string(), z.number()]).optional(),
            kirim: z.union([z.string(), z.number()]).optional(),
          })
          .optional(),
      })
      .refine((d) => !d.once === !d.sonra, { message: '"once" ve "sonra" birlikte verilmeli' }),
});

const projelerEn = defineCollection({
  loader: glob({ pattern: '*/en.md', base: BASE, generateId: folderId }),
  schema: z.object(metin),
});

const yorumMetin = z.object({ soz: z.string(), isim: z.string(), unvan: z.string() });
const yorumlar = defineCollection({
  loader: file('src/content/yorumlar.yaml'),
  schema: z.object({
    kategori: z.enum(['taahhut', 'kentsel']),
    yil: z.number().int().min(2000).max(2100),
    foto: z.string().optional(),
    tr: yorumMetin,
    en: yorumMetin,
  }),
});

export const collections = { kurumlar, projeler, projelerEn, yorumlar };
