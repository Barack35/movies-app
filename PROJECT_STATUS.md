# CKFLIX — Project Status (updated Aug 28, 2026)

## What this project is
A React movie streaming site ("CKFLIX"). Frontend only + Supabase (free backend) for auth, favorites, comments, newsletter subscribers, and an admin panel.

## Where we are — LAUNCHED
- **Live in production:** `https://barack35.github.io/movies-app/` (GitHub Pages, HTTPS, auto-deploys on every push to `main`).
- **Supabase connected and working.** Project URL `https://spalwnkhwvkpiorecwwz.supabase.co`. Schema in `supabase/schema.sql` has been run (profiles, subscribers, comments, favorites, classics; RLS; `is_admin()` + `increment_play()`). "Confirm email" is OFF so signups get an instant session.
- **Real auth restored.** `src/components/AuthModal.jsx` now calls `api.login` / `api.register` (Supabase). It had been replaced with a fake guest-only login, which meant nobody could actually create an account — that was the launch blocker and is fixed.
- **PWA added.** `public/manifest.webmanifest` + `public/sw.js` + installable meta tags — the site is now installable to home screens and has a basic offline app-shell.
- **Guest UX fixed.** Guests are now prompted to sign in when they try to favorite or comment (previously they silently failed against Supabase RLS).
- Build + lint pass (`npm run build`, `npm run lint`).

## Still to do (one manual step — owner only)
The site works, but no **real admin** account exists yet. To unlock the 🛡️ Admin Panel for yourself:
1. Open the live site → **Login** → click the **"Sign Up"** TAB (labeled "Sign Up", NOT "Login") → Full Name / Email / Password → submit → expect the green "Welcome, ...!" toast.
2. In **Supabase Dashboard → SQL Editor**, run (replace the email):
   ```sql
   UPDATE public.profiles SET is_admin = true WHERE email = 'barackdylan15@gmail.com';
   ```
3. Log out / log in again on the site → the 🛡️ Admin button appears → test Admin Panel (subscribers list + comment delete).

## Notes / gotchas
- `.env` is committed so the GitHub Pages build has the Supabase URL + anon key. The **anon key is public by design** (safe to commit); never put a real service_role/secret key in the repo.
- Supabase *anonymous* visitors can watch movies via embed sources (VidSrc/VidFast/VidLink/etc.) or Archive.org, but **favorites and comments require a signed-in account** (by design, RLS-enforced).
- Movie playback depends on third-party embed sites and may break if those sites go down; the player offers multiple sources + Archive.org fallback.
- Two accidental 495KB "Standard ACE DB" files in `supabase/` were deleted.
