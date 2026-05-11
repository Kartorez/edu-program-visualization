import { getPayload } from 'payload';
import config from '@payload-config';
import { sortByCode } from '@/utils/sortByCode';
import Hero from '@/components/ui/Hero/Hero';
import Marquee from '@/components/ui/Marquee/Marquee';
import About from '@/components/ui/About/About';
import type { ProgramOption } from '@/components/ui/Hero/ProgramSelector';

import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

function getId(rel: { id: number } | number | undefined): number | undefined {
  if (typeof rel === 'number') return rel;
  return rel?.id;
}

export default async function PlanLandingPage() {
  const cookieStore = await cookies();
  const programVersionId = cookieStore.get('programVersionId')?.value;
  const payload = await getPayload({ config });

  const [
    { docs: specialties },
    { docs: programs },
    { docs: versions },
  ] = await Promise.all([
    payload.find({ collection: 'specialties', limit: 100, depth: 1 }),
    payload.find({ collection: 'educational-programs', limit: 200, depth: 1 }),
    payload.find({ collection: 'program-versions', limit: 500, depth: 1 }),
  ]);

  let targetVersionId = programVersionId;
  if (!targetVersionId) {
    const activeV = versions.find((v) => v.isActive);
    if (activeV) targetVersionId = String(activeV.id);
  }

  const { docs: instances } = await payload.find({
    collection: 'discipline-instances',
    where: {
      programVersion: { equals: targetVersionId },
    },
    limit: 1000,
    depth: 2,
  });

  let rawDisciplines = instances
    .map((inst) => inst.discipline)
    .filter(Boolean) as any[];

  if (rawDisciplines.length === 0) {
    const all = await payload.find({ collection: 'disciplines', limit: 1000, depth: 1 });
    rawDisciplines = all.docs;
  }

  const sorted = sortByCode(rawDisciplines);

  const countDiscipline = sorted.filter((d: any) => d.code?.startsWith('ОК')).length;
  const countElective = sorted.filter((d: any) => d.code?.startsWith('ВК')).length / 3;
  const countSemester = Math.max(
    ...sorted.flatMap((d: any) => d.semesters?.map((s: any) => s.semester ?? 0) ?? []),
    0
  );

  const programOptions: ProgramOption[] = versions.map((v) => {
    const prog = programs.find((p) => p.id === getId(v.program as any));
    const spec = prog
      ? specialties.find((s) => s.id === getId(prog.specialty as any))
      : null;
    return {
      id: v.id,
      label: `${spec?.title ?? 'Програма'} · ${degreeLabels[(prog as any)?.degree] ?? ''} · ${v.year}`,
      year: v.year,
      degree: (prog as any)?.degree ?? 'bachelor',
      isCurrent: String(v.id) === String(targetVersionId),
    };
  });

  const activeVersion = versions.find((v) => String(v.id) === String(targetVersionId));
  const activeProg = activeVersion
    ? programs.find((p) => p.id === getId(activeVersion.program as any))
    : null;
  const activeSpec = activeProg
    ? specialties.find((s) => s.id === getId(activeProg.specialty as any))
    : null;

  const currentProgram = activeSpec
    ? `${activeSpec.title} · ${degreeLabels[(activeProg as any)?.degree] ?? ''} · ${activeVersion?.year}`
    : "Комп'ютерні науки · Бакалавр · 2024";

  const dynamicTitle = 'Освітня програма';
  const dynamicSubtitle = activeProg ? activeProg.title : 'кафедри КН';

  return (
    <>
      <Hero
        countDiscipline={countDiscipline}
        countElective={Math.round(countElective)}
        countSemester={countSemester}
        countCredits={240}
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
