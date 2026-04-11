# F1 Stats — Software Requirements Specification (SRS)

| Field | Detail |
|---|---|
| **Document Version** | 5.0 |
| **Date** | April 11, 2026 |
| **Project** | F1 Stats |
| **Prepared By** | Development Team |

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for F1 Stats, a real-time Formula 1 dashboard web application with premium interactive effects and zero-downtime data resilience.

### 1.2 Scope
The system is a client-side Single Page Application (SPA) that fetches and displays live F1 data through an immersive, animation-rich interface. Data is sourced from the Jolpica F1 public API with automatic fallback to a **Supabase PostgreSQL database** when the primary API is unreachable. A **GitHub Actions** CRON job keeps the Supabase cache fresh every 30 minutes. **Supabase Auth** provides real email/password authentication with session management. Settings are persisted client-side via localStorage.

### 1.3 Definitions

| Term | Definition |
|---|---|
| SPA | Single Page Application |
| API | Application Programming Interface |
| WDC | World Drivers' Championship |
| WCC | World Constructors' Championship |
| RSS | Really Simple Syndication |
| CRON | Scheduled automated task |

---

## 2. System Overview

```
┌─────────────┐       HTTPS/JSON        ┌──────────────────┐
│   Browser   │  ◄──────────────────►   │  Jolpica F1 API  │
│  (React SPA)│                         │  api.jolpi.ca    │
└──────┬──────┘                         └──────────────────┘
       │                                         │
       │  localStorage                           │ (fallback)
       ▼                                         ▼
┌─────────────┐                         ┌──────────────────┐
│  Settings   │                         │   Supabase DB    │
│  Store      │                         │   (api_cache)    │
└─────────────┘                         └──────┬───────────┘
       │                                       │
       │                              ┌────────┴────────┐
       ▼                              │  GitHub Actions  │
┌─────────────┐                       │  (CRON sync)     │
│ Supabase    │                       └─────────────────┘
│ Auth        │
└─────────────┘
```

---

## 3. Functional Requirements

### 3.1 Dashboard (FR-01)
| ID | Requirement |
|---|---|
| FR-01.1 | Display current season label and animated LIVE badge with glow pulse |
| FR-01.2 | Show top 6 drivers as 3D TiltCard components with scroll-triggered reveals |
| FR-01.3 | Parallax hero with multi-layer depth (grid, glow orbs, floating F1 car) |
| FR-01.4 | Speed line animation in hero background |
| FR-01.5 | Text-reveal animation on hero headings |
| FR-01.6 | Show last 3 completed race results with hover effects |
| FR-01.7 | Display quick stats with hover-lift: driver count, team count, races, leader points |

### 3.2 Driver Standings (FR-02)
| ID | Requirement |
|---|---|
| FR-02.1 | List all drivers in a responsive card grid with staggered scroll reveals |
| FR-02.2 | Each card wrapped in TiltCard with shimmer overlay and team-color glow bar |
| FR-02.3 | Cards show: position, name, team, points, nationality flag, win count |
| FR-02.4 | Cards link to individual driver profiles |

### 3.3 Driver Profile (FR-03)
| ID | Requirement |
|---|---|
| FR-03.1 | Display driver name with text-reveal animation and team-color accent |
| FR-03.2 | Parallax glow orbs in background using team color |
| FR-03.3 | Show career stat cards (championships, wins, poles, seasons, points, position) wrapped in TiltCard with staggered scroll reveals |
| FR-03.4 | Full season-by-season career history table (year, team, position, points, wins) |
| FR-03.5 | Dynamically fetch all career data via per-season API calls |
| FR-03.6 | Breadcrumb navigation (Home / Drivers / {name}) |

### 3.4 Race Calendar (FR-04)
| ID | Requirement |
|---|---|
| FR-04.1 | Separate completed and upcoming races with scroll-reveal sections |
| FR-04.2 | Completed cards with hover-lift, glow, flag scale animation |
| FR-04.3 | Sprint badges on applicable races |
| FR-04.4 | Expanding accent bar on hover |

### 3.5 Season Calendar (FR-04B)
| ID | Requirement |
|---|---|
| FR-04B.1 | Detailed schedule with FP1, Qualifying, Sprint, and Race session times |
| FR-04B.2 | Podium results for completed races (P1, P2, P3 with driver codes) |
| FR-04B.3 | Countdown timer to the next upcoming race |
| FR-04B.4 | Link to circuit profile pages |
| FR-04B.5 | Toggle between list and compact views |

