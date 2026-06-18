import { getPayload } from 'payload';
import config from '@payload-config';
import ProgramWizard, { EducationalProgram } from '@/features/program-selection/components/ProgramWizard';
import AppTopbar from '@/shared/ui/Sidebar/AppTopbar';

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

  const departmentShortName =
    rawPrograms.length > 0 &&
      rawPrograms[0]?.department &&
      typeof rawPrograms[0].department === 'object'
      ? (rawPrograms[0].department as any).shortName ?? ''
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
    <>
      <AppTopbar />
      <div className="app-container">
        <main className="main-content">
          <ProgramWizard
            programs={programs}
            departmentTitle={departmentTitle}
            departmentShortName={departmentShortName}
          />
        </main>
      </div>
    </>
  );
}
