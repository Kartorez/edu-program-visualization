import React from 'react';
import styles from './StatPanel.module.scss';
import Stat from './Stat';

export interface StatPanelItem {
    label: string;
    value: React.ReactNode;
    variant?: 'default' | 'card';
    isAccent?: boolean;
    onClick?: () => void;
    title?: string;
    className?: string;
}

interface StatPanelProps {
    items: StatPanelItem[];
}

export function StatPanel({ items }: StatPanelProps) {
    return (
        <div className={styles.root}>
            {items.map(({ label, ...statProps }) => (
                <Stat key={label} label={label} {...statProps} />
            ))}
        </div>
    );
}
