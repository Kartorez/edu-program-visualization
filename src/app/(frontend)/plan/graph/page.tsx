import { positionNodes } from '@/utils/positionNodes';
import StudyPlanCanvas from '@/components/StudyPlan/StudyPlanCanvas';
import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Навчальний план',
  description: 'Візуалізація навчального плану у вигляді інтерактивного графа.',
};

export default async function GraphPage() {
  const { disciplines: docs } = await getProgramDisciplines();

  const initialNodes = positionNodes(docs);
  return (
    <>
      <StudyPlanCanvas initialNodes={initialNodes} allDisciplines={docs} />
    </>
  );
}
