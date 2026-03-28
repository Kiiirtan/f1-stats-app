import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchConstructorStandings, type ConstructorStanding } from '../data/api';
import DataState from '../components/ui/DataState';

export default function Constructors() {
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchConstructorStandings().then((data) => {
      if (mounted) {
        setStandings(data);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
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
        <h1 className="font-headline font-black italic uppercase text-5xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tighter mb-6">
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
        ) : error ? (
          <DataState type="error" onAction={() => window.location.reload()} />
        ) : (
          standings.map((team, index) => {
            const hexColor = team.color || '#ffffff';
            // Calculate a descending width for the aesthetic glow bar based on position (e.g. 100% for P1, down by 10% each)
            const wPercent = Math.max(10, 100 - (index * 13)); 
            
            return (
              <Link 
                to={`/constructor/${team.constructorId}`}
                key={team.constructorId} 
                className="group relative bg-surface-container-low hover:bg-surface-container transition-all duration-300 border-l-[6px] overflow-hidden block"
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
                        <span className="material-symbols-outlined scale-125 transition-transform group-hover:scale-150" style={{ color: hexColor }}>sports_score</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 
                            className="font-headline font-bold uppercase text-2xl text-white transition-colors"
                          >
                            {team.name}
                          </h3>
                        </div>
                        <p className="font-label font-bold italic uppercase text-[0.6875rem] text-white/40 tracking-widest group-hover:text-white/70 transition-colors">
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
                    <div className="hidden md:flex ml-4 items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                      <span className="material-symbols-outlined text-sm text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward_ios</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-surface-container-lowest relative">
                  <div 
                    className="h-full glow-bar group-hover:shadow-[0_0_20px_var(--tw-shadow-color)] transition-shadow" 
                    style={{ 
                      width: `${wPercent}%`, 
                      backgroundColor: hexColor, 
                      '--tw-shadow-color': `${hexColor}99`
                    } as React.CSSProperties}
                  ></div>
                </div>
              </Link>
            );
          })
        )}
      </section>

    </div>
  );
}
