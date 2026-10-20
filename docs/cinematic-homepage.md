# Ginoteq cinematic homepage — preview branch

## Goal
Make the homepage tell the story of Ginoteq's real work without replacing its existing SEO content, CTAs, navigation, newsletter, or responsive layout. This change is isolated to the homepage hero. It has no external media requests in its default configuration.

## Architecture and data flow
1. `bootstrap.mjs` reconstructs the original Vite/React source from `deploy/source.part.*`.
2. `deploy/apply-responsive-layout.mjs` applies the existing layout modifications.
3. **New:** `deploy/apply-cinematic-hero.mjs` locates the single expected hero container, adds `gino-hero-stage` and the decorative `<GinoteqCinematicHero />`, and copies two maintained files into `src/components/`.
4. Vite compiles the original site with the component attached. The original content remains unchanged.
5. The component displays four animated graphical story scenes: AKHA AI, operational engineering, SPAKUL and the Ginoteq identity.

Maintained source-of-truth files:
- `deploy/GinoteqCinematicHero.jsx` — SVG/UI decorations, animation scenes, optional video fallback.
- `deploy/GinoteqCinematicHero.css` — transitions, background gradients, mobile and reduced-motion handling.
- `deploy/apply-cinematic-hero.mjs` — safe build-time integration with archive-reconstructed app.
- `package.json` — ordering of build steps.

**Do not edit generated `src/components/` directly**: the next build overwrites it. The injection deliberately throws if the old archived homepage structure no longer matches. This fails closed instead of silently losing the enhancement.

## Adding actual Ginoteq footage (next content gate)
Provide approved real footage or product screen recordings. Export a muted, loop-friendly H.264 MP4, ideally 1280x720, roughly 12–16 seconds, with a small web transfer size (target ~2–5 MB; use measured Web Vitals rather than a hard limit). Avoid customer names, personal data, confidential operational dashboards and unverified statistics.

Upload the file to a public static-media endpoint/CDN controlled by Ginoteq, then set the **public Vite build-time** variable `VITE_GINOTEQ_HERO_VIDEO_URL` to its HTTPS URL. The React component only mounts video when the variable is set and returns to the decorative scenes on a media error. This is not a secret; do not put credentials in the URL. Keep media rights and permissions documented.

Without that URL, the homepage shows animated graphic scenes. **No actual video footage is included in this PR**, and graphical mock interfaces must not be presented as real usage statistics.

## Manual verification before merging
1. `npm install --no-audit --no-fund`; `npm run build` using Node 24.
2. Inspect the PR preview deployment on desktop and on a 360–400px mobile viewport.
3. Confirm the existing header, founder/portfolio CTAs, updates links, newsletter and all other page sections still work.
4. Verify heading text contrast throughout all four cycles. Confirm no graphic intercepts pointer clicks.
5. Enable OS/browser reduced motion: only the first static scene should remain, and any video should be hidden.
6. Throttle mobile to a slow network: verify first render does not wait on media or induce layout shifts.
7. Verify page source retains existing canonical/SEO tags, favicon, and analytics.
8. If real video is configured, disable it and test the animated fallback; also test a failing video URL.

## Rollback
Revert the branch/PR, or remove `node deploy/apply-cinematic-hero.mjs &&` from the build chain and redeploy. No data migrations or backend changes.
