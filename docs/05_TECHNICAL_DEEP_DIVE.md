# F1 Stats — Technical Deep-Dive

| Field | Detail |
|---|---|
| **Document Version** | 5.0 |
| **Date** | April 11, 2026 |
| **Project** | F1 Stats |

---

## 1. What Is F1 Stats?

F1 Stats is a client-side web application that displays real-time Formula 1 data in an **immersive, interactive, dark-themed interface**. It pulls live data from the **Jolpica F1 API** with a **Supabase database fallback** for zero-downtime resilience, provides **real user authentication via Supabase Auth**, and presents data across 20+ pages with **3D motion, parallax scrolling, cursor-interactive effects, and scroll-triggered reveals**.

**In one sentence**: A premium animated F1 dashboard built with React + TypeScript featuring 3D tilt cards, parallax hero, cursor glow, scroll reveals, zero-downtime data architecture, Supabase Auth, and full driver/constructor/circuit analytics — powered by live API data with Supabase database fallback.

---

## 2. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 18 | Component model, hooks, ecosystem |
| Language | TypeScript | Type safety across the entire codebase |
| Build Tool | Vite 5 | Fast dev server with HMR, optimized production builds |
| Styling | Tailwind CSS 3 | Utility-first CSS with Material Design 3 tokens |
| Routing | React Router v7 | Client-side routing with URL params |
| Database | Supabase (PostgreSQL) | Persistent API cache for zero-downtime fallback |
| Authentication | Supabase Auth | Real email/password auth with session management |
| CI/CD | GitHub Actions | Automated CRON sync to Supabase every 30 min |
| Icons | Material Symbols (Google Fonts) | Consistent icon set via CDN |
| Typography | Space Grotesk + Inter (Google Fonts) | Modern, sporty headline + clean body text |
| Testing | Vitest | Fast, Vite-native test runner |
| Data Source | Jolpica F1 API | Free, open-source F1 data (Ergast successor) |
| News Feed | RSS2JSON | Motorsport.com RSS proxy |
| Hosting | Render | Static site hosting (Free tier) |

---

## 3. Architecture

### 3.1 High-Level Flow

```
User opens browser
    │
    ▼
SmoothLoader (F1-themed splash screen)
    │
    ▼
App.tsx renders:
  ├── AuthProvider (Supabase Auth context — sessions, sign-up/in/out)
  ├── SettingsProvider (settings context — theme, accent, animations)
  ├── ErrorBoundary (catches render errors)
  ├── SmoothLoader (loading splash)
  ├── CursorGlow (global mouse-following glow)
  ├── BrowserRouter (client-side routing)
  │   ├── InitialRedirect (redirects to user's default page)
  │   ├── Layout (TopNavBar + SideNavBar wrapper)
  │   │   └── PageTransition (fade/slide wrapper)
  │   │       └── Routes
  │   │           ├── /                          → Dashboard (parallax hero)
  │   │           ├── /news                      → News (live RSS feed)
  │   │           ├── /drivers                   → Drivers (staggered reveals)
  │   │           ├── /driver/:id                → DriverProfile (career stats)
  │   │           ├── /calendar                  → SeasonCalendar (session times)
  │   │           ├── /circuits                  → Circuits (all circuits)
  │   │           ├── /circuit/:id               → CircuitProfile (race history)
  │   │           ├── /races                     → Races (hover-lift cards)
  │   │           ├── /results                   → Results (shimmer skeletons)
  │   │           ├── /constructors              → Constructors (slide reveals)
  │   │           ├── /constructor/:id           → ConstructorProfile (career stats)
  │   │           ├── /constructor/:id/season/:yr → ConstructorSeasonDetails
  │   │           ├── /settings                  → Settings (theme/accent/prefs)
  │   │           ├── /contact                   → Contact (form + social)
  │   │           ├── /credits                   → Credits (attributions)
  │   │           ├── /privacy                   → Privacy Policy
  │   │           ├── /terms                     → Terms of Service
  │   │           ├── /cookies                   → Cookie Policy
  │   │           └── *                          → NotFound (404)
```

