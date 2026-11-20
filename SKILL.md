---
name: halo-design
description: Halo, a calm, glossy, numbers-first design system for any web app, dashboard, tool, landing page or vector PDF, bilingual by design (English + Kurdish Sorani or any RTL script). Use it when the user asks for the Halo style, wants a polished dark/light interface that feels alive (rim-lit cards, quiet motion, optional calm sound), needs Kurdish, Arabic or Persian alongside English, or wants print-ready vector PDFs. The agent writes a short design brief and invents a product-specific signature visual, accent meanings and illustration language inside fixed rules (tokens, type, motion, accessibility, QA). Built only on web standards and named production libraries, and reproducible end to end.
---

# Halo design skill

Halo is a **way of designing**, not a theme to copy. It fixes the grammar (tokens, type, motion, accessibility, bilingual layout, QA) and leaves the product's character to you: its signature visual, accent meanings, illustrations, copy and sound. The workout plan in `examples/` and the two templates are demonstrations of the mechanics, not content to reuse.

## Ground rules
1. **Design per product.** Write the brief first ([`templates/brief.md`](templates/brief.md)) and choose a signature visual that fits *this* product ([`docs/00-creative-direction.md`](docs/00-creative-direction.md)). Rings, exercise pictograms and workout copy are wrong unless the product is about closing daily goals.
2. **Platform → Halo → proven library. Never invent mechanisms** ([`docs/16-libraries.md`](docs/16-libraries.md)).
3. **Tokens are the only source of colour, curve and radius.** No colour literals outside `tokens/tokens.css`; `scripts/check_skill.py` enforces this for Halo's CSS.
4. **Both themes, both directions, every breakpoint** are designed and tested.
5. **Numbers first:** grey label → big accent value → plain sentence. Visuals repeat the number, never replace it.
6. **Motion is light:** one curve, reveal once, nothing loops, reduced-motion safe. Live data updates in place and never re-animates.
7. **No logos.** The brand slot is the product's name in text. Use a mark only if the user supplies one.
8. **Done means QA passed** ([`docs/13-qa.md`](docs/13-qa.md)).

## Read only what the task needs
The docs are short (under 1,500 tokens each). Don't read everything; route by task:

| Task | Read | Start from |
|---|---|---|
| Any new product or page | `docs/00`, `docs/02`, `docs/03`, `docs/05` | `templates/starter.html` (personal app) or `templates/dashboard.html` (data / ops) |
| Data-heavy screen | `docs/10`, `docs/04` | `templates/dashboard.html` |
| Kurdish / Arabic / Persian | `docs/08`, `docs/03` | either template with `lang=ckb` |
| Phone polish | `docs/07` | — |
| Motion, rim light, scroll | `docs/06` | — |
| Sound | `docs/14` | `js/halo-sound.js` |
| Icons or illustrations | `icons/README.md`, `docs/09` | `icons/` |
| Printed document or PDF | `docs/11` | `templates/print-a4.html` |
| React / Next / Tailwind / Vue | `docs/17` | — |
| Choosing a library | `docs/16` | — |
| Figma or design tokens for other tools | `docs/15`, `tokens/*.tokens.json` | — |
| Accessibility | `docs/12` | — |
| Testing | `docs/13` | `qa/` |

**Never read `examples/workout-plan/index.html` whole** (about 42k tokens). Search it for a specific pattern instead (`grep -n "restTimer" …`).

## Workflow
1. **Brief.** Fill in `templates/brief.md`: who it's for, what they come back to check, the 1–3 hero numbers, the signature visual, accent meanings, illustration language, motion and sound intensity, surfaces, languages and sections. If the request is ambiguous, show the brief and ask one question; otherwise state it in a short paragraph and build.
2. **Foundation.** Link `tokens/tokens.css`, `css/halo.css`, `js/halo.js` (plus `js/halo-sound.js` only if the brief has sound), and call `Halo.init({dict})`. Fonts: Google Sans + IBM Plex Sans Arabic ([`docs/03`](docs/03-typography.md)).
3. **Compose sections** from the components in [`docs/05`](docs/05-components.md):
   - Build the signature visual with existing pieces: `Halo.rings`, `Halo.spark`, `.meter` with a `.target` marker, `.bars`, `.timeline`, the status grid, or a typographic hero. Or invent one that follows the rules in `docs/00`.
   - Replace all template content. If your page says "Close the rings" or "GPUs healthy" and the product isn't about that, you copied.
