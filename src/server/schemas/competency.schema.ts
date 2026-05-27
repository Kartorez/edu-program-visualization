import { z } from 'zod';

export const CompetencySchema = z.object({
  code: z.string().min(1, "Код є обов'язковим"),
  type: z.enum(['ЗК', 'СК']),
  description: z.string().optional(),
});

export const CompetencyUpdateSchema = CompetencySchema.partial();

export type CompetencyInput = z.infer<typeof CompetencySchema>;
export type CompetencyUpdate = z.infer<typeof CompetencyUpdateSchema>;
