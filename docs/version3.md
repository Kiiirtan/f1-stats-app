> [!NOTE]
> **Suggested Roadmap & Expansions (v3.0)**

## Privacy and Security Audit (Pre-Public Launch)

As we prepare to make the repository public on GitHub, we must ensure all sensitive data is secured. The following steps are required:

1. **Remove Hardcoded Secrets & Environment Files**
   - Ensure `.env` and `.env.production` files are robustly ignored by `.gitignore` (already verified).
   - Verify no Supabase credentials or other API keys are hardcoded in the codebase, `render.yaml`, or `vercel.json`.
   - Create a `.env.example` with dummy values for public developers.

2. **Git History Cleanup**
   - Review Git history for accidental commits of API keys or `.env` files. If any exist, rotate all secrets (generate new Supabase Anon keys) before making the repository public to prevent historical token scraping.

3. **Database Security (Supabase RLS)**
   - Protect against malicious use of the public `VITE_SUPABASE_ANON_KEY` by enforcing Row Level Security (RLS) on all Supabase tables. Ensure anonymous users have restricted access (e.g., read-only).

4. **Clean up Temporary & Log Files**
   - Review and purge root debug and log files (e.g., `test_errors.txt`, `tmp_silverstone_debug.js`) to prevent leakage of internal paths, stack traces, or project metadata.

5. **Private Documentation Audit**
   - Audit `README.md` and the `docs/` directory to ensure no private IPs, local file paths, or custom deployment commands intended only for private development are exposed.

***

## Suggested Features (v3.0)

> 1. **Cinematic Page Transitions (`framer-motion`)**
> Navigating between the Dashboard, Drivers, and Archives can be enhanced from an instantaneous jump to smooth animations where the glass cards glide into view, stagger their appearance, and fade out elegantly whenever the route changes.
> 
> 2. **Interactive Telemetry Graphs**
> On the Driver or Circuit profile pages, we could implement sleek, glowing line charts (using a library like `recharts` or `chart.js`). Picture comparing Max and Lando’s lap-time differentials on a graph with glowing neon lines against the dark background.
> 
> 3. **Local Sound Design**
> Subtle micro-audio is what separates web apps from "digital products." We could add barely-audible, high-quality UI soft-clicks when you intentionally hover and trigger the 3D flip-card menus, and a satisfying aerodynamic "whoosh" when opening the search modal.
> 
> 4. **Live Race Center "Pitwall Mode"**
> We could carve out a special "Live Mode" screen with a scrolling ticker, where if a race is currently active, data polls aggressively every few seconds to show live tyre changes, sector times, and intervals—mimicking the real-time telemetry screens F1 engineers look at on the pitwall.
> 
> 5. **Custom 3D Model Integration**
> Instead of just static images for the Constructor/Team pages, we could use `react-three-fiber` to render a lightweight 3D wireframe or model of a Formula 1 car that the user can click and drag to rotate right in the browser!


ver.4
 live telementry with openf1 api