4. **Balance** phone and laptop separately ([`docs/04`](docs/04-layout.md), [`docs/07`](docs/07-phone-and-touch.md)).
5. **Bilingual:** every string goes in the dictionary, with RTL rules from [`docs/08`](docs/08-rtl-and-kurdish.md). If you write Kurdish yourself, tell the user and recommend a native review.
6. **Motion and sound** at the intensity the brief chose ([`docs/06`](docs/06-motion-and-light.md), [`docs/14`](docs/14-sound.md)).
7. **QA**, served over http:
   ```bash
   python3 qa/qa_layout.py http://localhost:8000/page.html    # 9 widths × 2 themes × 2 languages
   python3 qa/qa_touch.py  http://localhost:8000/page.html    # phone touch suite
   ```
   Add the product's own interaction checks and axe-core. Review screenshots at 390 and 1440 in both themes.
8. **Print** if needed: HTML → `scripts/print_pdf.py` → `qpdf` merge → `scripts/verify_pdf.sh` (0 images). Embed `.ttf` fonts.

## Pre-delivery checklist
- [ ] A brief exists, and the signature visual fits the product (not rings by default, not copied content).
- [ ] At most three accent meanings, used consistently; text accents use `--XT`.
- [ ] No colour literals outside tokens; no logo the user didn't supply.
- [ ] Laptop: balanced columns, aligned footers, charts fill their cards. Phone: ≤ 4 nav controls, 44 px targets, no sideways scroll at 320.
- [ ] RTL: `dir`/`lang`, flipped chevrons, mirrored charts, `<bdi>` around Latin terms and Latin units.
- [ ] Reduced motion honoured; sound (if any) has a toggle and is never the only signal.
- [ ] Sources linked for factual claims; Undo for destructive actions.
- [ ] `qa_layout.py` and `qa_touch.py` pass; no console errors; PDFs verified vector.

## Reproducibility
- `make setup` installs pinned dependencies (`requirements.txt`) and Chromium.
- `make check` validates the skill itself: links, tokens in sync, no stray colours, no logos, JS syntax, frontmatter.
- `make qa` tests every template and the example; `make assets` re-renders the README images; `make tokens` rebuilds the DTCG JSON.
- CI runs the same in `.github/workflows/qa.yml`.

## File map
| Path | What |
|---|---|
| `docs/00-creative-direction.md` | **Read first.** Brief, signature visual catalogue, accent meanings, illustration language, anti-patterns |
| `templates/brief.md` | The brief to fill in |
| `templates/starter.html` | Personal-app mechanics: split hero, rings, tasks, timer, sheet, sound |
| `templates/dashboard.html` | Data/ops mechanics: status grid, sparklines, meters with targets, live updates, still motion |
| `templates/print-a4.html` | Vector print page |
| `tokens/` | `tokens.css` (source of truth) + DTCG 2025.10 JSON |
| `css/halo.css` · `js/halo.js` · `js/halo-sound.js` | Components · runtime · calm sound |
| `icons/` | UI icons (Lucide grid), glyphs, pictogram grammar + gallery |
| `docs/01–17` | Principles, colour, type, layout, components, motion, phone, RTL, icons, data viz, print, a11y, QA, sound, Figma, libraries, frameworks |
| `qa/` · `scripts/` | Test suites · print, verify, tokens, assets, self-check |
| `fonts/` | IBM Plex Sans Arabic + Inter (TTF, OFL) for offline, CI and print |
| `examples/workout-plan/` | One complete product made with Halo (site + 4 vector PDFs). Reference only. |
