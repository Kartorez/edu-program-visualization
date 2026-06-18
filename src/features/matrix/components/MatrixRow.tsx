import { memo, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './Matrix.module.scss';

interface MatrixRowProps {
    discipline: any;
    columns: any[];
    itemsKey: string;
    dotClass: string | ((item: any) => string);
    isSelected: boolean;
    selectedColsArray: string[];
    highlightedCol: string | null;
    onToggleRow: (id: string, e: React.MouseEvent) => void;
    onCellClick?: (disciplineId: string, colCode: string) => void;
}

const MatrixRow = memo(({
    discipline,
    columns,
    itemsKey,
    dotClass,
    isSelected,
    selectedColsArray,
    highlightedCol,
    onToggleRow,
    onCellClick,
}: MatrixRowProps) => {
    const selectedColsSet = useMemo(() => new Set(selectedColsArray), [selectedColsArray]);
    const disciplineItems = discipline[itemsKey] || [];
    const params = useParams();
    const programId = params?.programId as string | undefined;
    const url = programId ? `/plan/${programId}/disciplines/${discipline.id}` : `/plan/disciplines/${discipline.id}`;

    return (
        <tr
            onClick={(e) => onToggleRow(discipline.id, e)}
            className={`${styles.matrixRow} ${isSelected ? styles.matrixRowSelected : ''}`}
        >
            <td className={styles.disciplineName}>
                <div className={styles.disciplineCellContent}>
                    <Link href={url} onClick={(e) => e.stopPropagation()} className={styles.navLink}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </Link>
                    <span className={styles.disciplineLabel}>
                        <span className={styles.codeTag}>{discipline.code}</span>
                        <span className={styles.namePart}>
                            {discipline.shortName ||
                                (discipline.name.length > 30
                                    ? discipline.name.substring(0, 27) + '...'
                                    : discipline.name)}
                        </span>
                    </span>
                </div>
            </td>

            {columns.map((col: any) => {
                const has = disciplineItems.some((item: any) =>
                    typeof item === 'string' ? item === col.id : item.id === col.id,
                );
                const isColSelected = selectedColsSet.has(col.code);
                const isHighlighted = highlightedCol === col.code;
                const dotClassName = typeof dotClass === 'function' ? dotClass(col) : dotClass;
                
                // Parse dot class mapping like "dot-zk" to styles.dotZk
                const parsedDotClass = dotClassName.startsWith('dot-') 
                    ? styles[`dot${dotClassName.slice(4).charAt(0).toUpperCase()}${dotClassName.slice(5)}`] 
                    : dotClassName;

                return (
                    <td
                        key={col.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            onCellClick?.(discipline.id, col.code);
                        }}
                        className={[
                            styles.matrixCell,
                            isColSelected || isHighlighted ? styles.matrixCellHighlight : '',
                            isSelected && (isColSelected || isHighlighted) ? styles.matrixCellIntersection : '',
                        ].join(' ')}
                    >
                        {has && <span className={parsedDotClass} />}
                    </td>
                );
            })}
            <td className={styles.emptySpace}></td>
        </tr>
    );
});

MatrixRow.displayName = 'MatrixRow';

export default MatrixRow;
