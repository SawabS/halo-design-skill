#!/usr/bin/env python3
"""
Render every README / repo image from live Halo pages, reproducibly.

  python3 -m http.server 8766          # from the repo root, in another terminal
  python3 scripts/render_assets.py     # writes docs/assets/*.png

Step 1 captures raw screenshots of the starter, the reference example and the PDFs
(docs/assets/src/raw/, git-ignored). Step 2 renders docs/assets/src/studio.html,
where each [data-asset] element is one finished image, at 2x.
Fonts: IBM Plex Sans Arabic is served from fonts/ (Latin falls through to Plex too). Add --google-fonts to load Google Sans from the web instead.
Requires: playwright (chromium) and poppler-utils (pdftoppm).
"""
import asyncio, pathlib, subprocess, sys
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
RAW = ROOT / "docs/assets/src/raw"; RAW.mkdir(parents=True, exist_ok=True)
OUT = ROOT / "docs/assets"
B = "http://localhost:8766"
PLEX = "".join(f"@font-face{{font-family:'IBM Plex Sans Arabic';font-weight:{w};src:url({B}/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-{n}.ttf)}}"
               for n, w in [("Regular", "400"), ("Medium", "500"), ("SemiBold", "600"), ("Bold", "700 900")])
SEED = "localStorage.setItem('halo:day',JSON.stringify({focus:50,tasks:[[true,true],[true,false,false],[false]],breaks:2}))"

async def shot(b, url, name, w, h, th, lang, ns="halo:", touch=False, dpr=2, prep=None, scroll=None, full=False):
    ctx = await b.new_context(viewport={"width": w, "height": h}, color_scheme=th, has_touch=touch, is_mobile=touch,
                              device_scale_factor=dpr, reduced_motion="reduce")
    p = await ctx.new_page()
    if "--google-fonts" not in sys.argv:
        # Offline-safe: answer Google Fonts with the bundled IBM Plex Sans Arabic, so Kurdish (and the Latin
        # fallback) render in Plex exactly as on a real device. Pass --google-fonts to load Google's CSS instead.
        await p.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=PLEX))
    await p.add_init_script(f"try{{localStorage.setItem('{ns}lang',JSON.stringify('{lang}'));{SEED}}}catch(e){{}}")
    await p.goto(B + url); await p.wait_for_timeout(1200)
    if scroll: await p.evaluate(f"document.querySelector('{scroll}').scrollIntoView({{behavior:'instant'}})"); await p.wait_for_timeout(500)
    if prep: await p.evaluate(prep); await p.wait_for_timeout(700)
    await p.screenshot(path=str(RAW / f"{name}.png"), full_page=full); await ctx.close()

async def capture(b):
    S, E = "/templates/starter.html", "/examples/workout-plan/index.html"
    pill = "document.getElementById('startFocus').click();scrollTo(0,0)"
    await shot(b, S, "starter_dark_en", 1440, 900, "dark", "en", prep=pill)
    await shot(b, S, "starter_light_en", 1440, 900, "light", "en", prep=pill)
    await shot(b, S, "starter_light_ckb", 1440, 900, "light", "ckb", prep=pill)
    await shot(b, S, "starter_dark_ckb", 1440, 900, "dark", "ckb", prep=pill)
    for lang, th in [("en", "dark"), ("ckb", "light"), ("en", "light"), ("ckb", "dark")]:
        await shot(b, S, f"phone_{lang}_{th}", 390, 844, th, lang, touch=True, dpr=3, prep=pill)
    await shot(b, E, "example_dark_en", 1440, 900, "dark", "en", ns="swp:")
    await shot(b, E, "example_light_ckb", 1440, 900, "light", "ckb", ns="swp:")
    await shot(b, E, "example_workout_dark", 1440, 900, "dark", "en", ns="swp:", scroll="#workout")
    await shot(b, E, "example_phone_dark", 390, 844, "dark", "en", ns="swp:", touch=True, dpr=3)
    await shot(b, E, "example_phone_light_ckb", 390, 844, "light", "ckb", ns="swp:", touch=True, dpr=3, scroll="#workout")
    pdf = ROOT / "examples/workout-plan/pdf"
    for src, tag in [("Sawab Workout Plan (Dark).pdf", "pdf_dark"), ("Sawab Workout Plan (Kurdish Light).pdf", "pdf_ckb_light"),
                     ("Sawab Workout Plan (Light).pdf", "pdf_light"), ("Sawab Workout Plan (Kurdish Dark).pdf", "pdf_ckb_dark")]:
        subprocess.run(["pdftoppm", "-r", "110", "-png", "-f", "1", "-l", "6", str(pdf / src), str(RAW / tag)], check=True, stderr=subprocess.DEVNULL)

async def render(b):
    ctx = await b.new_context(viewport={"width": 1700, "height": 1200}, device_scale_factor=2)
    p = await ctx.new_page()
    await p.goto(B + "/docs/assets/src/studio.html"); await p.wait_for_timeout(1500)
    names = await p.eval_on_selector_all("[data-asset]", "els=>els.map(e=>e.dataset.asset)")
    for n in names:
        el = p.locator(f'[data-asset="{n}"]')
        dpr1 = n == "social-preview"
        if dpr1:
            c2 = await b.new_context(viewport={"width": 1700, "height": 1200}, device_scale_factor=1); p2 = await c2.new_page()
            await p2.goto(B + "/docs/assets/src/studio.html"); await p2.wait_for_timeout(1500)
            await p2.locator(f'[data-asset="{n}"]').screenshot(path=str(OUT / f"{n}.png")); await c2.close()
        else:
            await el.screenshot(path=str(OUT / f"{n}.png"), omit_background=True)
        print("rendered", n)
    await ctx.close()

async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        if "--skip-capture" not in sys.argv: await capture(b)
        if "--capture-only" not in sys.argv: await render(b)
        await b.close()

asyncio.run(main())
