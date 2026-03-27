# F1 STATS — Project Synopsis

| Field | Detail |
|---|---|
| **Project Title** | F1 STATS — Live F1 Dashboard |
| **Version** | 3.0.0 |
| **Date** | March 27, 2026 |
| **Technology** | React 18, React Router v6, TypeScript, Vite, Tailwind CSS |
| **Data Source** | Jolpica F1 API, Motorsport.com RSS, Wikimedia Commons |
| **Status** | Production-ready |

---

## 1. Overview

F1 STATS is a real-time Formula 1 web dashboard delivering live championship standings, breaking global news, historical constructor analytics, and individual driver profiles. The application consumes authentic telemetry from the Jolpica F1 API and Motorsport.com, presenting it through a **premium, immersive, dark-themed interface** featuring **3D tilt cards, parallax scrolling, cursor-interactive effects, scroll-triggered reveals, and micro-animations** — optimized for both desktop and mobile.

## 2. Problem Statement

F1 fans lack a fast, visually engaging, single-page application to track live standings, read live breaking news, and explore deep historical driver statistics — all in one place — without relying on heavy, ad-laden sports portals.

## 3. Proposed Solution

A lightweight SPA built with modern web technologies that:
- Fetches real-time telemetry from the Jolpica F1 REST API
- Syndicates live breaking news from Motorsport.com via an AllOrigins RSS proxy
- Supports deep historical queries (e.g. tracking specific driver lineups from 1950-2026)
- Caches responses for 5 minutes to minimize API load
- Renders a responsive, animation-rich UI with 3D motion effects
- Sources premium high-fidelity imagery dynamically from Wikipedia Commons and Unsplash

## 4. Key Features

| Feature | Description |
|---|---|
| Live Dashboard | Parallax hero with speed lines, floating F1 car, top-6 3D tilt driver cards, recent results, animated stat counters. |
| Breaking News Feed | Real-time masonry grid of F1 news parsing live HTML/XML into a highly readable format with fallback images. |
| Driver Standings | Full active grid with staggered scroll-reveal entrance and TiltCard hover effects. |
| Historical Analytics | Deep-dive constructor pages (`/constructor/:id/season/:year`) detailing exact driver points and final standings for any historical season. |
| Race Calendar | Completed vs upcoming races with hover-lift, flag animations, sprint badges. |
| Race Results | Per-race detailed tables with shimmer skeletons, glowing active tabs. |
| Constructor Profiles | Slide-from-left scroll reveals, team-colored glow progress bars, all-time championship tracking. |
| Global Interactive Effects| Cyan radial gradient orb following the mouse, smooth loaders, and route transitions. |

## 5. Target Audience

- Formula 1 fans seeking a fast, immersive dashboard with live news and stats.
- Developers exploring modern React + TypeScript architecture (Vite, API Proxies).

## 6. Deliverables

- Fully functional SPA with 10+ routes
- Deep historical data architecture
- Premium interactive UI (parallax, 3D tilt, scroll reveals, cursor effects, animated counters)
- Responsive mobile-first design
- Legal compliance (trademark disclaimers) & full attributions page.
