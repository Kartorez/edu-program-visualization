'use server';

import prisma from '@/server/db/prisma';
import { CompetencySchema, CompetencyUpdateSchema } from '@/server/schemas/competency.schema';
import { CompetencyType } from '@prisma/client';

// ─── Мапінг між Zod (ЗК/СК) та Prisma (ZK/SK) ──────────────────

function mapToPrismaType(type: 'ЗК' | 'СК'): CompetencyType {
  return type === 'ЗК' ? CompetencyType.ZK : CompetencyType.SK;
}

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
  const parsed = CompetencySchema.parse(raw);
  
  return prisma.competency.create({
    data: {
      code: parsed.code,
      type: mapToPrismaType(parsed.type),
      description: parsed.description,
    },
  });
}

// ─── Оновлення ──────────────────────────────────────────────

export async function updateCompetency(id: string, raw: unknown) {
  const parsed = CompetencyUpdateSchema.parse(raw);

  const data: { code?: string; type?: CompetencyType; description?: string } = {};
  if (parsed.code !== undefined) data.code = parsed.code;
  if (parsed.type !== undefined) data.type = mapToPrismaType(parsed.type);
  if (parsed.description !== undefined) data.description = parsed.description;

  return prisma.competency.update({
    where: { id },
    data,
  });
}

// ─── Видалення ──────────────────────────────────────────────

export async function deleteCompetency(id: string) {
  return prisma.competency.delete({ where: { id } });
}

