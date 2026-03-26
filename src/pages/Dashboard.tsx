import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRaceCalendar, fetchRaceResults, fetchDriverStandings, getNationalityFlag, type Race, type Driver } from '../data/api';
import { getDriverPortrait } from '../data/driverImages';

export default function Dashboard() {
  const [calendar, setCalendar] = useState<Race[]>([]);
  const [resultsRaces, setResultsRaces] = useState<Race[]>([]);
  const [standings, setStandings] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-1 bg-primary-container animate-pulse"></div>
      </div>
    );
  }

  const latestRace = resultsRaces[resultsRaces.length - 1];
  const nextRace = calendar.find((r) => !r.completed) || calendar[calendar.length - 1];
  const topDrivers = standings.slice(0, 6);

  // Get 4 races for timeline
  const nextIdx = calendar.findIndex(r => r.round === (nextRace ? nextRace.round : calendar.length));
  const timelineRaces = calendar.slice(Math.max(0, nextIdx - 1), nextIdx + 3);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[819px] w-full overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <img alt="Subtle F1 car racing background texture" className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn1aauTUZ1yPGqGcMN2eZBCguwPjTB3A3o2f1fOz191ehjJ9z4uQaCu-7TuqoOTvWRxTXHPMbv1uJhvEx219txvZ2JGL4BUwFIKr4HRLGWkCZbFPl1abPWzFNeKsGC8rUaFlAFaIKfh0E2sWb-yj9yoVYTXgjKQinNDFDOa1YOILbXZvWuef_lI_flW0fWNjPuOxlxQolUCbJbV0KST-lzSCsUXdHr3mkARFU-uQxTvU7IacPhwZZD4z78zXsIiU0XqC_p7li5TJM" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
          <img className="w-full h-full object-cover object-center opacity-60" alt="Moody F1 car side profile in dark lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3bo_d4vWwDs92VYSGwvL072zTNkuUkgq22x3JibKTdQm8L5-RM8M1DM92K8REfM_MBcDXPCHV-yIYyo-kwiUvK7AVf77tBsBImIEKq014lCTopGb-q9ArqVjeyFv_NZQ0C_uBif187fYAghFGlIz70IR-W02yEoYdkUgxh0anW0jYShOfFAvuJ9eMSwrV4cEk_c5NA6vTzKNYSKIxlko3fXLYAjVHyZDpyuGZ_nOe3IBvjvIhTKew4sidu9am78GD9h8nBIPwrv8" />
        </div>
        <div className="relative z-20 h-full flex flex-col justify-center px-12 lg:px-24">
          <div className="flex items-center space-x-4 mb-6">
            <span className="bg-primary-container text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">LATEST RACE</span>
            <span className="text-secondary text-xs font-label uppercase tracking-widest flex items-center gap-2">
              <span className="text-xl">{latestRace?.flag || '🏁'}</span>
              GRAND PRIX {latestRace?.country || 'F1'}
            </span>
          </div>
          <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-9xl leading-[0.85] italic uppercase tracking-tighter -ml-2 mb-8 max-w-4xl text-glow">
            KINETIC<br /><span className="text-primary-container">STATS.</span>
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-12">
            <Link to="/races" className="inline-block bg-primary-container text-white px-10 py-5 text-sm font-black tracking-[0.2em] hover:scale-105 transition-transform duration-300">
              EXPLORE THE SEASON
            </Link>
            {latestRace && latestRace.results.length > 0 && (
              <div className="border-l border-outline-variant pl-8 py-2">
                <p className="font-headline text-2xl font-bold">{latestRace.results[0].time}</p>
                <p className="text-[10px] uppercase tracking-widest text-secondary mt-1">WINNING TIME — {latestRace.results[0].driverName}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Driver Grid */}
      <section className="py-24 px-8 lg:px-16 bg-surface relative overflow-hidden">
        <div className="flex justify-between items-end mb-16 border-b border-outline-variant/20 pb-8">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase italic tracking-tighter">DRIVER STANDINGS</h2>
            <p className="text-secondary text-xs uppercase tracking-widest mt-2">WORLD CHAMPIONSHIP FIELD</p>
          </div>
          <Link to="/drivers" className="text-primary-container text-xs font-bold tracking-widest hover:underline underline-offset-8">VIEW ALL ATHLETES</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topDrivers.map((driver) => (
            <Link key={driver.id} to={`/driver/${driver.id}`} className="group relative bg-surface-container-low overflow-hidden cursor-pointer block">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest">
                {/* Standard Driver Portrait from driverImages */}
                <img
                  className="w-full h-full object-cover object-top grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  alt={`${driver.firstName} ${driver.lastName}`}
                  src={getDriverPortrait(driver.id)}
                  onError={(e) => {
                    // Fallback to silhouette if official image fails
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t via-background/20 to-transparent" style={{ '--tw-gradient-from': `${driver.teamColor}cc` } as React.CSSProperties}></div>
              <div className="absolute bottom-0 p-6 w-full">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-primary-container font-headline font-black text-4xl" style={{ color: driver.teamColor }}>{String(driver.standingPosition).padStart(2, '0')}</p>
                    <h3 className="font-headline font-bold text-lg leading-tight uppercase text-white">{driver.firstName} {getNationalityFlag(driver.nationality)}<br />{driver.lastName}</h3>
                  </div>
                  <span className="bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">{driver.team}</span>
                </div>
                <div className="h-1 w-full" style={{ backgroundColor: driver.teamColor }}></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Race Timeline */}
      <section className="relative py-12 bg-surface-container-lowest overflow-hidden border-y border-[#1b1b24]">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img alt="F1 technical background shot" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzJdal9yMFntax9Sfua1w5p3YTcYThM_KTkpklWwBM45qrWVZvw1BH6TP5W-B4jjDLAd_gi0RbjIJHY-2QiFCSZ7zQnMCdGUyRBWusNuTH0hhPBp4mUjCKG22KPtRaHPeay4D6qYhguPO_ztOPjGpOdqz27UWOYofFIWY1TIMai6tbZcDzQOKrl-MX4fTcvcY63Repa_-8Hv9W8F5VHyY0182bXhmtyta1TOomdOD8acXbt7AajlLObN74C7tnR5kIvG9Zzydm8lg" />
        </div>
        <div className="relative z-10 px-8 lg:px-16 mb-8 flex items-center space-x-4">
          <span className="w-12 h-[2px] bg-primary-container"></span>
          <h2 className="font-headline font-bold text-xs uppercase tracking-[0.3em]">SEASON CALENDAR</h2>
        </div>
        <div className="relative z-10 flex overflow-x-auto pb-8 px-8 lg:px-16 space-x-8 no-scrollbar">
          {timelineRaces.map((race) => (
            <Link key={race.id} to={`/races?round=${race.round}`} className={`flex-shrink-0 w-80 group block ${!race.completed && race.round > nextRace.round ? 'opacity-60' : ''}`}>
              <div className="bg-surface-container-low p-6 border-b-2 border-transparent group-hover:border-primary-container transition-all h-full">
                <p className="text-[10px] text-secondary font-black tracking-widest uppercase">ROUND {String(race.round).padStart(2, '0')}</p>
                <h4 className="font-headline text-2xl font-black mt-2 flex items-center gap-3">
                  <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{race.flag}</span>
                  {race.country.toUpperCase()}
                </h4>
                <p className="text-xs text-secondary mt-1 uppercase">{new Date(race.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                <div className="mt-8 flex justify-between items-center">
                  {race.completed ? (
                    <span className="bg-primary-container/10 text-primary-container text-[9px] px-2 py-1 font-bold">COMPLETED</span>
                  ) : race.round === nextRace.round ? (
                    <span className="bg-surface-container-highest text-[#c7c6ca] text-[9px] px-2 py-1 font-bold">UPCOMING</span>
                  ) : (
                    <span className="bg-surface-container-highest text-[#c7c6ca] text-[9px] px-2 py-1 font-bold">LOCKED</span>
                  )}
                  <span className="material-symbols-outlined text-secondary text-sm">
                    {race.completed ? 'arrow_forward' : race.round === nextRace.round ? 'event' : 'lock'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Results Table - Latest Race */}
      {latestRace && (
        <section className="py-24 px-8 lg:px-16 relative">
          <div className="absolute inset-0 z-0 opacity-[0.03] overflow-hidden pointer-events-none">
            <img alt="F1 Pit stop action background" className="w-full h-full object-cover object-bottom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB51ehXkJtWRhpEfnhCftwwzon7OqV6-5hySm8VFyI6MjTlbdOtJyiV2En8WQju6uPhzIfqdBUgW5oK_AHGG3fKWalG3IE_GYi0qMWYhnwg7S6MJFgQC7heC31b9kjEGfN4mLbZqjQVJkBPHa1lvlixKqoT-X3Th2TFN6Pl8AhFgg2cOJj-df6RQZ9nbeDrVBmLgOF8Aj1I8NsHt0_W2xvqIxhHEoW46M1XWEh5Ee8vEIhRnofmINnyfIvYgx5C5WETjp8bh2qbdU4" />
          </div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
              <h2 className="font-headline text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                RACE RESULTS : {latestRace.name.replace('Grand Prix', 'GP')}
                <span className="text-xl">{latestRace.flag}</span>
              </h2>
              <Link to={`/results?round=${latestRace.round}`} className="text-primary-container text-xs font-bold tracking-widest hover:underline underline-offset-8">VIEW FULL GRID</Link>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-[10px] font-label uppercase tracking-widest text-secondary">
                    <th className="py-4 px-4 font-black">POS</th>
                    <th className="py-4 px-4 font-black">DRIVER</th>
                    <th className="py-4 px-4 font-black">CONSTRUCTOR</th>
                    <th className="py-4 px-4 font-black">LAPS</th>
                    <th className="py-4 px-4 font-black">TIME</th>
                    <th className="py-4 px-4 text-right font-black">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {latestRace.results.slice(0, 4).map((result) => (
                    <tr key={result.driverId} className="group hover:bg-surface-container transition-colors">
                      <td className={`py-6 px-4 font-headline font-black ${result.position === 1 ? 'text-primary-container' : 'text-on-surface'}`}>
                        {String(result.position).padStart(2, '0')}
                      </td>
                      <td className="py-6 px-4">
                        <span className="font-headline font-bold uppercase">{result.driverName}</span>
                      </td>
                      <td className="py-6 px-4 text-xs uppercase tracking-widest opacity-60">{result.team}</td>
                      <td className="py-6 px-4 font-mono text-xs text-secondary">{result.laps}</td>
                      <td className="py-6 px-4 font-mono text-xs text-secondary">{result.time}</td>
                      <td className="py-6 px-4 text-right font-headline font-bold">{result.points > 0 ? result.points : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-12 flex justify-center">
              <Link to={`/results?round=${latestRace.round}`} className="text-[10px] font-bold tracking-[0.3em] uppercase border border-outline-variant/30 px-8 py-4 hover:border-primary-container hover:text-primary-container transition-all text-on-surface">
                LOAD FULL CLASSIFICATION
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