### 3.2 Data Flow (per page)

```
Page mounts (useEffect)
    │
    ▼
Calls API functions (e.g. fetchDriverStandings)
    │
    ▼
fetchWithCache checks in-memory cache
    │
    ├── Cache HIT (< 5 min old) → return cached data
    │
    └── Cache MISS → fetch from Jolpica API
        │
        ├── Success → store in cache + sync to Supabase (fire-and-forget) → return data
        │
        └── Failure → retry (up to 3 times, exponential backoff)
            │
            ├── Retry succeeds → store in cache + sync to Supabase → return data
            │
            └── All retries fail
                │
                ├── Stale in-memory cache exists → return stale data
                │
                ├── Supabase DB has data → populate cache + return
                │
                └── No data anywhere → throw error → page shows error banner
```

### 3.3 GitHub Actions CRON Sync

```
Every 30 minutes (and on manual trigger):
    │
    ▼
GitHub Actions runs sync_f1_data.yml
    │
    ▼
Executes scripts/sync-to-supabase.mjs
    │
    ▼
Fetches all key Jolpica endpoints
    │
    ▼
Upserts JSON payloads into Supabase api_cache table
    │
    ▼
Next time a user visits with Jolpica down →
    Supabase has fresh data (< 30 min old)
```

---

## 4. Design System

### 4.1 Color Palette (Material Design 3 — Dark Theme)

| Token | Hex | Usage |
|---|---|---|
| `background` / `surface` | `#13131B` | Page background, base surfaces |
| `surface-container` | `#1F1F28` | Cards, elevated surfaces |
| `surface-container-high` | `#292933` | Higher-elevation containers |
| `primary-container` | `#E10600` | Primary accent — F1 Red |
| `on-surface` | `#E4E1EE` | Body text |
| `on-background` | `#E4E1EE` | Heading text |
| `primary` | `#FFB4A8` | Primary text/icon color |
| `tertiary-container` | `#0163FF` | Blue accent elements |
| `outline` | `#AF8781` | Borders and dividers |
| `c-10` | `#66FCF1` | Legacy cyan accent |
| `--theme-accent` | Dynamic | User-configurable accent color |

### 4.2 Typography

| Font | Usage | Weight |
|---|---|---|
| Space Grotesk | Headlines, labels, navigation | 400–900 |
| Inter | Body text, paragraphs, form inputs | 300–700 |

### 4.3 Display Font Sizes

| Size | Rem | Usage |
|---|---|---|
| `display` | 5rem | Hero headlines |
| `display-lg` | 7rem | Large hero text |
| `display-xl` | 9rem | Extra-large decorative text |

### 4.4 Animations & Effects

| Animation | CSS Class | Duration | Purpose |
|---|---|---|---|
| Search pop-in | `animate-search-in` | 200ms | Modal entrance |
| Page fade-in | `animate-page-in` | 400ms | Route transitions |
| Card entrance | `animate-card-in` | 500ms | Staggered card load |
| Hover lift | `hover-lift` | 300ms | Card lift + shadow on hover |
| Glass effect | `bg-glass` | — | Backdrop blur for glass morphism |
| Text glow | `text-glow` | — | Red text shadow glow |
| Custom scrollbar | — | — | Accent-colored thin scrollbar |

---

## 5. Module-by-Module Breakdown

### 5.1 Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useCountUp` | Animated number counter with ease-out cubic easing — scroll-triggered via IntersectionObserver |
| `useDrivers` | Encapsulates fetching and caching of driver standings data |
| `useMousePosition` | Tracks cursor X/Y (raw px + normalized 0-1) — feeds CursorGlow and TiltCard |
| `useInView` | Intersection Observer — triggers when element enters viewport — feeds ScrollReveal |

### 5.2 Interactive UI Components (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `CursorGlow` | Global cyan radial gradient orb following the mouse (hidden on mobile) |
| `TiltCard` | Wraps children in 3D perspective tilt on hover with specular shine overlay |
| `ScrollReveal` | Fade + slide entrance when children scroll into viewport. Supports direction, delay, duration |
| `SmoothLoader` | Full-screen F1-themed splash with car emoji racing across progress bar, fades out on complete |
| `DataState` | Unified component for loading spinners, error messages, and empty states |
| `ErrorBoundary` | Catches React render errors with full-page recovery |
| `PageTransition` | Fade + slide wrapper on route change |
| `SkeletonCard` | Shimmer loading placeholder card |
| `Tooltip` | Hover tooltip with positioning |

