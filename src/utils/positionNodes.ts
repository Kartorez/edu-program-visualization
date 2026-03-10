import type { Node } from '@xyflow/react';
import type { Disciplines, Discipline } from '@/schemas/discipline.schema';
import { ROW_HEIGHT, YEAR_GAP, COL_WIDTH, GRAPH_PADDING } from '@/constants/nodeLayout';

function getYear(semester: number): number {
  return Math.floor((semester - 1) / 2);
}

function getSemesterY(semester: number): number {
  const year = getYear(semester);
  return (semester - 1) * ROW_HEIGHT + year * YEAR_GAP;
}

export function positionNodes(rawNodes: Disciplines): Node<Discipline>[] {
  const result: Node<Discipline>[] = [];
  const semesterCounters: Record<number, number> = {};

  const allSemesters = rawNodes.flatMap((n) => n.semesters);
  const uniqueSemesters = [...new Set(allSemesters)].sort((a, b) => a - b);

  const years = [...new Set(uniqueSemesters.map(getYear))];

  years.forEach((year) => {
    const semester1 = year * 2 + 1;
    const semester2 = year * 2 + 2;

    const s1nodes = rawNodes.filter((n) => n.semesters.includes(semester1)).length;

    const s2nodes = rawNodes.filter((n) => n.semesters.includes(semester2)).length;

    const width = (Math.max(s1nodes, s2nodes) + 1) * COL_WIDTH + GRAPH_PADDING;

    result.push({
      id: `year-${year}`,
      type: 'group',
      position: {
        x: 0,
        y: year * 2 * ROW_HEIGHT + year * YEAR_GAP,
      },
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
      data: {} as Discipline,
    });
  });

  rawNodes.forEach((node) => {
    node.semesters.forEach((semester) => {
      if (!(semester in semesterCounters)) {
        semesterCounters[semester] = 0;

        const nodesInSemester = rawNodes.filter((n) => n.semesters.includes(semester)).length;

        const width = (nodesInSemester + 1) * COL_WIDTH + GRAPH_PADDING;

        result.push({
          id: `semester-${semester}`,
          type: 'disciplineNode',
          position: {
            x: GRAPH_PADDING,
            y: getSemesterY(semester) + GRAPH_PADDING,
          },
          style: {
            height: ROW_HEIGHT,
            width,
            zIndex: -1,
            pointerEvents: 'none',
          },
          data: {
            code: '',
            name: `Семестр ${semester}`,
            semesters: [semester],
            prerequisites: [],
            postrequisites: [],
          },
        });
      }

      const columnIndex = 1 + semesterCounters[semester]++;

      result.push({
        id: `${node.code}-${semester}`,
        type: 'disciplineNode',
        parentId: `semester-${semester}`,
        extent: 'parent',
        position: {
          x: columnIndex * COL_WIDTH - 20,
          y: 0,
        },
        data: {
          ...node,
          semesters: [semester],
        },
      });
    });
  });

  return result;
}
