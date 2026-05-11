import { getPayload } from 'payload';
import config from '@payload-config';
import ProgramWizard from '@/components/ProgramWizard/ProgramWizard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const payload = await getPayload({ config });

  const { docs: specialties } = await payload.find({
    collection: 'specialties',
    limit: 100,
    depth: 1,
  });

  const { docs: programs } = await payload.find({
    collection: 'educational-programs',
    limit: 200,
    depth: 1,
  });

  const { docs: versions } = await payload.find({
    collection: 'program-versions',
    limit: 500,
    depth: 1,
  });



  const departmentTitle =
    specialties[0]?.department && typeof specialties[0].department === 'object'
      ? (specialties[0].department as any).title ?? ''
      : '';

  const serializedSpecialties = specialties.map((s) => ({
    id: s.id,
    code: s.code,
    title: s.title,
    department: s.department,
  }));

  const serializedPrograms = programs.map((p) => ({
    id: p.id,
    title: p.title,
    degree: p.degree as 'bachelor' | 'master',
    specialty: p.specialty,
  }));

  const serializedVersions = versions.map((v) => ({
    id: v.id,
    year: v.year,
    isActive: v.isActive ?? false,
    program: v.program,
  }));

  return (
    <ProgramWizard
      specialties={serializedSpecialties}
      programs={serializedPrograms}
      versions={serializedVersions}
      departmentTitle={departmentTitle}
      stats={{
        countDiscipline: 0,
        countElective: 0,
        countSemester: 0,
        countCredits: 240,
      }}
    />
  );
}
