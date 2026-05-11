import type { CollectionConfig } from 'payload';

export const Specialties: CollectionConfig = {
  slug: 'specialties',

  admin: {
    useAsTitle: 'title',
    description: "Крок 2: після кафедр. Прив'язується до кафедри",
    defaultColumns: ['title', 'code', 'department'],
    group: 'Структура',
  },

  fields: [
    {
      name: 'code',
      label: 'Код спеціальності',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Наприклад: 122',
      },
    },
    {
      name: 'title',
      label: 'Назва спеціальності',
      type: 'text',
      required: true,
    },
    {
      name: 'department',
      label: 'Кафедра',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
    },
  ],
};
