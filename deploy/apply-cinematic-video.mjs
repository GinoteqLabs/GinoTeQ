import { readFile, writeFile } from 'node:fs/promises';

// The HomePage source is reconstructed during every build. Inject only after
// deploy/apply-cinematic-photo.mjs has added the background and gradient.
const pagePath = 'src/pages/HomePage.jsx';
const marker = 'GINOTEQ_CINEMATIC_VIDEO_V1';
const anchor = 'className="gino-shell gino-photo-hero relative flex min-h-[75vh] flex-col items-start justify-center pb-16 pt-[124px] md:flex-row md:items-center md:pt-[108px] xl:min-h-[78vh]">';
const videoUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3Kdwr1NqphQ3AQUnvNY21TF1Oz7/1f8b2e43-28a9-4023-a8fe-b7021a42be66.mp4';

let page = await readFile(pagePath,'utf8');
if (page.includes(marker)) throw Error('Cinematic video already injected; rebuilt homepage expected.');
const matches = page.split(anchor).length-1;
if (matches !== 1) throw Error('Expected one homepage stage; found '+matches);
const video = `
  {/* ${marker}: decorative, autoplay-muted moving showreel. */}
  <video className="gino-video-backdrop" aria-hidden="true" tabIndex={-1}
    autoPlay muted loop playsInline preload="metadata"
    poster="/assets/ginoteq-cinematic-hero.webp"
    disablePictureInPicture>
    <source src="${videoUrl}" type="video/mp4" />
  </video>`;
page = page.replace(anchor, anchor+video);
await writeFile(pagePath,page,'utf8');
const stylePath='src/index.css';
let css=await readFile(stylePath,'utf8');
css += '\n'+await readFile('deploy/cinematic-video-hero.css','utf8');
await writeFile(stylePath,css,'utf8');
console.log('[video] Ginoteq cinematic moving hero mounted over safe photo fallback.');
