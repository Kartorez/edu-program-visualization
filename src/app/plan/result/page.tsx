import { LearningResultsView } from '@/features/learning-results';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Результати навчання',
    description: 'Таблиця зв\'язків між дисциплінами та очікуваними програмними результатами навчання.',
};

export default async function Results() {
    // TODO: Implement actual data fetching without Payload
    const disciplines: any[] = [];
    const outcomes: any[] = [];

    return <LearningResultsView disciplines={disciplines} outcomes={outcomes} />;
}