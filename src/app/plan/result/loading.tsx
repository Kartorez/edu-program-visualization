import { Skeleton } from '@/shared/ui';
import headerStyles from '@/shared/ui/PageHaeder/PageHeader.module.scss';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.root}>
            <div className={headerStyles.header}>
                <div className={headerStyles.left}>
                    <Skeleton width={180} height={20} className={headerStyles.code} />
                    <Skeleton width="60%" height={45} className={headerStyles.title} />
                    <Skeleton width="100%" height={20} className="mt-4" />
                </div>
                <div className={headerStyles.right} style={{ display: 'flex', gap: '10px' }}>
                    <Skeleton width="140px" height="80px" borderRadius="12px" />
                    <Skeleton width="80px" height="80px" borderRadius="12px" />
                    <Skeleton width="80px" height="80px" borderRadius="12px" />
                </div>
            </div>

            <div className={styles.tableWrap}>
                <div className={styles.headerRow}>
                    <div className={styles.thCode}>
                        <Skeleton width="100%" height="24px" />
                    </div>
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={styles.thDot}>
                            <Skeleton width="20px" height="20px" />
                        </div>
                    ))}
                </div>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.row}>
                        <div className={styles.tdName}>
                            <Skeleton width="90%" height={20} />
                        </div>
                        {[...Array(12)].map((_, j) => (
                            <div key={j} className={styles.tdDot}>
                                {Math.random() > 0.7 && <Skeleton width={12} height={12} borderRadius="2px" />}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}