import type { Node } from '@xyflow/react';
import type { Discipline } from '@/payload-types';
import { getElectiveGroupCode } from '@/utils/elective';
import { sortByCode } from '@/utils/sortByCode';
import { ROW_HEIGHT, YEAR_GAP, COL_WIDTH, GRAPH_PADDING } from '@/constants/nodeLayout';

function getYear(semester: number): number {
  return Math.floor((semester - 1) / 2);
}

function getSemesterY(semester: number): number {
  const year = getYear(semester);
  return (semester - 1) * ROW_HEIGHT + year * YEAR_GAP;
}

const resolveIds = (items: (string | number | Discipline)[], idToCode: Map<string, string>): string[] =>
  items.map((p) => {
    if (typeof p === 'object') return p.code;
    return idToCode.get(String(p)) ?? String(p);
  });

export function positionNodes(rawNodes: Discipline[]): Node<Record<string, unknown>>[] {
  const result: Node<Record<string, unknown>>[] = [];
  const semesterCounters: Record<number, number> = {};
  
  const idToCode = new Map<string, string>(rawNodes.map(n => [String(n.id), n.code]));

  const okNodes = sortByCode(rawNodes.filter((n) => !getElectiveGroupCode(n)));
  const vkNodes = sortByCode(rawNodes.filter((n) => getElectiveGroupCode(n)));
  const ordered = [...okNodes, ...vkNodes];

  const seenGroups = new Set<string>();
  const displayNodes = ordered.filter((node) => {
    const group = getElectiveGroupCode(node);
    if (!group) return true;
    if (seenGroups.has(group)) return false;
    seenGroups.add(group);
    return true;
  });

  const allSemesters: number[] = displayNodes.flatMap((n) =>
    n.semesters.map((s) => s.semester ?? 0)
  );

  const uniqueSemesters = [...new Set(allSemesters)].sort((a, b) => a - b);
  const years = [...new Set(uniqueSemesters.map(getYear))];

  years.forEach((year) => {
    const semester1 = year * 2 + 1;
    const semester2 = year * 2 + 2;

    const s1nodes = displayNodes.filter((n) =>
      n.semesters.some((s) => s.semester === semester1)
    ).length;

    const s2nodes = displayNodes.filter((n) =>
      n.semesters.some((s) => s.semester === semester2)
    ).length;

    const width = (Math.max(s1nodes, s2nodes) + 1) * COL_WIDTH + GRAPH_PADDING;

    result.push({
      id: `year-${year}`,
      type: 'group',
      position: { x: 0, y: year * 2 * ROW_HEIGHT + year * YEAR_GAP },
      style: {
        height: ROW_HEIGHT * 2,
        width,
        padding: 20,
        zIndex: -2,
        pointerEvents: 'none',
        backgroundColor: 'rgba(255, 255, 200, 0.4)',
        border: '1.5px solid rgba(180,180,180, 0.8)',
        borderRadius: '12px',
      },
      data: {},
    });
  });

  displayNodes.forEach((node) => {
    node.semesters.forEach((s) => {
      const semester = s.semester ?? 0;

      if (!(semester in semesterCounters)) {
        semesterCounters[semester] = 0;

        const nodesInSemester = displayNodes.filter((n) =>
          n.semesters.some((s2) => s2.semester === semester)
        ).length;

        const width = (nodesInSemester + 1) * COL_WIDTH + GRAPH_PADDING;

        result.push({
          id: `semester-${semester}`,
          type: 'disciplineNode',
          position: { x: GRAPH_PADDING, y: getSemesterY(semester) + GRAPH_PADDING },
          style: { height: ROW_HEIGHT, width, zIndex: -1, pointerEvents: 'none' },
          data: {
            code: '',
            name: `Семестр ${semester}`,
            semesters: [semester],
            prerequisites: [],
            postrequisites: [],
          } as Record<string, unknown>,
        });
      }

      const columnIndex = 1 + semesterCounters[semester]++;
      const group = getElectiveGroupCode(node);
      const groupName = group && node.electiveGroup && typeof node.electiveGroup === 'object' && 'name' in node.electiveGroup 
        ? node.electiveGroup.name 
        : 'Вибіркова дисципліна';

      result.push({
        id: `${group ?? node.code}-${semester}`,
        type: 'disciplineNode',
        parentId: `semester-${semester}`,
        extent: 'parent',
        position: { x: columnIndex * COL_WIDTH - 20, y: 0 },
        data: {
          code: group ?? node.code,
          name: group ? groupName : node.name,
          shortName: group ?? node.shortName,
          semesters: [semester],
          prerequisites: resolveIds(node.prerequisites ?? [], idToCode),
          postrequisites: resolveIds(node.postrequisites ?? [], idToCode),
        } as Record<string, unknown>,
      });
    });
  });

  return result;
}
