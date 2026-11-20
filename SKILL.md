---
name: halo-design
description: Halo, a calm, glossy, bilingual (English + Kurdish Sorani / any RTL script) design system for web apps, dashboards, trackers, landing pages and vector PDF posters or guides. Use it when a UI should feel Apple-Fitness-like (activity rings, rim-lit cards, big accent numbers, dark and light themes), when the product needs Kurdish, Arabic or Persian alongside English, or when the user asks for "the Halo style". It ships tokens, CSS components, a dependency-free runtime (motion, theming, i18n, dialogs, timer, swipe, haptics), synthesized calm UI sound, an icon grammar, a vector-PDF pipeline and a QA protocol. Everything maps to web standards or named production libraries, so nothing is invented.
---

# Halo design skill

Halo turns a product brief into a calm, glossy, data-forward interface that works in dark and light, English and Kurdish, phone and laptop, and that prints to true vector PDF. Follow this file top to bottom; open a doc only when its step comes up.

## Ground rules (read once, apply always)
1. **Platform → Halo → proven library. Never invent.** Use the web platform first, then Halo's code, then the production library named in [`docs/16-libraries.md`](docs/16-libraries.md). Don't write a new animation engine, scroller, icon set, synth or dialog from memory.
2. **Tokens are the only source of colour, curve and radius.** No hex codes or cubic-beziers in components. See [`tokens/tokens.css`](tokens/tokens.css).
3. **Both themes, both directions, every breakpoint** are designed and tested; none is an afterthought.
4. **Numbers are the headline.** A few big accent numbers, each with a grey label above and a plain sentence below; rings and bars repeat them.
5. **Motion is light.** One curve (`--ease`), reveal once, nothing loops, everything respects reduced motion.
6. **No logos.** The brand slot is the product's own name in text. Never draw, invent or add a logo or mark; use one only if the user supplies it.
7. **Done means QA passed** ([`docs/13-qa.md`](docs/13-qa.md)).

## Workflow

### 1 · Decide the surface
- **Interactive page or app** → start from [`templates/starter.html`](templates/starter.html) (vanilla) or follow [`docs/17-frameworks.md`](docs/17-frameworks.md) for React/Next, Tailwind and shadcn, or Vue.
- **Printed document** (poster, guide, one-pager) → start from [`templates/print-a4.html`](templates/print-a4.html) and [`docs/11-print-and-pdf.md`](docs/11-print-and-pdf.md).
- **Both** → share the copy dictionary and tokens; build the page first, then the print pages.

### 2 · Wire the foundation
```html
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens/tokens.css">
<link rel="stylesheet" href="css/halo.css">
<script src="js/halo.js"></script>
<script src="js/halo-sound.js"></script>   <!-- optional -->
<script>Halo.init({ dict: { en:{…}, ckb:{…} } })</script>
```
Read [`docs/02-color.md`](docs/02-color.md) and [`docs/03-typography.md`](docs/03-typography.md) once.

### 3 · Map the content to Halo's accents
Pick at most three meanings and keep them for the whole product:
- **green** = primary progress or done;
- **cyan** = information, steps, calm;
- **red** = recovery, attention, the outer ring;
- amber = caution only.

Write them down before building.

### 4 · Build sections from components
Each section: `.band > .wrap`, a `.head` with a two-line `h2`, then cards. Use the components exactly as documented in [`docs/05-components.md`](docs/05-components.md):
- nav;
- stat tile;
- rings;
- cards, with `.stack` for pinned footers;
- chips, filters, segmented control and stepper;
- check dots;
- lists and sources;
- KPI row and chart;
- sheet (dialog), timer pill and toast.

