import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import styles from './StudyPlanLoading.module.scss';

export function StudyPlanLoading() {
  return (
    <main className={styles.graphLoading}>
      <div className={styles.graphLoadingHeader}>
        <Skeleton width="120px" height="44px" borderRadius="12px" />
        <Skeleton width="140px" height="44px" borderRadius="999px" />
      </div>

      <div className={styles.graphLoadingRows}>
        {[...Array(4)].map((_, rowIndex) => (
          <div key={rowIndex} className={styles.graphLoadingRow}>
            <Skeleton width="100px" height="100px" borderRadius="8px" />
            
            <div className={styles.graphLoadingDisciplines}>
              {[...Array(5)].map((_, colIndex) => (
                <Skeleton key={colIndex} width="160px" height="90px" borderRadius="8px" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
