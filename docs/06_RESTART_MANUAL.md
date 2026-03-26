# F1 PRECISION — Restart Manual

> Quick reference for getting the app running after a reboot, fresh clone, or any downtime.

---

## After Laptop Restart

```bash
# Open terminal, navigate to project
cd C:\Users\VICTUS\Projects\demo

# Start the dev server
npm run dev
```

App will be live at **http://localhost:3000** — that's it!

---

## After a Fresh Clone

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd demo

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## All Available Commands

| Command | What It Does |
|---|---|
| `npm run dev` | Starts dev server at `localhost:3000` with hot reload |
| `npm run build` | Creates optimized production bundle in `dist/` |
| `npm run preview` | Serves the production build locally for testing |
| `npm test` | Runs the 8 API unit tests |
| `npx tsc --noEmit` | TypeScript type-check without building |

---

## No Backend Required

This app has **zero backend dependencies**:
- No database to start
- No Docker containers to run
- No environment variables to configure
- No API keys needed

All data is fetched from the **Jolpica F1 public API** (`api.jolpi.ca`).

---

## What You'll See

1. **SmoothLoader** — F1-themed splash screen appears for ~2 seconds
2. **CursorGlow** — Subtle cyan glow follows your mouse on desktop
3. **Parallax Hero** — Dashboard hero with floating car and speed lines
4. **Scroll Reveals** — Sections animate in as you scroll down

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` fails | Run `npm install` first to restore dependencies |
| Port 3000 in use | Kill the process or Vite auto-picks next available port |
| Blank page / no data | Check internet — app needs network access for the API |
| Old data showing | Hard refresh (`Ctrl+Shift+R`) to clear in-memory cache |
| `node` not found | Install Node.js 18+ from [nodejs.org](https://nodejs.org) |
| Animations janky | Check hardware acceleration is enabled in browser settings |
