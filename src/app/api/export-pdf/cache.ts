import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { DisciplineNode } from '@/types/DisciplineNode';

const CACHE_DIR = path.resolve('.pdf-cache');

export function hashNodes(nodes: DisciplineNode[]): string {
  return crypto.createHash('sha256').update(JSON.stringify(nodes)).digest('hex');
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
  await fs.writeFile(path.join(CACHE_DIR, `${hash}.pdf`), pdf);
}
