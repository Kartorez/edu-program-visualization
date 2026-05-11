import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Налаштування',
    description: 'Користувачі з доступом до системи',
  },
  auth: true,
  fields: [

  ],
}
