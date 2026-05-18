import type { CollectionConfig } from 'payload';
import { relationsCache } from './cache';

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
  labels: {
    singular: 'Дисципліна',
    plural: 'Дисципліни',
  },
  admin: {
    useAsTitle: 'code',
    group: 'Навчальний план',
    defaultColumns: ['code', 'name', 'type', 'semester'],
  },
  lockDocuments: false,
  hooks: {
    beforeDelete: [
      async ({ id, req }) => {
        const payload = req.payload;

        // Видаляємо всі зв'язки в один запит
        await payload.delete({
          collection: 'discipline-relations' as any,
          where: {
            or: [
              { subject: { equals: id } },
              { dependsOn: { equals: id } },
            ],
          },
          req,
          context: { _internalSync: true },
        });

        // Очищаємо кеш
        relationsCache.clear();
      }
    ],
    afterRead: [
      async ({ doc, req, context }) => {
        if (context?._internalSync) return doc;
        try {
          const sid = doc.id;

          // Якщо глобальний кеш порожній, завантажуємо ВСІ зв'язки за один запит
          if (relationsCache.size === 0) {
            const { docs } = await req.payload.find({
              collection: 'discipline-relations' as any,
              limit: 5000,
              depth: 0,
            });

            for (const rel of docs) {
              const subId = String(toId(rel.subject));
              const depId = String(toId(rel.dependsOn));

              if (!relationsCache.has(subId)) relationsCache.set(subId, []);
              if (!relationsCache.has(depId)) relationsCache.set(depId, []);

              relationsCache.get(subId)!.push(rel);
              relationsCache.get(depId)!.push(rel);
            }
            relationsCache.set('__initialized__', []);
          }

          const relations = relationsCache.get(sid) || [];

          doc.prerequisites = relations
            .filter((r: any) => String(toId(r.subject)) === String(sid))
            .map((r: any) => toId(r.dependsOn));

          doc.postrequisites = relations
            .filter((r: any) => String(toId(r.dependsOn)) === String(sid))
            .map((r: any) => toId(r.subject));

          return doc;
        } catch (e) {
          return doc;
        }
      }
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        if ((req as any).context?._internalSync) return;

        const payload = req.payload;
        const sid = doc.id;
        const reqData = (req as any).data ?? {};

        const updateRelations = async (
          fieldName: string,
          dbSubjectField: string,
          dbDependsOnField: string,
        ) => {
          if (!(fieldName in reqData)) return;

          const newIds = normalizeIds(reqData[fieldName] ?? []);
          const oldIds = normalizeIds(previousDoc?.[fieldName] ?? []);

          const added = newIds.filter(id => !oldIds.includes(id));
          const removed = oldIds.filter(id => !newIds.includes(id));

          if (added.length === 0 && removed.length === 0) return;

          await Promise.all([
            ...added.map(id =>
              payload.create({
                req,
                collection: 'discipline-relations' as any,
                data: { [dbSubjectField]: sid, [dbDependsOnField]: id },
                context: { _internalSync: true },
              })
            ),
            (async () => {
              if (removed.length > 0) {
                await payload.delete({
                  req,
                  collection: 'discipline-relations' as any,
                  where: {
                    and: [
                      { [dbSubjectField]: { equals: sid } },
                      { [dbDependsOnField]: { in: removed } },
                    ],
                  },
                  context: { _internalSync: true },
                });
              }
            })(),
          ]);
        };

        // Запускаємо оновлення паралельно
        await Promise.all([
          updateRelations('prerequisites', 'subject', 'dependsOn'),
          updateRelations('postrequisites', 'dependsOn', 'subject'),
        ]);

        // Очищаємо кеш
        relationsCache.clear();
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
              type: 'row',
              fields: [
                { name: 'code', label: 'Код', type: 'text', required: true, admin: { width: '15%' } },
                { name: 'year', label: 'Рік', type: 'number', defaultValue: new Date().getFullYear(), required: true, admin: { width: '15%' } },
                { name: 'name', label: 'Назва', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'shortName', label: 'Коротка назва', type: 'text', admin: { width: '30%' } },
              ],
            },
            {
              name: 'displayName',
              type: 'text',
              admin: { hidden: true },
              hooks: {
                beforeValidate: [
                  ({ data, value }) => {
                    if (data) {
                      return `[${data.code || '?'}] ${data.name || 'Без назви'} (${data.year || '?'})`;
                    }
                    return value;
                  },
                ],
              },
            },
            { name: 'description', label: 'Опис', type: 'textarea' },
            {
              name: 'parseButton',
              type: 'ui',
              admin: {
                position: 'sidebar',
                components: { Field: '@/components/admin/ParseButton#default' }
              },
            },
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
                  name: 'category',
                  label: 'Категорія',
                  type: 'select',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Стандартна', value: 'standard' },
                    { label: 'Практика', value: 'practice' },
                    { label: 'Кваліфікаційна робота', value: 'thesis' },
                  ],
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
              label: 'Семестри',
              type: 'select',
              hasMany: true,
              options: Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` })),
              admin: {
                description: 'Семестри, в яких викладається ця дисципліна',
              }
            },
            {
              name: 'topics',
              label: 'Теми занять',
              type: 'array',
              admin: {
                description: 'Список тем занять по семестрах',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { 
                      name: 'semester', 
                      label: 'Сем.', 
                      type: 'number', 
                      required: true,
                      admin: { width: '15%' } 
                    },
                    { 
                      name: 'title', 
                      label: 'Тема', 
                      type: 'text', 
                      required: true, 
                      admin: { width: '85%' } 
                    },
                  ],
                },
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
