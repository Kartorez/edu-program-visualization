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
      async ({ doc, previousDoc, context, req }) => {
        if (context?.skipHooks) return;

        const payload = req.payload;

        const currentPost = (doc.postrequisites || []).map((p: any) =>
          typeof p === 'string' ? p : p.id
        );

        const previousPost = (previousDoc?.postrequisites || []).map((p: any) =>
          typeof p === 'string' ? p : p.id
        );

        const addedPost = currentPost.filter((id: string) => !previousPost.includes(id));
        const removedPost = previousPost.filter((id: string) => !currentPost.includes(id));

        for (const postId of addedPost) {
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
              data: { prerequisites: [...existing, doc.id] },
              context: { skipHooks: true },
            });
          }
        }

        for (const postId of removedPost) {
          if (typeof postId !== 'string') continue;

          const post = await payload.findByID({
            collection: 'disciplines',
            id: postId,
          });

          const existing = (post.prerequisites || []).map((p: any) =>
            typeof p === 'string' ? p : p.id
          );

          if (existing.includes(doc.id)) {
            await payload.update({
              collection: 'disciplines',
              id: postId,
              data: { prerequisites: existing.filter((id: string) => id !== doc.id) },
              context: { skipHooks: true },
            });
          }
        }

        const currentPre = (doc.prerequisites || []).map((p: any) =>
          typeof p === 'string' ? p : p.id
        );

        const previousPre = (previousDoc?.prerequisites || []).map((p: any) =>
          typeof p === 'string' ? p : p.id
        );

        const addedPre = currentPre.filter((id: string) => !previousPre.includes(id));
        const removedPre = previousPre.filter((id: string) => !currentPre.includes(id));

        for (const preId of addedPre) {
          if (typeof preId !== 'string') continue;

          const pre = await payload.findByID({
            collection: 'disciplines',
            id: preId,
          });

          const existing = (pre.postrequisites || []).map((p: any) =>
            typeof p === 'string' ? p : p.id
          );

          if (!existing.includes(doc.id)) {
            await payload.update({
              collection: 'disciplines',
              id: preId,
              data: { postrequisites: [...existing, doc.id] },
              context: { skipHooks: true },
            });
          }
        }

        for (const preId of removedPre) {
          if (typeof preId !== 'string') continue;

          const pre = await payload.findByID({
            collection: 'disciplines',
            id: preId,
          });

          const existing = (pre.postrequisites || []).map((p: any) =>
            typeof p === 'string' ? p : p.id
          );

          if (existing.includes(doc.id)) {
            await payload.update({
              collection: 'disciplines',
              id: preId,
              data: { postrequisites: existing.filter((id: string) => id !== doc.id) },
              context: { skipHooks: true },
            });
          }
        }
      },
    ],
  },

  fields: [
    {
      name: 'parseButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/admin/ParseButton#default',
        },
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
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
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'shortName',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
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
      name: 'assessment',
      type: 'text',
      admin: {
        description: 'Форма контролю (залік / іспит)',
      },
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
