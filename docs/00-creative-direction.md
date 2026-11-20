# 00 · Creative direction: read this first

Halo is a **way of designing**, not a fitness theme. The workout plan in `examples/` is one product made with it; its rings, exercise pictograms and copy are that product's choices. A Halo finance app, course platform, server dashboard or reading app should look like it belongs to the same family, but it should **not** look like the workout plan.

So before building, the agent writes a short brief and makes deliberate, product-specific choices inside a small set of fixed rules.

## What is fixed, and what is yours to invent

| Fixed: this is what makes it Halo | Free: invent these for each product |
|---|---|
| Token grammar: surfaces, ink, accent *roles* (fill, partner, text, track), both themes | **What** each accent means, and even the accent hues themselves (see "New accent families") |
| Type system: one Latin and one Arabic-script family, the scale, RTL rules | Headline voice and copy, section names, order and count |
| Numbers-first hierarchy: label → big value → plain sentence | **The signature visual**: the one device that *is* this product |
| Cards: radius, rim, rim light, reveal, one easing curve | Layout composition per section; which components appear at all |
| Bilingual, phone-and-laptop balance, accessibility, QA | Illustration language: pictograms, glyphs, photos or none |
| No logos, no invented brand marks | Sound: which named cues, if any; ambient or not |
| Platform → Halo → proven library | Motion intensity: still, calm or lively (all within the one curve) |

## Step 1 · Write the brief (keep it to about ten lines)
Copy [`templates/brief.md`](../templates/brief.md) and fill it in before writing any markup. Show it to the user when the request is ambiguous; otherwise state it in one paragraph and build.

The questions that matter:
1. **Who is this for, and what do they come back to check?** That check is the hero.
2. **The 1–3 numbers or entities that matter.** These become the big values.
3. **The signature visual.** One device, chosen from the catalogue below or invented, that shows those numbers at a glance.
4. **Accent meanings.** At most three, written down: "green = paid, red = overdue, cyan = scheduled".
5. **Illustration language.** Pictograms for *actions*, glyph tiles for *things*, real photos for *products*, or none.
6. **Motion and sound intensity.** A trading screen is still and silent; a habit app may chime.
7. **Surfaces.** Web only, or also print and PDF? Languages?

## Step 2 · Choose the signature visual
Pick the one that matches what the user is checking. **Rings are only right when there are 1–3 daily goals to "close".** Never put rings on a product by default.

| The user checks… | Signature visual | Halo pieces | Example products |
|---|---|---|---|
| progress toward a few daily goals | concentric **rings** | `Halo.rings` | habits, fitness, focus |
| one money or quantity value and its trend | **big number + sparkline** | `.stat`, `Halo.spark` | balance, revenue, savings |
| a budget or a limit | **meter** with a target marker | `.meter` | budgets, quotas, storage |
| a path through steps | **segmented progress / timeline** | `.timeline`, `.dots` | courses, onboarding, publishing guides |
| many similar units' health | **status grid** of tiles | `.grid`, `.chip`, `Halo.spark` per tile | servers, GPUs, devices, fleet |
| comparisons between options | **bars** with values on top | `.bars` | research results, A/B tests, plans |
| a rhythm over weeks | **calendar heat strip** (7 × n cells in one accent ramp) | `.days` / grid cells | streaks, attendance, commits |
| reading or reference | **typographic hero** (huge headline, reading-time chip, sources) | `h1`, `.chip`, `.sources` | guides, docs, articles |
| a product to buy | **product image + price as the big number** | `.card`, `.stat`, chips for variants | shops, catalogues |
| a place or route | **map or route line** (from a map library) + itinerary timeline | `.timeline` | travel, delivery |

If none fits, invent one. It must show the hero numbers at a glance, use one accent per meaning, have a text equivalent and work in RTL.

## Step 3 · Map accents to meaning
Halo ships green, cyan, red and amber with fixed *roles*, not fixed *meanings*.
- Pick the meaning per product and use it everywhere: in charts, chips, rings and pictograms.
- The default reading is green = good or done, red = attention or risk, cyan = information or neutral, amber = warning. Flip it only when the domain demands it (some markets read red as "up").
- Never use an accent for decoration only.

### New accent families
If the product has a brand colour, replace one accent family; don't add a fifth. In `tokens.css`, define all four roles for both themes together:
- `--X`: vivid fill (dark mode: high chroma; light mode: slightly deeper);
- `--X2`: a lighter partner for gradients;
- `--XT`: the text-safe tone, at least 4.5 : 1 against `--bg` and `--card` in each theme;
- `--trackX`: about 15 % of the fill over the background.

Then re-run `scripts/build_tokens.py` and the QA.

## Step 4 · Illustration language
- **Actions** (do this, then this): pictograms in the grammar in [`icons/README.md`](../icons/README.md): a ghost start pose, an ink end pose, one accent. Draw new ones for the domain: a hand tapping a card, a parcel being scanned, a pan being flipped.
- **Things** (a wallet, a server, a book): a 24 px glyph in a gradient `.tile`, taken from Lucide.
- **Products, places, people**: real photography supplied by the user, in rounded `.card` media. Never stock-photo fillers, and never generated images of real people.
- **Nothing** is a valid choice: a typographic product can be pure type, numbers and charts.

## Step 5 · Compose, don't clone
- Start from `templates/starter.html` or `templates/dashboard.html` for *mechanics*, then **replace the content, section list and hero device**. If the result reads "Do the work. Close the rings.", you copied instead of designing.
- Every section should earn its place: hero, the thing users act on, the trend, the reference. Four to six sections is typical.
- Vary composition: a split hero for a personal app, a full-width status grid for operations, a typographic hero for reading.

## Worked mini-briefs

**Personal finance (Bucky-like).**
- Hero: this month's balance as the big number with a 30-day sparkline.
- Signature: a budget meter per category with a target marker.
- Accents: green = under budget, red = over, cyan = income.
- Illustration: glyph tiles (wallet, receipt, card).
- Motion: calm. Sound: off by default; one soft `tap` when a transaction is categorised.

**GPU cluster status.**
- Hero: "16 / 16 GPUs healthy".
- Signature: a status grid of 16 tiles, each with a utilisation meter and a tiny latency sparkline.
- Accents: green = healthy, amber = hot, red = down, cyan = info.
- Illustration: none.
- Motion: still (no reveals on data that updates). Sound: off. See `templates/dashboard.html`.

**Course or blueprint (Brilliant-like).**
- Hero: the next lesson card and the progress through the course.
- Signature: a segmented path of lessons with done, current and locked states.
- Accents: green = done, cyan = current, amber = review due.
- Illustration: pictograms for concepts in motion (a token being split, a matrix multiplied).
- Sound: `on` notes climbing as lessons complete.

**Kurdish tokenizer research site.**
- Hero: the best tokenizer's score as the big number with its vocab size.
- Signature: comparison bars across BPE and Unigram and vocab sizes, plus a live tokenisation viewer that renders tokens as chips.
- Accents: green = winner, cyan = baseline, red = regressions.
- RTL-first, since the corpus is Sorani.
- Print: a vector PDF one-pager of results.

## Anti-patterns (stop and redesign if you see these)
- Rings, workout copy or the exercise pictograms in a product that is not about daily goals.
- Every page starting with the same split hero and four stat tiles.
- More than three accent meanings, or an accent used just to make something "pop".
- A logo or brand mark that the user didn't supply.
- Invented UI mechanisms where the platform or a library already has one ([16](16-libraries.md)).
