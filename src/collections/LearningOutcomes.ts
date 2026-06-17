import { CollectionConfig } from 'payload';
import { normalizeCode } from '@/shared/lib/normalize';

export const LearningOutcomes: CollectionConfig = {
  slug: 'learning-outcomes',
  labels: {
    singular: 'Результат навчання',
    plural: 'Результати навчання',
  },
  admin: {
    useAsTitle: 'code',
    description: 'ПРН програми',
    defaultColumns: ['code', 'description'],
    group: 'Дані матриць',
  },

  fields: [
    {
      name: 'code',
      label: 'Код ПРН',
      type: 'text',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'string') {
              return normalizeCode(value);
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'description',
      label: 'Опис результату',
      type: 'textarea',
    },
  ],
};
