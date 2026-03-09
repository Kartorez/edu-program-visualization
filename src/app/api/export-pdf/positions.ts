import { DisciplineNode } from '@/types/DisciplineNode';

export function stripSelection(nodes: DisciplineNode[]): DisciplineNode[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return nodes.map(({ selected: _, ...node }) => node as DisciplineNode);
}
export function makeAbsPosResolver(nodes: DisciplineNode[]) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  function getAbsPos(id: string): { x: number; y: number } {
    const node = nodeMap.get(id)!;
    if (!node.parentId) return { x: node.position.x, y: node.position.y };
    const parent = getAbsPos(node.parentId);
    return { x: parent.x + node.position.x, y: parent.y + node.position.y };
  }

  return getAbsPos;
}

export function calcContentSize(
  nodes: DisciplineNode[],
  getAbsPos: ReturnType<typeof makeAbsPosResolver>
) {
  let maxX = 0;
  let maxY = 0;

  for (const node of nodes) {
    if (node.id.startsWith('year-')) continue;
    const abs = getAbsPos(node.id);
    const w = node.id.startsWith('semester-') ? 100 : ((node.style?.width as number) ?? 140);
    const h = (node.style?.height as number) ?? 90;
    if (abs.x + w > maxX) maxX = abs.x + w;
    if (abs.y + h > maxY) maxY = abs.y + h;
  }

  return { maxX, maxY };
}
