import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const rawBase = 'https://raw.githubusercontent.com/GinoteqLabs/GinoTeQ/main/deploy/source.part.';
let encoded = '';

for (const part of ['01', '02', '03', '04', '05']) {
  const response = await fetch(`${rawBase}${part}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch source part ${part}: HTTP ${response.status}`);
  }
  encoded += (await response.text()).trim();
}

const archive = Buffer.from(encoded, 'base64');
await writeFile('source.tgz', archive);
execFileSync('tar', ['-xzf', 'source.tgz', '-C', '.'], { stdio: 'inherit' });

// Keep the live subscription proxy on the cost-saving Supabase Edge Function.
const apiResponse = await fetch('https://raw.githubusercontent.com/GinoteqLabs/GinoTeQ/main/deploy/api-subscribe.js');
if (!apiResponse.ok) {
  throw new Error(`Failed to fetch subscription API override: HTTP ${apiResponse.status}`);
}
await mkdir('api', { recursive: true });
await writeFile('api/subscribe.js', await apiResponse.text());

// Install the Ginoteq brand favicon build step after the source archive is unpacked.
const faviconResponse = await fetch('https://raw.githubusercontent.com/GinoteqLabs/GinoTeQ/main/deploy/apply-brand-favicon.mjs');
if (!faviconResponse.ok) {
  throw new Error(`Failed to fetch favicon build step: HTTP ${faviconResponse.status}`);
}
await mkdir('tools', { recursive: true });
await writeFile('tools/apply-brand-favicon.mjs', await faviconResponse.text());

// Force browsers to request the new branded favicon rather than a cached generic G.
const indexPath = 'index.html';
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml.replace(
  /href="\/favicon\.svg(?:\?[^\"]*)?"/,
  'href="/favicon.svg?v=ginoteq-brand-g-20260909"',
);
await writeFile(indexPath, indexHtml, 'utf8');

console.log(`Reconstructed Ginoteq source (${archive.length} bytes), applied subscription proxy, and prepared branded favicon.`);
