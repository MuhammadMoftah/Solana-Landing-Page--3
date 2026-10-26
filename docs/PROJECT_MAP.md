# Solana East — Project Map

> Updated **2026-10-26** after the "ink & crimson" redesign (black + crimson editorial theme derived from two new reference screenshots of a dark portfolio site). The earlier "night & champagne" build (2026-10-22) and "sand & bronze" build (2026-10-14) are superseded; their content rules were carried over unchanged.
> Labels: **[Confirmed]** = verified from files/commands, **[Inferred]** = reasoned from evidence, **[Open]** = unresolved question for the project owner.

---

## 1. Summary

**[Confirmed]** A single-page, statically generated marketing site for **SOLANA East by ORA** (New Cairo). Astro components, two Vue islands, Tailwind CSS v4. Facts come from `src/content/solana-east.content.js`; images from the registry in `src/content/solana-east.media.js`.

| Area | State |
|---|---|
| Pages | 1 (`src/pages/index.astro`, route `/`) |
| Layout | `src/layouts/Layout.astro` — imports `global.css`, 3 self-hosted fonts, SEO/OG meta, JSON-LD, skip link, reveal script. No wrapper shell: header, `<main>`, footer are direct children of `<body>` |
| Section components | 11 in `src/components/sections/` |
| Shared components | `SiteHeader.astro`, `SiteFooter.astro`, `ui/Icon.astro`, `ui/Wordmark.astro` |
| Vue islands | 2: `gallery/GalleryShowcase.vue`, `contact/InquiryForm.vue` (both `client:visible`) |
| Vanilla scripts | `src/scripts/reveal.ts` (scroll reveal); inline script in `SiteHeader.astro` (scrolled header, scroll spy, mobile menu) |
| Tooling | `tools/` — `run.mjs`, `shot.mjs`, `test.mjs` (see §8 and the **`#` path problem** in §7) |

**Redesign note [Confirmed]:** the supplied reference images were a black/crimson portfolio layout (condensed bold headlines, giant ghost word, red circle behind a masked subject, small red section labels, hairline rules, numbered process, boxed form with solid red submit). The brief's text described a teal/gold spa reference; the **images were treated as the authority** (brief: "the attached screenshot defines the visual identity"). Tokens are centralised in `@theme`, so a palette change is a one-file edit.

---

## 2. Framework & Tooling Versions

**[Confirmed]** Dependencies were **not** changed (`package.json` untouched). Fonts changed in `astro.config.mjs` only.

| Package | Declared | Installed |
|---|---|---|
| `astro` | `^7.3.8` | 7.3.8 |
| `vue` | `^3.5.44` | 3.5.44 |
| `@astrojs/vue` | `^7.0.3` | 7.0.3 |
| `tailwindcss` / `@tailwindcss/vite` | `^4.3.3` | 4.3.3 |
| `sharp` (transitive) | — | used by `astro:assets` |

- Node `>=22.12.0` (local v24.15.0). No devDependencies, linter or test runner; `@astrojs/check` is not installed.
- Package name is still `squalid-series`. **[Open]**

---

## 3. Project Tree (excluding `node_modules/`, `dist/`, `.astro/`)

