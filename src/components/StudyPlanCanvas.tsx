'use client';

import { useState } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from './DisciplineNode';
import DownloadButton from './DownloadButton';
import { disciplines } from '@/data/node';
import { positionNodes } from 'src/utils/positionNodes';
import DisciplineModal from './DisciplineModal';
import { Discipline, Disciplines } from '@/schemas/discipline.schema';

const nodeTypes = {
  disciplineNode: DisciplineNode,
};

const allNodeData = disciplines.filter(() => true) as Disciplines;

export default function StudyPlanCanvas() {
  const [selectedNode, setSelectedNode] = useState<Discipline | null>(null);
  const nodes = positionNodes(disciplines);

  return (
    <section className="study--plan">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
        onNodeClick={(_, node) => {
          const data = node.data as Discipline;
          if (data.code.startsWith('ОК')) {
            setSelectedNode(data);
          }
        }}
      >
        <DisciplineModal
          node={selectedNode}
          allNodes={allNodeData}
          onClose={() => setSelectedNode(null)}
        />
        <Controls />
        <Background />
        <DownloadButton />
      </ReactFlow>
    </section>
  );
}
