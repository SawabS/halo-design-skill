# 15 · Figma

Halo was built code-first and mirrored into Figma, not the other way round. Keep code as the source of truth and generate Figma from it.

## Tokens into Figma
Import `tokens/halo.light.tokens.json` and `halo.dark.tokens.json` as two modes of one Variables collection (Tokens Studio and most DTCG importers read the 2025.10 format). Name the modes **Light** and **Dark**.

## Generating frames from code (Figma Plugin API)
The reference posters and guide pages were built by a script that turns the same absolute layout used for the PDF into Figma nodes:
- one frame per page (A3 landscape 1191 × 842, A4 595 × 842);
- `figma.createRectangle()` for cards, with gradient fills from the tokens and the 1 px rim as an inside stroke;
- `figma.createText()` with `loadFontAsync` for every family and style before setting characters;
- SVG pictograms through `figma.createNodeFromSvg()`;
- RTL pages mirrored with `x' = W − x − w` and `textAlignHorizontal` flipped, Latin runs set to the Latin font with `setRangeFontName`.

Keep the generator code in a shared plugin data slot or a repo file, so every page is rebuilt from data, never hand-nudged.

## Fonts in Figma
Google Sans, Inter and IBM Plex Sans Arabic are all on Google Fonts, so Figma has them. IBM Plex Sans Arabic's style names are Regular, Medium, SemiBold and Bold. Set Arabic-script text boxes to *Right* alignment and letter spacing 0.

## Exporting PDFs
Figma's own "Export frames to PDF" produces vector PDFs. For production, the HTML pipeline in [11](11-print-and-pdf.md) is more reliable and scriptable.
