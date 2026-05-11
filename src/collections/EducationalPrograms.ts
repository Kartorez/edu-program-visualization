import type { CollectionConfig } from 'payload';

export const EducationalPrograms: CollectionConfig = {
  slug: 'educational-programs',

  admin: {
    useAsTitle: 'title',
    description: 'Крок 3: Бакалавр або Магістр для спеціальності',
    defaultColumns: ['title', 'degree', 'specialty'],
    group: 'Структура',
  },

  fields: [
    {
      name: 'title',
      label: 'Назва освітньої програми',
      type: 'text',
      required: true,
    },
    {
      name: 'degree',
      label: 'Рівень вищої освіти',
      type: 'select',
      required: true,
      options: [
        { label: 'Бакалавр', value: 'bachelor' },
        { label: 'Магістр', value: 'master' },
      ],
    },
    {
      name: 'specialty',
      label: 'Спеціальність',
      type: 'relationship',
      relationTo: 'specialties',
      required: true,
    },
  ],
};
