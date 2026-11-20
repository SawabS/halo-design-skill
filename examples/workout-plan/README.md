# Reference product: Sawab's Workout Plan

The project Halo was extracted from.

- `index.html`: the interactive site. Open it through a local server. Sections:
  - Today: rings, steps, and actions for strength and mobility;
  - Plan: rules with sources;
  - Numbers: a projection calculator and chart;
  - Workout: six lifts with week stepper, filters, set dots, a log sheet and an automatic rest timer;
  - Session: warm-up, effort, progression and volume;
  - Recover: a guided stretch player;
  - Week: day tabs with rings;
  - Track: a weigh-in log, chart and undo;
  - Gear and Sources.

  English and Kurdish, dark and light. It stores state under the `swp:` localStorage namespace.
- `pdf/`: the same plan as 10-page vector PDFs (A3 poster + 9 A4 guide pages) in English and Kurdish, dark and light. All have 0 raster images, embedded fonts and live source links (`scripts/verify_pdf.sh`).

QA record: 606 scripted interaction checks, layout and clipping checks at 16 size, theme and language combinations, and the phone touch suite at 320–430 px, all passing.

The content is general fitness information with sources. It is not medical advice.
