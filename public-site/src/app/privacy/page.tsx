import type { Metadata } from 'next';
import LegalPage, { Basis, Tbc } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy notice — Unlock',
  description: 'How Unlock Services Limited uses personal information on unlockdd.com.',
  // Draft: kept out of search results until it is approved.
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy notice"
      updated="10 November 2026"
      intro={
        <>
          This notice explains how Unlock Services Limited uses personal information when you visit unlockdd.com, book
          a call with us or email us. It covers this website only. How the Unlock platform uses your information once
          you subscribe is explained separately, before you sign up. <Tbc>platform privacy notice</Tbc>
        </>
      }
    >
      <h2>Who we are</h2>
      <p>
        Unlock Services Limited (“Unlock”, “we”, “us”) decides how the personal information described here is used,
        which makes us its controller. We are registered in England and Wales, company number 15610723, and our
        registered office is 86-90 Paul Street, London EC2A 4NE. <Tbc>ICO registration number</Tbc>
      </p>
      <p>
        For questions about this notice or your information, email{' '}
        <a href="mailto:tom@unlockdd.com">tom@unlockdd.com</a>. <Tbc>privacy contact address</Tbc>
      </p>

      <h2>What we collect and why</h2>
      <h3>When you visit the site</h3>
      <p>
        Cloudflare hosts and protects this website. To show you pages and keep the site secure, Cloudflare processes
        technical information such as your IP address, your browser and the pages you ask for.
        <Basis>our legitimate interest in running a secure website.</Basis>
      </p>
      <h3>Visitor statistics</h3>
      <p>
        We use Cloudflare Web Analytics to count visits and see which pages are used. It doesn’t use cookies, and it
        shows us totals rather than identifying individual visitors.
        <Basis>our legitimate interest in understanding how the site is used.</Basis>
      </p>
      <h3>Fonts</h3>
      <p>
        Some pages load their fonts from Google Fonts, so your browser sends your IP address to Google when those pages
        load.
        <Basis>our legitimate interest in showing the site as designed.</Basis>
      </p>
      <h3>Booking a demo or a call</h3>
      <p>
        Our booking pages are run by Calendly. When you book, we receive your name, your email address, the time you
        chose and any answers you give. We use them to arrange and hold the call.
        <Basis>taking steps you have asked for, and our legitimate interest in responding to you.</Basis>
      </p>
      <h3>Emailing us</h3>
      <p>
        If you email us, we receive your email address, your message and anything you send with it. We use them to
        reply.
        <Basis>our legitimate interest in responding to you.</Basis>
      </p>
      <h3>The investor area</h3>
      <p>
        Pages under unlockdd.com/investors are only for investors who confirm that they fall into one of the categories
        described there. When you confirm, the site stores a cookie on your device recording your confirmation, so you
        can see those pages for 30 days without confirming again.
        <Basis>
          <Tbc>to confirm</Tbc>
        </Basis>
      </p>

      <h2>Cookies</h2>
      <p>Our pages don’t set cookies when they load. Cookies are only set in these two cases:</p>
      <ul>
        <li>
          <strong>unlock_selfcert</strong> is set when you confirm your investor category, to remember that you have.
          It lasts 30 days.
        </li>
        <li>
          <strong>Calendly’s cookies</strong> are set when you open a booking window, including ones for security and
          for remembering your cookie choices.{' '}
          <a href="https://calendly.com/legal/privacy-notice">Calendly’s privacy notice</a> explains them.
        </li>
      </ul>
      <p>
        <Tbc>whether a cookie notice is needed</Tbc>
      </p>

      <h2>Who we share it with</h2>
      <p>We use these providers to run parts of the site. Each handles information under its own terms:</p>
      <ul>
        <li>
          Cloudflare, for hosting, security and visitor statistics (
          <a href="https://www.cloudflare.com/privacypolicy/">privacy policy</a>)
        </li>
        <li>
          Google, for fonts (<a href="https://policies.google.com/privacy">privacy policy</a>)
        </li>
        <li>
          Calendly, for bookings (<a href="https://calendly.com/legal/privacy-notice">privacy notice</a>)
        </li>
        <li>
          Our email provider <Tbc>name</Tbc>
        </li>
      </ul>

      <h2>Transfers outside the UK</h2>
      <p>
        Cloudflare, Google and Calendly are based in the United States, so your information may be processed outside
        the UK. <Tbc>the safeguards that protect these transfers</Tbc>
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>The investor-area cookie expires after 30 days.</li>
        <li>
          Booking details and emails: <Tbc>how long</Tbc>
        </li>
        <li>
          Cloudflare’s technical logs and statistics: Cloudflare’s own retention periods. <Tbc>check</Tbc>
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of the personal information we hold about you, and ask us to correct it or delete it.
        You can also ask us to limit how we use it or object to our using it, and in some cases ask for it to be sent to
        another organisation. To do any of these, email <a href="mailto:tom@unlockdd.com">tom@unlockdd.com</a>.
      </p>
      <p>
        If you’re unhappy with how we’ve handled your information, you can complain to the Information Commissioner’s
        Office at <a href="https://ico.org.uk/">ico.org.uk</a> or on 0303 123 1113. We’d appreciate the chance to put
        things right first.
      </p>

      <h2>Children</h2>
      <p>This website is for adults and isn’t intended for anyone under 18.</p>

      <h2>Changes to this notice</h2>
      <p>If we change how we use personal information, we’ll update this page. The date at the top shows when it last changed.</p>
    </LegalPage>
  );
}
