'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, User, Layers, Search, Menu, X } from 'lucide-react';
import styles from './home.module.css';

// Exact "default" pattern from gridPulsePatterns.ts — 8 active cells
const PULSE_CELLS = new Set([
  '2,1','8,1','5,2','10,3','1,4','7,4','4,5','9,6',
]);

function GridPulse() {
  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 12; c++) {
      cells.push(
        <div key={`${c},${r}`} className={PULSE_CELLS.has(`${c},${r}`) ? styles.gridCellActive : styles.gridCell} />
      );
    }
  }
  return <div className={styles.gridPulse} aria-hidden="true">{cells}</div>;
}

const STEP_ICONS = [User, Layers, Search];

// CP1 AdviceGap — canonical wording from Unlock-Content-Brain/04_pillars/CP1_AdviceGap.md
const ADVICE_GAP = [
  ['Between two markets', 'Investable assets between £500k and £25M sit in the middle of a market built for either mass-affluent platforms or family offices. Neither was built for that cohort.'],
  ['Outside the regulated perimeter', 'Your IFA can confirm EIS is suitable in principle. What they cannot do is advise which specific companies to back — the decision that most directly determines whether your programme succeeds.'],
  ['Structural, not personal', 'This is not a gap a better adviser can close. It is a feature of the regulatory landscape — and it is exactly the territory Unlock was built to cover.'],
];

const REG = [
  { name: 'Global equity tracker', sub: 'lot basis £6.90/unit', wrapper: 'HL ISA', value: '£284,100', status: 'CGT-free', green: true },
  { name: 'Mixed allocation', sub: 'IHT scope Apr 2027', wrapper: 'SIPP', value: '£612,500', status: 'Pension IHT', green: false },
  { name: 'EIS portfolio · 4 cos', sub: '18 months into 2-yr clock', wrapper: 'EIS', value: '£285,000', status: 'BPR qualifying', green: true },
  { name: 'AIM portfolio · 14 holdings', sub: '', wrapper: 'AJ Bell', value: '£193,800', status: 'BPR partial', green: false },
  { name: 'Primary residence', sub: '', wrapper: 'Property', value: '£471,920', status: 'IHT exposed', green: false },
];

const PROBLEMS = [
  ['01', 'No consolidated view', 'The average HNW investor holds assets across multiple platforms, wrappers and structures. No single view exists — not from their IFA, not from their accountant, not from any one platform.'],
  ['02', 'No independent intelligence', "Every tool you use earns from what you hold through it. Your IFA can't legally advise on individual EIS companies. The gap sits exactly where the most tax-efficient decisions are."],
  ['03', 'Analysis locked away', 'Institutions have models, dashboards and analysts. Private investors with comparable wealth have a spreadsheet and gut instinct. Until now.'],
];

const SOLUTION = [
  ['Truth first', 'A dependable, lot-level record of what you own and what the evidence says — the tax status of every asset already calculated.'],
  ['Interpretation second', 'Early warnings, risk checks and plain-English explanations grounded in facts. What matters, when it matters.'],
  ['Control always yours', 'Read-only. No trading. No advice. Clarity you can act on — with your advisers, or independently.'],
];

const TOOLS = [
  ['▦', 'Asset Register', 'Every asset, every wrapper. Lot-level cost basis, IHT status and BPR clocks, automatic.', 'live'],
  ['◐', 'Safety Lights', 'Concentration, liquidity runway and cash. Red / amber / green, with the lever to pull.', 'dev'],
  ['£', 'IHT Calculator', 'Your real liability, updated whenever the register changes. What\'s exempt, what\'s in its BPR window.', 'live'],
  ['◇', 'Portfolio Simulator', 'Ten named scenarios. Your beliefs weight each one. See the downside before you act.', 'dev'],
  ['↘', 'Decumulation Planner', 'Which wrapper to draw first, how long the money lasts, the estate at the end.', 'live'],
  ['⊞', 'EIS / SEIS Tracker', 'Relief claimed, qualifying periods and IHT status across every vintage you hold.', 'dev'],
  ['✦', 'AI Assistant', 'Ask anything about your numbers. Intelligence only — signposts to an adviser for regulated decisions.', 'dev'],
  ['▣', 'Reports', 'Portfolio, decumulation and tax PDFs in one click — generated live, always current.', 'dev'],
];