### 5.3 Feature Components (`src/components/features/`)

| Component | Purpose |
|---|---|
| `DriverCard` | TiltCard-wrapped driver card with shimmer overlay, team-color glow bar, scale micro-interactions |
| `LoginModal` | Login/Register form with toggle |
| `MobileMenu` | Slide-out nav drawer for mobile |
| `SearchModal` | Full-screen search — filters drivers + races in real-time |
| `TelemetryVisualizer` | Telemetry data visualization component |

### 5.4 Layout Components (`src/components/layout/`)

| Component | Purpose |
|---|---|
| `Layout` | Main wrapper — renders TopNavBar + SideNavBar + content area |
| `TopNavBar` | Fixed horizontal navigation with branding, search trigger, and user actions |
| `SideNavBar` | Vertical navigation sidebar for desktop |
| `Footer` | Brand, links, copyright, legal disclaimer |

### 5.5 API Layer (`src/data/api.ts`)

**API functions (1086 lines)**:

| Function | Endpoint | Returns |
|---|---|---|
| `fetchDriverStandings()` | `/current/driverStandings.json` | `Driver[]` |
| `fetchRaceCalendar()` | `/current.json` | `Race[]` |
| `fetchRaceResults()` | `/current/results.json?limit=600` | `Race[]` (with results) |
| `fetchConstructorStandings()` | `/current/constructorStandings.json` | `ConstructorStanding[]` |
| `fetchCurrentSeason()` | `/current.json` | `string` (e.g. "2026") |
| `fetchCompletedRoundCount()` | `/current/driverStandings.json` | `number` |
| `fetchDriverCareerStats(id)` | Multiple per-season endpoints | `DriverCareerStats` |
| `fetchConstructorProfile(id)` | Multiple endpoints (standings, seasons, wins) | `ConstructorProfileData` |
| `fetchConstructorSeasonDetails(id, yr)` | `/{year}/constructors/{id}/...` | `ConstructorSeasonDetailsData` |
| `fetchLiveNews()` | RSS2JSON proxy → Motorsport.com | `NewsItem[]` |
| `fetchAllCircuits()` | `/circuits.json` | `CircuitInfo[]` |
| `fetchCircuitRaceHistory(id)` | `/circuits/{id}/results/{1,2,3}.json` | `CircuitDetail` |
| `fetchSeasonCalendarDetailed()` | `/current.json` + `/current/results.json` | `DetailedCalendarRace[]` |
| `getNationalityFlag(nat)` | — (lookup) | Flag emoji |
| `getCountryFlag(country)` | — (lookup) | Flag emoji |

### 5.6 Supabase Integration (`src/lib/supabase.ts`)

| Function | Purpose |
|---|---|
| `supabase` | Supabase client (null if env vars missing) |
| `syncToSupabase(endpoint, data)` | Fire-and-forget upsert to `api_cache` table |
| `fetchFromSupabase<T>(endpoint)` | Retrieve cached JSON from Supabase |

### 5.7 Context Providers

| Context | Purpose |
|---|---|
| `SettingsContext` | Theme (dark/light), accent color, animation toggle, data density, auto-refresh, units, default page |
| `AuthContext` | Supabase Auth — email/password sign-up/sign-in, session management, profile updates, auto-login on registration |

### 5.8 Pages (20 total)

