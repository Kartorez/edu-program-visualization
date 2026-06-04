'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LearningOutcomeSchema, type LearningOutcomeInput } from '@/server/schemas/learning-outcome.schema';
import { createLearningOutcome, updateLearningOutcome } from '@/server/actions/learning-outcome.actions';
import { Form, FormField, Input, TextArea } from '@/shared/ui/Form';
import Button from '@/shared/ui/Button/Button';
import styles from '@/shared/ui/Form/EntityForm.module.scss';

type Props = {
    mode: 'create' | 'edit';
    initialData?: Partial<LearningOutcomeInput> & { id?: string };
    onSuccess?: () => void;
};

export function LearningOutcomeForm({ mode, initialData, onSuccess }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: LearningOutcomeInput) => {
        setError(null);
        setLoading(true);
        try {
            if (mode === 'edit' && initialData?.id) {
                await updateLearningOutcome(initialData.id, data);
            } else {
                await createLearningOutcome(data);
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
        <Form<LearningOutcomeInput>
            schema={LearningOutcomeSchema}
            defaultValues={{
                code: initialData?.code ?? '',
                description: initialData?.description ?? '',
            }}
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <FormField<LearningOutcomeInput> name="code" label="Код" required>
                {(field) => (
                    <Input {...field} placeholder="ПРН-01" />
                )}
            </FormField>

            <FormField<LearningOutcomeInput> name="description" label="Опис">
                {(field) => (
                    <TextArea
                        {...field}
                        placeholder="Опис програмного результату навчання..."
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
