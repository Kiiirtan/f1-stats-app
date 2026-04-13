> [!NOTE]
> **Version 4.0 Blueprint: The Dual-Site Architecture**
> **Drafted:** April 2026 — *The "Two Websites In One" Concept*

## The Goal
To integrate highly advanced, data-heavy features (like OpenF1 Live Telemetry, FastF1 Python traces, and Predictive ML models) **without** sacrificing the clean, blazing-fast, consumer-friendly glassmorphism UI of the main Jolpica-powered tracking app.

The solution is a **Dual-Layout Single Page Application (SPA)**. It will feel exactly like two completely different websites, but will seamlessly exist within the same Vite/React application without requiring hard reloads.

---

## Zone 1: The Main App (Current F1 Stats)

The consumer-facing application that exists today.

* **Data Source:** Jolpica API (Fast, structured, historical REST JSON).
* **Tech Stack:** React, TailwindCSS, Framer Motion.
* **Aesthetic:** Premium, cinematic glassmorphism.
* **Features:** Season Calendar, Standings, Basic Results Hub, News.
* **The Bridge:** We will inject a glowing, high-tech button—perhaps labeled **"ENTER LAB"** or **"TELEMETRY TERMINAL"**—into the main sidebar or dashboard area. Clicking this button triggers the `<Router>` to instantly swap the root layout.

---

## Zone 2: The ML Lab (The New Frontier)

The highly technical, engineer-focused deep-dive zone.

* **Data Source:** OpenF1 (Live Data) & FastF1/Python (Machine Learning & Heavy Telemetry).
* **Tech Stack:** React (UI Phase), backed by a Python/FastAPI Server (Data Crunching Phase).
* **Aesthetic:** "Pitwall Engineer." High contrast, data-dense, dark grid lines, terminal-style navigation interfaces. The glassmorphism sidebar from the Main App disappears completely.
* **The Bridge:** A prominent **"EXIT LAB"** or **"RETURN TO MAIN"** button that instantly remounts the glassmorphism layout and returns the user to Zone 1.

### Planned ML Lab Features:

1. **Live Pitwall Mode**
   - Connect directly to the OpenF1 websocket/API.
   - Stream live throttle, brake, and RPM traces.
   - Display real-time tyre compound choices and track weather data during an active Grand Prix.

2. **Predictive Tire Deg Models**
   - Utilize a custom Python backend (FastF1) to calculate tire degradation curves based on historical stint data.
   - Feed predictive analytics back to the React ML Lab via custom REST endpoints.

3. **Telemetry Overlay Charts**
   - Detailed Lap vs Lap comparison charts.
   - e.g., "Where did Verstappen lose 0.2s to Norris?" mapped out visually using `recharts` or `chart.js`.

4. **Future Race Statistical Prediction Models**
   - Advanced algorithms analyzing historical circuit data, driver streaks, and team performance metrics to generate probable outcomes and race weekend predictions before the Grand Prix begins.

---

## High-Level Implementation Steps

1. **Layout Segregation:** Refactor `App.tsx` from using a single master `<Layout>` to conditional routing:
   - `<Route path="/" element={<MainLayout />}>` (Wraps Dashboard, Drivers, etc.)
   - `<Route path="/lab/*" element={<MLLayout />}>` (Wraps the new technical pages).
2. **Design the ML Layout:** Build an entirely new navigation bar and dark-mode backdrop tailored specifically for technical features.
3. **Establish Python Backend (Future):** Stand up a lightweight FastAPI Python server specifically for querying `FastF1` and running ML scripts, serving the generated findings up to the `/lab` frontend.

---

## Zero-Cost Infrastructure Strategy ($0 Scaling)

It is entirely possible to build and scale both Version 3.0 and Version 4.0 for exactly $0 by strictly enforcing the following architectural rules:

### 1. Version 3.0 Safety (Render Static & Supabase)
- **Render Static Server:** All v3 features (Framer Motion page transitions, 3D `react-three-fiber` models, Interactive Graphs) run entirely **Client-Side** (on the user's device). The free Render static tier simply serves the initial files and goes to sleep, so it will handle Version 3.0 flawlessly with zero memory risk.
- **Supabase Limits:** The free tier provides 50,000 Monthly Active Users (MAU) and 500MB of database space. Since the app only stores simple user profiles and settings, 500MB is massive and presents zero scalability risk.

### 2. Version 4.0 Risks & The "Google Colab Hack"
Developing heavy data-science features runs a high risk of exhausting free-tier server limits. Render's "Web Service" free tier strictly caps out at 512MB of RAM. Attempting to run FastF1 Pandas logic directly on Render will result in an immediate `Out of Memory (OOM) Kill` crash. 

**The Workarounds:**
- **Serverless ML Training:** Run all heavy Python ML computations offline inside **Google Colab** (utilizing their free 12GB RAM and GPUs). Train your predictive tire degradation and race outcome models there, export the final mathematical results as lightweight `.json` files, and host *only* those tiny static files on Render. The React app simply reads the JSON.
- **Client-Side Live Telemetry:** Do **not** funnel OpenF1 Live Telemetry through your Render backend. The sheer volume of live F1 data points during a 2-hour Grand Prix will exceed bandwidth limits violently. Instead, the React application (`/lab`) must query the `openf1.org` WebSocket/REST endpoints *directly* from the user's browser, offloading 100% of the network processing to the client device.
