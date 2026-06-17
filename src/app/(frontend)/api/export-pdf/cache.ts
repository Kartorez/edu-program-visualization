import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const CACHE_DIR =
  process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined
    ? '/tmp/pdf-cache'
    : path.resolve('.pdf-cache');

export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function readCache(hash: string): Promise<Buffer | null> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  try {
    return await fs.readFile(path.join(CACHE_DIR, `${hash}.pdf`));
  } catch {
    return null;
  }
}

export async function writeCache(hash: string, pdf: Buffer): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(path.join(CACHE_DIR, `${hash}.pdf`), pdf);
}

export async function clearCache(): Promise<void> {
  try {
    const files = await fs.readdir(CACHE_DIR);
    await Promise.all(files.map((f) => fs.unlink(path.join(CACHE_DIR, f))));
  } catch {
  }
}
