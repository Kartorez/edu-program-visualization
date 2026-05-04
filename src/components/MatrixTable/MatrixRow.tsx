'use client';
import { memo } from 'react';
import Link from 'next/link';

interface MatrixRowProps {
  discipline: any;
  columns: any[];
  itemsKey: string;
  dotClass: string | ((item: any) => string);
  isSelected: boolean;
  selectedCols: Set<string>;
  highlightedCol: string | null;
  onToggleRow: (id: string, e: React.MouseEvent) => void;
}

const MatrixRow = memo(({ 
  discipline, 
  columns, 
  itemsKey,
  dotClass,
  isSelected, 
  selectedCols, 
  highlightedCol, 
  onToggleRow 
}: MatrixRowProps) => {
  const disciplineItems = discipline[itemsKey] || [];
  const url = `/plan/disciplines/${encodeURIComponent(discipline.code)}`;

  return (
    <tr 
      onClick={(e) => onToggleRow(discipline.id, e)}
      className={`matrix__row ${isSelected ? 'matrix__row--selected' : ''}`}
    >
      <td className="matrix__discipline-name">
        <div className="discipline-cell-content">
          <Link href={url} onClick={(e) => e.stopPropagation()} className="nav-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <span className="discipline-label">{discipline.code} {discipline.shortName}</span>
        </div>
      </td>
      {columns.map((col: any) => {
        const has = disciplineItems.some((item: any) =>
          typeof item === 'string' ? item === col.id : item.id === col.id
        );
        const isColSelected = selectedCols.has(col.code);
        const isHighlighted = highlightedCol === col.code;
        
        const dotClassName = typeof dotClass === 'function' ? dotClass(col) : dotClass;

        return (
          <td 
            key={col.id} 
            className={`matrix__cell ${isColSelected || isHighlighted ? 'matrix__cell--highlight' : ''} ${
              isSelected && isColSelected ? 'matrix__cell--intersection' : ''
            }`}
          >
            {has && <span className={dotClassName} />}
          </td>
        );
      })}
    </tr>
  );
});

MatrixRow.displayName = 'MatrixRow';

export default MatrixRow;
