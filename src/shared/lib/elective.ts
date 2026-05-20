import type { Discipline, ElectiveGroup } from '@prisma/client';

export type DisciplineWithElectiveGroup = Discipline & {
  electiveGroup?: ElectiveGroup | null;
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