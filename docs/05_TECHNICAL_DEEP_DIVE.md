# F1 PRECISION — Technical Deep-Dive

| Field | Detail |
|---|---|
| **Document Version** | 2.0 |
| **Date** | March 25, 2026 |
| **Project** | F1 PRECISION |

---

## 1. What Is F1 PRECISION?

F1 PRECISION is a client-side web application that displays real-time Formula 1 data in an **immersive, interactive, dark-themed interface**. It pulls live data from the **Jolpica F1 API** and presents it across 7 pages with **3D motion, parallax scrolling, cursor-interactive effects, and scroll-triggered reveals**.

**In one sentence**: A premium animated F1 dashboard built with React + TypeScript featuring 3D tilt cards, parallax hero, cursor glow, and scroll reveals — powered by live API data with zero backend.

---

## 2. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 18 | Component model, hooks, ecosystem |
| Language | TypeScript | Type safety across the entire codebase |
| Build Tool | Vite 5 | Fast dev server with HMR, optimized production builds |
| Styling | Tailwind CSS 3 | Utility-first CSS with custom design tokens |
| Routing | React Router v7 | Client-side routing with URL params |
| Icons | Material Symbols (Google Fonts) | Consistent icon set via CDN |
| Typography | Space Grotesk + Inter (Google Fonts) | Modern, sporty headline + clean body text |
| Testing | Vitest | Fast, Vite-native test runner |
| Data Source | Jolpica F1 API | Free, open-source F1 data |

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
  ├── ErrorBoundary (catches render errors)
  ├── AuthProvider (auth context)
  ├── SmoothLoader (loading splash)
  ├── CursorGlow (global mouse-following glow)
  ├── BrowserRouter (client-side routing)
  │   ├── PageTransition (fade/slide wrapper)
  │   │   └── Routes
  │   │       ├── / → Dashboard (parallax hero)
  │   │       ├── /drivers → Drivers (staggered reveals)
  │   │       ├── /driver/:id → DriverProfile (tilt stats)
  │   │       ├── /races → Races (hover-lift cards)
  │   │       ├── /results → Results (shimmer skeletons)
  │   │       ├── /constructors → Constructors (slide reveals)
  │   │       └── * → NotFound (404)
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
        ├── Success → store in cache, return data
        │
        └── Failure → retry (up to 3 times, exponential backoff)
            │
            ├── Retry succeeds → store in cache, return data
            │
            └── All retries fail
                │
                ├── Stale cache exists → return stale data
                │
                └── No cache → throw error → page shows error banner
```

---

## 4. Design System

### 4.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `c-60` | `#0B0C10` | Page background (60% rule) |
| `c-30` | `#1F2833` | Cards, surfaces, header (30% rule) |
| `c-20` | `#45A29E` | Secondary accent — muted teal |
| `c-10` | `#66FCF1` | Accent — buttons, badges, highlights (10% rule) |
| `t-main` | `#C5C6C7` | Body text |
| `t-bright` | `#FFFFFF` | Headings, emphasized text |

### 4.2 Typography

| Font | Usage | Weight |
|---|---|---|
| Space Grotesk | Headlines, labels, navigation | 400–900, italic |
| Inter | Body text, paragraphs, form inputs | 300–700 |

### 4.3 Animations & Effects

| Animation | CSS Class | Duration | Purpose |
|---|---|---|---|
| Text reveal | `text-reveal` | 800ms | Clip-path entrance for headings |
| Hover lift | `hover-lift` | 300ms | Card lift + shadow on hover |
| Hover glow | `hover-glow` | 300ms | Cyan glow on hover |
| Button ripple | `btn-ripple` | 300ms | Radial click feedback |
| Car float | `animate-float` | 4s loop | F1 car bob in hero |
| Counter pop | `animate-counter` | 500ms | Stats bounce-in on scroll |
| Shimmer | `animate-shimmer` | 2s loop | Loading skeleton shine |
| Speed lines | `speed-lines` | 3s loop | Racing lines in hero BG |
| Search pop-in | `animate-search-in` | 200ms | Modal entrance |
| Page fade-in | `animate-page-in` | 400ms | Route transitions |
| Card entrance | `animate-card-in` | 500ms | Staggered card load |
| Glow pulse | `animate-glow-pulse` | 2s loop | LIVE badge emphasis |

---

## 5. Module-by-Module Breakdown

