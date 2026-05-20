import styles from './Marque.module.scss';
import type { SidebarDiscipline } from '@/shared/lib/DisciplinesContext';

const splitIntoRows = (items: SidebarDiscipline[], rows: number): SidebarDiscipline[][] => {
    const result: SidebarDiscipline[][] = Array.from({ length: rows }, () => []);
    items.forEach((item, i) => result[i % rows].push(item));
    return result;
};

const ROWS = 2;
const TRACK_MOD = ['--left', '--right'] as const;

export default function Marquee({ disciplines }: { disciplines: SidebarDiscipline[] }) {
    const rows = splitIntoRows(disciplines, ROWS);

    return (
        <div className={styles['marquee-section']}>
            {rows.map((row, ri) => {
                const doubled = [...row, ...row];
                const mod = TRACK_MOD[ri] ?? '--left';
                return (
                    <div key={ri} className={styles['marquee-row']}>
                        <div className={`${styles['marquee-track']} ${styles[`marquee-track${mod}`]}`}>
                            {doubled.map((item, ii) => (
                                <span key={ii} className={styles['marquee-item']}>
                                    <span className={styles[`chip-code--${item.code?.startsWith('ВК') ? 'vk' : 'ok'}`]}>
                                        {item.code}
                                    </span>
                                    <span className={styles['chip-name']}>— {item.shortName ?? item.name}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}