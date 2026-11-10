import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './home.module.css';

export const metadata: Metadata = {
  title: 'Page not found — Unlock',
  // The layout points every page's canonical link at the home page; this page is not the home page.
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className={styles.nfPage}>
      <header className={styles.nav}>
        <div className={styles.navin}>
          <Link className={styles.brand} href="/">
            <img src="/assets/unlock-white.svg" alt="Unlock" />
            <span className={styles.dot}>.</span>
          </Link>
        </div>
      </header>

      <main className={styles.nfMain}>
        <div className={styles.glow} />
        <div className={styles.nfIn}>
          <p className={styles.eyebrow}>Error 404</p>
          <h1>Page not found<span className={styles.hdot}>.</span></h1>
          <p className={styles.nfText}>The page you are looking for does not exist or may have moved.</p>
          <Link className={`${styles.btn} ${styles.btnP}`} href="/">
            Back to home <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
