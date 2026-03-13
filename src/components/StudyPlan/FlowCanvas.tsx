'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, useReactFlow, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from '../DisciplineNode';
import DownloadButton from './DownloadButton';
import DisciplineModal from '../DisciplineModal';
import FilterPanel, { FilterType } from '@/components/StudyPlan/FilterPanel';
import { Discipline } from '@/schemas/discipline.schema';
import { disciplines } from '@/data/node';

const nodeTypes = { disciplineNode: DisciplineNode };

export default function FlowCanvas({ initialNodes }: { initialNodes: Node<Discipline>[] }) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilters, setTypeFilters] = useState<FilterType[]>([]);
  const [semesterFilters, setSemesterFilters] = useState<number[]>([]);
  const { fitView, getNodes } = useReactFlow();

  const selectedNode = useMemo(
    () => initialNodes.find((n) => n.data.code === selectedCode)?.data ?? null,
    [initialNodes, selectedCode]
  );

  const filterNodes = useMemo(
    () =>
      initialNodes.map((node) => {
        const data = node.data as Discipline;
        if (!data?.code) return node;

        const matchesType =
          typeFilters.length === 0 || typeFilters.some((f) => data.code?.startsWith(f));
        const matchesSemester =
          semesterFilters.length === 0 || semesterFilters.some((s) => data.semesters?.includes(s));
        const isVisible = matchesType && matchesSemester;

        return {
          ...node,
          style: {
            ...node.style,
            opacity: isVisible ? 1 : 0.2,
            pointerEvents: (isVisible ? 'all' : 'none') as React.CSSProperties['pointerEvents'],
          },
        };
      }),
    [initialNodes, typeFilters, semesterFilters]
  );

  const nodes = useMemo(
    () =>
      filterNodes.map((node) => {
        const isSelected = node.id.startsWith(`${selectedCode}-`);
        if (isSelected === (node.selected ?? false)) return node;
        return { ...node, selected: isSelected };
      }),
    [filterNodes, selectedCode]
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

  useEffect(() => {
    if (!selectedCode) return;
    const node = getNodes().find((n) => n.id.startsWith(selectedCode));
    if (!node) return;

    fitView({ nodes: [{ id: node.id }], duration: 600, padding: 5 });
  }, [selectedCode, fitView, getNodes]);

  const onFocusNode = useCallback((code: string) => {
    setSelectedCode((prev) => {
      if (prev === code) return prev;
      return code;
    });
    setIsOpen(true);
  }, []);

  const onNodeClick = useCallback((_: unknown, node: { id: string; data: unknown }) => {
    const data = node.data as Discipline;
    if (!data.code.startsWith('ОК') && !data.code.startsWith('ВК')) return;

    setSelectedCode((prev) => {
      if (prev === data.code) return prev;
      return data.code;
    });
    setIsOpen(true);
  }, []);

  return (
    <section className="study-plan">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
        /*
        onlyRenderVisibleElements={true}
        */
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
      {isOpen && selectedNode && (
        <DisciplineModal
          node={selectedNode}
          allNodes={disciplines}
          isOpen={isOpen}
          onFocusNode={onFocusNode}
          onClose={onClose}
        />
      )}
    </section>
  );
}
