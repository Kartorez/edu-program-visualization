'use client';

import React, { useState, useMemo } from 'react';
import Button from '@/shared/ui/Button/Button';
import styles from './AdminManage.module.scss';

export type ColumnType<T> = {
    header: string;
    render: (item: T) => React.ReactNode;
    style?: React.CSSProperties;
};

type Props<T> = {
    title: string;
    subtitle?: string;
    createLabel?: string;
    onCreateClick: () => void;
    
    // Data & Filtering
    items: T[];
    filterFn: (item: T, query: string) => boolean;
    searchPlaceholder?: string;
    
    // Table Config
    columns: ColumnType<T>[];
    
    // Pagination
    pageSize?: number;

    // Modal Config
    modal?: {
        isOpen: boolean;
        title: string;
        onClose: () => void;
        children: React.ReactNode;
        size?: 'md' | 'lg';
    };
};

export function AdminListManager<T>({
    title,
    subtitle,
    createLabel = 'Додати',
    onCreateClick,
    items,
    filterFn,
    searchPlaceholder = 'Пошук...',
    columns,
    pageSize = 10,
    modal,
}: Props<T>) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    // Filter items
    const filteredItems = useMemo(() => {
        return items.filter(item => filterFn(item, search));
    }, [items, search, filterFn]);

    // Paginate items
    const totalPages = Math.ceil(filteredItems.length / pageSize);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredItems.slice(start, start + pageSize);
    }, [filteredItems, currentPage, pageSize]);

    return (
        <div className={styles.container}>
            {/* Header section */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                <Button onClick={onCreateClick}>
                    {createLabel}
                </Button>
            </div>

            {/* List card */}
            <div className={styles.card}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.tableWrapper}>
                    {filteredItems.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span>Нічого не знайдено</span>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx} style={col.style}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((item, rowIdx) => (
                                    <tr key={rowIdx}>
                                        {columns.map((col, colIdx) => (
                                            <td key={colIdx} style={col.style}>
                                                {col.render(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationInfo}>
                            Показано {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredItems.length)} з {filteredItems.length}
                        </div>
                        <div className={styles.paginationButtons}>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={styles.pageBtn}
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={styles.pageBtn}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal portal representation */}
            {modal?.isOpen && (
                <div className={styles.modalOverlay} onClick={modal.onClose}>
                    <div
                        className={`${styles.modalContent} ${modal.size === 'lg' ? styles.modalContentLarge : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{modal.title}</h2>
                            <button className={styles.modalClose} onClick={modal.onClose}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            {modal.children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
