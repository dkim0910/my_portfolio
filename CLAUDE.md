# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Daniel Kim's personal portfolio — clean HTML, CSS, and vanilla JavaScript targeted at recruiters for software
engineering and for data center / network / cloud support roles. No framework, no bundler, no build step. The only
dependency is `live-server` for local development with auto-reload. Brand mark: `favicon-96.png` (from
`images/my_portfolio_logo.png`).

Since 2026-11-28 the design is the **"Ops Console"**: the site is styled like an infrastructure dashboard — ten
"services", where each runs and how it deploys, and a live reachability check run from the visitor's browser —
pitching "I write the code, and I run the servers it lives on."

## Preview

```sh
npm install
npm start     # live-server on http://localhost:5500 via 'dev' script
```

## Page structure

Main page (`index.html`) is one page, top to bottom. `donate.html` is a standalone page linked from the footer, and
`404.html` is the GitHub Pages error page (`noindex`). All three share the sticky header (`.hdr`: crumb
`daniel-kim / <page>`, GitHub + Resume buttons, section tabs) and the footer (`.foot`, which holds the only Donate link).

1. **Header** — crumb with a `10 services` badge, tabs (Overview / Services / Architecture / Runbook / Contact) with a
   scrollspy, and a live `N/9 domains reachable` counter (hidden under 760px).
2. **Overview** (`#overview`) — headline, lede, Resume / Copy email / LinkedIn buttons, the **availability panel**
   (roles, authorization, location, languages, education — keep in agreement with the resume), and a 5-stat row
   (10 projects, 4 self-hosted, 3 store apps, 17,000+ Geesly downloads, live domains count).
