import { memo } from 'react';
import styles from './Node.module.scss';

export default memo(function ReqList({ codes }: { codes: string[] }) {
    const columns: string[][] = [];
    for (let i = 0; i < codes.length; i += 4) {
        columns.push(codes.slice(i, i + 4));
    }

    return (
        <div className={styles.node__req}>
            {columns.map((col, idx) => (
                <div key={idx} className={styles['node__req-col']}>
                    {col.map(code => (
                        <span key={code}>{code}</span>
                    ))}
                </div>
            ))}
        </div>
    );
});