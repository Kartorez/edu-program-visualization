import { positionNodes } from '@/shared/lib/positionNodes';
import StudyPlanCanvas from '@/features/study-plan/components/StudyPlanCanvas';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Граф навчального плану',
  description: 'Інтерактивний граф з пререквізитами та постреквізитами дисциплін',
};

export const dynamic = 'force-dynamic';

export default async function GraphPage({
  searchParams,
}: {
  searchParams: Promise<{ semester?: string }>;
}) {
  const { disciplines: rawDisciplines } = await getProgramDisciplines();
  const initialNodes = positionNodes(rawDisciplines);
  const resolvedParams = await searchParams;
  const initialSemester = resolvedParams.semester ? parseInt(resolvedParams.semester, 10) : null;

  return (
    <StudyPlanCanvas
      initialNodes={initialNodes}
      allDisciplines={rawDisciplines}
      initialSemester={initialSemester}
    />
  );
}
