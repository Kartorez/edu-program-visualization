import { getDisciplines } from '@/server/actions/discipline.actions';
import { getCompetencies } from '@/server/actions/competency.actions';
import { getLearningOutcomes } from '@/server/actions/learning-outcome.actions';
import { getElectiveGroups } from '@/server/actions/elective-group.actions';
import { DisciplinesManage } from '@/features/admin/disciplines';

export const dynamic = 'force-dynamic';

export default async function DisciplinesPage() {
    const rawDisciplines = await getDisciplines();
    const rawCompetencies = await getCompetencies();
    const rawOutcomes = await getLearningOutcomes();
    const rawElectiveGroups = await getElectiveGroups();

    // Map helper options to ReactSelect OptionType
    const electiveGroupsOptions = rawElectiveGroups.map(eg => ({
        value: eg.id,
        label: eg.name ? `${eg.code} — ${eg.name}` : eg.code,
    }));

    const competenciesOptions = rawCompetencies.map(c => ({
        value: c.id,
        label: `${c.code} — ${c.description || ''}`,
    }));

    const outcomesOptions = rawOutcomes.map(o => ({
        value: o.id,
        label: `${o.code} — ${o.description || ''}`,
    }));

    const disciplinesOptions = rawDisciplines.map(d => ({
        value: d.id,
        label: `${d.code} — ${d.name}`,
    }));

    return (
        <DisciplinesManage
            initialList={rawDisciplines}
            electiveGroups={electiveGroupsOptions}
            competencies={competenciesOptions}
            learningOutcomes={outcomesOptions}
            disciplines={disciplinesOptions}
        />
    );
}
