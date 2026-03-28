import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchRaceResults, type Race } from '../data/api';
import DataState from '../components/ui/DataState';

const TEAM_COLORS: Record<string, string> = {
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  red_bull: '#3671C6',
  aston_martin: '#229971',
  alpine: '#2293D1',
  williams: '#1868DB',
  rb: '#6692FF',
  haas: '#B6BABD',
  audi: '#52E252',
  cadillac: '#C0C0C0',
  sauber: '#52E252',
};

function getTeamColor(teamId: string): string {
  return TEAM_COLORS[teamId] || '#66FCF1';
}

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedRaces, setCompletedRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchRaceResults().then((data) => {
      if (mounted) {
        setCompletedRaces(data.filter(r => r.results && r.results.length > 0));
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const selectedRound = parseInt(searchParams.get('round') || '0', 10);
  const selectedRace = completedRaces.find((r) => r.round === selectedRound) || completedRaces[completedRaces.length - 1];

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 pb-20 flex justify-center items-center min-h-[50vh]">
        <div className="w-16 h-1 bg-[var(--theme-accent)] animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  if (!selectedRace) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <DataState 
          type="empty" 
          title="NO RESULTS AVAILABLE" 
          message="Race telemetry data for the selected round could not be located." 
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 md:py-24 w-full">
      {/* Page Title */}
      <header className="mb-12 relative flex items-center justify-between">
        <div>
          <p className="text-primary-container font-label text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Full Results</p>
          <h1 className="font-headline text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none flex items-center gap-4">
            Race <span className="text-primary-container">Battles</span>
          </h1>
        </div>
        <div className="opacity-20 hidden lg:block">
          <svg className="w-64" fill="currentColor" viewBox="0 0 100 20">
            <path d="M0 15 L20 15 L30 10 L70 10 L80 15 L100 15 L100 18 L0 18 Z"></path>
            <circle cx="25" cy="16" r="3"></circle>
            <circle cx="75" cy="16" r="3"></circle>
            <rect height="2" width="30" x="35" y="5"></rect>
          </svg>
        </div>
      </header>
      
      {/* Race Selector Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar mb-8 pb-2">
        {completedRaces.map((race) => {
          const isSelected = selectedRace.round === race.round;
          return (
            <button 
              key={race.round}
              onClick={() => setSearchParams({ round: String(race.round) })}
              className={`flex-none px-6 py-4 flex flex-col items-center gap-2 transition-all min-w-[100px] ${
                isSelected 
                  ? 'bg-primary-container text-on-primary-container f1-glow shadow-[0_0_20px_rgba(225,6,0,0.4)]' 
                  : 'bg-surface-container-low text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container group'
              }`}
            >
              <span className="font-headline font-bold text-xs tracking-tighter uppercase whitespace-nowrap">R{race.round}: {race.country} {race.flag}</span>
            </button>
          );
        })}
      </div>
      
      {/* Selected Race Results Card */}
      <section className="bg-surface-container overflow-hidden">
        {/* Card Header with Background and Map */}
        <div className="px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-primary-container relative bg-surface-container-low" style={{ backgroundImage: "linear-gradient(90deg, rgba(31, 31, 39, 0.95) 30%, rgba(31, 31, 39, 0.7) 100%)" }}>
          <div className="z-10 relative">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{selectedRace.flag}</span>
              <h2 className="font-headline text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                {selectedRace.name.replace('Grand Prix', 'GP')}
              </h2>
            </div>
            <p className="text-white/70 font-label text-sm uppercase tracking-widest">{selectedRace.circuit} • {new Date(selectedRace.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-10 z-10 relative">
            <div className="flex gap-4">
              <div className="bg-black/60 backdrop-blur-sm p-4 min-w-[120px] border border-white/10">
                <p className="text-[10px] text-white/50 uppercase mb-1">Status</p>
                <p className="font-headline font-bold text-xl uppercase italic text-white">Finalized</p>
              </div>
              <div className="bg-black/60 backdrop-blur-sm p-4 min-w-[120px] border border-white/10 hidden md:block">
                <p className="text-[10px] text-white/50 uppercase mb-1">Round</p>
                <p className="font-headline font-bold text-xl uppercase italic text-white">{String(selectedRace.round).padStart(2, '0')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Pos</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Driver</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Team</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">+/-</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Laps</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Time/Status</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {selectedRace.results.map((result) => {
                  const borderColors: Record<number, string> = {
                    1: "#FFD700",
                    2: "#C0C0C0",
                    3: "#CD7F32"
                  };
                  const borderColor = borderColors[result.position] || "transparent";
                  const borderWidth = borderColors[result.position] ? "6px" : "4px";
                  const isTop3 = result.position <= 3;
                  const posColor = isTop3 ? borderColors[result.position] : "text-on-surface-variant opacity-50";

                  // calc diff if grid > 0 (meaning they started the race!)
                  const posDiff = result.grid > 0 ? result.grid - result.position : 0;
                  
                  return (
                      <tr key={result.driverId} className="hover:bg-surface-container-high transition-colors" style={{ borderLeftColor: isTop3 ? borderColor : getTeamColor(result.teamId), borderLeftWidth: borderWidth }}>
                        <td className={`px-6 py-5 font-headline font-black text-2xl italic`} style={isTop3 ? {color: borderColor} : {}}><span className={!isTop3 ? posColor : ''}>P{result.positionText}</span></td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3 text-on-surface">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface">{result.driverCode}</div>
                            <div>
                              <span className="font-bold text-on-surface block">{result.driverName}</span>
                              <span className="font-mono text-[10px] text-on-surface-variant uppercase">{result.driverCode}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium uppercase">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getTeamColor(result.teamId) }}></div>
                            {result.team}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold font-mono text-xs">
                           {posDiff > 0 ? <span className="text-green-500">▲ {posDiff}</span> : posDiff < 0 ? <span className="text-red-500 text-opacity-80">▼ {Math.abs(posDiff)}</span> : <span className="text-on-surface-variant opacity-40">—</span>}
                        </td>
                        <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">{result.laps}</td>
                        <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">{result.time} {result.fastestLap && <span className="material-symbols-outlined text-[14px] text-purple-500 ml-1 inline-block" title={`Fastest Lap: ${result.fastestLap}`} style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>}</td>
                        <td className="px-6 py-5 font-headline font-bold text-xl text-primary-container text-right italic">{result.points > 0 ? result.points : ''}</td>
                      </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
