import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import { getPayload } from 'payload';
import config from '@payload-config';
import { SidebarProvider } from '@/context/SidebarContext';
import { DisciplinesProvider } from '@/context/DisciplinesContext';
import { Topbar } from '@/components/Sidebar/Topbar';
import { NODE_H, NODE_W, SEMESTER_W } from '@/constants/nodeLayout';
import '@/styles/globals.scss';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import NextTopLoader from 'nextjs-toploader';
import { BackgroundGlow } from '@/components/ui/BackgroundGlow/BackgroundGlow';

export const dynamic = 'force-dynamic';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    template: '%s | КН ВНАУ',
    default: 'Освітня програма | КН ВНАУ',
  },
  description: 'Інтерактивна візуалізація освітньої програми, матриць компетентностей та результатів навчання кафедри Комп\'ютерних наук ВНАУ.',
  keywords: ['ВНАУ', 'Освітня програма', 'Комп\'ютерні науки', 'Навчальний план', 'Матриця компетентностей'],
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

import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { disciplines: docs } = await getProgramDisciplines();

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
        <BackgroundGlow />
        <SidebarProvider>
          <DisciplinesProvider disciplines={docs}>
            <Topbar />
            <div className="app-container">
              <Sidebar />
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
