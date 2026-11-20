#!/usr/bin/env bash
# Verify a Halo PDF is fully vector: 0 raster images, all fonts embedded, link count.
# Usage: scripts/verify_pdf.sh file.pdf [more.pdf ...]
# Needs poppler-utils (pdfimages, pdffonts, pdfinfo) and python3 + pypdf for the link count.
set -euo pipefail
status=0
for f in "$@"; do
  pages=$(pdfinfo "$f" | awk '/^Pages:/{print $2}')
  imgs=$(pdfimages -list "$f" 2>/dev/null | tail -n +3 | wc -l | tr -d ' ')
  notemb=$(pdffonts "$f" 2>/dev/null | tail -n +3 | awk '$(NF-4)=="no"' | wc -l | tr -d ' ')
  links=$(python3 -c "import sys,pypdf;r=pypdf.PdfReader(sys.argv[1]);print(sum(1 for p in r.pages for a in (p.get('/Annots') or []) if a.get_object().get('/Subtype')=='/Link'))" "$f" 2>/dev/null || echo "?")
  echo "$f: pages=$pages images=$imgs fonts_not_embedded=$notemb links=$links"
  if [ "$imgs" != "0" ] || [ "$notemb" != "0" ]; then status=1; echo "  ✗ not fully vector"; else echo "  ✓ vector"; fi
done
exit $status
