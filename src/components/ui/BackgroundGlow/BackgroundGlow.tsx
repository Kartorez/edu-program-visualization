'use client';
import { usePathname } from 'next/navigation';
import styles from './BackgroundGlow.module.scss';

export function BackgroundGlow() {
  const pathname = usePathname();

  if (pathname === '/export' || pathname === '/plan/graph') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.glow} ${styles['glow--1']}`} />
      <div className={`${styles.glow} ${styles['glow--2']}`} />
      <div className={`${styles.glow} ${styles['glow--3']}`} />
    </div>
  );
}
