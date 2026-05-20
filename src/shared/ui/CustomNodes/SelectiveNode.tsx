import { memo } from 'react';
import styles from './Node.module.scss';

export default memo(function SelectiveNode({ code }: { code: string }) {
    return (
        <div className={`${styles.node} ${styles.selective}`}>
            <div className={styles.node__text}>
                <div className={styles.node__code}>{code}</div>
            </div>
        </div>
    );
});