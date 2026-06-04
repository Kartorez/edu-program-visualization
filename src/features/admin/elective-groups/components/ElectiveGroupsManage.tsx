'use client';

import { useState } from 'react';
import { deleteElectiveGroup } from '@/server/actions/elective-group.actions';
import { ElectiveGroupForm } from './ElectiveGroupForm';
import { type ElectiveGroupInput } from '@/server/schemas/elective-group.schema';
import { AdminListManager, type ColumnType } from '@/shared/ui/Form/AdminListManager';
import styles from '@/shared/ui/Form/AdminManage.module.scss';

type ElectiveGroupItem = ElectiveGroupInput & { id: string };

type Props = {
    initialList: ElectiveGroupItem[];
};

export function ElectiveGroupsManage({ initialList }: Props) {
    const [list, setList] = useState<ElectiveGroupItem[]>(initialList);
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: ElectiveGroupItem }>({
        isOpen: false,
        mode: 'create',
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цю вибіркову групу?')) return;
        try {
            await deleteElectiveGroup(id);
            setList(list.filter(item => item.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Помилка видалення');
        }
    };

    const columns: ColumnType<ElectiveGroupItem>[] = [
        {
            header: 'Код групи',
            render: (item) => <span style={{ fontWeight: 600 }}>{item.code}</span>,
            style: { width: '20%' },
        },
        {
            header: 'Назва групи',
            render: (item) => <span>{item.name || '—'}</span>,
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

    const filterFn = (item: ElectiveGroupItem, query: string) => {
        return (
            item.code.toLowerCase().includes(query.toLowerCase()) ||
            (item.name || '').toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <AdminListManager<ElectiveGroupItem>
            title="Вибіркові групи"
            subtitle="Управління групами вибіркових дисциплін"
            createLabel="+ Додати групу"
            onCreateClick={() => setModal({ isOpen: true, mode: 'create' })}
            items={list}
            filterFn={filterFn}
            searchPlaceholder="Пошук за кодом або назвою..."
            columns={columns}
            pageSize={10}
            modal={{
                isOpen: modal.isOpen,
                title: modal.mode === 'create' ? 'Створення вибіркової групи' : 'Редагування вибіркової групи',
                onClose: () => setModal({ isOpen: false, mode: 'create' }),
                children: (
                    <ElectiveGroupForm
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
