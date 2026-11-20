# QA

Serve the repo over http first (`python3 -m http.server 8000`); `file://` URLs give false failures.

```bash
python3 qa/qa_layout.py http://localhost:8000/templates/starter.html --shots out/   # overflow, clipping, errors · 9 widths × 2 themes × 2 languages
python3 qa/qa_touch.py  http://localhost:8000/templates/starter.html               # phone: nav fit, tap glint, menu, reveals, errors
```
Use `--ns yourprefix:` if your app stores the language under a different localStorage namespace.

Both scripts answer Google Fonts requests with the bundled Plex files, so Kurdish metrics match production even when CI is offline.

Add product-specific interaction checks (the reference list is in `docs/13-qa.md`) and an axe-core scan (`docs/12-accessibility.md`).
