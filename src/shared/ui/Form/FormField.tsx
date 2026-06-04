'use client';

import {
    useFormContext,
    FieldValues,
    Path,
    type ChangeHandler,
    type RefCallBack,
} from 'react-hook-form';
import styles from './FormField.module.scss';

export type FieldRenderProps = {
    ref: RefCallBack;
    name: string;
    onChange: ChangeHandler;
    onBlur: ChangeHandler;
    disabled?: boolean;
    error: boolean;
};

type FormFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    description?: string;
    required?: boolean;
    children: (field: FieldRenderProps) => React.ReactNode;
};

export function FormField<T extends FieldValues>({
    name,
    label,
    description,
    required,
    children,
}: FormFieldProps<T>) {
    const {
        register,
        formState: { errors },
    } = useFormContext<T>();

    const { ref, onChange, onBlur, name: fieldName, disabled } = register(name);
    const fieldError = errors[name];
    const errorMessage = fieldError?.message as string | undefined;
    const hasError = !!fieldError;

    return (
        <div className={styles.field}>
            {label && (
                <label htmlFor={fieldName} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {description && (
                <p className={styles.description}>{description}</p>
            )}
            {children({
                ref,
                name: fieldName,
                onChange,
                onBlur,
                disabled,
                error: hasError,
            })}
            {errorMessage && (
                <span className={styles.error} role="alert">
                    {errorMessage}
                </span>
            )}
        </div>
    );
}