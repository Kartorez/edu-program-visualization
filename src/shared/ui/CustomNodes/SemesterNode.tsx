import { memo } from 'react';
import styles from './Node.module.scss';

export default memo(function SemesterNode({ title }: { title: string }) {
    return (
        <div className={`${styles.node} ${styles.semester}`}>
            <div className={styles.node__text}>
                <div className={styles.node__title}>{title}</div>
            </div>
        </div>
    );
});