# Natesha Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild nateshadance.com as a modern, responsive, "Warm Heritage" themed static site with a free headless CMS, migrating the current live content.

**Architecture:** Astro static site (six real pages) styled from a central design-token file. Events and gallery items are Astro content collections, edited through Keystatic (a free git-based CMS). Gallery media lives in Cloudflare R2 (free tier); the site deploys to Cloudflare Pages (free tier). Logic with real branching (event upcoming/past derivation, gallery filtering) is unit-tested with Vitest; pages are verified via `astro build` + `astro check` and dev-server review.

**Tech Stack:** Astro, TypeScript, Vitest, Keystatic, Cloudflare Pages + R2, Google Fonts (Marcellus, Cormorant Garamond, Inter).

**Spec:** `docs/superpowers/specs/2026-06-09-natesha-redesign-design.md`

---

## File Structure

```
natesha-redesign/
  astro.config.mjs              # Astro + Keystatic integration
  keystatic.config.ts           # CMS collections/fields (non-technical editor)
  vitest.config.ts
  package.json
  tsconfig.json
  src/
    styles/tokens.css           # palette + type scale (single source of truth)
    styles/global.css           # base element styles, font imports
    layouts/BaseLayout.astro    # <head>, meta/SEO, nav, footer slot
    components/
      Nav.astro
      Footer.astro
      Ornament.astro            # gold ❋/✦ divider
      EventCard.astro
      GalleryGrid.astro         # grid + filter + lightbox
      Lightbox.astro
    lib/
      events.ts                 # isUpcoming(), sortEvents() — TESTED
      gallery.ts                # GALLERY_CATEGORIES, filterByCategory() — TESTED
    content/
      config.ts                 # content collection schemas
      events/*.md               # one file per event (CMS-managed)
      gallery/*.md              # one file per gallery item (CMS-managed)
      pages/                    # editable prose (about sections, resources, contact)
    pages/
      index.astro               # Home
      about.astro
      gallery.astro
      events.astro
      resources.astro
      contact.astro
  tests/
    events.test.ts
    gallery.test.ts
  public/                       # static assets, favicon, migrated images (interim)
```

---

## Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json` (via scaffolder)

- [ ] **Step 1: Create the Astro project in place**

Run (from `natesha-redesign/`):
```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
npm install
```
Expected: Astro files created; `npm install` completes.

- [ ] **Step 2: Verify dev server boots**

Run: `npm run dev`
Expected: server starts on `http://localhost:4321`. Stop it with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project"
```

---

## Task 2: Add Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Install Vitest**

Run: `npm install -D vitest`

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
```

- [ ] **Step 3: Add test script to `package.json`**

Add to `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 4: Verify the runner works (no tests yet)**

Run: `npm test`
Expected: exits 0 with "No test files found" (acceptable) — confirms Vitest is wired.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: add Vitest"
```

---

## Task 3: Design tokens & global styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: Create `src/styles/tokens.css`** (single source of truth — from spec §4)

```css
:root {
  /* backgrounds */
  --bg-deep: #160a0a;
  --bg-panel: #1c0d0d;
  --bg-footer: #0c0606;
  /* maroon brand */
  --maroon: #7a1f1f;
  --maroon-dark: #4a1212;
  --maroon-bright: #8c1c13;
  /* gold */
  --gold: #e0a82e;
  --gold-soft: #c9963f;
  --gold-light: #f3d27a;
  --gold-display: #f6e4b0;
  /* text */
  --text-body: #cdbb9c;
  --text-warm: #e6cfa6;
  --text-muted: #caa66a;
  --text-caption: #a8906a;
  --hairline: #3a1c1c;
  /* type */
  --font-display: "Marcellus", "Cormorant Garamond", Georgia, serif;
  --font-serif: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", "Segoe UI", system-ui, sans-serif;
  /* spacing rhythm */
  --section-pad: clamp(2.5rem, 6vw, 4.5rem);
  --measure: 65ch;
}
```

- [ ] **Step 2: Create `src/styles/global.css`**

```css
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Marcellus&family=Inter:wght@400;500;600&display=swap");
@import "./tokens.css";

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg-deep);
  color: var(--text-body);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3 { font-family: var(--font-display); color: var(--gold-light); line-height: 1.15; font-weight: 400; }
a { color: var(--gold-soft); text-decoration: none; }
a:hover { text-decoration: underline; }
img { max-width: 100%; display: block; }
.label { font-size: .7rem; letter-spacing: .22em; text-transform: uppercase; color: var(--text-muted); }
.measure { max-width: var(--measure); }
.pill { background: var(--gold); color: #1a0d0d; font-weight: 600; padding: .6rem 1.2rem; border-radius: 30px; display: inline-block; }
.ghost { border: 1px solid var(--gold-soft); color: var(--gold-light); padding: .55rem 1.2rem; border-radius: 30px; display: inline-block; }
.section { padding: var(--section-pad) clamp(1rem, 4vw, 2.2rem); }
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add design tokens and global styles"
```

