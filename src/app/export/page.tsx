import { positionNodes } from '@/shared/lib/positionNodes';
import ExportFlow from '@/features/export-pdf/components/ExportFlow';
import { getDisciplinesForGraph } from '@/server/actions/discipline.actions';

export default async function ExportPage() {
    const disciplines = await getDisciplinesForGraph();
    const initialNodes = positionNodes(disciplines);

    return (
        <div className="export-page">
            <ExportFlow initialNodes={initialNodes} />
        </div>
    );
}