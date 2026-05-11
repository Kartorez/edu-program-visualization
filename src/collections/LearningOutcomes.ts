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
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
