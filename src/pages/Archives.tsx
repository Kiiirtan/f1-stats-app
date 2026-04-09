import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useSettings } from '../context/SettingsContext';

export default function Archives() {
  useDocumentMeta('Archives – Coming Soon', 'The F1 Stats historical archives are under construction. Stay tuned for 25+ years of championship data.');
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  return (
    <div className="pt-20 pb-20 px-4 md:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center min-h-[70vh] text-center">

      {/* Animated glow ring */}
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-full blur-[60px] opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #E10600 0%, transparent 70%)' }} />
        <div className={`relative w-36 h-36 rounded-full flex items-center justify-center border-2 ${glass ? 'bg-white/[0.04] backdrop-blur-xl border-white/10' : 'bg-surface-container border-white/5'}`}>
          <span className="material-symbols-outlined text-white/80" style={{ fontSize: '56px' }}>lock</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-headline font-black uppercase tracking-tighter text-4xl md:text-5xl text-white mb-4 drop-shadow-lg">
        COMING SOON
      </h1>

      {/* Subtitle */}
      <p className="font-label text-sm md:text-base text-white/50 max-w-md leading-relaxed mb-8">
        We're building the ultimate historical archives — 25+ years of champions, race results, and telemetry data. This section is currently under development.
      </p>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-headline font-bold uppercase tracking-[0.2em] ${glass ? 'bg-white/[0.06] backdrop-blur-md border border-white/10' : 'bg-surface-container-low border border-white/5'}`}>
        <span className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse" />
        <span className="text-white/60">Under Development</span>
      </div>

      {/* Decorative divider */}
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-10" />

      {/* Teaser stats */}
      <div className="flex gap-8 md:gap-14">
        {[
          { value: '25+', label: 'Seasons' },
          { value: '1000+', label: 'Races' },
          { value: '100+', label: 'Champions' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="font-headline font-black text-2xl md:text-3xl text-white/20">{stat.value}</span>
            <span className="font-label text-[10px] text-white/30 uppercase tracking-widest mt-1">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
