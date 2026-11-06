# We Suck — Couch & Upholstery Cleaning

Landing page for a mobile couch / upholstery cleaning business.
Started from the Cédric LeBlanc REALTOR® site's structure, then reworked into a conversion-focused service site.

## Highlights

- **Single-page, no build step** — plain HTML/CSS/JS, deploys anywhere (Vercel, Netlify, any static host).
- **Dark theme, lime accent** — colour tokens live at the top of `styles.css` (`:root`), so the accent and surfaces can be re-branded in one place. Fonts: Archivo (headings) + DM Sans (body).
- **Flow** — Hero + quick quote form → Trust bar → Ticker → Services → Recent work → How it works → Pricing → Reviews → About → Service area → FAQ → Quote form → Footer, plus a sticky Call / Quote bar on phones.
- **Motion** — scroll reveals, animated stat counters, hero parallax & zoom, sticky nav, scroll-progress bar, auto-scrolling reviews.
- **Responsive & accessible** — slide-in mobile menu, focus states, `prefers-reduced-motion` support.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Page markup & content |
| `styles.css` | All styling & responsive rules |
| `script.js`  | Nav, reveals, counters, parallax, results carousel, reviews marquee, quote form |
| `images/`    | Placeholder SVGs (hero, owner photo, before/after, logo) |

## ⚠️ Placeholders to replace before launch

Search the project for `[`, `$XX`, `TODO`, `PLACEHOLDER`, `example.com` and `000-0000`.

- **Business details** — service area / city, owner name, phone, email, hours, social links, Google review link.
- **Images** — `images/hero.svg`, `images/owner.svg`, `images/before-after.svg`, `images/logo-placeholder.svg`.
  Drop real photos in `images/` and update the paths in `index.html` / `styles.css` (`.hero__bg`, `.areas-banner`).
- **Stats & prices** — the trust-bar numbers and every `$XX` price (service cards + pricing section).
- **FAQ answers** — confirm drying time, payment methods, etc.
- **Reviews** — the testimonials are placeholders; replace with real customer reviews.
- **Quote forms** — both forms (hero quick quote + main form) have `action="YOUR_FORM_ENDPOINT"` in `index.html`; a hidden `source` field tells you which one was used. Until it's set, submitting shows a
  "form isn't connected yet" message instead of pretending to send.
- **Domain** — `example.com` in the `<head>` meta tags, `robots.txt` and `sitemap.xml`.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Photo credits

- `images/hero-sectional.jpg`, `sectional-*.jpg`, `banner-sectional.jpg`, `loveseat-cleaning.jpg` — client photos.
- `images/stock-*.jpg` — free stock photos from [Unsplash](https://unsplash.com) (Unsplash License), used as placeholders
  on the service cards and the contact section background. Swap for client photos when available.
