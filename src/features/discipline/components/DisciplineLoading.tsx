import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import styles from './DisciplineLoading.module.scss';

export function DisciplineLoading() {
  return (
    <div className={`${styles.disciplineLoading} ${styles.loading}`}>
      <div className={styles.loadingHeader}>
        <div className={styles.loadingHeaderLeft}>
          <Skeleton width={160} height={14} borderRadius="6px" className={styles.loadingHeaderCode} />
          <Skeleton width="75%" height={36} borderRadius="8px" className={styles.loadingHeaderTitle} />
          <Skeleton width="100%" height={14} borderRadius="6px" />
          <Skeleton width="85%" height={14} borderRadius="6px" className={styles.loadingHeaderDesc2} />
        </div>
        <div className={styles.loadingHeaderRight}>
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
          <Skeleton height={40} borderRadius="8px" className={styles.loadingStat} />
        </div>
      </div>

      <div className={styles.loadingGrid}>
        <div className={styles.disciplineCard}>
          <Skeleton width="55%" height={16} borderRadius="6px" className={styles.loadingCardTitle} />
          <div className={styles.loadingRows}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={20} borderRadius="6px" style={{ opacity: 1 - i * 0.1 }} />
            ))}
          </div>
        </div>

        <div className={styles.disciplineCard}>
          <Skeleton width="55%" height={16} borderRadius="6px" className={styles.loadingCardTitle} />
          <div className={styles.loadingRows}>
            <Skeleton width="40%" height={13} borderRadius="4px" />
            <div className={styles.loadingTags}>
              <Skeleton width={100} height={30} borderRadius="20px" />
              <Skeleton width={100} height={30} borderRadius="20px" />
            </div>
            <div className={styles.loadingDivider} />
            <Skeleton width="40%" height={13} borderRadius="4px" />
            <div className={styles.loadingTags}>
              <Skeleton width={100} height={30} borderRadius="20px" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.disciplineCard}>
        <div className={styles.loadingAccordionHead}>
          <Skeleton width="45%" height={18} borderRadius="6px" />
          <Skeleton width={20} height={20} variant="circle" />
        </div>
      </div>

      <div className={styles.disciplineCard}>
        <div className={styles.loadingAccordionHead}>
          <Skeleton width="50%" height={18} borderRadius="6px" />
          <Skeleton width={20} height={20} variant="circle" />
        </div>
      </div>
    </div>
  );
}
