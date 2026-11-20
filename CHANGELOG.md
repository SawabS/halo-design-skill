# Changelog

## 1.1.0 · 2026-11-21
- Creative direction: docs/00, templates/brief.md, signature-visual catalogue; rings are one option, not the default
- New template: dashboard.html (status grid, sparklines, meters with targets, live data, still motion)
- Runtime: Halo.spark(); meter colour variants and .target marker; .chip.amber; .bars fixed (flex column)
- All colour literals moved into tokens.css (11 new utility tokens); DTCG export includes single-value colours
- Reproducibility: requirements.txt (pinned), Makefile, scripts/check_skill.py, build_tokens --check, GitHub Actions QA
- SKILL.md: task router (read only what the task needs), per-product workflow, no-logo rule

## 1.0.0 · 2026-11-20
First public release.
- Tokens (CSS `light-dark()` + DTCG 2025.10 JSON)
- Component CSS, runtime JS (no dependencies), calm sound engine
- Starter and print templates; icon grammar with 20 pictograms and glyphs, 12 UI icons
- Docs 01–17, including the production-library map
- Layout and touch QA suites; vector-PDF scripts
- Reference product: workout plan site + 4 vector PDFs
- README visuals (no logo, real screenshots, IBM Plex Sans): dark/light banners, social preview, 8 feature tiles, device, bilingual, phone, print, palette, Kurdish type and pictogram showcases, rendered reproducibly by scripts/render_assets.py
- Solid moon icon; scale glyph redrawn as a bathroom scale (site, skill and all four PDFs)
- No logo anywhere: brand slot is the product name in text
