import { cache } from 'react';

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

async function fetchProgramDisciplines(programVersionId: string | undefined, light: boolean = false, includeRelations: boolean = false) {
  const payload = await getPayload({ config });

  let rawDisciplines: any[] = [];
  let program: any = null;

  if (programVersionId) {
    try {
      program = await payload.findByID({
        collection: 'educational-programs',
        id: programVersionId,
        depth: light ? 1 : 2,
      });
    } catch {
      programVersionId = undefined;
    }
  }

  if (program && Array.isArray(program.disciplines)) {
    const populated = program.disciplines.filter(
      (d: any) => d && typeof d === 'object'
    );
    const unpopulatedIds = program.disciplines
      .filter((d: any) => d && typeof d !== 'object')
      .map((d: any) => String(d));

    let extra: any[] = [];
    if (unpopulatedIds.length > 0) {
      const { docs } = await payload.find({
        collection: 'disciplines',
        where: { id: { in: unpopulatedIds } },
        limit: unpopulatedIds.length,
        depth: light ? 1 : 2,
      });
      extra = docs;
    }

    rawDisciplines = [...populated, ...extra];
  }

  let relations: any[] = [];
  if (!light || includeRelations) {
    const { docs } = await payload.find({
      collection: 'discipline-relations',
      limit: 5000,
      depth: 0,
    });
    relations = docs;
  }

  const baseDiscMap = new Map(
    rawDisciplines.map((d) => [String(d.id), d])
  );

  let disciplines = Array.from(baseDiscMap.values()).flatMap((disc: any) => {
    const semesters = Array.isArray(disc.semesters)
      ? disc.semesters
      : [];

    if (semesters.length === 0) {
      return [
        {
          ...disc,
          currentSemester: 1,
          semesters: ['1'],
        },
      ];
    }

    return semesters.map((s: any) => ({
      ...disc,
      currentSemester: parseInt(s, 10) || 1,
    }));
  });

  const finalDisciplines = disciplines.map((doc) => {
    const sid = String(doc.id);

    let prerequisites: any[] = [];
    let postrequisites: any[] = [];

    if (!light || includeRelations) {
      prerequisites = Array.from(new Map(relations
        .filter(
          (r: any) =>
            String(
              r.subject && typeof r.subject === 'object'
                ? r.subject.id
                : r.subject
            ) === sid
        )
        .map((r: any) =>
          baseDiscMap.get(
            String(
              r.dependsOn && typeof r.dependsOn === 'object'
                ? r.dependsOn.id
                : r.dependsOn
            )
          )
        )
        .filter(Boolean)
        .map((p: any) => [p.id, p])
      ).values());

      postrequisites = Array.from(new Map(relations
        .filter(
          (r: any) =>
            String(
              r.dependsOn && typeof r.dependsOn === 'object'
                ? r.dependsOn.id
                : r.dependsOn
            ) === sid
        )
        .map((r: any) =>
          baseDiscMap.get(
            String(
              r.subject && typeof r.subject === 'object'
                ? r.subject.id
                : r.subject
            )
          )
        )
        .filter(Boolean)
        .map((p: any) => [p.id, p])
      ).values());
    }

    const finalDoc = {
      ...doc,
      assessment: formatAssessment(doc.assessment),
      prerequisites,
      postrequisites,
    };

    if (light) {
      delete finalDoc.topics;
      delete finalDoc.competencies;
      delete finalDoc.learningOutcomes;
      delete finalDoc.practiceBase;
      delete finalDoc.practiceSupervisor;
      delete finalDoc.practicePartners;
      delete finalDoc.practiceReports;
      delete finalDoc.thesisDiscipline;
      delete finalDoc.thesisStructure;
      delete finalDoc.thesisDeadlines;
    }

    return finalDoc;
  });

  return {
    disciplines: finalDisciplines,
    programVersionId,
  };
}

export const getProgramDisciplines = cache(async function getProgramDisciplines(programVersionId?: string, light: boolean = false, includeRelations: boolean = false) {
  return fetchProgramDisciplines(programVersionId, light, includeRelations);
});