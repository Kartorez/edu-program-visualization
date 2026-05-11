import { getPayload } from 'payload';
import config from '@payload-config';
import { positionNodes } from '@/utils/positionNodes';
import StudyPlanCanvas from '@/components/StudyPlan/StudyPlanCanvas';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Навчальний план',
  description: 'Візуалізація навчального плану у вигляді інтерактивного графа.',
};

export default async function GraphPage() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'disciplines',
    limit: 1000,
    depth: 0,
  });

  const initialNodes = positionNodes(docs);
  return (
    <>
      <StudyPlanCanvas initialNodes={initialNodes} allDisciplines={docs} />
    </>
  );
}
