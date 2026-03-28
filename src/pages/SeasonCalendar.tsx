import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchSeasonCalendarDetailed, type DetailedCalendarRace } from '../data/api';
import DataState from '../components/ui/DataState';

function useCountdown(targetDate: string, targetTime: string) {
  const getTimeLeft = useCallback(() => {
    // API returns time as "06:00:00Z" — strip trailing Z to avoid double-Z
    const cleanTime = targetTime ? targetTime.replace(/Z$/i, '') : '14:00:00';
    const target = new Date(`${targetDate}T${cleanTime}Z`);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (isNaN(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  }, [targetDate, targetTime]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [getTimeLeft]);

  return timeLeft;
}

function CountdownTimer({ date, time }: { date: string; time: string }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(date, time);

  if (expired) return <span className="text-primary-fixed-dim headline-font font-bold italic text-lg">LIGHTS OUT!</span>;

  const units = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HRS' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' },
  ];

  return (
    <div className="flex gap-3 md:gap-5">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center">
          <span className="headline-font font-black italic text-4xl md:text-6xl text-on-surface tabular-nums leading-none">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-on-surface-variant mt-1 headline-font font-bold">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function SeasonCalendar() {
  const [calendar, setCalendar] = useState<DetailedCalendarRace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchSeasonCalendarDetailed().then((data) => {
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

  const completedRaces = calendar.filter((r) => r.completed);
  const nextRace = calendar.find((r) => !r.completed);
  const upcomingRaces = calendar.filter((r) => !r.completed && r.round !== nextRace?.round);

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 pb-20 flex flex-col justify-center items-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 border-2 border-primary-container/20 border-t-primary-container animate-spin" style={{ borderRadius: '50%' }}></div>
        <p className="headline-font font-bold italic uppercase tracking-[0.3em] text-sm text-on-surface-variant animate-pulse">LOADING TELEMETRY</p>
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

  const currentYear = calendar.length > 0 ? new Date(calendar[0].date).getFullYear() : new Date().getFullYear();

  return (
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-2 h-8 bg-primary-container"></div>
          <span className="headline-font text-sm font-bold italic uppercase tracking-[0.3em] text-primary-fixed-dim">FIA FORMULA ONE WORLD CHAMPIONSHIP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black italic uppercase headline-font tracking-tighter leading-none mb-4 text-on-surface">
          {currentYear} SEASON
        </h1>
        <div className="flex items-center gap-4 headline-font font-bold italic uppercase tracking-widest text-sm flex-wrap mt-4">
          <span className="bg-[#16a34a]/20 text-[#4ade80] px-3 py-1.5 border border-[#4ade80]/20">
            <span className="material-symbols-outlined text-sm mr-1 align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {completedRaces.length} COMPLETED
          </span>
          <span className="bg-primary-container/20 text-primary-fixed-dim px-3 py-1.5 border border-primary-container/20">
            <span className="material-symbols-outlined text-sm mr-1 align-middle">schedule</span>
            {calendar.length - completedRaces.length} REMAINING
          </span>
          <span className="bg-surface-container text-on-surface px-3 py-1.5 border border-white/10">
            {calendar.length} TOTAL ROUNDS
          </span>
        </div>
      </header>

      {/* Next Race Highlight */}
      {nextRace && (
        <section className="mb-20">
          <h2 className="headline-font font-black italic uppercase text-2xl mb-6 tracking-tighter flex items-center gap-4">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>flag</span>
            NEXT RACE
            <span className="h-[2px] flex-grow bg-surface-container-highest/30"></span>
          </h2>
          <div className="relative group bg-surface-container border-l-8 border-primary-container overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(225,6,0,0.15)]">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 via-transparent to-tertiary-container/5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-l from-primary-container to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
                {/* Left: Race Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="bg-primary-container text-on-primary-container headline-font font-black italic uppercase px-3 py-1 text-sm tracking-tighter">
                      ROUND {String(nextRace.round).padStart(2, '0')}
                    </span>
                    {nextRace.isSprint && (
                      <span className="bg-tertiary-container text-on-tertiary-container headline-font font-black italic uppercase px-3 py-1 text-sm tracking-tighter">
                        SPRINT WEEKEND
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl sm:text-4xl md:text-6xl xl:text-7xl headline-font font-black italic uppercase tracking-tighter leading-none mb-3">
                    {nextRace.name.replace('Grand Prix', 'GP')}
                  </h3>

                  <p className="text-lg md:text-xl text-on-surface-variant headline-font font-bold uppercase tracking-wider flex items-center gap-2 mt-2">
                    <span className="text-2xl">{nextRace.flag}</span>
                    {nextRace.circuit}
                  </p>

                  <div className="flex flex-wrap gap-6 mt-8 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-fixed-dim text-base">location_on</span>
                      <span>{nextRace.location}, {nextRace.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-fixed-dim text-base">calendar_today</span>
                      <span>{new Date(nextRace.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {nextRace.time && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary-fixed-dim text-base">schedule</span>
                        <span>Race: {nextRace.time.replace(':00.000Z', '').replace('Z', '')} UTC</span>
                      </div>
                    )}
                  </div>

                  {/* Session Schedule */}
                  {(nextRace.firstPractice || nextRace.qualifying || nextRace.sprint) && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {nextRace.firstPractice && (
                        <div className="bg-black/20 border border-white/5 px-4 py-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Practice 1</div>
                          <div className="headline-font font-bold text-sm">{new Date(nextRace.firstPractice.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        </div>
                      )}
                      {nextRace.qualifying && (
                        <div className="bg-black/20 border border-white/5 px-4 py-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Qualifying</div>
                          <div className="headline-font font-bold text-sm">{new Date(nextRace.qualifying.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        </div>
                      )}
                      {nextRace.sprint && (
                        <div className="bg-tertiary-container/20 border border-tertiary-container/30 px-4 py-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-tertiary mb-1">Sprint</div>
                          <div className="headline-font font-bold text-sm">{new Date(nextRace.sprint.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Countdown */}
                <div className="flex flex-col items-center lg:items-end justify-center gap-6">
                  <div className="text-xs uppercase tracking-[0.3em] opacity-60 headline-font font-bold">COUNTDOWN TO LIGHTS OUT</div>
                  <CountdownTimer date={nextRace.date} time={nextRace.time} />
                  <Link
                    to={`/circuit/${nextRace.circuitId}`}
                    className="mt-4 bg-primary-container text-on-primary-container headline-font font-black italic uppercase px-10 py-4 text-lg tracking-tighter hover:bg-primary-fixed-dim hover:text-[#13131b] transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl text-center flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                    CIRCUIT INFO
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Completed Races */}
      {completedRaces.length > 0 && (
        <section className="mb-20">
          <h2 className="headline-font font-black italic uppercase text-2xl mb-8 tracking-tighter flex items-center gap-4">
            <span className="material-symbols-outlined text-[#4ade80]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            RACE RESULTS
            <span className="h-[2px] flex-grow bg-surface-container-highest/30"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {completedRaces.map((race, idx) => (
              <div
                key={race.round}
                className="group relative bg-surface-container-low border border-white/5 overflow-hidden transition-all duration-500 hover:bg-surface-container hover:shadow-[0_0_30px_rgba(225,6,0,0.08)]"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Accent top bar */}
                <div className="h-1 bg-gradient-to-r from-primary-container via-primary-fixed-dim to-transparent group-hover:h-1.5 transition-all duration-300"></div>

                <div className="p-6">
                  {/* Round & Status */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="headline-font font-black italic text-3xl text-primary-container/20">
                      R{String(race.round).padStart(2, '0')}
                    </span>
                    <span className="bg-[#4ade80]/10 text-[#4ade80] px-2 py-1 text-[10px] headline-font font-bold tracking-[0.15em] border border-[#4ade80]/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      FINISHED
                    </span>
                  </div>

                  {/* Race Name & Circuit */}
                  <h4 className="text-xl headline-font font-black italic uppercase tracking-tighter leading-tight mb-1 flex items-center gap-2">
                    <span>{race.flag}</span>
                    {race.name.replace('Grand Prix', 'GP')}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">{race.circuit}</p>
                  <p className="text-xs text-on-surface-variant/60 mb-5">
                    {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>

                  {/* Podium */}
                  {race.podium.length > 0 && (
                    <div className="space-y-2">
                      {race.podium.map((p) => (
                        <div key={p.position} className="flex items-center gap-3 bg-black/20 px-3 py-2 border-l-3 group-hover:bg-black/30 transition-colors" style={{ borderLeftColor: PODIUM_COLORS[p.position - 1] || '#666', borderLeftWidth: '3px' }}>
                          <span className="headline-font font-black italic text-lg w-6 text-center" style={{ color: PODIUM_COLORS[p.position - 1] }}>
                            P{p.position}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="headline-font font-bold text-sm truncate block">{p.driverName}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{p.team}</span>
                          </div>
                          {p.position === 1 && p.time && (
                            <span className="text-[10px] text-on-surface-variant tabular-nums font-mono hidden md:block">{p.time}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Link to results */}
                  <Link
                    to={`/results?round=${race.round}`}
                    className="mt-4 flex items-center gap-2 text-xs text-primary-fixed-dim headline-font font-bold uppercase tracking-wider hover:text-primary transition-colors group/link"
                  >
                    FULL RESULTS
                    <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Races */}
      {upcomingRaces.length > 0 && (
        <section>
          <h2 className="headline-font font-black italic uppercase text-2xl mb-8 tracking-tighter flex items-center gap-4">
            <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            UPCOMING
            <span className="h-[2px] flex-grow bg-surface-container-highest/30"></span>
            <span className="text-sm text-on-surface-variant font-normal tracking-normal normal-case">{upcomingRaces.length} rounds</span>
          </h2>

          <div className="space-y-3">
            {upcomingRaces.map((race, idx) => (
              <div
                key={race.round}
                className="group flex items-center gap-6 bg-surface-container-low border border-white/5 p-5 md:p-6 hover:bg-surface-container hover:border-primary-container/20 transition-all duration-300 cursor-default"
                style={{ opacity: Math.max(0.4, 1 - idx * 0.04) }}
              >
                {/* Round Number */}
                <div className="headline-font font-black italic text-3xl md:text-4xl text-on-surface/10 group-hover:text-primary-container/30 transition-colors w-16 text-center flex-shrink-0">
                  {String(race.round).padStart(2, '0')}
                </div>

                {/* Date Column */}
                <div className="flex-shrink-0 w-20 md:w-28 text-center">
                  <div className="headline-font font-black text-2xl md:text-3xl text-on-surface">
                    {new Date(race.date).getDate()}
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface-variant headline-font font-bold">
                    {new Date(race.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>

                {/* Race Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="headline-font font-black italic uppercase tracking-tighter text-lg md:text-xl flex items-center gap-2 truncate">
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{race.flag}</span>
                    {race.name.replace('Grand Prix', 'GP')}
                  </h4>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider truncate mt-1">{race.circuit}</p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {race.isSprint && (
                    <span className="bg-tertiary-container/20 text-tertiary border border-tertiary/20 px-2 py-1 text-[9px] headline-font font-bold uppercase tracking-[0.15em] hidden md:block">SPRINT</span>
                  )}
                  <Link
                    to={`/circuit/${race.circuitId}`}
                    className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors"
                    title="View Circuit"
                  >
                    <span className="material-symbols-outlined text-xl">map</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
