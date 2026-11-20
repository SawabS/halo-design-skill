# 02 · Colour

All colour is in [`tokens/tokens.css`](../tokens/tokens.css), written once per token with CSS [`light-dark()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark). The same values exist as [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) JSON in `tokens/halo.light.tokens.json` and `tokens/halo.dark.tokens.json` for Figma, Style Dictionary, iOS or Android pipelines.

## How theming works

```css
:root{ color-scheme: light dark; --bg: light-dark(#F5F5F7, #000); }
:root[data-theme=light]{ color-scheme: light }
:root[data-theme=dark]{  color-scheme: dark }
```

- By default the page follows the OS.
- The theme button sets `data-theme` and stores the choice (`Halo.theme`).
- `light-dark()` accepts **colours only**. Gradients, shadows and images cannot go inside it. Build them from colour tokens instead:
  ```css
  /* ✗ */ --card-bg: light-dark(linear-gradient(...), linear-gradient(...));
  /* ✓ */ background: linear-gradient(180deg, var(--cA), var(--cB));
  ```

## The palette

### Surfaces and ink
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #F5F5F7 | #000000 | page |
| `--cA → --cB` | #FFF → #FFF | #1A1A1E → #0F0F11 | card gradient (dark cards get a gentle top light) |
| `--card2` | #FFF | #0E0E10 | sheets |
| `--well` | #F5F5F7 | #0E0E10 | tiles nested inside a card |
| `--ink` | #1D1D1F | #FFFFFF | titles, numbers |
| `--ink2` | #48484A | #B4B4BA | body |
| `--ink3` | #6E6E73 | #8E8E93 | labels, meta |
| `--rim` | 7 % black | 12 % white | the 1 px card edge |
| `--sep` | 8 % black | 10 % white | dividers |

### Accents: four roles each
Every accent has a vivid **fill**, a lighter **gradient partner**, a **text-safe** tone, and a **track** (the empty part of a ring or bar).

| Accent | Fill `--X` | Partner `--X2` | Text `--XT` | Track |
|---|---|---|---|---|
| Green | #34C759 / **#A6FF00** | #6FDD8B / #D2FF5C | #1A8A3A / #B4FF2E | `--trackG` |
| Cyan | #32ADE6 / **#00D8FE** | #7FD4F5 / #7BF3FF | #0071A4 / #5BDCFF | `--trackC` |
| Red | #FF2D55 / **#FA114F** | #FF6B88 / #FF6A97 | #D70F45 / #FF4D7A | `--trackR` |
| Amber | #FF9500 / #FF9F0A | #FFC048 / #FFD06B | #B35900 / #FFB547 | none |

(light / **dark**)

Rules:
- **Text in an accent colour always uses `--XT`**, never `--X`. Neon lime on white fails contrast; `--greenT` passes.
- **Fills, strokes and rings use `--X`** with a `--X2 → --X` gradient.
- Assign meaning once per product and keep it. In the reference app: green = strength / done, cyan = steps / information, red = recovery / mobility, amber = upgrade / caution.
- At most **three** accents on one screen.

### Chips
Filled pills: `--chipG/--chipGt`, `--chipR/--chipRt`, `--chipC/--chipCt`. In dark mode they are bright neon with near-black text (`#0A0A0A`), which is the Apple Fitness badge look. In light mode they are soft tints with dark accent text.

### Hero gradient
`--heroA → --heroB` (green → cyan). Use it in exactly two places: the second line of the page headline (`.grad`) and the scroll-progress hairline. In RTL the gradient runs 270deg so it still flows in reading direction.

### Light and motion colours
`--shine` (rim highlight core), `--shineT` (its tint), `--glow` (surface glow). In dark mode the light is white→cyan; in light mode it is blue→green, so it reads on white cards.

## Adding a colour
1. Ask whether an existing role covers it (it usually does).
2. Add it to `tokens.css` with `light-dark()`, both values chosen together.
3. Check text contrast for any text use: 4.5 : 1 for body, 3 : 1 for 18 px bold and up ([WCAG 2.2 SC 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum)).
4. Regenerate the JSON (see `scripts/README.md`).
