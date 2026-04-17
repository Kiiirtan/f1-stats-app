import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV4() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'build' | 'five_lights' | 'blackout' | 'explosion' | 'done'>('build');
  const [visible, setVisible] = useState(true);
  
  // Track which of the 5 lights are currently lit (0 to 5)
  const [litCount, setLitCount] = useState(0);

  // Initial progression
  useEffect(() => {
    if (phase !== 'build') return;
    const interval = setInterval(() => {
      setProgress((p) => {
         // Fast progress, climax at 100
        if (p >= 100) return 100;
        return Math.min(p + (p < 50 ? 2 : p < 80 ? 4 : 8), 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase sequencing
  useEffect(() => {
    if (progress >= 100 && phase === 'build') {
      setPhase('five_lights');
      
      // Ignite lights sequentially every 300ms
      [1, 2, 3, 4, 5].forEach((i) => {
        setTimeout(() => setLitCount(i), i * 300);
      });

      // After all 5 are lit (1500ms), wait for tension (500ms), then BLACKOUT
      setTimeout(() => {
        setPhase('blackout');
      }, 1500 + 500);
      
      // Stay black for 400ms, then EXPLOSION
      setTimeout(() => {
        setPhase('explosion');
      }, 2000 + 400);

      // Finish and Unmount
      setTimeout(() => {
        setPhase('done');
        setVisible(false);
      }, 2400 + 800);
    }
  }, [progress, phase]);

  if (!visible) return null;

  // The massive screen shaking effect only active during 'five_lights' when revving up
  const isShaking = phase === 'five_lights';

  return (
    <div 
       className={`fixed inset-0 z-[10000] flex flex-col overflow-hidden transition-colors duration-150
                   ${phase === 'blackout' ? 'bg-black' : phase === 'explosion' ? 'bg-transparent' : 'bg-[#0A0A0C]'}`}
    >
      
      {/* VIBRATION WRAPPER */}
      <motion.div
         className="absolute inset-0 w-full h-full"
         animate={
           isShaking 
             ? { x: [-3, 3, -4, 4, -2, 2, -5, 5, 0], y: [-2, 2, -3, 3, -1, 1, -4, 4, 0] } 
             : { x: 0, y: 0 }
         }
         transition={{ 
           duration: 0.1, 
           repeat: isShaking ? Infinity : 0, 
           repeatType: 'mirror' 
         }}
      >

        {/* 
            Phase: Build & Five Lights
            Hidden entirely during blackout & explosion
        */}
        <AnimatePresence>
          {(phase === 'build' || phase === 'five_lights') && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center pt-24"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }} // INSTANT exit on blackout
            >
              
              {/* THE GANTRY: 3D perspective overhead lights */}
              <div 
                 className="relative flex justify-center perspective-[800px]"
                 style={{ width: '100%', height: '300px' }}
              >
                  {/* The bar holding the lights */}
                  <div 
                    className="absolute flex items-center justify-between gap-6 px-10 py-6 bg-[#111] border-b-4 border-t-8 border-[#222]"
                    style={{
                      transform: 'rotateX(30deg) translateZ(-50px)',
                      boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9)'
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((index) => {
                       const isLit = litCount > index;
                       return (
                         <div key={index} className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#1A1A1A] border-4 border-[#050505]">
                            {/* The light bulb */}
                            <div 
                              className="absolute inset-1 rounded-full transition-all duration-75"
                              style={{
                                backgroundColor: isLit ? '#FF0000' : '#2A0505',
                                boxShadow: isLit 
                                   ? '0 0 60px 20px rgba(255,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.6)' 
                                   : 'inset 0 10px 20px rgba(0,0,0,0.8)',
                              }}
                            />
                         </div>
                       );
                    })}
                  </div>
              </div>

              {/* CENTER LOGO & PROGRESS */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-32">
                 <div className="flex items-baseline gap-1 select-none">
                   <span className="font-headline font-black italic text-6xl md:text-8xl text-white">F</span>
                   <span className="font-headline font-black italic text-6xl md:text-8xl text-[#E10600]">1</span>
                   <span className="font-headline font-black italic text-3xl md:text-5xl tracking-widest ml-4 text-white">STATS</span>
                 </div>
                 
                 {/* Tension RPM Bar */}
                 <div className="w-64 md:w-96 h-2 bg-[#1A1A1A] mt-8 rounded-full overflow-hidden border border-white/10">
                   <div 
                     className="h-full bg-gradient-to-r from-red-800 to-red-500"
                     style={{ 
                       width: `${progress}%`,
                       transition: phase === 'build' ? 'width 0.1s linear' : 'none'
                     }}
                   />
                 </div>
                 
                 <span className="mt-4 font-mono font-bold text-xs tracking-[0.5em] text-[#8b8d92]">
                    {phase === 'build' ? 'WARMING UP ENGINE' : 'REVS MAXED'} / {Math.floor(progress)}%
                 </span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* 
          Phase: Explosion 
          A massive expanding white disc that blows out the screen and fades 
      */}
      <AnimatePresence>
        {phase === 'explosion' && (
          <motion.div
             className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-white"
             initial={{ opacity: 1, scale: 0.1, filter: 'blur(0px)' }}
             animate={{ opacity: 0, scale: 20, filter: 'blur(40px)' }}
             transition={{ duration: 0.8, ease: "easeOut" }}
          >
             <div className="w-10 h-10 rounded-full bg-white drop-shadow-[0_0_100px_rgba(255,255,255,1)]" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
