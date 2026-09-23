import os
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("f1-ml-engine")

# Initialize FastAPI app
app = FastAPI(
    title="F1 ML Engine — Hugging Face Space",
    description="High-performance backend engine for F1 Stats v4.0 ML Lab powered by FastF1, Pandas, and Scikit-Learn.",
    version="4.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS to allow frontend SPA (Render / Local dev) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://statsf1web.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*"  # Allow all during prototype/testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FastF1 cache directory
CACHE_DIR = os.getenv("FASTF1_CACHE_DIR", "./cache")
os.makedirs(CACHE_DIR, exist_ok=True)

try:
    import fastf1
    fastf1.Cache.enable_cache(CACHE_DIR)
    logger.info(f"FastF1 cache enabled at: {CACHE_DIR}")
except Exception as e:
    logger.error(f"Failed to enable FastF1 cache: {e}")

# --- Pydantic Response Models ---

class HealthResponse(BaseModel):
    status: str
    version: str
    fastf1_cache: str
    memory_limit: str

class TelemetryPoint(BaseModel):
    distance: float
    speed_d1: float
    speed_d2: float
    throttle_d1: float
    throttle_d2: float
    brake_d1: int
    brake_d2: int
    rpm_d1: float
    rpm_d2: float

class TelemetryComparisonResponse(BaseModel):
    year: int
    gp: str
    session: str
    driver1: str
    driver2: str
    lap_time_d1: Optional[str]
    lap_time_d2: Optional[str]
    delta_time: Optional[str]
    telemetry_data: List[TelemetryPoint]

class TireStintAnalysis(BaseModel):
    stint: int
    compound: str
    lap_start: int
    lap_end: int
    deg_rate_sec_per_lap: float
    total_deg_sec: float

class TireDegradationResponse(BaseModel):
    driver: str
    gp: str
    year: int
    stints: List[TireStintAnalysis]
    prediction_summary: str

# --- API Endpoints ---

@app.get("/", tags=["General"])
async def root():
    return {
        "message": "Welcome to the F1 ML Engine (Hugging Face Spaces)",
        "version": "4.0.0",
        "architecture": "Vite/React SPA -> Hugging Face Docker Space (16GB RAM CPU)",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "telemetry_comparison": "/api/v1/telemetry/comparison",
            "tire_degradation": "/api/v1/tire-degradation",
            "strategy_predict": "/api/v1/predict/strategy"
        }
    }

@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health_check():
    """
    Health check endpoint for uptime monitors (e.g. UptimeRobot) to ping every 24h
    and prevent the Hugging Face Space from entering 48h inactivity sleep.
    """
    return HealthResponse(
        status="healthy",
        version="4.0.0",
        fastf1_cache=CACHE_DIR,
        memory_limit="16 GB RAM (HF Free CPU Basic Tier)"
    )

@app.get("/api/v1/session-info", tags=["Telemetry"])
async def get_session_info(
    year: int = Query(2024, description="Championship year"),
    gp: str = Query("Bahrain", description="Grand Prix name or location"),
    identifier: str = Query("R", description="Session identifier (R, Q, SQ, FP1, etc.)")
):
    """
    Retrieve weather metadata and session details using FastF1.
    """
    try:
        session = fastf1.get_session(year, gp, identifier)
        session.load(laps=False, telemetry=False, weather=True)
        
        weather_df = session.weather_data
        avg_air_temp = float(weather_df['AirTemp'].mean()) if not weather_df.empty else 0.0
        avg_track_temp = float(weather_df['TrackTemp'].mean()) if not weather_df.empty else 0.0
        
        return {
            "year": year,
            "gp": gp,
            "session": session.name,
            "event_date": str(session.date),
            "weather": {
                "avg_air_temp": round(avg_air_temp, 1),
                "avg_track_temp": round(avg_track_temp, 1),
                "rainfall": bool(weather_df['Rainfall'].any()) if not weather_df.empty else False
            }
        }
    except Exception as e:
        logger.error(f"Error fetching session info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/telemetry/comparison", response_model=TelemetryComparisonResponse, tags=["Telemetry"])
