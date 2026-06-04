import { getCompetencies } from '@/server/actions/competency.actions';
import { CompetenciesManage } from '@/features/admin/competencies';

export const dynamic = 'force-dynamic';

export default async function CompetenciesPage() {
    const rawList = await getCompetencies();
    
    // CompetencyType enum from prisma might need to be casted to Zod enum value or string,
    // let us cast them to ensure compatibility.
    const list = rawList.map(item => ({
        id: item.id,
        code: item.code,
        type: item.type === 'ZK' ? ('ЗК' as const) : ('СК' as const),
        description: item.description ?? '',
    }));

    return <CompetenciesManage initialList={list} />;
}
