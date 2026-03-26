# F1 PRECISION — Future Enhancements Roadmap

| Field | Detail |
|---|---|
| **Document Version** | 2.0 |
| **Date** | March 25, 2026 |
| **Project** | F1 PRECISION |

---

## Completed Enhancements (v2.0)

| # | Enhancement | Status |
|---|---|---|
| ✅ | **Smooth Loader** — F1-themed splash screen with animated progress bar | Done |
| ✅ | **3D Tilt Cards** — Perspective rotation with specular shine on hover | Done |
| ✅ | **Cursor Glow** — Cyan radial gradient following the mouse globally | Done |
| ✅ | **Scroll Reveals** — Viewport-triggered fade+slide entrance animations | Done |
| ✅ | **Parallax Hero** — 3-layer depth with floating F1 car and speed lines | Done |
| ✅ | **Text Reveal** — Clip-path heading animations | Done |
| ✅ | **Micro-Interactions** — Hover lift/glow, button ripple, flag scale, shimmer skeletons | Done |

---

## Phase 1 — Short-Term (Next Release)

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 1 | **Dark/Light Mode Toggle** — Theme switcher in header, persist to localStorage | High | Medium |
| 2 | **Driver Comparison** — Side-by-side stats comparison between 2 drivers | High | Medium |
| 3 | **Qualifying Results** — Add qualifying data tab alongside race results | Medium | Low |
| 4 | **Lap Chart Visualization** — Position changes over laps using SVG chart | Medium | High |
| 5 | **Real F1 Car Images** — Replace emoji with high-quality car assets via CDN | Medium | Low |

---

## Phase 2 — Medium-Term

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 6 | **Backend Auth** — Replace localStorage auth with JWT + backend API | High | High |
| 7 | **Favourites System** — Star drivers/teams for personalized dashboard | Medium | Medium |
| 8 | **Push Notifications** — Race start and results alerts | Medium | High |
| 9 | **Race Countdown Timer** — Live countdown to next Grand Prix | Medium | Low |
| 10 | **Historical Seasons** — Browse past seasons (2020–2025) | Medium | Medium |

---

## Phase 3 — Long-Term

| # | Enhancement | Priority | Effort |
|---|---|---|---|
| 11 | **Full PWA** — Offline support with service worker | High | High |
| 12 | **Server-Side Rendering** — Migrate to Next.js for SEO and performance | Medium | High |
| 13 | **Real-Time Data** — WebSocket for live race telemetry | Low | High |
| 14 | **Multi-Language Support** — i18n for global audience | Low | Medium |
| 15 | **Analytics Dashboard** — Performance trends with charts | Medium | High |

---

## Technical Debt

| Item | Description | Effort |
|---|---|---|
| Auth refactor | Move from plaintext localStorage to hashed credentials or external auth | High |
| State management | Consider React Query / TanStack Query to replace `fetchWithCache` | Medium |
| Component tests | Add React Testing Library tests for DriverCard, TiltCard, Header | Medium |
| E2E tests | Add Playwright for full user-flow testing | High |
| Accessibility audit | WCAG 2.1 AA compliance (ARIA labels, focus, contrast) | Medium |

---

## Migration Considerations

| If You Want To… | Recommended Approach |
|---|---|
| Add a backend | Express/Fastify + PostgreSQL, or Firebase |
| Use SSR | Migrate to Next.js (App Router) |
| Switch UI framework | shadcn/ui components for Tailwind consistency |
| Deploy globally | Vercel Edge or Cloudflare Pages |
| Add real-time | Socket.io or Server-Sent Events |
