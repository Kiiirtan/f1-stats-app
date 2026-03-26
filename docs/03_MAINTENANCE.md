# F1 PRECISION — Maintenance Guide

| Field | Detail |
|---|---|
| **Document Version** | 2.0 |
| **Date** | March 25, 2026 |

---

## 1. Project Structure

```
demo/
├── public/
│   ├── favicon.svg
│   └── manifest.json
├── src/
│   ├── __tests__/
│   │   └── api.test.ts              # 8 API tests
│   ├── components/
│   │   ├── CursorGlow.tsx            # Global cursor-following glow
│   │   ├── DriverCard.tsx            # 3D tilt driver card
│   │   ├── ErrorBoundary.tsx         # React error boundary
│   │   ├── Footer.tsx                # Site footer
│   │   ├── Header.tsx                # Fixed nav bar
│   │   ├── LoginModal.tsx            # Auth modal
│   │   ├── MobileMenu.tsx            # Mobile nav drawer
│   │   ├── PageTransition.tsx        # Route animation wrapper
│   │   ├── ScrollReveal.tsx          # Scroll-triggered entrance
│   │   ├── SearchModal.tsx           # Global search overlay
│   │   ├── SkeletonCard.tsx          # Loading placeholder
│   │   ├── SmoothLoader.tsx          # F1 splash screen
│   │   ├── TiltCard.tsx              # 3D perspective tilt wrapper
│   │   └── Tooltip.tsx               # Hover tooltip for UI elements
│   ├── context/
│   │   └── AuthContext.tsx           # Auth state (localStorage)
│   ├── data/
│   │   └── api.ts                    # API layer + cache + retry
│   ├── hooks/
│   │   ├── useCountUp.ts            # Animated number counter with scroll trigger
│   │   ├── useInView.ts             # Intersection Observer
│   │   └── useMousePosition.ts      # Cursor position tracking
│   ├── pages/
│   │   ├── Constructors.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DriverProfile.tsx
│   │   ├── Drivers.tsx
│   │   ├── NotFound.tsx
│   │   ├── Races.tsx
│   │   └── Results.tsx
│   ├── App.tsx                       # Root component
│   ├── index.css                     # Animations + base styles
│   └── main.tsx                      # Entry point
├── docs/                             # Documentation
├── index.html                        # HTML shell
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
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

No environment variables, databases, or Docker needed.

---

## 3. How to Add a New Page

1. Create `src/pages/NewPage.tsx`
2. Add a route in `src/App.tsx`:
   ```tsx
   <Route path="/new-page" element={<NewPage />} />
   ```
3. Add a nav link in `src/components/Header.tsx` → `navLinks` array
4. Wrap sections in `<ScrollReveal>` for entrance animations
5. Set `document.title` and meta description in `useEffect`

## 4. How to Add a New API Endpoint

1. Open `src/data/api.ts`
2. Define raw API types matching the Jolpica response
3. Define an app-level type for UI consumption
4. Create an `async` function using `fetchWithCache(url)`
5. Transform raw data into app types
6. Export the function

## 5. How to Add a New Animation

1. Open `src/index.css`
2. Add a `@keyframes` block and a utility class in `@layer utilities`
3. Apply in components via `className`

## 6. How to Modify the Design System

Colors and fonts are defined in `tailwind.config.js`:
- `c-60`, `c-30`, `c-20`, `c-10` — color tokens
- `t-main`, `t-bright` — text tokens
- `font-headline`, `font-body`, `font-label` — typography

---

## 7. API Dependency

**Endpoint**: `https://api.jolpi.ca/ergast/f1`

| Concern | Current State |
|---|---|
| Auth required? | No |
| Rate limiting? | Unknown — mitigated by 5-min cache |
| Breaking changes? | Possible — would require `api.ts` updates |
| Fallback? | Stale cache + retry logic |

---

## 8. Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| localStorage auth | Passwords in plaintext | Replace with proper auth before production |
| No SSR | SEO limited to static meta tags | Migrate to Next.js for SSR |
| In-memory cache | Clears on refresh | Acceptable for SPA — always fresh on new session |
| No component tests | Only API layer tested | Add React Testing Library tests |
| Cursor glow hidden on mobile | Touch devices don't have mouse hover | Effect gracefully hidden via `hidden md:block` |
