# Ginoteq cinematic moving homepage: Sites rollout

**Public website host:** ChatGPT Sites project `appgprj_6ad61c00958c8191aa35ec582458f2a4`, currently responsible for `ginoteqgroup.com` and `www.ginoteqgroup.com`. Vercel is a separate React preview/codebase; merging GitHub alone does **not** change the Sites website.

## Film media (15 seconds, real motion)

AI-generated illustrative footage, not documentary evidence or actual customer projects. It contains: construction measuring, car wash service and an engineer interacting with a workstation.

- Public H.264 MP4: `https://d2ol7oe51mr4n9.cloudfront.net/user_3Kdwr1NqphQ3AQUnvNY21TF1Oz7/1f8b2e43-28a9-4023-a8fe-b7021a42be66.mp4`
- Exact video SHA-256: `4a5c27fdf5409a4995ff00295faebdf19c3159bc9776400a34f11c745babeb5e`
- 1280 × 720, 24fps, H.264, ~1.16 MB, audio removed, ~15.17 seconds.
- Poster artwork: `public/assets/ginoteq-cinematic-hero.webp` in this repository, or the Site's corresponding uploaded copy.

## How to port to the **existing** Ginoteq Site

1. Open the existing Site in ChatGPT Work. Inspect its current hero component and media asset handling before editing; do not create a new Site or switch its domain.
2. Add the MP4 as a **hosted Site asset** when file upload/media storage is supported. If not, reference the above HTTPS media URL; document that CDN media availability depends on the external host.
3. Add an actual `<video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1}>` with an MP4 source. Position absolutely within hero, `object-fit: cover; pointer-events:none`. Keep video behind a dark left-side gradient and above the static poster fallback.
4. Retain all existing **real** headline text, CTA buttons, logo, navigation, links, newsletter and project content. Do not import any of the previously AI-generated *full-page screenshot* assets as the background.
5. Remove the original decorative glowing-node network from the hero to prevent overlaps; avoid hiding unrelated UI.
6. Respect reduced motion: prefer a poster when `prefers-reduced-motion` is active. On narrow screens or a device with data saver, default to a poster (not downloading the film).
7. Test desktop and mobile. Verify legibility, accessible keyboard controls, no layout shift, muted autoplay/loop, no network overlay, original CTA and subscription interactions, fallbacks, and no measurable degradation of Largest Contentful Paint.
8. Publish the EXISTING Site and verify `https://ginoteqgroup.com` directly. Do not touch DNS, MX, SPF, DKIM, other TXT, Resend settings or Vercel production aliases.

## Parallel Vercel implementation for source reference

- `deploy/apply-cinematic-video.mjs` safely injects the film after `apply-cinematic-photo.mjs` into the archived React homepage.
- `deploy/cinematic-video-hero.css` handles layout, overlay stacking, mobile and reduced-motion.
- `public/assets/ginoteq-cinematic-hero.webp` remains the fallback.

The MP4 is hosted on an external CDN rather than checked into this repository. The poster remains inside the GitHub project. A verified same-domain Site media upload is preferable for long-term operations. In the meantime, the source and checksum are pinned above.

## Rollback

Remove the video layer, retain the existing poster/hero content, redeploy the same Site. No data migrations, new accounts, permissions or DNS changes.
