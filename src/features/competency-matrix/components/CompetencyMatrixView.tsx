'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PageHeader, StatPanel } from '@/shared/ui/PageHaeder';
import { useMatrixState, MatrixRow, MatrixSearch } from '@/features/matrix';
import styles from '@/features/matrix/components/Matrix.module.scss';

interface Props {
    disciplines: any[];
    competencies: any[];
}

export default function CompetencyMatrixView({ disciplines, competencies }: Props) {
    const router = useRouter();
    const params = useParams();
    const programId = params?.programId as string | undefined;
    const [visibleTypes, setVisibleTypes] = useState<string[]>(['zk', 'sk']);

    const {
        inputValue,
        deferredSearchQuery,
        isPending,
        handleSearchChange,
        filteredDisciplines,
        highlightedCol,
        selectedRows,
        selectedCols,
        selectedColsArray,
        toggleRow,
        toggleCol,
        handleCellClick,
        clearSelection,
        hasSelection,
        isDragging,
        handleMouseDown,
        handleMouseMove,
        handleMouseUpOrLeave,
    } = useMatrixState({ disciplines, hashPrefix: '#comp-' });

    const toggleType = (type: string) =>
        setVisibleTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
        );

    const allVisibleComps = useMemo(() => {
        const zkList = competencies.filter(c => c.type === 'zk' && visibleTypes.includes('zk'));
        const skList = competencies.filter(c => c.type === 'sk' && visibleTypes.includes('sk'));
        return [...zkList, ...skList];
    }, [competencies, visibleTypes]);

    const getDotClass = useCallback((c: any) => `dot-${c.type}`, []);

    return (
        <div className={styles.matrixPage}>
            <PageHeader
                code="ОПП · Комп'ютерні науки · Бакалавр"
                title="Матриця компетентностей"
                description="Відображає які загальні (ЗК) та спеціальні (СК) компетентності формує кожна дисципліна програми."
                stats={
                    <StatPanel items={[
                        {
                            label: 'Дисциплін',
                            value: deferredSearchQuery
                                ? `${filteredDisciplines.length} з ${disciplines.length}`
                                : disciplines.length,
                            isAccent: true,
                            onClick: () => router.push(programId ? `/plan/${programId}/graph` : '/plan/graph'),
                            title: 'Переглянути граф',
                        },
                        {
                            label: 'Загальні (ЗК)',
                            value: competencies.filter(c => c.type === 'zk').length,
                            onClick: () => toggleType('zk'),
                            inactive: !visibleTypes.includes('zk'),
                            title: 'Перемкнути видимість ЗК',
                        },
                        {
                            label: 'Спеціальні (СК)',
                            value: competencies.filter(c => c.type === 'sk').length,
                            onClick: () => toggleType('sk'),
                            inactive: !visibleTypes.includes('sk'),
                            title: 'Перемкнути видимість СК',
                        },
                    ]} />
                }
            />

            <div className={styles.matrixControls}>
                <MatrixSearch value={inputValue} onChange={handleSearchChange} isPending={isPending} />

                <div className={styles.matrixFilters}>
                    <button
                        className={`${styles.filterBtn} ${visibleTypes.includes('zk') ? styles.activeZk : ''}`}
                        onClick={() => toggleType('zk')}
                    >
                        ЗК
                    </button>
                    <button
                        className={`${styles.filterBtn} ${visibleTypes.includes('sk') ? styles.activeSk : ''}`}
                        onClick={() => toggleType('sk')}
                    >
                        СК
                    </button>
                </div>

                {hasSelection && (
                    <button className={styles.matrixClear} onClick={clearSelection}>
                        Очистити
                    </button>
                )}
            </div>

            <div 
                className={`${styles.matrixWrap} ${isDragging ? styles.dragging : ''}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >
                <table className={styles.matrix}>
                    <thead>
                        <tr>
                            <th className={styles.disciplineColumn}>Дисципліна</th>
                            {allVisibleComps.map(c => (
                                <th
                                    key={c.id}
                                    id={`header-${c.code}`}
                                    onClick={() => toggleCol(c.code)}
                                    className={`${styles.thClickable} ${highlightedCol === c.code || selectedCols.has(c.code) ? styles.thHighlight : ''}`}
                                >
                                    <div className={styles.thContent}>{c.code}</div>
                                </th>
                            ))}
                            <th className={styles.emptySpace}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDisciplines.map(d => (
                            <MatrixRow
                                key={d.id}
                                discipline={d}
                                columns={allVisibleComps}
                                itemsKey="competencies"
                                dotClass={getDotClass}
                                isSelected={selectedRows.has(d.id)}
                                selectedColsArray={selectedColsArray}
                                highlightedCol={highlightedCol}
                                onToggleRow={toggleRow}
                                onCellClick={handleCellClick}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
