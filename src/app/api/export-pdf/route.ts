import { NextResponse } from 'next/server';
import { withPage } from './browser';
import { readCache, writeCache, hashString } from './cache';

const PDF_HEADERS: Record<string, string> = {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="study-plan.pdf"',
};

const CACHE_KEY = hashString('export-static-v1');

export async function GET() {
  const cached = await readCache(CACHE_KEY);
  if (cached) {
    return new NextResponse(cached, {
      headers: { ...PDF_HEADERS, 'X-Cache': 'HIT' },
    });
  }

  const pdf = await withPage(async (page) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    await page.goto(`${baseUrl}/export`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForFunction(
      () => (window as unknown as Record<string, unknown>)['__EXPORT_READY__'] === true,
      { timeout: 15000 }
    );

    return page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
  });

  await writeCache(CACHE_KEY, Buffer.from(pdf));

  return new NextResponse(pdf, { headers: { ...PDF_HEADERS, 'X-Cache': 'MISS' } });
}