### 3.6 Race Results (FR-05)
| ID | Requirement |
|---|---|
| FR-05.1 | Race selector tabs with btn-ripple effect and active tab glow |
| FR-05.2 | Results table with position scale on hover |
| FR-05.3 | Color-coded positions (gold P1, silver P2, bronze P3) |
| FR-05.4 | Shimmer skeleton loading states |
| FR-05.5 | Support `?race=<circuitId>` URL parameter |

### 3.7 Constructor Standings (FR-06)
| ID | Requirement |
|---|---|
| FR-06.1 | Slide-from-left scroll reveals per team |
| FR-06.2 | Team-colored glowing progress bars proportional to leader |
| FR-06.3 | Position and points scale on hover |

### 3.8 Constructor Profile (FR-06B)
| ID | Requirement |
|---|---|
| FR-06B.1 | Full career stats: championships, wins, podiums, poles, seasons, first entry |
| FR-06B.2 | Team metadata: base, principal, hero image |
| FR-06B.3 | Season-by-season history chart (last 15 seasons) |
| FR-06B.4 | Current and previous season comparison with driver lineups |
| FR-06B.5 | Link to historical season deep-dive pages |

### 3.9 Circuits (FR-11)
| ID | Requirement |
|---|---|
| FR-11.1 | Browse all F1 circuits with search and country filtering |
| FR-11.2 | Circuit profile pages with full race history and podium records |
| FR-11.3 | Physical track specifications (length, turns, lap record) scraped from Wikipedia |
| FR-11.4 | Track layout diagrams from Wikimedia Commons |

### 3.10 News Feed (FR-12)
| ID | Requirement |
|---|---|
| FR-12.1 | Live RSS feed from Motorsport.com via RSS2JSON proxy |
| FR-12.2 | Featured article with large image and masonry grid layout |
| FR-12.3 | Fallback images for articles without thumbnails |

### 3.11 Settings (FR-13)
| ID | Requirement |
|---|---|
| FR-13.1 | Theme selection: Dark or Light mode |
| FR-13.2 | Accent color picker with preset F1 team colors |
| FR-13.3 | Toggle animations on/off |
| FR-13.4 | Data density: compact, default, comfortable |
| FR-13.5 | Auto-refresh toggle with configurable interval |
| FR-13.6 | Units toggle: metric or imperial |
| FR-13.7 | Default landing page selector |
| FR-13.8 | Settings persist to localStorage |
| FR-13.9 | Reset to defaults button |

### 3.12 Global Interactive Effects (FR-10)
| ID | Requirement |
|---|---|
| FR-10.1 | CursorGlow — cyan radial gradient following mouse (hidden on mobile) |
| FR-10.2 | SmoothLoader — F1-themed splash screen with progress bar on first load |
| FR-10.3 | ScrollReveal — fade+slide entrance on viewport intersection |
| FR-10.4 | TiltCard — 3D perspective rotation + specular shine on hover |

### 3.13 Search (FR-07)
| ID | Requirement |
|---|---|
| FR-07.1 | Modal search overlay triggered from header |
| FR-07.2 | Real-time filtering across drivers and races |
| FR-07.3 | Results navigate to relevant page |

### 3.14 Error Handling (FR-09)
| ID | Requirement |
|---|---|
| FR-09.1 | 404 catch-all route with themed "OFF TRACK" page |
| FR-09.2 | Error boundary catches render-time errors |
| FR-09.3 | API errors show inline warning banners via DataState component |
| FR-09.4 | Supabase database fallback when Jolpica API is unreachable |

### 3.15 Legal & Contact Pages (FR-14)
| ID | Requirement |
|---|---|
| FR-14.1 | Privacy Policy page |
| FR-14.2 | Terms of Service page |
| FR-14.3 | Cookie Policy page |
| FR-14.4 | Credits & Attributions page |
| FR-14.5 | Contact form page with social links |

### 3.16 Authentication (FR-15)
| ID | Requirement |
|---|---|
| FR-15.1 | Email/password sign-up with Supabase Auth |
| FR-15.2 | Email format validation (regex) and password minimum length (8 chars) |
| FR-15.3 | Display name validation (2-30 chars) |
| FR-15.4 | Auto-login on successful registration |
| FR-15.5 | Sign-in with email/password |
| FR-15.6 | Sign-out functionality |
| FR-15.7 | Profile update (display name, avatar) |
| FR-15.8 | Auth state persists across page reloads via Supabase session |
| FR-15.9 | AuthModal overlay for sign-up/sign-in |

### 3.17 Skeleton Loading States (FR-16)
| ID | Requirement |
|---|---|
| FR-16.1 | Page-specific skeleton shimmer loaders for all major pages |
| FR-16.2 | Skeleton matches actual page layout to prevent CLS |

