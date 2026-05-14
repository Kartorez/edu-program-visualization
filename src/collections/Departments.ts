import type { CollectionConfig } from 'payload';

export const Departments: CollectionConfig = {
  slug: 'departments',

  admin: {
    useAsTitle: 'title',
    description: 'Кафедра (факультет)',
    defaultColumns: ['title', 'code'],
    group: 'Структура',
  },

  fields: [
    {
      name: 'code',
      label: 'Код кафедри',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'title',
      label: 'Назва кафедри',
      type: 'text',
      required: true,
    },
  ],
};
