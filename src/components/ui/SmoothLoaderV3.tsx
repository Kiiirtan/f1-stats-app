import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV3() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'build' | 'lock' | 'split' | 'done'>('build');
  const [visible, setVisible] = useState(true);
  const [scrambleText, setScrambleText] = useState('');

  // Target texts for different progress states
  const targetText = 
    progress < 30 ? 'ENGAGING KINETIC HYBRID' :
    progress < 60 ? 'CALIBRATING TELEMETRY' :
    progress < 90 ? 'INITIALIZING PADDOCK UPLINK' :
    'SYSTEMS ONLINE';

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let iter = 0;
    const scramble = setInterval(() => {
      setScrambleText(targetText.split('').map((char, index) => {
        if (char === ' ') return ' ';
        if (index < iter) return targetText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iter >= targetText.length) clearInterval(scramble);
      iter += 1/3; // Speed of decoding
    }, 30);
    return () => clearInterval(scramble);
  }, [targetText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(p + (p < 50 ? 1 : p < 80 ? 2 : 4), 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100 && phase === 'build') {
      setPhase('lock');
      // Lock for a beat, then split
      setTimeout(() => setPhase('split'), 500); 
      // Unmount after split transition
      setTimeout(() => setVisible(false), 1500); 
    }
  }, [progress, phase]);

  if (!visible) return null;

  // Generate an EKG polyline
  // We'll create a static wide spikey path, and animate a draw effect using stroke-dasharray
  const svgWidth = 800;
  const svgHeight = 100;
  
  // A rough heartbeat / motorsport RPM spike profile
  const points = `
    0,50 100,50 120,50 130,20 140,80 150,50
    300,50 320,50 335,10 350,90 365,50
    500,50 520,50 530,0  550,100 570,50
    650,50 670,50 680,20 690,80 700,50 800,50
  `;

  return (
    <div className="fixed inset-0 z-[10000] overflow-hidden pointer-events-none">
      
      {/* Top Garage Shutter */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#0A0A0C] border-b border-[#E10600]/40 z-10"
        initial={{ y: 0 }}
        animate={{ y: phase === 'split' ? '-100%' : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // smooth cinematic easing
      />

      {/* Bottom Garage Shutter */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0A0A0C] border-t border-[#E10600]/40 z-10"
        initial={{ y: 0 }}
        animate={{ y: phase === 'split' ? '100%' : 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} 
      />

      {/* Main Content Layout - Sits perfectly in the middle on top of shutters, fades out right before split */}
      <AnimatePresence>
        {phase !== 'split' && (
           <motion.div 
              className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
              transition={{ duration: 0.2 }}
           >
              
              {/* Top Meta Data row */}
              <div className="flex w-full max-w-4xl justify-between text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] text-[#E10600]/50 mb-12">
                 <span>SYS.V3</span>
                 <span>LAT_0.02ms</span>
                 <span>SEC_ENCRYPTED</span>
              </div>

              {/* Title Glitch */}
              <div className="relative mb-8 text-center flex flex-col items-center">
                 <div className="flex items-baseline gap-1 select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                   <span className="font-headline font-black italic text-4xl sm:text-6xl text-white">F</span>
                   <span className="font-headline font-black italic text-4xl sm:text-6xl text-[#E10600]">1</span>
                   <span className="font-headline font-black italic text-2xl sm:text-4xl tracking-widest ml-2 text-white">STATS</span>
                 </div>
                 
                 <div className="mt-4 h-6 text-[#29DEC9] font-mono font-bold tracking-widest text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(41,222,201,0.5)]">
                   {scrambleText}
                 </div>
              </div>

              {/* Telemetry EKG Graph */}
              <div className="relative w-full max-w-2xl h-[100px] flex items-center justify-center overflow-hidden">
                 {/* Dark track background */}
                 <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none" className="absolute opacity-10">
                   <polyline points={points} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" />
                 </svg>

                 {/* Active glowing trace line */}
                 <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none" className="absolute drop-shadow-[0_0_10px_rgba(225,6,0,0.8)]">
                   <polyline 
                      points={points} 
                      fill="none" 
                      stroke="#E10600" 
                      strokeWidth="3" 
                      strokeLinejoin="round" 
                      strokeDasharray="2000"
                      strokeDashoffset={2000 - (progress / 100) * 2000}
                      className="transition-all duration-75 ease-linear"
                   />
                 </svg>
              </div>

              {/* Completion Progress Text */}
              <div className="mt-8 text-right w-full max-w-2xl font-mono text-[10px] text-white/50 flex justify-between tracking-widest">
                <span>[AERODYNAMICS / KINETICS / MGU-K / MGU-H]</span>
                <span className="text-white font-bold">{progress.toFixed(1)}%</span>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
