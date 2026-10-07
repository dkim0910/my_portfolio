#!/usr/bin/env node
/**
 * Regenerate sitemap.xml with <lastmod> read from git.
 *
 * The dates were hand-written. They happen to be correct right now, which is
 * exactly why this is worth automating before they stop being: Google only
 * honours lastmod when it is "consistently and verifiably accurate", and a
 * date that contradicts the Last-Modified header gets the signal discarded
 * for the whole site rather than merely ignored. Hand-kept dates rot silently
 * — the next content edit that forgets this file starts the lying.
 *
 * Do NOT swap this for `new Date()`: that makes every URL claim it changed on
 * every build, which is the same falsifiable pattern and never self-corrects.
 *
 * Usage:
 *   npm run seo:sitemap        # run AFTER committing — see the warning below
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ORIGIN = 'https://nelera.net';

// Each indexable URL, paired with the files whose last commit date IS that
// page's last-modified date. The homepage's content lives across three files,
// so its lastmod is the newest of them — a CSS-only change really does change
// what a visitor sees. 404.html is absent on purpose: it is noindex.
const ROUTES = [
  {
    loc: '/',
    sources: ['index.html', 'style.css', 'script.js'],
    changefreq: 'monthly',
    priority: '1.0',
    // Kept in the order the projects appear on the page; og-image last.
    images: [
      'geesly_image.webp', 'booklist4u_image.webp', 'Nelera_image.webp',
      'canontrails_image.webp', 'my_website_image.webp',
      'bestscreentester_image.webp', 'maxcandela_image.webp', 'honestmrr_image.webp',
      'og-image.jpg',
    ].map((f) => `${ORIGIN}/images/${f}`),
  },
  {
    loc: '/donate.html',
    sources: ['donate.html', 'style.css'],
    changefreq: 'yearly',
    priority: '0.5',
  },
];

const git = (args) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

const dirty = [];
for (const r of ROUTES) {
  for (const src of r.sources) {
    // A file edited but not committed would get its PREVIOUS commit's date,
    // silently publishing a lastmod older than the content. Say so loudly.
    if (git(['status', '--porcelain', '--', src])) dirty.push(src);
  }
  const dates = r.sources.map((s) => git(['log', '-1', '--format=%cI', '--', s]).slice(0, 10));
  if (dates.some((d) => !d)) throw new Error(`no git history for ${r.loc} — run in a full clone`);
  r.lastmod = dates.sort().at(-1); // ISO dates sort lexicographically
}

const body = ROUTES.map((r) => {
  const imgs = (r.images ?? [])
    .map((u) => `\n        <image:image><image:loc>${u}</image:loc></image:image>`)
    .join('');
  return `    <url>\n        <loc>${ORIGIN}${r.loc}</loc>\n` +
         `        <lastmod>${r.lastmod}</lastmod>\n` +
         `        <changefreq>${r.changefreq}</changefreq>\n` +
         `        <priority>${r.priority}</priority>${imgs}\n    </url>`;
}).join('\n');

writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  `${body}\n</urlset>\n`);

for (const r of ROUTES) console.log(`  ${r.lastmod}  ${r.loc}`);
if (dirty.length) {
  console.warn(`\nWARNING: uncommitted changes in ${[...new Set(dirty)].join(', ')} — their ` +
    `<lastmod> reflects the last COMMIT, not your working tree. Commit, then re-run.`);
  process.exitCode = 1;
}
