import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (sourceExtensions.has(extname(path))) files.push(path);
  }
  return files;
}

const files = await walk('src');
let replacements = 0;
let touchedFiles = 0;

for (const file of files) {
  const before = await readFile(file, 'utf8');
  const noindexMatches = before.match(/\bnoindex\b/gi) ?? [];
  const nofollowMatches = before.match(/\bnofollow\b/gi) ?? [];
  if (noindexMatches.length === 0 && nofollowMatches.length === 0) continue;

  const after = before
    .replace(/\bnoindex\b/gi, 'index')
    .replace(/\bnofollow\b/gi, 'follow');

  if (after !== before) {
    await writeFile(file, after, 'utf8');
    touchedFiles += 1;
    replacements += noindexMatches.length + nofollowMatches.length;
  }
}

const remaining = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (/\bnoindex\b/i.test(text) || /\bnofollow\b/i.test(text)) remaining.push(file);
}

if (remaining.length > 0) {
  throw new Error(`SEO guard failed: blocking robots directives remain in ${remaining.join(', ')}`);
}

console.log(`[seo] Removed ${replacements} runtime noindex/nofollow directive(s) across ${touchedFiles} source file(s).`);
