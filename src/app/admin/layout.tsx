import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { auth } from '@/server/auth/auth';
import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/shared/lib/SidebarContext';
import { DisciplinesProvider } from '@/shared/lib/DisciplinesContext';
import { Topbar, Sidebar } from '@/shared/ui/Sidebar';
import '@/shared/styles/global.scss';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Building2,
  Users,
  ListTree,
  Layers,
  Award,
  Target,
} from 'lucide-react';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  preload: false,
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    template: '%s | Адмін · КН ВНАУ',
    default: 'Адмін-панель | КН ВНАУ',
  },
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { match: '/admin', label: 'Дашборд', icon: <LayoutDashboard size={16} /> },
  { match: '/admin/programs', label: 'Освітні програми', icon: <GraduationCap size={16} /> },
  { match: '/admin/disciplines', label: 'Дисципліни', icon: <BookOpen size={16} /> },
  { match: '/admin/departments', label: 'Кафедри', icon: <Building2 size={16} /> },
  { match: '/admin/specialties', label: 'Спеціальності', icon: <Users size={16} /> },
  { match: '/admin/elective-groups', label: 'Вибіркові групи', icon: <Layers size={16} /> },
  { match: '/admin/competencies', label: 'Компетенції', icon: <Target size={16} /> },
  { match: '/admin/learning-outcomes', label: 'Результати навч.', icon: <Award size={16} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <html lang="uk">
      <body className={`${barlowCondensed.variable} ${inter.variable}`}>
        <SessionProvider session={session}>
          <SidebarProvider>
            <DisciplinesProvider disciplines={[]}>
              <Topbar
                logoHref="/admin"
                logoLabel="Адмін-панель"
                logoAccent="Адмін"
                navLinks={ADMIN_NAV.map(({ match, label }) => ({ match, label }))}
                ctaHref={undefined}
              />
              <div className="app-container">
                <Sidebar
                  sections={ADMIN_NAV.map(({ match, label, icon }) => ({ href: match, label, icon }))}
                  sectionsLabel="Розділи"
                />
                <main className="main-content">
                  {children}
                </main>
              </div>
            </DisciplinesProvider>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
