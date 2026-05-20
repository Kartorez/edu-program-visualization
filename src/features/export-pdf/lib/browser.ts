import puppeteerCore, { Browser, Page } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

let browser: Browser | null = null;

const isDev = process.env.NODE_ENV === 'development';

async function getBrowser(): Promise<Browser> {
    if (!browser || !browser.connected) {
        if (isDev) {

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const puppeteer = require('puppeteer');
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
        } else {
            browser = await puppeteerCore.launch({
                args: chromium.args,
                defaultViewport: { width: 1920, height: 1080 },
                executablePath: await chromium.executablePath(),
                headless: true,
            });
        }
    }
    if (!browser) throw new Error('Browser failed to launch');
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