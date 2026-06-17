export type DisciplineWithElectiveGroup = {
  id: string | number;
  code?: string | null;
  name?: string | null;
  shortName?: string | null;
  electiveGroup?: { code?: string | null; name?: string | null } | string | number | null;
};

export const getElectiveGroupCode = (node: DisciplineWithElectiveGroup): string | null => {
  if (node.electiveGroup && typeof node.electiveGroup === 'object' && 'code' in node.electiveGroup) {
    const raw = String(node.electiveGroup.code).trim();
    return raw.startsWith('ВК') ? raw : `ВК ${raw}`;
  }

  if (node.code?.startsWith('ВК')) {
    return node.code.split('.')[0].trim();
  }

  return null;
};