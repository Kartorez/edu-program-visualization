import type { Discipline } from '@/payload-types';

export const getElectiveGroupCode = (node: Discipline): string | null => {

  if (node.electiveGroup && typeof node.electiveGroup === 'object' && 'code' in node.electiveGroup) {
    const raw = String(node.electiveGroup.code).trim();
    return raw.startsWith('ВК') ? raw : `ВК ${raw}`;
  }

  if (node.code?.startsWith('ВК')) {
    return node.code.split('.')[0].trim();
  }

  return null;
};
