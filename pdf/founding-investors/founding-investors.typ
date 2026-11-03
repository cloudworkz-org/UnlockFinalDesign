// Unlock Founding Investors: the downloadable PDF, typeset with Typst.
// Wording is identical to public-site/public/founding-investors/index.html (source: version 10, 1 Nov 2026; approved by Will on 3 Nov 2026).
// To change a sentence, change the source first, then the page and this file; the text check compares them.
// Build with make.sh in this folder: status follows the page's data-status. LAYOUT=continuous makes one long page.

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

#let calendly = "https://calendly.com/tom-unlockdd/unlock-company-call"
#let draft-line = "Draft · not yet approved for sending"

#set document(title: "Unlock Founding Investors", author: "Unlock Services Limited")
#set text(font: "Aeonik", weight: 400, size: 9.5pt, fill: body-ink, lang: "en", region: "GB", hyphenate: false, ligatures: false)
#set par(justify: false, leading: 0.62em, spacing: 0.9em)
#set smartquote(enabled: false)
#set block(spacing: 0pt)

#let logo(height) = image("unlock-logo.svg", height: height, alt: "Unlock")
#let dot = text(fill: green)[.]
#let caps(size: 7.5pt, fill: green-ink, tracking: 0.18em, body) = text(size: size, weight: 500, fill: fill, tracking: tracking, upper(body))
#let eyebrow(fill: green-ink, body) = block(below: 9pt, sticky: true)[#box(width: 4.5pt, height: 4.5pt, fill: green, baseline: -0.3pt)#h(6pt)#caps(fill: fill, body)]
#let lead(body) = block(below: 8pt, text(size: 11pt, fill: body-ink, body))
#let small(body) = text(size: 8.5pt, fill: muted, body)
#let badge(color: green-ink, body) = box(stroke: 0.8pt + color, inset: (x: 6pt, y: 3.4pt), baseline: 3.4pt, caps(size: 8pt, fill: color, tracking: 0.08em, body))
#let section(body) = block(breakable: false, width: 100%, above: 20pt, body)

#show heading.where(level: 1): it => block(above: 2pt, below: 12pt, sticky: true, text(size: 30pt, weight: 250, fill: ink, tracking: -0.02em, it.body))
#show heading.where(level: 2): it => block(below: 12pt, sticky: true, text(size: 18pt, weight: 250, fill: ink, tracking: -0.01em, it.body))
#show link: set text(fill: green-ink)
#show link: underline.with(offset: 2pt, stroke: 0.4pt + green-ink)

#let stats(..items) = {
  let items = items.pos()
  block(breakable: false, width: 100%, above: 16pt, stroke: (top: 0.5pt + rule), inset: (top: 11pt),
    grid(columns: items.len() * (1fr,),
      ..items.enumerate().map(((i, item)) => {
        let (value, label) = item
        block(width: 100%, inset: (left: if i == 0 { 0pt } else { 12pt }, right: 8pt),
          stroke: (left: if i == 0 { none } else { 0.5pt + rule }),
          stack(dir: ttb, spacing: 6pt,
            text(size: 22pt, weight: 250, fill: ink, tracking: -0.01em, value),
            small(label)))
      })))
}

#let cards(..items) = grid(columns: (1fr, 1fr, 1fr), stroke: 0.5pt + rule, inset: (x: 11pt, top: 12pt, bottom: 13pt),
  ..items.pos().map(((index, title, body)) => stack(dir: ttb, spacing: 7pt,
    text(size: 10pt, weight: 500, fill: green-ink, index),
    text(size: 10.5pt, weight: 500, fill: ink, title),
    text(size: 9pt, fill: muted, body))))

#let person(initials, name, role, bio) = block(breakable: false, width: 100%, stroke: (top: 0.5pt + rule), inset: (top: 8pt, bottom: 9pt),
  grid(columns: (22pt, 1fr), column-gutter: 9pt,
    box(width: 22pt, height: 22pt, fill: green-fill, stroke: 0.5pt + green-line,
      align(center + horizon, text(size: 7.5pt, weight: 500, fill: ink, initials))),  // ink on the green fill: 16:1 (green-ink would be 4.3:1)
    stack(dir: ttb, spacing: 5pt,
      text(size: 10pt, weight: 500, fill: ink, name),
      caps(size: 6.5pt, tracking: 0.14em, role),
      text(size: 8.5pt, fill: muted, bio))))

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
        [#caps(size: 6.5pt, fill: muted, "Founding Investor Programme")#if draft [#h(10pt)#caps(size: 6.5pt, fill: warn, "Draft")]])
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
  caps(size: 7pt, fill: muted, "Founding Investor Programme"))
