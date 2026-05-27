import { DisciplineView } from '@/features/discipline-view';
import { getDisciplineByCode, getDisciplineById } from '@/server/actions/discipline.actions';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);
    const discipline = await getDisciplineByCode(decodedCode);

    if (discipline) {
        return {
            title: `${discipline.name} (${discipline.code})`,
            description: `Детальна інформація про дисципліну ${discipline.name}, кредити, семестри та пов'язані компетентності.`,
        };
    }

    return { title: decodedCode };
}

export default async function DisciplinePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const decodedCode = decodeURIComponent(code);

    // Спочатку знайдемо дисципліну за кодом
    const basic = await getDisciplineByCode(decodedCode);
    if (!basic) return <div>Дисципліну не знайдено</div>;

    // Потім завантажимо повну версію з усіма зв'язками
    const discipline = await getDisciplineById(basic.id);
    if (!discipline) return <div>Дисципліну не знайдено</div>;

    return <DisciplineView discipline={discipline} />;
}