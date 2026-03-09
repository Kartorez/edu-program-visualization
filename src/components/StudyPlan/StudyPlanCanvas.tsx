'use client';
import dynamic from 'next/dynamic';
import { ReactFlowProvider } from '@xyflow/react';

const FlowCanvas = dynamic(() => import('./FlowCanvas'), { ssr: false });

export default function StudyPlanCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