3. **Services** (`#services`) — filter chips (All / Self-hosted / Static / Firebase / App stores / On-chain, driven by
   `data-filter` and each row's `data-tags`), the live-check status + Re-check button, and the services table. The
   table bar has **Open all / Close all** (expands every visible row) and **Open all N in tabs** (opens each visible
   row's first link; skips the portfolio's own row; browsers allow one tab per click unless pop-ups are allowed, and
   the page says so in `[data-bulk-note]`). Rows are in **creation order, oldest first**: Geesly, BookList4U, NELA,
   CanonTrails, nelera.net, Animaruni, Runnertic (the one **team** project — `team` badge, and its JSON-LD uses
   `contributor`, not `author`), BestScreenTester, MaxCandela, Honest MRR. On desktop the first row starts open.
4. **Architecture** (`#architecture`) — an inline SVG ("How it's wired": GitHub → GitHub Actions → self-hosted
   Docker + Postgres / GitHub Pages; Firebase · Google Cloud; Solana; native macOS; Cloudflare; the four stores; and a
   dashed **Amazon Web Services · coming soon** box). Under 1080px the SVG is swapped for stacked `.lane` cards, which
   must carry the same content. The service dots (`data-dot`) reuse the live checks.
5. **Runbook** (`#runbook`) — five numbered habits, each tied to a real project; the Supreme Court security-officer
   card; the tool inventory.
6. **Contact** (`#contact`) — LinkedIn / Resume buttons and a channel list (email, LinkedIn, GitHub, resume).

## Design system

Palette and type live in `:root` in `style.css` — edit the variables, don't hardcode colors:

- Surfaces: `--bg #0b0c0e`, `--bg-2`, `--panel #111316`, `--panel-2`, `--hover`; lines `--line`, `--line-2`, `--line-3`
- Text: `--text #e8eaed`, `--text-2`, `--muted #8d949e`, `--dim #636a74`
- Status colors, used sparingly: `--green` (reachable / open to work), `--amber` (no response, `team` badge,
  "coming soon"), `--violet` (on-chain); `--link` for focus rings
- Type: Inter (`--sans`) for prose, JetBrains Mono (`--mono`) for labels and data, both from Google Fonts

Hairline borders and flat panels (`.panel`). Primary buttons are light (`.btn-primary`), the rest outlined (`.btn`,
`.btn-sm`). No gradient text, glass cards, or pill eyebrows — section labels are mono `.sec-label` ("01 · services").

## SEO

All three pages carry the same head contract — keep them in sync when you touch one:

- `<title>`, `<meta name="description">`, `canonical`, `author`, `theme-color`
- `robots` / `googlebot` / `bingbot` with `max-image-preview:large`
- The favicon set (`favicon.svg`, `favicon-48/96/192.png`, `apple-touch-icon.png`) — Google
  Search requires a square favicon that is a **multiple of 48px**, so don't point these at
  `my_portfolio_logo.png`. The SVG is listed first so browsers that prefer a scalable icon take
  it; Google still picks a PNG. (`favicon.svg` was committed but linked from nowhere until
  2026-10-01.)
- Open Graph + Twitter cards, both using `images/og-image.jpg` (1200x630, the size social cards want)
- JSON-LD: `index.html` has `Person` + `WebSite` + `ProfilePage` + `ItemList` (10 projects);
  `donate.html` has `WebPage` + `BreadcrumbList`. `404.html` is `noindex` and carries none.

Supporting files: `robots.txt`, `sitemap.xml` (with `<image:image>` entries), and the IndexNow
key file `<key>.txt` at the root — that filename and its contents must stay identical.

`sitemap.xml` is **generated**, not hand-edited: `npm run seo:sitemap` reads each route's
`<lastmod>` from the last commit touching its source files (the homepage takes the newest of
`index.html`, `style.css`, `script.js`, since a CSS-only change really does change what a
visitor sees). The script refuses to run clean — it exits non-zero with a warning — if those
files have uncommitted changes, because that would publish a date older than the content. Run
it *after* committing. The image list lives in the script's `ROUTES` array.

`nelera.net` is already verified in both Google Search Console (Domain property) and Bing
Webmaster Tools, so no verification meta tag is needed in the head.

**Adding a project touches several places**, not one: its `<article class="svc">` row in `#svc-list` (with
`data-id`, `data-domain` unless it has no website, and `data-tags` for the filters), the architecture SVG **and** the
matching `.lane` card, the filter-chip counts, the counts in the lede / stats / `10 services` badge / `ItemList`, the
JSON-LD `itemListElement` array, the `images` array in `scripts/build-sitemap.mjs`, then
`npm run seo:sitemap && npm run seo:indexnow` (commit first — see above).

`.github/workflows/deploy.yml` strips dev-only files (`CLAUDE.md`, `README.md`, `SEO.md`,
`package*.json`, `scripts/`, `image.png`, `images/originals/`, plus `.claude`, `.github` and
`node_modules`) before uploading — GitHub Pages otherwise serves the entire repo. `robots.txt`
disallows the docs, `package*.json`, `scripts/` and `image.png` too as a backstop (it has no
rule for `images/originals/`).

Console setup steps that need Daniel's login live in `SEO.md`.

## Conventions

- Code is separated into `index.html`, `style.css`, and `script.js`. `donate.html` and `404.html` use `style.css`
  only (no script); `404.html` uses absolute paths because GitHub Pages serves it at any depth.
- **Project rows are static HTML**, not rendered by JS, so crawlers and no-JS visitors see every project.
  `script.js` only adds behaviour (expand/collapse, filters, bulk buttons, live checks, scrollspy) and returns early
  on pages without `#svc-list`.
- **Live checks** are one `fetch(..., {mode: 'no-cors'})` per row with a `data-domain`, from the visitor's browser,
  labelled as such. Never show uptime %, request counts, or any number that isn't measured on the spot.
- **Screenshots** are served as 1200px WebP from `images/` (row thumbnails and the expanded detail). Full-resolution
  PNG sources (3456×1920) live in `images/originals/` and are stripped at deploy — rebuild with
  `cwebp -q 82 -resize 1200 0 -m 6 images/originals/NAME.png -o images/NAME.webp`, then update the `<img>`
  `width`/`height` to the WebP's real size. `my_website_image` and `og-image.jpg` show this site, so re-capture
  them after a visible redesign.
- **Created** dates in the table are **creation** dates, not last-updated: they come from the first commit in each
  project's repo under `~/Codes` (NELA has no repo — its date is the Raydium pool creation, 2026-03-10, on-chain;
  Honest MRR shows its launch month, October 2026 — live on honestmrr.com 2026-10-07 — at Daniel's request, though
  its first commit is July 2026). Don't hand-edit them to "look recent".
