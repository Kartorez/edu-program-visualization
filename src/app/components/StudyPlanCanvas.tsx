'use client';

import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StudyNode from './StudyNode';
import {
  SmartStepEdge,
  GetSmartEdgeOptions,
} from '@tisoap/react-flow-smart-edge';
import { rawNodes } from '@/data/node';
import { positionNodes } from '@/utils/positionNodes';
import { buildEdges } from '@/utils/buildEdges';

const nodeTypes = {
  studyNode: StudyNode,
};

const options: GetSmartEdgeOptions = {
  nodePadding: 5,
  gridRatio: 1,
};

const edgeTypes = {
  smart: (props) => (
    <SmartStepEdge
      {...props}
      style={{
        stroke: '#000',
        strokeWidth: 1.5,
        strokeOpacity: 0.6,
      }}
      options={options}
    />
  ),
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
    measured: {
      width: 120,
      height: 65,
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
        defaultEdgeOptions={{ type: 'smart' }}
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={2}
      />
    </div>
  );
}
