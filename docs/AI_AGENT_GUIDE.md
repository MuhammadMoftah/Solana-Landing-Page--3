# Solana East — AI Agent Guide

> Practical playbook for agents working in this repo. Read [`PROJECT_MAP.md`](./PROJECT_MAP.md) for architecture and [`ASSET_CATALOG.md`](./ASSET_CATALOG.md) for images. Updated **2026-10-26** after the "ink & crimson" redesign — re-verify if files have changed since.

---

## 1. Read This First

1. **The site is built.** `/` is a static single page composed in `src/pages/index.astro` from 11 section components plus header and footer (direct children of `<body>`; no wrapper shell).
2. **Stack:** Astro 7.3.8 · Vue 3.5.44 via `@astrojs/vue` · Tailwind CSS 4.3.3 via `@tailwindcss/vite` (CSS-first, **no `tailwind.config.js`**) · Node ≥ 22.12.
3. **The folder name contains `#` — the build fails in place.** Vite/Tailwind throw a "null bytes" path error. Use `npm run dev` / `npm run build` / `npm run preview` — they go through `tools/run.mjs`, which mirrors the project into a `#`-free sibling folder (`..\solana-east-build`, own `node_modules`, installed on first run), keeps it synced during `dev`, and copies `dist/` back after `build`. **Never run raw `astro dev` / `astro dev --background` here** (fails with `virtual:astro:server-app`). Edit files only in the real project. Renaming the folder removes the need for the mirror (the runner then runs Astro in place).
4. **Data flow:** facts → `src/content/solana-east.content.js` → read only through `src/lib/content.js`. Images → `src/content/solana-east.media.js`. Components hold layout and editorial UI copy, not facts.
5. **Follow `AGENTS.md`:** dev server via `astro dev --background`; manage with `astro dev status|logs|stop`.
6. **Never** invent facts, prices, travel times, coordinates, phone numbers, amenities, ownership claims or image provenance. Never mix Solana New Zayed (West) data into Solana East.
7. **Visual direction:** dark editorial in black + crimson, adapted from owner-supplied reference screenshots (not in the repo). Keep: near-black page with hairline rules between sections, Anton uppercase headlines split white/crimson (`splitTail` + `.t-red`), small red `.eyebrow` labels, red circles behind or beside masked images, red Anton numerals, outlined rectangular buttons with red sweep, boxed dark form fields with a solid red submit, monochrome-at-rest imagery (`.tone`). Avoid: other accent colours, glows, icon grids, rounded-pill controls, card-shaped section wrappers.

---

## 2. File-to-Task Guide

| Task | Inspect first | Modify | Notes |
|---|---|---|---|
| Change a fact, price, date, FAQ, form field | `solana-east-content.js`, `sources.md` | Content file only | UI updates automatically. Keep `sourceIds` accurate. |
| Section layout or editorial copy | `src/components/sections/<Name>.astro` | Same | Section → content id map: `PROJECT_MAP.md` §4. |
| Add a section | `index.astro`, a similar section | New `sections/<Name>.astro`; add to `index.astro`; add to `navItems` if needed | Use `class="section rule-top"`, `.eyebrow` + `.heading-2` with a `.t-red` half, an `id`, `aria-labelledby`. |
| Navigation | `index.astro` (`navItems`) | Same | Header, mobile menu and footer consume `navItems` (footer + mobile menu add FAQ). Desktop nav at `xl` (1280 px). Scroll spy needs each `href` to match a section `id`. |
| Theme tokens | `global.css` `@theme`, `astro.config.mjs` `fonts` | Same | Colours `ink-*`, `crimson-*`, `bone-*`, `ash-*`. Fonts Anton / Inter / Allura. |
| Two-tone headings | `splitTail()` in `lib/content.js` | Component | `const { lead, tail } = splitTail(heading, n)` then `{lead} <span class="t-red">{tail}</span>`. Use `{' '}` when `{lead}` and the span are on different lines. |
| Organic hero shape | `global.css` `@utility shape-arch-organic` | Same | Add new shapes as `@utility` (not inside `@layer components`) so `lg:` variants work. |
| Head / SEO / JSON-LD | `Layout.astro`, `index.astro` (`structuredData`) | Same | Canonical/OG URL tags render only when `site` is set. JSON-LD has no prices or offers on purpose. |
| Add or swap an image | `ASSET_CATALOG.md`, media registry | Register in `solana-east.media.js`, reference `media.<key>` | Descriptive `alt`; `position` to crop baked-in labels. |
| Gallery images / order | `solana-east.media.js` (`galleryOrder`) | Same | `Gallery.astro` builds srcsets with `getImage()`. |
| Gallery behaviour | `gallery/GalleryShowcase.vue` | Same | `PAGE_SIZE` = thumbnails per desktop set (grid is 2 columns). |
| Enquiry form | `contact/InquiryForm.vue`, `sections/Contact.astro` | Same | Inputs/textarea share `inputClass`; unit type is a radio-pill group. Hands off to `wa.me/<guide phone>`; to use a backend, replace `onSubmit` and keep validation + focus handling. |
| Header / mobile menu | `SiteHeader.astro` (inline `<script>`) | Same | Re-run keyboard checks (`tools/test.mjs`) after changes. |
| Scroll reveal | `scripts/reveal.ts`, reveal rules in `global.css` | Add `data-reveal` (`""`, `"fade"`, `"image"`, `"scale"`, `"line"`) | Never on above-the-fold content (hurts LCP). Stagger with `style="--reveal-delay:120"` (ms). |