| Page | Key Features |
|---|---|
| Dashboard | Multi-layer parallax hero, speed lines, floating F1 car, text reveals, scroll-reveal sections, hover-lift stats |
| News | Live Motorsport.com RSS, featured article, masonry grid, fallback images |
| Drivers | Staggered scroll-reveal (60ms per card), TiltCard wrapping |
| DriverProfile | Career stats (championships, wins, poles), season-by-season history table, parallax glow orbs |
| SeasonCalendar | Session schedule (FP1/Quali/Sprint/Race), podium results, countdown timer |
| Circuits | Full circuit browser with search/filter, country flags |
| CircuitProfile | Race history, podium records, track specifications (from Wikipedia), track diagrams |
| Races | Hover-lift/glow completed cards, flag scale, glowing accent bars, staggered upcoming cards |
| Results | Shimmer skeletons, btn-ripple tabs, active tab glow, hover-glow table |
| Constructors | Slide-from-left scroll reveals, position scale animation, hover-glow |
| ConstructorProfile | Career stats (championships, wins, podiums, poles), season history chart, current + previous season |
| ConstructorSeasonDetails | Historical deep-dive with exact driver points and positions |
| Settings | Theme toggle, accent picker, animation switch, density selector, units, refresh interval, defaults |
| Contact | Contact form with social links |
| Credits | Attributions & legal |
| Privacy | Privacy Policy |
| Terms | Terms of Service |
| Cookies | Cookie Policy |
| NotFound | Giant "404" watermark, "OFF TRACK" heading, CTA buttons |

---

## 6. Routing

| Path | Page | Dynamic? |
|---|---|---|
| `/` | Dashboard | No |
| `/news` | Live RSS News Feed | No |
| `/drivers` | All Drivers | No |
| `/driver/:id` | Driver Profile | Yes (`:id` from API) |
| `/calendar` | Season Calendar | No |
| `/circuits` | All Circuits | No |
| `/circuit/:id` | Circuit Profile | Yes (`:id` from API) |
| `/races` | Race Calendar | No |
| `/results` | Race Results | No (uses `?race=` query) |
| `/constructors` | Constructor Standings | No |
| `/constructor/:id` | Constructor Profile | Yes (`:id` from API) |
| `/constructor/:id/season/:year` | Historical Season DB | Yes (Dual params) |
| `/settings` | User Settings | No |
| `/contact` | Contact Form | No |
| `/credits` | Attributions & Legal | No |
| `/privacy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `/cookies` | Cookie Policy | No |
| `*` | 404 Not Found | Catch-all |

---

## 7. Caching Strategy

```
Request URL → check in-memory Map
    │
    ├── Found + age < 5 min → return cached (instant)
    │
    └── Not found OR stale → fetch from API
        │
        ├── Success → update cache + sync to Supabase (fire-and-forget) → return
        │
        └── Failure (after 3 retries)
            │
            ├── Stale in-memory entry exists → return stale (degraded)
            │
            ├── Supabase has data → populate cache + return
            │
            └── No data → throw error
```

Cache is **per-URL, in-memory** — resets on page refresh. Supabase provides persistent backup.

---

## 8. Error Handling

| Level | Mechanism | User Experience |
|---|---|---|
| Network failure | Retry (3x) + stale cache + Supabase fallback | Fresh or slightly stale data |
| API error | Try-catch in `useEffect` + DataState component | Inline error banner |
| Component crash | `ErrorBoundary` | Full-page error with "RELOAD" button |
| Unknown route | `<Route path="*">` | 404 "OFF TRACK" page |
| Supabase unavailable | Gracefully ignored (non-blocking) | Falls through to error if no cache |

---

## 9. Testing

**Framework**: Vitest (jsdom environment)

| Test Suite (describe block) | Tests | What It Verifies |
|---|---|---|
| `fetchDriverStandings` | 1 | Raw API → typed `Driver[]` |
| `fetchRaceCalendar` | 1 | Raw API → typed `Race[]` with flags |
| `fetchRaceResults` | 1 | Raw API → `Race[]` with nested `RaceResult[]` |
| `fetchConstructorStandings` | 1 | Raw API → `ConstructorStanding[]` |
| `fetchCurrentSeason` | 1 | Extracts season string |
| `fetchCompletedRoundCount` | 1 | Extracts round number |
| `getNationalityFlag` | 2 | Known → correct emoji; unknown → 🏁 |
| **Total** | **8** | **7 describe blocks, 8 individual tests** |

**Run tests**: `npm test`
