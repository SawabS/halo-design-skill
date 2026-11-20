# Scripts

| Script | What it does |
|---|---|
| `print_pdf.py page.html out.pdf [--wait-title FIT:]` | Prints HTML to a vector PDF with Playwright (print media, CSS page size, zero margins, waits for fonts and an optional fit pass). |
| `verify_pdf.sh *.pdf` | Fails unless a PDF has 0 raster images and every font embedded; prints page and link counts. |
| `build_tokens.py` | Regenerates `tokens/halo.light.tokens.json` and `halo.dark.tokens.json` (DTCG 2025.10) from `tokens/tokens.css`. |

Merge PDFs without rasterising:
```bash
qpdf --empty --pages poster.pdf guide.pdf -- "Final.pdf"
```
Setup: `pip install playwright pypdf && playwright install chromium`, plus `qpdf` and `poppler-utils` from your package manager.
