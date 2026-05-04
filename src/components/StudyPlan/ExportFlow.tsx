'use client';
import { useEffect, useRef, useState } from 'react';
import { ReactFlow, ReactFlowProvider, Node, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from '@/components/DisciplineNode';
import { Discipline } from '@/payload-types';

const nodeTypes = { disciplineNode: DisciplineNode };

const PAGE_W = 1123;
const PAGE_H = 794;

function Flow({ initialNodes }: { initialNodes: Node<any>[] }) {
  const flowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fitView) fitView({ padding: 0.05 });
      setReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    (window as any)['__EXPORT_READY__'] = true;
  }, [ready]);

  return (
    <div
      ref={flowWrapper}
      style={{
        width: PAGE_W,
        height: PAGE_H,
      }}
      className="study-plan export"
    >
      <ReactFlow
        nodes={initialNodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}

export default function ExportFlow({ initialNodes }: { initialNodes: Node<any>[] }) {
  return (
    <ReactFlowProvider>
      <Flow initialNodes={initialNodes} />
    </ReactFlowProvider>
  );
}
