import { useState, useEffect } from 'react';

export default function SmoothLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating progress curve
        const increment = p < 60 ? 4 : p < 85 ? 2 : 1;
        return Math.min(p + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setFadeOut(true), 200);
      const hideTimer = setTimeout(() => setVisible(false), 800);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-c-60 flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Racing line animation */}
      <div className="relative mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-t-bright">
          F1 <span className="text-c-10">STATS</span>
        </h1>
      </div>

      {/* F1 car silhouette moving across */}
      <div className="relative w-64 md:w-96 h-8 mb-6">
        <div
          className="absolute top-0 text-2xl transition-all duration-100 ease-linear"
          style={{ left: `${Math.min(progress, 95)}%` }}
        >
          🏎️
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-64 md:w-96 h-1 bg-c-30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-c-10 to-cyan-300 rounded-full transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(102,252,241,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <p className="mt-6 text-xs font-label uppercase tracking-[0.3em] text-t-main/50">
        {progress < 100 ? 'LOADING TELEMETRY...' : 'SYSTEMS ONLINE'}
      </p>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(102,252,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(102,252,241,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}
