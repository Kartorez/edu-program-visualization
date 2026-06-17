import { positionNodes } from '@/shared/lib/positionNodes';
import ExportFlow from '@/features/export-pdf/components/ExportFlow';
import '@/shared/styles/global.scss';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';

export const dynamic = 'force-dynamic';

export default async function ExportPage() {
  const { disciplines: rawDisciplines } = await getProgramDisciplines();
  const initialNodes = positionNodes(rawDisciplines);

  return <ExportFlow initialNodes={initialNodes} />;
}
