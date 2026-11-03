#!/usr/bin/env bash
# Make the Founding Investors PDF with Typst.
# The PDF is typeset from founding-investors.typ, not printed from the page, so keep its wording in step with
# public-site/public/founding-investors/index.html. Do not run scripts/make-investor-pdf.sh on this page:
# it would overwrite this PDF with a browser print.
#
#   pdf/founding-investors/make.sh                  # status follows the page's data-status (draft adds the draft line and header)
#   STATUS=draft pdf/founding-investors/make.sh     # force a status
#   LAYOUT=continuous OUT=/tmp/one-page.pdf pdf/founding-investors/make.sh   # one long page instead of A4 pages
#
# Needs Typst 0.15 or later (set TYPST=/path/to/typst if it is not on PATH).
# Fonts come only from public-site/public/fonts (Aeonik), so the PDF looks the same on every machine.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
TYPST="${TYPST:-typst}"
OUT="${OUT:-$ROOT/public-site/public/founding-investors/Unlock-Founding-Investors.pdf}"
PAGE="$ROOT/public-site/public/founding-investors/index.html"
STATUS="${STATUS:-$(grep -o '<body[^>]*' "$PAGE" | grep -o 'data-status="[^"]*"' | head -1 | cut -d'"' -f2)}"   # the <body> tag only
[ "$STATUS" = approved ] || [ "$STATUS" = draft ] || { echo "Unknown status: '$STATUS'" >&2; exit 1; }
"$TYPST" compile --ignore-system-fonts --font-path "$ROOT/public-site/public/fonts" \
  --input status="$STATUS" --input layout="${LAYOUT:-a4}" \
  "$HERE/founding-investors.typ" "$OUT"
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1), status $STATUS)"