```text
├── public/favicon.svg               # Ink square, crimson circle, white rule
├── tools/                           # run.mjs (dev/build/preview launcher; mirrors to a '#'-free folder when needed), shot.mjs (CDP screenshots), test.mjs (CDP functional checks)
├── src/
│   ├── assets/                      # grey-logo.png + 22 project renders (see ASSET_CATALOG.md)
│   ├── components/
│   │   ├── SiteHeader.astro         # Fixed header (transparent → blurred when scrolled), mobile menu dialog, scroll spy
│   │   ├── SiteFooter.astro         # Wordmark, explore nav, contact list, sources, disclaimer
│   │   ├── contact/InquiryForm.vue  # Vue island: validated form → WhatsApp hand-off
│   │   ├── gallery/GalleryShowcase.vue # Vue island: featured image + thumbnails + square arrows + counter
│   │   ├── sections/                # One component per page section (see §4)
│   │   └── ui/
│   │       ├── Icon.astro           # Inline stroke icons (arrow, arrow-ne, plus, menu, close, pin, road, phone, external, globe, …)
│   │       └── Wordmark.astro       # Typographic "SOLANA EAST. / by ORA"
│   ├── content/
│   │   ├── solana-east.content.js   # Facts & copy (not modified)
│   │   ├── solana-east.media.js     # Image registry (not modified in this redesign)
│   │   └── sources.md               # Source register (not modified)
│   ├── layouts/Layout.astro
│   ├── lib/content.js               # Accessors, formatters, schema normalizers (+ pad2, splitTail)
│   ├── pages/index.astro            # Composition, navItems, title/description, JSON-LD graph
│   ├── scripts/reveal.ts
│   └── styles/global.css            # Tailwind entry, tokens, components, hero mask utility, reveal system
└── docs/                            # This file, ASSET_CATALOG.md, AI_AGENT_GUIDE.md
```

Removed in this redesign: `ui/PalmFrond.astro`, `ui/SectionHeading.astro`, the framed `.page-shell`, the floating pill nav.

---

## 4. Page Composition

`src/pages/index.astro` renders `SiteHeader`, then `<main id="main">` with the sections below, then `SiteFooter`. Section order and ids are unchanged from the previous build.

| # | Component | Anchor `id` | Content source | Images (media keys) | Reference pattern adapted |
|---|---|---|---|---|---|
| — | `SiteHeader.astro` | `site-header`, `mobile-menu` | `navItems` | — | Slim top bar: wordmark left, tiny uppercase nav, outlined red "Enquire" button ("LET'S TALK") |
| 1 | `Hero.astro` | `top` | `hero` | `villaPool4` (LCP, `priority`) | Giant red ghost word "SOLANA", script "Discover", two-tone condensed headline, outlined/solid CTAs, organic **arch-masked** image over a red circle, numbered highlight strip |
| 2 | `Overview.astro` | `project-overview` | `project-overview` | `buildingA2`, `livingRoom` | Red circle + arch image + small circle inset; red numerals with left red rule ("6+ years") |
| 3 | `Masterplan.astro` | `masterplan` | `masterplan` | `gardenView1`, `buildingA5`, `aerialMasterplan`, `buildingA6` | "Selected Work" cards: monochrome image, red geometric shape, condensed title overlay, number, arrow |
| 4 | `Residences.astro` | `residential-units` | `residential-units` | `buildingA3`, `buildingA4`, `streetView`, `villaPool1` | "Selected Projects" row: image over `01 NAME`, spec list; layouts in `<details>` |
| 5 | `Amenities.astro` | `amenities`, `retail-entertainment` | `amenities`, `retail-entertainment` | `villaPool2`, `gardenView2` | Centered two-tone statement heading; circular imagery with red ring; red-numbered list; deep-red panel (reference quote panel) for retail |
| 6 | `Gallery.astro` | `gallery` | `gallery` (title) | 12 from `galleryOrder` | Featured image + thumbnails, square arrow buttons (red active), red counter |
| 7 | `Location.astro` | `location` | `location`, `project.location` | — | Large red "≈10 min" figures (stats style), concentric red outlines |
| 8 | `Pricing.astro` | `prices` | `prices`, `payment-plans`, `timeline` | — | Red stat row; 2-step numbered timeline joined by a red arrow line ("Work process") |
| 9 | `Developer.astro` | `developer` | `developer` | `oraLogo` | Full-bleed deep-red gradient band (reference quote panel), script accent |
| 10 | `Faq.astro` | `faq` | `faq` | — | Exclusive `<details name="faq">`, red numerals, square red plus buttons |
| 11 | `Contact.astro` | `contact` | `contact`, `residential-units` | — | "LET'S CREATE SOMETHING BOLD." layout: big two-tone heading left, boxed dark inputs + solid red submit right |
| — | `SiteFooter.astro` | — | `project`, `sources`, `contact` | — | Wordmark, contact rows with red icons, sources |

