# 04 · Layout and balance

## The frame
- Content width `--max: 1180px`, centred. Side padding `max(16px, 4vw, safe-area)`.
- Sections are `.band` with `clamp(36px, 5vw, 72px)` vertical padding and a hairline between them.
- Every section opens with a `.head`: a two-line `h2` on the start side, and an optional control (chips, filters, legend) on the end side, aligned to the baseline of the last line.

## Grids
| Class | ≥ 1001 px | 901–1000 | 621–900 | ≤ 620 |
|---|---|---|---|---|
| `.g4` | 4 | 2 | 2 | 1 |
| `.g3` | 3 | 3 | 2 | 1 |
| `.g2` | 2 | 2 | 2 | 1 |
| `.g2.keep` | 2 | 2 | 2 | **2** (stat tiles, input pairs) |

Gap is always 14 px between cards and 10 px between tiles inside a card.

## Breakpoints that matter
- **≤ 639 px**: phone. Quiet nav (see [07](07-phone-and-touch.md)), 56 px nav height.
- **900 px**: two-column splits switch on (`.split`, equal heights).
- **1180 px**: inline nav links appear; below this the menu button handles navigation.

Test at **320, 360, 390, 430, 720, 800, 1024, 1280, 1440**. Those widths catch nearly every layout bug.

## Balancing a laptop screen (the part most generated UIs get wrong)

Wide screens expose every height mismatch as a black hole. Halo removes them with five techniques. Apply them deliberately.

### 1. Equal-height split
Text column next to a feature card: `.split`. From 900 px the card stretches to the text column's height (`align-items: stretch`) and becomes a flex column, with its footer pushed down (`.card-foot { margin-top: auto }`). The card's middle content (for example the rings) flexes to fill.

### 2. Header row instead of tall-left / short-right
If the left column is a short heading and the right column is a long list, don't put them side by side. Put the heading and a summary card in a header row, and put the list **below at full width**, as a grid of tiles (`.checks.tiles`: 3 columns ≥ 1000 px, 2 ≥ 760 px).

### 3. Pinned footers across a row
Cards in one row have different amounts of text. Make each card a grid with `grid-template-rows: auto auto 1fr auto auto` (`.stack` is the 3-row version). The flexible row absorbs the difference, so the buttons and links at the bottom line up across the row.

### 4. Content that fills its card
A chart next to a long list: make the chart card `display: flex; flex-direction: column` and give the figure `flex: 1; min-height: 280px`. A ResizeObserver redraws the SVG at the new size. A form next to a taller result card: put the form's last action at the bottom (`margin-top: auto`).

### 5. Ratio by content, not by symmetry
Use `minmax(0, 1.25fr) minmax(320px, .75fr)` rather than `1fr 1fr` when one side is text and the other is a compact card. Give the feature (rings, chart) the bigger share inside a card: `1.3fr / 1fr`.

### Laptop audit
After building, screenshot each section at 1280 and 1440 and look for:
- a column ending more than ~40 px before its neighbour;
- a single card alone on a row;
- a chart or ring smaller than the text beside it;
- buttons at different heights across a row.

## Phone layout
- One column. Stat tiles stay two-up (`.g2.keep`).
- A card's internal two-column layout (rings + metrics) stacks below 520 px, and the ring is capped at 220 px and centred.
- Controls that pair (−, input, +) use a fixed grid (`.nudge`: `44px 1fr 44px`) so they never wrap.