---

## 3. Conventions

- **Static first.** `.astro` + native HTML (`<details>`, anchors, radio inputs) before Vue. Both islands use `client:visible`.
- **Reuse classes** from `global.css` (`.container-x`, `.section`, `.rule-top`, `.eyebrow`, `.heading-2/3`, `.t-red`, `.lead`, `.label`, `.numeral`, `.btn`, `.btn-red`, `.btn-solid`, `.btn-sq`, `.tag`, `.source-note`, `.tone`, `.zoom`, `.shape-circle`) before writing long utility stacks. Use `group` on a card so `.tone`/`.zoom` react to hover/focus-within.
- **Decorative shapes** (red circles, rings, the ghost word) are `aria-hidden` spans/`p` with `pointer-events-none`; section wrappers that hold them use `overflow-hidden`.
- **Progressive enhancement:** anything that only works after hydration gets `data-requires-js` and needs a no-JS alternative.
- **Keep section `id`s stable** — nav, scroll spy, CTAs (`#project-overview`, `#contact`) depend on them.
- **Accessible names:** the wordmark's red dot is `aria-hidden` so the link's name is "Solana East by ORA" (avoids `label-content-name-mismatch`). Don't add an `aria-label` that differs from visible text.
- Search before creating: `rg -l "<Name>|<keyword>" src`.

---

## 4. How-To Reference

### 4.1 Reading content

```astro
---
import { getSection, sourceList, formatEgpMillions, unitTypeSummary, pad2, splitTail } from '../../lib/content.js';
const section = getSection('prices'); // throws if the id doesn't exist
---
```

Helpers: `content`, `getSource`, `sourceLabel`, `sourceList`, `formatNumber`, `formatEgpMillions`, `configSizeRange`, `formatRange`, `configLayouts`, `unitTypeSummary`, `formatBedrooms`, `formatMonth`, `digitsOnly`, `pad2`, `splitTail`.

### 4.2 Images

```astro
---
import { Image } from 'astro:assets';
import media from '../../content/solana-east.media.js';
---
<div class="tone zoom group relative aspect-[4/3] overflow-hidden" data-reveal="image">
  <Image src={media.buildingA2.src} alt={media.buildingA2.alt}
    widths={[480, 720, 960, 1200]} sizes="(min-width: 64rem) 36vw, 70vw" quality={62} class="media-fill" />
</div>
```

- Only the hero uses `priority` (`<Picture>`, AVIF + WebP). Everything else is lazy.
- Don't read `media.<key>.src.width/height/src` directly (copies originals into `dist/`).

### 4.3 Tailwind v4