**Content rules applied [Confirmed]** (unchanged):
- Facts, numbers, prices, dates, FAQ, form fields and the phone number come from the content file. Editorial UI copy (labels, intros, "The atmosphere", script words "Discover" / "Lifestyle destinations") lives in components. Section headings that exist in the content file are used from it and split into a white + red part with `splitTail()`.
- Third-party data carries a visible source (`sourceList()`); prices are "listed"/"indicative" with the content file's disclaimers.
- Location: "Ring Road / CFC" excluded (ambiguous); AUC shows "≈10–15 min" crediting all three sources.
- Amenities: `brochure-listed` items are the numbered list; `third-party-source-only` items are tags under "Also listed by third parties".
- Product-mix percentages (medium confidence) are footnoted; the phone number is labelled as published by the independent guide.
- Renders are labelled "Illustrative render" / "architectural visualizations".
- No legal links (privacy/terms) exist in the footer because no such pages or content exist. **[Open]**

---

## 5. Content Sources

- `src/content/` is a plain folder (no content collections). Components read content only through `src/lib/content.js` (`getSection(id)` throws on an unknown id).
- Structure unchanged: `project`, `sections[]` (14), `sources[]`, `researchNotes[]`, `assetManifest`.
- Schema variants are normalized by `configSizeRange()`, `configLayouts()`, `unitTypeSummary()`.
- `splitTail(text, n)` (new) returns `{ lead, tail }` — the last `n` words are rendered in crimson.
- **[Open]** The content file's `assets` arrays / `assetManifest` are still empty / `not-downloaded`; the media registry is the de-facto image source of truth.

---

## 6. Architecture

```text
astro.config.mjs
 ├─ integrations: @astrojs/vue
 ├─ fonts: Anton 400 → --font-anton; Inter 400–600 (variable) → --font-inter; Allura 400 → --font-allura (self-hosted via Astro Fonts API, Google provider, download at build time)
 ├─ build.inlineStylesheets: 'always'
 └─ vite.plugins: @tailwindcss/vite

src/pages/index.astro ── layouts/Layout.astro ── styles/global.css, <Font>×3, JSON-LD, scripts/reveal.ts
 ├─ SiteHeader.astro ─ ui/Wordmark, ui/Icon
 ├─ main > sections/*.astro ─ lib/content.js ─ content/solana-east.content.js
 │                         └─ content/solana-east.media.js ─ assets/**
 │   ├─ Gallery.astro ─ getImage() ─▶ gallery/GalleryShowcase.vue (client:visible)
 │   └─ Contact.astro ─▶ contact/InquiryForm.vue (client:visible)
 └─ SiteFooter.astro
```

### 6.1 Design system (`src/styles/global.css`)

- **Palette (`@theme`)** — sampled from the references (field `#0E0E10`, input surface `#131315`, circle red `#C71D22`, button red `#D62B2F`, deep panel `#480F11`, ghost-word red `#770C11`):
  `ink-950 #08080a`, `ink-900 #0e0e10` (page), `ink-850 #131315`, `ink-800 #1a1a1d`, `ink-700 #26262a`;
  `crimson-300 #f2676b`, `-400 #ef4448` (small red text, 5:1 on ink-900), `-500 #e12a2e` (large display red), `-600 #c71d22` (fills/circles; white text on it is ≈5.8:1), `-700 #a3161b`, `-800 #6d0f13`, `-900 #3a1213`;
  `bone-50 #f6f4f0` (headings), `-100`, `-200`; `ash-300 #b8b8bc` (body), `-400 #9d9da2` (meta), `-500 #7a7a80` (decorative only); `error #ff8f86`.
