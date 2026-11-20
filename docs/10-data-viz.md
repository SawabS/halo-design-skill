# 10 · Data visualisation

Halo charts are few and plain: a ring, a bar or meter, a line. Each one repeats a number that is also printed as text.

## Choose the form
| Question | Form | Halo piece |
|---|---|---|
| What is the value now, and which way is it heading? | Big number + sparkline | `.stat` + `Halo.spark` |
| How healthy are many similar units? | Status grid (tile per unit: chip, meter, sparkline) | see `templates/dashboard.html` |
| Am I within budget or limit? | Meter with target marker | `.meter` + `.target` |
| What is my rhythm over weeks? | Heat strip: 7 × n cells, one accent ramp (track → X2 → X) | grid of cells |
| How close am I to today's goal? | Ring (one per goal, max 3, concentric) | `Halo.rings` |
| How far through a sequence? | Meter / segmented bar | `.meter`, `.timeline`, `.pbar` dots |
| How did it change over weeks? | Line with a dashed goal line | SVG in `.fig` |
| How do a few periods compare? | Vertical bars, values on top | `.bars` |
| What happens over a session? | Proportional timeline (warm-up · main · cool-down) | `.timeline` |

No pie charts, no 3D, no dual axes.

## Colour
- One series = one accent; use the accent that already means that thing on the page.
- Empty or remaining = the matching `--trackX`.
- Gridlines = `--sep`. Axis text = `--ink3`, 12.5 px, semibold, with a `--card` coloured `paint-order: stroke` halo so labels stay readable over lines.
- A goal or limit line = dashed `--green` (`stroke-dasharray: 5 5`).
- For more series or a validator, use the colour formula in a dedicated data-viz skill. Halo deliberately stays at three accents.

## Drawing pattern (SVG + ResizeObserver)
```js
function draw(){
  const s = svg, W = s.clientWidth, H = s.clientHeight; if(!W||!H) return;
  const R = Halo.i18n.isRTL(), ml=36, mr=12, mt=12, mb=26;
  const X = i => { const x = ml + i/(n-1)*(W-ml-mr); return R ? W-x : x };  // mirror in code
  const Y = v => mt + (max-v)/(max-min)*(H-mt-mb);
  s.innerHTML = gridlines + goalLine + `<polyline …/>` + points;
}
new ResizeObserver(draw).observe(svg);
```
- The `<svg>` fills a `.fig` box (`position:absolute; inset:0`) and has `direction: ltr`.
- Redraw on resize instead of using `viewBox` scaling, so text stays 12.5 px at every width.
- Show fewer x labels on narrow screens (3 under 520 px, 5 above). The first label is anchored at start and the last at end, so they never clip.
- An empty state is a centred sentence in the chart area, not a blank box.

## Rings in detail
- Concentric, outer ring first. Width 26 on a 226 box, gap 4.
- 0 % hides the arc completely; 100 % draws 99.99 % so the round cap still shows; over 100 % stays full (don't wrap a second lap unless the product explicitly celebrates overachievement).
- In RTL the timer ring runs counter-clockwise (`scaleY(-1)` after the −90° rotate).

## Libraries
If you need more than these forms (zoom, brushing, many series, tooltips everywhere), use a production chart library and skin it with Halo tokens:
- [Apache ECharts](https://echarts.apache.org) (Apache-2.0): rich, canvas/SVG renderer, built-in RTL-friendly options.
- [Chart.js](https://www.chartjs.org) (MIT): simple, canvas.
- [D3](https://d3js.org) (ISC): when you need full control. Halo's hand-drawn SVG follows D3's scale idea.
Map `--ink3` to axis text, `--sep` to gridlines and the accents to series. Turn off the libraries' own animations under reduced motion.
