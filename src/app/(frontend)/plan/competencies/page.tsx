import { getPayload } from 'payload';
import config from '@payload-config';
import CompetenciesMatrixView from '@/components/CompetenciesMatrixView';
import { sortByCode } from '@/utils/sortByCode';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Матриця компетентностей',
  description: 'Таблиця зв\'язків між дисциплінами та компетентностями, що формуються в процесі навчання.',
};

export default async function Competencies() {
  const payload = await getPayload({ config });

  const { docs: disciplinesRaw } = await payload.find({
    collection: 'disciplines',
    limit: 1000,
    depth: 1,
  });

  const { docs: competenciesRaw } = await payload.find({
    collection: 'competencies',
    limit: 200,
  });

  const disciplines = sortByCode(
    disciplinesRaw.filter((d) => {
      const name = d.name?.toLowerCase() || '';
      const code = d.code?.toLowerCase() || '';
      return !name.includes('вк') && !code.includes('вк');
    })
  );

  const competencies = sortByCode(competenciesRaw);

  return <CompetenciesMatrixView disciplines={disciplines} competencies={competencies} />;
}
