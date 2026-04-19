import { getPayload } from 'payload';
import config from '@payload-config';
import { positionNodes } from '@/utils/positionNodes';
import ExportFlow from '@/components/StudyPlan/ExportFlow';
import '@/styles/globals.scss';

export default async function ExportPage() {
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'disciplines',
    limit: 1000,
    depth: 0,
  });

  const initialNodes = positionNodes(docs);

  return (
    <div className="export-page">
      <ExportFlow initialNodes={initialNodes} />
    </div>
  );
}
