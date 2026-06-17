import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { withPage } from './browser';
import { readCache, writeCache, hashString, clearCache } from './cache';

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

  const lastUpdated = (lastDocs[0] as any)?.updatedAt || 'static';
  const CACHE_KEY = hashString(`export-${lastUpdated}`);

  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('refresh') === 'true';

  if (forceRefresh) {
    await clearCache();
  } else {
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
    const publicUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const port = host ? host.split(':')[1] || '3000' : '3000';

    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
    const baseUrl = isVercel ? publicUrl : `http://localhost:${port}`;

    const programId = searchParams.get('id');
    if (programId) {
      const cookieDomain = isVercel ? new URL(baseUrl).hostname : 'localhost';
      await page.setCookie({
        name: 'programVersionId',
        value: programId,
        domain: cookieDomain,
        path: '/',
      });
    }

    page.on('console', (msg) => console.log('PDF EXPORT LOG:', msg.text()));
    page.on('pageerror', (err: any) => console.error('PDF EXPORT ERROR:', err.message));

    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });

    const response = await page.goto(`${baseUrl}/export`, {
      waitUntil: 'domcontentloaded',
      timeout: 0,
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

export async function DELETE() {
  await clearCache();
  return NextResponse.json({ ok: true, message: 'PDF cache cleared' });
}
