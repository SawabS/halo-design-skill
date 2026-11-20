# 03 · Typography

## Families

| Script | Web | Print (PDF) | Licence | Get it |
|---|---|---|---|---|
| Latin | **Google Sans** (variable, 400–700) | Inter or Google Sans | SIL OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/Google+Sans) · [Fontsource](https://fontsource.org/fonts/google-sans) |
| Arabic script (Sorani, Arabic, Persian) | **IBM Plex Sans Arabic** (400/500/600/700) | IBM Plex Sans Arabic | SIL OFL 1.1 | [Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic) · bundled in `fonts/` |

One request loads both:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Google released Google Sans under the OFL in late 2025, so it is safe for any product. If you self-host (offline apps, PDFs), use the Fontsource packages or the files in `fonts/`.

### Why IBM Plex Sans Arabic for Kurdish
We tested 12 Arabic-script families against real Sorani text. Many break the Kurdish letters **ێ ۆ ڵ ڕ ڤ** or set them on a different baseline. Plex Sans Arabic, Noto Sans Arabic, Vazirmatn, Beiruti, Zain and Mada all shape Sorani correctly. Plex was chosen because:
- its proportions match Google Sans and IBM Plex Latin, so mixed lines look like one family;
- it is low-contrast and open, so it stays legible at 12–13 px on phones;
- its weights 400–700 line up with the Latin weights.

Plex has no 800/900 weights. Map 800/900 to Bold (`font-weight: 700 900` in `@font-face`).

### Stack order follows the language
```css
--font: "Google Sans","IBM Plex Sans Arabic",system-ui,...;            /* en */
:root[lang=ckb]{ --font: "IBM Plex Sans Arabic","Google Sans",system-ui,...; }
```
In Kurdish mode Plex shapes the text, and Latin words and digits still fall through to Plex's own Latin. Digits stay Western (0–9) by default; see [08](08-rtl-and-kurdish.md).

## Scale

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display `h1` | `clamp(42px, 6.2vw, 76px)` | 700 | −0.035em | 1.0 |
| Section `h2` | `clamp(32px, 4.4vw, 48px)` | 700 | −0.022em | 1.05 |
| Card title `h3` | 19 px (sheet 22 px) | 700 | −0.022em | 1.25 |
| Big number | 30–40 px, `clamp()` | 700 | −0.03em | 1.1 |
| Lede | 17 px | 400 | 0 | 1.55 |
| Body | 15–16 px | 400 | 0 | 1.55 |
| Label | 13 px | 700 | 0 | — |
| Button | 14–16 px | 650 | 0 | — |

**In RTL:** tracking is 0 for every role (Arabic script must never be letter-spaced, because it breaks the joins), heading line height becomes 1.3, body becomes 1.75, and `h1` steps down to `clamp(38px, 5.6vw, 66px)`, because Arabic-script glyphs are taller.

## Rules
- Headlines are two short lines, with the second line in `.grad`. Use `text-wrap: balance` (already on h1–h3).
- Numbers that change (timers, counters) use `font-variant-numeric: tabular-nums` (`.num`).
- Big numbers never wrap mid-value. Use `white-space: nowrap` on the value and shrink the size with `clamp()` instead.
- Don't use more than four sizes on a card.
- Minimum text size: 12 px on screen, 7.5 pt in print.
