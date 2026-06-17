import type { CollectionConfig } from 'payload';
import { relationsCache } from './cache';

export const DisciplineRelations: CollectionConfig = {
  slug: 'discipline-relations',
  admin: {
    group: 'Система',
    useAsTitle: 'id',
    hidden: true,
    defaultColumns: ['subject', 'dependsOn'],
  },
  labels: {
    singular: 'Звʼязок дисциплін',
    plural: 'Звʼязки дисциплін',
  },
  lockDocuments: false,
  hooks: {
    afterChange: [
      () => {
        relationsCache.clear();
      }
    ],
    afterDelete: [
      () => {
        relationsCache.clear();
      }
    ]
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
