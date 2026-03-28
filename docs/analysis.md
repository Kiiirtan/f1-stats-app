# F1 Stats Analysis & Monitoring Guide

This document outlines how to monitor the health, traffic, and performance of the F1 Stats application when deployed as a Static Site on [Render's Free Tier](https://render.com/).

---

## 1. Natively Available Metrics (Render Dashboard)

Render's Static Site hosting focuses on delivering your frontend assets (HTML, CSS, JS) as quickly as possible. Because there is no active backend server running Node.js or Python, you **do not** have access to traditional server access logs (like identifying every visitor's IP address or the exact URL they requested). 

Instead, you should monitor the following in your Render Dashboard:

### Bandwidth Usage
- **Limit:** 100 GB per month (Free Tier).
- **Where to find:** Navigate to your Static Site in the Render dashboard and check the **Metrics** or **Bandwidth** tab.
- **Why it matters:** If you serve large, uncompressed images or experience a viral surge in traffic, you might hit this limit, which could result in billing or temporary suspension.

### Build & Deploy Logs
- **Where to find:** Check the **Logs** tab.
- **Why it matters:** This displays the output of your build command (e.g., `npm run build`). If a new feature is pushed to GitHub but fails to deploy, this is where you will diagnose TypeScript errors or missing dependencies.

### Deployment Events
- **Where to find:** Check the **Events** tab.
- **Why it matters:** Displays a historical timeline of all code pushes, rollbacks, and configuration changes made to the live environment.

---

## 2. Implementing Real Visitor Analytics

To understand how users interact with F1 Stats, you must integrate a third-party, client-side analytics tool. This involves adding a small `<script>` tag to your `public/index.html`.

### Recommended Platforms

| Tool | Cost | Best For | Privacy Focus |
| :--- | :--- | :--- | :--- |
| **Google Analytics (GA4)** | Free | Deep, comprehensive demographic and behavioral data | Low (Uses cookies) |
| **Cloudflare Web Analytics** | Free | Lightweight, fast tracking of essential metrics | High (No cookies, relies on edge) |
| **PostHog** | Free Tier | Product analytics, event tracking, and session replays | Medium |
| **Plausible** | Paid / Self-hosted | Extremely lightweight (< 1KB), open-source | High (GDPR compliant) |

**Recommendation for F1 Stats:** Since performance and clean UI are prioritized, **Cloudflare Web Analytics** is an excellent choice. It provides all necessary insights (page views, referrers, device types) without bogging down the application with heavy tracking scripts.

---

## 3. Error Monitoring (Frontend Bugs)

Since the React app executes entirely within the user's browser, if an API request fails (e.g., the Jolpica F1 API experiences downtime) or a UI component crashes, Render will not record it.

To proactively catch bugs before users report them, integrate an error tracking platform like **[Sentry (sentry.io)](https://sentry.io/)**.
- **How it works:** You install their NPM package, and any unhandled JavaScript exceptions are automatically sent to your Sentry dashboard.
- **Benefits:** You receive the exact stack trace, the user's browser version, and the sequence of actions that led to the crash.
- **Cost:** Free Developer Tier available.

---

## 4. Key Performance Indicators (KPIs) to Watch

Once your analytics and monitoring are set up, keep an eye on these specific metrics:

### Core Web Vitals (Lighthouse / PageSpeed Insights)
- **LCP (Largest Contentful Paint):** Should be `< 2.5 seconds`. Measures how fast the main content (like the Hero image or next race data) loads.
- **CLS (Cumulative Layout Shift):** Ensure it stays near `0`. We want to avoid the UI "jumping" around as images or API data finish loading.

### Audience Metrics
- **Device Split (Mobile vs. Desktop):** Ensure that the intensive mobile responsiveness optimizations are holding up by verifying that mobile users stay on the site.
- **Bounce Rate:** A high bounce rate (> 70%) on pages other than the homepage could indicate confusing navigation or slow data rendering.
- **Popular Routes:** Determine if users care more about `/drivers` or `/races` and focus future development efforts accordingly.
