# Pre-Release Checklist (Version 2.0)

Before officially deploying Version 2.0 to a production environment, the following "Pre-Flight Checklist" should be executed to ensure the application is fast, robust, and professional for end-users.

## 🚀 Performance & Optimization
- [ ] **Lazy Loading Routes**: Wrap React Router page components (Dashboard, Settings, Archives, etc.) with `React.lazy()`. This code-splitting technique ensures users only download the JavaScript necessary for the specific page they are viewing, drastically reducing initial load times.
- [ ] **Image Compression**: Convert the high-resolution custom background asset (`public/bg-dark-f1.png`) into a highly compressed format (like WebP) so mobile users on 4G networks do not experience slow DOM paints.

## 🛡️ Resilience & Stability
- [ ] **Global Error Boundaries**: Implement a global React `ErrorBoundary` component. If the Jolpica API fails or a specific driver's page crashes, the app should catch the error and display a sleek *"Pitwall Disconnected: Telemetry lost"* error boundary page instead of throwing a generic white-screen unhandled exception.
- [ ] **Catch-All 404 Interceptor**: Implement a strict `path="*"` catch-all route at the absolute bottom of `App.tsx` that safely redirects invalid or mistyped URLs to a custom 404 "Track Not Found - Return to Pits" page.

## 🌐 SEO & Meta Infrastructure
- [ ] **Dynamic Tab Titles**: Install a tool like `react-helmet` to dynamically alter the browser's tab name based on context (e.g., `"Dashboard | F1 Stats"`, `"Lando Norris | F1 Stats"`).
- [ ] **App Branding Assets**: Overwrite the default Vite/React placeholder graphics in the `public/` directory (`favicon.ico`, `apple-touch-icon.png`) with official custom F1 Stats logos to assure professional PWA and bookmarking representation.

## 🔐 Security Checks
- [ ] **Environment Verification**: Audit the deployment host (Render/Vercel) to absolutely confirm that the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safely loaded as environmental variables and not hardcoded directly into the shipped GitHub repository or bundled code.


