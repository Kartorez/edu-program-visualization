import { positionNodes } from '@/shared/lib/positionNodes';
import StudyPlanCanvas from '@/features/study-plan/components/StudyPlanCanvas';
import { getDisciplinesForGraph } from '@/server/actions/discipline.actions';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Навчальний план',
    description: 'Візуалізація навчального плану у вигляді інтерактивного графа.',
};

export default async function GraphPage() {
    const disciplines = await getDisciplinesForGraph();
    const initialNodes = positionNodes(disciplines);
    return (
        <>
            <StudyPlanCanvas initialNodes={initialNodes} />
        </>
    );
}