import { CollectionConfig } from 'payload';

const getGroupCode = (code: string) => {
  if (!code?.startsWith('ВК')) return null;
  return code.split('.')[0].trim();
};

export const Disciplines: CollectionConfig = {
  slug: 'disciplines',

  admin: {
    useAsTitle: 'name',
  },

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const payload = req.payload;

        const groupCode = getGroupCode(data.code);

        if (!groupCode) {
          data.electiveGroup = null;
          return data;
        }

        const existing = await payload.find({
          collection: 'elective-groups',
          where: {
            code: { equals: groupCode },
          },
        });

        let groupId;

        if (existing.totalDocs > 0) {
          groupId = existing.docs[0].id;
        } else {
          const created = await payload.create({
            collection: 'elective-groups',
            data: {
              code: groupCode,
              name: `Група ${groupCode}`,
            },
          });

          groupId = created.id;
        }

        data.electiveGroup = groupId;

        return data;
      },
    ],

    afterChange: [
      async ({ doc, req }) => {
        const payload = req.payload;

        for (const postId of doc.postrequisites || []) {
          if (typeof postId !== 'string') continue;

          const post = await payload.findByID({
            collection: 'disciplines',
            id: postId,
          });

          const existing = (post.prerequisites || []).map((p: any) =>
            typeof p === 'string' ? p : p.id
          );

          if (!existing.includes(doc.id)) {
            await payload.update({
              collection: 'disciplines',
              id: postId,
              data: {
                prerequisites: [...existing, doc.id],
              },
            });
          }
        }
      },
    ],
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
      required: true,
    },

    {
      name: 'shortName',
      type: 'text',
    },

    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Обовʼязкова', value: 'required' },
        { label: 'Вибіркова', value: 'elective' },
      ],
    },

    {
      name: 'semesters',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'semester',
          type: 'number',
        },
      ],
    },

    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'disciplines',
      hasMany: true,
    },

    {
      name: 'postrequisites',
      type: 'relationship',
      relationTo: 'disciplines',
      hasMany: true,
    },

    {
      name: 'electiveGroup',
      type: 'relationship',
      relationTo: 'elective-groups',
    },

    {
      name: 'credits',
      type: 'number',
    },

    {
      name: 'hours',
      type: 'number',
    },

    {
      name: 'topics',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },

    {
      name: 'competencies',
      type: 'relationship',
      relationTo: 'competencies',
      hasMany: true,
    },

    {
      name: 'learningOutcomes',
      type: 'relationship',
      relationTo: 'learning-outcomes',
      hasMany: true,
    },
  ],
};
