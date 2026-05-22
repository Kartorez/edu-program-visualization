'use server';

import prisma from '@/server/db/prisma';
import { CompetencySchema, CompetencyUpdateSchema } from '@/server/schemas/competency.schema';

// ─── Читання ────────────────────────────────────────────────

export async function getCompetencies() {
  return prisma.competency.findMany({
    orderBy: { code: 'asc' },
  });
}

export async function getCompetencyById(id: string) {
  return prisma.competency.findUnique({
    where:   { id },
    include: {
      disciplines: {
        include: { discipline: { select: { id: true, code: true, name: true } } },
      },
    },
  });
}

// ─── Створення ──────────────────────────────────────────────

export async function createCompetency(raw: unknown) {
  const data = CompetencySchema.parse(raw);

  return prisma.competency.create({ data });
}

// ─── Оновлення ──────────────────────────────────────────────

export async function updateCompetency(id: string, raw: unknown) {
  const data = CompetencyUpdateSchema.parse(raw);

  return prisma.competency.update({ where: { id }, data });
}

// ─── Видалення ──────────────────────────────────────────────

export async function deleteCompetency(id: string) {
  return prisma.competency.delete({ where: { id } });
}
