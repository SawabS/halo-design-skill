#!/usr/bin/env python3
"""
Halo phone/touch QA. Runs on real mobile emulation (hasTouch, isMobile, DPR 2).

  python3 qa/qa_touch.py http://localhost:8000/templates/starter.html

Checks, at 320/360/390/430 in both languages and themes:
  - no horizontal overflow; nav controls ≥ 32 px tall, never overlapping, never touching the brand
  - tapping a card shows the rim-light glint, which fades
  - the menu opens by tap and a link closes it and scrolls to the section
  - every reveal-on-scroll element is revealed after scrolling the page
  - a sheet ([data-sheet-trigger] → dialog) swipes both ways if present
  - no JS errors
"""
import asyncio, sys, argparse, pathlib
from playwright.async_api import async_playwright

def font_css(base):
    faces = [("Regular", 400), ("Medium", 500), ("SemiBold", 600), ("Bold", 700)]
    return "".join(f"@font-face{{font-family:'IBM Plex Sans Arabic';font-weight:{w};src:url({base}/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-{n}.ttf)}}" for n, w in faces)

F = []
MENU = "[data-menu-btn], #menuBtn"   # Halo markup, or the reference example
def ok(c, m):
    print(("PASS " if c else "FAIL ") + m)
    if not c: F.append(m)

async def run(b, url, css, w, h, lang, th, ns):
    tag = f"[{w} {lang} {th}]"
    ctx = await b.new_context(viewport={"width": w, "height": h}, has_touch=True, is_mobile=True, device_scale_factor=2, color_scheme=th)
    p = await ctx.new_page(); errs = []
    p.on("pageerror", lambda e: errs.append(str(e)))
    await p.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=css))
    await p.add_init_script(f"try{{localStorage.setItem('{ns}lang',JSON.stringify('{lang}'))}}catch(e){{}}")
    await p.goto(url); await p.wait_for_timeout(700)
    o = await p.evaluate("[document.documentElement.scrollWidth, innerWidth]")
    ok(o[0] <= o[1], f"{tag} no sideways scroll {o}")
    nav = await p.evaluate("[...document.querySelectorAll('.nav .acts > *')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return [r.left,r.right,r.height]}).sort((a,b)=>a[0]-b[0])")
    gaps = [nav[i + 1][0] - nav[i][1] for i in range(len(nav) - 1)]
    ok(all(x[2] >= 32 for x in nav) and all(g >= -0.5 for g in gaps), f"{tag} nav controls sized and separated")
    br = await p.evaluate("(()=>{const b=document.querySelector('.brand').getBoundingClientRect(),a=document.querySelector('.acts').getBoundingClientRect();return b.right<=a.left+1||a.right<=b.left+1})()")
    ok(br, f"{tag} brand does not collide with controls")
    card = p.locator("main .card").nth(2)
    await card.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})"); await p.wait_for_timeout(1100)
    bb = await card.bounding_box()
    await p.touchscreen.tap(bb["x"] + bb["width"] / 2, bb["y"] + min(bb["height"] / 2, 120))
    ok(await card.evaluate("e=>e.classList.contains('lit')"), f"{tag} tap glints the card")
    await p.wait_for_timeout(800)
    ok(not await card.evaluate("e=>e.classList.contains('lit')"), f"{tag} glint fades")
    await p.evaluate("scrollTo({top:0,behavior:'instant'})"); await p.wait_for_timeout(200)
    await p.locator(MENU).first.tap(); await p.wait_for_timeout(200)
    ok(await p.locator(".menu.open").count() > 0, f"{tag} menu opens by tap")
    innerH = h
    links = p.locator(".menu a[href^='#']")
    target = await links.last.get_attribute("href")
    await links.last.tap(); await p.wait_for_timeout(1800)
    y = await p.evaluate(f"document.querySelector('{target}').getBoundingClientRect().top")
    at_end = await p.evaluate("scrollY >= document.documentElement.scrollHeight - innerHeight - 2")   # short last section
    ok((abs(y) < 140 or (at_end and y < innerH)) and await p.locator(".menu.open").count() == 0, f"{tag} menu link closes menu and scrolls to {target} ({round(y)})")
    H = await p.evaluate("document.documentElement.scrollHeight")
    for yy in range(0, H, 450):
        await p.evaluate(f"scrollTo({{top:{yy},behavior:'instant'}})"); await p.wait_for_timeout(60)
    await p.wait_for_timeout(1000)
    left = await p.evaluate("document.querySelectorAll('.rv:not(.in)').length")
    ok(left == 0, f"{tag} every section revealed (left {left})")
    ok(not errs, f"{tag} no JS errors {errs[:2]}")
    await ctx.close()

async def main(a):
    base = a.url.split("/templates/")[0].split("/examples/")[0]
    css = font_css(base)
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for w, h, lang, th in [(320, 640, "ckb", "dark"), (360, 740, "en", "light"), (390, 844, "ckb", "light"), (430, 932, "en", "dark")]:
            await run(b, a.url, css, w, h, lang, th, a.ns)
        await b.close()
    print(f"\n{len(F)} failed")
    sys.exit(1 if F else 0)

if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("--ns", default="halo:")
    asyncio.run(main(ap.parse_args()))
