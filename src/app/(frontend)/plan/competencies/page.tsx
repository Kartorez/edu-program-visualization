import { getPayload } from 'payload';
import config from '@payload-config';
import CompetenciesMatrixView from '@/components/CompetenciesMatrixView';
import { sortByCode } from '@/utils/sortByCode';
import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Матриця компетентностей',
  description: 'Таблиця зв\'язків між дисциплінами та компетентностями, що формуються в процесі навчання.',
};

export default async function Competencies() {
  const payload = await getPayload({ config });

  const { disciplines: disciplinesRaw } = await getProgramDisciplines();

  const { docs: competenciesRaw } = await payload.find({
    collection: 'competencies',
    limit: 200,
  });

  const unique = Array.from(new Map(disciplinesRaw.map((d: any) => [String(d.id), d])).values());

  const disciplines = sortByCode(
    unique.filter((d: any) => d.type === 'required')
  );

  const competencies = sortByCode(competenciesRaw);

  return <CompetenciesMatrixView disciplines={disciplines} competencies={competencies} />;
}
