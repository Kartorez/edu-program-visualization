import { memo } from 'react';
import styles from './Node.module.scss';

export default memo(function YearNode() {
    return <div className={styles.yearNode} />;
});
