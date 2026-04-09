# F1 Stats — Restart Manual

> Quick reference for getting the app running after a reboot, fresh clone, or any downtime.

---

## After Laptop Restart

```bash
# Open terminal, navigate to project
cd C:\Users\VICTUS\Projects\demo

# Start the dev server
npm run dev
```

App will be live at **http://localhost:3000** — that's it!

---

## After a Fresh Clone

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd demo

# 2. Install dependencies
npm install

# 3. (Optional) Configure Supabase fallback
# Create a .env file with:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Start dev server
npm run dev
```

---

## All Available Commands

| Command | What It Does |
|---|---|
| `npm run dev` | Starts dev server at `localhost:3000` with hot reload |
| `npm run build` | Creates optimized production bundle in `dist/` |
| `npm run preview` | Serves the production build locally for testing |
| `npm test` | Runs the API unit tests |
| `npx tsc --noEmit` | TypeScript type-check without building |

---

## No Backend Required

This app has **zero mandatory backend dependencies**:
- No database to start (Supabase is optional fallback)
- No Docker containers to run
- No API keys needed for core functionality
- No backend server to maintain

All data is fetched from the **Jolpica F1 public API** (`api.jolpi.ca`).

### Optional: Supabase Fallback
If you want zero-downtime data resilience:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create an `api_cache` table with columns: `endpoint` (text, unique), `data` (jsonb), `updated_at` (timestamptz)
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
4. The app will automatically sync data and fall back to Supabase when the API is down

### Optional: GitHub Actions Data Sync
The `.github/workflows/sync_f1_data.yml` CRON job keeps Supabase data fresh:
- Runs every 30 minutes automatically
- Requires `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` as GitHub Secrets
- Can also be triggered manually from the GitHub Actions tab

---

## What You'll See

1. **SmoothLoader** — F1-themed splash screen appears for ~2 seconds
2. **CursorGlow** — Subtle glow follows your mouse on desktop
3. **TopNavBar + SideNavBar** — Navigation with branding and quick links
4. **Parallax Hero** — Dashboard hero with floating car and speed lines
5. **Scroll Reveals** — Sections animate in as you scroll down

---

## Key Pages to Visit

| Route | What You'll See |
|---|---|
| `/` | Dashboard with hero, top drivers, recent results, stats |
| `/news` | Live Motorsport.com news feed |
| `/drivers` | All driver cards with team colors |
| `/driver/verstappen` | Max Verstappen's full career stats |
| `/calendar` | Full season schedule with session times |
| `/circuits` | All F1 circuits encyclopedia |
| `/constructors` | Constructor standings with progress bars |
| `/constructor/ferrari` | Ferrari's complete profile and history |
| `/settings` | Theme, accent color, and preferences |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` fails | Run `npm install` first to restore dependencies |
| Port 3000 in use | Kill the process or Vite auto-picks next available port |
| Blank page / no data | Check internet — app needs network access for the API |
| Old data showing | Hard refresh (`Ctrl+Shift+R`) to clear in-memory cache |
| `node` not found | Install Node.js 18+ from [nodejs.org](https://nodejs.org) |
| Animations janky | Check hardware acceleration is enabled in browser settings |
| Supabase not connecting | Verify `.env` variables or run without (fully optional) |
| Theme not changing | Check Settings page → Theme dropdown. Clear localStorage if stuck |
