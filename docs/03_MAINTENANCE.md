# F1 Stats — Maintenance Guide

| Field | Detail |
|---|---|
| **Document Version** | 4.0 |
| **Date** | March 31, 2026 |

---

## 1. Project Structure

```
demo/
├── .github/
│   └── workflows/
│       └── sync_f1_data.yml          # GitHub Actions CRON (Supabase sync every 30 min)
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── scripts/
│   └── sync-to-supabase.mjs          # Node.js sync script for GitHub Actions
├── src/
│   ├── __tests__/                     # Vitest API unit tests
│   ├── components/
│   │   ├── features/
│   │   │   ├── DriverCard.tsx         # TiltCard-wrapped driver card with team-color glow
│   │   │   ├── LoginModal.tsx         # Login/Register modal form
│   │   │   ├── MobileMenu.tsx         # Slide-out mobile navigation drawer
│   │   │   ├── SearchModal.tsx        # Full-screen search with real-time filtering
│   │   │   └── TelemetryVisualizer.tsx # Telemetry visualization component
│   │   ├── layout/
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── Layout.tsx             # Main layout wrapper (TopNav + SideNav + content)
│   │   │   ├── SideNavBar.tsx         # Desktop left navigation
│   │   │   └── TopNavBar.tsx          # Fixed top navigation bar
│   │   └── ui/
│   │       ├── CursorGlow.tsx         # Mouse-following cyan glow effect
│   │       ├── DataState.tsx          # Loading/error/empty state handler
│   │       ├── ErrorBoundary.tsx      # React error boundary
│   │       ├── PageTransition.tsx     # Route transition animations
│   │       ├── ScrollReveal.tsx       # Viewport-triggered fade+slide entrance
│   │       ├── SkeletonCard.tsx       # Shimmer loading placeholder
│   │       ├── SmoothLoader.tsx       # F1-themed splash screen
│   │       ├── TiltCard.tsx           # 3D perspective tilt on hover
│   │       └── Tooltip.tsx            # Hover tooltip component
│   ├── context/
│   │   ├── AuthContext.tsx            # Authentication context (localStorage-based)
│   │   └── SettingsContext.tsx         # Settings context (theme, accent, animations, etc.)
│   ├── data/
│   │   ├── api.ts                     # API layer + cache + Supabase fallback (Jolpica + RSS)
│   │   └── driverImages.ts           # Wikimedia Commons asset linking logic
│   ├── hooks/
│   │   ├── useCountUp.ts             # Animated number counter (scroll-triggered)
│   │   ├── useDrivers.ts             # Driver data fetching hook
│   │   ├── useInView.ts              # Intersection Observer hook
│   │   └── useMousePosition.ts       # Cursor tracking hook
│   ├── lib/
│   │   └── supabase.ts               # Supabase client + sync/fetch utilities
│   ├── pages/
│   │   ├── CircuitProfile.tsx         # Individual circuit details + race history
│   │   ├── Circuits.tsx               # All circuits browser
│   │   ├── ConstructorProfile.tsx     # Constructor overview + career stats
│   │   ├── ConstructorSeasonDetails.tsx # Historical season deep-dive
│   │   ├── Constructors.tsx           # Constructor standings page
│   │   ├── Contact.tsx                # Contact form page
│   │   ├── Cookies.tsx                # Cookie Policy page
│   │   ├── Credits.tsx                # Attributions & Legal page
│   │   ├── Dashboard.tsx              # Home dashboard with parallax hero
│   │   ├── DriverProfile.tsx          # Driver details + career history
│   │   ├── Drivers.tsx                # Driver standings grid
│   │   ├── News.tsx                   # Live RSS Breaking News Feed
│   │   ├── NotFound.tsx               # 404 "OFF TRACK" page
│   │   ├── Privacy.tsx                # Privacy Policy page
│   │   ├── Races.tsx                  # Race calendar page
│   │   ├── Results.tsx                # Race results with tabs
│   │   ├── SeasonCalendar.tsx         # Detailed season calendar with sessions
│   │   ├── Settings.tsx               # User settings page
│   │   └── Terms.tsx                  # Terms of Service page
│   ├── App.tsx                        # Root routing component
│   ├── index.css                      # Base Tailwind + custom utilities
│   └── main.tsx                       # Entry point
├── tailwind.config.js                 # Tailwind design system tokens
├── vite.config.ts                     # Vite build configuration
└── package.json                       # Dependencies & scripts
```

