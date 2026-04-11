# F1 Stats — Performance Optimization Backlog

> **Last Updated:** April 11, 2026 — Current version: v2.0.1.0

*This plan has been intentionally deferred. It serves as a backlog reference if the application encounters Lighthouse performance issues, high bandwidth usage warnings, or mobile rate-limiting from Wikipedia's servers when traffic scales. Some items (like skeleton loaders) have already been implemented independently.*

---

## Proposed Changes (Backlog)

### 1. `index.html` (Network Optimizations)
We will add browser hints to the `<head>` of the entry file to instruct the browser to resolve DNS and establish TLS connections to our critical external APIs before the JavaScript bundle even finishes parsing.
#### [MODIFY] `index.html`
- Add `<link rel="preconnect" href="https://upload.wikimedia.org" crossorigin />`
- Add `<link rel="preconnect" href="https://api.jolpi.ca" crossorigin />`
- Add `<link rel="dns-prefetch" href="https://api.rss2json.com" />`
- Add `<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />` (for Google Fonts)

### 2. High-Priority "Above the Fold" Assets
For heavy hero images (the driver portraits and constructor cars at the very top of their respective profile pages), we will use HTML5 priority hints to tell the browser's Network layer to download them immediately, avoiding Largest Contentful Paint (LCP) delays.
#### [MODIFY] `src/pages/ConstructorProfile.tsx`
- Add `fetchPriority="high"` and `decoding="sync"` to the main hero `<img />` tag.
#### [MODIFY] `src/pages/ConstructorSeasonDetails.tsx`
- Add `fetchPriority="high"` to the hero `<img />` tag.
#### [MODIFY] `src/pages/DriverProfile.tsx`
- Add `fetchPriority="high"`, `decoding="sync"`, and `loading="eager"` to the driver portrait `<img />` tag.
#### [MODIFY] `src/pages/CircuitProfile.tsx`
- Add `fetchPriority="high"` to the track diagram `<img />` tag.

### 3. "Below the Fold" Lazy Loading
For images that the user does not see immediately upon page load (like the many thumbnails in the News grid), we will instruct the browser to defer downloading them until the user scrolls them into view. This saves massive amounts of initial bandwidth.
#### [MODIFY] `src/pages/News.tsx`
- Add `fetchPriority="high"` and `loading="eager"` to the **Featured Article** image.
- Add `loading="lazy"` and `decoding="async"` to the `gridArticles.map` images.
#### [MODIFY] `src/pages/Circuits.tsx`
- Add `loading="lazy"` to circuit thumbnails in the grid.

### 4. Code Splitting & Route-Level Lazy Loading
For pages that users visit less frequently, we will implement React.lazy() to split them into separate bundles.
#### [MODIFY] `src/App.tsx`
- Wrap infrequently-visited pages (Privacy, Terms, Cookies, Credits, Contact) in `React.lazy()` with `<Suspense>` fallback.
- This reduces the initial JavaScript bundle size.

### 5. Supabase Query Optimization
#### [MODIFY] `src/lib/supabase.ts`
- Add TTL check on Supabase fallback data — warn user if data is > 2 hours old.
- Implement batch upsert for sync script performance.
