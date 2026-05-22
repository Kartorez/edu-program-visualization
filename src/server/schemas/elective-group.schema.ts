import { z } from 'zod';

export const ElectiveGroupSchema = z.object({
  code: z.string().min(1, "Код групи є обов'язковим"),
  name: z.string().optional(),
});

export const ElectiveGroupUpdateSchema = ElectiveGroupSchema.partial();

export type ElectiveGroupInput  = z.infer<typeof ElectiveGroupSchema>;
export type ElectiveGroupUpdate = z.infer<typeof ElectiveGroupUpdateSchema>;
