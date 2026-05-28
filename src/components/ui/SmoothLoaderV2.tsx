import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SmoothLoaderV2() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'reveal' | 'loading' | 'exit' | 'done'>('reveal');
  const [visible, setVisible] = useState(true);

  // Phase sequencing
  useEffect(() => {
    setTimeout(() => setPhase('loading'), 600);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1.4, 100));
    }, 35);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (progress >= 100 && phase === 'loading') {
      setPhase('exit');
      setTimeout(() => setPhase('done'), 1000);
      setTimeout(() => setVisible(false), 1400);
    }
  }, [progress, phase]);

  // Scramble text effect
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const [scramble, setScramble] = useState('F1 STATS');
  useEffect(() => {
    if (phase !== 'loading') return;
    const target = 'F1 STATS';
    const interval = setInterval(() => {
      const revealed = Math.floor((progress / 100) * target.length);
      setScramble(
        target.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < revealed) return ch;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('')
      );
    }, 60);
    return () => clearInterval(interval);
  }, [phase, progress]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black overflow-hidden">
      {/* Diagonal wipe panels */}
      <AnimatePresence>
        {phase !== 'done' && (
          <>
            {/* Left panel */}
            <motion.div
              className="absolute inset-0 bg-[#E10600]"
              style={{ clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0% 100%)' }}
              initial={{ x: '-100%' }}
              animate={{
                x: phase === 'exit' ? '-110%' : '0%',
              }}
              transition={{
                duration: phase === 'exit' ? 0.5 : 0.6,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
            {/* Right panel */}
            <motion.div
              className="absolute inset-0 bg-[#1a1a1a]"
              style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)' }}
              initial={{ x: '100%' }}
              animate={{
                x: phase === 'exit' ? '110%' : '0%',
              }}
              transition={{
                duration: phase === 'exit' ? 0.5 : 0.6,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Content layer */}
      <AnimatePresence>
        {(phase === 'loading' || phase === 'reveal') && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
          >
            {/* Scramble text */}
            <div className="font-headline font-black italic text-6xl md:text-8xl tracking-[-0.03em] text-white mb-8 relative">
              {scramble.split('').map((ch, i) => (
                <span
                  key={i}
                  className={ch === scramble[i] && 'F1 STATS'[i] === ch ? 'text-white' : 'text-white/30'}
                  style={{ display: 'inline-block', minWidth: ch === ' ' ? '0.3em' : undefined }}
                >
                  {ch}
                </span>
              ))}
            </div>

            {/* Horizontal progress bar */}
            <div className="relative w-72 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-white rounded-full"
                style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(255,255,255,0.5)' }}
              />
            </div>

            {/* Status text */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[9px] font-mono text-white/30 tracking-[0.3em] uppercase">
                Initializing
              </span>
              <span className="text-[9px] font-mono text-[#E10600] tracking-[0.2em]">
                {Math.floor(progress)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
