'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { type DisciplineInput } from '@/server/schemas/discipline.schema';
import styles from '@/shared/ui/Form/EntityForm.module.scss';

export function TopicsSection() {
    const { register, formState: { errors } } = useFormContext<DisciplineInput>();
    const { fields, append, remove } = useFieldArray<DisciplineInput>({
        name: 'topics',
    });

    return (
        <div className={styles.section}>
            <span className={styles.sectionTitle}>Теми курсу</span>
            <div className={styles.topicList}>
                {fields.map((field, index) => (
                    <div key={field.id} className={styles.topicRow}>
                        <div>
                            <input
                                type="number"
                                min={1}
                                max={12}
                                placeholder="Сем."
                                {...register(`topics.${index}.semester`, { valueAsNumber: true })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.875rem',
                                    border: `1px solid ${errors.topics?.[index]?.semester ? '#ef4444' : 'var(--color-border)'}`,
                                    borderRadius: 'var(--radius-sm)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Назва теми"
                                {...register(`topics.${index}.title`)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.875rem',
                                    border: `1px solid ${errors.topics?.[index]?.title ? '#ef4444' : 'var(--color-border)'}`,
                                    borderRadius: 'var(--radius-sm)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => remove(index)}
                            title="Видалити тему"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                className={styles.addBtn}
                onClick={() => append({ semester: 1, title: '', order: fields.length })}
            >
                + Додати тему
            </button>
        </div>
    );
}
