import React from 'react';
import { useLiveStore } from '../../store/useLiveStore';
import { motion } from 'framer-motion';

export default function TelemetryHUD() {
  const selectedDriver = useLiveStore(state => state.selectedDriver);
  // Specifically subscribe only to this driver's last tick to avoid re-rendering to other drivers' updates
  const tick = useLiveStore(state => {
    if (!selectedDriver || !state.telemetryBuffer[selectedDriver]) return null;
    const buf = state.telemetryBuffer[selectedDriver];
    return buf[buf.length - 1];
  });

  if (!selectedDriver || !tick) {
    return (
      <div className="bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 p-6 h-64 flex items-center justify-center">
        <p className="text-secondary/50 font-display">WAITING FOR DATALINK...</p>
      </div>
    );
  }

  // Calculate RPM LEDs (0 to 15)
  const maxRpm = 13000;
  const numLeds = 15;
  const activeLeds = Math.min(numLeds, Math.floor((tick.rpm / maxRpm) * numLeds));

  return (
    <div className="bg-surface/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
      {/* Background glow influenced by RPM intensity */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${tick.rpm > 11500 ? '#ef4444' : tick.rpm > 9000 ? '#3b82f6' : '#22c55e'} 0%, transparent 70%)`
        }}
      />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-display font-medium text-white/90 tracking-wider">ON-BOARD HUD</h3>
          <p className="text-sm text-secondary uppercase tracking-widest font-mono">CAR {selectedDriver}</p>
        </div>
        
        {/* DRS Indicator */}
        <div className={`px-3 py-1 rounded border font-mono text-xs font-bold tracking-widest transition-colors ${tick.drs ? 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-surface border-white/10 text-white/30'}`}>
          DRS
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
        {/* RPM LEDs Array */}
        <div className="flex space-x-1.5 w-full justify-center">
          {Array.from({ length: numLeds }).map((_, i) => {
            const isActive = i < activeLeds;
            const isRedZone = i >= 10;
            const isBlueZone = i >= 5 && i < 10;
            
            let bgClass = "bg-white/5";
            let shadowClass = "";
            if (isActive) {
              if (isRedZone) {
                bgClass = "bg-red-500";
                shadowClass = "0 0 12px rgba(239, 68, 68, 0.8)";
              } else if (isBlueZone) {
                bgClass = "bg-blue-500";
                shadowClass = "0 0 12px rgba(59, 130, 246, 0.8)";
              } else {
                bgClass = "bg-green-500";
                shadowClass = "0 0 12px rgba(34, 197, 94, 0.8)";
              }
            }

            return (
              <div 
                key={i} 
                className={`h-4 w-full max-w-4 rounded-sm transition-all duration-75 ${bgClass}`}
                style={{ 
                  boxShadow: isActive ? shadowClass : 'none',
                  opacity: isActive ? 1 : 0.4
                }}
              />
            );
          })}
        </div>

        {/* Speed & Gear Layout */}
        <div className="flex items-center justify-between w-full max-w-md px-4 mt-6">
          <div className="text-center w-24">
            <span className="block text-sm text-secondary font-mono tracking-widest mb-1">SPEED</span>
            <div className="font-display text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tighter">
              {tick.speed}
            </div>
            <span className="text-secondary/50 text-xs font-mono ml-1">KPH</span>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center bg-black/40 rounded-full border-4 border-white/5 shadow-inner">
             {/* Dynamic background behind gear based on throttle */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" style={{ opacity: tick.throttle / 150 }} />
            <div className="text-center relative z-10">
              <span className="block text-[0.65rem] text-secondary/60 font-mono tracking-widest absolute -top-4 w-full text-center">GEAR</span>
              <span className="font-display font-black text-6xl text-white">
                {tick.n_gear === 0 ? 'N' : tick.n_gear === 8 ? '8' : tick.n_gear}
              </span>
            </div>
          </div>

          <div className="text-center w-24">
            <span className="block text-sm text-secondary font-mono tracking-widest mb-1">RPM</span>
            <div className="font-display text-4xl font-bold text-white/90 tracking-tighter">
              {tick.rpm}
            </div>
          </div>
        </div>

        {/* Pedals */}
        <div className="flex justify-between w-full max-w-md pt-4 space-x-8">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-xs font-mono text-secondary">
              <span>BRAKE</span>
              <span>{tick.brake}%</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-red-500 rounded-full"
                animate={{ width: `${tick.brake}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-xs font-mono text-secondary">
              <span>THROTTLE</span>
              <span>{tick.throttle}%</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                animate={{ width: `${tick.throttle}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
