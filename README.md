# We Suck — Couch & Upholstery Cleaning

Landing page for a mobile couch / upholstery cleaning business.
Built from the same layout and flow as the Cédric LeBlanc REALTOR® site, re-themed dark.

## Highlights

- **Single-page, no build step** — plain HTML/CSS/JS, deploys anywhere (Vercel, Netlify, any static host).
- **Dark theme** — colour tokens live at the top of `styles.css` (`:root`), so the accent and surfaces can be re-branded in one place.
- **Same flow** — Hero → About → Stats → Services → How It Works → Before & After → Service Area → Reviews → Quote form → Footer.
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

Search the project for `[`, `TODO`, `PLACEHOLDER`, `example.com` and `000-0000`.

- **Business details** — service area / city, owner name, phone, email, hours, social links, Google review link.
- **Images** — `images/hero.svg`, `images/owner.svg`, `images/before-after.svg`, `images/logo-placeholder.svg`.
  Drop real photos in `images/` and update the paths in `index.html` / `styles.css` (`.hero__bg`, `.areas-banner`).
- **Stats** — the numbers in the stats band.
- **Reviews** — the testimonials are placeholders; replace with real customer reviews.
- **Quote form** — `action="YOUR_FORM_ENDPOINT"` in `index.html`. Until it's set, submitting shows a
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
