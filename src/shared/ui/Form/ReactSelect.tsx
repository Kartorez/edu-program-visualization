'use client';

import RSelect from 'react-select';
import styles from './ReactSelect.module.scss';

// ─── Типи ────────────────────────────────────────────────────

export type OptionType = {
    value: string;
    label: string;
};

type ReactSelectBaseProps = {
    options: OptionType[];
    placeholder?: string;
    error?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md';
    className?: string;
    isClearable?: boolean;
    isSearchable?: boolean;
    noOptionsMessage?: string;
};

type SingleSelectProps = ReactSelectBaseProps & {
    isMulti?: false;
    value: string | null;
    onChange: (value: string | null) => void;
};

type MultiSelectProps = ReactSelectBaseProps & {
    isMulti: true;
    value: string[];
    onChange: (value: string[]) => void;
};

export type ReactSelectProps = SingleSelectProps | MultiSelectProps;

// ─── Компонент ───────────────────────────────────────────────

export function ReactSelect(props: ReactSelectProps) {
    const {
        options,
        placeholder = 'Оберіть...',
        error = false,
        disabled = false,
        size = 'md',
        className,
        isClearable = true,
        isSearchable = true,
        noOptionsMessage = 'Нічого не знайдено',
    } = props;

    const wrapperCn = [
        styles.wrapper,
        error && styles['wrapper--error'],
        size === 'sm' && styles['wrapper--sm'],
        className,
    ].filter(Boolean).join(' ');

    if (props.isMulti) {
        const selectedOptions = options.filter((opt) =>
            props.value.includes(opt.value)
        );

        return (
            <div className={wrapperCn}>
                <RSelect<OptionType, true>
                    isMulti
                    classNamePrefix="rs"
                    options={options}
                    value={selectedOptions}
                    onChange={(newValue) => {
                        props.onChange(
                            newValue ? newValue.map((v) => v.value) : []
                        );
                    }}
                    placeholder={placeholder}
                    isDisabled={disabled}
                    isClearable={isClearable}
                    isSearchable={isSearchable}
                    noOptionsMessage={() => noOptionsMessage}
                    closeMenuOnSelect={false}
                />
            </div>
        );
    }

    const selectedOption =
        options.find((opt) => opt.value === props.value) ?? null;

    return (
        <div className={wrapperCn}>
            <RSelect<OptionType, false>
                classNamePrefix="rs"
                options={options}
                value={selectedOption}
                onChange={(newValue) => {
                    props.onChange(newValue ? newValue.value : null);
                }}
                placeholder={placeholder}
                isDisabled={disabled}
                isClearable={isClearable}
                isSearchable={isSearchable}
                noOptionsMessage={() => noOptionsMessage}
            />
        </div>
    );
}
