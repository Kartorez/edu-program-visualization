import { Skeleton } from '@/components/ui/Skeleton/Skeleton';
import styles from '@/components/ui/PageHeader.module.scss';
import './loading.scss';

export default function Loading() {
  return (
    <div className="matrix-page loading">
      <div className={styles.header}>
        <div className={styles.left}>
          <Skeleton width={180} height={20} className={styles.code} />
          <Skeleton width="60%" height={45} className={styles.title} />
          <Skeleton width="100%" height={20} className="mt-4" />
        </div>
        <div className={styles.right} style={{ display: 'flex', gap: '10px' }}>
           <Skeleton width="140px" height="80px" borderRadius="12px" />
           <Skeleton width="80px" height="80px" borderRadius="12px" />
           <Skeleton width="80px" height="80px" borderRadius="12px" />
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          <Skeleton width="250px" height="50px" />
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} width="50px" height="50px" />
          ))}
        </div>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: '1px solid #f9f9f9' }}>
            <div style={{ padding: '10px 14px', width: '250px' }}>
              <Skeleton width="90%" height={20} />
            </div>
            {[...Array(12)].map((_, j) => (
              <div key={j} style={{ width: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {Math.random() > 0.7 && <Skeleton width={12} height={12} borderRadius="2px" />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
