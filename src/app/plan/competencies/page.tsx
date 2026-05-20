import { CompetencyMatrixView } from '@/features/competency-matrix';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Матриця компетентностей',
    description: 'Таблиця зв\'язків між дисциплінами та компетентностями, що формуються в процесі навчання.',
};

export default async function Competencies() {
    // TODO: Implement actual data fetching without Payload
    const disciplines: any[] = [];
    const competencies: any[] = [];

    return <CompetencyMatrixView disciplines={disciplines} competencies={competencies} />;
}