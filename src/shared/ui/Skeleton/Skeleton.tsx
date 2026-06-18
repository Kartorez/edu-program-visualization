import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    variant?: 'text' | 'rect' | 'circle';
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    width,
    height,
    borderRadius,
    variant = 'rect',
    style: externalStyle,
}) => {
    const style: React.CSSProperties = {
        width,
        height,
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : '4px'),
        ...externalStyle,
    };

    return (
        <div
            className={`${styles.skeleton} ${styles[variant]} ${className}`}
            style={style}
        />
    );
};