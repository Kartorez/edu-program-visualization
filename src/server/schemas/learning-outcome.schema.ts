import { z } from 'zod';

export const LearningOutcomeSchema = z.object({
  code:        z.string().min(1, "Код є обов'язковим"),
  description: z.string().optional(),
});

export const LearningOutcomeUpdateSchema = LearningOutcomeSchema.partial();

export type LearningOutcomeInput  = z.infer<typeof LearningOutcomeSchema>;
export type LearningOutcomeUpdate = z.infer<typeof LearningOutcomeUpdateSchema>;
