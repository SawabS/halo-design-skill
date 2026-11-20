#!/usr/bin/env python3
"""
Halo layout QA: overflow, clipped text and JS errors across the full matrix.

  python3 qa/qa_layout.py http://localhost:8000/templates/starter.html [--shots out/]

Matrix: widths 320..1440 × dark/light × en/ckb (store key 'halo:lang').
Fails (exit 1) on:
  - horizontal overflow (document wider than the viewport)
  - clipped text: headings, chips, buttons, labels, stat values whose content is wider than their box
  - any page error or console error
Google Fonts requests are answered from ../fonts so metrics match production even offline.
Requires: pip install playwright && playwright install chromium
"""
import asyncio, sys, json, pathlib, argparse
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
WIDTHS = [320, 360, 390, 430, 720, 800, 1024, 1280, 1440]
SEL = "h1,h2,h3,.chip,.btn,.label,.stat .v,.kpis b,.days b,.links a,.brand,.pill output"
CHECK = """(sel)=>{const out=[];for(const e of document.querySelectorAll(sel)){if(!e.offsetParent||e.closest('dialog:not([open])'))continue;
  const cs=getComputedStyle(e);const r=e.getBoundingClientRect();
  if(cs.whiteSpace==='nowrap'&&e.scrollWidth>r.width+2)out.push('nowrap-overflow: '+e.textContent.trim().slice(0,40));
  else if(cs.overflow!=='visible'&&e.scrollWidth>e.clientWidth+1)out.push('clipped: '+e.textContent.trim().slice(0,40));
  if(r.right>innerWidth+1||r.left<-1)out.push('off-screen: '+e.textContent.trim().slice(0,40))}return out.slice(0,12)}"""

def font_css(base):
    faces = [("Regular", 400), ("Medium", 500), ("SemiBold", 600), ("Bold", 700)]
    return "".join(f"@font-face{{font-family:'IBM Plex Sans Arabic';font-weight:{w};src:url({base}/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-{n}.ttf)}}" for n, w in faces)

async def main(a):
    base = a.url.split("/templates/")[0].split("/examples/")[0]
    css = font_css(base)
    fails = 0
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for w in WIDTHS:
            for th in ("dark", "light"):
                for lang in ("en", "ckb"):
                    ctx = await b.new_context(viewport={"width": w, "height": 900}, color_scheme=th, has_touch=w < 700, reduced_motion="reduce")
                    p = await ctx.new_page(); errs = []
                    p.on("pageerror", lambda e: errs.append(str(e)))
                    p.on("console", lambda m: m.type == "error" and errs.append(m.text))
                    await p.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
                    await p.add_init_script(f"try{{localStorage.setItem('{a.ns}lang',JSON.stringify('{lang}'))}}catch(e){{}}")
                    await p.goto(a.url); await p.wait_for_timeout(700)
                    ov = await p.evaluate("[document.documentElement.scrollWidth, innerWidth]")
                    clip = await p.evaluate(CHECK, SEL)
                    bad = (ov[0] > ov[1]) or clip or errs
                    fails += bool(bad)
                    print(("FAIL" if bad else "ok  "), f"{w:>4} {th:5} {lang:3}", "overflow" if ov[0] > ov[1] else "", clip, errs[:2])
                    if a.shots:
                        pathlib.Path(a.shots).mkdir(parents=True, exist_ok=True)
                        await p.screenshot(path=f"{a.shots}/{w}_{th}_{lang}.png", full_page=True)
                    await ctx.close()
        await b.close()
    print(f"\n{fails} failing cells")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("url"); ap.add_argument("--shots", default=None); ap.add_argument("--ns", default="halo:", help="localStorage namespace")
    asyncio.run(main(ap.parse_args()))
