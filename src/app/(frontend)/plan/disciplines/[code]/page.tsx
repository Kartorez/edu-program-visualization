import { getProgramDisciplines } from '@/utils/getProgramDisciplines';
import DisciplineView from '@/components/DisciplineView/DisciplineView';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const { disciplines } = await getProgramDisciplines();
  const discipline = disciplines.find(d => d.code === decodedCode);
  
  if (discipline) {
    return {
      title: `${discipline.name} (${discipline.code})`,
      description: `Детальна інформація про дисципліну ${discipline.name}, кредити, семестри та пов'язані компетентності.`,
    };
  }

  return { title: decodedCode };
}

export default async function DisciplinePage({ params }: { params: Promise<{ code: string, planId: string }> }) {
  const { code } = await params;
  const { disciplines } = await getProgramDisciplines();

  const discipline = disciplines.find(d => d.code === decodeURIComponent(code)) ?? null;

  if (!discipline) return <div>Дисципліну не знайдено</div>;

  return <DisciplineView discipline={discipline} />;
}
