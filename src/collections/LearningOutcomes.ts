import { CollectionConfig } from 'payload';

export const LearningOutcomes: CollectionConfig = {
  slug: 'learning-outcomes',

  admin: {
    useAsTitle: 'code',
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