- **Type** — `--font-display` Anton (uppercase, condensed; all `h1–h4`, numerals, card titles), `--font-sans` Inter (body, labels, UI), `--font-script` Allura (two accent words only). Fluid sizes `--text-display`, `--text-h2`, `--text-h3`.
- **Component classes** — `.container-x` (82 rem), `.section`, `.rule-top` (hairline between bands), `.eyebrow` (small red label), `.display-1`, `.heading-2`, `.heading-3`, `.t-red` (accent half of a two-tone headline), `.script`, `.lead`, `.meta`, `.label`, `.hairline`, `.source-note`, `.numeral` (red Anton figure), `.btn` (outlined, red fill sweep on hover), `.btn-red`, `.btn-solid`, `.btn-arrow`, `.btn-sq` / `.btn-sq-red` (square arrow buttons), `.link-underline`, `.text-link`, `.tag`, `.ghost-word` (giant red gradient word), `.media-fill`, `.shape-circle`, `.tone` (greyscale images at rest, colour on hover/focus-within), `.zoom` (hover scale).
- **Organic mask** — `shape-arch-organic` (`@utility`, so `lg:` variants work): CSS `mask` with an inline SVG path in a 0–1 box (`preserveAspectRatio='none'`), an arch with an asymmetric crown. The image keeps `object-fit: cover` (never distorted). Other arches use `rounded-t-[999px]`.
- **Motion** — `--ease-out-soft`; `animate-settle` (hero copy), `animate-unveil` (hero image scale), `animate-pop` (red circle), `animate-drift` (ghost word) — all transform-only. Reveal variants via `data-reveal`: `""` (rise), `"fade"`, `"image"` (clip-path wipe), `"scale"`, `"line"`. Hidden states apply only with `.js` on `<html>` **and** `prefers-reduced-motion: no-preference`; a global reduced-motion override zeroes durations.

### 6.2 Interactivity

| Feature | Implementation | Without JS |
|---|---|---|
| Header | `#header-sentinel` (top 24 px) leaves the viewport → `data-scrolled` (blurred dark background + border) | Transparent header remains |
| Scroll spy | IntersectionObserver (`rootMargin: -45% 0 -50%`) sets `data-active` + `aria-current="location"` on `.nav-link`s (red underline) | — |
| Mobile menu (< 1280 px) | `role="dialog"` + `aria-modal`, every other `body` child `inert`, focus to close button, Escape / link / resize close, focus restored to the opening toggle | Toggles hidden (`data-requires-js`); footer nav provides links |
| Gallery | Vue: directional cross-slide `<Transition>`, prev/next square buttons, ArrowLeft/Right, swipe, thumbnails (pages of 6 on desktop, snap row on mobile), neighbour preloading, `aria-live` counter | Featured image + thumbnails link to 1920 px WebP; arrows hidden |
| Unit layouts, price table, FAQ | Native `<details>` | Yes |
| Enquiry form | Vue: validation, unit-type radio pills, opens `wa.me/<guide phone>?text=…`, focuses status. No success is simulated: the confirmation only appears after the WhatsApp window was opened | Form hidden; `<noscript>` points to call/WhatsApp links |

---

## 7. Known Issues & Open Items

