import { CollectionConfig } from 'payload';

export const LearningOutcomes: CollectionConfig = {
  slug: 'learning-outcomes',

  admin: {
    useAsTitle: 'code',
    description: 'Програмні результати навчання',
    defaultColumns: ['code', 'description'],
    group: 'Наповнення',
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
