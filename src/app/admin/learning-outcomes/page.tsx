import { getLearningOutcomes } from '@/server/actions/learning-outcome.actions';
import { LearningOutcomesManage } from '@/features/admin/learning-outcomes';

export const dynamic = 'force-dynamic';

export default async function LearningOutcomesPage() {
    const rawList = await getLearningOutcomes();
    
    const list = rawList.map(item => ({
        id: item.id,
        code: item.code,
        description: item.description ?? '',
    }));

    return <LearningOutcomesManage initialList={list} />;
}
