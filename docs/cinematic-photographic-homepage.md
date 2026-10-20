# Photographic Ginoteq homepage hero (October 2026)

## What changed
- `public/assets/ginoteq-cinematic-hero.webp` is the optimized, approximately 21 KB *illustrative* still image. It combines stylized representations of AKHA AI, SPAKUL and African infrastructure. The image is a conceptual visual, **not actual product interface evidence**, and any figures rendered within it are fictional.
- `deploy/apply-cinematic-photo.mjs` safely attaches `gino-photo-hero` to the existing responsive homepage, checks that the image exists and appends CSS. It does not alter navigation, text, links, subscription forms or backend logic.
- `deploy/cinematic-photo-hero.css` positions the local photograph behind the hero, darkens the copy area, hides the old network graphic and adapts to mobile screens.
- `package.json` runs the new patch immediately after `apply-responsive-layout.mjs` because the site reconstructs its React source from an archive on every build.
- PR CI runs on Node 24 and validates the generated build and the asset.

## Build and test
`npm install --no-audit --no-fund && npm run build`

Check both desktop and mobile: headline/button readability, the network diagram is gone, links and newsletter still work, background image loads from `/assets/ginoteq-cinematic-hero.webp`, and no overflow. Use a private browser window to rule out asset caching. Confirm homepage SEO and route navigation. Changes should only merge when Vercel preview is green.

## How it works
The CDN serves the bundled WebP from Vercel's static `public/assets`. The original React markup remains interactive. Decorative pseudo-elements have `pointer-events: none`, and the original glowing network illustration is suppressed only inside the hero. The image adds no third-party requests and no runtime JavaScript.

## Limitations and next iteration
This is **a still photographic hero**, not a moving video or actual AKHA/SPAKUL footage. Video requires rights-cleared clips/exports, mobile data safeguards, a poster and reduced-motion behavior. It should be reviewed independently; don't misrepresent fictional on-screen metrics as customer or product outcomes.

## Rollback
Revert this PR or remove the cinematic build-step invocation from `package.json` and redeploy. No database changes or migrations.