const STEPS = [
  ['01', 'It learns who you are', 'Eight questions about your situation and beliefs. Unlock computes your investor profile automatically. You arrive already known.'],
  ['02', 'Everything in one place', "Add every asset — CSV or manual. The moment it's added, Unlock flags its IHT status, BPR period and tax position."],
  ['03', "It finds issues you didn't know you had", 'Ten automated checks surface an unmitigated IHT bill, an income gap, a pension entering IHT scope. Each with a clear action.'],
];

const TIERS = [
  { pop: '', name: 'Demo', price: 'Free', period: '', desc: 'Synthetic-data sandbox.', features: ['Explore the platform', 'Illustrative portfolio', 'Plain-language queries'], cta: 'Get started' },
  { pop: 'Most popular', name: 'Standard', price: '£99', period: '/month', desc: 'Manual upload, full intelligence.', features: ['Unlimited holdings + household view', 'IHT Calculator + EIS/SEIS Tracker', 'Portfolio Simulator + Reports'], cta: 'Book a demo' },
  { pop: '', name: 'White Glove', price: '£299', period: '/month', desc: 'Live feeds + concierge.', features: ['Everything in Standard', 'Live data feeds', 'Decumulation Planner + AI Assistant'], cta: 'Book a demo' },
];

const ABOUT = [
  ['Structurally independent', 'No product commission. No AUM fee. We earn from your subscription — never from what you hold.'],
  ['UK tax depth', 'EIS, SEIS, IHT, CGT and pension drawdown modelled forward, continuously, as the rules change.'],
  ['The advice gap, filled', "Your IFA can't legally advise on individual EIS companies. Unlock provides the intelligence for the territory they can't map."],
];

const TEAM = [
  ['TK', 'Tom King — Founder & CEO', '15 years building investor-introduction and capital-facilitation technology; facilitated significant investor capital over that period.'],
  ['WS', 'Werner Snyman — Head of Product', '19 years in senior product leadership at Nedbank; wealth-platform architecture across four markets.'],
  ['WC', 'William Corke — Head of Service & Compliance', 'Multi-million-pound delivery for FTSE 500 clients.'],
  ['TV', 'Tony Vine-Lott — Commercial Strategy Adviser', 'Founder of Barclays Stockbrokers. Former Director General of TISA. Founding investor.'],
];

const CALENDLY_URL = 'https://calendly.com/tom-unlockdd/unlock-demo';

function openCalendly(e: React.MouseEvent) {
  e.preventDefault();
  const calendly = (window as unknown as { Calendly?: { initPopupWidget: (opts: { url: string }) => void } }).Calendly;
  if (calendly) {
    calendly.initPopupWidget({ url: CALENDLY_URL });
  } else {
    window.open(CALENDLY_URL, '_blank');
  }
}

