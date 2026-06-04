'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Form, FormField, Input } from '@/shared/ui/Form';
import Button from '@/shared/ui/Button/Button';
import styles from './LoginForm.module.scss';

const LoginSchema = z.object({
    email: z.string().email('Некоректний формат електронної пошти').min(1, "Електронна пошта є обов'язковою"),
    password: z.string().min(1, 'Пароль є обов’язковим'),
});

type LoginInput = z.infer<typeof LoginSchema>;

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: LoginInput) => {
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Невірна електронна адреса або пароль');
        } else {
            router.push('/admin');
            router.refresh();
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>⚙️</span>
                    </div>
                    <h1 className={styles.title}>Адмін-панель</h1>
                    <p className={styles.subtitle}>КН ВНАУ · Освітня програма</p>
                </div>

                <Form<LoginInput>
                    schema={LoginSchema}
                    defaultValues={{ email: '', password: '' }}
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    <FormField<LoginInput> name="email" label="Електронна пошта" required>
                        {(field) => (
                            <Input
                                {...field}
                                type="email"
                                placeholder="admin@example.com"
                                autoComplete="email"
                            />
                        )}
                    </FormField>

                    <FormField<LoginInput> name="password" label="Пароль" required>
                        {(field) => (
                            <Input
                                {...field}
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        )}
                    </FormField>

                    {error && (
                        <div className={styles.error} role="alert">
                            <span className={styles.errorIcon}>⚠</span>
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? <span className={styles.spinner} /> : 'Увійти'}
                    </Button>
                </Form>
            </div>

            <div className={styles.bg}>
                <div className={styles.blob1} />
                <div className={styles.blob2} />
            </div>
        </div>
    );
}