- Entry `src/styles/global.css` (`@import "tailwindcss"` + `@theme`), imported only in `Layout.astro`.
- Classes in `@layer components` cannot take variants (`lg:foo` won't exist). Use `@utility` when a class needs variants.
- Unlayered rules (reveal system, `[data-requires-js]`) beat utilities — keep them minimal.
- `build.inlineStylesheets: 'always'` inlines CSS into the HTML.
- Custom colour tokens generate utilities: `bg-crimson-600`, `text-ash-300`, `border-white/10`, etc.

### 4.4 Motion & accessibility

- Animate `transform`, `opacity`, `clip-path`, `filter` only. Respect reduced motion (global override; reveal content visible immediately).
- Hover effects only under `@media (hover: hover)`.
- Hero copy, image, red circle and ghost word use transform-only entrance animations so LCP isn't delayed.
- Focus: 2 px `bone-50` outline (`:focus-visible`); radio pills show focus via `:has(input:focus-visible)`.
- Contrast: body text `ash-300`/`ash-400` on `ink-900` passes AA. Small red text must be `crimson-400` or lighter; `crimson-500` is for large display text; white on `crimson-600` ≈ 5.8:1. Don't use `ash-500` or `crimson-600` for readable small text.

---

## 5. Content Integrity Rules

| Field / value | Required UI treatment |
|---|---|
| `status` of `needs-verification` / `volatile-third-party-data` / `needs-current-confirmation` / `third-party-date` / `third-party-contact` | Show with a qualifier and source, or hide |
| `verification: "third-party-source-only"` | Separate tag list with a disclaimer |
| `confidence: "medium"` / any `note` | Footnote; don't headline unqualified |
| `null` coordinates / map / image `src` | Render nothing |
| `disclaimer` fields | Shown with prices, payment plans and the form |

- Phone number: keep "published by the guide — not verified as an official ORA sales channel" next to it.
- Never compute installments. Don't claim who operates the site. Don't add legal links to pages that don't exist.

---

## 6. Verification Before Handing Off

No test suite in the repo. Use the CDP scripts in `tools/` (copy them next to a `#`-free build; see §1.3). They launch local Chrome headless and expect `astro preview --port 4399`:

1. `npm run build` — 1 page, no warnings. Then `npm run preview -- --port 4399`.
2. `node test.mjs` — overflow at 6 widths, heading/alt/JSON-LD checks, scroll spy, gallery, form validation + WhatsApp URL, mobile menu focus/inert/Escape, reduced motion. All 32 should pass.
3. `node shot.mjs <w> <h> shots/<prefix> [url] [partHeight]` — full-page screenshots in parts (it adds `is-revealed` to every `[data-reveal]` and makes lazy images eager). Review at 1440, 1100, 820, 390.
4. Lighthouse: `npx lighthouse http://localhost:4399/ --output=json --output-path=lh.json --chrome-flags=--headless=new` (add `--preset=desktop` for desktop). Report as lab data.
5. No-JS: capture with `Emulation.setScriptExecutionDisabled` (see the project history) and confirm nothing is hidden.

**Screenshots:** the Cursor in-app browser crops to its panel size; use the CDP scripts for full-page captures. Chrome tiles captures taller than ~16,000 px, so capture long mobile pages in parts (`partHeight` ≈ 1100).

---

## 7. Debugging Cheatsheet

| Symptom | Likely cause | Check |
|---|---|---|
| `astro build` fails with "null bytes" / path error | `#` in the project folder path | Build in the mirror folder or rename the project |
| Section content invisible | `data-reveal` never intersected or JS error | Console; reduced motion shows everything |
| `lg:shape-…` / variant has no effect | Class defined in `@layer components` | Move to `@utility` |
| Ghost word's top is clipped | `background-clip: text` only paints inside the line box | Keep `line-height: 1` + `padding-top` on `.ghost-word` |
| Two-tone heading has no space between parts | `{lead}` and the span are on separate lines | Add `{' '}` |
| Header never gets its background | `#header-sentinel` missing | `SiteHeader.astro` |
| Nav link not highlighted | `href` doesn't match a section `id` | `navItems` |
| Image shows blank in a screenshot | `loading="lazy"` not yet fetched | Use `shot.mjs` (forces eager) or scroll slowly |
| `dist/` contains huge originals | Code read `media.x.src.<prop>` | Use `getImage()` |
| Wordmark link fails `label-content-name-mismatch` | Differing `aria-label` or the dot is not `aria-hidden` | `Wordmark.astro` |
| `astro check` prompts to install | `@astrojs/check` not installed | Ask before installing |
