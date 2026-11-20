#!/usr/bin/env python3
"""
Print HTML pages to true vector PDFs with headless Chromium (Playwright).

  python3 scripts/print_pdf.py page.html out.pdf [--wait-title FIT:]

- Uses the page's own @page size (preferCSSPageSize) with zero margins.
- Waits for every font face to load, then (optionally) for a document.title
  prefix your page sets when its auto-fit pass has finished.
- Emulates print media first, so fit passes measure the print layout.
Requires:  pip install playwright && playwright install chromium
"""
import argparse, asyncio, pathlib, sys
from playwright.async_api import async_playwright

async def main(a):
    src = pathlib.Path(a.html).resolve()
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        p = await b.new_page()
        await p.emulate_media(media="print")
        await p.goto(src.as_uri() if not a.html.startswith("http") else a.html)
        await p.evaluate("document.fonts.ready")
        if a.wait_title:
            await p.wait_for_function(f"document.title.startsWith({a.wait_title!r})", timeout=60000)
            print("fit report:", (await p.title())[len(a.wait_title):][:400])
        await p.pdf(path=a.out, prefer_css_page_size=True, print_background=True,
                    margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
        await b.close()
    print("wrote", a.out)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("html"); ap.add_argument("out")
    ap.add_argument("--wait-title", default=None, help="wait until document.title starts with this")
    asyncio.run(main(ap.parse_args()))
