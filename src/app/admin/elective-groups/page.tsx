import { getElectiveGroups } from '@/server/actions/elective-group.actions';
import { ElectiveGroupsManage } from '@/features/admin/elective-groups';

export const dynamic = 'force-dynamic';

export default async function ElectiveGroupsPage() {
    const rawList = await getElectiveGroups();
    
    const list = rawList.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name ?? '',
    }));

    return <ElectiveGroupsManage initialList={list} />;
}
