'use client';

import { useMemo } from 'react';
import RequisiteList from './RequisiteList';
import ElectiveList from './ElectiveList';
import './DisciplineModal.scss';
import Button from '@/shared/ui/Button/Button';
import { sortByCode } from '@/shared/lib/sortByCode';
import { getElectiveGroupCode, type DisciplineWithElectiveGroup } from '@/shared/lib/elective';

export type ModalDisciplineNode = DisciplineWithElectiveGroup & {
  currentSemester?: number;
  prerequisites?: (string | { code: string | null })[];
  postrequisites?: (string | { code: string | null })[];
};

const buildLabelMap = (allNodes: ModalDisciplineNode[]): Map<string, string> =>
  new Map(allNodes.map((n) => [n.code ?? '', `${n.code} ${n.name}`] as [string, string]));

const resolveCode = (p: unknown): string => {
  if (p && typeof p === 'object' && 'code' in p) return (p as { code: string | null }).code ?? '';
  return String(p);
};

export default function DisciplineModal({
  node,
  allNodes,
  onClose,
  onFocusNode,
  isOpen,
}: {
  isOpen: boolean;
  node: ModalDisciplineNode | null;
  allNodes: ModalDisciplineNode[];
  onClose: () => void;
  onFocusNode: (code: string) => void;
}) {
  const labelMap = useMemo(() => buildLabelMap(allNodes), [allNodes]);

  const electiveVariants = useMemo(() => {
    if (!node) return [];
    const baseGroup = getElectiveGroupCode(node);
    if (!baseGroup) return [];
    return allNodes
      .filter((n) => getElectiveGroupCode(n) === baseGroup)
      .sort((a, b) => {
        const subA = parseInt((a.code ?? '').split('.')[1] ?? '0');
        const subB = parseInt((b.code ?? '').split('.')[1] ?? '0');
        return subA - subB;
      });
  }, [node, allNodes]);

  const prerequisites = useMemo(
    () =>
      sortByCode(
        [...new Set((node?.prerequisites ?? []).map(resolveCode))]
          .filter((c) => !c.startsWith('ВК'))
          .map((c) => ({ code: c })),
      ).map((o) => o.code!),
    [node],
  );

  const postrequisites = useMemo(
    () =>
      sortByCode(
        [...new Set((node?.postrequisites ?? []).map(resolveCode))]
          .filter((c) => !c.startsWith('ВК'))
          .map((c) => ({ code: c })),
      ).map((o) => o.code!),
    [node],
  );

  if (!node) return null;

  const isElective = electiveVariants.length > 0;

  return (
    <div className={`discipline-modal ${isOpen ? 'is-open' : ''}`}>
      <div className="discipline-modal__backdrop" onClick={onClose} />
      <div className="discipline-modal__content">
        <button className="discipline-modal__close" onClick={onClose} aria-label="Закрити">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              href={`/plan/disciplines/${node.id}`}
              className="discipline-modal__details-button button--lg"
            >
              Детальніше
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
