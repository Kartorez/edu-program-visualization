'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ReactFlowProvider, Node } from '@xyflow/react';

const FlowCanvas = dynamic(() => import('./FlowCanvas'), { ssr: false });

export default function StudyPlanCanvas({
  initialNodes,
  allDisciplines,
  initialSemester,
}: {
  initialNodes: Node<Record<string, unknown>>[];
  allDisciplines: any[];
  initialSemester?: number | null;
}) {
  return (
    <ReactFlowProvider>
      <Suspense fallback={null}>
        <FlowCanvas
          initialNodes={initialNodes}
          allDisciplines={allDisciplines}
          initialSemester={initialSemester ?? null}
        />
      </Suspense>
    </ReactFlowProvider>
  );
}