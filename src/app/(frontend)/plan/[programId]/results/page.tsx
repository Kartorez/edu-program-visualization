import { getPayload } from 'payload';
import config from '@payload-config';
import LearningResultsView from '@/features/learning-results/components/LearningResultsView';
import { sortByCode } from '@/shared/lib/sortByCode';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Матриця результатів навчання',
  description: 'Матриця забезпечення програмних результатів навчання (ПРН) відповідними компонентами освітньої програми',
};

export const dynamic = 'force-dynamic';

export default async function LearningOutcomesPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const payload = await getPayload({ config });

  const [{ docs: outcomes }, { disciplines }] = await Promise.all([
    payload.find({ collection: 'learning-outcomes', limit: 200, pagination: false }),
    getProgramDisciplines(programId, false),
  ]);

  const sortedOutcomes = outcomes.sort((a, b) => {
    const numA = parseInt((a.code as string).match(/\d+/)?.[0] || '0', 10);
    const numB = parseInt((b.code as string).match(/\d+/)?.[0] || '0', 10);
    return numA - numB;
  });

  const uniqueDisciplines = Array.from(new Map(disciplines.map((d: any) => [String(d.id), d])).values()) as any[];
  const requiredDisciplines = uniqueDisciplines.filter((d: any) => d.type === 'required');

  return (
    <LearningResultsView
      disciplines={sortByCode(requiredDisciplines)}
      outcomes={sortedOutcomes}
    />
  );
}