Hero pattern: `.split` with a headline (second line `.grad`), a lede and four `.stat` tiles on one side, and a feature card (rings and today's actions) on the other.

### 5 · Balance every breakpoint
Apply the five laptop techniques in [`docs/04-layout.md`](docs/04-layout.md):
1. equal-height split;
2. header row with a full-width tile grid;
3. pinned footers;
4. content that fills its card;
5. ratios set by content.

Then apply the phone rules in [`docs/07-phone-and-touch.md`](docs/07-phone-and-touch.md):
- a quiet 40 px nav with at most 4 controls;
- secondary settings in the menu;
- swipe, haptics, safe areas.

### 6 · Make it bilingual
Put every string in the dictionary; never hard-code copy in markup. Follow [`docs/08-rtl-and-kurdish.md`](docs/08-rtl-and-kurdish.md):
- logical properties only;
- `<bdi>` around Latin terms inside Kurdish;
- charts mirrored in code;
- Sorani dates from the table;
- Western digits by default.

If you write Kurdish copy yourself, say so to the user and recommend a native review.

### 7 · Add motion, light and sound
- Rim light, reveals, progress hairline and hero drift come from `Halo.init()`. Tune nothing except durations, and only within [`docs/06-motion-and-light.md`](docs/06-motion-and-light.md).
- Sound is optional. If used, wire only the named palette in [`docs/14-sound.md`](docs/14-sound.md), with a visible toggle (nav on desktop, menu on phone).

### 8 · Icons
- UI icons: Lucide.
- Subject glyphs: 24 px stroke style in a `.tile`.
- Action pictograms: follow the grammar in [`icons/README.md`](icons/README.md) (ghost start pose, ink end pose, one accent, knock-outs).

### 9 · QA: try to break it
Serve over http, then run:
```bash
python3 qa/qa_layout.py http://localhost:8000/your-page.html   # 9 widths × 2 themes × 2 languages
python3 qa/qa_touch.py  http://localhost:8000/your-page.html   # phone touch, menu, reveal, glint
```
Add the product-specific interaction checks from [`docs/13-qa.md`](docs/13-qa.md), plus axe-core ([`docs/12-accessibility.md`](docs/12-accessibility.md)). Look at screenshots at 390 and 1440 in both themes before calling it done.

### 10 · Print (when there is a document)
HTML at the exact paper size → `scripts/print_pdf.py` → `qpdf` merge → `scripts/verify_pdf.sh` must report **0 images**. Embed TrueType (`.ttf`) fonts locally; CFF `.otf` fonts become Type 3 and break gradient text.

## Pre-delivery checklist
- [ ] No hex codes or easing curves outside `tokens.css`.
- [ ] Dark and light both reviewed; text accents use `--XT`.
- [ ] Laptop: no column ends ~40 px short of its neighbour; buttons align across rows; charts fill their cards.
- [ ] Phone: ≤ 4 nav controls, 44 px targets, no sideways scroll at 320.
- [ ] RTL: `dir`/`lang` set, chevrons flip, timers counter-clockwise, `<bdi>` around Latin terms.
- [ ] Reduced motion honoured; sound has a toggle and is never the only signal.
- [ ] Every factual claim links to a source; destructive actions have Undo.
- [ ] `qa_layout.py` and `qa_touch.py` pass; no console errors.
- [ ] PDFs (if any) verified vector.

## File map
| Path | What |
|---|---|
| `tokens/` | `tokens.css` (source of truth) + DTCG 2025.10 JSON (`halo.light`, `halo.dark`, `halo.base`) |
| `css/halo.css` | All components, motion, phone and RTL rules |
| `js/halo.js` | Runtime: store, i18n, theme, nav, light, reveal, drift, swipe, haptic, dialog, toast, timer, rings, icons |
| `js/halo-sound.js` | Synthesized calm sound palette (Web Audio) |
| `templates/` | `starter.html` (every pattern), `print-a4.html` (vector print page) |
| `icons/` | UI icons, glyphs, pictograms, grammar, gallery |
| `docs/` | 01 principles · 02 colour · 03 type · 04 layout · 05 components · 06 motion · 07 phone · 08 RTL · 09 icons · 10 data viz · 11 print · 12 a11y · 13 QA · 14 sound · 15 Figma · 16 libraries · 17 frameworks |
| `qa/` | Layout and touch test suites (Playwright) |
| `scripts/` | `print_pdf.py`, `verify_pdf.sh`, `build_tokens.py`, `render_assets.py` |
| `fonts/` | IBM Plex Sans Arabic and Inter (TrueType, OFL) for offline and print use |
| `examples/workout-plan/` | The full reference product: interactive site + 4 vector PDFs (EN/KU × dark/light) |
