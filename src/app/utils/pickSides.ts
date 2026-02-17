import type { StudyNodeSource } from '@/data/node';
import type { Side } from '@/types/graph';

function pickSides(
  sourceNode: StudyNodeSource,
  targetNode: StudyNodeSource,
  rawMap: Record<string, StudyNodeSource>
): { sourceSide: Side; targetSide: Side } {
  const sourceSemester = sourceNode.semester;
  const targetSemester = targetNode.semester;

  if (targetSemester > sourceSemester) {
    return { sourceSide: 'bottom', targetSide: 'top' };
  }

  if (targetSemester < sourceSemester) {
    return { sourceSide: 'top', targetSide: 'bottom' };
  }

  const allNodesInSemester = Object.values(rawMap)
    .filter((n) => n.semester === sourceSemester)
    .sort((a, b) => a.id - b.id);

  const sourceIndex = allNodesInSemester.findIndex(
    (n) => n.id === sourceNode.id
  );
  const targetIndex = allNodesInSemester.findIndex(
    (n) => n.id === targetNode.id
  );

  if (targetIndex > sourceIndex) {
    return { sourceSide: 'right', targetSide: 'left' };
  } else {
    return { sourceSide: 'left', targetSide: 'right' };
  }
}

export default pickSides;
