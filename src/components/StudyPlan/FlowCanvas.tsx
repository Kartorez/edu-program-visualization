'use client';

import { useState, useMemo, useCallback } from 'react';
import { ReactFlow, Controls, Background, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from '../DisciplineNode';
import DownloadButton from './DownloadButton';
import { disciplines } from '@/data/node';
import { positionNodes } from 'src/utils/positionNodes';
import DisciplineModal from '../DisciplineModal';
import FilterPanel, { FilterType } from '@/components/StudyPlan/FilterPanel';
import { Discipline } from '@/schemas/discipline.schema';
import { AnimatePresence } from 'framer-motion';

const nodeTypes = { disciplineNode: DisciplineNode };
const INITIAL_NODES = positionNodes(disciplines);

export default function FlowCanvas() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilters, setTypeFilters] = useState<FilterType[]>([]);
  const [semesterFilters, setSemesterFilters] = useState<number[]>([]);
  const { fitView, getNodes } = useReactFlow();

  const selectedNode = disciplines.find((d) => d.code === selectedCode) ?? null;

  const nodes = useMemo(
    () =>
      INITIAL_NODES.map((node) => {
        const data = node.data as Discipline;
        if (!data?.code) return node;

        const matchesType =
          typeFilters.length === 0 || typeFilters.some((f) => data.code?.startsWith(f));

        const matchesSemester =
          semesterFilters.length === 0 || semesterFilters.some((s) => data.semesters?.includes(s));

        const isVisible = matchesType && matchesSemester;
        const isSelected = node.id.startsWith(selectedCode ?? '___');

        return {
          ...node,
          selected: isSelected,
          style: {
            ...node.style,
            opacity: isVisible ? 1 : 0.2,
            pointerEvents: (isVisible ? 'all' : 'none') as React.CSSProperties['pointerEvents'],
          },
        };
      }),
    [typeFilters, semesterFilters, selectedCode]
  );

  const onTypeToggle = (type: FilterType) =>
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const onSemesterToggle = (sem: number) =>
    setSemesterFilters((prev) =>
      prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
    );

  const onTypeReset = () => setTypeFilters([]);

  const onReset = () => {
    setTypeFilters([]);
    setSemesterFilters([]);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedCode(null);
  };

  const onFocusNode = useCallback(
    (code: string) => {
      if (selectedCode === code) return;
      const node = getNodes().find((n) => n.id.startsWith(code));
      if (!node) return;

      setSelectedCode(code);
      setIsOpen(true);
      requestAnimationFrame(() => {
        fitView({ nodes: [{ id: node.id }], duration: 600, padding: 5 });
      });
    },
    [selectedCode, fitView, getNodes]
  );

  const onNodeClick = useCallback(
    (_: unknown, node: { id: string; data: unknown }) => {
      const data = node.data as Discipline;
      if (!data.code.startsWith('ОК') && !data.code.startsWith('ВК')) return;
      onFocusNode(data.code);
    },
    [onFocusNode]
  );

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
        onNodeClick={onNodeClick}
      >
        <Controls showInteractive={false} />
        <Background color="rgba(10, 37, 64, 0.5)" />
        <DownloadButton />
        <FilterPanel
          typeFilters={typeFilters}
          semesterFilters={semesterFilters}
          onTypeToggle={onTypeToggle}
          onSemesterToggle={onSemesterToggle}
          onTypeReset={onTypeReset}
          onReset={onReset}
        />
      </ReactFlow>
      <AnimatePresence>
        {isOpen && selectedNode && (
          <DisciplineModal
            node={selectedNode}
            allNodes={disciplines}
            isOpen={isOpen}
            onFocusNode={onFocusNode}
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
