import { readFile, writeFile, stat } from 'node:fs/promises';

// The original app is rebuilt from an archive, and its responsive layout is
// modified by another step. Run this script AFTER apply-responsive-layout.mjs.
// An unexpected homepage structure must fail the build, not silently omit art.
const pagePath = 'src/pages/HomePage.jsx';
const stylePath = 'src/index.css';
const assetPath = 'public/assets/ginoteq-cinematic-hero.webp';
const MARKER = 'GINOTEQ_PHOTOGRAPHIC_HERO_V2';
const anchor = 'className="gino-shell relative flex min-h-[75vh] flex-col items-start justify-center pb-16 pt-[124px] md:flex-row md:items-center md:pt-[108px] xl:min-h-[78vh]"';
const target = anchor.replace('gino-shell relative', 'gino-shell gino-photo-hero relative');

const media = await stat(assetPath);
if (!media.isFile() || media.size < 10000) {
  throw new Error('Ginoteq cinematic photo asset missing or unexpectedly small: ' + assetPath);
}

let page = await readFile(pagePath, 'utf8');
if (!page.includes(target)) {
  const matches = page.split(anchor).length - 1;
  if (matches !== 1) throw new Error('Expected exactly one homepage hero anchor; found ' + matches);
  page = page.replace(anchor, target);
  await writeFile(pagePath, page, 'utf8');
}

let css = await readFile(stylePath, 'utf8');
if (!css.includes(MARKER)) {
  const heroCss = await readFile('deploy/cinematic-photo-hero.css', 'utf8');
  if (!heroCss.includes(MARKER)) throw new Error('Cinematic CSS marker missing');
  css += '\n' + heroCss;
  await writeFile(stylePath, css, 'utf8');
}
console.log('[cinematic] Photographic homepage background installed (' + media.size + ' bytes).');
