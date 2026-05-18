import { getPayload } from 'payload';
import config from '@payload-config';
import { positionNodes } from '@/utils/positionNodes';
import ExportFlow from '@/components/StudyPlan/ExportFlow';
import '@/styles/globals.scss';
import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export default async function ExportPage() {
  const payload = await getPayload({ config });

  const { disciplines: docs } = await getProgramDisciplines();

  const initialNodes = positionNodes(docs);

  return (
    <div className="export-page">
      <ExportFlow initialNodes={initialNodes} />
    </div>
  );
}
