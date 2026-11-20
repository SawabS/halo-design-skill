# 08 · RTL and Kurdish (Sorani)

Halo treats right-to-left as a first-class layout. Everything here applies to Arabic and Persian too; Sorani has extra letters (ێ ۆ ڵ ڕ ڤ ە) that many fonts get wrong, which is why the font rules matter.

## Switching
`Halo.i18n.set('ckb')` sets `<html lang="ckb" dir="rtl">`, stores the choice and re-renders. Everything visual keys off `[dir=rtl]` or `[lang=ckb]`. Detect the first-visit default from `navigator.language` (`ckb`, `ku`).

Keep the scroll position across a language switch (`const y = scrollY; …; scrollTo(0, y)`), and re-render any open sheet in place.

## Layout: logical properties only
Write `margin-inline-start`, `padding-inline`, `inset-inline-start`, `text-align: start`, never `left` or `right`. Then the whole layout mirrors for free. `halo.css` contains no physical left/right in components.

## What mirrors and what doesn't
| Mirrors | Stays |
|---|---|
| Layout, nav order, grids | Clocks, timers, play/pause |
| Chevrons and arrows (`data-flip-rtl`) | Check marks, logos, brand marks |
| Progress bars and the progress hairline (fill from the right) | Media controls |
| Timer and ring direction (counter-clockwise in RTL) | Charts' **numeric** labels |
| Gradient direction on `.grad` and meters (270deg) | Pictograms (the body faces the same way) |
| External-link arrow ↗ → ↖ | Phone numbers, code, URLs |

## Charts
SVG charts are drawn with `direction: ltr` on the `<svg>` (so `text-anchor` behaves predictably) and the **x coordinates are mirrored in code**: `x = isRTL ? W - x : x`. Time then runs right to left, and the y-axis labels move to the right edge with `text-anchor: start`. Don't use `transform: scaleX(-1)` on a chart, because it mirrors the text too.

## Typography
- Font: IBM Plex Sans Arabic first in the stack (see [03](03-typography.md)).
- **Never letter-space Arabic script** (`letter-spacing: 0`). Tracking breaks the joins.
- Line height 1.3 for headings and 1.75 for body; Arabic-script glyphs need more room above and below.
- Kurdish strings run 10–30 % longer than English. Let headings wrap to two lines, give chips `white-space: nowrap` and allow the row to wrap, and never fix widths to the English text.

## Mixed-direction text (bidi)
- Wrap Latin code, product names, units and URLs inside Kurdish sentences in `<bdi>…</bdi>`, so `light-dark()` doesn't render as `)light-dark(`.
- Put `dir="ltr"` on links and elements whose whole content is Latin (`github.com/you`, `Xiaomi Watch S5`).
- Put `dir="auto"` on user-generated or data-driven strings.
- Use `unicode-bidi: plaintext` on paragraphs whose direction depends on their first strong character.

## Numbers, dates, units
- **Digits stay Western (0–9) by default.** They are what Kurdish users see on most apps and price tags, they match the PDFs, and they avoid mixed-digit bugs in inputs. If a product wants Eastern Arabic digits (٠–٩), switch the formatter, never the font.
- Dates: `Intl.DateTimeFormat` has no complete Sorani month names, so Halo ships a table (`Halo.i18n.date`). Months: کانوونی دووەم, شوبات, ئازار, نیسان, ئایار, حوزەیران, تەممووز, ئاب, ئەیلوول, تشرینی یەکەم, تشرینی دووەم, کانوونی یەکەم. Days start on Sunday: یەکشەممە … شەممە. Join weekday and date with the Arabic comma «،».
- Units in Sorani: کگم (kg), گم (g), خولەک (min), چرکە (s), کالۆری (kcal). The number comes first: `20 کگم`.
- A minus sign stays attached: write `−20 کگم` with U+2212 and keep the whole value in one `nowrap` span.

## Translation workflow
1. Export every user-facing string to one JSON (`{"key": {"en": "…", "ckb": ""}}`). Include context notes for ambiguous keys.
2. Have a native speaker or a translation agent fill `ckb`. Keep product names and units policy in the notes.
3. Validate on import: no empty values, the same placeholders (`{n}`), and the same count of `\n` line breaks as the English (headlines are designed as two lines).
4. Render both languages and run the QA protocol in both directions.

## RTL QA checklist
- [ ] `dir` and `lang` set on `<html>`.
- [ ] Chevrons flip; play, check and clock icons don't.
- [ ] Rings and timers run counter-clockwise; progress fills from the right.
- [ ] Chart time axis runs right to left; labels are not mirrored.
- [ ] No letter-spacing on Arabic script.
- [ ] Latin terms inside sentences are isolated with `<bdi>`.
- [ ] Swipe direction feels natural.
