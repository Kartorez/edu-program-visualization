import StudyPlanCanvas from '@/components/StudyPlan/StudyPlanCanvas';
import { disciplines } from '@/data/node';
import { positionNodes } from '@/utils/positionNodes';

export default function Plan() {
  const initialNodes = positionNodes(disciplines);
  return <StudyPlanCanvas initialNodes={initialNodes} />;
}
