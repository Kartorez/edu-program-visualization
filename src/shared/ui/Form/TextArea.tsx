import styles from './TextArea.module.scss';

type TextAreaProps = React.ComponentPropsWithoutRef<'textarea'> & {
    error?: boolean;
    size?: 'sm' | 'md';
    ref?: React.Ref<HTMLTextAreaElement>;
};

export function TextArea({
    ref,
    error,
    size = 'md',
    className,
    rows = 4,
    ...props
}: TextAreaProps) {
    const cn = [
        styles.textarea,
        error && styles['textarea--error'],
        size === 'sm' && styles['textarea--sm'],
        className,
    ].filter(Boolean).join(' ');

    return <textarea ref={ref} className={cn} rows={rows} {...props} />;
}