export default function PlatformPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const regRows = REG.map((r, i) => (
    <tr key={i}>
      <td>
        <span className={styles.nm}>{r.name}</span>
        {r.sub && <span className={styles.sub}>{r.sub}</span>}
      </td>
      <td>{r.wrapper}</td>
      <td>{r.value}</td>
      <td><span className={`${styles.badge} ${r.green ? styles.badgeG : ''}`}>{r.status}</span></td>
    </tr>
  ));

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navin}>
          <div className={styles.navleft}>
            <Link className={styles.brand} href="/">
              <img src="/assets/unlock-white.svg" alt="Unlock" />
              <span className={styles.dot}>.</span>
            </Link>
            <ul
              id="platform-nav-menu"
              className={`${styles.navlinks} ${menuOpen ? styles.navlinksOpen : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <li><Link href="/">Home</Link></li>
              <li><a href="#tools">Platform</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#about">About</a></li>
              <li><Link href="/investors">Investors</Link></li>
            </ul>
          </div>
          <div className={styles.navright}>
            <a className={styles.navCta} href="#demo">Book a demo</a>
            <button
              type="button"
              className={styles.navToggle}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="platform-nav-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.glow} />
        <div className={`${styles.heroin} u-heroin`}>
          <div>
            <p className={styles.eyebrow}>Portfolio intelligence · for investors managing £1M+</p>
            <h1>Everything you own, finally in one place — and finally making sense.</h1>
            <p className={styles.heroLead}>
              Until now, no single tool could handle wealth spread across multiple platforms,
              wrappers and structures. Unlock assembles the complete picture, continuously
              reconciling your holdings at lot level and with full tax awareness, so you
              understand your position <b>before</b> you act, not after.
            </p>
            <div className={styles.ctarow}>
              <a className={`${styles.btn} ${styles.btnP}`} href="#demo">
                Book a demo <span>→</span>
              </a>
              <a className={`${styles.btn} ${styles.btnO}`} href="#tools">Explore the platform</a>
            </div>
            <p className={styles.conflict}>
              Conflict-free by design — Unlock earns from subscriptions, not from what you hold.
              Public access opens October 2026.
            </p>
          </div>

          {/* Dashboard mock */}
          <div className={styles.dash}>
            <div className={styles.dashBar}>
              <span className={styles.dot3}><i /><i /><i /></span>
              <span className={styles.tabs}>
                <span className="on">Portfolio</span>
                <span>Tax</span>
                <span>Drawdown</span>
              </span>
              <span className={styles.illus}>Illustrative data</span>
            </div>
            <div className={styles.dashBody}>
              <div className={styles.stat3}>
                <div className={styles.stile}>
                  <p className={styles.stileK}>Total portfolio</p>
                  <div className={styles.stileV}>£1,847,320</div>
                  <p className={`${styles.stileS} up`}>↑ £42,100 this month</p>
                </div>
                <div className={styles.stile}>
                  <p className={styles.stileK}>EIS / SEIS</p>
                  <div className={styles.stileV}>£285,000</div>
                  <p className={styles.stileS}>BPR clock active</p>
                </div>
                <div className={styles.stile}>
                  <p className={styles.stileK}>IHT exposure</p>
                  <div className={styles.stileV}>£663,820</div>
                  <p className={styles.stileS}>review due</p>
                </div>
              </div>
              <table className={styles.regTable}>
                <thead>
                  <tr>
                    <th>Holding</th><th>Wrapper</th><th>Value</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {regRows}
                  <tr className={styles.tot}>
                    <td>Total</td><td></td><td>£1,847,320</td><td></td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '11.5px', color: 'var(--u-text-faint)', marginTop: '14px' }}>
                Liquidity runway: 14 months · Concentration: SIPP 33% · Cash buffer: healthy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className={styles.sec} style={{ background: 'var(--u-bg)' }}>
        <div className={styles.water}>Problem</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>Why this exists</p>
          <h2 className={styles.h2} style={{ maxWidth: '18ch', margin: '0 0 52px' }}>
            <span className={styles.vbar}>Three problems</span> that were never properly solved<span className={styles.hdot}>.</span>
          </h2>
          <div className={styles.grid3}>
            {PROBLEMS.map((p, i) => (
              <div key={i} className={styles.card}>
                <p className={styles.cardIx}>{p[0]}</p>
                <h3>{p[1]}</h3>
                <p>{p[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="u-divider" />

      {/* ADVICE GAP — CP1 */}
      <section className={styles.sec} style={{ background: 'var(--u-bg-deep)' }}>
        <div className={styles.water}>Gap</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>The advice gap</p>
          <h2 className={styles.h2} style={{ fontSize: 'var(--u-type-display)', maxWidth: '20ch', margin: '0 0 16px' }}>
            <span className={styles.vbar}>The advice gap</span> is widening upward, not just downward<span className={styles.hdot}>.</span>
          </h2>
          <p className={styles.muted} style={{ fontSize: '18px', maxWidth: '54ch', margin: '0 0 52px', lineHeight: '1.6' }}>
            The UK advice gap isn&apos;t just a mass-market problem. The £500k–£25M cohort falls
            between the two market structures that exist — and neither was built for them.
          </p>
          <div className={styles.grid3}>
            {ADVICE_GAP.map((a, i) => (
              <div key={i} className={styles.card}>
                <h3>{a[0]}</h3>
                <p>{a[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="u-divider" />

      {/* SOLUTION */}
      <section className={styles.sec} style={{ background: 'var(--u-bg)' }}>
        <div className={styles.water}>Solution</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>The solution</p>
          <h2 className={styles.h2} style={{ maxWidth: '22ch', margin: '0 0 16px' }}>
            <span className={styles.vbar}>A single source of truth</span> — with the interpretation layer on top<span className={styles.hdot}>.</span>
          </h2>
          <p className={styles.muted} style={{ fontSize: '18px', maxWidth: '54ch', margin: '0 0 52px', lineHeight: '1.6' }}>
            The Asset Register is the heartbeat of Unlock. Everything else builds on it.
          </p>
          <div className={styles.grid3}>
            {SOLUTION.map((s, i) => (
              <div key={i} className={styles.card}>
                <h3>{s[0]}</h3>
                <p>{s[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO BAND */}
      <section className={styles.band} id="demo">
        <div className={styles.wrap} style={{ maxWidth: '640px' }}>
          <h2>See it with a real portfolio in 15 minutes.</h2>
          <p>Core tools live, others in active development. Illustrative data, no commitment.</p>
          <a className={`${styles.btn} ${styles.btnP}`} href={CALENDLY_URL} onClick={openCalendly}>
            Book a demo <span>→</span>
          </a>
        </div>
      </section>

      {/* TOOLS */}
      <section className={styles.sec} id="tools" style={{ background: 'var(--u-bg)', overflow: 'hidden' }}>
        <div className={styles.water}>Platform</div>
        <GridPulse />
        <div className={styles.wrap} style={{ position: 'relative', zIndex: 1 }}>
          <p className={styles.eyebrow}>The platform</p>
          <h2 className={styles.h2} style={{ margin: '0 0 16px' }}><span className={styles.vbar}>Eight tools</span><span className={styles.hdot}>.</span> One source of truth<span className={styles.hdot}>.</span></h2>
          <p className={styles.muted} style={{ fontSize: '18px', maxWidth: '60ch', margin: '0 0 52px', lineHeight: '1.6' }}>
            Each tool runs off your Asset Register — the more complete it is, the sharper everything
            else gets. Read-only by design. The decision is always yours.
          </p>
          <div className={styles.tools}>
            {TOOLS.map((t, i) => (
              <div key={i} className={styles.tool}>
                <div className={styles.toolGly}>{t[0]}</div>
                <h3>{t[1]} <span style={{ fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 500, color: t[3] === 'live' ? 'var(--u-green)' : 'var(--u-text-faint)', marginLeft: '6px' }}>{t[3] === 'live' ? 'Live' : 'In development'}</span></h3>
                <p>{t[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASSET REGISTER DETAIL */}
      <section className={styles.sec} style={{ background: 'var(--u-bg-deep)' }}>
        <div className={styles.water}>Register</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>The heartbeat</p>
          <h2 className={styles.h2} style={{ margin: '0 0 52px' }}><span className={styles.vbar}>The Asset Register</span>, in detail<span className={styles.hdot}>.</span></h2>
          <div className={styles.twocol}>
            <div className={styles.dash}>
              <div className={styles.dashBar}>
                <span className={styles.dot3}><i /><i /><i /></span>
                <span className={styles.tabs}><span className="on">Asset Register</span></span>
                <span className={styles.illus}>Illustrative data</span>
              </div>
              <div className={styles.dashBody}>
                <table className={styles.regTable}>
                  <thead>
                    <tr><th>Holding</th><th>Wrapper</th><th>Value</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {REG.slice(0, 4).map((r, i) => (
                      <tr key={i}>
                        <td><span className={styles.nm}>{r.name}</span></td>
                        <td>{r.wrapper}</td>
                        <td>{r.value}</td>
                        <td><span className={`${styles.badge} ${r.green ? styles.badgeG : ''}`}>{r.status}</span></td>
                      </tr>
                    ))}
                    <tr className={styles.tot}><td>Total</td><td></td><td>£1,847,320</td><td></td></tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '11px', color: 'var(--u-text-faint)', marginTop: '12px' }}>All figures illustrative</p>
              </div>
            </div>
            <div className={styles.featList}>
              <div className="fi">
                <h3>Lot-level tracking</h3>
                <p>Every holding decomposed into original purchase lots — date, units, price — with cost-basis evolution to current value.</p>
              </div>
              <div className="fi">
                <h3>Household view</h3>
                <p>One picture across people, wrappers, accounts and entities. Hidden exposures surface naturally.</p>
              </div>
              <div className="fi">
                <h3>Plain-language queries</h3>
                <p>"Show assets bought above £100K now worth less than £80K." Natural language over structured truth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.sec} id="how" style={{ background: 'var(--u-bg)' }}>
        <div className={styles.water}>Process</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>How it works</p>
          <h2 className={styles.h2} style={{ margin: '0 0 12px' }}>Three steps<span className={styles.hdot}>.</span> <span className={styles.vbar}>The platform does the work</span><span className={styles.hdot}>.</span></h2>
          <p className={styles.muted} style={{ fontSize: '18px', margin: '0 0 52px' }}>
            You&apos;re onboarded before you&apos;ve added a single asset.
          </p>
          <div className={styles.grid3}>
            {STEPS.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={i} className={`${styles.card} ${styles.stepCard}`}>
                  <span className={styles.ghostNum}>{s[0]}</span>
                  <div className={styles.stepIcon}><Icon /></div>
                  <h3>{s[1]}</h3>
                  <p>{s[2]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="u-divider" />

      {/* PRICING */}
      <section className={styles.sec} id="pricing" style={{ background: 'var(--u-bg)' }}>
        <div className={styles.water}>Pricing</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>Pricing</p>
          <h2 className={styles.h2} style={{ margin: '0 0 12px' }}>One subscription<span className={styles.hdot}>.</span> <span className={styles.vbar}>No product conflicts</span><span className={styles.hdot}>.</span></h2>
          <p className={styles.muted} style={{ fontSize: '18px', maxWidth: '54ch', margin: '0 0 52px' }}>
            Unlock earns from your subscription — never from what you hold, trade or buy.
          </p>
          <div className={styles.tiers}>
            {TIERS.map((t, i) => (
              <div key={i} className={`${styles.tier} ${t.pop ? styles.tierFeat : ''}`}>
                {t.pop && <p className={styles.tierPop}>{t.pop}</p>}
                <h3>{t.name}</h3>
                <div className={styles.tierPrice}>
                  {t.price}<span>{t.period}</span>
                </div>
                <p className={styles.tierDesc}>{t.desc}</p>
                <ul>
                  {t.features.map((f, j) => (
                    <li key={j}>
                      <Check className={styles.checkIcon} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {t.cta === 'Book a demo' ? (
                  <a className={styles.tierBtn} href={CALENDLY_URL} onClick={openCalendly}>{t.cta}</a>
                ) : (
                  <a className={styles.tierBtn} href="#demo">{t.cta}</a>
                )}
              </div>
            ))}
          </div>
          <p className={styles.pricenote}>Targeted at investors with £1M–£20M+ portfolios.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.sec} id="about" style={{ background: 'var(--u-bg-deep)' }}>
        <div className={styles.water}>About</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>About Unlock</p>
          <h2 className={styles.h2} style={{ maxWidth: '16ch', margin: '0 0 16px' }}><span className={styles.vbar}>Built independent</span>, on purpose<span className={styles.hdot}>.</span></h2>
          <p className={styles.muted} style={{ fontSize: '18px', maxWidth: '60ch', margin: '0 0 52px', lineHeight: '1.6' }}>
            Every existing platform earns from what you hold through it. Unlock doesn&apos;t. The only
            thing we optimise for is the clarity of your decisions.
          </p>
          <div className={styles.grid3}>
            {ABOUT.map((a, i) => (
              <div key={i} className={styles.card}>
                <h3>{a[0]}</h3>
                <p>{a[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className={styles.sec} id="team" style={{ background: 'var(--u-bg-deep)', paddingTop: 0 }}>
        <div className={styles.water}>Team</div>
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>The team</p>
          <h2 className={styles.h2} style={{ margin: '0 0 52px' }}><span className={styles.vbar}>Who&apos;s building</span> Unlock<span className={styles.hdot}>.</span></h2>
          <div className={styles.team}>
            {TEAM.map((m, i) => (
              <div key={i} className={styles.member}>
                <div className={styles.av}>{m[0]}</div>
                <h3>{m[1]}</h3>
                <p>{m[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.frow}>
          <div className={styles.ftag}>
            <Link className={styles.brand} href="/">
              <img src="/assets/unlock-white.svg" alt="Unlock" />
              <span className={styles.dot} style={{ color: 'var(--u-green)', fontSize: '18px', transform: 'translateX(-9px)' }}>.</span>
            </Link>
            <p>Portfolio intelligence and investment access for UK investors managing £1M+. Subscription only.</p>
          </div>
          <div className={styles.flinks}>
            <a href="#about">About</a>
            <a href="#team">Team</a>
            <Link href="/investors">Investors</Link>
            <a href="#pricing">Pricing</a>
            <a href="#how">How it works</a>
            <a href="mailto:tom@unlockdd.com">Contact</a>
          </div>
        </div>
        <div className={styles.fbar}>
          <span>© 2026 Unlock Services Limited. Registered in England and Wales. Company No. 15610723. Registered office: 86-90 Paul Street, London EC2A 4NE.</span>
          <span style={{ maxWidth: '480px', textAlign: 'right' }}>
            This website is for information purposes only and does not constitute financial advice. Capital at risk.
          </span>
        </div>
      </footer>
    </>
  );
}
