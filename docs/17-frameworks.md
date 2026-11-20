# 17 · Using Halo in a framework

Halo is plain CSS custom properties, classes and a small script, so it drops into any stack. Here is how to map it into the common ones without losing the rules.

## Plain HTML / Astro / server-rendered pages
Link `tokens/tokens.css`, `css/halo.css`, `js/halo.js` (and optionally `js/halo-sound.js`), then call `Halo.init({ dict })`. `templates/starter.html` is the reference.

## React / Next.js + Tailwind CSS v4 + shadcn/ui
1. **Tokens.** Import `tokens/tokens.css` in the global stylesheet, then expose the tokens to Tailwind:
   ```css
   @import "tailwindcss";
   @import "./halo/tokens.css";
   @theme inline {
     --color-bg: var(--bg); --color-card: var(--card); --color-ink: var(--ink); --color-ink-2: var(--ink2); --color-ink-3: var(--ink3);
     --color-green: var(--green); --color-green-text: var(--greenT); --color-cyan: var(--cyan); --color-red: var(--red);
     --radius-card: 22px; --font-sans: var(--font);
     --ease-halo: cubic-bezier(.2,.8,.2,1);
   }
   @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
   ```
   Then `bg-card text-ink rounded-card ease-halo` and friends work, and `light-dark()` still drives the values.
2. **shadcn/ui.** Point shadcn's variables at Halo's: `--background: var(--bg)`, `--card: var(--card)`, `--foreground: var(--ink)`, `--muted-foreground: var(--ink3)`, `--border: var(--rim)`, `--ring: var(--focus)`, `--radius: 22px`. Use shadcn's Dialog (Radix) for sheets; keep Halo's sheet styling.
3. **Theme switch.** `next-themes` with `attribute="data-theme"`.
4. **Motion.** `motion/react` for reveals (`whileInView`, `viewport={{ once: true }}`) with Halo's values: `initial={{opacity:0, y:22, filter:'blur(6px)'}}`, `transition={{duration:.9, ease:[.2,.8,.2,1]}}`, stagger 0.07.
5. **Rim light.** Magic UI `MagicCard` (check its current props; recent versions expose gradient colour, size and from/to stops), fed with `--glow`, `--shine` and `--shineT`; or port `.card::before` and a 10-line `onPointerMove` that sets `--mx/--my`.
6. **Icons.** `lucide-react`.
7. **RTL.** `<html lang dir>` from the locale (next-intl), logical Tailwind utilities (`ms-4`, `ps-6`, `text-start`, `start-0`) and the `rtl:` variant for the few mirrored transforms.
8. **Fonts.** `next/font/google` (`IBM_Plex_Sans_Arabic`, and Google Sans if your Next.js version already lists it) or the Fontsource packages; set `--font-latin` and `--font-arabic` from their CSS variables.

## Vue / Nuxt
Same tokens and CSS. `motion-v` for animation, `@nuxtjs/i18n` for locales with `dir`, `lucide-vue-next` for icons.

## Native (SwiftUI, Compose, Flutter)
Build `tokens/halo.light.tokens.json` and `halo.dark.tokens.json` with Style Dictionary into asset catalogs and colour resources. Keep the semantics: rings use the platform's own drawing (SwiftUI `Circle().trim`), the system haptics engine replaces vibration, and RTL comes from the platform layout direction.

## Don't
- Don't re-pick colours "to match Tailwind's palette". Halo's accents *are* the palette.
- Don't wrap Halo classes in new component names that hide the rules. A `<HaloCard>` is fine if it renders `.card` and passes the props through.
