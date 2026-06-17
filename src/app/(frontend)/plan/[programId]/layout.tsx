import { SidebarProvider } from '@/shared/lib/SidebarContext';
import { DisciplinesProvider } from '@/shared/lib/DisciplinesContext';
import { Topbar } from '@/shared/ui/Sidebar/Topbar';
import { Sidebar } from '@/shared/ui/Sidebar/Sidebar';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import { notFound } from 'next/navigation';

export default async function PlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  
  // We use light=true for layout so it only fetches basic fields for Sidebar
  const { disciplines: docs } = await getProgramDisciplines(programId, true);

  if (!docs || docs.length === 0) {
    notFound();
  }

  const navLinks = [
    { match: `/plan/${programId}/graph`, label: 'Навчальний план' },
    { match: `/plan/${programId}/competencies`, label: 'Матриця компетентностей' },
    { match: `/plan/${programId}/results`, label: 'Результати навчання' },
    { match: `/plan/${programId}`, label: 'Освітня програма' },
  ];

  return (
    <SidebarProvider>
      <DisciplinesProvider disciplines={docs}>
        <Topbar logoHref="/" navLinks={navLinks} ctaHref={`/plan/${programId}/graph`} />
        <div className="app-container">
          <Sidebar sections={[
            { href: '/', label: 'Змінити програму' },
            { href: `/plan/${programId}`, label: 'Освітня програма' },
            { href: `/plan/${programId}/graph`, label: 'Граф пререквізитів' },
            { href: `/plan/${programId}/competencies`, label: 'Матриця компетентностей' },
            { href: `/plan/${programId}/results`, label: 'Матриця результатів' },
          ]} />
          <main className="main-content">
            {children}
          </main>
        </div>
      </DisciplinesProvider>
    </SidebarProvider>
  );
}
