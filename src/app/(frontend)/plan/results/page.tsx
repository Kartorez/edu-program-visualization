import { getPayload } from 'payload';
import config from '@payload-config';
import LearningOutcomesMatrixView from '@/components/LearningOutcomesMatrixView';
import { sortByCode } from '@/utils/sortByCode';
import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Результати навчання',
  description: 'Таблиця зв\'язків між дисциплінами та очікуваними програмними результатами навчання.',
};

export default async function Results() {
  const payload = await getPayload({ config });

  const { disciplines: disciplinesRaw } = await getProgramDisciplines();

  const { docs: outcomesRaw } = await payload.find({
    collection: 'learning-outcomes',
    limit: 200,
  });

  const unique = Array.from(new Map(disciplinesRaw.map((d: any) => [String(d.id), d])).values());

  const disciplines = sortByCode(
    unique.filter((d: any) => d.type === 'required')
  );

  const outcomes = sortByCode(outcomesRaw);

  return <LearningOutcomesMatrixView disciplines={disciplines} outcomes={outcomes} />;
}
