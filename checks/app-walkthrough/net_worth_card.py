#!/usr/bin/env python3
"""Pass/fail checks for the net worth card on the app walkthrough Home page.

For each page and each theme the script serves public-site/public from a local
static server (no Basic-auth function runs locally), loads the page in headless
Chromium with that theme stored, reads computed colours, and asserts:

  (a) the card background differs between day and night;
  (b) every piece of text inside the card is at least 4.5:1 against the
      surface it sits on (the card's own text colour is checked too);
  (c) every "How it is held" bar segment, and its legend dot, is at least
      3:1 against the card, in both the "By type" and "Liquid or not" views;
  (d) the card background is the theme's own card surface, var(--card).

Day, classic and night are the themes the brief names; "dark" (shown as
"Classic dark") is checked too because it is what a first-time visitor sees.

Run from the repo root:

    uv run --with playwright python checks/app-walkthrough/net_worth_card.py
    uv run --with playwright python checks/app-walkthrough/net_worth_card.py --shots

It exits 0 when every check passes and 1 otherwise. --shots also saves a
screenshot of Home in each theme next to this file.
"""
import argparse
import functools
import http.server
import re
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
SITE = HERE.parents[1] / "public-site" / "public"
# Pages that draw the net worth card. A search of the repo for the card's fill
# (#7ab59a) and for markup using .ul-hero-card found it on home.html only.
PAGES = ["home.html"]
THEMES = ["day", "classic", "night", "dark"]
CARD = 'section[aria-label="Net worth"]'
TEXT_MIN = 4.5
SEGMENT_MIN = 3.0

READ_CARD = """(sel) => {
  const card = document.querySelector(sel);
  const root = document.querySelector('#dc-root .ul');
  const cs = (el) => getComputedStyle(el);
  const probe = document.createElement('div');
  probe.style.background = 'var(--card)';
  root.appendChild(probe);
  const themeCard = cs(probe).backgroundColor;
  probe.remove();

  const texts = [];
  const seen = new Set();
  const walk = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const el = n.parentElement;
    if (!n.data.trim() || seen.has(el)) continue;
    seen.add(el);
    if (!el.getClientRects().length || cs(el).visibility !== 'visible') continue;
    const layers = [];
    let opacity = 1;
    for (let a = el; a && a !== card; a = a.parentElement) {
      layers.push(cs(a).backgroundColor);
      opacity *= parseFloat(cs(a).opacity);
    }
    texts.push({ text: n.data.trim().slice(0, 40), color: cs(el).color, layers, opacity });
  }
  const meter = card.querySelector('[role="img"][aria-label^="What is counted"]');
  const segments = [...meter.children].map((s) => ({ fill: cs(s).backgroundColor, opacity: cs(s).opacity }));
  const dots = [...card.querySelectorAll('button > span[aria-hidden="true"]')]
    .map((s) => ({ fill: cs(s).backgroundColor, opacity: cs(s).opacity }));
  return {
    theme: root.className,
    cardBg: cs(card).backgroundColor,
    cardColor: cs(card).color,
    pageBg: cs(root).backgroundColor,
    themeCard, texts, segments, dots,
  };
}"""

SETTLE = """async () => {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await Promise.all(document.getAnimations()
    .filter((a) => a instanceof CSSTransition)
    .map((a) => a.finished.catch(() => {})));
}"""


# ---------- colour maths (WCAG 2.x relative luminance and contrast) ----------

def parse(css):
    m = re.fullmatch(r"rgba?\(([^)]*)\)", css.strip())
    if not m:
        raise ValueError(f"cannot read colour {css!r}")
    parts = [float(p) for p in re.split(r"[\s,/]+", m.group(1).strip()) if p]
    return (parts[0], parts[1], parts[2], parts[3] if len(parts) > 3 else 1.0)


def over(top, below):
    """Composite colour `top` (r, g, b, a) over opaque `below` (r, g, b)."""
    r, g, b, a = top
    return tuple(c * a + d * (1 - a) for c, d in zip((r, g, b), below))


