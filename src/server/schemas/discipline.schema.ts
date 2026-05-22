import { z } from 'zod';

// ─── Вкладені типи ───────────────────────────────────────────

export const CourseTopicSchema = z.object({
  semester: z.number().int().min(1).max(12),
  title:    z.string().min(1, "Назва теми є обов'язковою"),
  order:    z.number().int().min(0).default(0),
});

export type CourseTopicInput = z.infer<typeof CourseTopicSchema>;

// ─── Основна схема ───────────────────────────────────────────

export const DisciplineSchema = z.object({
  code:        z.string().min(1, "Код є обов'язковим"),
  year:        z.number().int().min(2000).max(2100),
  name:        z.string().min(1, "Назва є обов'язковою"),
  shortName:   z.string().optional(),
  description: z.string().optional(),

  type:     z.enum(['REQUIRED', 'ELECTIVE']),
  category: z.enum(['STANDARD', 'PRACTICE', 'THESIS']).default('STANDARD'),

  electiveGroupId: z.string().optional().nullable(),

  credits:    z.number().int().positive().optional().nullable(),
  hours:      z.number().int().positive().optional().nullable(),
  assessment: z.enum(['EXAM', 'CREDIT', 'EXAM_CREDIT']).optional().nullable(),

  // semesters: масив чисел 1-12 (відповідає Payload select hasMany)
  semesters: z.array(z.number().int().min(1).max(12)).default([]),

  // topics: масив { semester, title }
  topics: z.array(CourseTopicSchema).default([]),

  // M:N зв'язки — масив id
  competencyIds:     z.array(z.string()).default([]),
  learningOutcomeIds: z.array(z.string()).default([]),

  // Пре/пост-реквізити — масив id
  prerequisiteIds:  z.array(z.string()).default([]),
  postrequisiteIds: z.array(z.string()).default([]),
});

export const DisciplineUpdateSchema = DisciplineSchema.partial();

export type DisciplineInput  = z.infer<typeof DisciplineSchema>;
export type DisciplineUpdate = z.infer<typeof DisciplineUpdateSchema>;
