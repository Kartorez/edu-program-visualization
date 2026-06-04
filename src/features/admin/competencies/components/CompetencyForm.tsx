'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CompetencySchema, type CompetencyInput } from '@/server/schemas/competency.schema';
import { createCompetency, updateCompetency } from '@/server/actions/competency.actions';
import { Form, FormField, Input, TextArea, FormReactSelect } from '@/shared/ui/Form';
import Button from '@/shared/ui/Button/Button';
import styles from '@/shared/ui/Form/EntityForm.module.scss';

type Props = {
    mode: 'create' | 'edit';
    initialData?: Partial<CompetencyInput> & { id?: string };
    onSuccess?: () => void;
};

const TYPE_OPTIONS = [
    { value: 'ЗК', label: 'ЗК — Загальна компетентність' },
    { value: 'СК', label: 'СК — Спеціальна компетентність' },
];

export function CompetencyForm({ mode, initialData, onSuccess }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: CompetencyInput) => {
        setError(null);
        setLoading(true);
        try {
            if (mode === 'edit' && initialData?.id) {
                await updateCompetency(initialData.id, data);
            } else {
                await createCompetency(data);
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
        <Form<CompetencyInput>
            schema={CompetencySchema}
            defaultValues={{
                code: initialData?.code ?? '',
                type: initialData?.type ?? 'ЗК',
                description: initialData?.description ?? '',
            }}
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <div className={styles.row}>
                <FormField<CompetencyInput> name="code" label="Код" required>
                    {(field) => (
                        <Input
                            {...field}
                            placeholder="ЗК-01"
                        />
                    )}
                </FormField>

                <FormReactSelect<CompetencyInput>
                    name="type"
                    label="Тип"
                    required
                    options={TYPE_OPTIONS}
                    placeholder="Оберіть тип"
                    isClearable={false}
                />
            </div>

            <FormField<CompetencyInput> name="description" label="Опис">
                {(field) => (
                    <TextArea
                        {...field}
                        placeholder="Опис компетентності..."
                        rows={3}
                    />
                )}
            </FormField>

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

            <div className={styles.actions}>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Збереження...' : mode === 'edit' ? 'Оновити' : 'Створити'}
                </Button>
            </div>
        </Form>
    );
}
