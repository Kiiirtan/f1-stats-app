// src/services/liveApi.ts
// Handles real-time connections to the OpenF1 API. 
// Uses simulated data fallback when no live session is running.

const OPENF1_BASE = 'https://api.openf1.org/v1';

export interface TelemetryTick {
  driver_number: number;
  date: string;
  rpm: number;
  speed: number;
  n_gear: number;
  throttle: number;
  brake: number;
  drs: number;
}

export interface PositionTick {
  driver_number: number;
  date: string;
  x: number;
  y: number;
  z: number;
}

export interface RaceControlMsg {
  date: string;
  category: string;
  message: string;
  flag: string | null;
  lap_number: number | null;
}

export interface IntervalTick {
  driver_number: number;
  gap_to_leader: string | null;
  interval: string | null;
  date: string;
}

export class OpenF1LiveClient {
  private active = false;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private slowPollingInterval: ReturnType<typeof setInterval> | null = null;
  private onData: ((type: string, data: any) => void) | null = null;
  
  private lastFetchDate: string = new Date(Date.now() - 60000).toISOString(); 
  private lastMsgDate: string = new Date(Date.now() - 3600000).toISOString(); // fetch last hour of messages

  connect(callback: (type: string, data: any) => void) {
    this.onData = callback;
    this.active = true;

    // Fast polling for Telemetry (1Hz)
    this.pollingInterval = setInterval(async () => {
      if (!this.active) return;
      try {
        const response = await fetch(`${OPENF1_BASE}/car_data?session_key=latest&date>=${this.lastFetchDate}`);
        if (!response.ok) return;
        
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          this.lastFetchDate = data[data.length - 1].date;
          if (this.onData) this.onData('telemetry', data as TelemetryTick[]);
        }
      } catch (err) {
        // console.error("Telemetry Poll Error:", err);
      }
    }, 1000); 

    // Slow polling for Match Center (Leaderboard / Commentary) (5Hz)
    this.slowPollingInterval = setInterval(async () => {
      if (!this.active) return;
      
      try {
        // Fetch Race Control updates incrementally
        const msgRes = await fetch(`${OPENF1_BASE}/race_control?session_key=latest&date>=${this.lastMsgDate}`);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          if (Array.isArray(msgData) && msgData.length > 0) {
            this.lastMsgDate = msgData[msgData.length - 1].date;
            if (this.onData) this.onData('commentary', msgData as RaceControlMsg[]);
          }
        }

        // Fetch Intervals periodically (we don't need historical, just the absolute most recent state for all drivers)
        // Wait, OpenF1 /intervals returns huge history if we don't pass date. 
        // Best approach is date>= of the last 10 seconds.
        const recentDate = new Date(Date.now() - 10000).toISOString();
        const intRes = await fetch(`${OPENF1_BASE}/intervals?session_key=latest&date>=${recentDate}`);
        if (intRes.ok) {
          const intData = await intRes.json();
          if (Array.isArray(intData) && intData.length > 0) {
             if (this.onData) this.onData('intervals', intData as IntervalTick[]);
          }
        }

      } catch (err) {
        // console.error("Match Center Poll Error", err);
      }
    }, 5000); // 5 seconds
  }

  disconnect() {
    this.active = false;
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    if (this.slowPollingInterval) clearInterval(this.slowPollingInterval);
    this.pollingInterval = null;
    this.slowPollingInterval = null;
  }
}