### 3.18 Notifications (FR-17)
| ID | Requirement |
|---|---|
| FR-17.1 | In-app notifications tray accessible from TopNavBar |
| FR-17.2 | Real-time alert display |

---

## 4. Non-Functional Requirements

### 4.1 Performance
| ID | Requirement |
|---|---|
| NFR-01 | API responses cached for 5 minutes in-memory |
| NFR-02 | Failed API calls retry 3 times with exponential backoff |
| NFR-03 | Initial page render < 2 seconds on 4G |
| NFR-04 | Animations use `will-change` and `transform` for GPU acceleration |
| NFR-05 | Supabase fallback ensures zero-downtime data availability |

### 4.2 Usability
| ID | Requirement |
|---|---|
| NFR-06 | Responsive design: mobile (320px) → desktop (1920px) |
| NFR-07 | Smooth page transitions between routes |
| NFR-08 | Staggered card entrance animations |
| NFR-09 | Keyboard-accessible (Escape closes modals) |
| NFR-10 | Cursor glow gracefully hidden on touch devices |
| NFR-11 | Settings panel for user preferences |

### 4.3 Reliability
| ID | Requirement |
|---|---|
| NFR-12 | App remains functional with stale cache if API is down |
| NFR-13 | ErrorBoundary prevents blank screen on component errors |
| NFR-14 | Supabase database provides persistent fallback layer |
| NFR-15 | GitHub Actions CRON keeps Supabase data fresh every 30 minutes |

### 4.4 SEO
| ID | Requirement |
|---|---|
| NFR-16 | Unique `<title>` and `<meta description>` per page |
| NFR-17 | Open Graph and Twitter Card meta tags |
| NFR-18 | Semantic HTML5 structure |

---

## 5. Data Requirements

### 5.1 External APIs
- **Primary API (Telemetry)**: `https://api.jolpi.ca/ergast/f1`
- **News Proxy**: `https://api.rss2json.com/v1/api.json`
- **Database Fallback**: Supabase PostgreSQL (`api_cache` table)

| Endpoint | Purpose |
|---|---|
| `/current/driverStandings.json` | Driver standings |
| `/current/constructorStandings.json` | Constructor standings |
| `/current.json` | Race calendar + season calendar |
| `/current/results.json?limit=600` | Race results |
| `/{year}/drivers/{id}/driverStandings.json` | Driver career stats per season |
| `/{year}/constructors/{id}/constructorStandings.json` | Constructor history per season |
| `/constructors/{id}/results/1.json` | Constructor total wins |
| `/drivers/{id}/results/1.json` | Driver total wins |
| `/drivers/{id}/qualifying/1.json` | Driver total poles |
| `/drivers/{id}/seasons.json` | Driver active seasons |
| `/circuits.json` | All circuits |
| `/circuits/{id}/results/{pos}.json` | Circuit race history (P1, P2, P3) |
| `motorsport.com/rss/f1/news` | Live News XML Feed (via RSS2JSON) |

### 5.2 Local Storage Keys
| Key | Purpose |
|---|---|
| `f1app_settings` | User settings (theme, accent, animations, defaults) |

### 5.3 Supabase Tables
| Table | Purpose |
|---|---|
| `api_cache` | Persistent JSON cache (`endpoint`, `data`, `updated_at`) |
| `auth.users` | Supabase Auth managed user accounts |

---

## 6. Constraints

- No custom backend — fully client-side with Supabase Auth + DB fallback
- API rate limits governed by Jolpica's fair-use policy
- No server-side rendering (client-side SPA)
- Image assets depend on Wikimedia Commons availability
- Supabase anon key exposed in browser bundle (by design; mitigate with RLS)

---

## 7. Acceptance Criteria

| Criteria | Status |
|---|---|
| All 20+ routes render without errors | ✅ |
| TypeScript compiles with zero errors | ✅ |
| All interactive effects functional | ✅ |
| Responsive on mobile and desktop | ✅ |
| API retry logic handles failures | ✅ |
| Supabase fallback activates when API is down | ✅ |
| Settings persist across page reloads | ✅ |
| Theme switching (Dark/Light) works correctly | ✅ |
| Driver career stats load dynamically | ✅ |
| Circuit pages display race history | ✅ |
| Season calendar shows session times | ✅ |
| GitHub Actions CRON syncs data to Supabase | ✅ |
| Supabase Auth sign-up/sign-in works | ✅ |
| Auto-login on registration works | ✅ |
| Skeleton loaders display during data fetch | ✅ |
| Dynamic SEO meta tags per page | ✅ |
