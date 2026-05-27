import { LearningResultsView } from '@/features/learning-results';
import { getDisciplinesForMatrix } from '@/server/actions/discipline.actions';
import { getLearningOutcomes } from '@/server/actions/learning-outcome.actions';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Результати навчання',
    description: 'Таблиця зв\'язків між дисциплінами та очікуваними програмними результатами навчання.',
};

export default async function Results() {
    const [disciplines, outcomes] = await Promise.all([
        getDisciplinesForMatrix(),
        getLearningOutcomes(),
    ]);

    return <LearningResultsView disciplines={disciplines} outcomes={outcomes} />;
}