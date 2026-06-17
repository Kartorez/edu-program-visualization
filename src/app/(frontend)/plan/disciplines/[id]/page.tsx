import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import DisciplineView from '@/features/discipline-view/components/DisciplineView';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const { disciplines } = await getProgramDisciplines();
  const doc = disciplines.find((d: any) => d.id === decodedId);

  if (!doc) {
    return { title: 'Дисципліна не знайдена' };
  }

  return {
    title: doc.name,
    description: doc.description || `Робоча програма дисципліни ${doc.name}`,
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const { disciplines } = await getProgramDisciplines();

  const discipline = disciplines.find((d: any) => d.id === decodedId);

  if (!discipline) {
    notFound();
  }

  return <DisciplineView discipline={discipline} />;
}
