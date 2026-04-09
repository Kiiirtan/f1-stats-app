# F1 Stats — Must Changes Before & After Launch

> **Last Updated:** 2026-04-04
> **Status:** Pre-Launch Audit

---

## 🔴 CRITICAL — Fix Before Pushing to GitHub

### 1. `.env` File Exposed in Git
Your Supabase URL and anon key are in a plain `.env` file. If this repo goes public, anyone can access your database.

**Action:**
- [ ] Add `.env` to `.gitignore` immediately
- [ ] Run `git rm --cached .env` to untrack it
- [ ] Rotate your Supabase anon key from the Supabase dashboard
- [ ] Use environment variables on your hosting platform (Render/Vercel) instead

---

### 2. No Row Level Security (RLS) on Supabase
Your `api_cache` table is fully accessible with the anon key. Anyone with the key can read, overwrite, or delete every cached row.

**Action:**
- [ ] Enable RLS on the `api_cache` table
- [ ] Create a policy: allow `SELECT` for anon, restrict `INSERT/UPDATE` to service role or authenticated users
- [ ] Test that the app still reads cache correctly after RLS is on

---

### 3. Delete Temp/Debug Files from Root
These files are sitting in your project root and will end up in your repo:
- `search1.txt`
- `search2.txt`  
- `tmp_silverstone_debug.js`
- `tsc.txt`
- `test_errors.txt`
- `PRE_LAUNCH_TODO.md` (if completed)

**Action:**
- [ ] Delete all of the above
- [ ] Add `*.txt` and `tmp_*` patterns to `.gitignore`

---

### 4. Fix Cadillac Team Logo 404
The Cadillac constructor logo URL in `src/data/constructorDetails.ts` returns a 404. Every page rendering team logos triggers a broken request in the console.

**Action:**
- [ ] Replace with a valid Cadillac F1 logo URL or a local fallback asset

---

### 5. Remove or Implement Archive Filter Buttons
The "DECADE", "DRIVER", and "TEAM" buttons on `src/pages/Archives.tsx` render but do nothing on click. Fake interactive elements are worse than no elements.

**Action (pick one):**
- [ ] **Remove them** — delete the button markup entirely
- [ ] **Implement them** — wire up filtering logic against the `HISTORICAL_SEASONS` array

---

## 🟡 SIGNIFICANT — Fix Post-Launch (Will Bite You)

### 6. Hardcoded Season Data Goes Stale
- `CONSTRUCTOR_META` in `api.ts` has hardcoded championship counts, podium totals, and team principals frozen at end-of-2025
- Archives page has a static `HISTORICAL_SEASONS` array
- DriverProfile hardcodes "2026" in the hero section

**Impact:** When the 2027 season starts, half your stats silently go stale.

**Action:**
- [ ] Document which data is hardcoded vs. dynamic
- [ ] Create a seasonal update checklist
- [ ] Long-term: derive stats from API instead of hardcoding

---

### 7. News Feed Has No Fallback
Single dependency on `api.rss2json.com` + `motorsport.com` RSS. If either breaks, News page shows "FEED UNAVAILABLE" with no cached articles.

**Action:**
- [ ] Cache the last successful news response in Supabase
- [ ] Show stale articles with a "last updated X hours ago" notice instead of a blank error screen

---

### 8. Wikipedia HTML Scraping is Fragile
`CircuitProfile.tsx` uses regex to parse Wikipedia HTML for circuit length, turns, and lap records. Wikipedia changes markup frequently.

**Action:**
- [ ] Add a `try/catch` around the parser (already exists but verify)
- [ ] Show "Data unavailable" instead of blank when parsing fails
- [ ] Long-term: hardcode top-20 circuit stats or use a more stable data source

---

### 9. No API Rate Limiting / Request Queuing
Driver profile pages fire 15+ parallel API calls. Multiply by concurrent users and Jolpica will throttle you.

**Action:**
- [ ] Implement a request queue with concurrency limit (max 3-5 parallel)
- [ ] Or adopt React Query which has built-in request deduplication

---

### 10. No SEO — Pure Client-Side SPA
React Router client-side rendering means search engines see an empty `<div id="root">`. Only 2 pages use `useDocumentMeta`. No sitemap, no structured data.

**Action:**
- [ ] Add `useDocumentMeta` to every page
- [ ] Generate a static `sitemap.xml`
- [ ] Long-term: consider SSR (Next.js) or pre-rendering if SEO matters

---

## 🟠 ARCHITECTURE DEBT — Address Before Adding Features

### 11. `api.ts` is a 1090-Line God File
Types, colors, flags, metadata, fetch logic, and transformers all in one file. Any change risks breaking unrelated features.

**Action:**
- [ ] Split into: `types.ts`, `constants.ts`, `fetchers.ts`, `transformers.ts`

---

### 12. No Global State Management
Every page independently fetches data. Dashboard → Drivers → Dashboard = 6 redundant API calls. No React Query, SWR, or global store.

**Action:**
- [ ] Adopt React Query (TanStack Query) for data fetching
- [ ] Eliminates duplicate fetches, gives loading/error/stale states for free

---

### 13. Zero Tests
No unit tests, integration tests, or e2e tests. Every deploy is a gamble.

**Action:**
- [ ] Add Vitest for unit tests (data transformers are easy wins)
- [ ] Add Playwright for critical user flows (Dashboard load, Driver profile)

---

### 14. `any` Types in API Layer
`StandingsLists: any[]` appears in multiple API response types. TypeScript's safety net has holes exactly where runtime crashes happen.

**Action:**
- [ ] Replace every `any` with proper typed interfaces
- [ ] Enable `noImplicitAny` in `tsconfig.json`

---

### 15. Silent Data Loss on Sub-Section Failures
If `fetchDriverCareerStats` fails, the career section silently disappears. User can't tell if data is loading, failed, or doesn't exist.

**Action:**
- [ ] Show inline error/retry UI for failed sub-sections instead of hiding them

---

## 🔵 FUTURE — If You Want This to Be a Real Product

| Area | Issue | Effort |
|------|-------|--------|
| **Mobile** | Untested on small screens; glassmorphism + complex grids likely break | Medium |
| **Offline/PWA** | No service worker; sports apps need offline support for live events | High |
| **Auth** | Settings are localStorage-only; no user accounts, favorites, or sync | High |
| **Monitoring** | No Sentry, no analytics; zero visibility into production errors | Low |
| **Accessibility** | No ARIA labels, no keyboard nav, no reduced-motion, no focus management | Medium |
| **i18n** | English-only; F1 has a global audience | High |
| **Dark/Light Toggle** | Settings has `theme: 'dark' | 'light'` but only dark mode works | Low |

---

## Priority Execution Order

```
BEFORE NEXT GIT PUSH (30 minutes):
  1. .gitignore + rotate Supabase keys
  2. Enable RLS on Supabase
  3. Delete temp files
  4. Fix Cadillac logo
  5. Remove fake Archive filter buttons

FIRST WEEK POST-LAUNCH:
  6. Cache news in Supabase
  7. Add useDocumentMeta to all pages
  8. Request queue / concurrency limit

BEFORE ADDING NEW FEATURES:
  9. Split api.ts
  10. Adopt React Query
  11. Add basic tests
  12. Remove all `any` types
```
