import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRaceCalendar, fetchRaceResults, fetchDriverStandings, getNationalityFlag, type Race, type Driver } from '../data/api';
import { getDriverPortrait } from '../data/driverImages';
import { getConstructorSpecs } from '../data/constructorDetails';
import DataState from '../components/ui/DataState';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Dashboard() {
  useDocumentMeta('Live Dashboard', 'Real-time Formula 1 standings, race results, driver profiles, and constructor analytics.');
  const [calendar, setCalendar] = useState<Race[]>([]);
  const [resultsRaces, setResultsRaces] = useState<Race[]>([]);
  const [standings, setStandings] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchRaceCalendar(),
      fetchRaceResults(),
      fetchDriverStandings(),
    ]).then(([calData, resData, stdData]) => {
      if (mounted) {
        setCalendar(calData);
        setResultsRaces(resData.filter(r => r.results && r.results.length > 0));
        setStandings(stdData);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  const latestRace = resultsRaces[resultsRaces.length - 1];
  const nextRace = calendar.find((r) => !r.completed) || calendar[calendar.length - 1];

  // Specific driver fallback (matching screenshot roughly if possible, else top 3)
  const topDrivers = standings.slice(0, 3);

  // Get 3 races for calendar cards
  const nextIdx = calendar.findIndex(r => r.round === (nextRace ? nextRace.round : calendar.length));
  // Pick previous, current, next (3 total)
  const timelineRaces = calendar.slice(Math.max(0, nextIdx - 1), Math.max(0, nextIdx - 1) + 3);

  return (
    /* We lock the entire Dashboard to the physical height of the screen and hide global overflow to prevent page scroll. */
    <div className="flex flex-col relative w-full h-screen font-sans text-[#E4E1EE] overflow-hidden">



      {/* LAYER 2: The Independent Scrollable Transparent Foreground */}
      {/* We make this container `overflow-y-auto` so the mouse scroll only moves these boxes, not the page window. */}
      <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar pb-24">
        <div className="max-w-5xl mx-auto space-y-10 px-4 md:px-8 py-8 md:py-12">

          {/* HERO SECTION */}
          <section className="relative w-full overflow-hidden rounded-[2rem] border border-red-500/50 bg-transparent shadow-[0_0_40px_rgba(225,6,0,0.15)] backdrop-blur-[2px]" style={{ minHeight: '440px' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-red-600/5 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-[400px] h-64 bg-red-600/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-[#E10600] text-sm md:text-base font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-red-500/20">LATEST RACE</span>
                  <span className="text-white text-sm md:text-base font-bold flex items-center gap-2 drop-shadow-lg">
                    <span>{latestRace?.flag || '🏁'}</span> GRAND PRIX {latestRace?.country?.toUpperCase() || 'JAPAN'}
                  </span>
                </div>
                <h1 className="font-headline font-black text-[3.5rem] md:text-7xl lg:text-[5.5rem] leading-[0.9] italic uppercase tracking-tighter max-w-2xl text-white drop-shadow-2xl">
                  EVERY LAP.<br />EVERY BATTLE.<br />DECODED.
                </h1>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-16 gap-6 w-full">
                <Link to="/calendar" className="inline-block bg-gradient-to-b from-[#E10600]/80 to-[#aa0000]/80 backdrop-blur-md text-white px-8 py-4 rounded-xl text-xs font-bold tracking-widest border border-red-400/50 hover:shadow-[0_0_20px_rgba(225,6,0,0.4)] transition-all">
                  EXPLORE THE SEASON
                </Link>
                {latestRace && latestRace.results.length > 0 && (
                  <div className="text-right bg-black/20 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <p className="font-headline text-3xl md:text-4xl font-black text-white tracking-widest leading-none drop-shadow-md">{latestRace.results[0].time}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[#c7c6ca] mt-2 font-bold">WINNING TIME – {latestRace.results[0].driverName.toUpperCase()}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* DRIVER STANDINGS */}
          <section className="w-full bg-transparent border border-white/20 rounded-[2rem] p-6 lg:p-8 backdrop-blur-[2px] shadow-lg">
            <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <h2 className="font-headline text-xl lg:text-2xl font-bold uppercase tracking-wide text-white flex-1 drop-shadow-sm ml-2">DRIVER STANDINGS</h2>
              <Link to="/drivers" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors border border-white/20">
                <span className="material-symbols-outlined text-[1rem]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topDrivers.map((driver, idx) => {
                return (
                  <Link key={driver.id} to={`/driver/${driver.id}`} className="group hover-glow-flare relative overflow-hidden rounded-3xl bg-transparent border border-white/20 block h-[380px] backdrop-blur-sm">

                    {/* Mega Top-Left Number */}
                    <div className="absolute top-5 left-6 z-20">
                      <span className="font-headline font-black text-4xl lg:text-5xl text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">{String(idx + 1).padStart(2, '0')}</span>
                    </div>

                    {/* Portrait */}
                    <div className="absolute inset-x-0 bottom-[4rem] top-0 flex justify-center items-end px-2 z-10 pointer-events-none">
                      <img
                        className="w-[90%] object-cover object-bottom drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105"
                        alt={`${driver.firstName} ${driver.lastName}`}
                        src={getDriverPortrait(driver.id)}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'; }}
                      />
                    </div>

                    {/* Driver Name split like photo */}
                    <div className="absolute bottom-[4.5rem] left-0 w-full px-6 z-20 pointer-events-none">
                      <p className="text-sm lg:text-[1rem] uppercase tracking-widest font-medium leading-none text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{driver.firstName}</p>
                      <h3 className="font-headline font-black text-2xl lg:text-3xl uppercase text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-[1.1]">{driver.lastName}</h3>
                    </div>

                    {/* Bottom Stats Row entirely transparent with border */}
                    <div className="absolute bottom-0 left-0 w-full h-[4rem] border-t border-white/30 bg-black/20 backdrop-blur-md z-20 flex justify-between items-center px-6">
                      <div className="flex items-center gap-3">
                        {getConstructorSpecs(driver.teamId).logo && (
                          <div className="bg-white/95 p-0.5 rounded-sm flex items-center justify-center shadow-sm">
                            <img src={getConstructorSpecs(driver.teamId).logo} alt={driver.team} className="w-4 h-4 object-contain" />
                          </div>
                        )}
                        <span className="font-headline text-xs text-white/90 uppercase tracking-[0.2em]">{driver.team}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest mt-0.5">POINTS</span>
                        <span className="font-headline font-bold text-xl text-white">{driver.seasonPoints}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* SEASON CALENDAR */}
          <section className="w-full bg-transparent border border-white/20 rounded-[2rem] p-6 lg:p-8 backdrop-blur-[2px] shadow-lg">
            <div className="flex justify-between items-center mb-8 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <h2 className="font-headline text-xl lg:text-2xl font-bold uppercase tracking-wide text-white flex-1 drop-shadow-sm ml-2">SEASON CALENDAR</h2>
              <Link to="/calendar" className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white transition-colors border border-white/20">
                <span className="material-symbols-outlined text-[1rem]">chevron_right</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {timelineRaces.map((race) => {
                let statusText = 'LOCKED';
                let statusColorClass = 'text-[#c7c6ca]';
                if (race.completed) {
                  statusText = 'COMPLETED';
                  statusColorClass = 'text-[#00F0E0]'; // brightened for contrast
                } else if (nextRace && race.round === nextRace.round) {
                  statusText = 'UPCOMING';
                  statusColorClass = 'text-white';
                }
                return (
                  <Link key={race.id} to={`/races?round=${race.round}`} className="group relative bg-black/10 backdrop-blur-sm rounded-[1.5rem] p-6 lg:p-8 border border-white/20 hover:border-white/50 transition-all duration-300 block flex flex-col justify-between h-[200px] shadow-lg">
                    <div>
                      <p className="text-[10px] text-white/80 font-medium tracking-[0.15em] uppercase mb-1 drop-shadow-md">ROUND {String(race.round).padStart(2, '0')}</p>
                      <h4 className="font-headline text-2xl lg:text-3xl font-black text-white uppercase tracking-widest mb-1 drop-shadow-lg leading-tight">
                        {race.country}
                      </h4>
                      <p className={`text-[10px] font-bold uppercase tracking-[0.1em] drop-shadow-md ${statusColorClass}`}>
                        ({statusText})
                      </p>
                    </div>
                    <p className="text-[11px] text-white uppercase font-bold tracking-[0.1em] drop-shadow-md">
                      {new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(',', '.')}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* RACE RESULTS */}
          {latestRace && (
            <section className="w-full bg-transparent border border-white/20 rounded-[2rem] p-6 lg:p-8 backdrop-blur-[2px] shadow-lg">
              <div className="flex items-center gap-3 mb-8 bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <h2 className="font-headline text-xl lg:text-2xl font-bold uppercase tracking-wide text-white m-0 drop-shadow-sm ml-2">
                  RACE RESULTS : {latestRace.name.replace('Grand Prix', 'GP').toUpperCase()}
                </h2>
                <span className="text-xl drop-shadow-md">{latestRace.flag}</span>
              </div>

              <div className="flex flex-col space-y-3">
                {latestRace.results.slice(0, 4).map((result, idx) => (
                  <div key={result.driverId} className={`flex items-center justify-between p-4 px-6 rounded-xl bg-black/10 backdrop-blur-sm border ${idx === 0 || idx === 1 ? 'border-red-500/60 shadow-[0_0_20px_rgba(225,6,0,0.15)]' : 'border-white/20'} hover:border-white/50 transition-all`}>

                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-headline font-black text-lg w-6 text-center text-white drop-shadow-md">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`w-0.5 h-4 shadow-sm ${idx <= 0 ? 'bg-[#00F0E0]' : idx === 1 ? 'bg-[#ff8000]' : idx === 2 ? 'bg-[#E10600]' : 'bg-[#00F0E0]'}`}></span>
                      <span className="font-bold text-xs uppercase text-white tracking-[0.15em] w-[150px] truncate drop-shadow-md">{result.driverName}</span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/80 font-bold hidden sm:block w-[120px] truncate drop-shadow-md">{result.team}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/80 font-bold hidden md:block w-[80px] drop-shadow-md">
                        {idx === 0 ? result.laps + ' LAPS' : ' '}
                      </span>
                      <span className="text-[11px] font-mono text-white w-[80px] text-right font-bold drop-shadow-md">{result.time}</span>
                      <span className="font-bold text-[10px] text-white/90 w-[50px] tracking-[0.1em] text-right drop-shadow-md">{result.points > 0 ? `${result.points} PTS` : ''}</span>
                    </div>

                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to={`/results?round=${latestRace.round}`} className="block w-full text-center bg-gradient-to-b from-[#E10600]/60 to-[#990000]/60 backdrop-blur-md border border-red-500/50 hover:shadow-[0_0_30px_rgba(225,6,0,0.4)] text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-xl py-4 transition-all duration-300">
                  LOAD FULL CLASSIFICATION
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
