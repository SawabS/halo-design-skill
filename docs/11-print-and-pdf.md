# 11 · Print and PDF

Halo documents (posters, guides, one-pagers) are produced as **true vector PDFs**: real, selectable text with embedded fonts, live links and **zero raster images**. Never export PNGs and wrap them in a PDF.

## Pipeline
```
HTML page(s) at exact paper size  ──►  headless Chromium page.pdf()  ──►  qpdf merge  ──►  verify
```
1. **Lay out in HTML** with absolutely positioned elements in `pt` units (`@page { size: 595pt 842pt; margin: 0 }` for A4 portrait, `1191pt 842pt` for A3 landscape). One `.page` div per page, `break-after: page`.
2. **Print with Playwright** (or Puppeteer): `page.pdf({ preferCSSPageSize: true, printBackground: true, margin: 0 })`. `scripts/print_pdf.py` does this and waits for fonts and the fit pass first.
3. **Merge** with [qpdf](https://qpdf.readthedocs.io): `qpdf --empty --pages poster.pdf guide.pdf -- out.pdf`. Merging PDFs keeps everything vector; never merge via images.
4. **Verify** (`scripts/verify_pdf.sh`): `pdfimages -list` must list **0** images, `pdffonts` must show every font embedded, and the link count must match.

## Things Chrome rasterises (avoid them)
- `box-shadow` and `filter: drop-shadow` become **bitmaps** in Chrome's PDF output. For print, fake shadows with 3–4 stacked translucent rounded rects offset downward (Halo calls these *vector shadows*).
- `backdrop-filter`, and `filter: blur()` on content.
- Gradient text through `background-clip: text` can produce a hairline box in some viewers; draw gradient headlines as SVG `<text fill="url(#g)">` instead.
- Images of text. Draw icons as inline SVG.

## Fonts in print
- Embed by loading local files with `@font-face { src: url(file://…) }` and **awaiting** `document.fonts.load()` for every weight before printing. Fit passes that run before the font arrives measure the fallback and overflow later.
- Latin: Inter or Google Sans. Kurdish: IBM Plex Sans Arabic (map 800/900 to 700).
- Route Latin runs inside Kurdish lines (digits, product names, arrows) to the Latin font explicitly; Arabic fonts often draw ↖ ↗ as emoji boxes.

## RTL documents
Mirror the English layout instead of re-designing: `x' = pageWidth − x − w`, flip text alignment, letter-spacing 0, line height × 1.1. Then run an **auto-fit pass**. Kurdish runs longer than English, so for each text box with a known English line budget, shrink the font in 3 % steps (down to 70 %) until the rendered line count fits the budget. Headlines keep their designed number of lines exactly (a unit like `−20 کگم` must never break).

Chrome's print layout can wrap slightly differently from screen layout. Measure with `text-rendering: geometricPrecision`, emulate print media before fitting, and reserve about 3 % width while measuring.

## Page anatomy (Halo guide pages)
- 36 pt margins, footer hairline at 806 pt with the page number on one side and a short title on the other.
- Section kicker (`01 · The plan`) in a 10.8 pt accent, a two-line 34 pt headline, then cards.
- Every factual claim carries a link (`How to do it ↗`) and the last page lists all sources.
- Dark and light editions, plus RTL editions, built from the same source.
