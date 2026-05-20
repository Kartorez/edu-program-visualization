import { positionNodes } from '@/shared/lib/positionNodes';
import StudyPlanCanvas from '@/features/study-plan/components/StudyPlanCanvas';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Навчальний план',
    description: 'Візуалізація навчального плану у вигляді інтерактивного графа.',
};

export default async function GraphPage() {
    // TODO: fetch disciplines from Prisma and map to GraphDisciplineNode[]
    const initialNodes = positionNodes([]);
    return (
        <>
            <StudyPlanCanvas initialNodes={initialNodes} />
        </>
    );
}