'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ElectiveGroupSchema, type ElectiveGroupInput } from '@/server/schemas/elective-group.schema';
import { createElectiveGroup, updateElectiveGroup } from '@/server/actions/elective-group.actions';
import { Form, FormField, Input } from '@/shared/ui/Form';
import Button from '@/shared/ui/Button/Button';
import styles from '@/shared/ui/Form/EntityForm.module.scss';

type Props = {
    mode: 'create' | 'edit';
    initialData?: Partial<ElectiveGroupInput> & { id?: string };
    onSuccess?: () => void;
};

export function ElectiveGroupForm({ mode, initialData, onSuccess }: Props) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: ElectiveGroupInput) => {
        setError(null);
        setLoading(true);
        try {
            if (mode === 'edit' && initialData?.id) {
                await updateElectiveGroup(initialData.id, data);
            } else {
                await createElectiveGroup(data);
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
        <Form<ElectiveGroupInput>
            schema={ElectiveGroupSchema}
            defaultValues={{
                code: initialData?.code ?? '',
                name: initialData?.name ?? '',
            }}
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <div className={styles.row}>
                <FormField<ElectiveGroupInput> name="code" label="Код групи" required>
                    {(field) => (
                        <Input {...field} placeholder="ВБ-1" />
                    )}
                </FormField>

                <FormField<ElectiveGroupInput> name="name" label="Назва">
                    {(field) => (
                        <Input {...field} placeholder="Назва вибіркової групи" />
                    )}
                </FormField>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

            <div className={styles.actions}>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Збереження...' : mode === 'edit' ? 'Оновити' : 'Створити'}
                </Button>
            </div>
        </Form>
    );
}
