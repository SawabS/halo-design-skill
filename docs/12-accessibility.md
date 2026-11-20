# 12 · Accessibility

Target: [WCAG 2.2](https://www.w3.org/TR/WCAG22/) AA, in both themes and both directions. Accessibility is part of the look, not a separate pass.

## Built into Halo
- **Contrast:** text uses `--ink`, `--ink2`, `--ink3` or the text-safe accents `--XT`. Vivid `--X` fills never carry text, except the dark-mode chips, which use near-black text on neon.
- **Focus:** a 3 px `--focus` outline with a 2 px offset on every focusable element via `:focus-visible`. Never remove it.
- **Targets:** 44 px for anything tappable (see [07](07-phone-and-touch.md)).
- **Skip link** as the first element: `<a class="skip" href="#main">`.
- **Dialogs** use native `showModal()`, which gives focus containment, Esc to close and an inert background. Every sheet has `aria-labelledby`.
- **State in ARIA:** filters and dots use `aria-pressed`; tabs use `aria-selected` with a roving `tabIndex`; the menu button uses `aria-expanded` and `aria-controls`; the current nav link uses `aria-current`.
- **Live regions:** toasts are `role="status"`; the timer pill is `role="timer"` with `aria-live="off"` (a ticking clock must not chatter), and the end of a timer is announced through the toast.
- **Icons** are `aria-hidden`; buttons carry `aria-label`, translated per language.
- **Motion:** everything that moves respects `prefers-reduced-motion`.
- **Sound** is never the only signal: a timer end also shows a toast and vibrates where possible, and sound has a visible on/off control.
- **Language:** `lang` and `dir` on `<html>`; switching language updates every `aria-label`.

## Patterns to follow
For widgets Halo doesn't ship (combobox, tree, carousel), follow the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern exactly, or use a headless library that already does (Radix UI, React Aria, Headless UI) and skin it with Halo.

## Automated check
Run [axe-core](https://github.com/dequelabs/axe-core) through Playwright (`@axe-core/playwright`) on every page in both themes and both languages:
```js
const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
expect(results.violations).toEqual([]);
```
Automated tools catch only part of WCAG. Also tab through every page once, and use a screen reader (VoiceOver or TalkBack) on the main flow.
