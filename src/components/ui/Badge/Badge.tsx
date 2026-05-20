'use client';
import React from 'react';
import styles from './Badge.module.scss';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | `previous`
  | 'zk'
  | 'sk'
  | 'rn'
  | `next`
  | 'code';

export type BadgeShape = 'pill' | 'rect';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  onClick?: () => void;
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  shape = 'rect',
  className,
}: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], styles[shape], className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
