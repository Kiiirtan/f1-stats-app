# F1 Stats — Project Synopsis

| Field | Detail |
|---|---|
| **Project Title** | F1 Stats — Live F1 Dashboard |
| **Version** | 2.0.1.0 |
| **Date** | April 11, 2026 |
| **Technology** | React 18, React Router v7, TypeScript, Vite 5, Tailwind CSS 3 |
| **Data Source** | Jolpica F1 API, Supabase (DB Fallback), RSS2JSON, Wikimedia Commons |
| **Deployment** | Render (Static Site) |
| **Status** | Production-ready |

---

## 1. Overview

F1 Stats is a real-time Formula 1 web dashboard delivering live championship standings, breaking global news, historical constructor analytics, individual driver profiles, circuit encyclopedias, and a detailed season calendar. The application consumes authentic telemetry from the Jolpica F1 API and Motorsport.com, with a **Supabase database fallback** for zero-downtime resilience and **Supabase Auth** for real user authentication. Data is presented through a **premium, immersive, dark-themed interface** featuring **3D tilt cards, parallax scrolling, cursor-interactive effects, scroll-triggered reveals, and micro-animations** — fully optimized for both desktop and mobile.

## 2. Problem Statement

F1 fans lack a fast, visually engaging, single-page application to track live standings, read live breaking news, explore deep historical driver and constructor statistics, and browse circuit data — all in one place — without relying on heavy, ad-laden sports portals.

## 3. Proposed Solution

A lightweight SPA built with modern web technologies that:
- Fetches real-time telemetry from the Jolpica F1 REST API
- Falls back to a **Supabase PostgreSQL database** when the primary API is unreachable (zero-downtime architecture)
- Syndicates live breaking news from Motorsport.com via RSS2JSON proxy
- Supports deep historical queries (e.g. tracking specific driver lineups from 1950–2026)
- Caches responses for 5 minutes in-memory to minimize API load
- Automatically syncs data to Supabase via **GitHub Actions** (every 30 minutes)
- Renders a responsive, animation-rich UI with 3D motion effects
- Sources premium high-fidelity imagery dynamically from Wikipedia Commons and Unsplash
- Provides a full **Settings panel** with theme selection (Dark/Light), accent colors, animation toggles, data density, and default page configuration

## 4. Key Features

| Feature | Description |
|---|---|
| Live Dashboard | Parallax hero with speed lines, floating F1 car, top-6 3D tilt driver cards, recent results, animated stat counters. |
| Breaking News Feed | Real-time masonry grid of F1 news from Motorsport.com with fallback images and featured article layout. |
| Driver Standings | Full active grid with staggered scroll-reveal entrance and TiltCard hover effects. |
| Driver Profiles | Deep career analytics — championships, wins, poles, full season-by-season history fetched dynamically per driver. |
| Historical Analytics | Deep-dive constructor pages (`/constructor/:id/season/:year`) detailing exact driver points and final standings for any historical season. |
| Season Calendar | Detailed race weekend calendar with session times (FP1, Qualifying, Sprint, Race), podium results, countdown to next event. |
| Race Calendar | Completed vs upcoming races with hover-lift, flag animations, sprint badges. |
| Race Results | Per-race detailed tables with shimmer skeletons, glowing active tabs. |
| Constructor Profiles | Full career stats (championships, wins, podiums, poles, seasons), season-by-season history chart, team-colored glow progress bars. |
| Circuits | Full circuit encyclopedia with race history, podium records, and physical track specifications scraped from Wikipedia. |
| Settings | Theme (Dark/Light), accent color picker, animation toggle, data density, auto-refresh, units (metric/imperial), default page. |
| Contact | Contact form with embedded social links. |
| Legal Pages | Privacy Policy, Terms of Service, Cookie Policy, Credits & Attributions. |
| Global Interactive Effects | Cyan radial gradient orb following the mouse, smooth loaders, and route transitions. |
| Supabase Fallback | Zero-downtime data architecture — serves cached data from Supabase when Jolpica API is unreachable. |
| GitHub Actions Sync | Automated CRON job syncing fresh F1 data to Supabase every 30 minutes. |
| Supabase Authentication | Real email/password auth with input validation, auto-login on signup, and session management. |
| Skeleton Loaders | Premium page-specific shimmer loading states for every major page. |
| Dynamic SEO | Per-page dynamic `<title>` and meta tags via `useDocumentMeta` hook. |
| Notifications Tray | In-app notification system with real-time alerts. |
| Archives | Historical season browsing with curated data. |

## 5. Target Audience

- Formula 1 fans seeking a fast, immersive dashboard with live news and stats.
- Developers exploring modern React + TypeScript architecture (Vite, API Proxies, Supabase).

## 6. Deliverables

- Fully functional SPA with 20+ routes
- Deep historical data architecture (drivers & constructors)
- Driver career statistics (championships, wins, poles, season history)
- Circuit encyclopedia with race history
- Detailed season calendar with session schedules
- Premium interactive UI (parallax, 3D tilt, scroll reveals, cursor effects, animated counters)
- Zero-downtime Supabase database fallback
- Automated data sync via GitHub Actions
- Full Settings panel (theme, accent color, animations, data density)
- Responsive mobile-first design
- Legal compliance (trademark disclaimers, privacy policy, cookie policy) & full attributions page
