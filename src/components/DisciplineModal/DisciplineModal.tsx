'use client';

import { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import RequisiteList from '@/components/DisciplineModal/RequisiteList';
import ElectiveList from '@/components/DisciplineModal/ElectiveList';
import './DisciplineModal.scss';
import Button from '@/components/ui/Button/Button';
import type { Discipline } from '@/payload-types';

type Disciplines = Discipline[];

const getElectiveGroup = (code: string): string | null => {
  if (!code?.startsWith('ВК')) return null;
  return code.split('.')[0].trim();
};

const buildLabelMap = (allNodes: Disciplines): Map<string, string> =>
  new Map(allNodes.map((n) => [n.code, `${n.code} ${n.name}`] as [string, string]));

const resolveCode = (p: string | number | Discipline, allNodes: Discipline[]): string => {
  if (typeof p === 'object') return p.code;
  const found = allNodes.find((n) => String(n.id) === String(p));
  return found?.code ?? String(p);
};
export default function DisciplineModal({
  node,
  allNodes,
  onClose,
  onFocusNode,
  isOpen,
}: {
  isOpen: boolean;
  node: Discipline | null;
  allNodes: Disciplines;
  onClose: () => void;
  onFocusNode: (code: string) => void;
}) {
  const labelMap = useMemo(() => buildLabelMap(allNodes), [allNodes]);

  const electiveVariants = useMemo(() => {
    if (!node?.code.startsWith('ВК')) return [];
    const baseGroup = node.code.split('.')[0].trim();
    return allNodes
      .filter((n) => n.code.startsWith('ВК') && n.code.split('.')[0].trim() === baseGroup)
      .sort((a, b) => {
        const subA = parseInt(a.code.split('.')[1] ?? '0');
        const subB = parseInt(b.code.split('.')[1] ?? '0');
        return subA - subB;
      });
  }, [node?.code, allNodes]);

  const prerequisites = useMemo(
    () => [...new Set((node?.prerequisites ?? []).map((p) => resolveCode(p, allNodes)))],
    [node?.prerequisites, allNodes]
  );

  const postrequisites = useMemo(
    () => [...new Set((node?.postrequisites ?? []).map((p) => resolveCode(p, allNodes)))],
    [node?.postrequisites, allNodes]
  );

  if (!node) return null;

  const isElective = electiveVariants.length > 0;

  return (
    <Panel position="center-right" className="discipline-modal">
      <div className="discipline-modal__content">
        <button className="discipline-modal__close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="discipline-title">
          {node.code} {node.name}
        </h2>

        {isElective ? (
          <ElectiveList variants={electiveVariants} />
        ) : (
          <>
            <div className="requisites">
              <RequisiteList
                title="Пререквізити"
                ids={prerequisites}
                labelMap={labelMap}
                onFocusNode={onFocusNode}
              />
              <RequisiteList
                title="Постреквізити"
                ids={postrequisites}
                labelMap={labelMap}
                variant="post"
                onFocusNode={onFocusNode}
              />
            </div>
            <Button
              href={`/plan/disciplines/${encodeURIComponent(node.code)}`}
              className="discipline-modal__details-button button--lg"
            >
              Детальніше
            </Button>
          </>
        )}
      </div>
    </Panel>
  );
}