#v(8pt)
#line(length: 100%, stroke: 0.5pt + rule)
#v(26pt)

// 01 Cover
#eyebrow[Unlock Services Limited]
= Founding Investor Programme#dot
#block(width: 86%, text(size: 12.5pt, fill: muted)[You have seen how Unlock approaches important financial questions. This is an introduction to the company, and what it would mean to join as a founding investor.])
#stats(("£6.5m", "Pre-money valuation"), ("£1.2m", "Round size"), ("SEIS/EIS", "HMRC advance assurance (provisional)"))

// 02 What Unlock is
#section[
  #eyebrow[What Unlock is]
  #grid(columns: (1.6fr, 1fr), column-gutter: 18pt,
    [
      #lead[Unlock is a decision-intelligence service for high net worth and self-certified sophisticated investors who remain responsible for their own financial decisions.]
      #block(below: 9pt, badge[Founding investors only])
      #lead[It gives them a live view of all their assets: regulated investments such as stocks, pensions and bonds, as well as unregulated investments such as property, gold and crypto. It helps the investor explore consequential decisions with the sources, assumptions, uncertainty and next action kept in view.]
    ],
    block(width: 100%, stroke: 0.5pt + rule, inset: 13pt)[
      #caps(fill: muted, "Unlock does not")
      #v(10pt)
      #set text(size: 10pt, fill: body-ink)
      #list(marker: box(width: 7pt, height: 1.2pt, fill: green, baseline: -2.8pt), body-indent: 8pt, spacing: 8pt,
        [Give advice], [Manage assets], [Sell products], [Execute transactions])
    ],
  )
]

#section[
  #eyebrow[Who it is for]
  #lead[Unlock is for High Net Worth and self-certified sophisticated investors whose finances have several moving parts: pensions, investments, property, tax and family. Moving into retirement income is one example. Selling a business or receiving an inheritance are others. What matters is joining it all up.]
]

// 03 What investors see in Unlock
#section[
  #eyebrow[What investors see in Unlock]
  == Unlock tells you when something changes#dot
  #cards(
    ("i.", "Your position moves", "A holding falls, a pension rule changes, cash builds up. Unlock tells you straight away."),
    ("ii.", "Only what matters", "Unlock alerts you to changes that matter to your plan, and shows what each one affects, such as retirement income or tax."),
    ("iii.", "The decision stays yours", "An alert points to the question worth looking at, not an answer. What you do about it, and the record of why, stays with you."),
  )
  #v(9pt)
  #small[This round funds the production build.]
]

#section[
  #eyebrow[How Unlock makes money]
  #lead[A subscription paid by the individual investor. No fees on assets, no commission and no transaction charges, so the only way the business grows is by being useful.]
  #v(3pt)
  #badge[Subscription only]#h(6pt)#badge(color: muted)[No fees on assets]#h(6pt)#badge(color: muted)[No commission]#h(6pt)#badge(color: muted)[No transaction charges]
]

// 04 Founding Investor Programme
#section[
  #eyebrow[Unlock's Founding Investor Programme]
  == Partners in shaping Unlock#dot
  #lead[Founding investors back the company early and help decide what Unlock builds next. It's part of the strategy: we build it with the people who use it.]
  #lead[Founding investors take part in the Founding Investor Programme, on its own terms, separate from their shares.]
  #lead[The Unlock Founding Investor Programme is for High Net Worth and self-certified sophisticated investors.]
]

