# CKFLIX — Project Status (updated Aug 14, 2026)

## What this project is
A React movie streaming site ("CKFLIX"). Frontend only + Supabase (free backend) for auth, favorites, comments, newsletter subscribers, and an admin panel.

## Where we are
- Supabase project is CONNECTED and working.
  - Project URL: `https://spalwnkhwvkpiorecwwz.supabase.co`
  - `.env` already filled with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (do NOT share/commit).
- `supabase/schema.sql` has been RUN successfully in the SQL Editor (tables: profiles, subscribers, comments, favorites, classics; RLS policies; is_admin() + increment_play() functions).
- "Confirm email" was turned OFF (via SQL on `auth.config`) so signups get an instant session. A Node probe confirmed `signUp` returns a session.
- Admin panel code is fully built: `src/components/AdminPanel.jsx`, wired in `App.jsx`, Admin button in `Header.jsx`, admin methods in `src/api.js` (subscribers, deleteComment, profile).
- Build + lint pass (`npm run build`, `npm run lint`).

## Blocker / what's left
1. No user account exists yet in Supabase (`auth.users` is empty — verified). The owner still needs to register on the site.
   - Open http://localhost:5173 (dev server) → Login → click the **"Sign Up"** TAB (labeled "Sign Up", NOT "Register") → fill Full Name / Email / Password → submit → expect the green "Welcome, ...!" toast.
   - User was getting "Invalid email or password" because they were on the **Login** tab, not Sign Up.
2. After signing up, run in SQL Editor to make owner admin (replace the email):
   ```sql
   UPDATE public.profiles SET is_admin = true WHERE email = 'barackdylan15@gmail.com';
   ```
3. Then log out / log in on the site → the 🛡️ Admin button appears → test Admin Panel (subscribers list + comment delete).

## Notes / gotchas
- User prefers pasting via Notepad drop-files (terminal Ctrl+V doesn't work for them). Pattern: write a temp file in `C:\Users\USER\AppData\Local\Temp\opencode\`, open it with `Start-Process notepad -ArgumentList "<path>"`, have them Ctrl+S, then read it.
- There are two junk 495KB "Standard ACE DB" files in `supabase/` (accidental saves) that can be deleted; user hasn't confirmed deletion yet.
- `auth.config` may not be queryable via information_schema in this Supabase version — use behavior probes (signUp test) instead of config queries.
- The site's Sign Up tab label is "Sign Up" — give explicit tab guidance to this user.
- Registration flow in `api.js`: register() calls ensureProfile() then returns `{ id, name, email, isAdmin }`. Login also upserts profile. Admin flag comes from the `profiles.is_admin` column.
