'use client';

import { useFormContext, useController, FieldValues, Path } from 'react-hook-form';
import { ReactSelect, type OptionType } from './ReactSelect';
import styles from './FormField.module.scss';


type FormReactSelectBaseProps<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    description?: string;
    required?: boolean;
    options: OptionType[];
    placeholder?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
    isClearable?: boolean;
    isSearchable?: boolean;
    noOptionsMessage?: string;
};

type FormReactSelectSingleProps<T extends FieldValues> =
    FormReactSelectBaseProps<T> & {
        isMulti?: false;
    };

type FormReactSelectMultiProps<T extends FieldValues> =
    FormReactSelectBaseProps<T> & {
        isMulti: true;
    };

export type FormReactSelectProps<T extends FieldValues> =
    | FormReactSelectSingleProps<T>
    | FormReactSelectMultiProps<T>;


export function FormReactSelect<T extends FieldValues>(
    props: FormReactSelectProps<T>
) {
    const {
        name,
        label,
        description,
        required,
        options,
        placeholder,
        disabled,
        size,
        isClearable,
        isSearchable,
        noOptionsMessage,
    } = props;

    const { control, formState: { errors } } = useFormContext<T>();
    const { field } = useController({ name, control });

    const fieldError = errors[name];
    const errorMessage = fieldError?.message as string | undefined;
    const hasError = !!fieldError;

    return (
        <div className={styles.field}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            {description && (
                <p className={styles.description}>{description}</p>
            )}
            {props.isMulti ? (
                <ReactSelect
                    isMulti
                    options={options}
                    value={(field.value as string[]) ?? []}
                    onChange={(val) => field.onChange(val)}
                    error={hasError}
                    disabled={disabled}
                    size={size}
                    placeholder={placeholder}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    noOptionsMessage={noOptionsMessage}
                />
            ) : (
                <ReactSelect
                    options={options}
                    value={(field.value as string | null) ?? null}
                    onChange={(val) => field.onChange(val)}
                    error={hasError}
                    disabled={disabled}
                    size={size}
                    placeholder={placeholder}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    noOptionsMessage={noOptionsMessage}
                />
            )}
            {errorMessage && (
                <span className={styles.error} role="alert">
                    {errorMessage}
                </span>
            )}
        </div>
    );
}
