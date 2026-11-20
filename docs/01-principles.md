# 01 · Principles

Halo is a design system for calm, glossy, data-forward interfaces: Apple-Fitness clarity, ring metrics, rim-lit cards, and quiet motion. It is bilingual by design (English + Kurdish Sorani, and so any RTL script) and it ships as tokens, CSS, a small runtime, and rules.

These eight principles decide every case the docs don't cover.

## 1. Platform first, proven library second, invention never
Reach for the web platform before anything else (`<dialog>`, `light-dark()`, IntersectionObserver, Web Audio, Intl). If the platform is not enough, use the library the industry already relies on for that exact job. See [16-libraries.md](16-libraries.md). Do not write a new animation engine, smooth scroller, icon set or synthesizer from memory. Halo's own code is small, readable and already tested; extend it, don't replace it.

## 2. One source of truth per decision
Colours live in `tokens/tokens.css`. Easing lives in `--ease`. Copy lives in one dictionary per language. If you type a hex code or a cubic-bezier in a component, you made a second source of truth. Delete it.

## 3. Dark is the hero, light is a peer
Every screen is designed in both themes, and judged in both. Dark is near-black (`#000`) with vivid neon accents; light is Apple grey (`#F5F5F7`) with deeper, text-safe accents. Same layout, same hierarchy, different ink.

## 4. Numbers are the headline
Halo screens are about a few numbers the user cares about: a goal, a streak, today's progress. Put them in big bold type, in an accent colour, with a short grey label above and a plain sentence below. Rings and bars repeat the number visually; they never replace it.

## 5. Motion is light, not decoration
Things respond to the user (a rim lights where the pointer is, a card glints where a finger lands) and things arrive once (fade, rise, unblur). Nothing loops for attention. One easing curve. Everything turns off under `prefers-reduced-motion`.

## 6. Balance every breakpoint, separately
A phone is not a small laptop and a laptop is not a stretched phone. Phones get one column, quiet 40 px icons, swipe and haptics. Laptops get equal-height columns, pinned card footers and charts that fill their card, so there are no holes. Check both. See [04-layout.md](04-layout.md).

## 7. RTL is a first-class layout
Sorani is not "English flipped". It has its own font (IBM Plex Sans Arabic), its own line height, its own date table and its own chart mirroring rules. Build both directions from the first commit. See [08-rtl-and-kurdish.md](08-rtl-and-kurdish.md).

## 8. Ship it tested
Nothing is done until it has passed the QA protocol in [13-qa.md](13-qa.md): no sideways scroll at 320–1440 px, no clipped text, no console errors, every interaction exercised by script, in both themes and both directions.

---

### The Halo look in one paragraph (give this to a designer)
Black or soft-grey page. Rounded cards (22 px) with a 1 px hairline rim and a barely-there vertical gradient. Big bold sans headlines with tight tracking, the second line in a green→cyan gradient. Three accents only: **green** (strength, done, primary progress), **cyan** (steps, information, calm), **pink-red** (recovery, attention, the outer ring), plus amber for warnings. Concentric activity rings. Chips are solid pills. Icons sit in soft gradient tiles. On hover a thin light runs along the card edge toward your cursor.
