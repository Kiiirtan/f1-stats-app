import { useState, useEffect } from 'react';

export default function SmoothLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [phase, setPhase] = useState<'rev' | 'launch' | 'done'>('rev');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = p < 30 ? 2 : p < 60 ? 3 : p < 85 ? 4 : 2;
        return Math.min(p + increment, 100);
      });
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // Phase transitions
  useEffect(() => {
    if (progress >= 50 && phase === 'rev') setPhase('launch');
    if (progress >= 100) setPhase('done');
  }, [progress, phase]);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 300);
      const hideTimer = setTimeout(() => setVisible(false), 1000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress]);

  if (!visible) return null;

  // Simulated RPM value based on progress
  const rpm = Math.floor((progress / 100) * 18000);
  const rpmPercent = Math.min(progress * 1.2, 100);

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, #1a0a0a 0%, #0a0a0f 40%, #050508 100%)' }}
    >
      {/* Animated grid floor perspective */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          perspective: '400px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        <div
          className="absolute left-0 right-0 bottom-0 h-[60%] opacity-[0.06]"
          style={{
            transform: 'rotateX(55deg)',
            transformOrigin: 'center bottom',
            backgroundImage:
              'linear-gradient(rgba(225,6,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(225,6,0,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridScroll 2s linear infinite',
          }}
        />
      </div>

      {/* Horizontal light streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px]"
            style={{
              top: `${20 + i * 15}%`,
              left: '-100%',
              width: '80%',
              background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'rgba(225,6,0,0.4)' : 'rgba(255,180,168,0.3)'}, transparent)`,
              animation: `streakAcross ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Red glow pulse behind logo */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(225,6,0,0.12) 0%, rgba(225,6,0,0.03) 40%, transparent 70%)',
          animation: 'glowPulse 1.5s ease-in-out infinite',
          filter: 'blur(40px)',
        }}
      />

      {/* Main Logo */}
      <div className="relative z-10 mb-10">
        {/* Top accent line */}
        <div
          className="w-full h-[2px] mb-6 overflow-hidden"
          style={{ maxWidth: '280px', margin: '0 auto 24px' }}
        >
          <div
            className="h-full bg-gradient-to-r from-transparent via-[#E10600] to-transparent"
            style={{
              width: `${progress}%`,
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* F1 Logo Area */}
        <div className="flex flex-col items-center gap-2">
          {/* "F" and "1" side by side — large cinematic typography */}
          <div className="flex items-baseline gap-0 select-none">
            <span
              className="font-headline font-black italic text-[80px] md:text-[120px] leading-none tracking-tighter text-white"
              style={{
                textShadow: phase !== 'rev'
                  ? '0 0 40px rgba(225,6,0,0.6), 0 0 80px rgba(225,6,0,0.3)'
                  : 'none',
                transition: 'text-shadow 0.5s ease',
              }}
            >
              F
            </span>
            <span
              className="font-headline font-black italic text-[80px] md:text-[120px] leading-none tracking-tighter"
              style={{
                color: '#E10600',
                textShadow: '0 0 30px rgba(225,6,0,0.6), 0 0 60px rgba(225,6,0,0.2)',
              }}
            >
              1
            </span>
          </div>

          {/* "STATS" text with letter reveal */}
          <div className="flex gap-[5px] md:gap-[8px] overflow-hidden">
            {'STATS'.split('').map((char, i) => (
              <span
                key={i}
                className="font-headline font-black italic text-2xl md:text-4xl tracking-[0.25em] uppercase"
                style={{
                  color: progress > i * 15 ? '#e4e1ee' : 'transparent',
                  transform: progress > i * 15 ? 'translateY(0)' : 'translateY(20px)',
                  opacity: progress > i * 15 ? 1 : 0,
                  transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="w-full h-[2px] mt-6 overflow-hidden"
          style={{ maxWidth: '280px', margin: '24px auto 0' }}
        >
          <div
            className="h-full bg-gradient-to-r from-transparent via-[#E10600] to-transparent float-right"
            style={{
              width: `${progress}%`,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>

      {/* RPM Gauge */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        {/* RPM Bar */}
        <div className="w-60 md:w-80 h-3 bg-[#1a1a2e] rounded-sm overflow-hidden border border-white/5 relative">
          {/* RPM segments */}
          <div className="absolute inset-0 flex">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-black/40"
                style={{
                  backgroundColor:
                    i < Math.floor(rpmPercent / 5)
                      ? i >= 15
                        ? '#E10600'
                        : i >= 12
                          ? '#ff6b35'
                          : '#ffb4a8'
                      : 'transparent',
                  opacity: i < Math.floor(rpmPercent / 5) ? 1 : 0.1,
                  transition: 'all 0.1s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* RPM readout */}
        <div className="flex items-baseline gap-3 mt-3">
          <span className="font-mono text-xl md:text-2xl font-bold tabular-nums text-white/80 tracking-wider">
            {rpm.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-headline font-bold">
            RPM
          </span>
        </div>
      </div>

      {/* Status Text */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <p className="text-[10px] md:text-xs font-headline uppercase tracking-[0.4em] text-white/40 font-bold">
          {progress < 30
            ? '◆ INITIALIZING SYSTEMS'
            : progress < 60
              ? '◆ CONNECTING TO PADDOCK'
              : progress < 85
                ? '◆ LOADING TELEMETRY'
                : progress < 100
                  ? '◆ PREPARING GRID'
                  : '◆ LIGHTS OUT — GO GO GO'}
        </p>

        {/* Five lights system — like F1 race start */}
        <div className="flex gap-3 mt-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/10 transition-all duration-300"
              style={{
                backgroundColor:
                  progress >= 100
                    ? 'transparent' // lights out!
                    : progress >= (i + 1) * 18
                      ? '#E10600'
                      : '#1a1a2e',
                boxShadow:
                  progress >= 100
                    ? 'none'
                    : progress >= (i + 1) * 18
                      ? '0 0 12px rgba(225,6,0,0.8), inset 0 0 6px rgba(255,255,255,0.2)'
                      : 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#E10600]/30 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-[#E10600]/30 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-[#E10600]/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#E10600]/30 pointer-events-none" />

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes streakAcross {
          0% { left: -80%; opacity: 0; }
          20% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
