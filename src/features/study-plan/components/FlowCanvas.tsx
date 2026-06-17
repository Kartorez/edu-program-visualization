'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, useReactFlow, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DisciplineNode from '@/shared/ui/CustomNodes/DisciplineNode';
import YearNode from '@/shared/ui/CustomNodes/YearNode';
import DownloadButton from './DownloadButton';
import DisciplineModal, { type ModalDisciplineNode } from './DisciplineModal';
import FilterPanel, { FilterType } from './FilterPanel';
import './StudyPlanCanvas.scss';

const nodeTypes = { disciplineNode: DisciplineNode, yearNode: YearNode };

export default function FlowCanvas({
  initialNodes,
  allDisciplines,
  initialSemester,
}: {
  initialNodes: Node<Record<string, unknown>>[];
  allDisciplines: any[];
  initialSemester: number | null;
}) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilters, setTypeFilters] = useState<FilterType[]>([]);
  const [semesterFilters, setSemesterFilters] = useState<number[]>(
    initialSemester ? [initialSemester] : []
  );
  const { fitView, getNodes } = useReactFlow();

  const selectedNode = useMemo<ModalDisciplineNode | null>(() => {
    return (
      allDisciplines.find((n: any) => {
        if (!n.code) return false;
        if (n.code.startsWith('ВК')) return n.code.split('.')[0].trim() === selectedCode;
        return n.code === selectedCode;
      }) ?? null
    );
  }, [allDisciplines, selectedCode]);

  const filterNodes = useMemo(
    () =>
      initialNodes.map((node) => {
        const code = node.data.code as string | undefined;
        if (!code) return node;

        const semesters = node.data.semesters as number[];

        const matchesType = typeFilters.length === 0 || typeFilters.some((f) => code.startsWith(f));
        const matchesSemester =
          semesterFilters.length === 0 ||
          (Array.isArray(semesters) && semesterFilters.some((s) => semesters.includes(s)));
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
    setSelectedNodeId(null);
  };

  useEffect(() => {
    if (!selectedNodeId) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    fitView({
      nodes: [{ id: selectedNodeId }],
      duration: 600,
      padding: isMobile ? 2 : 2,
      ...(isMobile && { minZoom: 0.8, maxZoom: 0.85 }),
    });
  }, [selectedNodeId, fitView]);

  const onFocusNode = useCallback(
    (code: string) => {
      setSelectedCode(code);
      setIsOpen(true);

      const node = getNodes().find((n) => {
        const nodeCode = n.id.replace(/-\d+$/, '');
        return nodeCode === code;
      });
      if (node) setSelectedNodeId(node.id);
    },
    [getNodes]
  );

  const onNodeClick = useCallback((_: unknown, node: { id: string; data: unknown }) => {
    const code = (node.data as Record<string, unknown>).code as string;
    if (!code.startsWith('ОК') && !code.startsWith('ВК')) return;
    setSelectedCode(code);
    setSelectedNodeId(node.id);
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
        onNodeClick={onNodeClick}
        onPaneClick={onClose}
        fitView
        fitViewOptions={{
          padding: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.02 : 0.1,
          includeHiddenNodes: false,
        }}
      >
        <Controls showInteractive={false} />
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
          allNodes={allDisciplines}
          isOpen={isOpen}
          onFocusNode={onFocusNode}
          onClose={onClose}
        />
      )}
    </section>
  );
}
