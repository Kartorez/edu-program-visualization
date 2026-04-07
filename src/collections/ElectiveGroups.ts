import { CollectionConfig } from 'payload';

export const ElectiveGroups: CollectionConfig = {
  slug: 'elective-groups',

  admin: {
    useAsTitle: 'code',
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'name',
      type: 'text',
    },
  ],
};
