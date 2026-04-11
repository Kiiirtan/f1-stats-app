# F1 Stats — Version History

> A comprehensive changelog tracking every release of the F1 Stats Dashboard from inception to the current production build. Versions follow the `MAJOR.MINOR.PATCH.BUILD` scheme where **X.0.0.0** releases are **Major** milestones and all others are **Minor** updates.

| Field | Detail |
|---|---|
| **Project** | F1 Stats — Live F1 Dashboard |
| **Repository** | [Kiiirtan/f1-stats-app](https://github.com/Kiiirtan/f1-stats-app) |
| **Current Version** | 2.0.1.0 |
| **Last Updated** | April 11, 2026 |

---

## Quick Reference

| Version | Updated |
|---|---|
| **1.0.0.0** | Initial release — Dashboard, Drivers, Constructors, Races, Results, Settings, Contact, 404 page, Jolpica API, dark glassmorphism UI, interactive effects (CursorGlow, TiltCard, ScrollReveal) |
| **1.0.1.0** | Removed `node_modules/` & `dist/` from Git, fixed `.gitignore` |
| **1.0.2.0** | Fixed Vite TS2882 CSS error, fixed `vite-env.d.ts`, added professional README with screenshots |
| **1.0.3.0** | Added hamburger menu & collapsible mobile sidebar |
| **1.1.0.0** | Added Live News Feed (Motorsport.com RSS), Constructor Profiles, Historical Season pages |
| **1.1.1.0** | Added pitch deck, scaling roadmap, optimization backlog, updated all legacy docs |
| **1.2.0.0** | Added circuit track maps (SVG + PNG), live circuit specs from Wikipedia (length, turns, lap record) |
| **1.2.1.0** | Added Cloudflare Web Analytics |
| **1.3.0.0** | Added Supabase database fallback, GitHub Actions CRON sync (every 30 min), 3-tier data fallback chain |
| **2.0.0.0** | Full production overhaul — Supabase Auth, Notifications, Skeleton Loaders, Season Calendar, Archives, dynamic SEO, complete UI/UX redesign of every page, Render deployment |
| **2.0.1.0** | Fixed auto-login on signup, email confirmation bypass, mobile horizontal scroll, missing footer links |

## Version Index

| Version | Type | Release Date | Codename |
|---|---|---|---|
| [1.0.0.0](#1000--initial-release) | 🔴 **MAJOR** | March 27, 2026 | *Initial Release* |
| [1.0.1.0](#1010--repository-cleanup) | 🟢 Minor | March 27, 2026 | *Repository Cleanup* |
| [1.0.2.0](#1020--deployment-fixes) | 🟢 Minor | March 27, 2026 | *Deployment Fixes* |
| [1.0.3.0](#1030--mobile-navigation) | 🟢 Minor | March 27, 2026 | *Mobile Navigation* |
| [1.1.0.0](#1100--content-expansion) | 🟢 Minor | March 28, 2026 | *Content Expansion* |
| [1.1.1.0](#1110--documentation-suite) | 🟢 Minor | March 28, 2026 | *Documentation Suite* |
| [1.2.0.0](#1200--circuit-encyclopedia) | 🟢 Minor | March 28, 2026 | *Circuit Encyclopedia* |
| [1.2.1.0](#1210--analytics-integration) | 🟢 Minor | March 28, 2026 | *Analytics Integration* |
| [1.3.0.0](#1300--zero-downtime-architecture) | 🟢 Minor | March 29, 2026 | *Zero-Downtime Architecture* |
| [2.0.0.0](#2000--production-release-v2) | 🔴 **MAJOR** | April 10, 2026 | *Production Release V2* |
| [2.0.1.0](#2010--auth-hotfix) | 🟢 Minor | April 11, 2026 | *Auth Hotfix* |

---

## 1.0.0.0 — Initial Release

> 🔴 **MAJOR RELEASE** · March 27, 2026

The foundational release of F1 Stats — a real-time Formula 1 dashboard built from scratch with React 18, TypeScript, Vite 5, and Tailwind CSS 3.

### ✨ Features Introduced

| Category | Feature |
|---|---|
| **Core Pages** | Dashboard, Drivers, Driver Profiles, Constructors, Races, Race Results, Settings, Contact |
| **Legal Pages** | Privacy Policy, Terms of Service, Cookie Policy, Credits & Attributions |
| **Error Handling** | Custom 404 "Track Not Found" page |
| **Data Source** | Jolpica F1 REST API integration with in-memory caching (5-minute TTL) |
| **UI Components** | DriverCard, LoginModal, MobileMenu, SearchModal, TelemetryVisualizer |
| **Layout** | TopNavBar, SideNavBar, Footer, Layout wrapper |
| **Interactive Effects** | CursorGlow (radial gradient mouse follower), TiltCard (3D hover), ScrollReveal, PageTransition, SmoothLoader |
| **Utilities** | ErrorBoundary, SkeletonCard, Tooltip |
| **Auth** | Basic localStorage-based authentication context |
| **Settings** | Theme (Dark/Light), accent color, animation toggle, data density, default page |
| **Hooks** | `useCountUp`, `useDrivers`, `useInView`, `useMousePosition` |
| **Media** | Dynamic driver portraits via Wikimedia Commons & Unsplash |
| **Styling** | Dark-themed glassmorphism UI with Space Grotesk + Inter typography |
| **Tests** | API integration test suite (305 lines) |
| **Deployment** | Vercel configuration, SPA redirect rules, PWA manifest |

### 🛠️ Tech Stack

- React 18.3.1, React Router DOM v7, TypeScript 5.5
- Vite 5.4, Tailwind CSS 3.4, PostCSS, Autoprefixer
- Vitest for testing

### 📁 Files Added

- **33 source files** across `src/` (pages, components, hooks, data, context)
- Full `public/` assets (favicon, manifest, redirects)
- API testing scripts in `scripts/`
- Build configuration (Vite, TypeScript, Tailwind, PostCSS)

---

## 1.0.1.0 — Repository Cleanup

> 🟢 **MINOR UPDATE** · March 27, 2026

Repository hygiene pass — removed accidental `node_modules` commit and purged `dist/` artifacts from version control.

### 🔧 Changes

- ❌ Removed `node_modules/` directory from Git tracking
- ❌ Purged `dist/` build output from repository
- ✅ Updated `.gitignore` to properly exclude `node_modules/` and `dist/`
- 🐛 Fixed Vite permission bug caused by tracked `node_modules`

---

## 1.0.2.0 — Deployment Fixes

> 🟢 **MINOR UPDATE** · March 27, 2026

Critical build and deployment fixes for the Render hosting environment.

### 🔧 Changes

- 🐛 Fixed Vite CSS import TypeScript error `TS2882` on Render build pipeline
- 🐛 Fixed syntax error in `vite-env.d.ts` declaration file
- 📝 Added professional README with tech badges, live link, features list, and getting started guide
- 📸 Added application screenshots to README

---

## 1.0.3.0 — Mobile Navigation

> 🟢 **MINOR UPDATE** · March 27, 2026

First mobile UX improvement — proper responsive navigation for smaller screens.

### ✨ Features

- 📱 Added hamburger menu for mobile navigation
- 📱 Collapsible mobile sidebar with smooth transitions
- 📱 Touch-friendly navigation targets

---

## 1.1.0.0 — Content Expansion

> 🟢 **MINOR UPDATE** · March 28, 2026

Major content expansion adding two entirely new feature domains to the application.

### ✨ Features Introduced

| Feature | Description |
|---|---|
| **Live Breaking News Feed** | Real-time masonry grid of F1 news from Motorsport.com via RSS2JSON proxy with featured article layout and fallback images |
| **Constructor Historical Seasons** | Deep-dive pages (`/constructor/:id/season/:year`) showing exact driver lineups, individual points, and final standings for any historical season from 1950–2026 |
| **Constructor Profiles** | Full career statistics — championships, wins, podiums, poles — with season-by-season history charts and team-colored glow progress bars |

### 📁 New Files

- `src/pages/News.tsx` — Breaking news feed page (188 lines)
- `src/pages/ConstructorProfile.tsx` — Constructor career analytics (373 lines)
- `src/pages/ConstructorSeasonDetails.tsx` — Historical season breakdown (202 lines)

### 🔧 Changes

- Extended `src/data/api.ts` with 392 lines of new API integration (news syndication, constructor history endpoints)
- Updated routing in `App.tsx` with new routes
- Enhanced `Footer.tsx` with new navigation links
- Updated `SideNavBar.tsx` and `TopNavBar.tsx` with new menu items
- Refactored `Constructors.tsx` page layout
- Updated `Credits.tsx` with new attributions

---

## 1.1.1.0 — Documentation Suite

> 🟢 **MINOR UPDATE** · March 28, 2026

Comprehensive documentation and business planning package added for project presentation and scaling roadmap.

### 📝 Documents Added/Updated

| Document | Description |
|---|---|
| `docs/pitch_deck.md` | Business pitch deck with market positioning |
| `docs/scaling_and_architecture_v2.md` | Technical scaling roadmap and V2 architecture |
| `docs/performance_optimization_backlog.md` | Performance improvement tracking |
| `README.md` | Updated with new News Feed and Historical Analytics features |
| Legacy document suite | Massive update across all existing docs for v3.0 feature alignment |

### 🔧 Changes

- Mobile optimization documentation added
- Analytics documentation added
- Markdown paths standardized with local image embedding for pitch deck

---

## 1.2.0.0 — Circuit Encyclopedia

> 🟢 **MINOR UPDATE** · March 28, 2026

New circuit data features with live Wikipedia integration for track specifications.

### ✨ Features Introduced

| Feature | Description |
|---|---|
| **Track Map SVG Resolution** | Robust Wikipedia track map rendering with SVG support |
| **Live Circuit Specifications** | Real-time scraping of circuit length, number of turns, and lap records from Wikipedia infoboxes |
| **PNG Track Layouts** | Fallback support for circuits with PNG maps (e.g., Silverstone) instead of SVG |

### 🔧 Changes

- Enhanced `CircuitProfile.tsx` with Wikipedia data integration
- Improved track map resolution algorithm for edge cases
- Multi-format image support (SVG + PNG fallback chain)

---

## 1.2.1.0 — Analytics Integration

> 🟢 **MINOR UPDATE** · March 28, 2026

Web analytics integration for production traffic monitoring.

### 🔧 Changes

- ✅ Added Cloudflare Web Analytics snippet to `index.html`
- 📊 Production-grade traffic monitoring enabled

---

## 1.3.0.0 — Zero-Downtime Architecture

> 🟢 **MINOR UPDATE** · March 29, 2026

Critical resilience upgrade implementing a persistent database fallback to guarantee zero-downtime data delivery.

### ✨ Features Introduced

| Feature | Description |
|---|---|
| **Supabase Database Fallback** | PostgreSQL-backed persistent data cache via Supabase — serves cached standings, results, and driver data when Jolpica API is unreachable |
| **GitHub Actions CRON Sync** | Automated workflow (`sync_f1_data.yml`) that syncs fresh F1 data to Supabase every 30 minutes |
| **3-Tier Fallback Chain** | `fetchWithCache()` now follows: In-Memory Cache → Jolpica API (3 retries) → Supabase DB |

### 📁 New Files

- `src/lib/supabase.ts` — Supabase client configuration (50 lines)
- `scripts/sync-to-supabase.mjs` — Data synchronization script (91 lines)
- `.github/workflows/sync_f1_data.yml` — GitHub Actions CRON workflow (26 lines)

### 🔧 Changes

- Added `@supabase/supabase-js` dependency
- Extended `api.ts` with Supabase fallback logic
- Updated `SideNavBar.tsx` and `TopNavBar.tsx` with data source indicators
- Enhanced `Settings.tsx` with Supabase connection status display
- Improved `index.css` styling (45 lines)

---

## 2.0.0.0 — Production Release V2

> 🔴 **MAJOR RELEASE** · April 10, 2026

The complete production-grade overhaul — a massive transformation of the entire UI/UX, authentication system, deployment infrastructure, and feature set. This release represents a top-to-bottom rewrite of nearly every page and component.

### ✨ Major Features Introduced

| Category | Feature |
|---|---|
| **Supabase Authentication** | Real email/password auth with `AuthModal.tsx` — replacing the demo localStorage system |
| **Notifications Tray** | `NotificationsTray.tsx` — in-app notification system with real-time alerts |
| **Skeleton Loaders** | `SkeletonLoader.tsx` — premium page-specific loading states (427 lines of shimmer animations) |
| **Season Calendar** | Complete rewrite of `SeasonCalendar.tsx` with FP1, Qualifying, Sprint, and Race session times with podium results |
| **Archives Page** | New `Archives.tsx` page for historical data browsing |
| **Circuit Maps** | `circuitMaps.ts` — dedicated circuit map asset management |
| **Constructor Details** | `constructorDetails.ts` — enriched constructor metadata (team principals, HQ, etc.) |
| **Dynamic SEO** | `useDocumentMeta.ts` hook for per-page dynamic `<title>` and meta tags |
| **Scroll Reveal Hook** | `useScrollReveal.ts` — reusable intersection observer hook |

### 🎨 UI/UX Overhaul

| Change | Detail |
|---|---|
| **Settings Page** | Complete redesign — expanded from 318 to 1,044+ lines with premium tabbed interface |
| **Dashboard** | Full redesign with parallax hero, speed lines, floating F1 car, animated stat counters |
| **Drivers Page** | Expanded from 74 to 275+ lines with staggered scroll-reveal grid and TiltCard effects |
| **SideNavBar** | Complete rewrite — expanded from 61 to 331+ lines with 3D flip-card architecture |
| **TopNavBar** | Complete rewrite — expanded from 85 to 301+ lines with enhanced search and auth integration |
| **Glassmorphism** | Global backdrop blur filters, glass-panel effects across all components |
| **CSS Expansion** | `index.css` grew from 92 to 217+ lines with new animation systems |
| **Tailwind Config** | Enhanced with new custom tokens and design system extensions |

### 🛡️ Production Hardening

| Item | Description |
|---|---|
| **Render Deployment** | Added `render.yaml` for Render Cloud Infrastructure configuration |
| **Environment Security** | Hardened `.gitignore` for `.env` and `.env.production` files |
| **Auth Overhaul** | `AuthContext.tsx` rewritten with Supabase Auth (email/password, session management) |
| **Settings Context** | Enhanced `SettingsContext.tsx` with expanded preference management |
| **Layout System** | Updated `Layout.tsx` wrapper with improved responsive architecture |

### 📝 Documentation Added

| Document | Description |
|---|---|
| `docs/07_FRONTEND_DEVELOPER_GUIDE.md` | Comprehensive developer onboarding guide (594 lines) |
| `docs/MUST_CHANGES.md` | Required changes tracker (196 lines) |
| `docs/PRE_LAUNCH_TODO.md` | Pre-launch checklist |
| `docs/cyberreport.md` | Security audit report (299 lines) |
| `docs/prereleasev2.md` | V2 pre-release checklist |
| `docs/version3.md` | V3 future roadmap |

### 📁 New Files (11)

- `src/components/features/AuthModal.tsx`
- `src/components/features/NotificationsTray.tsx`
- `src/components/ui/SkeletonLoader.tsx`
- `src/pages/Archives.tsx`
- `src/data/circuitMaps.ts`
- `src/data/constructorDetails.ts`
- `src/hooks/useDocumentMeta.ts`
- `src/hooks/useScrollReveal.ts`
- `render.yaml`
- `logostatus.json`
- `public/bg-dark-f1.webp`, `public/apple-touch-icon.png`, `public/madrid_circuit.svg`

### 📊 Scale of Changes

- **70 files changed**
- **+6,798 lines added**, **−1,525 lines removed**
- Every single page in the application was touched and improved

---

## 2.0.1.0 — Auth Hotfix

> 🟢 **MINOR UPDATE** · April 11, 2026

Critical authentication UX fix and mobile layout corrections.

### 🐛 Bug Fixes

| Fix | Description |
|---|---|
| **Auto-Login on Signup** | Users are now automatically logged in after successful registration — eliminates the previous flow where users had to manually sign in after creating an account |
| **Email Confirmation Bypass** | Resolved Supabase email rate limit issues by configuring auth to bypass email confirmation for testing |
| **Mobile Horizontal Scroll** | Fixed Dashboard horizontal overflow on mobile devices |
| **Missing Footer Links** | Added missing navigation links to Settings page footer |

### 🔧 Changes

- `src/context/AuthContext.tsx` — Enhanced with auto-login logic (52 lines added)
- `src/pages/Settings.tsx` — Version bump display
- `src/components/layout/Layout.tsx` — Layout constraint fix
- `docs/version3.md` — Updated with new roadmap items

---

## Summary Statistics

| Metric | Value |
|---|---|
| **Total Versions** | 11 |
| **Major Releases** | 2 (v1.0.0.0, v2.0.0.0) |
| **Minor Updates** | 9 |
| **Development Span** | March 27 → April 11, 2026 (16 days) |
| **Total Source Files** | 40+ TypeScript/TSX files |
| **Total Pages** | 20 routes |
| **Total Components** | 21 components (7 features + 4 layout + 10 UI) |
| **API Integrations** | Jolpica F1, Supabase, Motorsport.com RSS, Wikimedia Commons, Unsplash |
| **Deployment** | Render Cloud Infrastructure |

---

*Maintained by **[Kiiirtan](https://github.com/Kiiirtan)***
