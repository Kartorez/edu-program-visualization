import { getPayload } from 'payload';
import config from '@payload-config';
import DisciplineView from '@/components/DisciplineView/DisciplineView';

export const dynamic = 'force-dynamic';

export default async function DisciplinePage({ params }: { params: { code: string } }) {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'disciplines',
    where: { code: { equals: params.code } },
    depth: 2,
  });

  const discipline = result.docs[0] ?? null;

  if (!discipline) return <div>Дисципліну не знайдено</div>;

  return <DisciplineView discipline={discipline} />;
}
