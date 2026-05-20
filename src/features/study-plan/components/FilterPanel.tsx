'use client';

import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { Button } from '@/shared/ui';
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
    const [loading, setLoading] = useState(false);
    const hasFilters = typeFilters.length > 0 || semesterFilters.length > 0;

    const handleDownload = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/export-pdf');
            if (!res.ok) {
                throw new Error(`Export API failed with status ${res.status}`);
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement('a'), {
                href: url,
                download: 'study-plan.pdf',
            }).click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Не вдалося згенерувати PDF. Спробуйте пізніше.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Panel position="top-left">
            <div className="filter-panel">
                <div className="filter-panel__header">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`filter-toggle ${hasFilters ? 'filter-toggle--active' : ''}`}
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
                        <span className="filter-toggle__text">Фільтри</span>
                        {hasFilters && (
                            <span className="filter-toggle__count">
                                {typeFilters.length + semesterFilters.length}
                            </span>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        className="filter-download filter-download--mobile"
                        disabled={loading}
                        onClick={handleDownload}
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className="filter-download__text">{loading ? '...' : 'PDF'}</span>
                    </Button>
                </div>

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