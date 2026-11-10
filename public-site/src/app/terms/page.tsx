import type { Metadata } from 'next';
import LegalPage, { Tbc } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Website terms of use — Unlock',
  description: 'The terms that apply when you use unlockdd.com.',
  // Draft: kept out of search results until it is approved.
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Website terms of use"
      updated="10 November 2026"
      intro={
        <>
          These terms apply when you use unlockdd.com. By using the site, you accept them. They don’t cover the Unlock
          platform: its subscription terms are separate and are given to you before you subscribe.{' '}
          <Tbc>subscription terms</Tbc>
        </>
      }
    >
      <h2>Who we are</h2>
      <p>
        This website is run by Unlock Services Limited, registered in England and Wales, company number 15610723. Our
        registered office is 86-90 Paul Street, London EC2A 4NE. You can contact us at{' '}
        <a href="mailto:tom@unlockdd.com">tom@unlockdd.com</a>.
      </p>

      <h2>Information, not advice</h2>
      <p>This website is for information purposes only and does not constitute financial advice. Capital at risk.</p>
      <p>
        Unlock operates outside the FCA perimeter by design. What we provide is structured decision support, not
        regulated financial advice. Unlock does not give financial, tax or legal advice. Personal outcomes depend on
        individual circumstances, evidence, current rules and assumptions.
      </p>
      <p>Figures, portfolios and examples on the site are illustrative unless we say otherwise.</p>

      <h2>The investor area</h2>
      <p>
        Pages under unlockdd.com/investors are financial promotions. They are only for investors who confirm that they
        fall into one of the categories described on the investor page. Only continue if the statement you select is
        true for you. The risks are set out on those pages.
      </p>

      <h2>Accuracy</h2>
      <p>
        We aim to keep this website accurate and up to date, but we can’t promise that everything on it is complete or
        current. Tax rules and regulations change.
      </p>

      <h2>Our content</h2>
      <p>
        The text, design, logos and the Unlock name on this site belong to Unlock Services Limited or to those who
        license them to us. You may view and share our pages for your own use, but you may not copy or reuse their
        content for commercial purposes without our permission.
      </p>

      <h2>Links to other websites</h2>
      <p>
        We link to other websites, such as Calendly for booking calls. We aren’t responsible for their content or for how
        they use your information.
      </p>

      <h2>Our liability</h2>
      <p>
        As far as the law allows, we aren’t liable for any loss that comes from relying on information on this website,
        or from the website being unavailable. Nothing in these terms limits our liability where the law doesn’t allow
        it to be limited, such as for death or personal injury caused by negligence, or for fraud.{' '}
        <Tbc>legal review</Tbc>
      </p>

      <h2>Changes to these terms</h2>
      <p>We may update these terms. The date at the top shows when they last changed.</p>

      <h2>Law</h2>
      <p>
        These terms are governed by the law of England and Wales, and the courts of England and Wales can hear any
        dispute. If you live in Scotland or Northern Ireland, you can also bring a claim in your local courts.
      </p>
    </LegalPage>
  );
}