1. **[Confirmed] The `#` in the folder name breaks the build.** Vite/Tailwind throw `path … without null bytes` when the project root contains `#` (`…\Solana Landing Page #3`), even through a `subst` drive. Workaround: `npm run dev|build|preview` call `tools/run.mjs`, which mirrors the project into a sibling folder without `#` (`E:\Work\Web\www\solana-east-build`, own `node_modules`) and runs Astro there (dev keeps it synced; build copies `dist/` back). Raw `astro dev` fails with `virtual:astro:server-app`. **Rename the project folder to run Astro in place.**
2. **[Confirmed]** This workspace was missing `src/layouts`, `src/lib`, `src/pages`, `src/scripts`, `src/styles`; they were restored from the sibling `Solana Landing Page #2` (the complete previous build) and then rewritten/modified. The git repo at `…\Solana Landing Page` still has these files deleted in its working tree and has none of this redesign.
3. **[Open]** Image provenance/rights for all renders (`rightsStatus: 'verify-before-use'`), especially `solana-by-ora-web-2.jpg` (filename references the New Zayed project).
4. **[Open]** The only contact channel is the independent guide's phone; the form hands off to WhatsApp on that number. Replace with an official channel or a real endpoint.
5. **[Open]** No `site` in `astro.config.mjs` → canonical, `og:url`, `og:image` omitted; no sitemap/robots.txt.
6. **[Confirmed]** Seven "Building A" `.jpg` files are WebP; `astro:assets` handles them.
7. **[Confirmed]** Don't read `media.x.src.width/height/src` in components — Astro then copies multi-MB originals into `dist/` (Gallery uses `getImage()` output).
8. **[Confirmed]** Fonts are fetched from Google at build time (needs network on first build; cached afterwards).
9. **[Open]** Hero uses a landscape render in a portrait arch (object-position `42% 62%`); a purpose-shot portrait/cut-out image would be closer to the reference's subject cut-out.
10. README is still the starter; package name `squalid-series`.

---

## 8. Checks Performed (2026-10-26, mirror folder, `astro preview` on a production build)

| Check | Result |
|---|---|
| `npx astro build` | Passes, 1 page. `dist/`: 192 files — 171 WebP, 5 AVIF, 6 JPEG (hero fallback), 3 WOFF2 (85 KB), JS 94 KB raw (Vue runtime 81 KB + GalleryShowcase 4.7 KB + InquiryForm 6.6 KB, loaded on visibility), `index.html` 172 KB with inlined CSS |
| `tools/test.mjs` (headless Chrome over CDP) | 32/32 pass: no horizontal overflow at 320/375/768/1024/1280/1920 px; one `h1`; no heading skips; every `img` has `alt`; JSON-LD present; nav targets exist; fonts load; header scrolled state; scroll spy; gallery (hydrates, next, thumbnail, ArrowLeft, wrap-around, single featured image after transition); form (empty submit → `aria-invalid` + focus first invalid; invalid phone rejected; no WhatsApp window on invalid; valid submit opens `wa.me/201208986606` with the selected unit type; status region focused); mobile menu (opens, focus to close, background inert, Escape closes and restores focus, link closes and scrolls); reduced motion (no hidden reveal elements). 0 console errors |
| Visual review | Full-page captures at 1440, 1100, 820 and 390 px reviewed against the references; fixes applied for headline spacing, ghost-word clipping, stat overlap and low-contrast place names |
| Lighthouse 13.x (lab, single run each, `astro preview`) | Mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100 (FCP 1.4 s, LCP 2.0 s, TBT 0 ms, CLS 0). Desktop: 100/100/100/100 (FCP 0.3 s, LCP 0.5 s, TBT 0 ms, CLS 0.001). Lab data only |
| No-JS rendering | Verified by capturing the page with script execution disabled (CDP): all sections visible (no hidden reveal content), gallery server-rendered with thumbnails, FAQ/price/layout `<details>` present. Form is replaced by the `<noscript>` call/WhatsApp links (the form container has `data-requires-js`) |
| `astro check` | Not run (`@astrojs/check` not installed) |

---

## 9. Open Questions for the Project Owner

1. Image rights/provenance; official Solana East logo (site uses a typographic wordmark).
2. Official sales channel / form endpoint.
3. Production `site` URL and a dedicated OG image.
4. Is the black/crimson direction intended for this real-estate brand? (The brief's text described teal/gold; the images were followed.) Palette lives in `@theme`.
5. Rename the folder to drop `#` so the project builds in place.
6. Privacy/terms pages for the footer.
7. Arabic / RTL version required? (Anton and Inter have no Arabic glyphs.)
