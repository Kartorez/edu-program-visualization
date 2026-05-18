import Fuse from 'fuse.js';

const cache = new Map<string, string>();

export const normalizeText = (t: string): string =>
  t.toLowerCase()
    .replace(/[oakepi]/g, (m) => ({ o: 'о', a: 'а', k: 'к', e: 'е', p: 'р', i: 'і' }[m]!))
    .trim();

export const cleanText = (t: string): string =>
  t ? normalizeText(t).replace(/[^a-zа-я0-9]/gi, '') : '';

export async function resolveOrCreate(
  collection: string,
  code: string,
  data: Record<string, unknown>
): Promise<string> {
  const key = `${collection}:${code}`;
  if (cache.has(key)) return cache.get(key)!;

  const res = await fetch(
    `/api/${collection}?where[code][equals]=${encodeURIComponent(code)}&limit=1`
  );
  const json = await res.json();
  let id = json.docs?.[0]?.id;

  if (!id) {
    const created = await fetch(`/api/${collection}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const createdJson = await created.json();
    id = createdJson.doc?.id ?? createdJson.id;
  }

  cache.set(key, id);
  return id;
}

export const resolveList = async (
  list: any[],
  collection: string,
  mapper: (item: any) => any
) => {
  return Promise.all(list.map(item => resolveOrCreate(collection, item.code, mapper(item))));
};

export const matchRelations = (
  items: any[],
  rawDisciplines: any[],
  currentYear: number
): { ids: string[]; missing: string[] } => {
  const ids: string[] = [];
  const missing: string[] = [];

  const fuse = new Fuse(rawDisciplines.map((d: any) => ({
    ...d,
    _normName: normalizeText(d.name || ''),
    _normShort: normalizeText(d.shortName || ''),
    _normCode: normalizeText(d.code || ''),
  })), {
    keys: ['_normName', '_normShort', '_normCode', 'code', 'name'],
    threshold: 0.4,
  });

  (items ?? []).forEach(p => {
    if (!p) return;

    const candidates: { discipline: any; yearDiff: number; matchType: number }[] = [];

    rawDisciplines.forEach((d: any) => {
      let matchType = 0;

      const pCodeClean = cleanText(p.code || '');
      const dCodeClean = cleanText(d.code || '');
      if (pCodeClean && dCodeClean === pCodeClean) {
        matchType = 1;
      }

      const pNameClean = cleanText(p.fullName || p.shortName || '');
      const dNameClean = cleanText(d.name || '');
      const dShortClean = cleanText(d.shortName || '');
      if (matchType === 0 && pNameClean) {
        if (dNameClean === pNameClean || dShortClean === pNameClean) {
          matchType = 2;
        }
      }

      if (matchType === 0 && pNameClean && pNameClean.length >= 4) {
        if ((dNameClean && dNameClean.includes(pNameClean)) ||
          (dShortClean && dShortClean.includes(pNameClean)) ||
          (pNameClean.includes(dNameClean) && dNameClean.length >= 4)) {
          matchType = 3;
        }
      }

      if (matchType > 0) {
        const dYear = parseInt(d.year || '0', 10);
        const yearDiff = Math.abs(dYear - currentYear);
        candidates.push({ discipline: d, yearDiff, matchType });
      }
    });

    candidates.sort((a, b) => {
      if (a.matchType !== b.matchType) return a.matchType - b.matchType;
      if (a.yearDiff !== b.yearDiff) return a.yearDiff - b.yearDiff;
      const aYear = parseInt(a.discipline.year || '0', 10);
      const bYear = parseInt(b.discipline.year || '0', 10);
      return bYear - aYear;
    });

    const found = candidates[0]?.discipline;

    if (found) {
      ids.push(found.id);
    } else {
      missing.push(p.fullName || p.code || 'Невідома дисципліна');
    }
  });

  return { ids, missing };
};

export const safeSemester = (sem: any): number => {
  const parsed = parseInt(sem, 10);
  return isNaN(parsed) ? 1 : parsed;
};
