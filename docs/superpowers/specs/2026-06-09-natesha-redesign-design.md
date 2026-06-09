# Natesha School of Bharatanatyam — Website Redesign

**Date:** 2026-06-09
**Status:** Design approved, ready for implementation planning
**Current site:** http://nateshadance.com/

---

## 1. Overview

Redesign the Natesha School of Bharatanatyam website (San Diego classical Indian
dance school, founded 2001 by Guru Suman Nayak). The current site is frozen on
~2017 technology and looks dated. The redesign **keeps the existing gold/maroon
palette and traditional Indian motifs** while making the site modern, responsive,
fast, and maintainable.

The site's primary job is to **serve the existing dance community** — acting as a
living archive of performances, galleries, and events — rather than to aggressively
recruit new students. Enrollment is supported but secondary.

The site will be editable by a **non-technical person** at the school via a free
headless CMS dashboard.

---

## 2. Goals & Non-Goals

### Goals
- Preserve the warm, traditional, devotional character (color, motifs, Sanskrit text).
- Modern, fully responsive (mobile-first) multi-page site with real, shareable URLs.
- Make the photo/video **gallery** and **events archive** first-class, easy to browse.
- Let a non-technical editor add events and gallery items without touching code.
- Near-zero recurring cost (free hosting + free CMS).
- Fix accessibility/SEO problems (text-as-text, encoding, semantic markup).

### Non-Goals
- Online payments, student login portals, or class-booking/scheduling systems.
- E-commerce or ticketing.
- A blog (can be added later if desired).
- Aggressive marketing/lead-gen funnels.

---

## 3. Problems With the Current Site (what we're fixing)

- Built on **Adobe Spry tabbed panels** (discontinued by Adobe in 2012) — the entire
  site is a single page; no page has its own URL, nothing is shareable or indexable.
- **Not truly responsive** — fixed pixel widths, table-based layouts, float galleries.
- **Headings/titles are PNG images of text** — invisible to search engines and screen
  readers, impossible to restyle.
- **Broken character encoding** — Sanskrit slokams and curly quotes render as `â`
  mojibake.
- **Dated visual tics** — 10px solid-gold photo borders, busy full-bleed background
  slideshow, system fonts, and a **Google+ icon** (service dead since 2019).
- **Stale content** — copyright reads 2017; events calendar is mostly empty placeholders.

---

## 4. Visual Design — "Warm Heritage" (approved)

Consistent, immersive dark theme top to bottom (no light/cream section breaks —
tried and rejected as too stark). Rich, devotional, elegant.

### Color palette
| Role | Hex |
|------|-----|
| Deep background | `#160a0a` |
| Panel / alt background | `#1c0d0d` |
| Footer / deepest | `#0c0606` |
| Maroon (brand) | `#7a1f1f` → `#4a1212` (gradients), `#8c1c13`, `#900` |
| Gold (primary accent) | `#e0a82e`, `#c9963f` |
| Light gold (display text) | `#f6e4b0`, `#f3d27a` |
| Warm body text on dark | `#cdbb9c`, `#e6cfa6` |
| Muted label / caption | `#caa66a`, `#a8906a` |

*(These are derived directly from the current site's existing colors — `#f9cd87`,
`#900`, `#C30`, `#FC6`, `#0c0e0b` — refined into a coherent scale.)*

### Typography
- **Display / headings:** Marcellus (elegant Roman-inscriptional serif) with
  Cormorant Garamond fallback.
- **Pull-quotes / slokams:** Cormorant Garamond italic.
- **Body / UI:** Inter (or system sans fallback).
- All headings are **real text**, never images.

### Motifs & components
- Fine **gold line-ornaments** (`❋ ✦`) as section dividers — replacing the old
  boxed-photo gold borders.
- Optional Devanagari accent in the wordmark: "Natesha · नटेश" (approved as a nice touch).
- Nataraja, Krishna, and temple imagery used as photography, not chrome.
- Rounded gold "pill" buttons for primary actions; thin gold-outline "ghost" buttons
  for secondary.
- Sticky translucent dark nav with backdrop blur.

---

## 5. Information Architecture (community-first)

Six real pages, each with its own URL:

| Page | URL | Purpose / emphasis |
|------|-----|--------------------|
| **Home** | `/` | Hero + sloka, latest/next event, gallery teaser, quick links into the archive |
| **About** | `/about` | The four existing sub-sections (Bharatanatyam, Natesha School, Guru, Students) become anchored sections on one flowing, scannable page — no hidden tabs |
| **Gallery** | `/gallery` | The heart of the archive. Filterable by category: Suman Nayak / Recitals / Productions / Solo-Arangetram / Videos. Fast lightbox, lazy-loaded, optimized images |
| **Events** | `/events` | Upcoming events at top; full historical performance timeline (2004–present) preserved below |
| **Resources** | `/resources` | Clean list of outbound links (IFAASD, SRUTI, Narthaki) |
| **Contact** | `/contact` | Phone, email, locations (Poway & Scripps Ranch), embedded Google Form, map |

### Per-page content notes
- **Home:** hero with *Yatho Hasta* sloka as emotional headline; "Enroll" and
  "Watch a performance" CTAs; a strip pulling the next upcoming event and 4 recent
  gallery images automatically from the CMS.
- **About:** migrate existing prose verbatim but **fix encoding**; keep Sanskrit
  slokams with translations and credits (Nandikesvara, Abhinaya Darpana, etc.);
  preserve guru lineage and student testimonials.
- **Gallery:** category filter; each item = image(s) or a video embed + caption +
  date; grouped/sortable by event and year.
- **Events:** upcoming list (date, title, venue, details/link) + the long historical
  highlights list, presented as a clean vertical timeline.
