# 05 · Components

Every component below is in `css/halo.css`; the behaviour, where there is any, is in `js/halo.js`. `templates/starter.html` uses all of them. Markup is the contract: copy it as written.

## Navigation bar
```html
<header class="nav"><div class="wrap">
  <a class="brand" href="#top"><span>Product name</span></a>
  <nav class="links" aria-label="Sections"><a href="#a">A</a>…</nav>
  <div class="acts">
    <button class="btn lang" data-lang-btn>کوردی</button>
    <button class="btn ic hide-phone" data-sound-btn></button>
    <button class="btn ic" data-theme-btn></button>
    <a class="gh" href="https://github.com/you">…<span>GitHub</span></a>
    <button class="btn ic" data-menu-btn aria-expanded="false" aria-controls="menu"></button>
  </div></div>
  <div class="menu" id="menu"><div class="wrap">…links… <button class="full only-phone" data-sound-btn></button></div></div>
</header>
```
- **Brand = the product's own name, as text.** Halo never draws, invents or requires a logo. If the product already owns a mark, it may sit before the name (`.brand img`); otherwise leave it out.
- Sticky, frosted (`backdrop-filter: saturate(1.6) blur(18px)`), with a hairline under it.
- Gains a soft shadow once scrolled (`.scrolled`) and a 2 px green→cyan **scroll-progress** line (added by `Halo.nav`).
- Links show from 1180 px; below that, the menu holds every section plus secondary settings.
- The current section is marked with `aria-current="true"` by scroll spy.
- Phone version: see [07](07-phone-and-touch.md).

## Card
`.card`: 22 px radius, 1 px `--rim` edge, `--cA → --cB` gradient, two-layer soft shadow (light mode only), 20 px padding. Rim light and lift come for free (see [06](06-motion-and-light.md)). Variants: `.flat` (no shadow), `.stat` (number tile), `.tip` (icon + text row), `.stack` (pinned footer).

## Stat tile
```html
<div class="card stat"><div class="label">Goal</div><div class="v tone-red">−20 kg</div><div class="s">105 → 85 kg</div></div>
```
Grey label, big accent number, plain sub-line. Four of them in a `.g2.keep` grid is the classic hero block.

## Activity rings
`Halo.rings(specs, size)` returns concentric SVG rings; `Halo.setRing(svg, key, p)` animates one.
```js
Halo.rings([{k:'move',r:100,w:26,c:'red',track:'R'},{k:'ex',r:70,w:26,c:'green',track:'G'},{k:'stand',r:40,w:26,c:'cyan',track:'C'}],226)
```
- Stroke width 26 on a 226 box; gap between rings = stroke width + 4.
- Track = `--trackX`; arc = `--X2 → --X` gradient, round caps, starting at 12 o'clock.
- p = 0 hides the arc (no dot at 12 o'clock); p ≥ 0.999 draws 0.9999 so the cap still shows.

## Buttons
| Class | Use |
|---|---|
| `.btn` | default: card-coloured pill with a rim |
| `.btn.pri` | the one primary action per view: ink fill, page-colour text |
| `.btn.ic` | 44 × 44 icon button (needs `aria-label`) |
| `.btn.sm` | 36 px, inside cards |
Hover lifts 1 px (pointer devices only); press scales to 0.96.

## Chips
`.chip` (outline) and `.chip.green | .red | .cyan` (filled). They are for status and quantities ("3 × 8–12", "Every night"), not for actions.

## Filters, segmented control, stepper
- `.filters > button[aria-pressed]`: pill filters; the pressed one is ink-filled.
- `.seg > button[aria-pressed]`: two or three exclusive options (45 s / 60 s).
- `.stepper`: `−  Week 1  +`, round 40 px buttons around an `<output>`.

## Check dots
`.dot[aria-pressed]`: 44 px dashed squares that fill green with a check. Use them for countable progress (sets, steps, subtasks). Each tick may start a timer, play a rising note and give a 12 ms haptic.

## Lists
- `.checks` (green check bullets); `.checks.tiles` turns into a 2–3 column tile grid on wider screens.
- `.list`: label · value · 44 px action, divided rows (logs).
- `.sources`: numbered two-column reference list with a counter in `--greenT`. Every factual claim in a Halo product should link to one of these.

## KPI row and chart
`.kpis` (4 → 2 columns) of `<div><b>value</b><span>label</span></div>`; a `.fig` holding an SVG that a ResizeObserver redraws. See [10-data-viz.md](10-data-viz.md).

## Sheet (dialog)
```html
<dialog class="sheet" aria-labelledby="t"><div class="body">
  <div class="hd"><h3 id="t">Title</h3><button class="btn ic" data-close aria-label="Close">…</button></div>…
</div></dialog>
```
Open with `Halo.dialog.open(el)`. It uses the native `showModal()` (focus trap, Esc, top layer, inert background) and **moves the timer pill and toast into the dialog**, because anything outside a modal dialog cannot be clicked while it is open. Swipe left/right inside a sheet to page through items (`Halo.swipe`).

## Timer pill
`Halo.timer.start(90, {label, onEnd})`: a floating ink pill at the bottom with a ring, the time, −15 / +15, pause and skip. It respects the safe area, survives tab switches (it uses wall-clock time, not interval counts), plays a soft drop on the last three seconds and a chime at the end.

## Toast
`Halo.toast('Deleted.', {undo: fn})`: an ink pill under the nav, 2.8 s, or 6 s with an **Undo** button. Every destructive action gets an undo toast instead of a confirm dialog.

## Footer
`footer.foot`: a one-line tagline on the start side, "Back to top" on the end side.
