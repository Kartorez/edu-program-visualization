'use client';

import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StudyNode from './StudyNode';
import CustomEdge from './CustomEdge';
import { rawNodes } from '@/data/node';
import { positionNodes } from '@/utils/positionNodes';
import { buildEdges } from '@/utils/buildEdges';

const nodeTypes = {
  studyNode: StudyNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function StudyPlanCanvas() {
  const positionedNodes = positionNodes(rawNodes);
  const { edges, usage } = buildEdges(rawNodes);

  const nodes = positionedNodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      ports: usage[node.id],
    },
  }));

  return (
    <div className="study--plan">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView
      />
    </div>
  );
}
