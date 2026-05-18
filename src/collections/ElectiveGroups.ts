import { CollectionConfig } from 'payload';

export const ElectiveGroups: CollectionConfig = {
  slug: 'elective-groups',

  labels: {
    singular: 'Група вибіркових',
    plural: 'Вибіркові групи',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Навчальний план',
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
