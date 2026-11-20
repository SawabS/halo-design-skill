# 16 · Production libraries: the one-to-one map

**Rule for agents:** do not invent a mechanism Halo or the platform already covers, and do not hand-roll something an established library is the standard for. Pick from this table, in this order: **platform → Halo → library**. Every library listed is open source, widely used in production and actively maintained as of late 2026. Check each project's README for its current API before writing code.

| Need | Platform (first choice) | Halo | Production library (when the platform is not enough) | Licence |
|---|---|---|---|---|
| Light / dark theming | `light-dark()`, `color-scheme` | `tokens.css`, `Halo.theme` | Tailwind v4 `@theme` + `dark:` variant; `next-themes` in Next.js | MIT |
| Design tokens exchange | — | `tokens/*.tokens.json` (DTCG 2025.10) | [Style Dictionary](https://styledictionary.com) / [Terrazzo](https://terrazzo.app) to build iOS, Android, CSS | Apache-2.0 / MIT |
| Modal, sheet | `<dialog>.showModal()` | `Halo.dialog` | Radix UI Dialog, React Aria, Headless UI (React) | MIT / Apache-2.0 |
| Menus, popovers | Popover API (`popover`) | `.menu` | Radix / React Aria | MIT / Apache-2.0 |
| Reveal on scroll | IntersectionObserver; CSS `animation-timeline: view()` | `Halo.reveal` | [Motion](https://motion.dev) `inView()` + `animate()`; GSAP ScrollTrigger | MIT / GSAP Standard Licence (free) |
| Scroll-linked effects | CSS `animation-timeline: scroll()` | `Halo.nav` progress, `Halo.drift` | Motion `scroll()`; GSAP ScrollTrigger | MIT / free |
| Timelines, complex sequences | Web Animations API | — | GSAP (all plugins free since April 2025); Motion | free / MIT |
| Smooth (inertial) scroll | `scroll-behavior: smooth` | — | [Lenis](https://github.com/darkroomengineering/lenis) (desktop only, honours reduced motion) | MIT |
| Rim light / spotlight card | CSS mask + radial gradient | `.card::before`, `Halo.light` | Magic UI `MagicCard` (React + shadcn) | MIT |
| 3D tilt + glare | CSS `perspective` | `.card.tilt` | [vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) | MIT |
| Page transitions | View Transitions API | — | Motion `AnimatePresence`, Astro/Next view transitions | MIT |
| UI icons | inline SVG | `icons/ui` | [Lucide](https://lucide.dev) (`lucide`, `lucide-react`) | ISC |
| Charts | SVG + ResizeObserver | `.fig` pattern | Apache ECharts · Chart.js · D3 | Apache-2.0 · MIT · ISC |
| Rings | SVG stroke-dasharray | `Halo.rings` | (none needed) | — |
| Sound | Web Audio API | `halo-sound.js` | [Tone.js](https://tonejs.github.io) | MIT |
| Haptics | Vibration API | `Halo.haptic` | Capacitor Haptics / Expo Haptics in native shells | MIT |
| i18n, plurals, dates | `Intl.*` | `Halo.i18n` | i18next, FormatJS / react-intl, next-intl | MIT / BSD |
| RTL CSS | logical properties | `halo.css` | Tailwind logical utilities (`ms-*`, `ps-*`, `start-*`), `rtl:` variant | MIT |
| Fonts | Google Fonts CSS API | `fonts/` | [Fontsource](https://fontsource.org) (`@fontsource-variable/google-sans`, `@fontsource/ibm-plex-sans-arabic`) | OFL |
| Browser testing | — | `qa/` | [Playwright](https://playwright.dev) | Apache-2.0 |
| Accessibility testing | — | — | [axe-core](https://github.com/dequelabs/axe-core) via `@axe-core/playwright` | MPL-2.0 |
| HTML → vector PDF | Chrome print | `scripts/print_pdf.py` | Playwright / Puppeteer `page.pdf()`; [Paged.js](https://pagedjs.org) for book-like pagination | Apache-2.0 / MIT |
| PDF merge / inspect | — | `scripts/` | qpdf, poppler-utils (`pdfimages`, `pdffonts`) | Apache-2.0 / GPL |

## Notes on choosing
- **Motion vs GSAP.** Both are production standards. Motion is MIT and integrates natively with React and Vue; GSAP is free (including SplitText, MorphSVG and ScrollTrigger) under its own Standard "No Charge" licence, which restricts use in tools that compete with Webflow's visual builder. In a React app default to Motion; in vanilla or Webflow-adjacent sites GSAP is fine.
- **Lenis** wraps native scroll, so ScrollTrigger and Motion's `scroll()` keep working. Sync it to GSAP's ticker when both are used.
- **CSS scroll-driven animations** ship in Chromium (115+) and Safari 26, and are still behind a flag in Firefox. Always wrap them in `@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))` and keep the IntersectionObserver fallback.
- **Magic UI / Aceternity / 21st.dev components** are copy-paste React + Tailwind sources. Treat them as reference implementations: copy, then re-skin with Halo tokens. Don't add their extra effects (meteors, beams); Halo's motion vocabulary is deliberately small.

## What not to add
- jQuery plugins, animate.css, AOS, or other scroll-reveal libraries: IntersectionObserver or Motion already cover them.
- Icon fonts (Font Awesome webfont). Use SVG.
- A second animation library next to the first.
- Any library to "detect dark mode": `prefers-color-scheme` and `light-dark()` are the platform.
