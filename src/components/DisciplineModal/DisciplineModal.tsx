'use client';

import { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import type { Discipline, Disciplines } from '../../schemas/discipline.schema';
import './DisciplineModal.scss';
import Button from '@/components/ui/Button';

const buildLabelMap = (allNodes: Disciplines) =>
  new Map(allNodes.map((n) => [n.code, `${n.code} ${n.name}`]));

export default function DisciplineModal({
  node,
  allNodes,
  onClose,
  onFocusNode,
}: {
  node: Discipline | null;
  allNodes: Disciplines;
  onClose: () => void;
  isOpen: boolean;
  onFocusNode: (code: string) => void;
}) {
  const labelMap = useMemo(() => buildLabelMap(allNodes), [allNodes]);

  const prerequisites = useMemo(
    () => [...new Set(node?.prerequisites ?? [])],
    [node?.prerequisites]
  );

  const postrequisites = useMemo(
    () => [...new Set(node?.postrequisites ?? [])],
    [node?.postrequisites]
  );

  if (!node) return null;

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

        <div className="requisites">
          <div className="prerequisites">
            <p className="prerequisites__title">Пререквізити</p>
            {prerequisites.length ? (
              <ul className="prerequisites__list">
                {prerequisites.map((id) => (
                  <li key={id} className="prerequisites__item" onClick={() => onFocusNode(id)}>
                    {labelMap.get(id) ?? id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-requisites">Немає пререквізитів</p>
            )}
          </div>

          <div className="postrequisites">
            <p className="postrequisites__title">Постреквізити</p>
            {postrequisites.length ? (
              <ul className="postrequisites__list">
                {postrequisites.map((id) => (
                  <li key={id} className="postrequisites__item" onClick={() => onFocusNode(id)}>
                    {labelMap.get(id) ?? id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-requisites">Немає постреквізитів</p>
            )}
          </div>
        </div>

        <Button className="discipline-modal__details-button button--lg">Детальніше</Button>
      </div>
    </Panel>
  );
}
