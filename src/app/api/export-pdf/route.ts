import { NextRequest, NextResponse } from 'next/server';
import { withPage } from './browser';
import { hashNodes, readCache, writeCache } from './cache';
import { stripSelection } from './positions';
import { buildHtml } from './build-html';
import { DisciplineNode } from '@/types/DisciplineNode';

const PDF_HEADERS = {
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="study-plan.pdf"',
};

export async function POST(req: NextRequest) {
  const { nodes }: { nodes: DisciplineNode[] } = await req.json();

  const normalized = stripSelection(nodes);
  const hash = hashNodes(normalized);

  const cached = await readCache(hash);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      headers: { ...PDF_HEADERS, 'X-Cache': 'HIT' },
    });
  }

  const { html } = buildHtml(normalized);

  const pdf = await withPage(async (page) => {
    await page.setViewport({ width: 1123, height: 794 });
    await page.setContent(html, { waitUntil: 'load' });

    const result = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(result);
  });

  await writeCache(hash, pdf);
  return new NextResponse(new Uint8Array(pdf), { headers: { ...PDF_HEADERS, 'X-Cache': 'MISS' } });
}
