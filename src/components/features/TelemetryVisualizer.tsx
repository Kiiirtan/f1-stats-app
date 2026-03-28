import { useState, useEffect } from 'react';

export default function TelemetryVisualizer() {
  const [speed, setSpeed] = useState(312);
  const [rpm, setRpm] = useState(11500);
  const [gear, setGear] = useState(8);
  const [throttle, setThrottle] = useState(100);
  const [brake, setBrake] = useState(0);

  // Animate the telemetry values slightly to make it feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate DRS straight telemetry fluctuations
      setSpeed(prev => Math.floor(prev + (Math.random() * 6 - 2)));
      setRpm(prev => Math.floor(prev + (Math.random() * 400 - 150)));
      
      // Randomly simulate a braking zone every few seconds
      if (Math.random() > 0.85) {
        setThrottle(Math.floor(Math.random() * 30));
        setBrake(Math.floor(Math.random() * 80 + 20));
        setGear(prev => Math.max(2, prev - 1));
        setSpeed(prev => prev - 25);
      } else {
        setThrottle(100);
        setBrake(0);
        setGear(prev => Math.min(8, prev + (Math.random() > 0.8 ? 1 : 0)));
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="col-span-1 lg:col-span-2 relative min-h-[300px] overflow-hidden group border border-white/5 bg-[#0f0f15] p-8 flex flex-col justify-between">
      {/* Background Tech Grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--theme-accent)] rounded-full blur-[120px] opacity-[0.08] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-widest text-[var(--theme-accent)] text-xs block mb-2 drop-shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)] animate-pulse"></span>
            LIVE TELEMETRY FEED
          </span>
          <h3 className="font-headline font-black text-3xl text-white uppercase italic drop-shadow-lg leading-none">
            ENGINE <span className="text-white/40">DYNAMICS</span>
          </h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-white/50 mb-1">DATA LINK: SECURE</p>
          <p className="font-mono text-[10px] text-[var(--theme-accent)]">LATENCY: 12ms</p>
        </div>
      </div>

      {/* Main Dashboard UI */}
      <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
        
        {/* Speed / Gear Block */}
        <div className="col-span-1 flex flex-col">
          <p className="font-['Space_Grotesk'] text-xs font-bold text-white/50 mb-4 tracking-widest">DRIVETRAIN</p>
          <div className="flex items-end gap-3 mb-4">
            <span className="font-headline font-black text-6xl text-white leading-none tracking-tighter w-24">{speed}</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-white/40 mb-1 italic">KM/H</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="font-headline font-black text-4xl text-[var(--theme-accent)] leading-none tracking-tighter w-8">{gear}</span>
            <span className="font-['Space_Grotesk'] text-sm font-bold text-white/40 mb-1 italic">GEAR</span>
          </div>
        </div>

        {/* RPM Arch / Visualizer */}
        <div className="col-span-1 flex flex-col items-center justify-end relative h-32">
          {/* Faux SVG RPM LED Arch */}
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            {/* Background Track */}
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" />
            {/* Active RPM (approx 0-15000) scaled to stroke-dasharray */}
            <path 
              d="M 10 50 A 40 40 0 0 1 90 50" 
              fill="none" 
              stroke="var(--theme-accent)" 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray="125.6"
              style={{ strokeDashoffset: 125.6 - (125.6 * (Math.min(rpm, 15000) / 15000)), transition: 'stroke-dashoffset 0.4s ease-out' }}
            />
          </svg>
          <div className="absolute bottom-0 text-center flex flex-col items-center">
            <span className="font-headline font-black text-2xl text-white tracking-widest">{rpm}</span>
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-white/40 tracking-[0.2em] italic">RPM</span>
          </div>
        </div>

        {/* Brake / Throttle Pedals */}
        <div className="col-span-1 flex justify-start sm:justify-end gap-6 h-32">
          {/* Brake */}
          <div className="flex flex-col items-center justify-end h-full">
            <div className="w-8 h-24 bg-white/5 rounded-sm flex items-end p-1 relative overflow-hidden">
              <div 
                className="w-full bg-[#E10600] rounded-sm transition-all duration-200"
                style={{ height: `${brake}%`, boxShadow: '0 0 10px rgba(225,6,0,0.5)' }}
              ></div>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-white/50 mt-3 tracking-wider">BRK</span>
          </div>
          {/* Throttle */}
          <div className="flex flex-col items-center justify-end h-full">
            <div className="w-8 h-24 bg-white/5 rounded-sm flex items-end p-1 relative overflow-hidden">
              <div 
                className="w-full bg-[#00E676] rounded-sm transition-all duration-200"
                style={{ height: `${throttle}%`, boxShadow: '0 0 10px rgba(0,230,118,0.5)' }}
              ></div>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-white/50 mt-3 tracking-wider">THR</span>
          </div>
        </div>

      </div>
    </div>
  );
}
