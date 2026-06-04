'use client';

import { useState } from 'react';
import { deleteLearningOutcome } from '@/server/actions/learning-outcome.actions';
import { LearningOutcomeForm } from './LearningOutcomeForm';
import { type LearningOutcomeInput } from '@/server/schemas/learning-outcome.schema';
import { AdminListManager, type ColumnType } from '@/shared/ui/Form/AdminListManager';
import styles from '@/shared/ui/Form/AdminManage.module.scss';

type LearningOutcomeItem = LearningOutcomeInput & { id: string };

type Props = {
    initialList: LearningOutcomeItem[];
};

export function LearningOutcomesManage({ initialList }: Props) {
    const [list, setList] = useState<LearningOutcomeItem[]>(initialList);
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: LearningOutcomeItem }>({
        isOpen: false,
        mode: 'create',
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цей програмний результат навчання?')) return;
        try {
            await deleteLearningOutcome(id);
            setList(list.filter(item => item.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Помилка видалення');
        }
    };

    const columns: ColumnType<LearningOutcomeItem>[] = [
        {
            header: 'Код',
            render: (item) => <span style={{ fontWeight: 600 }}>{item.code}</span>,
            style: { width: '15%' },
        },
        {
            header: 'Опис результату навчання',
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

    const filterFn = (item: LearningOutcomeItem, query: string) => {
        return (
            item.code.toLowerCase().includes(query.toLowerCase()) ||
            (item.description || '').toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <AdminListManager<LearningOutcomeItem>
            title="Результати навчання (ПРН)"
            subtitle="Управління програмними результатами навчання"
            createLabel="+ Додати ПРН"
            onCreateClick={() => setModal({ isOpen: true, mode: 'create' })}
            items={list}
            filterFn={filterFn}
            searchPlaceholder="Пошук за кодом або описом..."
            columns={columns}
            pageSize={10}
            modal={{
                isOpen: modal.isOpen,
                title: modal.mode === 'create' ? 'Створення результату навчання' : 'Редагування результату навчання',
                onClose: () => setModal({ isOpen: false, mode: 'create' }),
                children: (
                    <LearningOutcomeForm
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