---

## Task 4: Ornament component

**Files:**
- Create: `src/components/Ornament.astro`

- [ ] **Step 1: Create `src/components/Ornament.astro`**

```astro
---
interface Props { label?: string; }
const { label } = Astro.props;
---
<div class="orn">
  <span></span>
  {label ? <em>{label}</em> : "❋"}
  <span></span>
</div>
<style>
  .orn { display: flex; align-items: center; justify-content: center; gap: .8rem; color: var(--gold); padding: 1.4rem 0; }
  .orn em { font-family: var(--font-serif); font-style: italic; color: var(--gold-light); font-size: 1.1rem; }
  .orn span { height: 1px; width: 60px; background: linear-gradient(90deg, transparent, var(--maroon), transparent); }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Ornament divider component"
```

---

## Task 5: Nav and Footer components

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`** (sticky, translucent, mobile-collapsible)

```astro
---
const links = [
  { href: "/about", text: "About" },
  { href: "/gallery", text: "Gallery" },
  { href: "/events", text: "Events" },
  { href: "/resources", text: "Resources" },
  { href: "/contact", text: "Contact" },
];
---
<header class="nav">
  <a class="brand" href="/">Natesha <span>·</span> नटेश</a>
  <input type="checkbox" id="navtoggle" hidden />
  <label for="navtoggle" class="burger" aria-label="Menu">☰</label>
  <nav>
    {links.map((l) => <a href={l.href}>{l.text}</a>)}
    <a class="pill" href="/contact">Enroll</a>
  </nav>
</header>
<style>
  .nav { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
    padding: .9rem clamp(1rem, 4vw, 1.6rem); background: rgba(22,10,10,.92); backdrop-filter: blur(6px);
    border-bottom: 1px solid var(--hairline); }
  .brand { font-family: var(--font-display); color: var(--gold-light); font-size: 1.25rem; letter-spacing: .03em; }
  .brand span { color: var(--gold-soft); }
  nav { display: flex; gap: 1.4rem; align-items: center; }
  nav a { color: var(--text-warm); font-size: .85rem; letter-spacing: .03em; }
  .burger { display: none; color: var(--gold-light); font-size: 1.4rem; cursor: pointer; }
  @media (max-width: 720px) {
    .burger { display: block; }
    nav { display: none; position: absolute; top: 100%; right: 0; left: 0; flex-direction: column; gap: 1rem;
      padding: 1rem; background: var(--bg-panel); border-bottom: 1px solid var(--hairline); }
    #navtoggle:checked ~ nav { display: flex; }
  }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`** (preserve credits from current site, drop Google+)

```astro
---
const year = new Date().getFullYear();
---
<footer class="ftr">
  <div class="name">Natesha School of Bharatanatyam</div>
  <p class="contact">natesha.dance@gmail.com · (858) 349-8293<br />Poway &amp; Scripps Ranch, San Diego</p>
  <p class="social">
    <a href="https://facebook.com" rel="noopener" target="_blank">Facebook</a> ·
    <a href="https://youtube.com" rel="noopener" target="_blank">YouTube</a>
  </p>
  <p class="credits">
    Photos: Sundar Karthikeyan, Amarnath Puttur, Shankar Ramachandran ·
    Videos: Barry Young, Ravi Soordelu · Logo: Pavan Kamath
  </p>
  <div class="orn">❋ ✦ ❋</div>
  <p class="copy">© {year} Natesha School of Bharatanatyam</p>
</footer>
<style>
  .ftr { background: var(--bg-footer); text-align: center; padding: 2.4rem 1rem; border-top: 1px solid var(--hairline); }
  .name { font-family: var(--font-display); color: var(--gold-light); font-size: 1.2rem; margin-bottom: .6rem; }
  .contact, .copy { color: var(--text-caption); font-size: .8rem; line-height: 1.8; }
  .social { font-size: .85rem; margin: .6rem 0; }
  .credits { color: var(--text-caption); font-size: .72rem; max-width: 60ch; margin: .8rem auto; }
  .orn { color: var(--maroon); letter-spacing: .5em; margin: .6rem 0; }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Nav and Footer components"
