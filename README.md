# Ckflix — Movies & TV

**▶ Live:** <https://tresorkundwa.github.io/movies-app/>

A free movie/TV streaming web app built with React + Vite. Movie data comes from
the TMDB API; accounts, favorites, comments and the newsletter run on a free
[Supabase](https://supabase.com) backend. The site is deployed for free to
**GitHub Pages** automatically on every push.

## Stack

- **Frontend:** React 19 + Vite (static — hostable anywhere for free)
- **Movie data:** TMDB public API (browser calls)
- **Backend:** Supabase (free Postgres + Auth + Row Level Security)
- **Hosting:** GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev
```

## One-time setup: Supabase (free)

1. Sign up at <https://supabase.com> and create a new project (Free plan).
2. In the left menu go to **SQL Editor**, open a new query, paste the entire
   contents of `supabase/schema.sql`, and click **Run**. This creates the
   tables and security rules.
3. Go to **Authentication → Providers → Email** and turn **OFF** "Confirm email"
   so new sign-ups work instantly (or leave it on — users will just need to
   click a confirmation link once).
4. Go to **Project Settings → API** and copy the **Project URL** and the public
   **anon key**. Paste them into the `.env` file:

   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   (The anon key is public by design — it's safe to commit.)

## Deploying to Vercel (free, recommended if `github.io` is blocked)

The site is a Vite + React SPA, so Vercel auto-detects everything. A
`vercel.json` is included so client-side routes fall back to `index.html`.

**Easiest (no terminal):** go to <https://vercel.com> → **Add New → Project** →
import the `tresorkundwa/movies-app` GitHub repo → click **Deploy**. Vercel
auto-uses `npm run build` and output dir `dist`.

**Or with the CLI** (run in this folder):
```bash
npx vercel login     # opens browser to authenticate
npx vercel --prod     # builds + deploys
```
Your live URL will be something like `https://movies-app-xxxx.vercel.app`.

## Deploying to GitHub Pages (free)

1. Create a free account at <https://github.com> and create a new empty repo
   (do NOT check "Add a README").
2. From your PC, connect this folder to the repo:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

3. In the repo on GitHub, go to **Settings → Pages**. Under **Build and
   deployment**, set **Source** to **GitHub Actions** (the included workflow
   builds and deploys automatically — no config needed).
4. Every time you `git push`, the site rebuilds itself. Your live URL is
   `https://your-username.github.io/your-repo/`.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # build for production into dist/
npm run preview  # preview the production build locally
npm run lint     # run oxlint
```
