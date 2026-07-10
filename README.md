# Notebook

A cozy little diary app styled like a leather-bound notebook. Every day gets
three lines — "write 3 beautiful things everyday" — plus a calendar to see
which days you've written, and cloud sync (PIN-protected) so your phone and
computer see the same entries.

Built with React, Vite, Tailwind CSS, and Vercel Serverless Functions + Redis.

## Deploy your own copy

Click the button below to deploy your own private instance to Vercel. It's
free on Vercel's Hobby plan.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGiaguo528%2Fnotebook&env=DIARY_PIN&envDescription=A%20passcode%20of%20your%20choice%20to%20lock%20your%20diary&project-name=my-notebook&repository-name=my-notebook)

After it deploys, you need one more manual step (Vercel doesn't let a deploy
button auto-provision a database yet):

1. Open your new project on [vercel.com](https://vercel.com) → **Storage** tab
2. Add the **Upstash for Redis** (or any Redis-compatible KV) integration and
   connect it to the project — this sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`
   for you automatically
3. Go to **Settings → Environment Variables** and confirm `DIARY_PIN` is set
   to whatever passcode you want
4. Redeploy (Deployments tab → ⋯ → Redeploy) so the new env vars take effect

Then open your deployment URL, enter your PIN, and start writing. On iPhone,
open it in Safari → Share → **Add to Home Screen** for an app-like icon.

## Configuration

| Env var | Required | Description |
| --- | --- | --- |
| `DIARY_PIN` | yes | The passcode that unlocks your diary. Anyone with this PIN can read/write your entries, so keep it private. |
| `VITE_DIARY_NAME` | no | The name shown on the cover ("Hello, `<name>`!"). Defaults to "Friend". |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | yes | Set automatically when you connect a Redis store. |

Each deployment is fully independent — your own Redis database, your own PIN,
your own data. Nothing is shared between different people's deployments.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DIARY_PIN and a Redis store's credentials
npm run dev                  # frontend only, http://localhost:5173
vercel dev                   # frontend + /api routes together
```

## How it works

- `src/` — the React app (cover, diary page, calendar, color picker)
- `api/` — Vercel serverless functions:
  - `auth.js` checks the PIN and sets an httpOnly session cookie
  - `entries.js` reads/writes your diary entries as one JSON blob in Redis,
    gated behind that cookie
- Typing autosaves to the cloud ~0.5s after you stop, no save button needed

## License

MIT — see [LICENSE](./LICENSE).
