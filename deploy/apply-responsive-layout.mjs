import { readFile, writeFile } from 'node:fs/promises';

const MARKER = 'GINOTEQ_RESPONSIVE_LAYOUT_V1';

async function patch(path, replacements) {
  let text = await readFile(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!text.includes(from)) {
      if (text.includes(to)) continue;
      throw new Error(`Responsive patch target not found in ${path}: ${from.slice(0, 120)}`);
    }
    text = text.replaceAll(from, to);
  }
  await writeFile(path, text, 'utf8');
}

await patch('src/pages/HomePage.jsx', [
  [
    'className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8"',
    'className="gino-shell flex h-[72px] items-center justify-between"',
  ],
  [
    'className="relative mx-auto flex min-h-[75vh] max-w-[1180px] flex-col items-start justify-center px-5 pb-16 pt-[124px] sm:px-8 md:flex-row md:items-center md:pt-[108px]"',
    'className="gino-shell relative flex min-h-[75vh] flex-col items-start justify-center pb-16 pt-[124px] md:flex-row md:items-center md:pt-[108px] xl:min-h-[78vh]"',
  ],
  [
    'className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12"',
    'className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] md:gap-12 xl:grid-cols-[1.15fr_0.85fr] xl:gap-20 2xl:gap-24"',
  ],
  [
    'className="font-display mt-5 text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"',
    'className="gino-hero-title font-display mt-5 font-medium leading-[1.04] tracking-tight"',
  ],
  [
    'className="mx-auto aspect-square w-full max-w-[280px] pointer-events-none sm:max-w-[340px] md:max-w-[420px]"',
    'className="mx-auto aspect-square w-full max-w-[280px] pointer-events-none sm:max-w-[340px] md:max-w-[440px] xl:max-w-[520px] 2xl:max-w-[580px]"',
  ],
  [
    'className="mx-auto max-w-[1180px] px-5 sm:px-8"',
    'className="gino-shell"',
  ],
  [
    'className="mt-10 grid gap-5 sm:grid-cols-3"',
    'className="mt-10 grid gap-5 md:grid-cols-3 lg:gap-6 2xl:gap-8"',
  ],
  [
    'className="h-full rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(47,107,255,0.35)]"',
    'className="h-full rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(47,107,255,0.35)] xl:p-8"',
  ],
  [
    'className="mx-auto max-w-[1000px] px-5 sm:px-8"',
    'className="gino-shell-content"',
  ],
  [
    'className="grid items-start gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12"',
    'className="grid items-start gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12 xl:grid-cols-[0.7fr_1.3fr] xl:gap-20"',
  ],
  [
    'className="mx-auto w-full max-w-[300px]"',
    'className="mx-auto w-full max-w-[300px] xl:max-w-[360px]"',
  ],
  [
    'className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-5 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left"',
    'className="gino-shell flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"',
  ],
]);

await patch('src/pages/UpdatesPage.jsx', [
  [
    'className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8"',
    'className="gino-shell flex h-[72px] items-center justify-between"',
  ],
  [
    'className="mx-auto max-w-[760px] px-5 pt-[124px] pb-24 sm:px-8 md:pt-[108px]"',
    'className="gino-updates-shell pt-[124px] pb-24 md:pt-[108px]"',
  ],
]);

await patch('src/pages/ArticlePage.jsx', [
  [
    'className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8"',
    'className="gino-shell flex h-[72px] items-center justify-between"',
  ],
  [
    'className="mx-auto max-w-[760px] px-5 pt-[124px] pb-24 sm:px-8 md:pt-[108px]"',
    'className="gino-reading-shell pt-[124px] pb-24 md:pt-[108px]"',
  ],
]);

const cssPath = 'src/index.css';
let css = await readFile(cssPath, 'utf8');
if (!css.includes(MARKER)) {
  css += `\n\n/* ${MARKER}\n   Fluid site shells: wide enough for laptops/desktop monitors without allowing\n   long-form copy to become unreadably wide on ultrawide displays. */\n.gino-shell,\n.gino-shell-content,\n.gino-updates-shell,\n.gino-reading-shell {\n  width: calc(100% - clamp(2.5rem, 7vw, 8rem));\n  margin-inline: auto;\n}\n\n.gino-shell {\n  max-width: 1800px;\n}\n\n.gino-shell-content {\n  max-width: 1440px;\n}\n\n.gino-updates-shell {\n  max-width: 1040px;\n}\n\n.gino-reading-shell {\n  max-width: 860px;\n}\n\n.gino-hero-title {\n  font-size: clamp(2.5rem, 4.1vw, 5.25rem);\n}\n\n@media (max-width: 639px) {\n  .gino-shell,\n  .gino-shell-content,\n  .gino-updates-shell,\n  .gino-reading-shell {\n    width: calc(100% - 2.5rem);\n  }\n\n  .gino-hero-title {\n    font-size: 2.5rem;\n    line-height: 1.08;\n  }\n}\n\n@media (min-width: 1920px) {\n  .gino-shell {\n    max-width: 1920px;\n  }\n\n  .gino-shell-content {\n    max-width: 1560px;\n  }\n}\n`;
  await writeFile(cssPath, css, 'utf8');
}

console.log('[layout] Ginoteq responsive shell and large-screen layout applied');
