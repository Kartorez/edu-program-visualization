import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import DisciplineView from '@/features/discipline-view/components/DisciplineView';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programId: string; id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const { disciplines } = await getProgramDisciplines(resolvedParams.programId, false);
  const doc = disciplines.find((d: any) => String(d.id) === decodedId);

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
  params: Promise<{ programId: string; id: string }>;
}) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const { disciplines } = await getProgramDisciplines(resolvedParams.programId, false);
  const doc = disciplines.find((d: any) => String(d.id) === decodedId);

  if (!doc) {
    notFound();
  }

  return <DisciplineView discipline={doc} programId={resolvedParams.programId} />;
}
