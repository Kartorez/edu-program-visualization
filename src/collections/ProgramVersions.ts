import type { CollectionConfig } from 'payload';

export const ProgramVersions: CollectionConfig = {
  slug: 'program-versions',

  admin: {
    useAsTitle: 'year',
    description: 'Крок 4: версія програми по року набору',
    defaultColumns: ['year', 'isActive', 'program'],
    group: 'Структура',
  },

  fields: [
    {
      name: 'year',
      label: 'Рік набору',
      type: 'number',
      required: true,
      admin: {
        description: 'Наприклад: 2024',
      },
    },
    {
      name: 'program',
      label: 'Освітня програма',
      type: 'relationship',
      relationTo: 'educational-programs',
      required: true,
    },
    {
      name: 'isActive',
      label: 'Діюча версія',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};
