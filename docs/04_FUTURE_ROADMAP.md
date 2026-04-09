# F1 Stats — Future Enhancements Roadmap

| Field | Detail |
|---|---|
| **Document Version** | 4.0 |
| **Date** | March 31, 2026 |
| **Project** | F1 Stats |

---

## Completed Enhancements (v4.0)

| # | Enhancement | Status |
|---|---|---|
| ✅ | **Live Global News Feed** — Motorsport.com RSS via RSS2JSON Proxy with featured article layout | Done |
| ✅ | **Historical Seasons** — Browse past constructor seasons and exact driver lineups (1950–2026) | Done |
| ✅ | **High-Fidelity Media CDN** — Dynamic portrait and hero car mapping via Wikimedia Commons / Unsplash | Done |
| ✅ | **Legal Compliance** — Privacy Policy, Terms of Service, Cookie Policy, Credits & Attributions pages | Done |
| ✅ | **Responsive Mobile UI** — Full mobile optimization across all 19 pages | Done |
| ✅ | **Driver Career Statistics** — Dynamic per-driver career data (championships, wins, poles, season-by-season history) | Done |
| ✅ | **Constructor Career Profiles** — All-time stats (championships, wins, podiums, poles) with season history charts | Done |
| ✅ | **Circuit Encyclopedia** — Full circuit browser with race history, podium records, and Wikipedia-scraped specs | Done |
| ✅ | **Season Calendar** — Detailed schedule with FP1, Qualifying, Sprint, Race times and podium results | Done |
| ✅ | **Settings Panel** — Theme (Dark/Light), accent color, animations, data density, auto-refresh, units, default page | Done |
| ✅ | **Supabase Database Fallback** — Zero-downtime architecture with persistent data cache | Done |
| ✅ | **GitHub Actions Sync** — Automated CRON job syncing data to Supabase every 30 minutes | Done |
| ✅ | **Contact Page** — Contact form with social links | Done |
| ✅ | **DataState Component** — Unified loading/error/empty state handler | Done |
| ✅ | **Layout Refactor** — TopNavBar + SideNavBar + Layout wrapper architecture | Done |
| ✅ | **Telemetry Visualizer** — Telemetry visualization component | Done |

---

## Phase 1 — Short-Term (Next Release)

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 1 | **Driver Head-to-Head Comparison** — Side-by-side stats comparison between 2 drivers | High | Medium |
| 2 | **Qualifying Results** — Add qualifying grouping data tab alongside the Sunday race results | Medium | Low |
| 3 | **Race Countdown Timer** — Live countdown ticking to the next Grand Prix Free Practice 1 | Medium | Low |
| 4 | **Performance Optimization Pass** — `fetchPriority` hints, lazy loading, and `preconnect` directives | Medium | Low |

---

## Phase 2 — Medium-Term

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 5 | **Backend Auth & Accounts** — Replace localStorage auth with JWT + a Node/PostgreSQL backend API | High | High |
| 6 | **Favourites System** — Star drivers/teams to curate a personalized "My Dashboard" feed | Medium | Medium |
| 7 | **Push Notifications** — Automated race start and breaking news alerts | Medium | High |
| 8 | **Fantasy League Integration** — In-house fantasy points display overlay | Medium | Medium |

---

## Phase 3 — Long-Term (Commercialization)

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 9 | **Server-Side Rendering (Next.js)** — Massive SEO rewrite to guarantee 100/100 Lighthouse index scores | High | Very High |
| 10 | **Real-Time Telemetry (WebSockets)** — Implement Python FastF1 to broadcast live GPS car map positions | High | Very High |
| 11 | **Self-Hosted Asset CDN** — Move all Wikipedia/Unsplash links to an owned AWS S3 Bucket for permanent stability | High | Medium |
| 12 | **Native Mobile App** — Compile React components using React Native / Expo for iOS/Android stores | Medium | Extreme |
| 13 | **Freemium Pro Tier** — $3/mo for advanced telemetry, head-to-head comparisons, and ad-free experience | Medium | High |

---

## Technical Debt Addressed

| Item | Description | Status |
|---|---|---|
| **esbuild Vulnerabilities** | Resolved dependency vulnerability flags via npm audit fix | ✅ Done |
| **Reserve Driver Filter** | Created specific filtering logic to exclude reserve/test drivers from standings | ✅ Done |
| **Branding Rename** | Rebranded from "F1 Precision" to "F1 Stats" across entire codebase | ✅ Done |
| **API Resilience** | Implemented 3-tier fallback: in-memory cache → Supabase DB → error | ✅ Done |
| **Mobile Responsiveness** | Standardized responsive padding and typography across all pages | ✅ Done |
| **Theme System** | Implemented Dark/Light mode with CSS variable architecture | ✅ Done |
