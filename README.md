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

- **🏆 Real-Time Grid Standings:** Live tracking of all 22 active drivers and 11 constructors across the 2026 season relying on the Jolpica API.
- **🎨 Dynamic Theming Engine:** The UI accent colors dynamically shift to match the exact hexadecimal branding of your favorite Constructor (e.g., Ferrari Red, Mercedes Teal) without touching any CSS.
- **🏎️ Interactive Telemetry Simulator:** A native DOM physics engine visualizer that translates your mouse cursor's X-axis movement into responsive engine RPMs, transmission gears, braking, and speed metrics.
- **📱 Responsive Glassmorphism:** Fully optimized mobile and desktop experiences utilizing modern Tailwind backdrop blur filters and hardware-accelerated SVG animations.

---

## 📸 Screenshots

*(Replace these image URLs with actual screenshots of your application from your computer)*

<p align="center">
  <img src="https://via.placeholder.com/800x400/13131b/ffffff?text=F1+Settings+Menu" alt="Dashboard" width="48%">
  <img src="https://via.placeholder.com/800x400/13131b/E10600?text=Interactive+Telemetry+Visualizer" alt="Drivers Page" width="48%">
</p>

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, PostCSS, Custom Component Tokens
- **State Management:** React Context API (`SettingsContext` & `ThemeManager`)
- **Data Source:** [Jolpica F1 API](https://jolpica.com)
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
