# Investor pages: turn a document into a page

**The rule.** We no longer send prospects PDFs or slide decks. A finished document becomes a responsive page at its own address on unlockdd.com, with a **Download PDF** button. The PDF is always white. The page is dark on screen.

**Reference page:** `public-site/public/founding-round/index.html` (live at `unlockdd.com/founding-round`). Copy it, don't start from scratch.

## Where things live

```
public-site/public/
  _assets/unlock-page.css      shared styles, motion and print rules (design-system tokens)
  _assets/unlock-page.js       nav highlight, scroll motion
  <page-name>/index.html       one folder per page
  <page-name>/<Name>.pdf       its white PDF, made by the script below
scripts/make-investor-pdf.sh   makes the PDF for one page
```

Pages link the shared files with root paths (`/_assets/...`). A change to a shared file changes every page, so check the earlier pages after editing it.

## Who does what

| Step | Owner |
|---|---|
| Final wording, sources, what is still open | Will |
| Turn the slides into the page and check it against the design system | Roy (Claude does the first pass) |
| Check it looks right, reads right and is on brand | Will |
| Review as a financial promotion | The named reviewer (not yet named) |
| Change `draft` to `approved`, make the PDF, merge | Roy, when Will says |
| Send the link | Tom or Will |

## Steps

1. **Start from the approved source.** One slide becomes one section, in the same order, with the wording exactly as approved. If a sentence must change, change the source first.
2. **Branch.** `git checkout -b add-<page-name>-page` from `main`.
3. **Copy the reference page** to `public-site/public/<page-name>/index.html`. Change the content, `<title>`, `data-pdf-name` and the section nav, and the PDF link in the header button.
4. **Map slides to components** (table below). Use the design system's tokens only.
5. **Tag what is open.** Put `<span class="tbc">to confirm</span>` beside anything not signed off. Tags show in amber while `data-status="draft"`, and in the PDF.
6. **Make the PDF.** `scripts/make-investor-pdf.sh <page-name>`.
7. **Open a draft pull request.** Cloudflare builds a preview. Check the page, the PDF download, phone width, and that nothing links to it.
8. **Will reviews** the preview page and PDF and lists changes or says it is fine.
9. **Check the promotion wording** with the named reviewer.
10. **Approve.** Change `data-status="draft"` to `"approved"`, run the PDF script again (or the download still says Draft), commit both.
11. **Merge to `main`.** That deploys to unlockdd.com. Open the address and click Download PDF.
12. **Send the link** at the right stage. Do not add it to the menu, footer or sitemap.

To roll back, use Deployments in the Cloudflare dashboard for the Pages project `unlockdd-site`, or open a revert PR.

## Slide to component

| In the slide | On the page |
|---|---|
| Cover | `.hero`: eyebrow, H1 with green full stop, one-line dek |
| Row of big numbers | `.stats` (4-up, 2-up on phone) |
| Three or six short blocks | `.cards` |
| Table of status or key and value | `.rows` (stacks on a phone) |
| Percent split, use of funds | `.bars` (green to grey) |
| Staged plan | `ol.stages` |
| People | `.team` |
| Done, next, then | `ol.steps` |
| Risk warning, FCA wording | `section.info`, last, wording unchanged |
| Footnote on a figure | `.sources` or `.note` |
| Single call to action | `.cta` with one `.btn` |

## Always true

- **The PDF is white.** Made from the page's print stylesheet, which switches to the light theme and hides the nav and buttons. The button downloads that file directly.
- **Links go out, never in.** The logo and footer link to `https://unlockdd.com`. Nothing on the main site links to a page, and pages are not in the sitemap.
- **Motion is light and automatic** (slide-ups, counting numbers, bars drawing in, a scroll bar). It switches off for reduced-motion settings and never appears in print. No grain, spotlight or looping effects: these are read as financial documents.
- **Responsive first.** No fixed 16:9 slides. Nothing scrolls sideways at 375px.
- **Design-system tokens only.** Colours, type and spacing come from `unlock-design-system` (`--u-*`). No new hex values.
- **Compliance block stays.** A page that mentions returns, EIS or SEIS keeps the Important information section, once, at the end, wording unchanged.
- **Every feature is labelled "Founding investors only".**
- **No trackers or third-party scripts.** One H1, a meaningful `<title>`, and `noindex,nofollow`.

## Checks before Will signs off

- [ ] Reads top to bottom in the same order as the slides
- [ ] Every figure and source matches the approved deck
- [ ] No amber tag left, or each is a known open item
- [ ] Phone width: no sideways scroll, tables stack, nav scrolls
- [ ] Download PDF: one click saves it, it opens white, no nav or buttons, no card split across a page, "Draft" only while the page is a draft
- [ ] Important information block present and unchanged
- [ ] Email and booking links go to the right place

## Cautions

- **This repo is public.** A draft page and its PDF can be read on GitHub as soon as a branch is pushed, and a preview URL needs no sign-in. Until the site moves to a private repo, think before pushing wording that is not approved.
- **Investor pages sit outside `/investors/`.** The certification gate guards `/investors/*` only. These pages are protected by not being linked, not by a gate.
- **Fonts:** pages load Aeonik from `/fonts/` on the site. The PDF script uses a local server, so on a Mac the PDF may use a fallback font. For the final PDF, run the script against the deployed address.
