import React from 'react';
import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
    code?: string;
    title: string;
    description?: string;
    stats?: React.ReactNode;
}

export default function PageHeader({ code, title, description, stats }: PageHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.left}>
                {code && <div className={styles.code}>{code}</div>}
                <h1 className={styles.title}>{title}</h1>
                {description && <p className={styles.description}>{description}</p>}
            </div>
            {stats && (
                <div className={styles.right}>
                    {stats}
                </div>
            )}
        </div>
    );
}