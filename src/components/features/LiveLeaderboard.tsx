import React from 'react';
import { motion } from 'framer-motion';
import { useLiveStore } from '../../store/useLiveStore';

interface ActiveDriver {
  num: number;
  name: string;
  team: string;
}

export default function LiveLeaderboard({ activeDrivers }: { activeDrivers: ActiveDriver[] }) {
  const { intervals, selectedDriver, setSelectedDriver } = useLiveStore();

  // Combine active drivers with interval data
  const leaderboard = activeDrivers.map(driver => {
    const intervalData = intervals[driver.num];
    return {
      ...driver,
      gap: intervalData ? (intervalData.gap_to_leader || 'LEADER') : null,
      interval: intervalData ? intervalData.interval : null
    };
  });

  // Sort is tricky without strict position data, but if gap_to_leader exists, we can try to order by it.
  // Assuming the activeDrivers array is usually provided in championship order or we just list them.
  // For a pure Cricbuzz effect, we display them vertically.
  
  return (
    <div className="flex flex-col h-full bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 bg-white/5">
        <h3 className="font-mono text-sm tracking-widest text-secondary font-bold">LIVE LEADERBOARD</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-1 no-scrollbar">
        {leaderboard.map((driver, idx) => {
          const isSelected = selectedDriver === driver.num;
          
          return (
            <button
              key={driver.num}
              onClick={() => setSelectedDriver(driver.num)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isSelected 
                ? 'bg-primary/10 border border-primary/30 relative overflow-hidden' 
                : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {isSelected && (
                <motion.div 
                   layoutId="active-leaderboard"
                   className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                />
              )}
              
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/40 w-4 text-center">{idx + 1}</span>
                <span className={`font-mono font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>
                  {driver.name.split(' ').pop()?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="font-mono text-xs text-white/50">{driver.gap || 'N/A'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
