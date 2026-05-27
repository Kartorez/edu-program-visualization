import { CompetencyMatrixView } from '@/features/competency-matrix';
import { getDisciplinesForMatrix } from '@/server/actions/discipline.actions';
import { getCompetencies } from '@/server/actions/competency.actions';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Матриця компетентностей',
    description: 'Таблиця зв\'язків між дисциплінами та компетентностями, що формуються в процесі навчання.',
};

export default async function Competencies() {
    const [disciplines, competencies] = await Promise.all([
        getDisciplinesForMatrix(),
        getCompetencies(),
    ]);

    return <CompetencyMatrixView disciplines={disciplines} competencies={competencies} />;
}