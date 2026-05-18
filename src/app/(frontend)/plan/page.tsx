import { getPayload } from 'payload';
import config from '@payload-config';
import { sortByCode } from '@/utils/sortByCode';
import Hero from '@/components/ui/Hero/Hero';
import Marquee from '@/components/ui/Marquee/Marquee';
import About from '@/components/ui/About/About';
import type { ProgramOption } from '@/components/ui/Hero/ProgramSelector';
import { getProgramDisciplines } from '@/utils/getProgramDisciplines';

export const dynamic = 'force-dynamic';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

export default async function PlanLandingPage() {
  const payload = await getPayload({ config });

  const { docs: programs } = await payload.find({
    collection: 'educational-programs',
    limit: 500,
    depth: 1
  }) as { docs: any[] };

  const { disciplines: rawDisciplines, programVersionId } = await getProgramDisciplines();

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
