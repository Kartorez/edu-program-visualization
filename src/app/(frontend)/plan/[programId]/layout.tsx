import { DisciplinesProvider } from '@/shared/lib/DisciplinesContext';
import { Sidebar } from '@/shared/ui/Sidebar/Sidebar';
import AppTopbar from '@/shared/ui/Sidebar/AppTopbar';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import { notFound } from 'next/navigation';
import { Info, Network, Grid, Target } from 'lucide-react';


export default async function PlanLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;

  const { disciplines: docs } = await getProgramDisciplines(programId, true);

  if (!docs || docs.length === 0) {
    notFound();
  }



  return (
    <DisciplinesProvider disciplines={docs}>
      <AppTopbar />
      <div className="app-container">
          <Sidebar sections={[
            { href: `/plan/${programId}`, label: 'Освітня програма', icon: <Info size={18} /> },
            { href: `/plan/${programId}/graph`, label: 'Граф пререквізитів', icon: <Network size={18} /> },
            { href: `/plan/${programId}/competencies`, label: 'Матриця компетентностей', icon: <Grid size={18} /> },
            { href: `/plan/${programId}/results`, label: 'Матриця результатів', icon: <Target size={18} /> },
          ]} />
          <main className="main-content">
            {children}
          </main>
        </div>
    </DisciplinesProvider>
  );
}
