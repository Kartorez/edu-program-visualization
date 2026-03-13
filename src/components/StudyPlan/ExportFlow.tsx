'use client';
import { useEffect, useRef, useState } from 'react';
import { ReactFlow, ReactFlowProvider, Node, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from '@/components/DisciplineNode';
import { Discipline } from '@/schemas/discipline.schema';

const nodeTypes = { disciplineNode: DisciplineNode };

// Розміри A4 landscape в пікселях при 96 dpi
const PAGE_W = 1123;
const PAGE_H = 794;

function Flow({ initialNodes }: { initialNodes: Node<Discipline>[] }) {
  const flowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [ready, setReady] = useState(false);

  // Крок 1 — підганяємо граф під вьюпорт після першого рендеру
  useEffect(() => {
    fitView({ padding: 0.05 });

    // Крок 2 — після fitView чекаємо один кадр, щоб DOM оновився
    const raf = requestAnimationFrame(() => {
      setReady(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [fitView]);

  // Крок 3 — виставляємо прапорець тільки коли стан "ready"
  useEffect(() => {
    if (!ready) return;
    // Puppeteer слухає саме це
    (window as unknown as Record<string, unknown>)['__EXPORT_READY__'] = true;
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

export default function ExportFlow({ initialNodes }: { initialNodes: Node<Discipline>[] }) {
  return (
    <ReactFlowProvider>
      <Flow initialNodes={initialNodes} />
    </ReactFlowProvider>
  );
}
