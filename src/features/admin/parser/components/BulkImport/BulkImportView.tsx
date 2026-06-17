import type { AdminViewProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import React from 'react';
import BulkImportClient from './BulkImportClient';

export default function BulkImportView({
  initPageResult,
  params,
  searchParams,
}: AdminViewProps) {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <div style={{ padding: '0 2rem' }}>
        <h1 style={{ marginTop: '2rem', marginBottom: '0.5rem', fontSize: '24px', fontWeight: 'bold' }}>
          Масовий імпорт силабусів
        </h1>
        <p style={{ color: 'var(--theme-elevation-500)', marginBottom: '2rem', fontSize: '14px' }}>
          Завантажте кілька PDF-силабусів — вони будуть розпарсені та збережені як дисципліни.
        </p>
        <BulkImportClient />
      </div>
    </DefaultTemplate>
  );
}
