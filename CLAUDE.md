# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Daniel Kim's personal portfolio — clean HTML, CSS, and vanilla JavaScript targeted at recruiters. No framework, no bundler, no build step. The only dependency is `live-server` for local development with auto-reload. Favicon and brand mark use `images/my_portfolio_logo.png`. Dark theme with warm accent colors and subtle grain texture overlay.

## Preview

```sh
npm install
npm start     # live-server on http://localhost:5500 via 'dev' script
```

## Page structure

One-page layout, top to bottom:

1. **Nav** — brand, Projects / Stack / Contact anchors, primary "Get in touch" CTA
2. **Hero** — gradient-text tagline, "View my projects" / "Contact me" buttons, multi-color radial gradient background
3. **Tech stack** (`#stack`, banded) — 3-column grid of 6 glass cards: Frontend, Mobile, Backend & data, Cloud & services, AI, Design & planning. Each card has its own color accent (`--card-color`), gradient top bar, radial glow, and hover lift.
4. **Featured projects** (`#projects`) — seven alternating feature rows (text + mockup, swapped every other row):
   - Geesly (Flutter dating app) — plain
   - BookList4U (Next.js book-series site) — banded
   - NELA (Solana token) — plain
   - CanonTrails (Next.js game-series site) — banded
   - This portfolio — plain
   - BestScreenTester (Next.js screen-test suite) — banded
   - MaxCandela (macOS XDR brightness utility) — plain
5. **Contact** — radial-glow gradient card with Email / GitHub / LinkedIn buttons
6. **Footer** — brand, nav + social links, copyright + email on the bottom row

## Design system

Palette lives in `:root` as CSS variables — edit these, don't hardcode colors:

- `--primary: #ea580c` (deep orange), `--primary-hover: #c2410c`
- `--accent-2: #14b8a6` (teal), `--accent-3: #f97316` (orange)
- `--surface: #0f1117`, `--soft: #161927`, `--soft-2: #1a1e30`
- `--text: #e8eaed`, `--muted: #8b92a5`, `--border: #2a2f42`
- `--dark: #0a0c14`, `--dark-muted: #6b7280` (footer only)

Dark theme throughout. Primary buttons, brand mark, gradient headings, and hero blobs use deep orange gradients — keep this treatment consistent when adding new CTAs. A subtle grain texture overlay (`.page::after`) adds tactile depth.

## Conventions

- Code is separated into `index.html`, `style.css`, and `script.js`.
- **Banded sections** — add `class="banded"` to alternate section backgrounds. Currently: Tech stack, BookList4U, CanonTrails, and BestScreenTester are banded. Preserve the every-other-section rhythm when reordering.
- **Mockups** use dark gradient backgrounds with warm-toned radial circles. Real project screenshots are in `images/` folder and displayed via `<img class="mockup-img">` inside `.mockup` containers.
- **Feature rows** alternate mockup-left vs mockup-right for rhythm; preserve alternation when reordering or adding projects.
- **Stack cards** are glass-effect with per-card `--card-color` / `--card-glow` via `:nth-child(N)` rules. Each card has a gradient top bar, radial glow, hover lift, and tinted tag hover shadows. When adding/removing cards, re-check the nth-child rules so each card keeps a distinct color.
- **Tags** use `<span class="tag">`; keep them short (ideally ≤3 words).
- **Eyebrows** are pill-shaped (gradient bg + border) — use them above every section heading and project title for consistency.
- Layout collapses 3→2→1 columns at 960px and 760px. Nav links hide below 760px — brand + primary CTA only.
- **Accessibility** — Use `aria-label` for navigation and interactive elements. Maintain visible `:focus-visible` states for keyboard navigation.

## External links (keep in sync)

- GitHub: https://github.com/dkim0910
- LinkedIn: https://www.linkedin.com/in/daniel-kim-6991882b3/
- Email: hello+contact@nelera.net
- Portfolio: https://nelera.net
- Projects: geesly.net, booklist4u.com, canontrails.com, bestscreentester.com, maxcandela.com, DexScreener page for NELA

If these change, update both the contact section and the footer.

## TODO

### Must-have (before sharing with recruiters)
1. [x] **PNG favicon** — use `images/my_portfolio_logo.png` for the favicon and brand mark
2. [ ] **Resume / CV** — add a downloadable PDF resume and link it from the contact section
3. [x] **Hero copy** — personalize tagline and description beyond the current placeholder
4. [x] **Real screenshots** — all seven projects now have screenshots in `images/`
5. [x] **Open Graph meta** — add `og:title`, `og:description`, `og:image` so the link previews well when shared
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
14. [x] **Scroll-to-Top & Reading Progress** — Add a subtle reading progress bar or back-to-top button.
15. [x] **Performance Optimization** — Implement lazy loading and async decoding for images.
16. [x] **Micro-interactions** — Add hover effects to cards and "copy to clipboard" for email.