```

---

## Task 6: BaseLayout with SEO

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/layouts/BaseLayout.astro`**

```astro
---
import "../styles/global.css";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
interface Props { title: string; description?: string; }
const { title, description = "Natesha School of Bharatanatyam — classical Indian dance in San Diego." } = Astro.props;
const fullTitle = `${title} · Natesha School of Bharatanatyam`;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <Nav />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds (no pages yet beyond default — that's fine if default index still present).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add BaseLayout with SEO meta"
```

---

## Task 7: Events logic (TDD)

**Files:**
- Create: `src/lib/events.ts`, `tests/events.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/events.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { isUpcoming, sortByDateDesc, splitEvents } from "../src/lib/events";

type E = { date: string; title: string };
const today = new Date("2026-06-09");

describe("events", () => {
  it("isUpcoming: today or future is upcoming", () => {
    expect(isUpcoming("2026-06-09", today)).toBe(true);
    expect(isUpcoming("2026-12-01", today)).toBe(true);
    expect(isUpcoming("2026-06-08", today)).toBe(false);
  });

  it("sortByDateDesc: newest first", () => {
    const list: E[] = [{ date: "2024-01-01", title: "a" }, { date: "2025-01-01", title: "b" }];
    expect(sortByDateDesc(list).map((e) => e.title)).toEqual(["b", "a"]);
  });

  it("splitEvents: upcoming asc, past desc", () => {
    const list: E[] = [
      { date: "2026-08-01", title: "future2" },
      { date: "2026-07-01", title: "future1" },
      { date: "2020-01-01", title: "old" },
    ];
    const { upcoming, past } = splitEvents(list, today);
    expect(upcoming.map((e) => e.title)).toEqual(["future1", "future2"]);
    expect(past.map((e) => e.title)).toEqual(["old"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `../src/lib/events`.

- [ ] **Step 3: Implement `src/lib/events.ts`**

```ts
export function isUpcoming(date: string, now: Date = new Date()): boolean {
  const d = new Date(date + "T00:00:00");
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d.getTime() >= todayMidnight.getTime();
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function splitEvents<T extends { date: string }>(items: T[], now: Date = new Date()) {
  const upcoming = items.filter((e) => isUpcoming(e.date, now)).sort((a, b) => a.date.localeCompare(b.date));
  const past = sortByDateDesc(items.filter((e) => !isUpcoming(e.date, now)));
  return { upcoming, past };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add tested event date logic"
```

---

## Task 8: Gallery logic (TDD)

**Files:**
- Create: `src/lib/gallery.ts`, `tests/gallery.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/gallery.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { GALLERY_CATEGORIES, filterByCategory } from "../src/lib/gallery";

type G = { category: string; title: string };
const items: G[] = [
  { category: "recitals", title: "r1" },
  { category: "productions", title: "p1" },
  { category: "recitals", title: "r2" },
];

describe("gallery", () => {
  it("exposes the five categories", () => {
    expect(GALLERY_CATEGORIES).toEqual(["suman-nayak", "recitals", "productions", "solo-arangetram", "videos"]);
  });
  it("filters by category", () => {
    expect(filterByCategory(items, "recitals").map((g) => g.title)).toEqual(["r1", "r2"]);
  });
  it("'all' returns everything", () => {
    expect(filterByCategory(items, "all")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find module `../src/lib/gallery`.

- [ ] **Step 3: Implement `src/lib/gallery.ts`**

```ts
export const GALLERY_CATEGORIES = ["suman-nayak", "recitals", "productions", "solo-arangetram", "videos"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "suman-nayak": "Suman Nayak",
  recitals: "Recitals",
  productions: "Productions",
  "solo-arangetram": "Solo / Arangetram",
  videos: "Videos",
};

export function filterByCategory<T extends { category: string }>(items: T[], category: string): T[] {
  return category === "all" ? items : items.filter((i) => i.category === category);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add tested gallery category logic"
```

---

## Task 9: Content collection schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { GALLERY_CATEGORIES } from "../lib/gallery";

const events = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(), // YYYY-MM-DD
    venue: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

const gallery = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.enum(GALLERY_CATEGORIES),
    date: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    videoUrl: z.string().url().optional(),
  }),
});

export const collections = { events, gallery };
```

- [ ] **Step 2: Add two seed entries to verify the schema** — `src/content/events/2026-04-04-music-dance-festival.md`

```md
---
title: "Suman Nayak & Students — Indian Music & Dance Festival"
date: "2026-04-04"
venue: "IFAASD · under Dr. C. M. Venkatachalam"
link: "https://www.indianfinearts.org"
---
Suman Nayak and her students perform at the annual Indian Music and Dance Festival.
```

And `src/content/gallery/maargam-2014.md`:

```md
---
title: "Maargam — 2014 Recital"
category: "recitals"
date: "2014-01-01"
images: []
---
Highlights from the 2014 Maargam recital.
```

- [ ] **Step 3: Verify content type-checks**

Run: `npx astro sync && npx astro check`
Expected: no content collection errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add events and gallery content collections"
```

---

## Task 10: Migrate current live content

**Files:**
- Create: `src/content/pages/about.md`, `src/content/pages/resources.md`, `src/content/pages/contact.md`

Source content is on the current live site (http://nateshadance.com/) and in the captured HTML. **Fix all encoding** — the live site has `â` mojibake; store clean UTF-8.

- [ ] **Step 1: Create `src/content/pages/about.md`** with the cleaned existing prose

Include, with corrected curly quotes/transliteration, the four sections:
- **Bharatanatyam** intro + sloka: *"Yatho Hasta thatho Drishti, Yatho Drishti thatho Manah, Yatho Manah thatho Bhaava, Yatho Bhaava thatho Rasa."* — Nandikesvara, Abhinaya Darpana, plus the paragraph beginning "Bharatanatyam is one of the most ancient dance styles of India…"
- **Natesha School** + sloka *"Angikam bhuvanam yasya, Vachikam sarva vangmayam, Aharyam chandra taradi, Tam namah satvikam sivam."* and the "founded in 2001 by Guru Mrs. Suman Nayak…" paragraphs.
- **Guru — Suman Nayak**: the full bio (30+ years, Nritya Vidya Nilaya, U.K. Praveen, Pandanallur, Ramya Harishankar, etc.).
- **Students**: the testimonial blockquotes (Anjana, Meera, Mihika, Arthi, Keerti, Priya, Anagha, Divya, Archana, Aarthi) with arangetram years.

Structure as frontmatter `title` + markdown headings (`## Bharatanatyam`, etc.) so the About page can render and anchor them.

- [ ] **Step 2: Create `src/content/pages/resources.md`**

```md
---
title: "Resources"
links:
  - { text: "Indian Fine Arts Academy of San Diego (IFAASD)", url: "http://www.indianfinearts.org" }
  - { text: "SRUTI — India's premier magazine for performing arts", url: "http://www.sruti.com" }
  - { text: "NARTHAKI — online news channel for Indian dance", url: "http://www.narthaki.com" }
---
```

- [ ] **Step 3: Create `src/content/pages/contact.md`**

```md
---
title: "Contact"
phone: "(858) 349-8293"
email: "natesha.dance@gmail.com"
locations: "Poway & Scripps Ranch"
formEmbed: "https://docs.google.com/forms/d/e/1FAIpQLScQrB4j4Lmin7nyZBubHhfkCIU7mRjHCIAsHSzlH6hvUkgflw/viewform?embedded=true"
---
```

- [ ] **Step 4: Verify build still type-checks**

Run: `npx astro check`
Expected: no errors (these are loaded with `import.meta.glob`/`getEntry`, not the typed collections, so no schema needed).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "content: migrate current site copy with encoding fixes"
```

---

## Task 11: Home page

**Files:**
- Create: `src/pages/index.astro`
- Delete: any default placeholder index created by the scaffolder (overwrite it)

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import Ornament from "../components/Ornament.astro";
import EventCard from "../components/EventCard.astro";
import { splitEvents } from "../lib/events";

const events = (await getCollection("events")).map((e) => ({ ...e.data, slug: e.slug }));
const { upcoming } = splitEvents(events);
const nextEvent = upcoming[0];
const gallery = (await getCollection("gallery")).slice(0, 4);
---
<BaseLayout title="Home">
  <section class="hero">
    <div class="spark">✦</div>
    <h1>Natesha School<br />of Bharatanatyam</h1>
    <p class="sloka">"Where the hands go, the eyes follow; where the mind goes, feeling is born."</p>
    <p class="label">Classical Indian Dance · San Diego · Est. 2001</p>
    <div class="cta">
      <a class="pill" href="/contact">Enroll your child</a>
      <a class="ghost" href="/gallery">▶ Watch a performance</a>
    </div>
  </section>

  <Ornament />

  <section class="section split">
    <div class="measure">
      <p class="label">The School</p>
      <h2>A traditional Guru-Shishya path, taught with patience and devotion.</h2>
      <p>Founded in 2001 by Guru Suman Nayak to pass the pure Pandanallur tradition of Bharatanatyam to students of all ages — building grace, discipline, and a deep connection to Indian culture.</p>
      <a href="/about">Read our story →</a>
    </div>
  </section>

  {nextEvent && (
    <section class="section">
      <p class="label">Next up</p>
      <EventCard event={nextEvent} />
      <p><a href="/events">All events →</a></p>
    </section>
  )}

  <section class="section">
    <Ornament label="Moments" />
    <div class="grid">
      {gallery.map((g) => <a href="/gallery" class="tile" aria-label={g.data.title}></a>)}
    </div>
    <p style="text-align:center"><a href="/gallery">Explore the gallery →</a></p>
  </section>
</BaseLayout>

<style>
  .hero { text-align: center; padding: clamp(3rem,9vw,5rem) 1rem; background: radial-gradient(circle at 50% 0%, #3a1414, var(--bg-deep) 70%); }
  .spark { color: var(--gold); font-size: 1.8rem; }
  .hero h1 { font-size: clamp(2.2rem, 7vw, 3.2rem); color: var(--gold-display); margin: .6rem 0; }
  .sloka { font-family: var(--font-serif); font-style: italic; color: #d9b27a; font-size: 1.3rem; max-width: 30ch; margin: .4rem auto; }
  .cta { display: flex; gap: .8rem; justify-content: center; flex-wrap: wrap; margin-top: 1.4rem; }
  .split h2 { color: var(--gold-light); }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .7rem; }
  .tile { aspect-ratio: 3/4; border-radius: 4px; background: linear-gradient(160deg, #caa05a, var(--maroon)); }
  @media (max-width: 720px) { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
```

- [ ] **Step 2: Verify it renders**

Run: `npm run dev`, open `http://localhost:4321/`. Confirm hero, school blurb, next event card, gallery teaser appear; check at mobile width (DevTools 390px) — nav collapses to ☰, grid becomes 2-up. Stop server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: home page"
```

---

## Task 12: EventCard component

**Files:**
- Create: `src/components/EventCard.astro`

- [ ] **Step 1: Create `src/components/EventCard.astro`**

```astro
---
interface Props { event: { title: string; date: string; venue?: string; link?: string }; }
const { event } = Astro.props;
const d = new Date(event.date + "T00:00:00");
const day = d.toLocaleDateString("en-US", { day: "2-digit" });
const mon = d.toLocaleDateString("en-US", { month: "short" });
---
<article class="card">
  <div class="date"><span class="day">{day}</span><span class="label">{mon}</span></div>
  <div class="rule"></div>
  <div class="body">
    <h3>{event.title}</h3>
    {event.venue && <p class="venue">{event.venue}</p>}
    {event.link && <a href={event.link} target="_blank" rel="noopener">More info →</a>}
  </div>
</article>
<style>
  .card { display: flex; gap: 1rem; align-items: center; padding: 1rem; border: 1px solid #3a2418; border-radius: 8px; background: var(--bg-deep); }
  .date { text-align: center; }
  .day { font-family: var(--font-display); color: var(--gold); font-size: 1.6rem; display: block; line-height: 1; }
  .rule { width: 1px; height: 40px; background: #3a2418; }
  .body h3 { font-size: 1.05rem; color: var(--gold-light); margin: 0 0 .3rem; }
  .venue { color: var(--text-caption); font-size: .8rem; margin: 0; }
</style>
```

- [ ] **Step 2: Verify** the home page next-event card still renders (`npm run dev`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: EventCard component"
```

---

## Task 13: Events page

**Files:**
- Create: `src/pages/events.astro`

- [ ] **Step 1: Create `src/pages/events.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import EventCard from "../components/EventCard.astro";
import { splitEvents } from "../lib/events";

const events = (await getCollection("events")).map((e) => ({ ...e.data }));
const { upcoming, past } = splitEvents(events);
---
<BaseLayout title="Events" description="Upcoming performances and the performance history of the Natesha School of Bharatanatyam.">
  <section class="section">
    <p class="label">Upcoming</p>
    {upcoming.length ? upcoming.map((e) => <div class="row"><EventCard event={e} /></div>) : <p>No upcoming events posted yet — check back soon.</p>}
  </section>

  <section class="section">
    <h2>Performance history</h2>
    <ol class="timeline">
      {past.map((e) => (
        <li>
          <span class="t-date">{new Date(e.date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
          <span class="t-title">{e.title}{e.venue ? ` — ${e.venue}` : ""}</span>
        </li>
      ))}
    </ol>
  </section>
</BaseLayout>
<style>
  .row { margin-bottom: 1rem; max-width: 60ch; }
  .timeline { list-style: none; padding: 0; max-width: 70ch; }
  .timeline li { display: flex; gap: 1rem; padding: .7rem 0; border-bottom: 1px solid var(--hairline); }
  .t-date { color: var(--gold); font-family: var(--font-display); min-width: 7rem; }
  .t-title { color: var(--text-warm); }
</style>
```

> **Migration note:** the long 2004–2017 "Performance Highlights" list from the current About page should be added as individual event entries in `src/content/events/` (one `.md` each) so they populate this timeline. Add them in this task.

- [ ] **Step 2: Verify** `http://localhost:4321/events` shows upcoming card(s) + history timeline.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: events page with upcoming + history timeline"
```

---

## Task 14: GalleryGrid + Lightbox + Gallery page

**Files:**
- Create: `src/components/GalleryGrid.astro`, `src/pages/gallery.astro`

- [ ] **Step 1: Create `src/components/GalleryGrid.astro`** (client-side category filter + native-dialog lightbox)

```astro
---
import { CATEGORY_LABELS, GALLERY_CATEGORIES } from "../lib/gallery";
interface Item { title: string; category: string; images: { src: string; alt: string }[]; videoUrl?: string; }
interface Props { items: Item[]; }
const { items } = Astro.props;
---
<div class="filters">
  <button data-cat="all" class="active">All</button>
  {GALLERY_CATEGORIES.map((c) => <button data-cat={c}>{CATEGORY_LABELS[c]}</button>)}
</div>
<div class="grid">
  {items.flatMap((it) => it.images.map((img) => (
    <button class="tile" data-cat={it.category} data-full={img.src} aria-label={img.alt}>
      <img src={img.src} alt={img.alt} loading="lazy" />
    </button>
  )))}
</div>
<dialog class="lb"><img alt="" /><button class="close" aria-label="Close">✕</button></dialog>
<style>
  .filters { display: flex; gap: .5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.4rem; }
  .filters button { background: transparent; border: 1px solid var(--gold-soft); color: var(--text-warm); padding: .35rem .9rem; border-radius: 20px; font-size: .78rem; cursor: pointer; }
  .filters button.active { background: var(--gold); color: #1a0d0d; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .6rem; }
  .tile { padding: 0; border: 0; background: none; cursor: pointer; aspect-ratio: 3/4; }
  .tile img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
  .tile[hidden] { display: none; }
  .lb { border: 0; background: rgba(12,6,6,.95); max-width: 90vw; }
  .lb img { max-height: 80vh; }
  .lb .close { position: absolute; top: 1rem; right: 1rem; background: none; border: 0; color: var(--gold-light); font-size: 1.4rem; cursor: pointer; }
  @media (max-width: 720px) { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
<script>
  const filters = document.querySelectorAll<HTMLButtonElement>(".filters button");
  const tiles = document.querySelectorAll<HTMLButtonElement>(".tile");
  filters.forEach((b) => b.addEventListener("click", () => {
    filters.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const cat = b.dataset.cat;
    tiles.forEach((t) => { t.hidden = cat !== "all" && t.dataset.cat !== cat; });
  }));
  const lb = document.querySelector<HTMLDialogElement>(".lb")!;
  const lbImg = lb.querySelector("img")!;
  tiles.forEach((t) => t.addEventListener("click", () => { lbImg.src = t.dataset.full!; lb.showModal(); }));
  lb.querySelector(".close")!.addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
</script>
```

- [ ] **Step 2: Create `src/pages/gallery.astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import GalleryGrid from "../components/GalleryGrid.astro";
const items = (await getCollection("gallery")).map((g) => g.data);
---
<BaseLayout title="Gallery" description="Photos and videos from Natesha School recitals, productions, and arangetrams.">
  <section class="section">
    <h2 style="text-align:center">From the stage</h2>
    <GalleryGrid items={items} />
  </section>
</BaseLayout>
```

- [ ] **Step 3: Verify** `http://localhost:4321/gallery` — filter buttons toggle visible tiles; clicking a tile opens the lightbox; Esc/✕/backdrop closes it. (Add a couple of real images to a gallery `.md` to see tiles.)

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: gallery page with filtering and lightbox"
```

---

## Task 15: About, Resources, Contact pages

**Files:**
- Create: `src/pages/about.astro`, `src/pages/resources.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/about.astro`** (renders the migrated markdown with anchored sections)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Ornament from "../components/Ornament.astro";
const { Content } = await import("../content/pages/about.md");
---
<BaseLayout title="About" description="The art of Bharatanatyam, the Natesha School, Guru Suman Nayak, and our students.">
  <section class="section prose measure">
    <Content />
  </section>
  <Ornament />
</BaseLayout>
<style>
  .prose { margin: 0 auto; }
  .prose :global(h2) { margin-top: 2.4rem; color: var(--gold-light); }
  .prose :global(blockquote) { font-family: var(--font-serif); font-style: italic; color: var(--gold-light); border-left: 2px solid var(--gold-soft); padding-left: 1rem; }
</style>
```

- [ ] **Step 2: Create `src/pages/resources.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
const { frontmatter } = await import("../content/pages/resources.md");
const links = frontmatter.links as { text: string; url: string }[];
---
<BaseLayout title="Resources">
  <section class="section measure" style="margin:0 auto">
    <h2>Resources</h2>
    <ol>
      {links.map((l) => <li><a href={l.url} target="_blank" rel="noopener">{l.text}</a></li>)}
    </ol>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/contact.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
const { frontmatter } = await import("../content/pages/contact.md");
const f = frontmatter as { phone: string; email: string; locations: string; formEmbed: string };
---
<BaseLayout title="Contact">
  <section class="section" style="text-align:center">
    <h2>Contact Natesha School</h2>
    <p>Cell: {f.phone} · Email: <a href={`mailto:${f.email}`}>{f.email}</a></p>
    <p class="label">Conducting classes in {f.locations}</p>
    <iframe src={f.formEmbed} width="100%" height="900" style="max-width:500px;border:0;margin:1.5rem auto;display:block" title="Contact form" loading="lazy"></iframe>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify** all three pages render at `/about`, `/resources`, `/contact`; slokams display correctly (no mojibake); the Google Form loads.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: about, resources, contact pages"
```

---

## Task 16: Sitemap + full build check

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install and add the sitemap integration**

Run: `npx astro add sitemap --yes`
Then set `site` in `astro.config.mjs`:
```js
export default defineConfig({ site: "https://www.nateshadance.com", integrations: [/* sitemap() */] });
```

- [ ] **Step 2: Full verification**

Run: `npm run build && npx astro check && npm test`
Expected: build succeeds, no type/content errors, all unit tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add sitemap and verify full build"
```

---

## Task 17: Keystatic CMS (non-technical editor)

**Files:**
- Create: `keystatic.config.ts`
- Modify: `astro.config.mjs` (add Keystatic + React + output mode for admin)

- [ ] **Step 1: Install Keystatic**

Run: `npx astro add react --yes` then `npm install @keystatic/core @keystatic/astro`

- [ ] **Step 2: Configure `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.nateshadance.com",
  output: "hybrid",
  integrations: [react(), keystatic(), sitemap()],
});
```

- [ ] **Step 3: Create `keystatic.config.ts`** (plain-language labels for a non-technical editor)

```ts
import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: { kind: "github", repo: "Web-Undefined/natesha-website" },
  ui: { brand: { name: "Natesha Website" } },
  collections: {
    events: collection({
      label: "Events",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Event name" } }),
        date: fields.date({ label: "Date", description: "Past dates show under Performance History automatically." }),
        venue: fields.text({ label: "Venue / location", validation: { isRequired: false } }),
        link: fields.url({ label: "More-info link (optional)" }),
        body: fields.markdoc({ label: "Description" }),
      },
    }),
    gallery: collection({
      label: "Gallery items",
      slugField: "title",
      path: "src/content/gallery/*",
      schema: {
        title: fields.slug({ name: { label: "Title / caption" } }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Suman Nayak", value: "suman-nayak" },
            { label: "Recitals", value: "recitals" },
            { label: "Productions", value: "productions" },
            { label: "Solo / Arangetram", value: "solo-arangetram" },
            { label: "Videos", value: "videos" },
          ],
          defaultValue: "recitals",
        }),
        date: fields.date({ label: "Date", validation: { isRequired: false } }),
        images: fields.array(
          fields.object({
            src: fields.image({ label: "Photo", directory: "public/gallery", publicPath: "/gallery/" }),
            alt: fields.text({ label: "Photo description (for accessibility)" }),
          }),
          { label: "Photos", itemLabel: (p) => p.fields.alt.value || "Photo" }
        ),
        videoUrl: fields.url({ label: "Video link (for Videos category)" }),
      },
    }),
  },
});
```

> **Image storage note (spec §6/§10):** Keystatic's local `image` field commits files into the repo. Start here for launch simplicity. The Cloudflare R2 migration (free tier — to keep the repo lean for a large photo archive) is Task 20. Use R2, not the paid Cloudflare Images product.

- [ ] **Step 4: Verify the CMS runs locally**

Run: `npm run dev`, open `http://localhost:4321/keystatic`. Confirm the Events and Gallery collections appear with the friendly labels; create a test event and confirm a new `.md` appears in `src/content/events/`. Delete the test entry.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Keystatic CMS with editor-friendly schema"
```

---

## Task 18: Editor guide

**Files:**
- Create: `docs/EDITING-GUIDE.md`

- [ ] **Step 1: Write `docs/EDITING-GUIDE.md`** — a plain-language, screenshot-ready walkthrough for the non-technical editor:
  - One-time: create a free GitHub account; accept the repo invite email; first login "Sign in with GitHub" → Authorize.
  - Day-to-day: go to `nateshadance.com/keystatic` → sign in → add/edit an Event or Gallery item → upload photos → Save → "your change is live in 1–2 minutes."
  - How to add an upcoming event, how past events move to history automatically, how to add a gallery album with alt text.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "docs: add non-technical editor guide"
```

---

## Task 19: Deploy to Cloudflare Pages

**Files:**
- Modify: `astro.config.mjs` (Cloudflare adapter), `keystatic.config.ts` (real repo)

- [ ] **Step 1: Add the Cloudflare adapter**

Run: `npx astro add cloudflare --yes`

- [ ] **Step 2: Push to GitHub**

Repo already created at `Web-Undefined/natesha-website` (empty, no README). `keystatic.config.ts` already points at it. Wire the remote and push:
```bash
git remote add origin https://github.com/Web-Undefined/natesha-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Connect Cloudflare Pages**

In the Cloudflare dashboard: Pages → Connect to Git → select repo → build command `npm run build`, output `dist`. Deploy. Set up the Keystatic GitHub App for auth (so `/keystatic` works in production).

- [ ] **Step 4: Verify the live deploy**

Confirm the Pages URL serves all six pages over HTTPS, the gallery/lightbox work, and `/keystatic` loads and authenticates. Test an editor publish end-to-end (add an event → rebuild → appears live).

- [ ] **Step 5: Point the domain**

Move `nateshadance.com` DNS to Cloudflare; add the custom domain in Pages; confirm valid HTTPS (fixes the current expired-cert problem, spec §10.4).

---

## Task 20 (follow-up): Move gallery media to Cloudflare R2 (free tier)

**Only once the archive grows large enough that repo size matters (spec §6/§10.1).**

- [ ] **Step 1:** Create an R2 bucket (or enable Cloudflare Images); upload existing gallery media.
- [ ] **Step 2:** Change the Keystatic `image` field `publicPath`/storage to reference the R2 public base URL instead of `public/gallery`.
- [ ] **Step 3:** Verify uploads from the CMS land in R2 and render on the live gallery; confirm repo no longer grows with new photos.
- [ ] **Step 4: Commit.**

---

## Self-Review

**Spec coverage:**
- §3 dated-tech fixes → Tasks 1–6, 16 (real HTML, semantic, responsive nav). ✓
- §4 visual system → Tasks 3–6, 11 (tokens, fonts, ornaments, components). ✓
- §5 six-page IA → Tasks 11, 13, 14, 15. ✓
- §6 stack (Astro/Keystatic/Cloudflare/R2) → Tasks 1, 17, 19, 20. ✓
- §7 non-technical CMS → Tasks 17, 18. ✓
- §8 content migration + encoding → Tasks 9, 10, 13 (history list). ✓
- §9 responsive/a11y/SEO/perf → Tasks 5 (mobile nav), 6 (meta), 14 (lazy/alt), 16 (sitemap), verify steps. ✓
- §10 risks → R2 (20), GitHub login (18), expired cert/DNS (19.5). ✓

**Placeholder scan:** Image storage and repo owner are explicitly deferred to Tasks 19–20 with concrete steps, not vague TODOs. Content text in Task 10 references the actual live copy to transcribe (the source of truth) rather than restating thousands of words. No "add error handling"-style placeholders.

**Type consistency:** `splitEvents`/`isUpcoming`/`sortByDateDesc` (Task 7) used consistently in Tasks 11, 13. `GALLERY_CATEGORIES`/`filterByCategory`/`CATEGORY_LABELS` (Task 8) used in Tasks 9, 14. Event shape `{title,date,venue?,link?}` consistent across schema (9), EventCard (12), pages (11,13). Gallery item shape `{title,category,date?,images[],videoUrl?}` consistent across schema (9), GalleryGrid (14), Keystatic (17).
