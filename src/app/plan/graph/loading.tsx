import { Skeleton } from '@/shared/ui';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <main className={styles.root}>
            <div className={styles.columns}>
                {[...Array(4)].map((_, year) => (
                    <div key={year} className={styles.column}>
                        <Skeleton width="300px" height="150px" borderRadius="12px" />
                        <Skeleton width="300px" height="150px" borderRadius="12px" />
                    </div>
                ))}
            </div>

            <div className={styles.toolbar}>
                <Skeleton width="100px" height="40px" borderRadius="20px" />
                <Skeleton width="100px" height="40px" borderRadius="20px" />
                <Skeleton width="100px" height="40px" borderRadius="20px" />
            </div>
        </main>
    );
}