'use client';

import Link from 'next/link';
import styles from './Button.module.scss';

type ButtonProps = {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
};

export default function Button({ href, onClick, children, className, disabled, variant = 'primary', size = 'md' }: ButtonProps) {
    const cn = [
        styles.button,
        variant === 'ghost' && styles['button--ghost'],
        size === 'sm' && styles['button--sm'],
        size === 'lg' && styles['button--lg'],
        className
    ].filter(Boolean).join(' ');

    if (href) {
        return (
            <Link href={href} className={cn}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={cn} disabled={disabled}>
            {children}
        </button>
    );
}