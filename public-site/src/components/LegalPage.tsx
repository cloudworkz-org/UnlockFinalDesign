import type { ReactNode } from 'react';
import Link from 'next/link';
import home from '../app/home.module.css';
import s from './legal.module.css';

/** A fact still to be confirmed before the page goes live. */
export function Tbc({ children }: { children: ReactNode }) {
  return (
    <mark className={s.tbc}>
      <b>TBC</b>
      {children}
    </mark>
  );
}

/** "Lawful basis: …" line under each use of personal information. */
export function Basis({ children }: { children: ReactNode }) {
  return <span className={s.basis}>Lawful basis: {children}</span>;
}

export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={s.page}>
      <header className={home.nav}>
        <div className={home.navin}>
          <Link className={home.brand} href="/">
            <img src="/assets/unlock-white.svg" alt="Unlock" />
            <span className={home.dot}>.</span>
          </Link>
        </div>
      </header>

      {/* Remove this strip, the TBC tags and the noindex setting once the page is approved. */}
      <p className={s.draft} role="note">
        Draft for review: not yet approved. Items marked TBC still need confirming.
      </p>

      <main className={s.main}>
        <article className={s.doc}>
          <p className={home.eyebrow}>{eyebrow}</p>
          <h1>
            {title}
            <span className={home.hdot}>.</span>
          </h1>
          <p className={s.updated}>Last updated {updated}</p>
          <p className={s.lead}>{intro}</p>
          {children}
        </article>
      </main>

      <footer className={s.footer}>
        <p>
          © 2026 Unlock Services Limited. Registered in England and Wales. Company No. 15610723. Registered office:
          86-90 Paul Street, London EC2A 4NE.
        </p>
        <nav aria-label="Footer">
          <Link href="/">Home</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
