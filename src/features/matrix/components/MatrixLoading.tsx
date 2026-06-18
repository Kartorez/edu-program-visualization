import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import styles from './MatrixLoading.module.scss';

export function MatrixLoading() {
  return (
    <div className={`${styles.matrixPage} ${styles.loading}`}>
      <div className={styles.loadingHeader}>
        <div className={styles.loadingHeaderLeft}>
          <Skeleton width={180} height={14} borderRadius="6px" className={styles.loadingHeaderCode} />
          <Skeleton width="70%" height={36} borderRadius="8px" className={styles.loadingHeaderTitle} />
          <Skeleton width="100%" height={14} borderRadius="6px" />
          <Skeleton width="80%" height={14} borderRadius="6px" className={styles.loadingHeaderDesc2} />
        </div>
        <div className={styles.loadingHeaderRight}>
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
        </div>
      </div>

      <div className={styles.loadingControls}>
        <Skeleton height={38} borderRadius="10px" className={styles.loadingSearch} />
        <Skeleton width={48} height={38} borderRadius="10px" />
        <Skeleton width={48} height={38} borderRadius="10px" />
      </div>

      <div className={styles.loadingMatrix}>
        {[...Array(8)].map((_, i) => (
          <Skeleton
            key={i}
            height={44}
            borderRadius="0"
            className={styles.loadingMatrixRow}
            style={{ opacity: 1 - i * 0.08 }}
          />
        ))}
      </div>
    </div>
  );
}
