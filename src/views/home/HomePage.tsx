import { getPayload } from 'payload';
import config from '@payload-config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProgramWizard, { EducationalProgram } from '@/features/program-selection/components/ProgramWizard';
import Hero from '@/views/home/section/Hero';
import Marquee from '@/views/home/section/Marque';
import About from '@/views/home/section/About';
import type { ProgramOption } from '@/features/program-selection/components/ProgramSelector';
import { sortByCode } from '@/shared/lib/sortByCode';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const programVersionId = cookieStore.get('programVersionId')?.value;

  const payload = await getPayload({ config });

  const { docs: rawPrograms } = await payload.find({
    collection: 'educational-programs',
    limit: 500,
    depth: 1,
  }) as { docs: any[] };

  if (programVersionId && rawPrograms.find((p) => String(p.id) === String(programVersionId))) {
    redirect('/plan');
  }

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
