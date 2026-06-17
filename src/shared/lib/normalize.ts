
export const normalizeCode = (code: string): string => {
  if (!code) return '';

  let normalized = code.trim().toLowerCase();

  const replacements: Record<string, string> = {
    'c': 'с',
    's': 'с',
    'k': 'к',
    'z': 'з',
    'p': 'р',
    'r': 'р',
    'n': 'н',
    'h': 'н',
    'o': 'о',
    'a': 'а',
    'e': 'е',
    'i': 'і',
  };

  normalized = normalized.replace(/[cskzprnhoaei]/g, (m) => replacements[m] || m);
  normalized = normalized.toUpperCase();

  const match = normalized.match(/^(ЗК|СК|РН|ПРН|ПР)\s*[-.]?\s*0*(\d+)$/);
  if (match) {
    let [, prefix, num] = match;
    if (prefix === 'ПРН' || prefix === 'ПР') prefix = 'РН';
    return `${prefix} ${num}`;
  }

  const vkMatch = normalized.match(/^(ВК)\s*[-.]?\s*0*(\d+)(?:\.0*(\d+))?$/);
  if (vkMatch) {
    const [, prefix, num1, num2] = vkMatch;
    if (num2 !== undefined) {
      return `${prefix} ${num1}.${num2}`;
    }
    return `${prefix} ${num1}`;
  }

  return normalized;
};

export const parseElectiveGroup = (code: string): { groupCode: string; groupName: string } | null => {
  if (!code) return null;
  const normalized = normalizeCode(code);
  const match = normalized.match(/^ВК\s*[-.]?\s*(\d+)/i);
  if (!match) return null;
  const n = match[1];
  return {
    groupCode: `ВК ${n}`,
    groupName: `Вибіркова група ${n}`,
  };
};