### 5.1 Custom Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useCountUp` | Animated number counter with ease-out cubic easing — scroll-triggered via IntersectionObserver — feeds Dashboard, DriverProfile, Constructors |
| `useMousePosition` | Tracks cursor X/Y (raw px + normalized 0-1) — feeds CursorGlow and TiltCard |
| `useInView` | Intersection Observer — triggers when element enters viewport — feeds ScrollReveal |

### 5.2 Interactive Components

| Component | Purpose |
|---|---|
| `CursorGlow` | Global cyan radial gradient orb following the mouse (hidden on mobile) |
| `TiltCard` | Wraps children in 3D perspective tilt on hover with specular shine overlay |
| `ScrollReveal` | Fade + slide entrance when children scroll into viewport. Supports direction, delay, duration |
| `SmoothLoader` | Full-screen F1-themed splash with car emoji racing across progress bar, fades out on complete |

### 5.3 API Layer (`src/data/api.ts`)

**API functions**:

| Function | Endpoint | Returns |
|---|---|---|
| `fetchDriverStandings()` | `/current/driverStandings.json` | `Driver[]` |
| `fetchRaceCalendar()` | `/current.json` | `Race[]` |
| `fetchRaceResults()` | `/current/results.json?limit=600` | `Race[]` (with results) |
| `fetchConstructorStandings()` | `/current/constructorStandings.json` | `ConstructorStanding[]` |
| `fetchCurrentSeason()` | `/current.json` | `string` (e.g. "2026") |
| `fetchCompletedRoundCount()` | `/current/driverStandings.json` | `number` |

### 5.4 Pages

| Page | Key Effects |
|---|---|
| Dashboard | 3-layer parallax hero, speed lines, floating F1 car, text reveals, scroll-reveal sections, hover-lift stats |
| Drivers | Staggered scroll-reveal (60ms per card), TiltCard wrapping |
| DriverProfile | Parallax glow orbs, text-reveal name, TiltCard stats with staggered reveal, hover-glow/lift wins |
| Races | Hover-lift/glow completed cards, flag scale, glowing accent bars, staggered upcoming cards |
| Results | Shimmer skeletons, btn-ripple tabs, active tab glow, hover-glow table |
| Constructors | Slide-from-left scroll reveals, position scale animation, hover-glow |
| NotFound | Giant "404" watermark, "OFF TRACK" heading, CTA buttons |

### 5.5 UI Components

| Component | Purpose |
|---|---|
| `Header` | Fixed nav — brand, desktop links, search, auth, mobile hamburger |
| `Footer` | Brand, links, copyright |
| `DriverCard` | TiltCard-wrapped card with shimmer overlay, team-color glow bar, scale micro-interactions |
| `SkeletonCard` | Shimmer loading placeholder |
| `SearchModal` | Full-screen search — filters drivers + races in real-time |
| `LoginModal` | Login/Register form with toggle |
| `MobileMenu` | Slide-out nav for mobile |
| `PageTransition` | Fade + slide wrapper on route change |
| `ErrorBoundary` | Catches React render errors |
| `Tooltip` | Hover tooltip with top/bottom positioning — wraps search and header icons |

### 5.6 Auth System (`src/context/AuthContext.tsx`)

React Context providing `{ user, isAuthenticated, login, register, logout }`. Uses `localStorage` for persistence.

> ⚠️ This is **demo-quality auth** — passwords stored in plaintext. Not suitable for production.

---

## 6. Routing

| Path | Page | Dynamic? |
|---|---|---|
| `/` | Dashboard | No |
| `/drivers` | All Drivers | No |
| `/driver/:id` | Driver Profile | Yes (`:id` from API) |
| `/races` | Race Calendar | No |
| `/results` | Race Results | No (uses `?race=` query) |
| `/constructors` | Constructor Standings | No |
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
        ├── Success → update cache + return
        │
        └── Failure (after 3 retries)
            │
            ├── Stale entry exists → return stale (degraded)
            │
            └── No entry → throw error
```

Cache is **per-URL, in-memory only** — resets on page refresh.

---

## 8. Error Handling

| Level | Mechanism | User Experience |
|---|---|---|
| Network failure | Retry + stale cache fallback | Fresh or slightly stale data |
| API error | Try-catch in `useEffect` | Inline error banner |
| Component crash | `ErrorBoundary` | Full-page error with "RELOAD" button |
| Unknown route | `<Route path="*">` | 404 "OFF TRACK" page |

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
