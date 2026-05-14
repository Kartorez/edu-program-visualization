import { getPayload } from 'payload';
import config from '@payload-config';
import { cookies } from 'next/headers';

const formatAssessment = (val: string) => {
  const map: Record<string, string> = {
    exam: 'Іспит',
    credit: 'Залік',
    exam_credit: 'Іспит/Залік',
  };

  return map[val] || val;
};

export async function getProgramDisciplines() {
  const cookieStore = await cookies();

  let programVersionId =
    cookieStore.get('programVersionId')?.value;

  const payload = await getPayload({ config });

  let rawDisciplines: any[] = [];
  let program: any = null;

  if (programVersionId) {
    try {
      program = await payload.findByID({
        collection: 'educational-programs',
        id: programVersionId,
        depth: 2,
      });
    } catch {
      programVersionId = undefined;
    }
  }

  if (!program) {
    const { docs: activePrograms } = await payload.find({
      collection: 'educational-programs',
      where: {
        isActive: { equals: true },
      },
      limit: 1,
      depth: 2,
    });

    if (activePrograms.length > 0) {
      program = activePrograms[0];
      programVersionId = String(program.id);
    }
  }

  if (program && Array.isArray(program.disciplines)) {
    rawDisciplines = program.disciplines.filter(
      (d: any) => d && typeof d === 'object'
    );
  }

  if (rawDisciplines.length === 0) {
    const all = await payload.find({
      collection: 'disciplines',
      limit: 1000,
      depth: 1,
    });
    rawDisciplines = all.docs;
  }

  const { docs: relations } = await payload.find({
    collection: 'discipline-relations',
    limit: 5000,
    depth: 0,
  });

  const baseDiscMap = new Map(
    rawDisciplines.map((d) => [String(d.id), d])
  );

  let disciplines = rawDisciplines.flatMap((disc: any) => {
    const semesters = Array.isArray(disc.semesters)
      ? disc.semesters
      : [];

    if (semesters.length === 0) {
      return [
        {
          ...disc,
          currentSemester: 1,
          semesters: [{ semester: 1 }],
        },
      ];
    }

    return semesters.map((s: any) => ({
      ...disc,
      currentSemester: s.semester,
    }));
  });

  const finalDisciplines = disciplines.map((doc) => {
    const sid = String(doc.id);

    const prerequisites = relations
      .filter(
        (r: any) =>
          String(
            typeof r.subject === 'object'
              ? r.subject.id
              : r.subject
          ) === sid
      )
      .map((r: any) =>
        baseDiscMap.get(
          String(
            typeof r.dependsOn === 'object'
              ? r.dependsOn.id
              : r.dependsOn
          )
        )
      )
      .filter(Boolean);

    const postrequisites = relations
      .filter(
        (r: any) =>
          String(
            typeof r.dependsOn === 'object'
              ? r.dependsOn.id
              : r.dependsOn
          ) === sid
      )
      .map((r: any) =>
        baseDiscMap.get(
          String(
            typeof r.subject === 'object'
              ? r.subject.id
              : r.subject
          )
        )
      )
      .filter(Boolean);

    return {
      ...doc,
      assessment: formatAssessment(doc.assessment),
      prerequisites,
      postrequisites,
    };
  });

  return {
    disciplines: finalDisciplines,
    programVersionId,
  };
}