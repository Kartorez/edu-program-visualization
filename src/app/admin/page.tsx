'use client';

import { signOut, useSession } from 'next-auth/react';

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-sans, sans-serif)' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Адмін-панель</h1>
      <p style={{ color: '#526477', marginBottom: '1.5rem' }}>
        Увійшли як: <strong>{session?.user?.email}</strong>
      </p>
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        style={{
          padding: '0.5rem 1.25rem',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
        }}
      >
        Вийти
      </button>
    </div>
  );
}
