import { CollectionConfig } from 'payload';

export const Competencies: CollectionConfig = {
  slug: 'competencies',

  admin: {
    useAsTitle: 'code',
    description: 'ЗК і СК компетентності програми',
    defaultColumns: ['code', 'type', 'description'],
    group: 'Наповнення',
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'ЗК', value: 'zk' },
        { label: 'СК', value: 'sk' },
      ],
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },
  ],
};
