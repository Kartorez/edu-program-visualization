import styles from './Input.module.scss';

type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
    error?: boolean;
    size?: 'sm' | 'md';
    ref?: React.Ref<HTMLInputElement>;
};

export function Input({
    ref,
    error,
    size = 'md',
    className,
    ...props
}: InputProps) {
    const cn = [
        styles.input,
        error && styles['input--error'],
        size === 'sm' && styles['input--sm'],
        className,
    ].filter(Boolean).join(' ');

    return <input ref={ref} className={cn} {...props} />;
}