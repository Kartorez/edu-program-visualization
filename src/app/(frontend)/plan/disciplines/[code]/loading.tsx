import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from '@/components/ui/PageHeader/PageHeader.module.scss';
import './loading.scss';

export default function Loading() {
  return (
    <div className="discipline-view loading">
      { }
      <div className={styles.header}>
        <div className={styles.left}>
          <Skeleton width={150} height={20} className={styles.code} />
          <Skeleton width="80%" height={45} className={styles.title} />
          <div className="mt-4">
            <Skeleton width="100%" height={20} className="mb-2" />
            <Skeleton width="90%" height={20} className="mb-2" />
            <Skeleton width="40%" height={20} />
          </div>
        </div>
        <div className={styles.right}>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} width="220px" height="60px" borderRadius="12px" />
            ))}
          </div>
        </div>
      </div>

      <div className="discipline-view__grid">
        <div className="discipline-view__card">
          <Skeleton width="150px" height={24} className="mb-6" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width="100%" height={20} />
            ))}
          </div>
        </div>

        <div className="discipline-view__card">
          <Skeleton width="220px" height={24} className="mb-6" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <Skeleton width="100px" height={16} className="mb-3" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton width={120} height={30} borderRadius="20px" />
                <Skeleton width={120} height={30} borderRadius="20px" />
              </div>
            </div>
            <div style={{ height: '1px', background: '#f0f0f0' }} />
            <div>
              <Skeleton width="100px" height={16} className="mb-3" />
              <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton width={120} height={30} borderRadius="20px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="discipline-view__card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="180px" height={24} />
          <Skeleton width={20} height={20} variant="circle" />
        </div>
      </div>

      <div className="discipline-view__card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="220px" height={24} />
          <Skeleton width={20} height={20} variant="circle" />
        </div>
      </div>
    </div>
  );
}
