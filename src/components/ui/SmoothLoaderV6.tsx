import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV6() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'shards' | 'hud' | 'implode' | 'shatter' | 'done'>('shards');
  const [visible, setVisible] = useState(true);

  // Simulated rapid telemetry numbers
  const [telemetry, setTelemetry] = useState({ frontLeft: 84, frontRight: 86, rearLeft: 92, rearRight: 90, brakeBias: 54.2 });

  useEffect(() => {
    // Stage 1: Shards Lock In
    setTimeout(() => setPhase('hud'), 1000);
  }, []);

  useEffect(() => {
    if (phase !== 'hud') return;
    
    // Telemetry rapid update
    const tInterval = setInterval(() => {
      setTelemetry({
        frontLeft: 80 + Math.random() * 20,
        frontRight: 80 + Math.random() * 20,
        rearLeft: 90 + Math.random() * 15,
        rearRight: 90 + Math.random() * 15,
        brakeBias: 52 + Math.random() * 5,
      });
    }, 100);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(p + 1.5, 100); // 1.5 increments per 40ms -> approx 2.6s to load
      });
    }, 40);

    return () => {
      clearInterval(interval);
      clearInterval(tInterval);
    };
  }, [phase]);

  useEffect(() => {
    if (progress >= 100 && phase === 'hud') {
      setPhase('implode'); // UI gets sucked into the center
      setTimeout(() => setPhase('shatter'), 600); // Background perspective shatter
      setTimeout(() => setPhase('done'), 1400); // Unmount
      setTimeout(() => setVisible(false), 2000); 
    }
  }, [progress, phase]);

  if (!visible) return null;

  // Colors
  const neonRed = '#FF003C';
  const neonCyan = '#00F2FE';

  return (
    <div 
       className={`fixed inset-0 z-[10000] overflow-hidden bg-black transition-colors duration-500`}
       style={{ perspective: '1200px' }}
    >
       {/* 
          1. GEOMETRIC SHARD BACKGROUNDS 
             Using clip-path on bg-dark-f1.webp to create 3 aggressive diagonal slices 
       */}
       <AnimatePresence>
         {phase !== 'done' && (
            <>
               <motion.div 
                 className="absolute inset-[0] w-[110%] h-[110%] object-cover opacity-30"
                 style={{ 
                   backgroundImage: "url('/bg-dark-f1.webp')", 
                   backgroundSize: 'cover', backgroundPosition: 'center',
                   clipPath: 'polygon(0 0, 40% 0, 15% 100%, 0% 100%)'
                 }}
                 initial={{ y: '20%', x: '-10%', opacity: 0 }}
                 animate={{ 
                    y: phase === 'shatter' ? '-100%' : '0%', 
                    x: phase === 'shatter' ? '-50%' : '0%', 
                    opacity: phase === 'shatter' ? 0 : 0.4,
                    rotateZ: phase === 'shatter' ? -15 : 0
                 }}
                 transition={{ duration: phase === 'shatter' ? 0.6 : 1, ease: 'easeOut' }}
               />
               <motion.div 
                 className="absolute inset-[0] w-[110%] h-[110%] object-cover opacity-60 mix-blend-screen"
                 style={{ 
                   backgroundImage: "url('/bg-dark-f1.webp')", 
                   backgroundSize: 'cover', backgroundPosition: 'center',
                   clipPath: 'polygon(40% 0, 100% 0, 60% 100%, 15% 100%)',
                   filter: 'contrast(1.5) saturate(0) brightness(0.5)'
                 }}
                 initial={{ y: '-20%', opacity: 0 }}
                 animate={{ 
                    y: phase === 'shatter' ? '100%' : '0%', 
                    scale: phase === 'shatter' ? 2 : 1,
                    opacity: phase === 'shatter' ? 0 : 0.5 
                 }}
                 transition={{ duration: phase === 'shatter' ? 0.6 : 1.2, ease: 'easeOut' }}
               />
               <motion.div 
                 className="absolute inset-[0] w-[110%] h-[110%] object-cover opacity-20"
                 style={{ 
                   backgroundImage: "url('/bg-dark-f1.webp')", 
                   backgroundSize: 'cover', backgroundPosition: 'center',
                   clipPath: 'polygon(100% 0, 100% 100%, 60% 100%)',
                 }}
                 initial={{ y: '20%', x: '10%', opacity: 0 }}
                 animate={{ 
                    y: phase === 'shatter' ? '-100%' : '0%', 
                    x: phase === 'shatter' ? '50%' : '0%', 
                    opacity: phase === 'shatter' ? 0 : 0.4,
                    rotateZ: phase === 'shatter' ? 15 : 0
                 }}
                 transition={{ duration: phase === 'shatter' ? 0.6 : 1, ease: 'easeOut' }}
               />
            </>
         )}
       </AnimatePresence>


       {/* 
          2. THE COCKPIT HUD UI 
       */}
       <AnimatePresence>
         {(phase === 'hud' || phase === 'shards') && (
            <motion.div 
               className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: phase === 'hud' ? 1 : 0, scale: 1 }}
               exit={{ opacity: 0, scale: 0.1, rotate: 45, filter: 'blur(20px)' }} // IMPLOSION Effect
               transition={{ duration: 0.6, ease: "anticipate" }}
            >
               
               {/* TOP ARCH: Massive RPM Sweeper */}
               <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl flex flex-col items-center">
                 <svg viewBox="0 0 800 200" className="w-full text-transparent drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]">
                   {/* Background Arch */}
                   <path d="M 50,180 A 400,200 0 0,1 750,180" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="square" />
                   {/* Active Arch */}
                   <path 
                     d="M 50,180 A 400,200 0 0,1 750,180" 
                     fill="none" 
                     stroke={neonRed} 
                     strokeWidth="10" 
                     strokeLinecap="round" 
                     strokeDasharray="950"
                     strokeDashoffset={950 - (progress / 100) * 950}
                     className="transition-all duration-75 ease-linear"
                   />
                 </svg>
                 <div className="absolute top-[80px] font-headline font-black italic text-5xl tracking-tighter" style={{ color: neonCyan }}>
                    {Math.floor((progress / 100) * 18000).toLocaleString()} <span className="text-xl text-white/50">RPM</span>
                 </div>
               </div>

               {/* LEFT WING: Tyre & Brake Telemetry */}
               <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 w-40">
                  <div className="flex flex-col gap-1">
                     <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#FF003C]">BRAKE BIAS</span>
                     <div className="text-2xl font-mono text-white tabular-nums drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                       {telemetry.brakeBias.toFixed(1)}%
                     </div>
                     <div className="w-full h-[2px] bg-white/10 mt-1">
                       <div className="h-full bg-[#00F2FE]" style={{ width: `${telemetry.brakeBias}%` }} />
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                     <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#00F2FE]">TYRE CORE (C)</span>
                     <div className="grid grid-cols-2 gap-2 text-white font-mono text-sm">
                       <div className="border-l-2 border-[#FF003C] pl-2">{telemetry.frontLeft.toFixed(0)}</div>
                       <div className="border-l-2 border-[#FF003C] pl-2">{telemetry.frontRight.toFixed(0)}</div>
                       <div className="border-l-2 border-white/30 pl-2">{telemetry.rearLeft.toFixed(0)}</div>
                       <div className="border-l-2 border-white/30 pl-2">{telemetry.rearRight.toFixed(0)}</div>
                     </div>
                  </div>
               </div>

               {/* RIGHT WING: ERS Battery Mapping */}
               <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 w-40 items-end text-right">
                  <span className="text-[9px] font-mono font-bold tracking-[0.3em] text-[#00F2FE]">ERS DEPLOYMENT</span>
                  
                  {/* Hexagon style battery chart */}
                  <div className="flex gap-1 flex-wrap justify-end w-32">
                     {[...Array(24)].map((_, i) => (
                       <div 
                         key={i} 
                         className="w-4 h-4 rounded-sm transition-colors duration-75"
                         style={{ 
                            backgroundColor: i < (progress / 100) * 24 ? neonCyan : 'rgba(255,255,255,0.05)',
                            boxShadow: i < (progress / 100) * 24 ? `0 0 10px ${neonCyan}` : 'none'
                         }}
                       />
                     ))}
                  </div>

                  <div className="text-xl font-mono text-white mt-2 tabular-nums">
                    {progress.toFixed(1)} <span className="text-sm text-[#FF003C]">MJ</span>
                  </div>
               </div>

               {/* CORE: Crosshair Pulse & Brand */}
               <div className="relative flex flex-col items-center justify-center">
                  
                  {/* Rotating G-Force Radar Rings */}
                  <motion.div 
                     className="absolute w-64 h-64 border border-[#FF003C]/30 rounded-full border-dashed"
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                  />
                  <motion.div 
                     className="absolute w-48 h-48 border-[3px] border-[#00F2FE]/40 rounded-full border-dotted"
                     animate={{ rotate: -360 }}
                     transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                  />

                  {/* Central F1 Logo Lockup */}
                  <div className="flex items-baseline gap-1 z-10 bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
                   <span className="font-headline font-black italic text-5xl text-white">F</span>
                   <span className="font-headline font-black italic text-5xl text-[#FF003C]">1</span>
                  </div>
                  <span className="font-headline font-black italic text-lg tracking-[0.5em] mt-2 text-white/80 z-10 pl-2">
                    STATS
                  </span>

                  {/* System Boot Scramble text */}
                  <div className="absolute -bottom-16 text-[9px] font-mono text-[#00F2FE] tracking-[0.4em] uppercase whitespace-nowrap">
                    {progress < 100 ? 'SYSTEM_OVERRIDE_ENABLED :: BOOT_SEQ' : 'TELEMETRY_SYNCED :: SECURE'}
                  </div>
               </div>

               {/* Geometric Grid Floor Overlay */}
               <div 
                  className="absolute bottom-0 left-0 right-0 h-32 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,242,254,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,254,1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(70deg)',
                    transformOrigin: 'bottom center'
                  }}
               />
               
            </motion.div>
         )}
       </AnimatePresence>

       {/* INJECTED IMPLOSION FLASH */}
       <AnimatePresence>
         {phase === 'shatter' && (
           <motion.div
              className="absolute inset-0 bg-[#FF003C] z-50 pointer-events-none mix-blend-screen"
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 50 }}
              transition={{ duration: 1, ease: 'easeOut' }}
           />
         )}
       </AnimatePresence>

    </div>
  );
}
