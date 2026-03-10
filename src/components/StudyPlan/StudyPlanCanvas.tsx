'use client';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node } from '@xyflow/react';
import { Discipline } from '@/schemas/discipline.schema';

const FlowCanvas = dynamic(() => import('./FlowCanvas'), { ssr: false });

export default function StudyPlanCanvas({ initialNodes }: { initialNodes: Node<Discipline>[] }) {
  return (
    <ReactFlowProvider>
      <FlowCanvas initialNodes={initialNodes} />
    </ReactFlowProvider>
  );
}
