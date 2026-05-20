import { positionNodes } from '@/shared/lib/positionNodes';
import ExportFlow from '@/features/export-pdf/components/ExportFlow';

export default async function ExportPage() {
    // TODO: fetch disciplines from Prisma and map to GraphDisciplineNode[]
    const initialNodes = positionNodes([]);

    return (
        <div className="export-page">
            <ExportFlow initialNodes={initialNodes} />
        </div>
    );
}