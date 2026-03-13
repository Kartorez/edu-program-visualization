import puppeteer, { Browser, Page } from 'puppeteer';

let browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browser;
}

const pool: Page[] = [];

export async function withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
  const b = await getBrowser();
  const page = pool.pop() ?? (await b.newPage());
  try {
    return await fn(page);
  } finally {
    await page.goto('about:blank');
    pool.push(page);
  }
}
