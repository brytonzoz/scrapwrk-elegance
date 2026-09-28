# ScrapWRK

Direct-to-consumer storefront for **ScrapWRK by Bryton Zoz** — one-of-a-kind clothing made from upcycled textile scraps. Built with React/Vite on the front end, a small Express/Stripe API for checkout, and Firebase for hosting.

**Live site:** https://scrapwrk.web.app

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) components
- [Stripe Checkout](https://stripe.com/docs/payments/checkout) for payments
- [Firebase Hosting](https://firebase.google.com/docs/hosting) + [Cloud Functions](https://firebase.google.com/docs/functions) for the production deployment
- [Cloudflare R2](https://developers.cloudflare.com/r2/) for product image hosting

## Project structure

```
src/                  React app (Vite)
  pages/Index.tsx      Main storefront page (product gallery, cart, checkout)
  pages/Success.tsx    Post-checkout confirmation page
  data/catalog.ts       Product catalog — names, prices, and image URLs
  lib/checkout.ts       Calls the /api/checkout and /api/checkout-session endpoints
  components/store/     Product gallery + cart drawer used on the storefront
  integrations/firebase/ Firebase client config (client-side, safe to expose — see below)
  integrations/supabase/ Legacy Supabase client, not currently wired into the active checkout flow

server/index.ts        Local Express API (Stripe checkout) used by `npm run dev`
functions/index.js      The same API, packaged as a Firebase Cloud Function — this is what's
                         actually deployed and running behind https://scrapwrk.web.app/api/**
firebase.json           Firebase Hosting + Functions routing config
```

Two copies of the checkout API exist on purpose: `server/index.ts` (TypeScript, Express, run locally
via `tsx`) is convenient for local development against Vite's dev server proxy, while
`functions/index.js` (plain JS, wrapped with `firebase-functions`) is what's deployed to production.
If you change one, mirror the change in the other.

## Running locally

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env.local   # then fill in your own Stripe test secret key
npm run dev
```

`npm run dev` runs the Vite dev server (port 8080) and the local Express API (port 8787)
concurrently; Vite proxies `/api/**` requests to the Express server. Open http://localhost:8080.

`.env.local` (gitignored, never commit this) needs:

```
STRIPE_SECRET_KEY=sk_test_...   # use a Stripe TEST key locally, never a live key
ALLOWED_COUNTRIES=US
API_PORT=8787
```

## Where the product images come from

The photos are original product photography of each ScrapWRK piece, shot by Bryton Zoz.

They are **not stored in this repository** — the live site loads them from a public
[Cloudflare R2](https://developers.cloudflare.com/r2/) bucket referenced directly in
[`src/data/catalog.ts`](src/data/catalog.ts):

```ts
const R2_BASE_URL = "https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev";
```

Each product's `images` array is just a list of filenames (e.g. `"hoodie 1.png"`) that get
turned into full R2 URLs at build time.

### Getting/replacing the images

1. **To view/download the current images**: open any filename from `src/data/catalog.ts` against
   the R2 base URL above, e.g.
   `https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev/hoodie%201.png`.
2. **To add or replace a product photo**:
   - Upload the new image to the same Cloudflare R2 bucket (via the
     [Cloudflare dashboard](https://dash.cloudflare.com/) → R2 → the ScrapWRK bucket → Upload,
     or the `wrangler` CLI / R2 API).
   - Add or update the filename in the relevant array (`hoodieImages`, `pantsImages`,
     `hatImages`) in `src/data/catalog.ts`. No rebuild-time asset processing is needed — the
     app just fetches the URL at runtime.
   - The R2 bucket must have public access enabled (`pub-*.r2.dev` is R2's public bucket
     dev URL) or be fronted by a custom domain with public read access.

### Hosting your own images elsewhere

You don't have to use R2 — any URL works, including:
- Firebase Storage (already configured in `src/integrations/firebase/client.ts`, see
  `constructStorageUrl` / `getDirectImageUrl`, though the active catalog doesn't use it today)
- A CDN like Cloudinary, imgix, or S3 + CloudFront
- Files under `public/` in this repo (simplest, but bloats the git repo and Firebase Hosting
  deploy size — not recommended for full-resolution photography)

Just point `src/data/catalog.ts` at whatever URLs you use.

## Deployment (Firebase Hosting + Functions)

The live site is deployed with the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
npm install -g firebase-tools
firebase login
firebase use scrapwrk        # matches the project id in .firebaserc
```

Set the Stripe secret key for the deployed Cloud Function (do this once, or whenever it changes):

```bash
firebase functions:config:set stripe.secret_key="sk_live_..."
# or, for newer Firebase CLI versions using .env-based function config:
# put STRIPE_SECRET_KEY=sk_live_... in functions/.env (gitignored)
```

Build and deploy:

```bash
npm run build          # builds the Vite app into dist/
firebase deploy         # deploys dist/ to Hosting AND functions/ to Cloud Functions
```

`firebase.json` routes `/api/**` to the `api` Cloud Function (`functions/index.js`) and
everything else to the built single-page app (`dist/index.html`), which is what makes both the
storefront and checkout work from a single `https://scrapwrk.web.app` origin.

**Note:** the deployed function currently runs with a Stripe **live** secret key, meaning
checkout on the production site processes real payments. Use test keys (`sk_test_...`) in any
environment that isn't meant to take real money.

### Alternative hosting

Nothing here is Firebase-specific beyond `firebase.json`/`functions/`. The Vite app in `dist/`
can be hosted on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages), and the
Express API in `server/index.ts` can run on any Node host (Render, Railway, Fly.io, a VPS) — just
point the frontend's `/api` requests at wherever you deploy the API (e.g. via a proxy rule or by
changing the fetch URLs in `src/lib/checkout.ts`).

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | `.env.local` (dev) / Cloud Function config (prod) | Stripe secret key used server-side to create Checkout Sessions |
| `ALLOWED_COUNTRIES` | `.env.local` | Comma-separated list of countries allowed at checkout |
| `API_PORT` | `.env.local` | Port for the local Express API (defaults to 8787) |

The Firebase client config in `src/integrations/firebase/client.ts` (API key, project id, etc.)
is intentionally public — Firebase web API keys aren't secrets; access is controlled by Firebase
Security Rules, not by hiding this value. Never do the same with the Stripe **secret** key.

## License

All rights reserved. This repository is shared for reference/portfolio purposes; the ScrapWRK
brand, product designs, and photography are not licensed for reuse.
