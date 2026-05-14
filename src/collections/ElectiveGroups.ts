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
      label: 'Код групи (ВК)',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'name',
      label: 'Назва групи',
      type: 'text',
    },
  ],
};
