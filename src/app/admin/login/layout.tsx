import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Адмін · КН ВНАУ',
    default: 'Адмін-панель | КН ВНАУ',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
