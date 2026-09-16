import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const SITE_URL = 'https://ginoteqgroup.com';
const MARKER_START = '<!-- GINOTEQ_SEO_INDEXING_V1_START -->';
const MARKER_END = '<!-- GINOTEQ_SEO_INDEXING_V1_END -->';

const homepageTitle = 'Ginoteq | South African AI & Software Technology Company';
const homepageDescription =
  'Ginoteq is a South African technology company building practical AI and software solutions for real-world industries, including AKHA AI and SPAKUL.';

const xmlEscape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

async function collectSourceText() {
  try {
    const files = (await walk('src')).filter((file) =>
      ['.js', '.jsx', '.ts', '.tsx'].includes(extname(file)),
    );
    const chunks = [];
    for (const file of files) chunks.push(await readFile(file, 'utf8'));
    return chunks.join('\n');
  } catch {
    return '';
  }
}

function normaliseRoute(route) {
  if (!route) return null;
  if (/^(https?:|mailto:|tel:|#)/i.test(route)) return null;
  if (route === '*') return null;
  let value = route.trim();
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/+$/, '') || '/';
  return value;
}

function discoverRoutes(source) {
  const routes = new Set(['/']);
  const routePatterns = [
    /<Route\b[^>]*\bpath\s*=\s*["']([^"']+)["']/g,
    /\bpath\s*:\s*["']([^"']+)["']/g,
  ];

  const dynamicRoutes = [];
  for (const pattern of routePatterns) {
    for (const match of source.matchAll(pattern)) {
      const route = normaliseRoute(match[1]);
      if (!route) continue;
      if (route.includes(':') || route.includes('*')) dynamicRoutes.push(route);
      else routes.add(route);
    }
  }

  // The current site has an Updates page; retain it even if routing syntax changes.
  if (source.includes('UpdatesPage')) routes.add('/updates');

  // If content objects expose slugs, combine them with any :slug route so article
  // pages can be submitted in the sitemap without manually maintaining a list.
  const slugs = new Set();
  for (const match of source.matchAll(/\bslug\s*:\s*["'`]([a-z0-9][a-z0-9\/_-]*)["'`]/gi)) {
    slugs.add(match[1].replace(/^\/+|\/+$/g, ''));
  }

  for (const route of dynamicRoutes) {
    if (!route.includes(':slug')) continue;
    for (const slug of slugs) routes.add(route.replace(':slug', slug));
  }

  return [...routes].sort((a, b) => a.localeCompare(b));
}

function buildSitemap(routes) {
  const urls = routes
    .map((route) => `  <url>\n    <loc>${xmlEscape(`${SITE_URL}${route === '/' ? '/' : route}`)}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function routeSeoScript() {
  return `<script id="ginoteq-route-seo">
(function () {
  var path = window.location.pathname.replace(/\\/+$/, '') || '/';
  var title = ${JSON.stringify(homepageTitle)};
  var description = ${JSON.stringify(homepageDescription)};

  if (path === '/updates') {
    title = 'Ginoteq Updates | AI, Software & Product News';
    description = 'Read Ginoteq updates on AI, software products, AKHA AI, SPAKUL and the company\'s technology work in South Africa.';
  } else if (path.startsWith('/updates/') || path.startsWith('/article/')) {
    title = 'Ginoteq Insights | AI, Software & Product Updates';
    description = 'Insights and updates from Ginoteq on practical AI, software, technology products and real-world innovation.';
  }

  document.title = title;

  var desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement('meta');
    desc.setAttribute('name', 'description');
    document.head.appendChild(desc);
  }
  desc.setAttribute('content', description);

  var canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', ${JSON.stringify(SITE_URL)} + (path === '/' ? '/' : path));

  var ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', canonical.getAttribute('href'));
})();
</script>`;
}

const source = await collectSourceText();
const routes = discoverRoutes(source);

await mkdir('public', { recursive: true });
await writeFile(
  'public/robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  'utf8',
);
await writeFile('public/sitemap.xml', buildSitemap(routes), 'utf8');

const indexPath = 'index.html';
let html = await readFile(indexPath, 'utf8');

// Remove accidental global noindex directives if one was inherited from a preview build.
html = html.replace(/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["'][^>]*>\s*/gi, '');
html = html.replace(/<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["'][^>]*>\s*/gi, '');

if (html.includes(MARKER_START) && html.includes(MARKER_END)) {
  const start = html.indexOf(MARKER_START);
  const end = html.indexOf(MARKER_END) + MARKER_END.length;
  html = html.slice(0, start) + html.slice(end);
}

html = html.replace(/<title>[^<]*<\/title>/i, `<title>${homepageTitle}</title>`);
html = html.replace(/<meta\s+name=["']description["'][^>]*>\s*/i, '');

const seoBlock = `${MARKER_START}
<meta name="description" content="${homepageDescription}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="author" content="Ginoteq">
<meta property="og:site_name" content="Ginoteq">
<meta property="og:type" content="website">
<meta property="og:title" content="${homepageTitle}">
<meta property="og:description" content="${homepageDescription}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${homepageTitle}">
<meta name="twitter:description" content="${homepageDescription}">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ginoteq',
  url: SITE_URL,
  description: homepageDescription,
  areaServed: {
    '@type': 'Country',
    name: 'South Africa',
  },
  knowsAbout: [
    'Artificial intelligence',
    'Software development',
    'Construction technology',
    'Digital platforms',
  ],
})}</script>
${routeSeoScript()}
${MARKER_END}`;

html = html.replace(/<\/head>/i, `${seoBlock}\n</head>`);
await writeFile(indexPath, html, 'utf8');

console.log(`[seo] Ginoteq indexing foundation applied; sitemap routes: ${routes.join(', ')}`);
