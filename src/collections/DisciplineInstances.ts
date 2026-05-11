import type { CollectionConfig } from 'payload';

export const DisciplineInstances: CollectionConfig = {
  slug: 'discipline-instances',

  admin: {
    useAsTitle: 'discipline',
    description: 'Крок 6: дисципліна у конкретній версії програми — кредити, силабус, компетентності',
    defaultColumns: ['discipline', 'programVersion', 'semester'],
    group: 'Структура',
  },

  fields: [
    {
      name: 'discipline',
      label: 'Дисципліна',
      type: 'relationship',
      relationTo: 'disciplines',
      required: true,
    },
    {
      name: 'programVersion',
      label: 'Версія програми',
      type: 'relationship',
      relationTo: 'program-versions',
      required: true,
    },
  ],
};
