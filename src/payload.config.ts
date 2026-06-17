import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Departments } from './collections/Departments';
import { EducationalPrograms } from './collections/EducationalPrograms';
import { Disciplines } from './collections/Disciplines';
import { ElectiveGroups } from './collections/ElectiveGroups';
import { Competencies } from './collections/Competencies';
import { LearningOutcomes } from './collections/LearningOutcomes';
import { DisciplineRelations } from './collections/DisciplineRelations';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterDashboard: ['./shared/ui/admin/OnboardingGuide'],
      Nav: './shared/ui/admin/Nav',
      views: {
        BulkImport: {
          Component: './features/admin/parser/components/BulkImport/BulkImportView',
          path: '/bulk-import',
        },
      },
    },
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
      titleSuffix: '- КН ВНАУ',
    },
  },
  collections: [
    Users,
    Departments,
    EducationalPrograms,
    Disciplines,
    DisciplineRelations,
    ElectiveGroups,
    Competencies,
    LearningOutcomes,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 3,
      idleTimeoutMillis: 60_000,
      connectionTimeoutMillis: 30_000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10_000,
    },
  }),
  async onInit(payload) {
    if (process.env.FIRST_USER_EMAIL && process.env.FIRST_USER_PASSWORD) {
      const users = await payload.find({
        collection: 'users',
        limit: 1,
      });

      if (users.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: process.env.FIRST_USER_EMAIL,
            password: process.env.FIRST_USER_PASSWORD,
          },
        });
        payload.logger.info('Created first admin user from environment variables');
      }
    }
  },
  sharp,
  plugins: [],
});
