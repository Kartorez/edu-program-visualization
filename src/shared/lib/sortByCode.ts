const parseCodeIndex = (code: string | undefined): [string, number, number] => {
    if (!code) return ['', 0, 0];
    const trimmed = code.trim();

    const prefixMatch = trimmed.match(/^([А-ЯҐЄІЇа-яґєії]+)/);
    const prefix = prefixMatch?.[1] ?? '';

    const rest = trimmed.slice(prefix.length).trim();

    const digitMatch = rest.match(/^(\d+)(?:\.(\d+))?/);
    let main = 0;
    let sub = 0;

    if (digitMatch) {
        main = Number(digitMatch[1]);
        sub = Number(digitMatch[2] ?? 0);
    } else if (rest.length > 0) {
        main = 9000 + rest.length;
    }

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