'use server';

import { Prisma } from '@prisma/client';
import prisma from '@/server/db/prisma';
import {
  DisciplineSchema,
  DisciplineUpdateSchema,
  type DisciplineInput,
} from '@/server/schemas/discipline.schema';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Будує displayName за правилом Payload: "[code] name (year)" */
function buildDisplayName(d: Partial<DisciplineInput>): string | undefined {
  if (!d.code || !d.name || !d.year) return undefined;
  return `[${d.code}] ${d.name} (${d.year})`;
}

// ─── Читання ─────────────────────────────────────────────────────────────────

/** Список усіх дисциплін (легкий варіант — без зв'язків) */
export async function getDisciplines() {
  return prisma.discipline.findMany({
    orderBy: { code: 'asc' },
    include: {
      electiveGroup: true,
      semesters:     { select: { semester: true }, orderBy: { semester: 'asc' } },
    },
  });
}

/** Одна дисципліна з усіма зв'язками */
export async function getDisciplineById(id: string) {
  const doc = await prisma.discipline.findUnique({
    where: { id },
    include: {
      electiveGroup: true,
      semesters:     { select: { id: true, semester: true }, orderBy: { semester: 'asc' } },
      topics:        { orderBy: { order: 'asc' } },

      competencies: {
        include: { competency: true },
      },
      outcomes: {
        include: { outcome: true },
      },

      // prerequisiteIds: ця дисципліна є subject → dependsOn — це пререквізит
      asSubject: {
        include: { dependsOn: { select: { id: true, code: true, name: true } } },
      },
      // postrequisiteIds: ця дисципліна є dependsOn → subject — це постреквізит
      asDependency: {
        include: { subject: { select: { id: true, code: true, name: true } } },
      },
    },
  });

  if (!doc) return null;

  // Нормалізуємо у зручну форму
  return {
    ...doc,
    semesters:        doc.semesters.map((s) => s.semester),
    competencies:     doc.competencies.map((c) => c.competency),
    learningOutcomes: doc.outcomes.map((o) => o.outcome),
    prerequisites:    doc.asSubject.map((r) => r.dependsOn),
    postrequisites:   doc.asDependency.map((r) => r.subject),
  };
}

/** Дисципліна за кодом */
export async function getDisciplineByCode(code: string) {
  return prisma.discipline.findUnique({ where: { code } });
}

// ─── Створення ───────────────────────────────────────────────────────────────

export async function createDiscipline(raw: unknown) {
  const data = DisciplineSchema.parse(raw);

  const {
    semesters,
    topics,
    competencyIds,
    learningOutcomeIds,
    prerequisiteIds,
    postrequisiteIds,
    ...fields
  } = data;

  const displayName = buildDisplayName(fields);

  return prisma.$transaction(async (tx) => {
    const discipline = await tx.discipline.create({
      data: {
        ...fields,
        displayName,

        // semesters: select hasMany → pivot
        semesters: {
          create: semesters.map((semester) => ({ semester })),
        },

        // topics: array { semester, title, order }
        topics: {
          create: topics.map((t, i) => ({ ...t, order: t.order ?? i })),
        },

        // competencies M:N
        competencies: {
          create: competencyIds.map((competencyId) => ({ competencyId })),
        },

        // learningOutcomes M:N
        outcomes: {
          create: learningOutcomeIds.map((outcomeId) => ({ outcomeId })),
        },
      },
    });

    // Пре-реквізити: ця дисципліна (subject) залежить від prerequisiteIds (dependsOn)
    if (prerequisiteIds.length > 0) {
      await tx.disciplineRelation.createMany({
        data: prerequisiteIds.map((dependsOnId) => ({
          subjectId:   discipline.id,
          dependsOnId,
        })),
        skipDuplicates: true,
      });
    }

    // Пост-реквізити: disciplineId — dependsOn, postrequisiteIds — subject
    if (postrequisiteIds.length > 0) {
      await tx.disciplineRelation.createMany({
        data: postrequisiteIds.map((subjectId) => ({
          subjectId,
          dependsOnId: discipline.id,
        })),
        skipDuplicates: true,
      });
    }

    return discipline;
  });
}

// ─── Оновлення ───────────────────────────────────────────────────────────────

