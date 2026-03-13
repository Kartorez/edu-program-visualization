import { disciplines } from '@/data/node';
import { positionNodes } from '@/utils/positionNodes';
import ExportFlow from '@/components/StudyPlan/ExportFlow';

export default function ExportPage() {
  const nodes = positionNodes(disciplines);
  return <ExportFlow initialNodes={nodes} />;
}
