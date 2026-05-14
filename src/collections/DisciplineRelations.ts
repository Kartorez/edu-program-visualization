import type { CollectionConfig } from 'payload';

export const DisciplineRelations: CollectionConfig = {
  slug: 'discipline-relations',
  admin: {
    group: 'Службові',
    useAsTitle: 'id',
    hidden: false,
    defaultColumns: ['subject', 'dependsOn'],
  },
  labels: {
    singular: 'Звʼязок дисциплін',
    plural: 'Звʼязки дисциплін',
  },
  fields: [
    {
      name: 'subject',
      label: 'Дисципліна',
      type: 'relationship',
      relationTo: 'disciplines',
      required: true,
      admin: {
        description: 'Субʼєкт звʼязку',
      },
    },
    {
      name: 'dependsOn',
      label: 'Пререквізит',
      type: 'relationship',
      relationTo: 'disciplines',
      required: true,
      admin: {
        description: 'Дисципліна, від якої залежимо',
      },
    },
  ],
};
