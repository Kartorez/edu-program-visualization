import type { CollectionConfig } from 'payload';

const toId = (val: any): any => {
  if (!val) return null;
  if (typeof val === 'object' && 'id' in val) return val.id;
  return val;
};

const normalizeIds = (arr: any[] = []): any[] => {
  if (!Array.isArray(arr)) return [];
  return Array.from(new Set(arr.map(toId).filter(Boolean)));
};

export const Disciplines: CollectionConfig = {
  slug: 'disciplines',
  admin: {
    useAsTitle: 'name',
    group: 'Структура',
    defaultColumns: ['code', 'name', 'type'],
  },
  hooks: {
    afterRead: [
      async ({ doc, req, context }) => {
        if (context?._internalSync) return doc;
        try {
          const sid = doc.id;
          
          if (!(req as any)._relationsCache) {
            const { docs } = await req.payload.find({
              collection: 'discipline-relations' as any,
              limit: 5000,
              depth: 0,
            });
            (req as any)._relationsCache = docs;
          }
          
          const relations = (req as any)._relationsCache;

          doc.prerequisites = relations
            .filter((r: any) => String(r.subject) === String(sid))
            .map((r: any) => r.dependsOn);

          doc.postrequisites = relations
            .filter((r: any) => String(r.dependsOn) === String(sid))
            .map((r: any) => r.subject);

          return doc;
        } catch (e) {
          return doc;
        }
      }
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const payload = req.payload;
        const sid = doc.id;
        const reqData = (req as any).data ?? {};

        const updateRelations = async (
          fieldName: string,
          dbSubjectField: string,
          dbDependsOnField: string,
        ) => {
          const newIds = normalizeIds(reqData[fieldName] ?? []);
          const existing = await payload.find({
            req,
            collection: 'discipline-relations' as any,
            where: { [dbSubjectField]: { equals: sid } },
            limit: 1000,
            depth: 0,
          });
          const oldIds = existing.docs.map((r: any) => String(r[dbDependsOnField]));

          const added = newIds.filter(id => !oldIds.includes(String(id)));
          const removed = oldIds.filter(id => !newIds.map(String).includes(id));

          await Promise.all([
            ...added.map(id =>
              payload.create({
                req,
                collection: 'discipline-relations' as any,
                data: { [dbSubjectField]: sid, [dbDependsOnField]: id },
                context: { _internalSync: true },
              })
            ),
            ...removed.map(async id => {
              const toDelete = await payload.find({
                req,
                collection: 'discipline-relations' as any,
                where: {
                  and: [
                    { [dbSubjectField]: { equals: sid } },
                    { [dbDependsOnField]: { equals: id } },
                  ],
                },
                depth: 0,
              });
              return Promise.all(
                toDelete.docs.map(r =>
                  payload.delete({ 
                    req,
                    collection: 'discipline-relations' as any, 
                    id: r.id,
                    context: { _internalSync: true },
                  })
                )
              );
            }),
          ]);
        };

        await updateRelations('prerequisites', 'subject', 'dependsOn');
        await updateRelations('postrequisites', 'dependsOn', 'subject');

        if ((req as any)._relationsCache) {
          delete (req as any)._relationsCache;
        }
      }
    ]
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основне',
          fields: [
            {
              name: 'parseButton',
              type: 'ui',
              admin: { components: { Field: '@/components/admin/ParseButton#default' } },
            },
            {
              type: 'row',
              fields: [
                { name: 'code', label: 'Код', type: 'text', required: true, unique: true, admin: { width: '30%' } },
                { name: 'name', label: 'Назва', type: 'text', required: true, admin: { width: '70%' } },
              ],
            },
            { name: 'shortName', label: 'Коротка назва (для графа)', type: 'text' },
            { name: 'description', label: 'Опис', type: 'textarea' },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  label: 'Тип дисципліни',
                  type: 'select',
                  required: true,
                  options: [{ label: 'ОК (Обовʼязкова)', value: 'required' }, { label: 'ВК (Вибіркова)', value: 'elective' }],
                  admin: { width: '50%' },
                },
                {
                  name: 'electiveGroup',
                  label: 'Група вибору',
                  type: 'relationship',
                  relationTo: 'elective-groups',
                  admin: { width: '50%', condition: (data) => data.type === 'elective' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'credits', label: 'Кредити', type: 'number', admin: { width: '33%' } },
                { name: 'hours', label: 'Години', type: 'number', admin: { width: '33%' } },
                {
                  name: 'assessment',
                  label: 'Форма контролю',
                  type: 'select',
                  options: [
                    { label: 'Іспит', value: 'exam' },
                    { label: 'Залік', value: 'credit' },
                    { label: 'Іспит / Залік', value: 'exam_credit' },
                  ],
                  admin: { width: '34%' },
                },
              ],
            },
            {
              name: 'semesters',
              label: 'Семестри (за замовчуванням)',
              type: 'array',
              fields: [{ name: 'semester', type: 'number' }],
              admin: {
                description: 'Семестри, в яких зазвичай викладається ця дисципліна',
              }
            },
            {
              name: 'topics',
              label: 'Теми занять',
              type: 'array',
              admin: {
                components: {
                  Field: '@/components/admin/TopicEditor#default',
                },
                description: 'Список тем, розбитих за семестрами (якщо передбачено)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', label: 'Тема', type: 'text', required: true, admin: { width: '80%' } },
                    { name: 'semester', label: 'Сем.', type: 'number', admin: { width: '20%' } },
                  ]
                }
              ],
            },
          ],
        },
        {
          label: 'Звʼязки',
          fields: [
            {
              name: 'prerequisites',
              label: 'Пререквізити (ДО)',
              type: 'relationship',
              relationTo: 'disciplines',
              hasMany: true,
              admin: { isSortable: true },
            },
            {
              name: 'postrequisites',
              label: 'Постреквізити (ПІСЛЯ)',
              type: 'relationship',
              relationTo: 'disciplines',
              hasMany: true,
              admin: { isSortable: true },
            },
          ],
        },
        {
          label: 'Матриці',
          fields: [
            { name: 'competencies', label: 'Компетентності', type: 'relationship', relationTo: 'competencies', hasMany: true },
            { name: 'learningOutcomes', label: 'Результати навчання', type: 'relationship', relationTo: 'learning-outcomes', hasMany: true },
          ],
        },
      ],
    },
  ],
};