export async function updateDiscipline(id: string, raw: unknown) {
  const data = DisciplineUpdateSchema.parse(raw);

  const {
    semesters,
    topics,
    competencyIds,
    learningOutcomeIds,
    prerequisiteIds,
    postrequisiteIds,
    electiveGroupId,   // витягуємо окремо через null-конфлікт типів
    ...fields
  } = data;

  const displayName = buildDisplayName(fields);

  // electiveGroupId: null → від'єднати, string → підключити, undefined → не чіпати
  const electiveGroupUpdate: Prisma.DisciplineUpdateInput['electiveGroup'] =
    electiveGroupId === null
      ? { disconnect: true }
      : electiveGroupId !== undefined
        ? { connect: { id: electiveGroupId } }
        : undefined;

  return prisma.$transaction(async (tx) => {
    // 1. Скалярні поля
    const discipline = await tx.discipline.update({
      where: { id },
      data: {
        ...fields,
        ...(displayName ? { displayName } : {}),
        ...(electiveGroupUpdate !== undefined ? { electiveGroup: electiveGroupUpdate } : {}),
      },
    });

    // 2. Семестри — повна заміна
    if (semesters !== undefined) {
      await tx.disciplineSemester.deleteMany({ where: { disciplineId: id } });
      if (semesters.length > 0) {
        await tx.disciplineSemester.createMany({
          data: semesters.map((semester) => ({ disciplineId: id, semester })),
        });
      }
    }

    // 3. Теми — повна заміна
    if (topics !== undefined) {
      await tx.courseTopic.deleteMany({ where: { disciplineId: id } });
      if (topics.length > 0) {
        await tx.courseTopic.createMany({
          data: topics.map((t, i) => ({
            disciplineId: id,
            semester:     t.semester,
            title:        t.title,
            order:        t.order ?? i,
          })),
        });
      }
    }

    // 4. Компетентності M:N — повна заміна
    if (competencyIds !== undefined) {
      await tx.disciplineCompetency.deleteMany({ where: { disciplineId: id } });
      if (competencyIds.length > 0) {
        await tx.disciplineCompetency.createMany({
          data: competencyIds.map((competencyId) => ({ disciplineId: id, competencyId })),
          skipDuplicates: true,
        });
      }
    }

    // 5. Результати навчання M:N — повна заміна
    if (learningOutcomeIds !== undefined) {
      await tx.disciplineOutcome.deleteMany({ where: { disciplineId: id } });
      if (learningOutcomeIds.length > 0) {
        await tx.disciplineOutcome.createMany({
          data: learningOutcomeIds.map((outcomeId) => ({ disciplineId: id, outcomeId })),
          skipDuplicates: true,
        });
      }
    }

    // 6. Пре-реквізити — повна заміна (subject = id)
    if (prerequisiteIds !== undefined) {
      await tx.disciplineRelation.deleteMany({ where: { subjectId: id } });
      if (prerequisiteIds.length > 0) {
        await tx.disciplineRelation.createMany({
          data: prerequisiteIds.map((dependsOnId) => ({ subjectId: id, dependsOnId })),
          skipDuplicates: true,
        });
      }
    }

    // 7. Пост-реквізити — повна заміна (dependsOn = id)
    if (postrequisiteIds !== undefined) {
      await tx.disciplineRelation.deleteMany({ where: { dependsOnId: id } });
      if (postrequisiteIds.length > 0) {
        await tx.disciplineRelation.createMany({
          data: postrequisiteIds.map((subjectId) => ({ subjectId, dependsOnId: id })),
          skipDuplicates: true,
        });
      }
    }

    return discipline;
  });
}

// ─── Видалення ───────────────────────────────────────────────────────────────

/**
 * Каскадне видалення:
 * - semesters, topics, competencies, outcomes — видаляються через onDelete: Cascade
 * - DisciplineRelation (обидва напрямки) — також Cascade
 */
export async function deleteDiscipline(id: string) {
  return prisma.discipline.delete({ where: { id } });
}

// ─── Графові читання ─────────────────────────────────────────────────────────

/** Граф пре/пост-реквізитів для відображення (ReactFlow) */
export async function getDisciplineRelationGraph() {
  const [disciplines, relations] = await Promise.all([
    prisma.discipline.findMany({
      select: {
        id:        true,
        code:      true,
        name:      true,
        shortName: true,
        type:      true,
        category:  true,
        semesters: { select: { semester: true } },
      },
      orderBy: { code: 'asc' },
    }),
    prisma.disciplineRelation.findMany({
      select: { subjectId: true, dependsOnId: true },
    }),
  ]);

  return { disciplines, relations };
}

// ─── Дані для графа навчального плану (positionNodes) ────────────────────────

/** Повертає дисципліни, підготовлені для positionNodes (GraphDisciplineNode[]) */
export async function getDisciplinesForGraph() {
  const [disciplines, relations] = await Promise.all([
    prisma.discipline.findMany({
      include: {
        electiveGroup: true,
        semesters:     { select: { semester: true }, orderBy: { semester: 'asc' } },
      },
      orderBy: { code: 'asc' },
    }),
    prisma.disciplineRelation.findMany({
      select: {
        subjectId:   true,
        dependsOnId: true,
        dependsOn:   { select: { code: true } },
        subject:     { select: { code: true } },
      },
    }),
  ]);

  // Побудуємо мапи пре/пост-реквізитів по id дисципліни
  const prerequisitesMap = new Map<string, { code: string | null }[]>();
  const postrequisitesMap = new Map<string, { code: string | null }[]>();

  for (const rel of relations) {
    // subject залежить від dependsOn → dependsOn є пререквізитом для subject
    if (!prerequisitesMap.has(rel.subjectId)) prerequisitesMap.set(rel.subjectId, []);
    prerequisitesMap.get(rel.subjectId)!.push({ code: rel.dependsOn.code });

    if (!postrequisitesMap.has(rel.dependsOnId)) postrequisitesMap.set(rel.dependsOnId, []);
    postrequisitesMap.get(rel.dependsOnId)!.push({ code: rel.subject.code });
  }

  return disciplines.map((d) => ({
    ...d,
    currentSemester: d.semesters[0]?.semester ?? 1,
    prerequisites:   prerequisitesMap.get(d.id) ?? [],
    postrequisites:  postrequisitesMap.get(d.id) ?? [],
  }));
}

// ─── Дані для матриць (компетентності / результати навчання) ─────────────────

/** Повертає дисципліни з розгорнутими competencies та learningOutcomes */
export async function getDisciplinesForMatrix() {
  const disciplines = await prisma.discipline.findMany({
    orderBy: { code: 'asc' },
    include: {
      competencies: {
        include: { competency: true },
      },
      outcomes: {
        include: { outcome: true },
      },
    },
  });

  return disciplines.map((d) => ({
    id:               d.id,
    code:             d.code,
    name:             d.name,
    shortName:        d.shortName,
    competencies:     d.competencies.map((c) => c.competency),
    learningOutcomes: d.outcomes.map((o) => o.outcome),
  }));
}