// 05 The round
#section[
  #block(width: 100%, fill: green-fill, stroke: 0.5pt + green-line, inset: 14pt)[
    #eyebrow(fill: ink)[The round]  // ink on the green fill: 16:1
    == The numbers#dot
    #stats(("£6.5m", "Pre-money valuation"), ("£1.2m", "Round size"))
    #v(10pt)
    #text(size: 9.5pt, fill: body-ink)[Unlock Services Limited has HMRC advance assurance for SEIS and EIS, dated 29 May 2025. It is provisional, and relates to a proposed investment of £500,000 rather than the full £1.2m round. The share price and full investment terms are covered in a separate call, if you ask for one.]
  ]
]

// 06 Team
#section[
  #eyebrow[The people building Unlock]
  == The team#dot
  #grid(columns: (1fr, 1fr, 1fr), column-gutter: 16pt,
    person("TK", "Tom King", "Founder & CEO", "15 years in investor-introduction and capital-facilitation technology."),
    person("WS", "Werner Snyman", "Head of Product", "20 years in senior product leadership at Nedbank; wealth-platform architecture across four markets."),
    person("NZ", "Nick Zak", "Head of Operations", "20 years in telecoms, marketing, data-warehousing and business transformation. Chief of Staff at Valtech."),
    person("WC", "William Corke", "Growth and Delivery", "Multi-million-pound delivery for FTSE 500 clients."),
    person("CK", "Cagatay Kirici", "Head of AI Infrastructure", "Built the software Tom licensed for years, then spent five years at Qualcomm."),
    person("TV", "Tony Vine-Lott", "Commercial Strategy Adviser", "Set up Barclays Stockbrokers; former Chairman of Barclays Trust Bank. Former Director General of TISA. Founding investor."),
    person("FI", "Founding investors", "Founding Investor Programme", "Investors who test the product, bring their own questions and help decide what Unlock builds next."),
  )
]

// 07 What happens next
#section[
  #eyebrow[What happens next]
  == A decision made in stages, at your pace#dot
  #lead[We take it in stages, so you have what you need before you decide.]
  #v(6pt)
  #block(width: 100%, stroke: (top: 0.5pt + rule))[
    #stage("01", "The company call (45 minutes)", "We take you through the company: the problem, the opportunity, the product, the team, progress so far and what is still to be proved. It is a two-way conversation, so you can spend time on what matters most to you. You won't be asked for a commitment on the call.")
    #stage("02", "A written summary, afterwards", "A short document setting out the investment case, for you to read in your own time.")
    #stage("03", "A deal structure call (30 minutes), if you'd like one", "We go through the exit strategy, the valuation, the risks and what it could return, then how investing works with SeedLegals. You can put figures you choose into an EIS calculator to see the risk and the return side by side.")
  ]
]

#section[
  #eyebrow[Before your call]
  #set text(size: 10pt, fill: body-ink)
  #block(below: 8pt)[The call is on Google Meet and works best from a computer or iPad, so Tom can share his screen. There's nothing to prepare.]
  #block(below: 8pt)[Questions before then: Tom King, #"tom@unlockdd.com"]
  #block[Need a different time? #link(calendly)[Reschedule your call] \ #link(calendly)[#calendly]]
]

// Important information: compliance. Wording unchanged from Draft V10.
#section[
  #eyebrow[Important information]
  #set text(size: 8.5pt, fill: muted)
  #list(marker: text(fill: muted)[•], body-indent: 7pt, spacing: 7pt,
    [Unlock operates outside the FCA perimeter by design. What we provide is structured decision support, not regulated financial advice.],
    [This page introduces Unlock Services Limited and invites you to a conversation. It is not an offer of shares, and it is not advice.],
    [Investing in an early-stage company is high risk. You could lose all the money you invest. Shares in a private company are hard to sell, and any return may take many years or never come.],
    [Tax treatment depends on your individual circumstances and on the company and investment continuing to qualify, and the rules can change. Nothing on this page confirms that any tax relief will be available to you.],
    [The investment documents govern the terms of any investment and any founding investor benefits.],
    [Consider taking independent financial, tax and legal advice before making any investment decision.],
  )
  #v(18pt)
  #line(length: 100%, stroke: 0.5pt + rule)
  #v(8pt)
  #text(size: 7.5pt, fill: muted)[Unlock Services Limited, registered in England and Wales, company number 15610723 · 86-90 Paul Street, London EC2A 4NE · #link("https://unlockdd.com")[unlockdd.com]]
]
