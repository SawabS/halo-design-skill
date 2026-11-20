# Halo icons

Three families, three jobs. Never mix them up.

| Family | Folder | Grid | Job | Source of truth |
|---|---|---|---|---|
| **UI icons** | `ui/` | 24 × 24, 2 px stroke, round caps | Buttons, nav, controls | [Lucide](https://lucide.dev) (ISC). Halo ships the 12 it uses. Pull any others from Lucide; don't draw new ones. |
| **Glyphs** | `glyphs/` | 24 × 24, 2 px stroke | Small subject marks inside a 56 px `.tile` (scale, shoe, watch…) | Same grammar as Lucide. Check Lucide first, then draw in this style only if it has nothing. |
| **Pictograms** | `pictograms/` | 120 × 120 | Explain a *movement or action* inside a 104 px `.pic` tile | Halo's own grammar, below |

Open `index.html` to see every icon in both themes.

## UI icons: rules

- Use `stroke="currentColor"`, so the icon takes the button's text colour.
- Add `aria-hidden="true"` and put the accessible name on the button (`aria-label`), not on the SVG.
- Directional icons (prev, next, arrows) carry `data-flip-rtl`. `halo.css` mirrors them in RTL. Never mirror clocks, checkmarks, play/pause or logos.
- Size: 20 px inside 40–44 px buttons, 18 px inside the timer pill.

## Pictogram grammar

The exercise pictograms look like a single, consistent family because every one of them follows these rules. Use the same rules to draw pictograms for any domain: a cooking step, a yoga pose, an assembly instruction, a gesture tutorial.

### Canvas
- `viewBox="0 0 120 120"`. Draw inside an 8 px safe margin.
- **Ground line**: `x 16 → 104` at `y = 110`, stroke `--ic-mut`, 3 px, round caps. Every standing figure touches it.

### Figure (a stick figure that reads like a silhouette)
| Part | Shape | Stroke |
|---|---|---|
| Head | `circle r = 9.5` | filled |
| Torso | polyline | **14** |
| Legs | polyline | **11–12** |
| Arms | polyline | **8.5** |
| Joins | `stroke-linecap="round"` `stroke-linejoin="round"` | |

Thick, rounded strokes are what make it read as a body rather than a wireframe.

### Two poses = the movement
- **Start pose**: `--ic-ghost` (pale grey), drawn first, behind.
- **End pose**: `--ic-fg` (ink), drawn on top.
- The reader's eye goes from ghost to ink, and that is the motion. The legend on the page says: *faded figure = start · solid = finish*.

### Equipment and motion are the accent
- Equipment (a dumbbell, a pan, a tool) is `--ic-acc`. In the red/recovery family the tile sets `--ic-acc: var(--ic-acc2)`.
- Motion cues: a dotted line `stroke-dasharray="1 6.5"` 3.5 px plus chevron arrowheads, also `--ic-acc`.
- Only one accent per pictogram.

### Knock-outs keep overlaps legible
Where an ink limb crosses another ink shape, draw the same shape first in `--ic-ko` (the tile's background colour), **2.5–5 px wider**, then the ink shape on top. This cuts a clean gap, like the outline gaps in Apple's activity symbols. `--ic-ko` is set per tile (`.pic` = green tint, `.pic.red` = red tint), so the gap always matches the background.

### Tokens

```css
--ic-fg     /* end pose       */   --ic-ghost /* start pose */
--ic-mut    /* ground line    */   --ic-acc   /* equipment + motion */
--ic-ko     /* knock-out = tile background */
```

The files in `pictograms/` use `var(--ic-fg,#1D1D1F)` style fallbacks, so they also render correctly outside Halo (in Figma, in a README).

### Checklist for a new pictogram
1. Does the start pose fully differ from the end pose? If you can't tell what moved, change the pose, not the colour.
2. Is the accent used once?
3. Does every ink-on-ink crossing have a knock-out?
4. At 48 px, can you still name the action? If not, simplify.
5. Is it the same in both themes? Only tokens, never hex colours.
