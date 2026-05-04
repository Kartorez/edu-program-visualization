import { getPayload } from 'payload';
import config from '@payload-config';
import LearningOutcomesMatrixView from '@/components/LearningOutcomesMatrixView';
import { sortByCode } from '@/utils/sortByCode';

export const dynamic = 'force-dynamic';

export default async function Results() {
  const payload = await getPayload({ config });

  const { docs: disciplinesRaw } = await payload.find({
    collection: 'disciplines',
    limit: 1000,
    depth: 1,
  });

  const { docs: outcomesRaw } = await payload.find({
    collection: 'learning-outcomes',
    limit: 200,
  });

  const disciplines = sortByCode(
    disciplinesRaw.filter((d) => {
      const name = d.name?.toLowerCase() || '';
      const code = d.code?.toLowerCase() || '';
      return !name.includes('вк') && !code.includes('вк');
    })
  );

  const outcomes = sortByCode(outcomesRaw);

  return <LearningOutcomesMatrixView disciplines={disciplines} outcomes={outcomes} />;
}
