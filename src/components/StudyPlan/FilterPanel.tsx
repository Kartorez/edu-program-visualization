'use client';

import { useState } from 'react';
import { Panel } from '@xyflow/react';
import Button from '@/components/ui/Button';
import './FilterPanel.scss';

export type FilterType = 'ОК' | 'ВК';

interface FilterPanelProps {
  typeFilters: FilterType[];
  semesterFilters: number[];
  onTypeToggle: (type: FilterType) => void;
  onSemesterToggle: (sem: number) => void;
  onTypeReset: () => void;
  onReset: () => void;
}

export default function FilterPanel({
  typeFilters,
  semesterFilters,
  onTypeToggle,
  onSemesterToggle,
  onTypeReset,
  onReset,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasFilters = typeFilters.length > 0 || semesterFilters.length > 0;

  return (
    <Panel position="top-left">
      <div className="filter-panel">
        <Button
          className={`button--ghost button--sm filter-toggle ${hasFilters ? 'filter-toggle--active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          Фільтри
          {hasFilters && (
            <span className="filter-toggle__count">
              {typeFilters.length + semesterFilters.length}
            </span>
          )}
        </Button>

        <div className={`filter-body ${isOpen ? 'filter-body--open' : ''}`}>
          <div className="filter-section">
            <span className="filter-label">Тип</span>
            <div className="filter-group">
              <Button
                onClick={onTypeReset}
                className={`filter-chip ${typeFilters.length === 0 ? 'filter-chip--active' : ''}`}
              >
                Всі
              </Button>
              {(['ОК', 'ВК'] as FilterType[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => onTypeToggle(type)}
                  className={`filter-chip ${typeFilters.includes(type) ? 'filter-chip--active' : ''}`}
                >
                  <span className="filter-checkbox" />
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <span className="filter-label">Семестр</span>
            <div className="filter-semester-grid">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                <Button
                  key={sem}
                  onClick={() => onSemesterToggle(sem)}
                  className={`filter-semester-button ${semesterFilters.includes(sem) ? 'filter-semester-button--active' : ''}`}
                >
                  {sem}
                </Button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <>
              <div className="filter-divider" />
              <Button onClick={onReset} className="filter-reset">
                Скинути фільтри
              </Button>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