- **Contact:** keep the existing Google Form embed; add a static map; drop dead
  Google+; keep Facebook/YouTube, add Instagram if the school has one.

---

## 6. Technical Architecture

> **Stack:** Astro (static site) + Keystatic (free headless CMS) + Cloudflare Pages
> (free hosting) + Cloudflare R2/Images for gallery media. Total recurring cost ≈ $0
> (plus the existing domain).

### Why this stack
- **Astro** — component-based authoring, builds to plain fast static HTML, first-class
  image optimization (critical for a photo-heavy gallery), real per-page URLs, trivial
  to host.
- **Keystatic** — free, open-source, git-based CMS that integrates almost natively with
  Astro. Stores content as files in the GitHub repo; gives the editor a friendly
  dashboard. Chosen over Sveltia/Decap/Pages CMS for its tight Astro integration and
  clean editing UI.
- **Cloudflare Pages** — free static hosting with automatic builds on git push.
- **Cloudflare R2 / Images** — gallery photos/videos live in object storage instead of
  bloating the git repo; the CMS references them. Generous free tier.

### Repo & content structure (indicative)
```
/src
  /pages        → index.astro, about.astro, gallery.astro, events.astro,
                  resources.astro, contact.astro
  /components   → Nav, Hero, Ornament, EventCard, GalleryGrid, Lightbox, Footer
  /layouts      → BaseLayout.astro (theme tokens, fonts, meta)
  /styles       → design tokens (the palette + type scale above)
/content
  /events/*.md      → one file per event (managed by CMS)
  /gallery/*.md     → one file per gallery item (managed by CMS)
  /pages/*.md       → editable prose blocks for About/Resources/Contact
keystatic.config.ts → CMS schema (collections + fields)
```

### Design tokens
Centralize the palette and type scale (Section 4) as CSS custom properties / a single
tokens file so the whole site restyles from one place.

---

## 7. CMS Design for a Non-Technical Editor

The editor is **non-technical**, so the dashboard must be friendly and forgiving.

### Collections & fields (plain-language labels)
- **Events**
  - Title (text)
  - Date (date picker)
  - Venue / location (text)
  - Description (rich text)
  - Optional link (URL)
  - Upcoming or Past (auto-derived from date; no manual toggle)
- **Gallery items**
  - Title/caption (text)
  - Category (dropdown: Suman Nayak / Recitals / Productions / Solo-Arangetram / Videos)
  - Date or year (date)
  - Photos (image upload → stored in Cloudflare R2/Images)
  - Video URL (optional, for the Videos category)
- **Editable page text** (About sections, Resources links, Contact details) as simple
  rich-text/list fields so copy can be updated without code.

### Editing workflow
1. Editor logs in to the Keystatic dashboard with a free GitHub account.
2. Adds/edits an event or gallery item; uploads photos through the UI.
3. Hits "Save/Publish" → change commits to the repo → Cloudflare Pages rebuilds
   (~1–2 minutes) → live.

### Auth simplification
- Use the simplest viable login for one or two editors (GitHub OAuth via Keystatic
  Cloud, or Keystatic's GitHub app). Provide a one-page written "how to update the
  site" guide with screenshots for the editor.
- **Open item:** confirm the editor can/will create a free GitHub account. If even that
  is a barrier, evaluate Keystatic Cloud's invite flow or a managed auth proxy during
  implementation.

---

## 8. Content Migration

- Pull all existing prose, slokams, testimonials, performance history, resource links,
  and contact details from the current site.
- **Fix all character-encoding errors** (smart quotes, Sanskrit transliteration) during
  migration — store everything as clean UTF-8.
- Re-collect/optimize gallery images at modern resolutions; generate responsive sizes
  via Astro's image pipeline.
- Preserve credits (photographers, videographers, logo, original web designer) in the
  footer.

---

## 9. Cross-Cutting Requirements

- **Responsive:** mobile-first; verified at phone / tablet / desktop widths.
- **Accessibility:** semantic headings, alt text on all images (CMS field), sufficient
  contrast (verify gold-on-dark meets WCAG AA for body text), keyboard-navigable
  lightbox and nav.
- **SEO:** per-page `<title>`/meta, descriptive URLs, sitemap, Open Graph tags, real
  text content, image alt text.
- **Performance:** optimized/lazy-loaded images, minimal JS, static delivery via CDN.
- **Analytics (optional):** a privacy-friendly, free analytics option (e.g. Cloudflare
  Web Analytics) — confirm during planning.

---

## 10. Risks & Open Questions

1. **Gallery media in git** — mitigated by Cloudflare R2/Images; confirm the free tier
   covers expected volume.
2. **Editor GitHub account** — non-technical editor must authenticate; verify the
   smoothest login path during implementation (Section 7).
3. **Image sourcing** — do high-resolution originals of past performances still exist,
   or must we reuse the current site's lower-res images? Affects gallery quality.
4. **Domain/DNS** — current site is on `nateshadance.com` with an **expired TLS
   certificate**; plan to move DNS to Cloudflare and get HTTPS working (free) as part
   of launch.
5. **Social accounts** — confirm which social links are current (drop Google+; confirm
   Facebook/YouTube; add Instagram if applicable).

---

## 11. Success Criteria

- All six pages live at their own URLs, fully responsive, visually matching the
  approved Warm Heritage direction.
- Gallery and events browsable, filterable, and fast on a phone.
- A non-technical editor successfully adds an event and a gallery item through the CMS
  dashboard without developer help.
- No PNG-text headings, no encoding errors, no dead links/icons.
- Site served over HTTPS at ~$0 recurring cost.
