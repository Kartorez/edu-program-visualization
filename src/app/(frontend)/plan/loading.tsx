import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function Loading() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#f8f9fa', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '40px' }}>
        {[...Array(4)].map((_, year) => (
          <div key={year} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <Skeleton width="300px" height="150px" borderRadius="12px" />
             <Skeleton width="300px" height="150px" borderRadius="12px" />
          </div>
        ))}
      </div>
      
      {}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
        <Skeleton width="100px" height="40px" borderRadius="20px" />
        <Skeleton width="100px" height="40px" borderRadius="20px" />
        <Skeleton width="100px" height="40px" borderRadius="20px" />
      </div>
    </main>
  );
}
