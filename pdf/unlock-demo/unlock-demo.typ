// Unlock Demo ("before your demo"): the downloadable PDF, typeset with Typst.
// Wording is identical to public-site/public/unlock-demo/index.html (source: the "Unlock Demo" artifact, Nov 2026).
// To change a sentence, change the source first, then the page and this file; the text check compares them.
// Build with make.sh in this folder: status follows the page's data-status. LAYOUT=continuous makes one long page.
// Self-contained on purpose. Once pdf/founding-investors/ is on main too, the shared helpers can move to one library file.

#let status = sys.inputs.at("status", default: "draft")
#let layout = sys.inputs.at("layout", default: "a4")
#let draft = status != "approved"
#let continuous = layout == "continuous"

// Design-system tokens, light theme: the values in the print block of public-site/public/_assets/unlock-page.css.
#let ink = rgb("#1a1a1a")           // --h: headings, figures
#let body-ink = rgb("#333333")      // --body: running text
#let muted = rgb("#4a525c")         // --muted: secondary text (7.9:1 on white)
#let rule = rgb("#e3e6ea")          // --line: hairlines
#let green = rgb("#00bb77")         // --u-green: full stops, squares, dashes (never text)
#let green-ink = rgb("#008655")     // --accent-ink / --u-green-deep: small green labels and links
#let warn = rgb("#b45309")          // --warn: draft markings
#let green-fill = rgb("#00bb7714")  // --u-green-fill (print)
#let green-line = rgb("#00865559")  // --u-green-line (print)

#let calendly = "https://calendly.com/tom-unlockdd/unlock-demo"
#let draft-line = "Draft · not yet approved for sending"
#let masthead = "Unlock Demo"

#set document(title: "Unlock Demo", author: "Unlock Services Limited")
#set text(font: "Aeonik", weight: 400, size: 9.5pt, fill: body-ink, lang: "en", region: "GB", hyphenate: false, ligatures: false)
#set par(justify: false, leading: 0.62em, spacing: 0.9em)
#set smartquote(enabled: false)
#set block(spacing: 0pt)

#let logo(height) = image("unlock-logo.svg", height: height, alt: "Unlock")
#let dot = text(fill: green)[.]
#let caps(size: 7.5pt, fill: green-ink, tracking: 0.18em, body) = text(size: size, weight: 500, fill: fill, tracking: tracking, upper(body))
#let eyebrow(fill: green-ink, body) = block(below: 9pt, sticky: true)[#box(width: 4.5pt, height: 4.5pt, fill: green, baseline: -0.3pt)#h(6pt)#caps(fill: fill, body)]
#let lead(body) = block(below: 8pt, text(size: 11pt, fill: body-ink, body))
#let section(body) = block(breakable: false, width: 100%, above: 20pt, body)

#show heading.where(level: 1): it => block(above: 2pt, below: 16pt, sticky: true, { set par(leading: 0.22em); text(size: 30pt, weight: 250, fill: ink, tracking: -0.02em, it.body) })
#show heading.where(level: 2): it => block(below: 12pt, sticky: true, { set par(leading: 0.3em); text(size: 18pt, weight: 250, fill: ink, tracking: -0.01em, it.body) })
#show link: set text(fill: green-ink)
#show link: underline.with(offset: 2pt, stroke: 0.4pt + green-ink)

#let questions(..items) = grid(columns: (1fr, 1fr), stroke: 0.5pt + rule, inset: (x: 12pt, top: 12pt, bottom: 13pt),
  ..items.pos().map(((index, title, body, shows)) => stack(dir: ttb, spacing: 7pt,
    text(size: 10pt, weight: 500, fill: green-ink, index),
    text(size: 10.5pt, weight: 500, fill: ink, title),
    text(size: 9pt, fill: muted, body),
    block(above: 3pt, stack(dir: ttb, spacing: 4pt,
      text(size: 9pt, weight: 500, fill: ink, "The demo shows"),
      text(size: 9pt, fill: muted, shows))))))

#let stage(number, title, body) = block(breakable: false, width: 100%, stroke: (bottom: 0.5pt + rule), inset: (y: 9pt),
  grid(columns: (34pt, 1fr), column-gutter: 10pt,
    text(size: 8pt, weight: 500, fill: green-ink, tracking: 0.15em, number),
    stack(dir: ttb, spacing: 6pt,
      text(size: 11pt, weight: 500, fill: ink, title),
      text(size: 9.5pt, fill: muted, body))))

