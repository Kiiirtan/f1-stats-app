import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 w-full -mt-16 md:-mt-24">
      {/* Massive Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="font-headline font-bold italic text-f1-cyan opacity-[0.03] select-none tracking-tighter leading-none whitespace-nowrap" style={{ fontSize: "14rem" }}>
          404
        </span>
      </div>

      {/* 404 Section with Technical Glow */}
      <section className="relative z-10 w-full max-w-2xl text-center py-24 flex flex-col items-center" style={{ background: "radial-gradient(circle at center, rgba(102, 252, 241, 0.1) 0%, rgba(19, 19, 27, 0) 70%)" }}>
        {/* Icon/Indicator */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-16 h-1 bg-[#66FCF1] animate-pulse"></div>
          <span className="material-symbols-outlined text-[#66FCF1] mx-4 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div className="w-16 h-1 bg-[#66FCF1] animate-pulse"></div>
        </div>

        {/* Heading */}
        <h1 className="font-headline font-bold italic uppercase tracking-tighter mb-4 text-6xl md:text-8xl flex flex-wrap justify-center gap-2">
          <span className="text-white">OFF</span>
          <span className="text-[#66FCF1] text-glow-cyan drop-shadow-[0_0_15px_rgba(102,252,241,0.6)]">TRACK</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/40 max-w-[400px] mb-12 font-medium leading-relaxed">
          Looks like you've taken a wrong turn. This page doesn't exist on the circuit. Check your telemetry or return to the main hub.
        </p>

        {/* CTA Cluster */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link to="/" className="bg-primary-container text-on-primary-container px-8 py-4 font-headline font-bold italic uppercase tracking-tight text-sm flex items-center justify-center transition-all duration-100 ease-linear hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined mr-2 text-base">directions_run</span>
            BACK TO PIT LANE
          </Link>
          <Link to="/drivers" className="border border-[#66FCF1]/40 text-[#66FCF1] px-8 py-4 font-headline font-bold italic uppercase tracking-tight text-sm flex items-center justify-center transition-all duration-100 ease-linear hover:bg-[#66FCF1]/10 active:scale-95">
            <span className="material-symbols-outlined mr-2 text-base">groups</span>
            VIEW DRIVERS
          </Link>
        </div>

        {/* Technical Detail Metadata */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-20">
          <div className="text-left border-l border-[#66FCF1]/30 pl-3">
            <p className="font-headline text-[0.6875rem] font-bold italic uppercase tracking-widest text-[#66FCF1]">ERROR_CODE</p>
            <p className="font-mono text-xs">ERR_NULL_SECTOR_404</p>
          </div>
          <div className="text-left border-l border-[#66FCF1]/30 pl-3">
            <p className="font-headline text-[0.6875rem] font-bold italic uppercase tracking-widest text-[#66FCF1]">LATENCY</p>
            <p className="font-mono text-xs">0.0034 MS</p>
          </div>
          <div className="text-left border-l border-[#66FCF1]/30 pl-3">
            <p className="font-headline text-[0.6875rem] font-bold italic uppercase tracking-widest text-[#66FCF1]">VECTOR</p>
            <p className="font-mono text-xs">UNKNOWN_TRAJECTORY</p>
          </div>
          <div className="text-left border-l border-[#66FCF1]/30 pl-3">
            <p className="font-headline text-[0.6875rem] font-bold italic uppercase tracking-widest text-[#66FCF1]">STATUS</p>
            <p className="font-mono text-xs">DISCONNECTED</p>
          </div>
        </div>
      </section>
    </div>
  );
}
