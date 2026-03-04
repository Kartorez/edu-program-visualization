'use client';

import { Panel } from '@xyflow/react';
import type { Discipline, Disciplines } from '../schemas/discipline.schema';
import './DisciplineModal.scss';

export default function DisciplineModal({
  node,
  allNodes,
  onClose,
}: {
  node: Discipline | null;
  allNodes: Disciplines;
  onClose: () => void;
}) {
  if (!node) return null;

  const getLabel = (code: string) => {
    const found = allNodes.find((n) => n.code === code);
    return found ? `${found.code} ${found.name}` : `${code}`;
  };
  const prerequisites = [...new Set(node.prerequisites ?? [])];
  const postrequisites = [...new Set(node.postrequisites ?? [])];

  return (
    <Panel position="center-right" className="discipline-modal">
      <button className="discipline-modal__close" onClick={onClose}>
        x
      </button>

      <h2 className="discipline-title">
        {node.code} {node.name}
      </h2>
      <div className="requisites">
        {prerequisites?.length > 0 && (
          <div className="prerequisites">
            <p className="prerequisites__title">Пререквізити</p>
            <ul className="prerequisites__list">
              {prerequisites.map((id) => (
                <li className="prerequisites__item" key={id}>
                  {getLabel(id)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {postrequisites?.length > 0 && (
          <div className="postrequisites">
            <p className="postrequisites__title">Постреквізити</p>
            <ul className="postrequisites__list">
              {postrequisites.map((id) => (
                <li className="postrequisites__item" key={id}>
                  {getLabel(id)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="discipline-modal__details-button">Details </button>
    </Panel>
  );
}