#set page(
  paper: "a4",
  height: if continuous { auto } else { 297mm },
  margin: (x: 18mm, top: 18mm, bottom: 17mm),
  header: if continuous { none } else { context {
    if counter(page).get().first() > 1 {
      grid(columns: (1fr, auto), align: (left + horizon, right + horizon),
        logo(8.5pt),
        [#caps(size: 6.5pt, fill: muted, masthead)#if draft [#h(10pt)#caps(size: 6.5pt, fill: warn, "Draft")]])
      v(5pt)
      line(length: 100%, stroke: 0.5pt + rule)
    }
  } },
  footer: if continuous { none } else { context align(right, text(size: 7pt, fill: muted,
    [#counter(page).display() / #counter(page).final().first()])) },
)

// Masthead
#if draft {
  block(width: 100%, stroke: 0.7pt + warn, inset: (y: 6pt), below: 14pt, align(center, caps(size: 7pt, fill: warn, draft-line)))
}
#grid(columns: (1fr, auto), align: (left + horizon, right + horizon),
  logo(13pt),
  caps(size: 7pt, fill: muted, masthead))
#v(8pt)
#line(length: 100%, stroke: 0.5pt + rule)
#v(26pt)

// 01 Cover
#eyebrow[Before your demo]
= The questions Unlock \ helps you answer#dot  // line break as in the source (<br> after "Unlock")
#block(width: 86%, text(size: 12.5pt, fill: muted)[Thank you for booking a demo. This short page explains what Unlock does and what you will see.])

// 02 Why Unlock exists
#section[
  #eyebrow[Why Unlock exists]
  #lead[Managing your own investments has always meant making your own decisions. Over the past ten years those decisions have become harder: pension, tax and inheritance rules now affect each other, they keep changing, and joining them up is left to you.]
  #lead[Unlock provides structured decision support for High Net Worth and self-certified sophisticated investors who stay responsible for their own financial position. It gives you one view of all your assets: regulated investments such as stocks, pensions and bonds, as well as unregulated investments such as property, gold and crypto. That view helps you make more informed decisions and see their effect across areas such as tax and retirement, with the sources, assumptions, uncertainty and next step always in view.]
]

// 03 Questions
#section[
  #eyebrow[Structured decision support]
  == Questions that Unlock is helping investors answer#dot
  #questions(
    ("i.", "Can my assets support the income I want?",
     "See how pensions, investments, cash, timing and assumptions look together when turning accumulated wealth into income.",
     "The financial picture, an income question, a retirement comparison, the assumptions that matter and what is still unresolved."),
    ("ii.", "How might my wealth behave in a market shock?",
     "See how a mix of holdings responds to a selected historical or illustrative shock, what carries the most exposure, and where coverage is incomplete.",
     "The concern you chose, the holdings affected, the modelled impact, the limits of the evidence and the questions the result raises. It replays what has happened, not what will."),
    ("iii.", "What could EIS do for me?",
     "Look at a proposed amount, holding period, liquidity and concentration alongside the wider position. Any tax treatment depends on individual circumstances and current rules.",
     "An illustrative EIS portfolio and its sensitivities. It is not a forecast, recommendation, suitability assessment or tax calculation."),
    ("iv.", "What should I know before I invest in Company XYZ?",
     "Separate what a company says from the evidence behind it, what is missing, and the questions you may still need answered.",
     "A fictional company's claims set against the sources, the questions to put to it, and a prepared response reassessed. Unlock does not approve or recommend the company."),
  )
]

// 04 Five things you will see
#section[
  == Five things you will see#dot
  #lead[Together we choose one of several example investors, such as a couple nearing retirement, a founder after selling a business, or a property landlord, and follow them through Unlock. It all uses sample information.]
  #v(6pt)
  #block(width: 100%, stroke: (top: 0.5pt + rule))[
    #stage("01", "Your whole picture", "Everything the example investor owns in one place, from pensions and investments to property and the harder-to-value things, set up around their reasons for using Unlock. Every page has Learn and Ask, for an explanation or a question about what is on screen.")
    #stage("02", "How it holds up", "How that mix of holdings has behaved in past good and bad times, including the worst and best cases, and how it compares with other portfolios.")
    #stage("03", "The impact of EIS", "What an EIS programme could look like as a range of outcomes rather than a promise, and how a company's claims stand up against the evidence: what is supported, what is still open, and the questions to ask.")
    #stage("04", "Income for life", "What those assets could provide year by year in retirement, with everything included.")
    #stage("05", "For the people closest to you", "Heartbeat. If you don't log in for a set period, Unlock contacts the people you have chosen, so they can find your financial picture and where everything is. Our founding investors asked for it.")
  ]
  #v(12pt)
  #text(size: 10pt, fill: body-ink)[We will spend longer on what matters most to you. If you have brought a challenge (see below), we will cover it at the end. If you would also like to know more about the company behind Unlock, we can offer a company call (45 minutes). There is no obligation.]
]

// 05 Bring us a challenge
#section[
  #block(width: 100%, fill: green-fill, stroke: 0.5pt + green-line, inset: 14pt)[
    #eyebrow(fill: ink)[Bring us a challenge]  // ink on the green fill: 16:1
    #text(size: 11pt, fill: ink)[Is there a financial question you are facing, such as income in retirement, a property structure, an investment you are weighing up, or passing wealth on? Bring it to the demo. After the call, we will work on it with Unlock and come back to you with what we found.]
  ]
]

// 06 Before your demo
#section[
  #eyebrow[Before your demo]
  #block(width: 100%, stroke: 0.5pt + rule, inset: 14pt)[
    #set text(size: 10pt, fill: body-ink)
    #block(below: 8pt)[#text(weight: 500, fill: ink)[Nothing to prepare.] The demo uses sample information, so you do not need to send any personal documents.]
    #block(below: 8pt)[The call is on Google Meet and works best from a computer or iPad, so we can share our screen.]
    #block(below: 10pt)[#text(weight: 500, fill: ink)[Need to move your demo, or have a question?] Email us at #"tom@unlockdd.com"]
    #block[#link(calendly)[Reschedule your demo →] \ #link(calendly)[#calendly]]
  ]
]

// Compliance (wording unchanged from the source) and company details
#section[
  #text(size: 8.5pt, fill: muted)[Unlock operates outside the FCA perimeter by design. What we provide is structured decision support, not regulated financial advice. Unlock does not give financial, tax or legal advice. Personal outcomes depend on individual circumstances, evidence, current rules and assumptions.]
  #v(14pt)
  #line(length: 100%, stroke: 0.5pt + rule)
  #v(8pt)
  #text(size: 7.5pt, fill: muted)[Unlock Services Limited, registered in England and Wales, company number 15610723 · 86-90 Paul Street, London EC2A 4NE · #link("https://unlockdd.com")[unlockdd.com]]
]