def luminance(rgb):
    def ch(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(x, y):
    hi, lo = sorted((luminance(x), luminance(y)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def hexed(rgb):
    return "#" + "".join(f"{round(c):02x}" for c in rgb)


# ---------------------------------- checks ----------------------------------

def surface(data):
    """The card's background as an opaque colour (composited over the page)."""
    page = parse(data["pageBg"])[:3]
    return over(parse(data["cardBg"]), page)


def check_theme(data, problems):
    card = surface(data)
    themed = over(parse(data["themeCard"]), parse(data["pageBg"])[:3])
    if hexed(card) != hexed(themed):
        problems.append(f"(d) card is {hexed(card)}, theme card surface is {hexed(themed)}")

    worst_text = None
    for t in [{"text": "(card text colour)", "color": data["cardColor"], "layers": [], "opacity": 1}] + data["texts"]:
        behind = card
        for layer in reversed(t["layers"]):
            behind = over(parse(layer), behind)
        r, g, b, a = parse(t["color"])
        fg = over((r, g, b, a * t["opacity"]), behind)
        ratio = contrast(fg, behind)
        if worst_text is None or ratio < worst_text[0]:
            worst_text = (ratio, t["text"])
        if ratio < TEXT_MIN:
            problems.append(f"(b) text {t['text']!r} {hexed(fg)} on {hexed(behind)} is {ratio:.2f}:1")

    worst_seg = None
    for kind, items in (("segment", data["segments"]), ("dot", data["dots"])):
        for i, s in enumerate(items):
            fill = over(parse(s["fill"]), card)
            ratio = contrast(fill, card)
            if worst_seg is None or ratio < worst_seg[0]:
                worst_seg = (ratio, f"{kind} {i + 1} {hexed(fill)}")
            if ratio < SEGMENT_MIN:
                problems.append(f"(c) {data['view']} {kind} {i + 1} {hexed(fill)} on {hexed(card)} is {ratio:.2f}:1")
    return worst_text, worst_seg


def serve(root):
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(root)))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def load(browser, base, page_name, theme):
    ctx = browser.new_context(viewport={"width": 1440, "height": 1000})
    ctx.add_init_script(f"try {{ localStorage.setItem('unlock.theme', '{theme}'); }} catch (e) {{}}")
    page = ctx.new_page()
    page.goto(f"{base}/app-walkthrough/{page_name}")
    page.wait_for_load_state("networkidle")
    page.wait_for_function(f"document.querySelector('#dc-root .ul')?.classList.contains('ul-{theme}')")
    page.evaluate(SETTLE)
    return ctx, page


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--shots", action="store_true", help="save a Home screenshot per theme next to this file")
    args = ap.parse_args()

    httpd = serve(SITE)
    base = f"http://127.0.0.1:{httpd.server_address[1]}"
    failed = 0
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for page_name in PAGES:
            backgrounds = {}
            for theme in THEMES:
                ctx, page = load(browser, base, page_name, theme)
                problems, worst_text, worst_seg = [], None, None
                for view in ("By type", "Liquid or not"):
                    if view == "Liquid or not":
                        page.get_by_role("button", name="Liquid or not").click()
                        page.wait_for_function(
                            "document.querySelector('[aria-label=\"View\"] button:last-child')"
                            ".getAttribute('aria-pressed') === 'true'")
                        page.mouse.move(0, 0)
                        page.evaluate(SETTLE)
                    data = page.evaluate(READ_CARD, CARD)
                    data["view"] = view
                    wt, ws = check_theme(data, problems)
                    worst_text = min(filter(None, [worst_text, wt]))
                    worst_seg = min(filter(None, [worst_seg, ws]))
                    if view == "By type":
                        backgrounds[theme] = hexed(surface(data))
                if args.shots and page_name == "home.html":
                    page.get_by_role("button", name="By type").click()
                    page.mouse.move(0, 0)
                    page.evaluate(SETTLE)
                    page.screenshot(path=str(HERE / f"home-{theme}.png"))
                ctx.close()
                verdict = "PASS" if not problems else "FAIL"
                failed += bool(problems)
                print(f"{verdict}  {page_name:<10} {theme:<8} card {backgrounds[theme]}  "
                      f"lowest text {worst_text[0]:.2f}:1 ({worst_text[1]!r})  "
                      f"lowest segment {worst_seg[0]:.2f}:1 ({worst_seg[1]})")
                for line in problems:
                    print(f"        {line}")
            same = backgrounds["day"] == backgrounds["night"]
            failed += same
            print(f"{'FAIL' if same else 'PASS'}  {page_name:<10} (a) day card {backgrounds['day']} "
                  f"{'equals' if same else 'differs from'} night card {backgrounds['night']}")
        browser.close()
    httpd.shutdown()
    print(f"\n{'All checks pass.' if not failed else f'{failed} check group(s) fail.'}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
