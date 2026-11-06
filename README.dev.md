# Market proxy

Both the Vercel build and the GitHub Pages build read `VITE_MARKET_API_BASE`. Leave it empty and they keep today's direct Asia market host, including the Pages fallback. Set it to a proxy origin and every price, history, and order request goes there instead.

## Local stub

```bash
npm run stub
```

That serves `scripts/__fixtures__/market/` on `http://127.0.0.1:8787` for `/stats/prices/`, `/stats/history/`, and `/stats/orders/`. It does not call the live provider.

Point the app at it:

```bash
VITE_MARKET_API_BASE=http://127.0.0.1:8787 npm run dev
```

## Cloudflare Worker

`workers/market-proxy` forwards those three routes to the Asia data host, retries a 429 four times, and caches responses for 60 seconds. Deploy it yourself from that directory:

```bash
npx wrangler deploy
```

Then set `VITE_MARKET_API_BASE` to the worker origin for both the Vercel build and the Pages build. This repo does not deploy the worker.

## What's New

To update the website's What's New section, simply use a clear, descriptive commit message (e.g., "Fix instant-sale profit and enchant materials"). The automated workflow will turn it into a changelog entry.

A push to `main` runs `scripts/update-changelog.mjs`, which writes the latest commit to the top of `public/changelog.json` and pushes `chore: auto-update changelog`. That commit skips itself, so it does not loop, and it starts the Pages deploy. A message that starts with `chore:` is ignored. Commas in the message become separate bullets.
