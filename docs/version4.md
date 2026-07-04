> [!NOTE]
> **Version 4.0 Blueprint: The Dual-Site Architecture & Hugging Face Hybrid Cloud**
> **Updated:** July 2026 — *The "Two Websites In One" Concept powered by Hugging Face Spaces*

## The Goal
To integrate highly advanced, data-heavy features (like OpenF1 Live Telemetry, FastF1 Python traces, and Predictive ML models) **without** sacrificing the clean, blazing-fast, consumer-friendly glassmorphism UI of the main Jolpica-powered tracking app.

The solution is a **Dual-Layout Single Page Application (SPA)** backed by a **Hugging Face Hybrid Cloud**. It will feel exactly like two completely different websites, but will seamlessly exist within the same Vite/React application without requiring hard reloads or expensive server bills.

---

## Zone 1: The Main App (Current F1 Stats)

The consumer-facing application that exists today.

* **Data Source:** Jolpica API (Fast, structured, historical REST JSON).
* **Tech Stack:** React, TailwindCSS, Framer Motion (Hosted on Render Static).
* **Aesthetic:** Premium, cinematic glassmorphism.
* **Features:** Season Calendar, Standings, Basic Results Hub, News, Live Telemetry (`/telemetry`).
* **The Bridge:** We will inject a glowing, high-tech button—perhaps labeled **"ENTER LAB"** or **"TELEMETRY TERMINAL"**—into the main sidebar or dashboard area. Clicking this button triggers the `<Router>` to instantly swap the root layout.

---

## Zone 2: The ML Lab (The New Frontier)

The highly technical, engineer-focused deep-dive zone.

* **Data Source:** OpenF1 (Live Data) & FastF1/Python (Machine Learning & Heavy Telemetry).
* **Tech Stack:** React (UI Phase on Render), backed by a custom Python/FastAPI Docker engine hosted on **Hugging Face Spaces** (Data Crunching & ML Inference Phase).
* **Alternative UI Mode:** Can optionally embed a native Python **Gradio / Streamlit** UI directly from Hugging Face for dedicated researcher tabs.
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
3. **Establish Python Backend on Hugging Face Spaces:** Stand up a FastAPI Python server inside a Docker container on **Hugging Face Spaces** (leveraging their free 16 GB RAM CPU tier) specifically for querying `FastF1`, parsing Pandas telemetry DataFrames, and running ML prediction models, serving REST endpoints directly to the `/lab` frontend.

---

## Zero-Cost Infrastructure Strategy ($0 Scaling)

It is entirely possible to build and scale both Version 3.0 and Version 4.0 for exactly $0 by strictly enforcing the following architectural rules:

### 1. Version 3.0 Safety (Render Static & Supabase)
- **Render Static Server:** All v3 features (Framer Motion page transitions, 3D `react-three-fiber` models, Interactive Graphs) run entirely **Client-Side** (on the user's device). The free Render static tier simply serves the initial files and goes to sleep, so it will handle Version 3.0 flawlessly with zero memory risk.
- **Supabase Limits:** The free tier provides 50,000 Monthly Active Users (MAU) and 500MB of database space. Since the app only stores simple user profiles and settings, 500MB is massive and presents zero scalability risk.

### 2. Version 4.0 Architecture: The Hugging Face Spaces Hybrid Cloud ($0 Solution)
Developing heavy data-science features runs a high risk of exhausting standard cloud server limits. Render's "Web Service" free tier strictly caps out at 512 MB of RAM. Attempting to run FastF1 Pandas logic directly on Render will result in an immediate `Out of Memory (OOM) Kill` crash.

**The Solution: Hugging Face Spaces (Free CPU Basic Tier)**
Instead of relying on offline Google Colab exports, we offload all ML data computation to **Hugging Face Spaces**, creating a true **Hybrid Cloud Architecture**:

- **16 GB RAM & 2 vCPUs for Free:** Hugging Face Spaces provides **32x more RAM** than Render's free server tier. This allows live loading of FastF1 telemetry caches, Pandas DataFrame transformations, Scikit-Learn regression models, and XGBoost race strategy simulators directly in memory without OOM crashes.
- **Option A (Headless ML API Backend ⭐):** Deploy a FastAPI + Uvicorn Docker container to Hugging Face Spaces. The Vite/React SPA on Render makes REST queries to `https://<space-name>.hf.space/api/...` when a user enters the `/lab` zone. This preserves our custom Apple TV / Pitwall dark glassmorphism UI while Hugging Face acts as our high-performance math backend.
- **Option B (Embedded Gradio/Streamlit UI):** Alternatively, Python engineers can build interactive dashboards using Gradio or Streamlit natively on Hugging Face Spaces, which can be linked or embedded into the React SPA via `<iframe>` for deep research work without writing frontend code.
- **Cold-Start Mitigation:** Free CPU spaces sleep after 48 hours of inactivity. To prevent the 30–60 second cold-start delay for users entering the ML Lab, configure a free uptime monitoring service (such as UptimeRobot or a simple cron job) to ping the FastAPI `/health` endpoint once every 24 hours.
- **Client-Side Live Telemetry:** For real-time 20Hz timing during an active Grand Prix, do **not** funnel OpenF1 telemetry through Render or Hugging Face. The React application (`/lab` or `/telemetry`) must continue querying the `openf1.org` REST and WebSocket endpoints *directly* from the user's browser, offloading 100% of high-frequency bandwidth to the client device.
