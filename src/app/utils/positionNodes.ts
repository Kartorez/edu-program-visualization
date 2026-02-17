import type { Node } from '@xyflow/react';
import type { StudyNodeData } from '@/types/node';
import type { StudyNodeSource } from '@/data/node';

const COL_WIDTH = 240;
const ROW_HEIGHT = 160;

export function positionNodes(
  rawNodes: StudyNodeSource[]
): Node<StudyNodeData>[] {
  const result: Node<StudyNodeData>[] = [];
  const semesterCounters: Record<number, number> = {};

  rawNodes.forEach((node) => {
    const semester = node.semester;

    if (!(semester in semesterCounters)) {
      semesterCounters[semester] = 0;

      result.push({
        id: `semester-${semester}`,
        type: 'studyNode',
        position: {
          x: 0,
          y: semester * ROW_HEIGHT,
        },
        data: {
          title: `Semester ${semester + 1}`,
          semester: semester + 1,
          kind: 'semester',
        },
      });
    }

    const columnIndex = 1 + semesterCounters[semester]++;

    result.push({
      id: node.id.toString(),
      type: 'studyNode',
      position: {
        x: columnIndex * COL_WIDTH,
        y: semester * ROW_HEIGHT,
      },
      data: {
        title: node.title,
        subject: node.subject,
        semester: semester + 1,
        kind: node.kind,
      },
    });
  });

  return result;
}
