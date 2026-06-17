import { getPayload } from 'payload';
import config from '@payload-config';
import CompetenciesMatrixView from '@/features/competency-matrix/components/CompetencyMatrixView';
import { sortByCode } from '@/shared/lib/sortByCode';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Матриця компетентностей',
  description: 'Матриця відповідності визначених Стандартом компетентностей дескрипторам НРК та дисциплінам',
};

export const dynamic = 'force-dynamic';

export default async function CompetenciesPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const payload = await getPayload({ config });

  const [{ docs: competencies }, { disciplines }] = await Promise.all([
    payload.find({ collection: 'competencies', limit: 1000 }),
    getProgramDisciplines(programId, false),
  ]);

  const sortedComps = competencies.sort((a, b) => {
    const typeOrder = { zk: 1, sk: 2 } as Record<string, number>;
    if (a.type !== b.type) return typeOrder[a.type as string] - typeOrder[b.type as string];

    const numA = parseInt((a.code as string).match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt((b.code as string).match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });

  return (
    <CompetenciesMatrixView
      disciplines={sortByCode(disciplines)}
      competencies={sortedComps}
    />
  );
}
