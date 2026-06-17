import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import Background from '@/shared/ui/Background/Background';
import '@/shared/styles/global.scss';
import { NODE_H, NODE_W, SEMESTER_W } from '@/shared/constants/nodeLayout';
import { SidebarProvider } from '@/shared/lib/SidebarContext';
import { Topbar } from '@/shared/ui/Sidebar/Topbar';


export const dynamic = 'force-dynamic';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {

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
          <Topbar />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
