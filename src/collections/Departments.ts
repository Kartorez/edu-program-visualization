import type { CollectionConfig } from 'payload';

export const Departments: CollectionConfig = {
  slug: 'departments',

  labels: {
    singular: 'Кафедра',
    plural: 'Кафедри',
  },

  admin: {
    useAsTitle: 'title',
    description: 'Кафедра (факультет)',
    defaultColumns: ['title', 'code', 'shortName'],
    group: 'Установа',
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
    {
      name: 'shortName',
      label: 'Коротка назва (напр. КН ВНАУ)',
      type: 'text',
    },
  ],
};
