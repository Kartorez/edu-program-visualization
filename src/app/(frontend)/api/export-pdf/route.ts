import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { withPage } from './browser';
import { readCache, writeCache, hashString } from './cache';

const PDF_HEADERS: Record<string, string> = {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="study-plan.pdf"',
};

export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { docs: lastDocs } = await payload.find({
    collection: 'disciplines',
    limit: 1,
    sort: '-updatedAt',
    depth: 0,
  });
  
  const lastUpdated = lastDocs[0]?.updatedAt || 'static';
  const CACHE_KEY = hashString(`export-${lastUpdated}`);

  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';

  if (!forceRefresh) {
    const cached = await readCache(CACHE_KEY);
    if (cached) {
      return new NextResponse(cached as any, {
        headers: { ...PDF_HEADERS, 'X-Cache': 'HIT' },
      });
    }
  }

  const pdf = await withPage(async (page) => {
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? `${protocol}://${host}`;
    
    page.on('console', (msg) => console.log('PDF EXPORT LOG:', msg.text()));
    page.on('pageerror', (err: any) => console.error('PDF EXPORT ERROR:', err.message));

    const response = await page.goto(`${baseUrl}/export`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    console.log(`PDF EXPORT: Navigated to ${baseUrl}/export, Status: ${response?.status()}`);

    try {
      await page.waitForFunction(
        () => (window as any)['__EXPORT_READY__'] === true,
        { timeout: 15000 }
      );
    } catch (e) {
      console.warn('PDF Export: __EXPORT_READY__ timeout, proceeding with current state');
    }

    return page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  });

  await writeCache(CACHE_KEY, Buffer.from(pdf));

  return new NextResponse(pdf as any, { headers: { ...PDF_HEADERS, 'X-Cache': 'MISS' } });
}
