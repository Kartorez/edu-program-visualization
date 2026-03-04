'use server';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  const { html, styles, bounds } = await req.json();

  const A4_WIDTH = 1122;
  const A4_HEIGHT = 794;

  const scale = Math.min(A4_WIDTH / bounds.width, A4_HEIGHT / bounds.height);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: A4_WIDTH, height: A4_HEIGHT });

  await page.setContent(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: ${A4_WIDTH}px;
            height: ${A4_HEIGHT}px;
            overflow: hidden;
            background: white;
              display: flex;
          }
          #scale-wrapper {
            transform-origin: top left;
            transform: scale(${scale});
            width: ${bounds.width}px;
            height: ${bounds.height}px;
          }
          ${styles}
        </style>
      </head>
      <body>
        <div id="scale-wrapper">${html}</div>
      </body>
    </html>
  `,
    { waitUntil: 'networkidle0' }
  );

  const pdf = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reactflow.pdf"',
    },
  });
}
