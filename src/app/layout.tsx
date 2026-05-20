import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { SidebarProvider } from '@/shared/lib/SidebarContext';
import { DisciplinesProvider } from '@/shared/lib/DisciplinesContext';
import { Topbar, Sidebar } from '@/shared/ui/Sidebar';
import { Background } from '@/shared/ui';
import { NODE_H, NODE_W, SEMESTER_W } from '@/shared/constants/nodeLayout';
import '@/shared/styles/global.scss';
import NextTopLoader from 'nextjs-toploader';
import { headers } from 'next/headers';
import {
  BookOpen,
  Network,
  Target,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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
    template: '%s | КН ВНАУ',
    default: 'Освітня програма | КН ВНАУ',
  },
  description:
    "Інтерактивна візуалізація освітньої програми, матриць компетентностей та результатів навчання кафедри Комп'ютерних наук ВНАУ.",
  keywords: ['ВНАУ', 'Освітня програма', "Комп'ютерні науки", 'Навчальний план', 'Матриця компетентностей'],
  openGraph: {
    title: 'Освітня програма | КН ВНАУ',
    description: 'Інтерактивна візуалізація освітньої програми, матриць компетентностей та результатів навчання.',
    url: 'https://kn-vnau.edu.ua',
    siteName: 'КН ВНАУ',
    locale: 'uk_UA',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
};

const PUBLIC_NAV = [
  { match: '/plan/graph', label: 'Навчальний план', icon: <Network size={16} /> },
  { match: '/plan/competencies', label: 'Матриця комп.', icon: <Target size={16} /> },
  { match: '/plan/results', label: 'Результати навч.', icon: <Award size={16} /> },
  { match: '/plan', label: 'Про програму', icon: <BookOpen size={16} /> },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');

  // For admin routes — skip heavy data fetch and app chrome entirely
  if (isAdmin) {
    return (
      <html lang="uk">
        <body className={`${barlowCondensed.variable} ${inter.variable}`}>
          {children}
        </body>
      </html>
    );
  }

  // TODO: replace with Prisma fetch once program selection is wired up
  const docs: any[] = [];

  return (
    <html
      lang="uk"
      data-scroll-behavior="smooth"
      style={
        {
          '--node-w': `${NODE_W}px`,
          '--node-h': `${NODE_H}px`,
          '--semester-w': `${SEMESTER_W}px`,
        } as React.CSSProperties
      }
    >
      <body className={`${barlowCondensed.variable} ${inter.variable}`}>
        <NextTopLoader
          color="var(--color-primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--color-primary),0 0 5px var(--color-primary)"
        />
        <Background />
        <SidebarProvider>
          <DisciplinesProvider disciplines={docs}>
            <Topbar
              navLinks={PUBLIC_NAV}
              ctaHref="/plan/graph"
              ctaLabel="Навчальний план"
            />
            <div className="app-container">
              <Sidebar sections={PUBLIC_NAV.map(({ match, label, icon }) => ({ href: match, label, icon }))} />
              <main className="main-content">
                {children}
              </main>
            </div>
          </DisciplinesProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}