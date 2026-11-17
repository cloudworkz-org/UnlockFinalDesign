# How the site is deployed (for Will and Roy)

The site at unlockdd.com is hosted on **Cloudflare Pages**, project **`unlockdd-site`**. It is linked to this GitHub repo, so deploys are automatic.

## The short version

- **Push a branch → you get a preview.** Every branch gets its own test copy at `https://<id>.unlockdd-site.pages.dev`. The link is in the Cloudflare dashboard (unlockdd-site > Deployments) and on the GitHub PR.
- **Merge to `main` → it goes live** on unlockdd.com.
- Nothing is deployed by hand. Do not run `wrangler pages deploy` against production.

## Settings (for reference)

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `public-site` |
| Build command | `npm install && npm run build` |
| Output directory | `out` |
| Functions | `public-site/functions/` (the investor gate and `/api/certify`) |

## Names you need to know (never paste the values anywhere)

- Secret: **`SELFCERT_SECRET`**, which signs the investor cookie. Only Tom sets it.
- D1 database binding: **`CERT_DB`** (database `unlock-certifications`), which stores the audit record.

Both are needed on **Production and Preview**. Secrets only apply to deployments built *after* they are set, so after setting one, push a new commit (or retry the deployment) to get a fresh build.

### Set a secret

```
cd public-site
npx wrangler pages secret put SELFCERT_SECRET --project-name unlockdd-site --env preview
```

Use `--env production` for the live site. Paste a random 32+ character value when prompted. Dashboard alternative: unlockdd-site > Settings > Variables and Secrets > choose Production or Preview > add a secret.

To check it is set (names only): `npx wrangler pages secret list --project-name unlockdd-site --env preview`

## Run the tests

```
cd public-site
npm test
```

All 5 tests should pass before merging.

## Look at the audit record

Every certification writes one row (time, category, wording version, IP, browser, expiry).

```
npx wrangler d1 execute unlock-certifications --remote --command "SELECT certified_at, category, statement_version, expires_at FROM certifications ORDER BY certified_at DESC LIMIT 20"
```

Do not delete rows. Retention (we expect 6 years) is still to be confirmed with compliance.

## Roll back a bad live deployment

Cloudflare dashboard > Workers & Pages > unlockdd-site > Deployments > find the last good **Production** deployment > "..." > **Rollback to this deployment**. This takes seconds. Then fix the problem on a branch.

## Rules that must not be broken

1. **Never submit the certification form on live unlockdd.com** (and never POST to `/api/certify` there). It is a legal self-certification that the visitor must make themselves. Test on a preview URL only.
2. **Never change the certification wording or risk warnings** without sign-off. If the wording does change, update `STATEMENT_VERSION` in `public-site/functions/_lib/cert.js` **and** `data-statement-version` in `public-site/public/investors/index.html` together, with the same value. This makes everyone re-certify.
3. **The certification lasts a fixed 12 months** from the day it is made. It is never extended by later visits.
4. Stay on Cloudflare. No third-party trackers or analytics.
