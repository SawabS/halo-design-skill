#!/usr/bin/env python3
"""
Self-check for the Halo skill. Fast (no browser), run before every commit and in CI.

  python3 scripts/check_skill.py

Checks:
  1. SKILL.md frontmatter: name format, description length (≤ 1024)
  2. every relative link / image / src in *.md and templates resolves
  3. DTCG token JSON is in sync with tokens/tokens.css
  4. no colour literals in css/halo.css (all colour comes from tokens.css)
  5. no logo files or logo markup anywhere in the skill
  6. JavaScript parses (node --check), when node is available
  7. every docs/NN-*.md is routed from SKILL.md
  8. each template's EN and CKB dictionaries have identical keys (needs node)
Exit code 1 if anything fails.
"""
import json, pathlib, re, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
fails = []
def check(ok, msg):
    print(("ok   " if ok else "FAIL ") + msg)
    if not ok: fails.append(msg)

# 1 frontmatter
skill = (ROOT / "SKILL.md").read_text()
fm = re.match(r"---\n(.*?)\n---", skill, re.S)
check(bool(fm), "SKILL.md has frontmatter")
if fm:
    name = re.search(r"^name:\s*(.+)$", fm.group(1), re.M)
    desc = re.search(r"^description:\s*(.+)$", fm.group(1), re.M)
    check(bool(name and re.fullmatch(r"[a-z0-9-]{1,64}", name.group(1).strip())), "frontmatter name is kebab-case")
    check(bool(desc and 0 < len(desc.group(1)) <= 1024), f"description length {len(desc.group(1)) if desc else 0} ≤ 1024")

# 2 links
bad = []
files = list(ROOT.glob("*.md")) + list(ROOT.glob("docs/*.md")) + list(ROOT.glob("*/README.md")) + list(ROOT.glob("templates/*.html")) + list(ROOT.glob("icons/*.md"))
for f in files:
    text = f.read_text(encoding="utf8")
    refs = re.findall(r"\]\(([^)\s#]+)", text) + re.findall(r'(?:src|srcset|href)="([^"#]+)"', text)
    for r in refs:
        if r.startswith(("http", "mailto:", "data:", "javascript:")) or "${" in r: continue
        if not (f.parent / r).resolve().exists(): bad.append(f"{f.relative_to(ROOT)} → {r}")
check(not bad, f"all relative links resolve {bad[:5]}")

# 3 tokens in sync
r = subprocess.run([sys.executable, str(ROOT / "scripts/build_tokens.py"), "--check"], capture_output=True, text=True)
check(r.returncode == 0, "token JSON in sync with tokens.css " + r.stdout.strip().splitlines()[-1] if r.stdout else "")

# 4 colour literals
css = (ROOT / "css/halo.css").read_text().replace("#000 0 0", "")
lits = re.findall(r"#[0-9A-Fa-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)", css)
check(not lits, f"no colour literals in halo.css {lits[:5]}")

# 5 no logos
logo_files = [p for p in ROOT.rglob("*") if p.is_file() and re.search(r"(^|[-_.])logo", p.name, re.I) and "raw" not in p.parts]
logo_markup = [str(p.relative_to(ROOT)) for p in list(ROOT.glob("templates/*.html")) + [ROOT / "docs/assets/src/studio.html"]
               if re.search(r'class="[^"]*\blogo\b', p.read_text())]
check(not logo_files and not logo_markup, f"no logo files or markup {logo_files[:3]} {logo_markup[:3]}")

# 6 JS syntax
node = shutil.which("node")
if node:
    for js in ROOT.glob("js/*.js"):
        r = subprocess.run([node, "--check", str(js)], capture_output=True, text=True)
        check(r.returncode == 0, f"{js.name} parses {r.stderr.strip()[:120]}")
else:
    print("skip node not found: JS syntax and dictionary checks")

# 7 docs routed
docs = sorted(p.name for p in ROOT.glob("docs/[0-9][0-9]-*.md"))
missing = [d for d in docs if f"docs/{d[:2]}" not in skill and d not in skill]
check(not missing, f"every doc is routed from SKILL.md {missing}")

# 8 dictionary parity
if node:
    for t in ROOT.glob("templates/*.html"):
        src = t.read_text()
        if "const DICT=" not in src: continue
        js = ("const s=require('fs').readFileSync(process.argv[1],'utf8');const i=s.indexOf('const DICT=')+11;let d=0,j=i;"
              "for(;j<s.length;j++){if(s[j]=='{')d++;if(s[j]=='}'){d--;if(!d)break}}const D=eval('('+s.slice(i,j+1)+')');"
              "const a=Object.keys(D.en).sort(),b=Object.keys(D.ckb).sort();"
              "console.log(JSON.stringify({onlyEn:a.filter(k=>!b.includes(k)),onlyCkb:b.filter(k=>!a.includes(k)),empty:b.filter(k=>!String(D.ckb[k]).trim())}))")
        r = subprocess.run([node, "-e", js, str(t)], capture_output=True, text=True)
        res = json.loads(r.stdout or '{"onlyEn":["parse error"],"onlyCkb":[],"empty":[]}')
        check(not any(res.values()), f"{t.name}: en/ckb dictionaries match {res if any(res.values()) else ''}")

print(f"\n{len(fails)} failed")
sys.exit(1 if fails else 0)
