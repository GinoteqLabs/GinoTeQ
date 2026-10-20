# Ginoteq Website — Vercel codebase

This repository contains the original React/Vite Ginoteq website and is connected to a Vercel production deployment.

## Important: public domain host

As verified on 20 October 2026, **ginoteqgroup.com and www.ginoteqgroup.com are routed to the Ginoteq ChatGPT Site, not to this Vercel deployment**. Changing `main` here updates the Vercel deployment but does **not** update the live `ginoteqgroup.com` homepage.

Current public Site:
- Ginoteq Site project ID: `appgprj_6ad61c00958c8191aa35ec582458f2a4`
- Its Sites URL: https://ginoteq-group.sturdywood512.chatgpt.site
- The DNS `www` CNAME currently resolves through `custom-domains.chatgpt.site`.

Vercel deployment of the parallel codebase:
- https://ginoteq-site-final-candidate.vercel.app/
- The GitHub Vercel build uses Node 24 and reconstructs the source from `deploy/source.part.*`.

**Do not change DNS to Vercel or assume GitHub changes appear on the public domain without a deliberate hosting decision.** Protect existing MX, TXT, Resend and DKIM records.

## Cinematic photographic hero

PR #7 (merged 20 October 2026) added an optimized background image and styling to the **Vercel codebase** only:
- `public/assets/ginoteq-cinematic-hero.webp`
- `deploy/apply-cinematic-photo.mjs`
- `deploy/cinematic-photo-hero.css`
- `docs/cinematic-photographic-homepage.md`

To make this visual live on `ginoteqgroup.com`, port the same design into the *existing Ginoteq Site project in place*, preserving all its current routes, newsletter and branding. Do not create a duplicate Site or switch hosting implicitly.

The photographic illustration is conceptual: any mock user interfaces or numbers should not be represented as verified business metrics.
