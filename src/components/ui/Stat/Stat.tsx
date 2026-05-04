import React from 'react';
import styles from './Stat.module.scss';

interface StatProps {
  label: string;
  value: React.ReactNode;
  variant?: 'default' | 'card';
  isAccent?: boolean;
}

export default function Stat({ label, value, variant = 'default', isAccent }: StatProps) {
  return (
    <div className={`${styles.stat} ${styles[variant]}`}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${isAccent ? styles.accent : ''}`}>
        {value}
      </span>
    </div>
  );
}