async def compare_telemetry(
    year: int = Query(2024, description="Championship year"),
    gp: str = Query("Bahrain", description="Grand Prix name or location"),
    identifier: str = Query("Q", description="Session identifier (e.g. Q for Qualifying, R for Race)"),
    driver1: str = Query("VER", description="3-letter code for Driver 1"),
    driver2: str = Query("NOR", description="3-letter code for Driver 2"),
    sample_rate: int = Query(5, description="Subsampling factor to keep JSON response lightweight")
):
    """
    Compare fastest lap telemetry between two drivers. Returns distance-aligned speed,
    throttle, brake, and RPM data optimized for Recharts frontend rendering.
    """
    try:
        session = fastf1.get_session(year, gp, identifier)
        session.load(laps=True, telemetry=True, weather=False)
        
        laps_d1 = session.laps.pick_driver(driver1)
        laps_d2 = session.laps.pick_driver(driver2)
        
        if laps_d1.empty or laps_d2.empty:
            raise HTTPException(status_code=404, detail=f"Laps not found for {driver1} or {driver2}")
            
        fastest_d1 = laps_d1.pick_fastest()
        fastest_d2 = laps_d2.pick_fastest()
        
        tel_d1 = fastest_d1.get_telemetry().add_distance()
        tel_d2 = fastest_d2.get_telemetry().add_distance()
        
        # Subsample data to prevent massive JSON payloads (e.g., every 5th point)
        tel_d1_sub = tel_d1.iloc[::sample_rate]
        
        points = []
        for _, row in tel_d1_sub.iterrows():
            dist = float(row['Distance'])
            # Find closest distance point in D2 telemetry
            idx_d2 = (tel_d2['Distance'] - dist).abs().idxmin()
            row_d2 = tel_d2.loc[idx_d2]
            
            points.append(TelemetryPoint(
                distance=round(dist, 1),
                speed_d1=round(float(row['Speed']), 1),
                speed_d2=round(float(row_d2['Speed']), 1),
                throttle_d1=round(float(row['Throttle']), 1),
                throttle_d2=round(float(row_d2['Throttle']), 1),
                brake_d1=int(row['Brake']),
                brake_d2=int(row_d2['Brake']),
                rpm_d1=round(float(row['RPM']), 0),
                rpm_d2=round(float(row_d2['RPM']), 0)
            ))
            
        return TelemetryComparisonResponse(
            year=year,
            gp=gp,
            session=session.name,
            driver1=driver1,
            driver2=driver2,
            lap_time_d1=str(fastest_d1['LapTime'])[10:19] if pd.notnull(fastest_d1['LapTime']) else None,
            lap_time_d2=str(fastest_d2['LapTime'])[10:19] if pd.notnull(fastest_d2['LapTime']) else None,
            delta_time=str(fastest_d1['LapTime'] - fastest_d2['LapTime'])[10:19] if pd.notnull(fastest_d1['LapTime']) else None,
            telemetry_data=points
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in telemetry comparison: {e}")
        raise HTTPException(status_code=500, detail=f"FastF1 processing failed: {str(e)}")

@app.get("/api/v1/tire-degradation", response_model=TireDegradationResponse, tags=["Analytics"])
async def calculate_tire_degradation(
    year: int = Query(2024, description="Championship year"),
    gp: str = Query("Bahrain", description="Grand Prix name or location"),
    driver: str = Query("VER", description="3-letter driver code")
):
    """
    Calculate per-stint tire degradation slopes using Scikit-Learn linear regression
    on lap time progression.
    """
    try:
        session = fastf1.get_session(year, gp, 'R')
        session.load(laps=True, telemetry=False, weather=False)
        
        driver_laps = session.laps.pick_driver(driver).pick_quicklaps()
        if driver_laps.empty:
            raise HTTPException(status_code=404, detail=f"No race laps found for {driver}")
            
        stints_data = []
        stint_groups = driver_laps.groupby('Stint')
        
        for stint_num, stint_laps in stint_groups:
            if len(stint_laps) < 3:
                continue
                
            compound = str(stint_laps['Compound'].iloc[0])
            lap_start = int(stint_laps['LapNumber'].min())
            lap_end = int(stint_laps['LapNumber'].max())
            
            # Convert lap times to seconds
            lap_times_sec = stint_laps['LapTime'].dt.total_seconds().values
            lap_nums = stint_laps['LapNumber'].values
            
            # Linear regression: slope represents seconds lost per lap due to degradation & fuel burn
            slope, _ = np.polyfit(lap_nums, lap_times_sec, 1)
            deg_rate = round(float(slope), 3)
            total_deg = round(deg_rate * len(stint_laps), 2)
            
            stints_data.append(TireStintAnalysis(
                stint=int(stint_num),
                compound=compound if compound != 'nan' else 'UNKNOWN',
                lap_start=lap_start,
                lap_end=lap_end,
                deg_rate_sec_per_lap=deg_rate,
                total_deg_sec=total_deg
            ))
            
        summary = f"{driver} completed {len(stints_data)} stint(s). "
        if stints_data:
            best_stint = min(stints_data, key=lambda x: x.deg_rate_sec_per_lap)
            summary += f"Best tire management observed on {best_stint.compound} compound (Stint {best_stint.stint}) with {best_stint.deg_rate_sec_per_lap}s/lap degradation."
            
        return TireDegradationResponse(
            driver=driver,
            gp=gp,
            year=year,
            stints=stints_data,
            prediction_summary=summary
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating tire degradation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/predict/strategy", tags=["Analytics"])
async def predict_strategy(
    circuit: str = Query("Monza", description="Circuit name"),
    laps: int = Query(53, description="Total race laps"),
    start_compound: str = Query("MEDIUM", description="Starting tire compound")
):
    """
    Simulated ML strategy predictor for pitwall simulations.
    Returns optimal pit window and predicted finish delta.
    """
    # Prototyped heuristic strategy simulator
    pit_window_start = int(laps * 0.35) if start_compound.upper() == "SOFT" else int(laps * 0.45)
    pit_window_end = pit_window_start + 4
    next_compound = "HARD" if start_compound.upper() in ["SOFT", "MEDIUM"] else "MEDIUM"
    
    return {
        "circuit": circuit,
        "total_laps": laps,
        "strategy_type": "1-Stop Optimal",
        "starting_compound": start_compound.upper(),
        "recommended_stop": {
            "window_lap_start": pit_window_start,
            "window_lap_end": pit_window_end,
            "target_compound": next_compound,
            "estimated_pit_loss_sec": 22.4
        },
        "predicted_race_time_delta": "-4.2 seconds vs 2-stop strategy",
        "ml_confidence_score": 0.89
    }
