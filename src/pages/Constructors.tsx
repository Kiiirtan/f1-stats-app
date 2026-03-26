import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchConstructorStandings, type ConstructorStanding } from '../data/api';
import { useSettings } from '../context/SettingsContext';

export default function Constructors() {
  const { settings } = useSettings();
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchConstructorStandings().then((data) => {
      if (mounted) {
        setStandings(data);
        setLoading(false);
      }
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <header className="mb-16 border-l-[12px] border-primary-container pl-8 py-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-label font-bold italic uppercase text-[var(--theme-accent)] tracking-widest text-sm">OFFICIAL FIA DATA</span>
          <span className="h-px w-12 bg-white/20"></span>
          <span className="font-label font-bold italic uppercase text-white/40 tracking-widest text-sm">2026 SEASON</span>
        </div>
        <h1 className="font-headline font-black italic uppercase text-6xl md:text-9xl text-white leading-[0.85] tracking-tighter mb-6">
          CONSTRUCTOR<br/><span className="text-primary-container">CHAMPIONSHIP</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-light border-t border-white/10 pt-6">
          The pinnacle of automotive engineering. 11 teams, 22 drivers, one goal: The 2026 World Constructors' Title.
        </p>
      </header>

      {/* Standings List */}
      <section className="grid gap-3">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-1 bg-[var(--theme-accent)] animate-pulse"></div>
          </div>
        ) : (
          standings.map((team, index) => {
            const hexColor = team.color || '#ffffff';
            // Calculate a descending width for the aesthetic glow bar based on position (e.g. 100% for P1, down by 10% each)
            const wPercent = Math.max(10, 100 - (index * 13)); 
            
            return (
              <div 
                key={team.constructorId} 
                className="group relative bg-surface-container-low hover:bg-surface-container transition-all duration-300 border-l-[6px] overflow-hidden"
                style={{ borderLeftColor: hexColor }}
              >
                <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6 relative z-10">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <span 
                      className="font-headline font-black italic text-5xl w-16 opacity-30" 
                      style={{ color: hexColor }}
                    >
                      {String(team.position).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined scale-125" style={{ color: hexColor }}>sports_score</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 
                            className="font-headline font-bold uppercase text-2xl text-white transition-colors"
                          >
                            {team.name}
                          </h3>
                        </div>
                        <p className="font-label font-bold italic uppercase text-[0.6875rem] text-white/40 tracking-widest">
                          {team.nationality} Formula 1 Team
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12 w-full md:w-auto justify-end relative">
                    <div className="text-right">
                      <span className="font-headline font-black italic text-4xl" style={{ color: hexColor }}>{team.points}</span>
                      <p className="font-label font-bold italic uppercase text-[0.6875rem] text-white/40">POINTS</p>
                    </div>
                    <div className="text-right border-l border-white/10 pl-8">
                      <span className="font-headline font-black italic text-4xl text-white">{team.wins}</span>
                      <p className="font-label font-bold italic uppercase text-[0.6875rem] text-white/40">WINS</p>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest relative">
                  <div 
                    className="h-full glow-bar" 
                    style={{ 
                      width: `${wPercent}%`, 
                      backgroundColor: hexColor, 
                      boxShadow: `0 0 15px ${hexColor}99`
                    }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Stats Grid Breakdown (Bento Style) */}
      <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container-low border border-white/5 p-8 flex flex-col justify-between min-h-[320px]">
          <div>
            <span className="font-label font-bold italic uppercase text-[var(--theme-accent)] text-xs tracking-[0.2em]">ENGINEERING INSIGHT</span>
            <h2 className="font-headline font-black italic uppercase text-4xl text-white mt-4 leading-none">TECHNICAL<br/>SUPREMACY</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            <div className="border-t border-white/10 pt-4">
              <p className="text-[0.6875rem] text-white/40 font-bold italic uppercase tracking-tighter">Reliability Index</p>
              <p className="text-3xl font-headline font-bold text-white mt-1">98.4%</p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-[0.6875rem] text-white/40 font-bold italic uppercase tracking-tighter">Pit Stop Avg</p>
              <p className="text-3xl font-headline font-bold text-white mt-1">2.14<span className="text-xs ml-1 font-light opacity-40 uppercase italic">sec</span></p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-[0.6875rem] text-white/40 font-bold italic uppercase tracking-tighter">Top Speed</p>
              <p className="text-3xl font-headline font-bold text-white mt-1">
                {settings.units === 'metric' ? '354' : '220'}
                <span className="text-xs ml-1 font-light opacity-40 uppercase italic">
                  {settings.units === 'metric' ? 'km/h' : 'mph'}
                </span>
              </p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-[0.6875rem] text-white/40 font-bold italic uppercase tracking-tighter">Lateral G-Force</p>
              <p className="text-3xl font-headline font-bold text-white mt-1">5.8<span className="text-xs ml-1 font-light opacity-40 uppercase italic">g</span></p>
            </div>
          </div>
        </div>
        <div className="bg-[#1b1b23] border border-white/5 relative overflow-hidden min-h-[320px] group">
          <img alt="Engineering Focus" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAicppLYrmQxUPQ6mvGDEGfDf2kua1pFK3ezmxx6r0zmCE_JVlPPb8W8q5Eb_xqAgllNut_W9LfwawpV7V-XHsnL9t1Qk-Bz3ECG7vJUTyDerJbEY2Z6s1ltpAuUkuoD_3awf7iiXQEuMkxEf2sRGmGkhHf9zVoIDTSbeQTZ_iDn2IZCrm0xaouTe4JJNluvhWDA-CTuZ-W_dEKX-5oa4F97SkWu0e2B4mP9TRn1K_ghkrNEnEEpmI-gEPjlMVKtb3Iy4Na-CVwfgU" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13131b] via-[#13131b]/60 to-transparent p-8 flex flex-col justify-end">
            <span className="font-label font-bold italic uppercase text-[var(--theme-accent)] text-xs tracking-widest">INNOVATION HUB</span>
            <h3 className="font-headline font-black italic uppercase text-3xl text-white mt-3">2026 POWER UNIT</h3>
            <p className="text-sm text-white/60 mt-2 font-light leading-relaxed">Official FIA architecture specifications for the upcoming regulatory shift.</p>
            <div className="mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
              <span className="text-[0.6875rem] font-bold italic uppercase text-white tracking-widest">Explore Tech Docs</span>
              <span className="material-symbols-outlined text-[var(--theme-accent)] text-sm">arrow_forward_ios</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
