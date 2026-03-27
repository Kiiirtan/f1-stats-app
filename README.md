<h1 align="center">🏎️ F1 Stats Dashboard</h1>

<p align="center">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<p align="center">
  <b>Live Application:</b> <a href="https://statsf1web.onrender.com">statsf1web.onrender.com</a>
</p>

A premium, high-fidelity real-time Formula 1 web application designed to track the 2026 World Championship grid. Built with React and Vite, this dashboard consumes live telemetry APIs to visualize driver standings, aerodynamic insights, and global constructor metrics.

---

## ✨ Features

- **🏆 Real-Time Grid Standings:** Live tracking of all 22 active drivers and 11 constructors across the modern season relying on the Jolpica API.
- **📰 Live Breaking News Feed:** Directly syncs with Motorsport.com via an RSS XML proxy, delivering instant, up-to-the-minute global coverage and breaking stories without leaving the dashboard.
- **📚 Historical Season Analytics:** Deep-dive into any constructor's past. View season-by-season performance, exact points contributed by primary drivers, final positioning, and historic team principals.
- **🖼️ High-Fidelity Imagery:** Seamless fallback integration with Wikimedia Commons and Unsplash for premium, globally-accessible driver portraits and hero car backgrounds.
- **🎨 Dynamic Theming Engine:** The UI accent colors dynamically shift to match the exact hexadecimal branding of your favorite Constructor (e.g., Ferrari Red, Mercedes Teal) without touching any CSS.
- **📱 Responsive Glassmorphism:** Fully optimized mobile-first experiences built on TailwindCSS, featuring backdrop blur filters, smooth route transitions, and collapsed mobile-navigation.

---

## 📸 Screenshots

<img width="1918" height="971" alt="image" src="https://github.com/user-attachments/assets/305c15d1-12b7-4d4c-b2b2-abefa40933a9" />
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/163a7ce8-c6ea-4eee-b095-296ca07e7f09" />


<p align="center">
  <img src="https://via.placeholder.com/800x400/13131b/ffffff?text=F1+Settings+Menu" alt="Dashboard" width="48%">
  <img src="https://via.placeholder.com/800x400/13131b/E10600?text=Interactive+Telemetry+Visualizer" alt="Drivers Page" width="48%">
</p>

---

## 🛠️ Architecture & Tech Stack

- **Frontend Core:** React 18, Vite, TypeScript, React Router DOM v6
- **Styling:** Tailwind CSS, PostCSS, Custom Semantic Component Tokens
- **Data Syndication:** 
  - [Jolpica F1 API](https://jolpi.ca/) (Live Telemetry & Standings)
  - Motorsport.com RSS Feed via AllOrigins API Proxy (News)
  - Wikimedia Commons & Unsplash (Dynamic Media)
- **Deployment & CI/CD:** Render Cloud Infrastructure

---

## 🚀 Getting Started

If you want to run this application locally on your machine, simply follow these standard instructions:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kiiirtan/f1-stats-app.git
   ```
2. **Install dependencies:**
   ```bash
   cd demo
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

---
*Architected and Designed by **[Kiiirtan](https://github.com/Kiiirtan)***
