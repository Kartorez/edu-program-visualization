import { CollectionConfig } from 'payload';

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
    },
    {
      name: 'description',
      label: 'Опис результату',
      type: 'textarea',
    },
  ],
};
