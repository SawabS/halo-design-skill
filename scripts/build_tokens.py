#!/usr/bin/env python3
"""Regenerate DTCG 2025.10 colour token files from tokens/tokens.css (the source of truth).
   python3 scripts/build_tokens.py        → tokens/halo.light.tokens.json, tokens/halo.dark.tokens.json"""
import re, json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
css = (ROOT / "tokens/tokens.css").read_text()
SCHEMA = "https://www.designtokens.org/schemas/2025.10/format.json"

def pairs():
    for m in re.finditer(r"--([\w-]+):\s*light-dark\(", css):
        i = m.end(); depth = 1; j = i
        while depth:
            depth += (css[j] == "(") - (css[j] == ")"); j += 1
        inner = css[i:j - 1]; d = 0
        for k, c in enumerate(inner):
            d += (c == "(") - (c == ")")
            if c == "," and d == 0: break
        yield m.group(1), inner[:k], inner[k + 1:]

def colour(v):
    v = v.strip().replace(" ", "")
    if v.startswith("#"):
        r, g, b = (int(v[i:i + 2], 16) for i in (1, 3, 5))
        return {"colorSpace": "srgb", "components": [round(r / 255, 4), round(g / 255, 4), round(b / 255, 4)], "alpha": 1, "hex": v.upper()}
    m = re.match(r"rgba\(([\d.]+),([\d.]+),([\d.]+),([\d.]+)\)", v)
    if m:
        r, g, b, a = map(float, m.groups())
        return {"colorSpace": "srgb", "components": [round(r / 255, 4), round(g / 255, 4), round(b / 255, 4)], "alpha": a, "hex": "#%02X%02X%02X" % (int(r), int(g), int(b))}
    if v == "transparent":
        return {"colorSpace": "srgb", "components": [0, 0, 0], "alpha": 0, "hex": "#000000"}
    raise ValueError(v)

DESC = {"bg": "Page background", "bg2": "Inputs and wells", "card": "Flat card", "card2": "Sheets and dialogs", "cA": "Card gradient top",
        "cB": "Card gradient bottom", "well": "Tile nested inside a card", "ink": "Titles and numbers", "ink2": "Body text", "ink3": "Labels and meta",
        "rim": "1px card edge", "sep": "Dividers", "shine": "Rim light core", "shineT": "Rim light tint", "glow": "Card surface glow",
        "focus": "Focus ring", "heroA": "Hero gradient start", "heroB": "Hero gradient end",
        "green": "Accent fill: strength, done", "greenT": "Text-safe green", "cyan": "Accent fill: steps, info", "cyanT": "Text-safe cyan",
        "red": "Accent fill: recovery, attention", "redT": "Text-safe red", "amber": "Accent fill: caution", "amberT": "Text-safe amber"}
P = list(pairs())
for idx, name in ((1, "light"), (2, "dark")):
    out = {"$schema": SCHEMA, "$description": f"Halo colour tokens, {name} theme. Generated from tokens/tokens.css.", "color": {}}
    for p in P:
        out["color"][p[0]] = {"$type": "color", "$value": colour(p[idx])}
        if p[0] in DESC: out["color"][p[0]]["$description"] = DESC[p[0]]
    (ROOT / f"tokens/halo.{name}.tokens.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
print(f"{len(P)} colour tokens written")
