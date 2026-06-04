'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DisciplineSchema, type DisciplineInput } from '@/server/schemas/discipline.schema';
import { createDiscipline, updateDiscipline } from '@/server/actions/discipline.actions';
import {
    Form,
    FormField,
    Input,
    TextArea,
    FormReactSelect,
    type OptionType,
} from '@/shared/ui/Form';
import Button from '@/shared/ui/Button/Button';
import styles from '@/shared/ui/Form/EntityForm.module.scss';
import { TopicsSection } from './TopicsSection';

// ─── Типи пропсів ───────────────────────────────────────────

type Props = {
    mode: 'create' | 'edit';
    initialData?: Partial<DisciplineInput> & { id?: string };
    /** Список існуючих вибіркових груп для селекту */
    electiveGroups?: OptionType[];
    /** Список компетентностей для мультиселекту */
    competencies?: OptionType[];
    /** Список результатів навчання для мультиселекту */
    learningOutcomes?: OptionType[];
    /** Список дисциплін (для пре/пост-реквізитів) */
    disciplines?: OptionType[];
    onSuccess?: () => void;
};

// ─── Константи ───────────────────────────────────────────────

const TYPE_OPTIONS: OptionType[] = [
    { value: 'REQUIRED', label: "Обов'язкова" },
    { value: 'ELECTIVE', label: 'Вибіркова' },
];

const CATEGORY_OPTIONS: OptionType[] = [
    { value: 'STANDARD', label: 'Стандартна' },
    { value: 'PRACTICE', label: 'Практика' },
    { value: 'THESIS', label: 'Курсова / Дипломна' },
];

const ASSESSMENT_OPTIONS: OptionType[] = [
    { value: 'EXAM', label: 'Екзамен' },
    { value: 'CREDIT', label: 'Залік' },
    { value: 'EXAM_CREDIT', label: 'Екзамен + Залік' },
];