- **Highlights** (the table's second column) are one short real number or fact per project. Blurbs in the expanded
  row are two or three sentences that open with a concrete number where one exists. Each detail ends in `.d-links`:
  the site link first (primary), then store links (App Store, Google Play, ONE store, Mac App Store) and "Source on
  GitHub" only for repos that are public (currently `bestscreentester`, `maxcandela`, `my_portfolio`).
- **Donate icons** are self-hosted in `images/donate/` — don't hotlink third-party CDNs.
- **Email** is assembled in `script.js` (`[data-email-text]`, `[data-contact="email"]` with copy-to-clipboard) to keep
  it away from scrapers, so it must not appear in the HTML or the JSON-LD.
- Breakpoints: 1180px (Created column hides), 1080px (architecture SVG → lane cards), 980px (hero and grids stack),
  880px (table rows become cards), 760px (phone spacing, header simplifies). Check 1440px and 390px with zero
  horizontal overflow.
- **Accessibility** — skip link, `aria-expanded`/`aria-controls` on rows, `aria-pressed` on filters and Open all,
  visible `:focus-visible` rings, and `prefers-reduced-motion` turns off animation (including the SVG flow dots).

## External links (keep in sync)

- GitHub: https://github.com/dkim0910
- LinkedIn: https://www.linkedin.com/in/daniel-kim-6991882b3/
- Email: hello+contact@nelera.net
- Portfolio: https://nelera.net
- Projects: geesly.net, booklist4u.com, canontrails.com, animaruni.com, runnertic.com, bestscreentester.com, maxcandela.com, honestmrr.com, and NELA's Solana Explorer page (mint `4yrL8PiijG2SQr7PBTBLmq8A4SPihAHp38oCPb8WMNcJ`, pool `vByPHYrvrrhSomsYtiEPSv8bCdtMh1pas3V1fRzG46E`). DexScreener, GeckoTerminal and Birdeye 404 on it since sniper wallets dumped ~70% of supply on 2026-05-08 (LP burned, authorities revoked — not a rug); `Nelera_image.webp` is the March 2026 DexScreener chart, kept as a record.

If these change, update both the contact section and the footer.

## TODO

### Must-have (before sharing with recruiters)
1. [x] **PNG favicon** — `favicon-48/96/192.png` + `apple-touch-icon.png`, generated from `images/my_portfolio_logo.png`
2. [x] **Resume / CV** — `Daniel_Kim_Resume.pdf` at the repo root, linked from the hero, About, and contact sections. It is a **web copy**: same wording as the private resume but with no phone number and `hello+contact@nelera.net` instead of the personal Gmail. Source and build command live in `~/Codes/resume/source/resume_web.html`; never drop the private PDF in here.
3. [x] **Hero copy** — personalize tagline and description beyond the current placeholder
4. [x] **Real screenshots** — all ten projects now have screenshots in `images/`
5. [x] **Open Graph meta** — full OG + Twitter cards on all pages, using a 1200x630 `images/og-image.jpg`
6. [x] **Mobile QA** — test layout on real phones (especially the 760px breakpoint and stack grid collapse)
7. [x] **Separation of Concerns** — Separated index, css, and js into individual files.

### Should-have (before going live)
8. [x] **Analytics** — add Google Analytics to track recruiter visits - I don't think we need this
9. [x] **Custom domain** — point nelera.net at the deployed site
10. [x] **Deploy** — live on GitHub Pages at https://nelera.net
11. [x] **Localhost Setup** — Standardized `npm start` to run on localhost:5500.

### Nice-to-have
12. [x] **Accessibility** — add `aria-label` on nav links, verify contrast ratios, keyboard tab order
13. [x] **Interactive Project Filtering** — Add category filters (Mobile, Web, Web3) to the projects section.
14. [x] **Scroll-to-Top & Reading Progress** — Add a subtle reading progress bar or back-to-top button. (Removed in the 2026-11-28 Ops Console redesign; the sticky header tabs replace it.)
15. [x] **Performance Optimization** — lazy loading, async decoding, intrinsic `width`/`height`, and 1200px WebP screenshots (12.1 MB -> 260 KB).
16. [x] **Micro-interactions** — Add hover effects to cards and "copy to clipboard" for email.
17. [x] **SEO & crawler setup** — JSON-LD structured data, image sitemap, 404 page, IndexNow, deploy-time file stripping. Console verification steps are in `SEO.md`.
