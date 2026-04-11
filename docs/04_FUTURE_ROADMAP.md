# F1 Stats — Future Enhancements Roadmap

| Field | Detail |
|---|---|
| **Document Version** | 4.0 |
| **Date** | March 31, 2026 |
| **Project** | F1 Stats |

---

## ✅ What's Done

| # | Enhancement | Version | Category |
|---|---|---|---|
| 1 | **Live Global News Feed** — Motorsport.com RSS via RSS2JSON Proxy with featured article layout | v1.1.0 | Feature |
| 2 | **Historical Seasons** — Browse past constructor seasons and exact driver lineups (1950–2026) | v1.1.0 | Feature |
| 3 | **High-Fidelity Media CDN** — Dynamic portrait and hero car mapping via Wikimedia Commons / Unsplash | v1.0.0 | Feature |
| 4 | **Legal Compliance** — Privacy Policy, Terms of Service, Cookie Policy, Credits & Attributions pages | v1.0.0 | Feature |
| 5 | **Responsive Mobile UI** — Full mobile optimization across all 19 pages | v1.0.3 | Feature |
| 6 | **Driver Career Statistics** — Dynamic per-driver career data (championships, wins, poles, season-by-season history) | v1.0.0 | Feature |
| 7 | **Constructor Career Profiles** — All-time stats (championships, wins, podiums, poles) with season history charts | v1.1.0 | Feature |
| 8 | **Circuit Encyclopedia** — Full circuit browser with race history, podium records, and Wikipedia-scraped specs | v1.2.0 | Feature |
| 9 | **Season Calendar** — Detailed schedule with FP1, Qualifying, Sprint, Race times and podium results | v2.0.0 | Feature |
| 10 | **Settings Panel** — Theme (Dark/Light), accent color, animations, data density, auto-refresh, units, default page | v1.0.0 | Feature |
| 11 | **Supabase Database Fallback** — Zero-downtime architecture with persistent data cache | v1.3.0 | Infrastructure |
| 12 | **GitHub Actions Sync** — Automated CRON job syncing data to Supabase every 30 minutes | v1.3.0 | Infrastructure |
| 13 | **Contact Page** — Contact form with social links | v1.0.0 | Feature |
| 14 | **DataState Component** — Unified loading/error/empty state handler | v2.0.0 | Component |
| 15 | **Layout Refactor** — TopNavBar + SideNavBar + Layout wrapper architecture | v2.0.0 | Architecture |
| 16 | **Telemetry Visualizer** — Telemetry visualization component | v1.0.0 | Component |
| 17 | **Supabase Authentication** — Real email/password auth replacing demo localStorage system | v2.0.0 | Feature |
| 18 | **Notifications Tray** — In-app notification system with real-time alerts | v2.0.0 | Feature |
| 19 | **Skeleton Loaders** — Premium page-specific shimmer loading states | v2.0.0 | Component |
| 20 | **Dynamic SEO** — Per-page dynamic `<title>` and meta tags via `useDocumentMeta` hook | v2.0.0 | Feature |
| 21 | **Render Deployment** — Full production deployment on Render Cloud Infrastructure | v2.0.0 | Infrastructure |
| 22 | **Cloudflare Web Analytics** — Production-grade traffic monitoring | v1.2.1 | Infrastructure |
| — | **esbuild Vulnerabilities** — Resolved dependency vulnerability flags via npm audit fix | v1.0.0 | Tech Debt |
| — | **Reserve Driver Filter** — Filtering logic to exclude reserve/test drivers from standings | v1.0.0 | Tech Debt |
| — | **Branding Rename** — Rebranded from "F1 Precision" to "F1 Stats" across entire codebase | v1.0.0 | Tech Debt |
| — | **API Resilience** — Implemented 3-tier fallback: in-memory cache → Supabase DB → error | v1.3.0 | Tech Debt |
| — | **Mobile Responsiveness** — Standardized responsive padding and typography across all pages | v2.0.0 | Tech Debt |
| — | **Theme System** — Implemented Dark/Light mode with CSS variable architecture | v2.0.0 | Tech Debt |

---

## 🔲 What's Remaining

### Phase 1 — Short-Term (Next Release)

| # | Enhancement | Priority | Effort | Status |
|---|---|---|---|---|
| 1 | **Driver Head-to-Head Comparison** — Side-by-side stats comparison between 2 drivers | High | Medium | 🔲 Pending |
| 2 | **Qualifying Results** — Add qualifying grouping data tab alongside the Sunday race results | Medium | Low | 🔲 Pending |
| 3 | **Race Countdown Timer** — Live countdown ticking to the next Grand Prix Free Practice 1 | Medium | Low | 🔲 Pending |
| 4 | **Performance Optimization Pass** — `fetchPriority` hints, lazy loading, and `preconnect` directives | Medium | Low | 🔲 Pending |

### Phase 2 — Medium-Term

| # | Enhancement | Priority | Effort | Status |
|---|---|---|---|---|
| 5 | **Favourites System** — Star drivers/teams to curate a personalized "My Dashboard" feed | Medium | Medium | 🔲 Pending |
| 6 | **Push Notifications** — Automated race start and breaking news alerts | Medium | High | 🔲 Pending |
| 7 | **Fantasy League Integration** — In-house fantasy points display overlay | Medium | Medium | 🔲 Pending |

### Phase 3 — Long-Term (Commercialization)

| # | Enhancement | Priority | Effort | Status |
|---|---|---|---|---|
| 8 | **Server-Side Rendering (Next.js)** — Massive SEO rewrite to guarantee 100/100 Lighthouse index scores | High | Very High | 🔲 Pending |
| 9 | **Real-Time Telemetry (WebSockets)** — Implement Python FastF1 to broadcast live GPS car map positions | High | Very High | 🔲 Pending |
| 10 | **Self-Hosted Asset CDN** — Move all Wikipedia/Unsplash links to an owned AWS S3 Bucket for permanent stability | High | Medium | 🔲 Pending |
| 11 | **Native Mobile App** — Compile React components using React Native / Expo for iOS/Android stores | Medium | Extreme | 🔲 Pending |
| 12 | **Freemium Pro Tier** — $3/mo for advanced telemetry, head-to-head comparisons, and ad-free experience | Medium | High | 🔲 Pending |
