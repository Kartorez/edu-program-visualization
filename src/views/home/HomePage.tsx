import { cookies } from 'next/headers';
import ProgramWizard, { EducationalProgram } from '@/features/program-selection/components/ProgramWizard';
import Hero from '@/views/home/section/Hero';
import Marquee from '@/views/home/section/Marque';
import About from '@/views/home/section/About';
import type { ProgramOption } from '@/features/program-selection/components/ProgramSelector';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const programVersionId = cookieStore.get('programVersionId')?.value;

  // TODO: Implement actual data fetching without Payload
  const rawPrograms: any[] = [];

  const activeProg = rawPrograms.find((p) => String(p.id) === String(programVersionId));

  if (!programVersionId || !activeProg) {
    const departmentTitle =
      rawPrograms.length > 0 &&
        rawPrograms[0]?.department &&
        typeof rawPrograms[0].department === 'object'
        ? (rawPrograms[0].department as any).title ?? ''
        : '';

    const programs: EducationalProgram[] = rawPrograms.map((p) => ({
      id: String(p.id),
      title: p.title as string,
      specialtyCode: p.specialtyCode as string,
      degree: p.degree as 'bachelor' | 'master',
      year: p.year as number,
      isActive: p.isActive as boolean,
    }));

    return (
      <ProgramWizard
        programs={programs}
        departmentTitle={departmentTitle}
      />
    );
  }

  const sorted: any[] = [];

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

  const programOptions: ProgramOption[] = rawPrograms.map((p) => ({
    id: p.id,
    label: `${p.specialtyCode} ${p.title} · ${degreeLabels[p.degree] ?? ''} · ${p.year}`,
    year: p.year,
    degree: p.degree as any,
    isCurrent: String(p.id) === String(programVersionId),
  }));

  const currentProgram = activeProg
    ? `${activeProg.specialtyCode} ${activeProg.title} · ${degreeLabels[activeProg.degree] ?? ''} · ${activeProg.year}`
    : "Оберіть програму";

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
