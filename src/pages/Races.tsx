import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRaceCalendar, type Race } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { RacesSkeleton } from '../components/ui/SkeletonLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Races() {
  useDocumentMeta('Race Archive', 'Historical F1 race archives, round-by-round results, and seasonal performance.');
  const [calendar, setCalendar] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  useEffect(() => {
    let mounted = true;
    fetchRaceCalendar().then((data) => {
      if (mounted) {
        setCalendar(data);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const totalRounds = calendar.length;
  const completedRaces = calendar.filter((r) => r.completed);
  const nextRace = calendar.find((r) => !r.completed);
  const upcomingRaces = calendar.filter((r) => !r.completed && r.round !== nextRace?.round);

  if (loading) {
    return <RacesSkeleton />;
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header Section */}
      <header className="mb-16">
        <h1 className="text-5xl md:text-8xl font-black italic uppercase headline-font tracking-tighter leading-none mb-4 text-on-surface">
          THE CIRCUIT
        </h1>
        <div className="flex items-center gap-4 text-primary-fixed-dim headline-font font-bold italic uppercase tracking-widest text-sm md:text-lg flex-wrap">
          <span className="bg-surface-container px-3 py-1">{completedRaces.length} completed</span>
          <span className="opacity-30">•</span>
          <span className="bg-surface-container px-3 py-1">{calendar.length - completedRaces.length} upcoming</span>
          <span className="opacity-30">•</span>
          <span className="bg-primary-container text-on-primary-container px-3 py-1">{totalRounds} total rounds</span>
        </div>
      </header>
      
      {/* Next Race Highlight */}
      {nextRace && (
        <section className="mb-20">
          <div className={`relative group border-l-8 border-[#ffb4a8] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(180,197,255,0.1)] min-h-[400px] ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg' : 'bg-surface-container'}`}>
            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
              <img alt="Next Race Background" className="w-full h-full object-cover grayscale brightness-[0.4]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSeUPhrB9vGtuFqo7zlV2FWbGRwoNnWz5spgDz8YiGA1BcJrFb2vt4iEclkJGNbjIpNCFuaYqKoZm56ES8HW5_1kwKbIQ_tmd0-WCNcFVxxvU5IfZpZFKIuguYH7quVWpRJLhtDEDEfkbYfND22S7qY8NObqyxbjAmURP42cHlB-OGwiKOpizsCU2At1pys84RoHd5o4-5Y8B0eNJGSOFw-YK03a4j5rfXiNINz2JwKkCXdZUNdyzF9vZw6osyPrGUiP48fE9Ea28" />
            </div>
            {/* Track Silhouette Placeholder */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 w-1/3 h-2/3 pointer-events-none pr-12 hidden md:block">
              <img alt="Track Layout" className="w-full h-full object-contain invert brightness-200 circuit-silhouette" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6o2Q55b1YkXByT07Qj_rc49UWCoIf_ndridYxeQML5kthPIsDvA2fzD9vHrEjvZMTGn3bZTFF3yRi2sGn6alhF-t0kzy5t14DcNLMyflfFXDVp5nO_r7y41NyBdCOqql5eslGGbG1SMS3BM-GmmQBrfdW_iW2OFKZ_XNjFo2iaJ-L1Ja-Kj6DJqO19Qay6UUOCo_dJ03CAoODNMZQkeYOVB1e2TnzRmav6DENFAocS4e8cYuQSJ1I7t4WqmTzFedczjkHAyO9gd0" />
            </div>
            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="flex items-center gap-2 bg-[#ffb4a8] text-[#13131b] headline-font font-black italic uppercase px-3 py-1 text-sm tracking-tighter">
                    NEXT UP - ROUND {String(nextRace.round).padStart(2, '0')}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl headline-font font-black italic uppercase tracking-tighter leading-none mb-2">
                  {nextRace.name}
                </h2>
                <p className="text-lg md:text-2xl text-cyan-400 headline-font font-bold italic uppercase tracking-widest flex items-center gap-2 mt-2">
                  {nextRace.circuit}, {new Date(nextRace.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} {nextRace.flag}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8 mt-12 w-full">
                <div className="flex flex-col items-start gap-2">
                  <div className="text-xs uppercase tracking-[0.2em] opacity-70 headline-font">Countdown to Grand Prix</div>
                  <div className="flex gap-4 headline-font font-black italic text-5xl text-on-surface">
                    <span>--<small className="text-xs opacity-40 ml-1">D</small></span>
                    <span>--<small className="text-xs opacity-40 ml-1">H</small></span>
                  </div>
                </div>
                <Link to={`/results?round=${nextRace.round}`} className="bg-primary-container text-on-primary-container headline-font font-black italic uppercase px-12 py-5 text-xl tracking-tighter hover:bg-primary-fixed-dim transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl w-full md:w-auto text-center block">
                  RACE HUB
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Atmosphere Section 1 */}
      <div className="w-full h-40 relative my-12 overflow-hidden opacity-20 pointer-events-none">
        <img alt="Grandstand crowd" className="w-full h-full object-cover object-center grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfaNBv_naUJBO9j0vkp2mP5Zm_PYNVrNlBP7aJxFdv9dzzk0Os6c6uGtoNO2mrzF5nwhwdBYKa-SRZXb6gcSJGldyHWck85VG4tT8scpM71rhUdDb4fF32O1aTVjXt6UXbN_nNT8414MIfS7qMvUaf8PNARbXxfZKsWzqLtaEaMJyQuPhx6x8HohzhoWe6xrw-2hbIw1XjE2EkWwMV9DVxQXrLxcAU6UdiTw559CqJVoKGZEDo0bzunQ01jRmtF2FvlZKqUl-EfQs" />
      </div>
      
      {/* Completed Races */}
      {completedRaces.length > 0 && (
        <section className="mb-20">
          <h3 className="headline-font font-black italic uppercase text-2xl mb-8 tracking-tighter flex items-center gap-4">
            RECENT DATA <span className="h-[2px] flex-grow bg-surface-container-highest/30"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completedRaces.map((race) => (
              <Link 
                key={race.round} 
                to={`/results?round=${race.round}`} 
                className={`group relative transition-all duration-500 overflow-hidden border block ${glass ? 'bg-black/10 backdrop-blur-sm border-white/20 rounded-xl hover:bg-black/20 hover:border-white/40' : 'bg-surface-container-low border-white/5 hover:bg-surface-container'}`}
              >
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-full h-full bg-black/50"></div>
                </div>
                <div className="relative z-10 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-primary-container headline-font font-black italic text-2xl opacity-40">
                      R{String(race.round).padStart(2, '0')}
                    </span>
                    <span className="bg-surface-container-highest px-2 py-1 text-[10px] headline-font font-bold tracking-[0.2em] border border-white/10">FINISHED</span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-2xl headline-font font-black italic uppercase tracking-tighter">
                      {race.name.replace('Grand Prix', 'GP')}
                    </h4>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium mb-6 uppercase">
                    {race.circuit}
                  </p>
                  <div className="flex items-center gap-3 bg-black/40 p-3 border-l-4 border-primary-container backdrop-blur-sm">
                    <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    <div className="headline-font font-black italic uppercase text-[10px] md:text-xs flex items-center gap-2">
                       {race.results && race.results.length > 0 
                         ? `Winner: ${race.results[0].driverName}` 
                         : 'Results Available'}
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-primary-container w-full transform origin-left group-hover:h-3 transition-all duration-300"></div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Upcoming Races Grid */}
      {upcomingRaces.length > 0 && (
        <section>
          <h3 className="headline-font font-black italic uppercase text-2xl mb-8 tracking-tighter flex items-center gap-4">
            FUTURE VELOCITY <span className="h-[2px] flex-grow bg-surface-container-highest/30"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-outline-variant/20 border border-outline-variant/20">
            {upcomingRaces.slice(0, 7).map((race) => (
              <div key={race.round} className={`p-8 opacity-60 hover:opacity-100 transition-all duration-300 group relative overflow-hidden border-l-2 border-primary-container/0 hover:border-primary-container ${glass ? 'bg-black/10 backdrop-blur-sm' : 'bg-surface-container-low'}`}>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="headline-font font-black italic text-4xl text-on-surface opacity-10">
                      {String(race.round).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="font-headline text-2xl font-black mt-2 flex items-center gap-3">
                    {race.country.toUpperCase()} <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{race.flag}</span>
                  </h4>
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="text-xl headline-font font-black italic uppercase tracking-tight">
                      {race.name.replace('Grand Prix', 'GP')}
                    </h5>
                  </div>
                  <p className="text-xs text-on-surface-variant font-bold tracking-widest uppercase mb-4">
                    {race.circuit}
                  </p>
                  <p className="text-sm headline-font font-bold italic text-primary-fixed-dim">
                    {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
            
            {upcomingRaces.length > 7 && (
              <div className="bg-surface-container-lowest/50 p-8 flex items-center justify-center lg:col-span-3 border-t border-white/5 mt-4">
                 <div className="text-xs uppercase tracking-[0.5em] opacity-30 headline-font font-bold">
                   {upcomingRaces.length - 7} Additional Rounds in Repository
                 </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
