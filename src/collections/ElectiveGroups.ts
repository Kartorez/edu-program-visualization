import { CollectionConfig } from 'payload';

export const ElectiveGroups: CollectionConfig = {
  slug: 'elective-groups',

  admin: {
    useAsTitle: 'name',
    group: 'Структура',
    description: 'Групування вибіркових дисциплін (Блоки)',
    defaultColumns: ['name', 'code'],
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'name',
      type: 'text',
    },
  ],
};
