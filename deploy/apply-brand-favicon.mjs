import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function getJpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    throw new Error('Ginoteq logo is not a valid JPEG');
  }

  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    let marker = buffer[offset + 1];
    while (marker === 0xff) {
      offset += 1;
      marker = buffer[offset + 1];
    }

    const standalone =
      marker === 0xd8 ||
      marker === 0xd9 ||
      (marker >= 0xd0 && marker <= 0xd7) ||
      marker === 0x01;

    if (standalone) {
      offset += 2;
      continue;
    }

    if (offset + 3 >= buffer.length) break;
    const length = (buffer[offset + 2] << 8) + buffer[offset + 3];
    if (length < 2 || offset + 2 + length > buffer.length) break;

    const isStartOfFrame = [
      0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
      0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
    ].includes(marker);

    if (isStartOfFrame) {
      const height = (buffer[offset + 5] << 8) + buffer[offset + 6];
      const width = (buffer[offset + 7] << 8) + buffer[offset + 8];
      return { width, height };
    }

    offset += 2 + length;
  }

  throw new Error('Could not determine Ginoteq logo dimensions');
}

const logoPath = path.resolve('public/assets/ginoteq-logo.jpg');
const logoBytes = await readFile(logoPath);
const { width, height } = getJpegDimensions(logoBytes);
const embeddedLogo = logoBytes.toString('base64');

// The Ginoteq wordmark is horizontal and the branded G occupies the left-most
// square. A square SVG viewport therefore crops the exact G pixels while
// excluding the wordmark text to its right.
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${height} ${height}" role="img" aria-label="Ginoteq">
  <image href="data:image/jpeg;base64,${embeddedLogo}" x="0" y="0" width="${width}" height="${height}" />
</svg>
`;

await writeFile(path.resolve('public/favicon.svg'), faviconSvg, 'utf8');
console.log(`[brand] favicon rebuilt from Ginoteq logo G (${height}x${height} left crop)`);
