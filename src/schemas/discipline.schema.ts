import { z } from 'zod';

const DisciplineCodeSchema = z.string().regex(/^(ОК|ВК)\d+(\.\d+)?$/);

export const DisciplineSchema = z.object({
  code: DisciplineCodeSchema,
  name: z.string(),
  shortName: z.string().optional(),
  semesters: z.array(z.number().int().nonnegative()).min(1).default([]),
  prerequisites: z.array(DisciplineCodeSchema),
  postrequisites: z.array(DisciplineCodeSchema),
});

export const DisciplinesSchema = z.array(DisciplineSchema);

export type Discipline = z.infer<typeof DisciplineSchema>;
export type Disciplines = z.infer<typeof DisciplinesSchema>;
