import type { CollectionConfig } from 'payload';
import { relationsCache } from './cache';
import { normalizeCode, parseElectiveGroup } from '@/shared/lib/normalize';

const toId = (val: any): any => {
  if (!val) return null;
  if (typeof val === 'object' && 'id' in val) return val.id;
  return val;
};

const normalizeIds = (arr: any): any[] => {
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
    useAsTitle: 'displayName',
    group: 'Навчальний план',
    defaultColumns: ['code', 'name', 'type', 'semester'],
  },
  lockDocuments: false,
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data;

        if (typeof data.code === 'string' && data.code) {
          data.code = normalizeCode(data.code);
        }

        if (data.type === 'elective' && typeof data.code === 'string' && data.code) {
          const groupInfo = parseElectiveGroup(data.code);
          if (groupInfo) {
            try {
              const existingGroups = await req.payload.find({
                collection: 'elective-groups' as any,
                where: {
                  code: { equals: groupInfo.groupCode }
                },
                limit: 1,
                req,
                depth: 0,
              });

              let groupId: string;
              if (existingGroups.docs && existingGroups.docs.length > 0) {
                groupId = existingGroups.docs[0].id as string;
              } else {
                const newGroup = await req.payload.create({
                  collection: 'elective-groups' as any,
                  data: {
                    code: groupInfo.groupCode,
                    name: groupInfo.groupName,
                  },
                  req,
                });
                groupId = newGroup.id as string;
              }

              data.electiveGroup = groupId;
            } catch (e) {
              console.error('Помилка при створенні/пошуку electiveGroup у Disciplines beforeValidate hook:', e);
            }
          }
        }

        return data;
      }
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const payload = req.payload;

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

        relationsCache.clear();
      }
    ],

    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        if ((req as any).context?._internalSync) return;

        const payload = req.payload;
        const sid = doc.id;
        const reqData = (req as any).data ?? {};

        const updateRelations = async (
          fieldName: 'prerequisites' | 'postrequisites',
          dbSubjectField: string,
          dbDependsOnField: string,
        ) => {
          if (!(fieldName in reqData)) return;

          const newIds = normalizeIds(reqData[fieldName] ?? []);
          const oldIds = normalizeIds(previousDoc?.[fieldName] ?? []);

          const added = newIds.filter(id => !oldIds.includes(id));
          const removed = oldIds.filter(id => !newIds.includes(id));

          if (added.length === 0 && removed.length === 0) return;

          const oppField = fieldName === 'prerequisites' ? 'postrequisites' : 'prerequisites';

          await Promise.all([
            ...added.map(async (id) => {
              const subjectVal = dbSubjectField === 'subject' ? sid : id;
              const dependsOnVal = dbDependsOnField === 'dependsOn' ? id : sid;

              const existing = await payload.find({
                req,
                collection: 'discipline-relations' as any,
                where: {
                  and: [
                    { subject: { equals: subjectVal } },
                    { dependsOn: { equals: dependsOnVal } },
                  ],
                },
                limit: 1,
                depth: 0,
              });

              if (existing.docs.length === 0) {
                await payload.create({
                  req,
                  collection: 'discipline-relations' as any,
                  data: { subject: subjectVal, dependsOn: dependsOnVal },
                  context: { _internalSync: true },
                });
              }

              try {
                const oppDoc = await payload.findByID({ collection: 'disciplines', id, req, depth: 0 });
                const existingOppIds = normalizeIds(oppDoc[oppField]);
                if (!existingOppIds.includes(sid)) {
                  await payload.update({
                    collection: 'disciplines',
                    id,
                    req,
                    data: { [oppField]: [...existingOppIds, sid] },
                    context: { _internalSync: true },
                  });
                }
              } catch (e) {
                console.error(`Failed to update ${oppField} for discipline ${id}`, e);
              }
            }),
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

                for (const id of removed) {
                  try {
                    const oppDoc = await payload.findByID({ collection: 'disciplines', id, req, depth: 0 });
                    const existingOppIds = normalizeIds(oppDoc[oppField]);
                    if (existingOppIds.includes(sid)) {
                      await payload.update({
                        collection: 'disciplines',
                        id,
                        req,
                        data: { [oppField]: existingOppIds.filter(x => x !== sid) },
                        context: { _internalSync: true },
                      });
                    }
                  } catch (e) {
                    console.error(`Failed to remove ${oppField} for discipline ${id}`, e);
                  }
                }
              }
            })(),
          ]);
        };

        await Promise.all([
          updateRelations('prerequisites', 'subject', 'dependsOn'),
          updateRelations('postrequisites', 'dependsOn', 'subject'),
        ]);

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
                { name: 'code', label: 'Код', type: 'text', required: false, admin: { width: '15%', description: 'Присвоюється автоматично при прив\'язці до програми' } },
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
                components: { Field: '@/features/admin/parser/components/ParseButton#default' }
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
        {
          label: 'Деталі',
          fields: [
            {
              name: 'practiceBase',
              label: 'База практики',
              type: 'text',
              admin: {
                description: 'Кафедра або лабораторія де проходить практика',
                condition: (data) => data.category === 'practice',
              },
            },
            {
              name: 'practiceSupervisor',
              label: 'Куратор від кафедри',
              type: 'text',
              admin: {
                description: 'ПІБ та email куратора, напр. "доц. Петренко О.В. · o.p@hnau.edu.ua"',
                condition: (data) => data.category === 'practice',
              },
            },
            {
              name: 'practicePartners',
              label: 'Підприємства-партнери',
              type: 'array',
              admin: {
                description: 'Для виробничої практики. Залишити порожнім для навчальної.',
                condition: (data) => data.category === 'practice',
              },
              fields: [
                { name: 'name', label: 'Назва підприємства', type: 'text', required: true },
                { name: 'spots', label: 'Кількість місць', type: 'number' },
                {
                  name: 'note',
                  label: 'Примітка',
                  type: 'text',
                  admin: { description: 'напр. "Партнер університету" або "Потребує погодження"' },
                },
              ],
            },
            {
              name: 'practiceReports',
              label: 'Звітні матеріали',
              type: 'array',
              admin: {
                description: 'Документи які студент здає після практики',
                condition: (data) => data.category === 'practice',
              },
              fields: [
                { name: 'name', label: 'Назва документа', type: 'text', required: true },
                {
                  name: 'description',
                  label: 'Деталі',
                  type: 'text',
                  admin: { description: 'напр. "25–30 стор., підписаний на підприємстві"' },
                },
              ],
            },
            {
              name: 'thesisDiscipline',
              label: 'Базова дисципліна',
              type: 'relationship',
              relationTo: 'disciplines',
              admin: {
                description: 'Дисципліна в рамках якої виконується курсова. Для дипломної — порожньо.',
                condition: (data) => data.category === 'thesis',
              },
            },
            {
              name: 'thesisStructure',
              label: 'Структура роботи',
              type: 'array',
              admin: {
                description: 'Розділи пояснювальної записки',
                condition: (data) => data.category === 'thesis',
              },
              fields: [
                {
                  name: 'num',
                  label: 'Номер',
                  type: 'text',
                  admin: { width: '15%', description: 'напр. "1.", "2.", або "—" для додатків' },
                },
                { name: 'title', label: 'Назва розділу', type: 'text', required: true, admin: { width: '85%' } },
              ],
            },
            {
              name: 'thesisDeadlines',
              label: 'Ключові дедлайни',
              type: 'array',
              admin: {
                description: 'Хронологія виконання роботи по місяцях',
                condition: (data) => data.category === 'thesis',
              },
              fields: [
                { name: 'month', label: 'Місяць', type: 'text', required: true, admin: { width: '20%' } },
                { name: 'event', label: 'Подія', type: 'text', required: true, admin: { width: '40%' } },
                { name: 'note', label: 'Опис', type: 'text', admin: { width: '40%' } },
              ],
            },
          ],
        },
      ],
    },
  ],
};
