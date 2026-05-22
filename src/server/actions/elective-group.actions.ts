'use server';

import prisma from '@/server/db/prisma';
import { ElectiveGroupSchema, ElectiveGroupUpdateSchema } from '@/server/schemas/elective-group.schema';

// ─── Читання ────────────────────────────────────────────────

export async function getElectiveGroups() {
  return prisma.electiveGroup.findMany({
    orderBy: { code: 'asc' },
    include: { _count: { select: { disciplines: true } } },
  });
}

export async function getElectiveGroupById(id: string) {
  return prisma.electiveGroup.findUnique({
    where:   { id },
    include: { disciplines: { select: { id: true, code: true, name: true } } },
  });
}

// ─── Створення ──────────────────────────────────────────────

export async function createElectiveGroup(raw: unknown) {
  const data = ElectiveGroupSchema.parse(raw);

  return prisma.electiveGroup.create({ data });
}

// ─── Оновлення ──────────────────────────────────────────────

export async function updateElectiveGroup(id: string, raw: unknown) {
  const data = ElectiveGroupUpdateSchema.parse(raw);

  return prisma.electiveGroup.update({ where: { id }, data });
}

// ─── Видалення ──────────────────────────────────────────────

export async function deleteElectiveGroup(id: string) {
  return prisma.electiveGroup.delete({ where: { id } });
}
