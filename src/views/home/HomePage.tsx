import { getPayload } from 'payload';
import config from '@payload-config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProgramWizard, { EducationalProgram } from '@/features/program-selection/components/ProgramWizard';
import { sortByCode } from '@/shared/lib/sortByCode';
import { getProgramDisciplines } from '@/shared/lib/getProgramDisciplines';

const degreeLabels: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

export default async function HomePage() {
  const payload = await getPayload({ config });

  const { docs: rawPrograms } = await payload.find({
    collection: 'educational-programs',
    limit: 500,
    depth: 1,
  }) as { docs: any[] };

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
