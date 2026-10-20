import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

// Source is reconstructed by bootstrap.mjs, then normalized by the responsive
// layout step. Apply this change *after* that step, never to the archive itself.
const pagePath = 'src/pages/HomePage.jsx';
const componentDir = 'src/components';
const anchor = 'className="gino-shell relative flex min-h-[75vh] flex-col items-start justify-center pb-16 pt-[124px] md:flex-row md:items-center md:pt-[108px] xl:min-h-[78vh]"';
const updatedAnchor = anchor.replace('gino-shell relative', 'gino-shell gino-hero-stage relative');
const importLine = "import GinoteqCinematicHero from '../components/GinoteqCinematicHero';";

let homepage = await readFile(pagePath, 'utf8');

if (!homepage.includes('<GinoteqCinematicHero />')) {
  // Fail loudly if the archived JSX changes. A broken build is safer than
  // silently shipping a homepage that omitted the new experience.
  if (!homepage.includes(anchor + '>')) {
    throw new Error('Ginoteq cinematic hero injection point missing in HomePage.jsx; inspect upstream homepage markup.');
  }
  const count = homepage.split(anchor + '>').length - 1;
  if (count !== 1) {
    throw new Error('Ginoteq cinematic hero expected exactly one homepage hero; found ' + count);
  }
  homepage = homepage.replace(anchor + '>', updatedAnchor + '>\n      <GinoteqCinematicHero />');
  homepage = importLine + '\n' + homepage;
} else if (!homepage.includes('gino-hero-stage')) {
  throw new Error('Cinematic hero already mounted but its stage CSS class is missing');
}

await mkdir(componentDir, { recursive: true });
await copyFile('deploy/GinoteqCinematicHero.jsx', componentDir + '/GinoteqCinematicHero.jsx');
await copyFile('deploy/GinoteqCinematicHero.css', componentDir + '/GinoteqCinematicHero.css');
await writeFile(pagePath, homepage, 'utf8');

console.log('[cinema] Ginoteq homepage cinematic story layer installed. Video:', process.env.VITE_GINOTEQ_HERO_VIDEO_URL ? 'configured' : 'decorative fallback');
