import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchRaceResults, fetchQualifyingResults, fetchSprintResults, type Race, type QualifyingResult, type RaceResult } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { ResultsSkeleton } from '../components/ui/SkeletonLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

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
  useDocumentMeta('Race Results', 'Detailed F1 race results, classifications, qualifications, and sprint analytics.');
  const [searchParams, setSearchParams] = useSearchParams();
  const [completedRaces, setCompletedRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeSession, setActiveSession] = useState<'race' | 'quali' | 'sprint'>('race');
  const [qualiData, setQualiData] = useState<QualifyingResult[]>([]);
  const [sprintData, setSprintData] = useState<RaceResult[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);

  const { settings } = useSettings();
  const glass = settings.glassMorphism;

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

  useEffect(() => {
    if (!selectedRace) return;
    let mounted = true;
    setSessionLoading(true);
    setActiveSession('race'); // Reset to main race on round change
    
    Promise.all([
      fetchQualifyingResults(selectedRace.round),
      fetchSprintResults(selectedRace.round)
    ]).then(([q, s]) => {
      if (mounted) {
        setQualiData(q);
        setSprintData(s);
        setSessionLoading(false);
      }
    }).catch(e => {
      console.error('Session fetch error:', e);
      if (mounted) setSessionLoading(false);
    });

    return () => { mounted = false; };
  }, [selectedRace?.round]);

  if (loading) return <ResultsSkeleton />;

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  if (!selectedRace) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState 
          type="empty" 
          title="NO RESULTS AVAILABLE" 
          message="Race telemetry data for the selected round could not be located." 
        />
      </div>
    );
  }

  const renderRaceRows = (data: RaceResult[]) => {
    return data.map((result) => {
      const borderColors: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
      const borderColor = borderColors[result.position] || "transparent";
      const borderWidth = borderColors[result.position] ? "6px" : "4px";
      const isTop3 = result.position <= 3;
      const posColor = isTop3 ? borderColors[result.position] : "text-on-surface-variant opacity-50";

      // calc diff if grid > 0 (meaning they started the race)
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
    });
  };

  const renderQualiRows = (data: QualifyingResult[]) => {
    return data.map((result) => {
      const isOutQ1 = !result.q2;
      const isOutQ2 = result.q2 && !result.q3;
      
      let rowClass = "hover:bg-surface-container-high transition-colors";
      let nameConfig = isOutQ1 ? "text-white/50" : isOutQ2 ? "text-white/70" : "text-on-surface";
      let q1Style = isOutQ1 ? "font-bold text-[#E10600] drop-shadow-[0_0_8px_rgba(225,6,0,0.4)]" : "text-on-surface";
      let q2Style = isOutQ2 ? "font-bold text-[#ff8000] drop-shadow-[0_0_8px_rgba(255,128,0,0.4)]" : (isOutQ1 ? "text-white/10" : "text-on-surface");
      let q3Style = (!isOutQ1 && !isOutQ2) ? "font-bold text-[#00F0E0] drop-shadow-[0_0_8px_rgba(0,240,224,0.3)]" : "text-white/10";
      
      if (isOutQ1) rowClass += " bg-[rgba(225,6,0,0.03)]";
      if (isOutQ2) rowClass += " bg-[rgba(255,128,0,0.03)]";

      return (
        <tr key={result.driverId} className={rowClass} style={{ borderLeftColor: getTeamColor(result.teamId), borderLeftWidth: "4px" }}>
          <td className={`px-6 py-5 font-headline font-black text-2xl italic ${(isOutQ1 || isOutQ2) ? 'text-white/20' : 'text-on-surface-variant opacity-70'}`}>P{result.position}</td>
          <td className="px-6 py-5">
            <div className={`flex items-center gap-3 ${nameConfig}`}>
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-white shadow-inner">{result.driverCode}</div>
              <div>
                <span className="font-bold block">{result.driverName}</span>
                <span className="font-mono text-[10px] uppercase opacity-70">{result.driverCode}</span>
              </div>
            </div>
          </td>
          <td className={`px-6 py-5 ${nameConfig}`}>
            <div className="flex items-center gap-2 text-xs font-medium uppercase opacity-90">
              <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: getTeamColor(result.teamId) }}></div>
              {result.team}
            </div>
          </td>
          <td className={`px-6 py-5 font-mono text-xs ${q1Style}`}>{result.q1 || '—'}</td>
          <td className={`px-6 py-5 font-mono text-xs ${q2Style}`}>{result.q2 || '—'}</td>
          <td className={`px-6 py-5 font-mono text-xs ${q3Style}`}>{result.q3 || '—'}</td>
        </tr>
      );
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 pt-20 pb-12 w-full">
      {/* Page Title */}
      <header className={`mb-12 relative flex items-center justify-between ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg p-8 md:p-12' : ''}`}>
        <div>
          <p className="text-primary-container font-label text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Weekend Hub</p>
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
      <div className={`flex gap-1 overflow-x-auto no-scrollbar mb-8 pb-2 ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg p-3' : ''}`}>
        {completedRaces.map((race) => {
          const isSelected = selectedRace.round === race.round;
          return (
            <button 
              key={race.round}
              onClick={() => setSearchParams({ round: String(race.round) })}
              className={`flex-none px-6 py-4 flex flex-col items-center gap-2 transition-all min-w-[100px] ${glass ? 'rounded-xl' : ''} ${
                isSelected 
                  ? 'bg-primary-container text-on-primary-container f1-glow shadow-[0_0_20px_rgba(225,6,0,0.4)]' 
                  : `${glass ? 'bg-black/10 backdrop-blur-sm text-on-surface opacity-60 hover:opacity-100 hover:bg-black/20' : 'bg-surface-container-low text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-container'} group`
              }`}
            >
              <span className="font-headline font-bold text-xs tracking-tighter uppercase whitespace-nowrap">R{race.round}: {race.country} {race.flag}</span>
            </button>
          );
        })}
      </div>
      
      {/* Selected Race Details Section */}
      <section className={`overflow-hidden ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg' : 'bg-surface-container'}`}>
        {/* Card Header with Background */}
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
          <div className="flex flex-col gap-4 z-10 relative items-start md:items-end">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-2 rounded border border-white/10 hidden md:block">
              <span className="font-headline font-bold text-xl uppercase italic text-white flex items-center gap-2">
                ROUND {String(selectedRace.round).padStart(2, '0')}
              </span>
            </div>
            {/* Session Switcher Pills */}
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveSession('race')}
                className={`px-5 py-2 font-headline font-bold italic uppercase text-sm tracking-widest transition-all rounded ${
                  activeSession === 'race' ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                }`}
              >
                RACE
              </button>
              {qualiData.length > 0 && (
                <button 
                  onClick={() => setActiveSession('quali')}
                  className={`px-5 py-2 font-headline font-bold italic uppercase text-sm tracking-widest transition-all rounded ${
                    activeSession === 'quali' ? 'bg-[#00F0E0] text-black shadow-[0_0_15px_rgba(0,240,224,0.5)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  QUALIFYING
                </button>
              )}
              {sprintData.length > 0 && (
                <button 
                  onClick={() => setActiveSession('sprint')}
                  className={`px-5 py-2 font-headline font-bold italic uppercase text-sm tracking-widest transition-all rounded ${
                    activeSession === 'sprint' ? 'bg-[#ff8000] text-white shadow-[0_0_15px_rgba(255,128,0,0.5)]' : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  SPRINT
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results Table */}
        <div className="overflow-x-auto w-full min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/30 border-b border-surface-container-highest">
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Pos</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Driver</th>
                <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Team</th>
                
                {activeSession === 'quali' ? (
                  <>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Q1 Time</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Q2 Time</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Q3 Time</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">+/-</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Laps</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca]">Time/Status</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold uppercase tracking-widest text-[#c7c6ca] text-right">Pts</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {sessionLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined animate-spin text-white/20 text-4xl">autorenew</span>
                  </td>
                </tr>
              ) : activeSession === 'quali' ? (
                renderQualiRows(qualiData)
              ) : activeSession === 'sprint' ? (
                renderRaceRows(sprintData)
              ) : (
                renderRaceRows(selectedRace.results)
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
