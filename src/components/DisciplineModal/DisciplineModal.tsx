'use client';

import { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import RequisiteList from '@/components/DisciplineModal/RequisiteList';
import ElectiveList from '@/components/DisciplineModal/ElectiveList';
import { getElectiveGroup, Discipline, Disciplines } from '@/schemas/discipline.schema';
import './DisciplineModal.scss';
import Button from '@/components/ui/Button/Button';

const buildLabelMap = (allNodes: Disciplines) =>
  new Map(allNodes.map((n) => [n.code, `${n.code} ${n.name}`]));

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

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const electiveVariants = useMemo(() => {
    if (!node?.code.startsWith('ВК')) return [];
    return allNodes.filter((n) => getElectiveGroup(n.code) === node.code);
  }, [node?.code, allNodes]);

  const prerequisites = useMemo(
    () => [...new Set(node?.prerequisites ?? [])],
    [node?.prerequisites]
  );

  const postrequisites = useMemo(
    () => [...new Set(node?.postrequisites ?? [])],
    [node?.postrequisites]
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
            <Button className="discipline-modal__details-button button--lg">Детальніше</Button>
          </>
        )}
      </div>
    </Panel>
  );
}
