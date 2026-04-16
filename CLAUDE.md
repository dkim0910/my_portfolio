# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Daniel Kim's personal portfolio — a single static `index.html` with all CSS inlined, targeted at recruiters. No framework, no bundler, no build step. The only dependency is `live-server` for local development with auto-reload.

## Preview

```sh
npm install
npm run dev   # live-server on http://localhost:5500, auto-reloads on save
```

## Page structure

One-page layout, top to bottom:

1. **Nav** — brand, Work / Stack / Contact anchors, primary "Get in touch" CTA
2. **Hero** — gradient-text tagline, "View my work" / "Contact me" buttons, multi-color radial gradient background
3. **Tech stack** (`#stack`, banded) — 3-column grid of 7 cards: Web frontend, Mobile, Backend & data, Cloud & deployment, APIs & integrations, AI tools, Design & architecture. Each card has its own gradient top-accent bar.
4. **Featured work** (`#work`) — five alternating feature rows (text + mockup, swapped every other row):
   - Geesly (Flutter dating app) — plain
   - BookList4U (Next.js book-series site) — banded
   - NELA (Solana token) — plain
   - CanonTrails (Next.js game-series site) — banded
   - This portfolio — plain
5. **Contact** — radial-glow gradient card with Email / GitHub / LinkedIn buttons
6. **Footer** — brand, nav + social links, copyright + email on the bottom row

## Design system

Palette lives in `:root` as CSS variables — edit these, don't hardcode colors:

- `--primary: #4f46e5` (indigo), `--primary-hover: #4338ca`
- `--accent-2: #a855f7` (purple), `--accent-3: #06b6d4` (cyan)
- `--surface: #ffffff`, `--soft: #f4f6fb`, `--soft-2: #fbf6ff`
- `--text: #15182a`, `--muted: #6b7280`, `--border: #e5e7eb`
- `--dark: #1f2233`, `--dark-muted: #9aa3b2` (footer only)

Primary buttons, brand mark, gradient headings, and hero blobs all use indigo→purple (and sometimes cyan) gradients — keep this treatment consistent when adding new CTAs.

## Conventions

- All styles live in the single `<style>` block at the top of `index.html`. Prefer editing CSS variables over hardcoding colors.
- **Banded sections** — add `class="banded"` to alternate section backgrounds. Currently: Tech stack, BookList4U, CanonTrails are banded. Preserve the every-other-section rhythm when reordering.
- **Mockups** are pure CSS (indigo→pink→cyan gradient with colored radial circles). If a real screenshot is added, replace `<div class="mockup">` with an `<img>` and keep the 4:3 aspect ratio.
- **Feature rows** alternate mockup-left vs mockup-right for rhythm; preserve alternation when reordering or adding projects.
- **Stack cards** use `:nth-child(N)::before` to color each top-accent bar differently. When adding/removing cards, re-check the nth-child rules so each card keeps a distinct gradient.
- **Tags** use `<span class="tag">`; keep them short (ideally ≤3 words).
- **Eyebrows** are pill-shaped (gradient bg + border) — use them above every section heading and project title for consistency.
- Layout collapses 3→2→1 columns at 960px and 760px. Nav links hide below 760px — brand + primary CTA only.

## External links (keep in sync)

- GitHub: https://github.com/dkim0910
- LinkedIn: https://www.linkedin.com/in/daniel-kim-6991882b3/
- Email: dkimdaniel0911@gmail.com
- Projects: geesly.net, booklist4u.com, canontrails.com, DexScreener page for NELA

If these change, update both the contact section and the footer.
