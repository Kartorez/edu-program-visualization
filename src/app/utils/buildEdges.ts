import { Edge, MarkerType } from '@xyflow/react';
import type { StudyNodeSource } from '@/data/node';
import type { PortUsage, Side } from '@/types/graph';
import pickSides from './pickSides';
import reservePort from './reservePort';

export function buildEdges(rawNodes: StudyNodeSource[]) {
  const edges: Edge[] = [];
  const usage: Record<string, PortUsage> = {};

  const rawMap = Object.fromEntries(rawNodes.map((n) => [n.id.toString(), n]));

  const edgeDefinitions: Array<{
    sourceId: string;
    targetId: string;
    sourceSide: Side;
    targetSide: Side;
    sourceHandle: string;
    targetHandle: string;
  }> = [];

  rawNodes.forEach((node) => {
    const targetId = node.id.toString();

    (node.prerequisites ?? []).forEach((reqId) => {
      const sourceId = reqId.toString();
      const sourceNode = rawMap[sourceId];
      if (!sourceNode) return;

      const { sourceSide, targetSide } = pickSides(sourceNode, node, rawMap);
      const sourceHandle = reservePort(usage, sourceId, sourceSide);
      const targetHandle = reservePort(usage, targetId, targetSide);

      edgeDefinitions.push({
        sourceId,
        targetId,
        sourceSide,
        targetSide,
        sourceHandle,
        targetHandle,
      });
    });
  });

  edgeDefinitions.forEach(
    ({
      sourceId,
      targetId,
      sourceSide,
      targetSide,
      sourceHandle,
      targetHandle,
    }) => {
      edges.push({
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        sourceHandle,
        targetHandle,
        data: {
          sourceSide,
          targetSide,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#222',
        },
      });
    }
  );

  return { edges, usage };
}
