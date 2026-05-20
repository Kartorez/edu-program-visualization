'use client';

import { useRouter } from 'next/navigation';
import { PageHeader, StatPanel } from '@/shared/ui/PageHaeder';
import { useMatrixState, MatrixRow, MatrixSearch } from '@/features/matrix';
import styles from '@/features/matrix/components/Matrix.module.scss';

interface Props {
    disciplines: any[];
    outcomes: any[];
}

export default function LearningResultsView({ disciplines, outcomes }: Props) {
    const router = useRouter();

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
    } = useMatrixState({ disciplines, hashPrefix: '#res-' });

    return (
        <div className={styles.matrixPage}>
            <PageHeader
                code="ОПП · Комп'ютерні науки · Бакалавр"
                title="Матриця результатів навчання"
                description="Відображає які програмні результати навчання (РН) забезпечує кожна дисципліна програми."
                stats={
                    <StatPanel items={[
                        {
                            label: 'Дисциплін',
                            value: deferredSearchQuery
                                ? `${filteredDisciplines.length} з ${disciplines.length}`
                                : disciplines.length,
                            isAccent: true,
                            onClick: () => router.push('/plan/graph'),
                            title: 'Переглянути граф',
                        },
                        {
                            label: 'РН',
                            value: outcomes.length,
                        },
                    ]} />
                }
            />

            <div className={styles.matrixControls}>
                <MatrixSearch value={inputValue} onChange={handleSearchChange} isPending={isPending} />
                {hasSelection && (
                    <button className={styles.matrixClear} onClick={clearSelection}>
                        Очистити
                    </button>
                )}
            </div>

            <div className={styles.matrixWrap}>
                <table className={styles.matrix}>
                    <thead>
                        <tr>
                            <th className={styles.disciplineColumn}>Дисципліна</th>
                            {outcomes.map(o => (
                                <th
                                    key={o.id}
                                    id={`header-${o.code}`}
                                    onClick={() => toggleCol(o.code)}
                                    className={`${styles.thClickable} ${highlightedCol === o.code || selectedCols.has(o.code) ? styles.thHighlight : ''}`}
                                >
                                    <div className={styles.thContent}>{o.code}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDisciplines.map(d => (
                            <MatrixRow
                                key={d.id}
                                discipline={d}
                                columns={outcomes}
                                itemsKey="learningOutcomes"
                                dotClass="dot-rn"
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
