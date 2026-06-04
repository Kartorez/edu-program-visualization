'use client';

import { useState } from 'react';
import { deleteDiscipline } from '@/server/actions/discipline.actions';
import { DisciplineForm } from './DisciplineForm';
import { type OptionType } from '@/shared/ui/Form';
import { AdminListManager, type ColumnType } from '@/shared/ui/Form/AdminListManager';
import styles from '@/shared/ui/Form/AdminManage.module.scss';

type Props = {
    initialList: any[];
    electiveGroups: OptionType[];
    competencies: OptionType[];
    learningOutcomes: OptionType[];
    disciplines: OptionType[];
};

export function DisciplinesManage({
    initialList,
    electiveGroups,
    competencies,
    learningOutcomes,
    disciplines,
}: Props) {
    const [list, setList] = useState<any[]>(initialList);
    const [modal, setModal] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; data?: any }>({
        isOpen: false,
        mode: 'create',
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цю дисципліну?')) return;
        try {
            await deleteDiscipline(id);
            setList(list.filter(item => item.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Помилка видалення');
        }
    };

    const handleEditClick = (item: any) => {
        const mappedData = {
            id: item.id,
            code: item.code,
            year: item.year,
            name: item.name,
            shortName: item.shortName ?? '',
            description: item.description ?? '',
            type: item.type,
            category: item.category,
            electiveGroupId: item.electiveGroupId ?? null,
            credits: item.credits ?? null,
            hours: item.hours ?? null,
            assessment: item.assessment ?? null,
            semesters: item.semesters ? item.semesters.map((s: any) => String(s.semester)) : [],
            topics: item.topics ? item.topics.map((t: any) => ({
                semester: t.semester,
                title: t.title,
                order: t.order,
            })) : [],
            competencyIds: item.competencies ? item.competencies.map((c: any) => c.competencyId) : [],
            learningOutcomeIds: item.outcomes ? item.outcomes.map((o: any) => o.outcomeId) : [],
            prerequisiteIds: item.asSubject ? item.asSubject.map((p: any) => p.dependsOnId) : [],
            postrequisiteIds: item.asDependency ? item.asDependency.map((p: any) => p.subjectId) : [],
        };
        setModal({ isOpen: true, mode: 'edit', data: mappedData });
    };

    const columns: ColumnType<any>[] = [
        {
            header: 'Код',
            render: (item) => <span style={{ fontWeight: 600 }}>{item.code}</span>,
            style: { width: '12%' },
        },
        {
            header: 'Назва',
            render: (item) => <span>{item.name}</span>,
        },
        {
            header: 'Рік',
            render: (item) => <span>{item.year}</span>,
            style: { width: '8%' },
        },
        {
            header: 'Тип',
            render: (item) => (
                <span className={`${styles.badge} ${item.type === 'REQUIRED' ? styles.badgePrimary : styles.badgeSecondary}`}>
                    {item.type === 'REQUIRED' ? 'Обов’язкова' : 'Вибіркова'}
                </span>
            ),
            style: { width: '12%' },
        },
        {
            header: 'Кредити',
            render: (item) => <span>{item.credits || '—'}</span>,
            style: { width: '10%' },
        },
        {
            header: 'Дії',
            render: (item) => (
                <div className={styles.actionsCell}>
                    <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEditClick(item)}
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

    const filterFn = (item: any, query: string) => {
        return (
            item.code.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <AdminListManager<any>
            title="Дисципліни"
            subtitle="Управління навчальними дисциплінами програми"
            createLabel="+ Додати дисципліну"
            onCreateClick={() => setModal({ isOpen: true, mode: 'create' })}
            items={list}
            filterFn={filterFn}
            searchPlaceholder="Пошук за кодом або назвою..."
            columns={columns}
            pageSize={10}
            modal={{
                isOpen: modal.isOpen,
                title: modal.mode === 'create' ? 'Створення дисципліни' : 'Редагування дисципліни',
                onClose: () => setModal({ isOpen: false, mode: 'create' }),
                size: 'lg',
                children: (
                    <DisciplineForm
                        mode={modal.mode}
                        initialData={modal.data}
                        electiveGroups={electiveGroups}
                        competencies={competencies}
                        learningOutcomes={learningOutcomes}
                        disciplines={disciplines}
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
