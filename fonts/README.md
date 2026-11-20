# Fonts

| Folder | Family | Use | Format |
|---|---|---|---|
| `ibm-plex-sans-arabic/` | IBM Plex Sans Arabic 400/500/600/700 | Kurdish, Arabic and Persian text on screen (offline) and in print | TTF |
| `inter/` | Inter 400/500/600/700 | Latin text in vector PDFs | TTF (TrueType outlines) |

On the web, prefer Google Fonts or Fontsource for both Google Sans and IBM Plex Sans Arabic. The files here are for offline apps, CI tests and the PDF pipeline.

**Why TrueType for print:** Chromium embeds CFF-flavoured `.otf` fonts as Type 3 fonts in PDFs. Type 3 glyphs can't reliably be used as a clipping path, so gradient-filled text turns into a solid gradient block in many viewers. TrueType-outline `.ttf` files embed as CID TrueType and work everywhere.

Map weights 800/900 to 700 when declaring Plex: `font-weight: 700 900`.
