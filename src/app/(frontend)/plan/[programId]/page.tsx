import { getPayload } from 'payload';
import config from '@payload-config';
import { sortByCode } from '@/shared/lib/sortByCode';
import Hero from '@/views/plan/section/Hero';
import Marquee from '@/views/plan/section/Marque';
import About from '@/views/plan/section/About';
import type { ProgramOption } from '@/features/program-selection/components/ProgramSelector';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';

export const dynamic = 'force-dynamic';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

export default async function PlanLandingPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const payload = await getPayload({ config });

  const [{ docs: programs }, { disciplines: rawDisciplines, programVersionId }] = await Promise.all([
    payload.find({ collection: 'educational-programs', limit: 500, depth: 1 }) as Promise<{ docs: any[] }>,
    getProgramDisciplines(programId, true),
  ]);

  const sorted = sortByCode(rawDisciplines);

  const uniqueDisciplines = Array.from(new Map(sorted.map((d: any) => [String(d.id), d])).values());

  const countDiscipline = uniqueDisciplines.filter((d: any) => d.code?.startsWith('ОК')).length;
  const countElective = new Set(
    uniqueDisciplines
      .filter((d: any) => d.code?.startsWith('ВК'))
      .map((d: any) => d.code?.match(/^ВК\s*\d+/)?.[0])
      .filter(Boolean)
  ).size;

  const countSemester = Math.max(
    ...sorted.flatMap((d: any) => (d.semesters ?? []).map((s: any) => parseInt(String(s), 10) || 0)),
    0
  );

  const programOptions: ProgramOption[] = programs.map((p) => ({
    id: p.id,
    label: `${p.specialtyCode} ${p.title} · ${degreeLabels[p.degree] ?? ''} · ${p.year}`,
    year: p.year,
    degree: p.degree as any,
    isCurrent: String(p.id) === String(programVersionId),
  }));

  const activeProg = programs.find((p) => String(p.id) === String(programVersionId));

  const currentProgram = activeProg
    ? `${activeProg.specialtyCode} ${activeProg.title} · ${degreeLabels[activeProg.degree] ?? ''} · ${activeProg.year}`
    : "122 Комп'ютерні науки · Бакалавр · 2024";

  const dynamicTitle = 'Освітня програма';
  const dynamicSubtitle = activeProg ? activeProg.title : 'кафедри КН';
  const totalCredits = activeProg?.totalCredits ?? 240;

  return (
    <>
      <Hero
        countDiscipline={countDiscipline}
        countElective={countElective}
        countSemester={countSemester}
        countCredits={totalCredits}
        title={dynamicTitle}
        subtitle={dynamicSubtitle}
        currentProgram={currentProgram}
        programOptions={programOptions}
      />
      <Marquee disciplines={sorted} />
      <About disciplines={sorted} />
    </>
  );
}
