import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV2() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'build' | 'shift' | 'done'>('build');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating curve
        const increment = p < 40 ? 1 : p < 70 ? 2 : p < 90 ? 4 : 8;
        return Math.min(p + increment, 100);
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && phase === 'build') {
      setPhase('shift');
      setTimeout(() => setPhase('done'), 400); // 400ms for hyperdrive flash
      setTimeout(() => setVisible(false), 900); // Wait for transition to finish
    }
  }, [progress, phase]);

  if (!visible) return null;

  // Calculate dynamic properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const rpm = Math.floor((progress / 100) * 15000);
  const currentGear = Math.max(1, Math.ceil((progress / 100) * 8));

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#0A0A0C] transition-opacity duration-500 ${phase === 'done' ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Background Hyper-Drive / Wind Tunnel Particles */}
      <div className="absolute inset-0 pointer-events-none perspective-1000">
        {[...Array(30)].map((_, i) => {
          const depth = Math.random() * 200 + 10;
          const isRed = i % 4 === 0;
          return (
             <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent to-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: '-10%',
                width: `${Math.random() * 150 + 50}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: isRed 
                  ? 'linear-gradient(90deg, transparent, rgba(225,6,0,0.8))' 
                  : 'linear-gradient(90deg, transparent, rgba(200,200,255,0.4))',
                opacity: phase === 'shift' ? 0 : 0.6 + (Math.random() * 0.4),
                animation: phase === 'shift' 
                  ? 'none' 
                  : `windStreak ${0.2 + (Math.random() * 0.4)}s linear infinite`,
                animationDelay: `${Math.random()}s`,
                transform: `scaleZ(${depth})`,
              }}
            />
          );
        })}
      </div>

      {/* Shift Flash Effect */}
      <AnimatePresence>
        {phase === 'shift' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-white/80 to-blue-500/30 blur-2xl z-20 pointer-events-none flex items-center justify-center"
          />
        )}
      </AnimatePresence>

      {/* Main Steering Wheel HUD */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center"
        animate={{ 
           scale: phase === 'shift' ? 1.5 : 1,
           filter: phase === 'shift' ? 'blur(10px)' : 'blur(0px)',
           opacity: phase === 'shift' ? 0 : 1
        }}
        transition={{ duration: 0.4, ease: "easeIn" }}
      >
        {/* SVG Arc Gauge */}
        <div className="relative flex items-center justify-center drop-shadow-[0_0_15px_rgba(225,6,0,0.4)]">
          <svg width="300" height="300" className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active RPM Fill */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="url(#rpm-gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-linear"
            />
            <defs>
              <linearGradient id="rpm-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#29DEC9" />     {/* Cyan */}
                <stop offset="50%" stopColor="#EAB308" />    {/* Yellow */}
                <stop offset="100%" stopColor="#E10600" />   {/* Red */}
              </linearGradient>
            </defs>
          </svg>

          {/* Inner HUD Data */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] font-headline font-bold uppercase tracking-[0.4em] text-[#8b8d92] drop-shadow-md mb-1">
              GEAR {currentGear}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-mono items-center tabular-nums font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                {rpm.toLocaleString()}
              </span>
            </div>
            <span className="text-xs font-headline font-bold text-[var(--theme-accent)] tracking-widest mt-1 opacity-80">
              RPM
            </span>
            
            {/* Connection Status Text inside HUD */}
            <div className="mt-4 text-[9px] font-mono uppercase tracking-widest text-[#29DEC9] animate-pulse">
               {progress < 40 ? 'Calibrating...' : progress < 80 ? 'Syncing Telemetry...' : 'Ready'}
            </div>
          </div>
        </div>
        
        {/* Optional Branding Text below wheel */}
        <div className="mt-12 flex items-baseline gap-1 select-none opacity-40">
           <span className="font-headline font-black italic text-4xl text-white">F</span>
           <span className="font-headline font-black italic text-4xl text-[#E10600]">1</span>
           <span className="font-headline font-black italic text-xl tracking-widest ml-2 text-white">STATS</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes windStreak {
          0% { transform: translateX(0) scaleX(1); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(200vw) scaleX(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
