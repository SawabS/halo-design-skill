# 07 · Phone and touch

A phone is its own product. These rules came from testing on real 320–430 px screens.

## The quiet nav bar (≤ 639 px)
The desktop nav has outlined 44 px buttons and a filled GitHub pill; on a phone those turn into a row of heavy blobs that crowd the title. On phones:
- Height 56 px. Brand 16 px, logo 24 px.
- Icon buttons become **40 × 40, borderless, transparent**, `--ink2` icons, 2 px apart. They get a soft `--sep` background only when pressed or active.
- The language switch becomes a small 32 px grey pill (13 px text).
- **At most four controls** next to the brand: language, theme, one identity link (GitHub), menu. Anything else (sound, settings) moves into the menu as a full-width row (`.hide-phone` in the bar, `.only-phone` in the menu).
- At 360 px the brand and pill shrink a step; under 340 px the brand collapses to its logo (the name stays as screen-reader text), so nothing collides.

## Menu
A two-column grid of 48 px tiles under the bar, containing every section plus the secondary settings. It closes on Esc, on a link tap, and on a tap outside. For the outside-tap check use `event.composedPath()`, not `contains()`, because the tapped icon may have been re-rendered out of the DOM.

## Touch targets
44 × 44 px minimum for anything tappable ([WCAG 2.2 SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) asks for 24 px; Apple's HIG says 44 pt, and Halo follows Apple). The 40 px quiet nav icons are the only exception, and they have 2 px spacing so their 44 px hit areas don't overlap.

## Feedback without hover
- **Tap glint**: the card's rim light appears at the finger and fades after 650 ms (`Halo.light`).
- **Press**: buttons and chips scale to 0.95, cards to 0.992.
- **Haptics**: `Halo.haptic(ms)` uses the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API): 6 ms for small steps, 12 ms for completing something, `[120,60,120]` when a timer ends. Android only, since iOS Safari doesn't expose vibration, so never rely on it alone.
- Remove the grey tap flash (`-webkit-tap-highlight-color: transparent`) and the 300 ms delay (`touch-action: manipulation`), both in `halo.css`.

## Gestures
- **Swipe** inside sheets to move to the next or previous item (`Halo.swipe(el, {next, prev})`): 60 px minimum, mostly horizontal, under 700 ms, ignored when it starts in an input. Direction flips in RTL (swiping toward the reading end means "next").
- Always keep visible buttons for the same action; a swipe is a shortcut, never the only path.

## Safe areas and floating layers
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- The timer pill sits at `bottom: max(16px, env(safe-area-inset-bottom))`; the toast at `top: nav height + safe-area-inset-top`.
- When a sheet is open, move the pill and toast **into** the `<dialog>` (Halo does this) and add bottom padding to the sheet so the pill doesn't cover its buttons.

## Inputs
- `font-size: 16px` on every input, so iOS doesn't zoom on focus.
- `inputmode="numeric"` / `"decimal"` for numbers; clamp values in code (negative and huge values were the first things QA broke).
- Show a placeholder (`0`) rather than an empty box.

## Checklist (run at 320, 360, 390, 430)
- [ ] No sideways scroll.
- [ ] Brand and controls never touch.
- [ ] Every tappable thing ≥ 44 px, or a quiet nav icon with spacing.
- [ ] Tap glint, press scale and haptic fire.
- [ ] Sheet swipe works in both directions and in RTL.
- [ ] Pill and toast are reachable while a sheet is open.
