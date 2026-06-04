'use client';

import { useState } from 'react';
import { deleteCompetency } from '@/server/actions/competency.actions';
import { CompetencyForm } from './CompetencyForm';
import { type CompetencyInput } from '@/server/schemas/competency.schema';
import { AdminListManager, type ColumnType } from '@/shared/ui/Form/AdminListManager';
import styles from '@/shared/ui/Form/AdminManage.module.scss';

type CompetencyItem = CompetencyInput & { id: string };

type Props = {
    initialList: CompetencyItem[];
};

export function CompetenciesManage({ initialList }: Props) {
    const [list, setList] = useState<CompetencyItem[]>(initialList);
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: CompetencyItem }>({
        isOpen: false,
        mode: 'create',
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цю компетенцію?')) return;
        try {
            await deleteCompetency(id);
            setList(list.filter(item => item.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Помилка видалення');
        }
    };

    const columns: ColumnType<CompetencyItem>[] = [
        {
            header: 'Код',
            render: (item) => <span style={{ fontWeight: 600 }}>{item.code}</span>,
            style: { width: '15%' },
        },
        {
            header: 'Тип',
            render: (item) => (
                <span className={`${styles.badge} ${item.type === 'ЗК' ? styles.badgePrimary : styles.badgeSecondary}`}>
                    {item.type}
                </span>
            ),
            style: { width: '15%' },
        },
        {
            header: 'Опис',
            render: (item) => <span style={{ color: '#64748b' }}>{item.description || '—'}</span>,
        },
        {
            header: 'Дії',
            render: (item) => (
                <div className={styles.actionsCell}>
                    <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => setModal({ isOpen: true, mode: 'edit', data: item })}
                    >
                        Редагувати
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(item.id)}
                    >
                        Видалити
                    </button>
                </div>
            ),
            style: { textAlign: 'right', width: '180px' },
        },
    ];

    const filterFn = (item: CompetencyItem, query: string) => {
        return (
            item.code.toLowerCase().includes(query.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <AdminListManager<CompetencyItem>
            title="Компетенції"
            subtitle="Управління загальними та спеціальними компетенціями"
            createLabel="+ Додати компетенцію"
            onCreateClick={() => setModal({ isOpen: true, mode: 'create' })}
            items={list}
            filterFn={filterFn}
            searchPlaceholder="Пошук за кодом або описом..."
            columns={columns}
            pageSize={10}
            modal={{
                isOpen: modal.isOpen,
                title: modal.mode === 'create' ? 'Створення компетенції' : 'Редагування компетенції',
                onClose: () => setModal({ isOpen: false, mode: 'create' }),
                children: (
                    <CompetencyForm
                        mode={modal.mode}
                        initialData={modal.data}
                        onSuccess={() => {
                            setModal({ isOpen: false, mode: 'create' });
                            window.location.reload();
                        }}
                    />
                ),
            }}
        />
    );
}
