import { getPayload } from 'payload';
import config from '@payload-config';
import DisciplineView from '@/components/DisciplineView/DisciplineView';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code);
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'disciplines',
    where: { code: { equals: decodedCode } },
    depth: 0,
    limit: 1,
  });
  
  if (result.docs.length > 0) {
    const discipline = result.docs[0];
    return {
      title: `${discipline.name} (${discipline.code})`,
      description: `Детальна інформація про дисципліну ${discipline.name}, кредити, семестри та пов'язані компетентності.`,
    };
  }

  return { title: decodedCode };
}

export default async function DisciplinePage({ params }: { params: Promise<{ code: string, planId: string }> }) {
  const { code, planId } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'disciplines',
    where: { 
      code: { equals: decodeURIComponent(code) }
    },
    depth: 2,
  });

  const discipline = result.docs[0] ?? null;

  if (!discipline) return <div>Дисципліну не знайдено</div>;

  return <DisciplineView discipline={discipline} />;
}
