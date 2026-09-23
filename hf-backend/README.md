---
title: F1 ML Engine
emoji: 🏎️
colorFrom: red
colorTo: black
sdk: docker
pinned: false
license: mit
---

# 🏎️ F1 ML Engine — Hugging Face Spaces Backend

> **Part of F1 Stats Version 4.0 Dual-Site Architecture**  
> **Engine:** FastAPI + Uvicorn + FastF1 + Scikit-Learn + Pandas  
> **Hosting:** Hugging Face Spaces (Free CPU Basic Tier — 16 GB RAM / 2 vCPU)

This directory contains the self-contained backend service designed to power the technical **ML Lab (Zone 2)** and **Live Telemetry (`/telemetry`)** interfaces of the F1 Stats web application without incurring any cloud infrastructure costs.

---

## ✨ Features & Endpoints

- **`/health` (GET):** Uptime check endpoint. Recommended for UptimeRobot / cron monitoring to prevent Hugging Face's 48-hour inactivity sleep.
- **`/api/v1/session-info` (GET):** Extracts weather temperatures, rainfall, and official session metadata using FastF1.
- **`/api/v1/telemetry/comparison` (GET):** Performs lap-by-lap telemetry comparisons (Speed, Throttle, Brake, RPM) between any two drivers on their fastest qualifying or race laps, subsampled and structured specifically for Recharts frontend rendering.
- **`/api/v1/tire-degradation` (GET):** Computes stint-by-stint tire degradation slopes using Scikit-Learn linear regression on lap progression times.
- **`/api/v1/predict/strategy` (GET):** Simulates pit window optimization and predictive race time deltas.

---

## 🚀 Deployment to Hugging Face Spaces ($0 Free Tier)

1. **Create a New Space:**
   - Go to [huggingface.co/new-space](https://huggingface.co/new-space).
   - Enter a Space name (e.g., `f1-ml-engine`).
   - Select **Docker** as the SDK.
   - Choose **Blank** Docker template.
   - Select **CPU Basic - 2 vCPU · 16 GB · Free** as the hardware space.

2. **Upload Files:**
   - Push the contents of this `hf-backend/` folder directly to your Hugging Face Space repository:
     ```bash
     git clone https://huggingface.co/spaces/<your-username>/f1-ml-engine
     cd f1-ml-engine
     # Copy Dockerfile, requirements.txt, main.py, and README.md here
     git add .
     git commit -m "Initial release of F1 ML Engine v4.0.0"
     git push
     ```

3. **Verify Build:**
   - Hugging Face will automatically build your Docker container on port `7860`.
   - Once running, access your interactive Swagger documentation at `https://<your-username>-f1-ml-engine.hf.space/docs`.

---

## 💻 Local Development & Testing

To run this backend locally on your machine:

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows

# 2. Install requirements
pip install -r requirements.txt

# 3. Run FastAPI dev server
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

---
*Architected and Designed for **F1 Stats v4.0***
