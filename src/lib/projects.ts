import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Project = {
  id: string;
  code: string; // P-01, P-02 … (yıla göre kronolojik)
  data: CollectionEntry<'projeler'>['data'];
  text: { baslik: string; konum: string; olcek?: string; ozet: string };
  body: CollectionEntry<'projeler'> | CollectionEntry<'projelerEn'>; // kapsam metni (render için)
  client?: { kisa: string; tam: string };
};

const warned = new Set<string>();

/** Tüm projeler, istenen dilde metinlerle; en yeniden eskiye sıralı. */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const [tr, en, kurumlar] = await Promise.all([
    getCollection('projeler'),
    getCollection('projelerEn'),
    getCollection('kurumlar'),
  ]);
  const enById = new Map(en.map((e) => [e.id, e]));
  const kurumById = new Map(kurumlar.map((k) => [k.id, k.data]));

  const chrono = [...tr].sort((a, b) => a.data.yil - b.data.yil || a.id.localeCompare(b.id));
  const codes = new Map(chrono.map((p, i) => [p.id, 'P-' + String(i + 1).padStart(2, '0')]));

  return tr
    .map((p) => {
      const enEntry = enById.get(p.id);
      if (lang === 'en' && !enEntry && !warned.has(p.id)) {
        warned.add(p.id);
        console.warn(`[maksef] "${p.id}" için en.md yok — İngilizce sayfada Türkçe içerik gösterilecek.`);
      }
      const useEn = lang === 'en' && enEntry;
      const kurum = p.data.isveren ? kurumById.get(p.data.isveren.id) : undefined;
      return {
        id: p.id,
        code: codes.get(p.id)!,
        data: p.data,
        text: useEn ? enEntry.data : p.data,
        body: useEn ? enEntry : p,
        client: kurum?.[lang],
      };
    })
    .sort((a, b) => b.data.yil - a.data.yil || a.code.localeCompare(b.code));
}

/** Hakkımızda sayfası için referans kurumlar ve proje sayıları. */
export async function getReferences(lang: Lang) {
  const [kurumlar, projects] = await Promise.all([getCollection('kurumlar'), getProjects(lang)]);
  return kurumlar.map((k) => {
    const jobs = projects.filter((p) => p.data.isveren?.id === k.id);
    return { id: k.id, ...k.data[lang], count: jobs.length, cats: [...new Set(jobs.map((p) => p.data.kategori))] };
  });
}
