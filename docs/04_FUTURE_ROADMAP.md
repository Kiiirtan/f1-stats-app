# F1 STATS — Future Enhancements Roadmap

| Field | Detail |
|---|---|
| **Document Version** | 3.0 |
| **Date** | March 27, 2026 |
| **Project** | F1 STATS |

---

## Completed Enhancements (v3.0)

| # | Enhancement | Status |
|---|---|---|
| ✅ | **Live Global News Feed** — Integrating Motorsport.com RSS via AllOrigins Proxy | Done |
| ✅ | **Historical Seasons** — Browse past constructor seasons and exact driver lineups (1950–2026) | Done |
| ✅ | **High-Fidelity Media CDN** — Dynamic portrait and hero car mapping via Wikimedia Commons / Unsplash | Done |
| ✅ | **Legal Compliance Footer** — Added strict F1 Trademark disclaimers and Attributions page | Done |
| ✅ | **Responsive Mobile UI** — Configured complex Tailwind grid flex-wraps for driver season cards | Done |

---

## Phase 1 — Short-Term (Next Release)

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 1 | **Driver Head-to-Head Comparison** — Side-by-side stats comparison between 2 drivers | High | Medium |
| 2 | **Dark/Light Mode Toggle** — Theme switcher in header, persist to localStorage | Medium | Medium |
| 3 | **Qualifying Results** — Add qualifying grouping data tab alongside the Sunday race results | Medium | Low |

---

## Phase 2 — Medium-Term

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 4 | **Backend Auth & Accounts** — Replace localStorage auth with JWT + a Node/PostgreSQL backend API | High | High |
| 5 | **Favourites System** — Star drivers/teams to curate a personalized "My Dashboard" feed | Medium | Medium |
| 6 | **Push Notifications** — Automated race start and breaking news alerts | Medium | High |
| 7 | **Race Countdown Timer** — Live countdown ticking to the next Grand Prix Free Practice 1 | Medium | Low |

---

## Phase 3 — Long-Term (Commercialization)

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 8 | **Server-Side Rendering (Next.js)** — Massive SEO rewrite to guarantee 100/100 Lighthouse index scores | High | Very High |
| 9 | **Real-Time Telemetry (WebSockets)** — Implement Python FastF1 to broadcast live GPS car map positions | High | Very High |
| 10 | **Self-Hosted Asset CDN** — Move all Wikipedia/Unsplash links to an owned AWS S3 Bucket for permanent stability | High | Medium |
| 11 | **Native Mobile App** — Compile React components using React Native / Expo for iOS/Android stores | Medium | Extreme |

---

## Technical Debt Addressed

| Item | Description | Status |
|---|---|---|
| **esbuild Vulnerabilities** | Resolved dependency vulnerability flags via npm audit fix | ✅ Done |
| **Main Driver Standings Filter** | Created specific filtering logic to exclude reserve/test drivers who scored 0 points from historical tables | ✅ Done |
