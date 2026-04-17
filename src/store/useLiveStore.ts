// src/store/useLiveStore.ts
import { create } from 'zustand';
import { OpenF1LiveClient, TelemetryTick, RaceControlMsg, IntervalTick } from '../services/liveApi';

interface LiveState {
  isActive: boolean;
  selectedDriver: number | null;
  telemetryBuffer: Record<number, TelemetryTick[]>; // Rolling buffer per driver
  commentary: RaceControlMsg[];                     // Event feed
  intervals: Record<number, IntervalTick>;          // Latest leaderboard snapshot
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  setSelectedDriver: (num: number) => void;
}

const MAX_BUFFER_SIZE = 240; // 60 seconds at 4Hz

const client = new OpenF1LiveClient();

export const useLiveStore = create<LiveState>((set) => ({
  isActive: false,
  selectedDriver: null,
  telemetryBuffer: {},
  commentary: [],
  intervals: {},
  
  connect: () => {
    client.connect((type, data) => {
      if (type === 'telemetry') {
        const ticks = data as TelemetryTick[];
        set((state) => {
          const newBuffer = { ...state.telemetryBuffer };
          ticks.forEach(tick => {
            const driverNum = tick.driver_number;
            if (!newBuffer[driverNum]) newBuffer[driverNum] = [];
            newBuffer[driverNum] = [...newBuffer[driverNum], tick].slice(-MAX_BUFFER_SIZE);
          });
          return { telemetryBuffer: newBuffer };
        });
      } else if (type === 'commentary') {
        const msgs = data as RaceControlMsg[];
        set((state) => ({
          // Prepend new messages and keep last 100
          commentary: [...msgs.reverse(), ...state.commentary].slice(0, 100)
        }));
      } else if (type === 'intervals') {
        const ints = data as IntervalTick[];
        set((state) => {
          const newIntervals = { ...state.intervals };
          // The API returns historical, so we only want to store the latest dict
          // Wait, if it returns multiple timestamps, we map by driver_number and they overwrite to the latest implicitly
          ints.forEach(int => {
             newIntervals[int.driver_number] = int;
          });
          return { intervals: newIntervals };
        });
      }
    });
    set({ isActive: true });
  },
  
  disconnect: () => {
    client.disconnect();
    set({ isActive: false, telemetryBuffer: {}, commentary: [], intervals: {} });
  },

  setSelectedDriver: (num) => set({ selectedDriver: num })
}));
