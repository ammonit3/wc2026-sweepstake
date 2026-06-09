# ⚽ WC2026 Arcane Sweepstake

Six players, 48 teams, one absurdly over-engineered World Cup sweepstake. Live scores, ranking-weighted upset bonuses, and a £120 pot paid out by final position (£50/35/20/10/5/0), projected live.

## Players & draft
Teams were allocated by a **tiered snake draft** seeded by FIFA ranking (10 Jun 2026): the 48 teams were split into 8 tiers of 6 by rank, and each player drew one team per tier in snake order (Chris→…→Alex, then reverse). Everyone ended up with an even spread of giants and minnows (average team-rank 31–34 across all six). The full allocation lives in `lib/data.js`.

## How it works
- `app/api/matches/route.js` calls **football-data.org** server-side (your key never reaches the browser) and normalises the feed. If no key is set or the feed is down, it falls back to the bundled `data/matches.seed.json` fixtures.
- `lib/scoring.js` is the whole brain — a pure function turning matches + FIFA ranks into points, trophies and the pot split. Every rule is on the **Rules** page (rendered straight from the same config, so they can't drift apart).
- Pages auto-refresh every 60s.

## Local dev
```bash
npm install
npm run dev        # http://localhost:3000
```
Without an API key you'll see the scheduled fixtures and a £0 projection — that's expected until results come in.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: **New Project → import the repo** (it auto-detects Next.js).
3. Add one **Environment Variable**:
   - `FOOTBALL_DATA_API_KEY` = your free key from <https://www.football-data.org/client/register>
   (World Cup is included in football-data.org's free tier; the free tier allows ~10 requests/min, and this app caches for 30s so you'll never hit the limit.)
4. Deploy. Done — share the URL with the lads.

> No key yet? It still deploys and shows fixtures. Add the key any time and live scores light up on the next refresh.

## Tuning the rules
Every number — base points, the upset multipliers `K`, stage values, trophy bonuses — lives in `CFG` at the top of `lib/scoring.js`. Change a value, redeploy, and both the engine and the Rules page update together.

## Adjusting the draft
Edit the allocation object in `lib/data.js` (and the `TEAMS[...].owner` fields stay in sync automatically since they're generated from it — re-run the generator or edit by hand).
