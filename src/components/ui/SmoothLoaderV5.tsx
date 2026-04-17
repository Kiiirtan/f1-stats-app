import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV5() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'build' | 'reveal' | 'done'>('build');
  const [visible, setVisible] = useState(true);

  // Elegant, seamless progress acceleration
  useEffect(() => {
    if (phase !== 'build') return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        // Smooth logarithmic entry
        const increment = p < 45 ? 1 : p < 85 ? 2 : 3;
        return Math.min(p + increment, 100);
      });
    }, 45); // Slower, more elegant timing
    return () => clearInterval(interval);
  }, [phase]);

  // Phase sequencing
  useEffect(() => {
    if (progress >= 100 && phase === 'build') {
      // Hold 100% inside the glass panel for a fraction of a second to show completion
      setTimeout(() => {
        setPhase('reveal');
      }, 400);
      
      // Let the background parallax and color-snap shine for 1.8 seconds before fading out
      setTimeout(() => {
        setPhase('done');
      }, 2200);

      // Fully unmount after fade transition
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }
  }, [progress, phase]);

  if (!visible) return null;

  // Thin minimalist loading arc calculation
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
       className={`fixed inset-0 z-[10000] overflow-hidden transition-opacity duration-700 ease-in-out
                   ${phase === 'done' ? 'opacity-0' : 'opacity-100'}`}
    >
      
      {/* 
         THE BACKDROP: 
         Massive F1 Photography.
         Starts hyper-blurred and desaturated. Snaps to vivid color on reveal.
      */}
      <motion.div 
         className="absolute inset-[-10%] w-[120%] h-[120%] bg-cover bg-center origin-center"
         style={{ backgroundImage: "url('/bg-dark-f1.webp')" }}
         initial={{ 
           scale: 1, 
           filter: 'grayscale(100%) blur(24px) brightness(0.2)',
         }}
         animate={{ 
           scale: phase === 'reveal' ? 1.05 : 1,
           filter: phase === 'reveal' 
             ? 'grayscale(0%) blur(0px) brightness(1.1)' 
             : 'grayscale(100%) blur(24px) brightness(0.25)',
         }}
         transition={{ 
           duration: phase === 'reveal' ? 1.8 : 4, 
           ease: [0.16, 1, 0.3, 1] // Apple-like slick easing
         }}
      />

      {/* 
         THE MONOLITH: 
         Frosted Glass panel containing the minimalist UI
      */}
      <AnimatePresence>
        {(phase === 'build') && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
             {/* Glassmorphic Card */}
             <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-square rounded-[3rem] 
                             bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]
                             flex flex-col items-center justify-center overflow-hidden"
             >
                {/* Subtle ambient gradient inside the card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                {/* Minimalist Circular Progress */}
                <div className="relative flex items-center justify-center mb-4">
                  <svg width="220" height="220" className="transform -rotate-90">
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="2"
                      fill="transparent"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      stroke="url(#monolith-gradient)"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-100 ease-out"
                    />
                    <defs>
                      <linearGradient id="monolith-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#EAB308" />    {/* Liquid Gold */}
                        <stop offset="50%" stopColor="#29DEC9" />   {/* Cyber Cyan */}
                        <stop offset="100%" stopColor="#E10600" />  {/* Scuderia Red */}
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Elegant typography in the center */}
                  <div className="absolute flex flex-col items-center justify-center mt-1">
                     <span className="font-headline text-[10px] tracking-[0.4em] text-white/40 uppercase mb-1 drop-shadow-sm">
                       {progress < 100 ? 'Initializing' : 'Ready'}
                     </span>
                     <span className="font-display text-5xl font-light text-white tracking-tighter tabular-nums drop-shadow-lg">
                       {Math.floor(progress)}
                     </span>
                  </div>
                </div>

                {/* Footer Brand Logo */}
                <div className="absolute bottom-8 flex items-baseline gap-1 opacity-60">
                   <span className="font-headline font-medium text-lg text-white">F</span>
                   <span className="font-headline font-medium text-lg text-[#E10600]">1</span>
                   <span className="font-headline font-medium text-xs tracking-widest ml-1 text-white/70">STATS</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
