import type { CollectionConfig } from 'payload';

export const Departments: CollectionConfig = {
  slug: 'departments',

  admin: {
    useAsTitle: 'title',
    description: 'Створюйте першими — всі інші записи залежать від кафедри',
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
