import { Skeleton } from '@/shared/ui';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <Skeleton width={150} height={20} />
                    <Skeleton width="80%" height={45} />
                    <div className={styles.description}>
                        <Skeleton width="100%" height={20} />
                        <Skeleton width="90%" height={20} />
                        <Skeleton width="40%" height={20} />
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.rightStack}>
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} width="220px" height="60px" borderRadius="12px" />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <Skeleton width="150px" height={24} />
                    <div className={styles.cardBody}>
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} width="100%" height={20} />
                        ))}
                    </div>
                </div>

                <div className={styles.card}>
                    <Skeleton width="220px" height={24} />
                    <div className={styles.cardBody}>
                        <div className={styles.section}>
                            <Skeleton width="100px" height={16} className={styles.sectionLabel} />
                            <div className={styles.tags}>
                                <Skeleton width={120} height={30} borderRadius="20px" />
                                <Skeleton width={120} height={30} borderRadius="20px" />
                            </div>
                        </div>
                        <div className={styles.divider} />
                        <div className={styles.section}>
                            <Skeleton width="100px" height={16} className={styles.sectionLabel} />
                            <div className={styles.tags}>
                                <Skeleton width={120} height={30} borderRadius="20px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Skeleton width="180px" height={24} />
                    <Skeleton width={20} height={20} variant="circle" />
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Skeleton width="220px" height={24} />
                    <Skeleton width={20} height={20} variant="circle" />
                </div>
            </div>
        </div>
    );
}