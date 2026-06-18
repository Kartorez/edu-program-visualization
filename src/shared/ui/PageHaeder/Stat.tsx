import React from 'react';
import styles from './Stat.module.scss';

interface StatProps {
  label: string;
  value: React.ReactNode;
  variant?: 'default' | 'card';
  isAccent?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
  inactive?: boolean;
}

export default function Stat({ label, value, variant = 'default', isAccent, onClick, className, title, inactive }: StatProps) {
  return (
    <div
      className={`${styles.stat} ${styles[variant]} ${onClick ? styles.clickable : ''} ${inactive ? styles['is-inactive'] : ''} ${className || ''}`}
      onClick={onClick}
      title={title}
    >
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${isAccent ? styles.accent : ''}`}>
        {value}
      </span>
    </div>
  );
}
