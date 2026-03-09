'use client';

import { useMemo } from 'react';
import { Panel } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { Discipline, Disciplines } from '../../schemas/discipline.schema';
import './DisciplineModal.scss';
import Button from '@/components/ui/Button';

const modalAnimation = {
  initial: { opacity: 0, x: 40, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 40, scale: 0.96 },
  transition: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
  } as const,
};

const buildLabelMap = (allNodes: Disciplines) =>
  new Map(allNodes.map((n) => [n.code, `${n.code} ${n.name}`]));

export default function DisciplineModal({
  node,
  allNodes,
  onClose,
  isOpen,
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
      <motion.div
        className="discipline-modal__content"
        initial={isOpen ? modalAnimation.initial : false}
        animate={modalAnimation.animate}
        exit={modalAnimation.exit}
        transition={modalAnimation.transition}
      >
        <button className="discipline-modal__close" onClick={onClose} aria-label="Close">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
              <motion.ul
                key={node.code}
                className="prerequisites__list"
                initial="hidden"
                animate="show"
              >
                {prerequisites.map((id) => (
                  <motion.li
                    key={id}
                    className="prerequisites__item"
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                      onFocusNode(id);
                    }}
                  >
                    {labelMap.get(id) ?? id}
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="no-requisites">Немає пререквізитів</p>
            )}
          </div>

          <div className="postrequisites">
            <p className="postrequisites__title">Постреквізити</p>

            {postrequisites.length ? (
              <motion.ul
                key={node.code}
                className="postrequisites__list"
                initial="hidden"
                animate="show"
              >
                {postrequisites.map((id) => (
                  <motion.li
                    key={id}
                    className="postrequisites__item"
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onFocusNode(id)}
                  >
                    {labelMap.get(id) ?? id}
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="no-requisites">Немає постреквізитів</p>
            )}
          </div>
        </div>
        <Button className="discipline-modal__details-button buton--lg">Детальніше</Button>
      </motion.div>
    </Panel>
  );
}
