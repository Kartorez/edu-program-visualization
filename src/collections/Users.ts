import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Користувач',
    plural: 'Користувачі',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Система',
    description: 'Користувачі з доступом до системи',
  },
  auth: true,
  fields: [],
}
