'use client';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node } from '@xyflow/react';
import type { Discipline } from '@/payload-types';

const FlowCanvas = dynamic(() => import('./FlowCanvas'), { ssr: false });

export default function StudyPlanCanvas({
  initialNodes,
  allDisciplines,
}: {
  initialNodes: Node<Record<string, unknown>>[];
  allDisciplines: Discipline[];
}) {
  return (
    <ReactFlowProvider>
      <FlowCanvas initialNodes={initialNodes} allDisciplines={allDisciplines} />
    </ReactFlowProvider>
  );
}
