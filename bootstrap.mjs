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

// Rebuild the browser favicon from the ACTUAL Ginoteq logo mark rather than
// the generic serif G that came with the original Hostinger export.
const assetToolPath = 'tools/fetch-static-assets.mjs';
let assetTool = await readFile(assetToolPath, 'utf8');
assetTool = assetTool.replace(
  "import { mkdir, access, writeFile } from 'node:fs/promises';",
  "import { mkdir, access, writeFile, readFile } from 'node:fs/promises';",
);

if (!assetTool.includes('GINOTEQ_FAVICON_FROM_LOGO')) {
  assetTool += `\n\n// GINOTEQ_FAVICON_FROM_LOGO\nfunction getJpegDimensions(buffer) {\n  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {\n    throw new Error('Ginoteq logo is not a valid JPEG');\n  }\n\n  let offset = 2;\n  while (offset < buffer.length) {\n    if (buffer[offset] !== 0xff) {\n      offset += 1;\n      continue;\n    }\n\n    let marker = buffer[offset + 1];\n    while (marker === 0xff) {\n      offset += 1;\n      marker = buffer[offset + 1];\n    }\n\n    const standalone = marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01;\n    if (standalone) {\n      offset += 2;\n      continue;\n    }\n\n    if (offset + 3 >= buffer.length) break;\n    const length = (buffer[offset + 2] << 8) + buffer[offset + 3];\n    if (length < 2 || offset + 2 + length > buffer.length) break;\n\n    const isStartOfFrame = [\n      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,\n      0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,\n    ].includes(marker);\n\n    if (isStartOfFrame) {\n      const height = (buffer[offset + 5] << 8) + buffer[offset + 6];\n      const width = (buffer[offset + 7] << 8) + buffer[offset + 8];\n      return { width, height };\n    }\n\n    offset += 2 + length;\n  }\n\n  throw new Error('Could not determine Ginoteq logo dimensions');\n}\n\nconst ginoteqLogoPath = path.join(dir, 'ginoteq-logo.jpg');\nconst ginoteqLogoBytes = await readFile(ginoteqLogoPath);\nconst { width: ginoteqLogoWidth, height: ginoteqLogoHeight } = getJpegDimensions(ginoteqLogoBytes);\nconst ginoteqEmbeddedLogo = ginoteqLogoBytes.toString('base64');\nconst ginoteqFaviconSvg = \\`<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\n<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 \\${ginoteqLogoHeight} \\${ginoteqLogoHeight}\\" role=\\"img\\" aria-label=\\"Ginoteq\\">\n  <image href=\\"data:image/jpeg;base64,\\${ginoteqEmbeddedLogo}\\" x=\\"0\\" y=\\"0\\" width=\\"\\${ginoteqLogoWidth}\\" height=\\"\\${ginoteqLogoHeight}\\"/>\n</svg>\n\\`;\nawait writeFile(path.resolve('public/favicon.svg'), ginoteqFaviconSvg, 'utf8');\nconsole.log(\\`[assets] favicon rebuilt from the Ginoteq G mark (\\${ginoteqLogoHeight}x\\${ginoteqLogoHeight} crop)\\`);\n`;
}
await writeFile(assetToolPath, assetTool, 'utf8');

const indexPath = 'index.html';
let indexHtml = await readFile(indexPath, 'utf8');
indexHtml = indexHtml.replace(
  /href="\/favicon\.svg(?:\?[^\"]*)?"/,
  'href="/favicon.svg?v=ginoteq-brand-g-20260909"',
);
await writeFile(indexPath, indexHtml, 'utf8');

console.log(`Reconstructed Ginoteq source (${archive.length} bytes), applied subscription proxy, and branded favicon patch.`);
