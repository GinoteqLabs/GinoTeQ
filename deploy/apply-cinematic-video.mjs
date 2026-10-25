import { readFile, writeFile, stat } from 'node:fs/promises';

// The HomePage source is reconstructed during every build. Inject only after
// deploy/apply-cinematic-photo.mjs has added the background and gradient.
const pagePath = 'src/pages/HomePage.jsx';
const marker = 'GINOTEQ_CINEMATIC_VIDEO_V1';
const anchor = 'className="gino-shell gino-photo-hero relative flex min-h-[75vh] flex-col items-start justify-center pb-16 pt-[124px] md:flex-row md:items-center md:pt-[108px] xl:min-h-[78vh]">';
const componentPath = 'src/components/GinoteqCinematicVideo.jsx';
const importLine = "import GinoteqCinematicVideo from '../components/GinoteqCinematicVideo.jsx';";

// Fail the build if the conditional playback implementation is absent.
const component = await stat(componentPath);
if (!component.isFile()) throw Error('Ginoteq video component missing: ' + componentPath);

let page = await readFile(pagePath, 'utf8');
if (page.includes(marker) || page.includes(importLine)) {
  throw Error('Cinematic video already injected; rebuilt homepage expected.');
}
const matches = page.split(anchor).length - 1;
if (matches !== 1) throw Error('Expected one homepage stage; found ' + matches);

const film = `
  {/* ${marker}: desktop-only decorative film, with reduced-motion/mobile/data-saver gating. */}
  <GinoteqCinematicVideo />`;
page = importLine + '\n' + page.replace(anchor, anchor + film);
await writeFile(pagePath, page, 'utf8');

const stylePath = 'src/index.css';
let css = await readFile(stylePath, 'utf8');
css += '\n' + await readFile('deploy/cinematic-video-hero.css', 'utf8');
await writeFile(stylePath, css, 'utf8');
console.log('[video] Ginoteq film mounted only on eligible desktop devices; poster for all others.');
