import { CollectionConfig } from 'payload';
import { normalizeCode } from '@/shared/lib/normalize';

export const Competencies: CollectionConfig = {
  slug: 'competencies',
  labels: {
    singular: 'Компетентність',
    plural: 'Компетентності',
  },
  admin: {
    useAsTitle: 'code',
    description: 'ЗК і СК компетентності програми',
    defaultColumns: ['code', 'type', 'description'],
    group: 'Дані матриць',
  },

  fields: [
    {
      name: 'code',
      label: 'Код компетентності',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'string') {
              return normalizeCode(value);
            }
            return value;
          }
        ]
      }
    },

    {
      name: 'type',
      label: 'Тип',
      type: 'select',
      options: [
        { label: 'ЗК (Загальна)', value: 'zk' },
        { label: 'СК (Спеціальна)', value: 'sk' },
      ],
      required: true,
    },

    {
      name: 'description',
      label: 'Опис',
      type: 'textarea',
    },
  ],
};
