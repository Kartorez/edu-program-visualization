const parseCodeIndex = (code: string | undefined): number => {
  return Number(code?.match(/\d+/)?.[0] ?? 0);
};

export function sortByCode<T extends { code?: string | null }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => parseCodeIndex(a.code ?? undefined) - parseCodeIndex(b.code ?? undefined)
  );
}
