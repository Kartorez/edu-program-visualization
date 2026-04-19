const parseCodeIndex = (code: string | undefined): [string, number, number] => {
  if (!code) return ['', 0, 0];
  const match = code.trim().match(/^([А-ЯҐЄІЇа-яґєії]+)\s*(\d+)(?:\.(\d+))?/);
  const prefix = match?.[1] ?? '';
  const main = Number(match?.[2] ?? 0);
  const sub = Number(match?.[3] ?? 0);
  return [prefix, main, sub];
};

export function sortByCode<T extends { code?: string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const [aPrefix, aMain, aSub] = parseCodeIndex(a.code ?? undefined);
    const [bPrefix, bMain, bSub] = parseCodeIndex(b.code ?? undefined);
    if (aPrefix !== bPrefix) return aPrefix.localeCompare(bPrefix, 'uk');
    if (aMain !== bMain) return aMain - bMain;
    return aSub - bSub;
  });
}
