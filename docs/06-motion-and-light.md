# 06 · Motion and light

Halo motion makes the interface feel alive without asking for attention. There is one curve and a small set of durations, and everything stops under reduced motion.

## Tokens
| Token | Value | Used for |
|---|---|---|
| `--ease` | `cubic-bezier(.2,.8,.2,1)` | everything |
| press | 250 ms | buttons, chips, dots |
| glow | 450 ms | rim light fade |
| lift | 600 ms | card hover lift and tilt |
| reveal | 900 ms | scroll reveals |
| ring | 900 ms | ring and bar progress |
| stagger | 70 ms × index (max 5) | cards in a row |

## 1. Rim light (pointer-tracked edge shine)
**Pattern:** the "spotlight / magic card". The same technique is used by Magic UI's [MagicCard](https://magicui.design/docs/components/magic-card) (React, MIT) and by vanilla-tilt's glare option.

**How Halo does it.** `Halo.light` writes the pointer position into `--mx` and `--my` on the hovered card. Two pseudo-elements read them:
- `::before`: a radial gradient (`--shine` → `--shineT` → transparent, 300 px) clipped to a **1.5 px ring** with the mask-composite trick:
  ```css
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  padding: 1.5px;
  ```
  The lit edge "follows" the cursor around the border.
- `::after`: a 520 px radial `--glow` behind the content, a faint surface light.

Both fade in over 450 ms when the card gets `.lit`.

**Tilt.** Cards narrower than 520 px also tilt up to ±2.5° toward the pointer (`perspective(1100px) rotateX/rotateY`) and rise 3 px. Wide cards don't tilt, because tilting a wide card looks like a page warp.

**Touch.** There is no hover on phones, so a `pointerdown` puts the light where the finger lands. The card scales to 0.992 and the light fades after 650 ms.

**Library route.** In React use Magic UI `MagicCard` for the border light and Motion for the tilt; in vanilla use [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) with `{max: 5, glare: true, "max-glare": .15}`. Keep Halo's colours (`--shine`, `--glow`).

## 2. Reveal on scroll
Headings, ledes and cards fade in, rise 22 px and unblur 6 px the first time they enter the viewport, with a 70 ms stagger across a row.
- **Implementation:** IntersectionObserver (`Halo.reveal`). The classes are only added by script, so with JS off nothing is hidden.
- After re-rendering (for example a language switch) call `Halo.reveal.refresh()`. Anything already on screen gets the `.in` state instantly (`.now`), so nothing re-animates under the user's eyes.
- **Library route:** Motion `inView()` + `animate()` (MIT, built on IntersectionObserver), or GSAP ScrollTrigger. Pure CSS: `animation-timeline: view()`, wrapped in `@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))` with this IntersectionObserver as the fallback.

## 3. Scroll progress and nav state
A 2 px gradient hairline under the nav scales with page progress, and the nav gains a shadow after 8 px of scroll. It is one passive scroll listener throttled with `requestAnimationFrame`. In CSS-only form it is `animation-timeline: scroll()`.

## 4. Hero drift
The hero text column (`[data-drift]`) moves down at 0.12× scroll speed and fades to 25 % over 1100 px, a subtle parallax that hands focus to the content below. Desktop and phone; off under reduced motion.

## 5. Micro-interactions
- Button: hover −1 px (pointer only), press 0.96.
- Dot: press 0.92, fill swap with a check.
- Rings and bars animate their dash offset or width over 900 ms.

## Smooth scrolling
Native `scroll-behavior: smooth` is enough for anchor jumps. If you want inertial smooth scrolling on desktop, use [Lenis](https://github.com/darkroomengineering/lenis) (MIT). It honours `prefers-reduced-motion` by default; don't enable it on touch devices (`syncTouch: false`), and add `data-lenis-prevent` to dialogs.

## Reduced motion: non-negotiable
`@media (prefers-reduced-motion: reduce)` turns off reveals, tilt, drift, ring transitions and smooth scroll. The rim light stays (it is a static highlight, not movement).

## Don'ts
- No infinite loops, pulsing badges or bouncing arrows.
- No parallax on more than one element per screen.
- No new easing curves; if `--ease` feels wrong, change the duration.
- No animating layout properties (width, top). Animate transform, opacity, filter and stroke-dashoffset.
