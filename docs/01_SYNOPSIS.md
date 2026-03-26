# F1 PRECISION — Project Synopsis

| Field | Detail |
|---|---|
| **Project Title** | F1 PRECISION — Live F1 Dashboard |
| **Version** | 2.0.0 |
| **Date** | March 25, 2026 |
| **Technology** | React 18, TypeScript, Vite, Tailwind CSS |
| **Data Source** | Jolpica F1 API (Ergast successor) |
| **Status** | Production-ready |

---

## 1. Overview

F1 PRECISION is a real-time Formula 1 web dashboard that delivers live championship standings, race calendars, detailed race results, constructor rankings, and individual driver profiles. The application consumes authentic data from the Jolpica F1 API and presents it through a **premium, immersive, dark-themed interface** featuring **3D tilt cards, parallax scrolling, cursor-interactive effects, scroll-triggered reveals, and micro-animations** — optimized for both desktop and mobile.

## 2. Problem Statement

F1 fans lack a fast, visually engaging, single-page application to track live standings, browse race results, and explore driver statistics — all in one place — without relying on heavy, ad-laden sports portals.

## 3. Proposed Solution

A lightweight SPA built with modern web technologies that:
- Fetches real-time data from the Jolpica F1 REST API
- Caches responses for 5 minutes to minimize API load
- Retries failed requests with exponential backoff (3 attempts)
- Renders a responsive, animation-rich UI with 3D motion effects
- Features cursor-following glow, parallax hero, and scroll-triggered reveals
- Supports client-side auth (localStorage) for personalized features

## 4. Key Features

| Feature | Description |
|---|---|
| Live Dashboard | Parallax hero with speed lines, floating F1 car, top-6 3D tilt driver cards, recent results, animated stat counters (`useCountUp`) |
| Driver Standings | Full grid with staggered scroll-reveal entrance and TiltCard hover effects |
| Driver Profiles | Parallax glow orbs, text-reveal animation, TiltCard stats with animated counters, win history |
| Race Calendar | Completed vs upcoming races with hover-lift, flag animations, sprint badges |
| Race Results | Per-race detailed tables with shimmer skeletons, glowing active tabs |
| Constructor Standings | Slide-from-left scroll reveals, team-colored glow progress bars, animated point counters |
| Cursor Glow | Cyan radial gradient orb following the mouse globally |
| Smooth Loader | F1-themed splash screen with racing progress bar |
| Tooltips | Hover tooltips on header icons with top/bottom positioning |
| Global Search | Real-time search across drivers, races, circuits |
| Auth System | Login/register with localStorage persistence |
| 404 Page | Themed "OFF TRACK" catch-all for unknown routes |

## 5. Target Audience

- Formula 1 fans seeking a fast, immersive dashboard
- Developers exploring modern React + TypeScript architecture
- Students studying SPA design patterns, API integration, and interactive UI

## 6. Deliverables

- Fully functional SPA with 7 routes
- 14 reusable components and 3 custom hooks
- Premium interactive UI (parallax, 3D tilt, scroll reveals, cursor effects, animated counters)
- Responsive design (mobile → desktop)
- Automated test suite (8 tests across 7 describe blocks)
- SEO-optimized with Open Graph and Twitter Card meta
- PWA manifest for installability
- 6 professional documentation files