---

## 2. Development Setup

```bash
# Prerequisites: Node.js 18+

# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Run tests
npm test

# Production build
npm run build
```

### Environment Variables (Optional — for Supabase fallback)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If not provided, the app works normally without the database fallback layer.

---

## 3. How to Add a New Page

1. Create `src/pages/NewPage.tsx`
2. Add a route in `src/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add a nav link in `src/components/layout/SideNavBar.tsx` → `navItems` array
4. Add a corresponding entry in `src/components/layout/TopNavBar.tsx` if needed
5. Wrap sections in `<ScrollReveal>` for entrance animations
6. Set `document.title` and meta description in `useEffect`

## 4. How to Add a New API Endpoint

1. Open `src/data/api.ts`
2. Define raw API types matching the Jolpica response
3. Define an app-level type for UI consumption
4. Create an `async` function using `fetchWithCache(url)`
5. Transform raw data into app types
6. Export the function
7. Data will automatically sync to Supabase (if configured) and fall back on API failure

## 5. How to Add a New Animation

1. Open `src/index.css`
2. Add a `@keyframes` block and a utility class in `@layer utilities`
3. Apply in components via `className`

## 6. How to Modify the Design System

Colors, fonts, and tokens are defined in `tailwind.config.js`:

### Material Design 3 Color Tokens
- `primary`, `primary-container`, `on-primary` — Red accent palette
- `secondary`, `secondary-container` — Neutral supporting tones
- `tertiary`, `tertiary-container` — Blue accent palette
- `surface`, `surface-container-*` — Background and card surfaces
- `on-surface`, `on-background` — Text colors
- `error`, `outline`, `outline-variant` — Semantic tokens

### Legacy Color Tokens
- `c-10`, `c-30`, `c-60` — Original cyan/dark palette tokens
- `t-main`, `t-bright` — Text tokens

### Typography
- `font-headline` (Space Grotesk) — Headlines, labels, navigation
- `font-body` (Inter) — Body text, paragraphs

### Custom Spacing & Sizing
- Extended spacing scale (18, 22, 30, 34, 42, 50)
- Display font sizes (display, display-lg, display-xl)
- Custom glow box shadows (glow-sm, glow-md, glow-lg)

### CSS Variables
- `--theme-accent` — Dynamic accent color (set via Settings panel)

---

## 7. API Dependency

**Primary Endpoint**: `https://api.jolpi.ca/ergast/f1`
**Fallback**: Supabase PostgreSQL Database

| Concern | Current State |
|---|---|
| Auth required? | No |
| Rate limiting? | Unknown — mitigated by 5-min cache |
| Breaking changes? | Possible — would require `api.ts` updates |
| Fallback? | In-memory stale cache → Supabase DB → error |
| Sync frequency? | Every 30 minutes via GitHub Actions |

---

## 8. Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| No SSR | SEO limited to static meta tags | Migrate to Next.js for SSR |
| In-memory cache | Clears on refresh | Supabase fallback ensures continuity |
| No component tests | Only API layer tested | Add React Testing Library tests |
| Cursor glow hidden on mobile | Touch devices don't have mouse hover | Effect gracefully hidden |
| Wikipedia image dependency | Images may break if renamed/removed | Self-hosted CDN planned |
| localStorage auth | Demo-quality only | Replace with proper auth before production |
