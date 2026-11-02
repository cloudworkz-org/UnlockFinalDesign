#!/usr/bin/env bash
# Make the downloadable PDF for one investor page.
#
#   scripts/make-investor-pdf.sh founding-round            # serves public-site/public locally, then prints the page
#   scripts/make-investor-pdf.sh founding-round https://unlockdd.com/founding-round/   # from a deployed URL
#
# The PDF is the page's own print layout (always white), saved next to the page under the name in
# the page's data-pdf-name, e.g. public-site/public/founding-round/Unlock-Founding-Round-Summary.pdf.
# The page's Download PDF button links to that file, so run this again whenever the content or the
# data-status (draft / approved) changes, and commit the new PDF with the page.
#
# Needs: Google Chrome (or set CHROME=/path/to/chrome) and python3. No Node needed.
# Pages link their styles with root paths (/_assets/...), so a file:// address cannot load them.
# Without a URL this script starts a short-lived local server on public-site/public for the print.
set -euo pipefail

PAGE="${1:?usage: make-investor-pdf.sh <page-folder> [url]}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC="$ROOT/public-site/public"
HTML="$PUBLIC/$PAGE/index.html"
[ -f "$HTML" ] || { echo "No such page: $HTML" >&2; exit 1; }

NAME="$(grep -o 'data-pdf-name="[^"]*"' "$HTML" | head -1 | sed 's/data-pdf-name="//;s/"$//')"
[ -n "$NAME" ] || { echo "Page has no data-pdf-name" >&2; exit 1; }

OUT="$PUBLIC/$PAGE/$NAME.pdf"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || { echo "Chrome not found. Set CHROME=/path/to/chrome" >&2; exit 1; }

SERVER_PID=""
cleanup() { [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

if [ -n "${2:-}" ]; then
  URL="$2"
else
  PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1])')"
  python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$PUBLIC" >/dev/null 2>&1 &
  SERVER_PID=$!
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    curl -s -o /dev/null "http://127.0.0.1:$PORT/$PAGE/" && break
    sleep 0.3
  done
  URL="http://127.0.0.1:$PORT/$PAGE/"
fi

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
  --print-to-pdf="$OUT" "$URL" >/dev/null 2>&1
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
