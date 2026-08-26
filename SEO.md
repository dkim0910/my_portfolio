# SEO runbook — nelera.net

## Current state (checked 2026-08-26)

| | Google Search Console | Bing Webmaster Tools |
|---|---|---|
| Property | `nelera.net` — **Domain property, verified** | `nelera.net/` — **verified** |
| Sitemap | submitted | submitted, last crawl 8/10/2026, Success |
| Indexed | 1 page (`/`) | — |
| IndexNow | n/a (Google doesn't support it) | **not set up yet** |

Because both are already verified, no `google-site-verification` or `msvalidate.01`
meta tag is needed in `index.html`.

### The one real problem

`https://nelera.net/donate.html` is **"Discovered – currently not indexed"**, first
detected 8/5/2026, **last crawled: N/A**. Google found the URL and never came back for
it. That's typical for a low-signal page on a site with almost no inbound links, and the
fix is step 3 below.

The other 3 "not indexed" URLs are **"Page with redirect"** — the http→https and
www→non-www variants a Domain property always picks up. Expected; ignore them.

---

## 1. Deploy

Search Console and Bing both check the **live** site, so push before doing anything else.
The Pages workflow only runs on `main`.

```sh
git push origin dev
# then merge dev -> main
```

Confirm it landed:

```sh
curl -s -o /dev/null -w "%{http_code}\n" https://nelera.net/4a377873f48e67038d4253f7153f5961.txt   # 200
curl -s -o /dev/null -w "%{http_code}\n" https://nelera.net/nope        # 404
curl -s -o /dev/null -w "%{http_code}\n" https://nelera.net/CLAUDE.md   # 404 now
curl -sI https://nelera.net/images/geesly_image.webp | head -1           # 200
```

## 2. Resubmit the sitemap (both engines)

The sitemap changed — new `lastmod`, and `<image:image>` entries now point at `.webp`.

- Google: **Sitemaps** → resubmit `sitemap.xml`
- Bing: **Sitemaps** → the existing entry → **Resubmit**

## 3. Force a crawl of donate.html

- Google: **URL Inspection** → `https://nelera.net/donate.html` → **Request indexing**.
  Do the same for `https://nelera.net/` so the new structured data gets picked up sooner.
- Bing: **URL Submission** → submit both URLs.

## 4. Turn on IndexNow (Bing only)

Bing Webmaster → **IndexNow** → Get Started. The key is already generated and committed:

- key: `4a377873f48e67038d4253f7153f5961`
- key file: `/4a377873f48e67038d4253f7153f5961.txt`, served at `https://nelera.net/4a377873f48e67038d4253f7153f5961.txt`

Once it's on, ping it after any content change:

```sh
npm run seo:indexnow                                    # every URL in sitemap.xml
npm run seo:indexnow -- https://nelera.net/donate.html  # just one
```

## 5. Validate

- Rich Results Test — <https://search.google.com/test/rich-results?url=https%3A%2F%2Fnelera.net%2F>
- Schema validator — <https://validator.schema.org/#url=https%3A%2F%2Fnelera.net%2F>
- Social preview — <https://www.opengraph.xyz/url/https%3A%2F%2Fnelera.net%2F>
- PageSpeed — <https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fnelera.net%2F>

Expected on `/`: `Person`, `WebSite`, `ProfilePage`, `ItemList` (7 projects).
Expected on `/donate.html`: `WebPage`, `BreadcrumbList`.

---

## Whenever you add a project

Keep these in sync or the markup starts lying to Google:

1. The feature row in `index.html`
2. The `ItemList` → `itemListElement` array in the `index.html` JSON-LD
3. `<image:image>` entry + `<lastmod>` in `sitemap.xml`
4. `npm run seo:indexnow`

## Adding a screenshot

Full-resolution captures live in `images/originals/` (not deployed). The site serves
1200px WebP built from them:

```sh
cwebp -q 82 -resize 1200 0 -m 6 images/originals/NAME.png -o images/NAME.webp
```

Then set the `<img>` `width`/`height` to the WebP's real pixel size so nothing shifts
during load.

## What the site is not doing

- **No analytics.** Deliberate (TODO #8). Search Console covers search traffic.
- **No resume PDF.** Still open (TODO #2) — a linked, crawlable PDF is worth real
  long-tail traffic for name searches.
- **Backlinks are the actual bottleneck.** Nothing on-page fixes a site with no inbound
  links. Linking here from your GitHub profile README and your LinkedIn "Website" field
  is the cheapest fix.
