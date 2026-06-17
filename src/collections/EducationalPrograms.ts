import type { CollectionConfig } from 'payload';

export const EducationalPrograms: CollectionConfig = {
  slug: 'educational-programs',
  labels: {
    singular: 'Освітня програма',
    plural: 'Освітні програми',
  },
  admin: {
    useAsTitle: 'fullTitle',
    description: 'Освітня програма (версія за роком набору)',
    defaultColumns: ['specialtyCode', 'title', 'year', 'degree', 'isActive'],
    group: 'Установа',
  },
  lockDocuments: false,
  fields: [
    {
      name: 'fullTitle',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data) {
              return `${data.specialtyCode || ''} ${data.title || ''} (${data.year || ''})`;
            }
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основна інформація',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'specialtyCode',
                  label: 'Код спеціальності',
                  type: 'text',
                  required: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'title',
                  label: 'Назва програми',
                  type: 'text',
                  required: true,
                  admin: { width: '70%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'degree',
                  label: 'Рівень освіти',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Бакалавр', value: 'bachelor' },
                    { label: 'Магістр', value: 'master' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'year',
                  label: 'Рік набору',
                  type: 'number',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'department',
                  label: 'Кафедра',
                  type: 'relationship',
                  relationTo: 'departments',
                  required: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'totalCredits',
                  label: 'Загальна кількість кредитів',
                  type: 'number',
                  defaultValue: 240,
                  admin: { width: '30%' },
                },
                {
                  name: 'isActive',
                  label: 'Діюча версія',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '20%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Навчальний план',
          fields: [
            {
              name: 'disciplines',
              label: 'Дисципліни програми',
              type: 'relationship',
              relationTo: 'disciplines',
              hasMany: true,
              admin: {
                description: 'Виберіть усі дисципліни, що входять до цієї програми. Семестри будуть взяті з налаштувань самих дисциплін.',
              },
            },
          ],
        },
      ],
    },
  ],
};
