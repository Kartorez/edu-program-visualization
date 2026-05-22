'use server';

import prisma from '@/server/db/prisma';
import { LearningOutcomeSchema, LearningOutcomeUpdateSchema } from '@/server/schemas/learning-outcome.schema';

// ─── Читання ────────────────────────────────────────────────

export async function getLearningOutcomes() {
  return prisma.learningOutcome.findMany({
    orderBy: { code: 'asc' },
  });
}

export async function getLearningOutcomeById(id: string) {
  return prisma.learningOutcome.findUnique({
    where:   { id },
    include: {
      disciplines: {
        include: { discipline: { select: { id: true, code: true, name: true } } },
      },
    },
  });
}

// ─── Створення ──────────────────────────────────────────────

export async function createLearningOutcome(raw: unknown) {
  const data = LearningOutcomeSchema.parse(raw);

  return prisma.learningOutcome.create({ data });
}

// ─── Оновлення ──────────────────────────────────────────────

export async function updateLearningOutcome(id: string, raw: unknown) {
  const data = LearningOutcomeUpdateSchema.parse(raw);

  return prisma.learningOutcome.update({ where: { id }, data });
}

// ─── Видалення ──────────────────────────────────────────────

export async function deleteLearningOutcome(id: string) {
  return prisma.learningOutcome.delete({ where: { id } });
}