const SEMESTER_OPTIONS: OptionType[] = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} семестр`,
}));

// ─── Головний компонент ──────────────────────────────────────

export function DisciplineForm({
    mode,
    initialData,
    electiveGroups = [],
    competencies = [],
    learningOutcomes = [],
    disciplines = [],
    onSuccess,
}: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Фільтруємо поточну дисципліну з пре/пост-реквізитів
    const prerequisiteOptions = disciplines.filter(
        (d) => d.value !== initialData?.id
    );

    const handleSubmit = async (data: DisciplineInput) => {
        setError(null);
        setLoading(true);
        try {
            const payload = {
                ...data,
                semesters: data.semesters.map(Number),
            };

            if (mode === 'edit' && initialData?.id) {
                await updateDiscipline(initialData.id, payload);
            } else {
                await createDiscipline(payload);
            }
            onSuccess?.();
            router.refresh();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Помилка збереження');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form<DisciplineInput>
            schema={DisciplineSchema}
            defaultValues={{
                code: initialData?.code ?? '',
                year: initialData?.year ?? new Date().getFullYear(),
                name: initialData?.name ?? '',
                shortName: initialData?.shortName ?? '',
                description: initialData?.description ?? '',
                type: initialData?.type ?? 'REQUIRED',
                category: initialData?.category ?? 'STANDARD',
                electiveGroupId: initialData?.electiveGroupId ?? null,
                credits: initialData?.credits ?? null,
                hours: initialData?.hours ?? null,
                assessment: initialData?.assessment ?? null,
                semesters: initialData?.semesters ?? [],
                topics: initialData?.topics ?? [],
                competencyIds: initialData?.competencyIds ?? [],
                learningOutcomeIds: initialData?.learningOutcomeIds ?? [],
                prerequisiteIds: initialData?.prerequisiteIds ?? [],
                postrequisiteIds: initialData?.postrequisiteIds ?? [],
            }}
            onSubmit={handleSubmit}
            className={styles.form}
        >
            {/* ── Основне ─────────────────────────── */}
            <div className={styles.row}>
                <FormField<DisciplineInput> name="code" label="Код" required>
                    {(field) => <Input {...field} placeholder="ВБ-101" />}
                </FormField>

                <FormField<DisciplineInput> name="year" label="Рік" required>
                    {(field) => (
                        <Input
                            {...field}
                            type="number"
                            min={2000}
                            max={2100}
                            placeholder="2025"
                        />
                    )}
                </FormField>
            </div>

            <FormField<DisciplineInput> name="name" label="Назва" required>
                {(field) => <Input {...field} placeholder="Назва дисципліни" />}
            </FormField>

            <div className={styles.row}>
                <FormField<DisciplineInput> name="shortName" label="Скорочена назва">
                    {(field) => <Input {...field} placeholder="Скор. назва" />}
                </FormField>

                <FormReactSelect<DisciplineInput>
                    name="type"
                    label="Тип"
                    required
                    options={TYPE_OPTIONS}
                    isClearable={false}
                />
            </div>

            <FormField<DisciplineInput> name="description" label="Опис">
                {(field) => (
                    <TextArea {...field} placeholder="Опис дисципліни..." rows={3} />
                )}
            </FormField>

            {/* ── Класифікація ────────────────────── */}
            <div className={styles.section}>
                <span className={styles.sectionTitle}>Класифікація</span>

                <div className={styles.row}>
                    <FormReactSelect<DisciplineInput>
                        name="category"
                        label="Категорія"
                        options={CATEGORY_OPTIONS}
                        isClearable={false}
                    />

                    <FormReactSelect<DisciplineInput>
                        name="electiveGroupId"
                        label="Група вибіркових"
                        options={electiveGroups}
                        placeholder="Без групи"
                    />
                </div>
            </div>

            {/* ── Навантаження ─────────────────────── */}
            <div className={styles.section}>
                <span className={styles.sectionTitle}>Навантаження</span>

                <div className={styles.row}>
                    <FormField<DisciplineInput> name="credits" label="Кредити">
                        {(field) => (
                            <Input {...field} type="number" min={1} placeholder="5" />
                        )}
                    </FormField>

                    <FormField<DisciplineInput> name="hours" label="Години">
                        {(field) => (
                            <Input {...field} type="number" min={1} placeholder="150" />
                        )}
                    </FormField>
                </div>

                <div className={styles.row}>
                    <FormReactSelect<DisciplineInput>
                        name="assessment"
                        label="Форма контролю"
                        options={ASSESSMENT_OPTIONS}
                        placeholder="Не обрано"
                    />

                    <FormReactSelect<DisciplineInput>
                        name="semesters"
                        label="Семестри"
                        isMulti
                        options={SEMESTER_OPTIONS}
                        placeholder="Оберіть семестри"
                    />
                </div>
            </div>

            {/* ── Теми ────────────────────────────── */}
            <TopicsSection />

            {/* ── Зв'язки M:N ─────────────────────── */}
            <div className={styles.section}>
                <span className={styles.sectionTitle}>Зв'язки</span>

                <FormReactSelect<DisciplineInput>
                    name="competencyIds"
                    label="Компетентності"
                    isMulti
                    options={competencies}
                    placeholder="Оберіть компетентності..."
                />

                <FormReactSelect<DisciplineInput>
                    name="learningOutcomeIds"
                    label="Результати навчання"
                    isMulti
                    options={learningOutcomes}
                    placeholder="Оберіть результати навчання..."
                />
            </div>

            {/* ── Пре/пост-реквізити ──────────────── */}
            <div className={styles.section}>
                <span className={styles.sectionTitle}>Реквізити</span>

                <FormReactSelect<DisciplineInput>
                    name="prerequisiteIds"
                    label="Пререквізити"
                    description="Дисципліни, які потрібно пройти перед цією"
                    isMulti
                    options={prerequisiteOptions}
                    placeholder="Оберіть пререквізити..."
                />

                <FormReactSelect<DisciplineInput>
                    name="postrequisiteIds"
                    label="Постреквізити"
                    description="Дисципліни, для яких ця є пререквізитом"
                    isMulti
                    options={prerequisiteOptions}
                    placeholder="Оберіть постреквізити..."
                />
            </div>

            {/* ── Дії ─────────────────────────────── */}
            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

            <div className={styles.actions}>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Збереження...' : mode === 'edit' ? 'Оновити' : 'Створити'}
                </Button>
            </div>
        </Form>
    );
}
