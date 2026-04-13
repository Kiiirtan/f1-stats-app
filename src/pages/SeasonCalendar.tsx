import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchSeasonCalendarDetailed, type DetailedCalendarRace } from '../data/api';
import DataState from '../components/ui/DataState';
import { CalendarSkeleton } from '../components/ui/SkeletonLoader';
import { useScrollReveal } from '../hooks/useScrollReveal';

// ─── Countdown hook ─────────────────────────────────────────────────────────────
function useCountdown(targetDate: string, targetTime: string) {
  const getTimeLeft = useCallback(() => {
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
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [getTimeLeft]);
  return timeLeft;
}

import { CIRCUIT_MAPS } from '../data/circuitMaps';

// ─── TrackImage component ────────────────────────────────────────────────────────
function TrackImage({ circuitId }: { circuitId: string }) {
  const imgUrl = CIRCUIT_MAPS[circuitId] || null;

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden border border-white/10"
      style={{ width: 150, height: 120, background: '#080808' }}
    >
      {imgUrl ? (
        <img
          src={imgUrl}
          alt="circuit"
          className="w-full h-full object-contain p-2"
          loading="lazy"
          style={{
            // Universal treatment so ANY circuit diagram (dark-on-light OR light-on-dark)
            // becomes crisp white outlines on a dark card:
            //   grayscale  → strip colour noise
            //   invert     → flip dark-on-white to white-on-dark
            //   brightness → boost the whites
            //   contrast   → sharpen edge definition
            //   mix-blend-mode:screen → pure black bg becomes transparent
            filter: 'grayscale(1) invert(1) brightness(2) contrast(1.8)',
            mixBlendMode: 'screen',
          }}
        />
      ) : (
        <span className="material-symbols-outlined text-white/15" style={{ fontSize: 40 }}>route</span>
      )}
    </div>
  );
}

// ─── Countdown display ───────────────────────────────────────────────────────────
function NextRaceCountdown({ date, time }: { date: string; time: string }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(date, time);
  if (expired) return <span className="headline-font font-black italic text-primary-container text-lg">LIGHTS OUT!</span>;
  return (
    <div className="flex items-center gap-2">
      {[{ v: days, l: 'D' }, { v: hours, l: 'H' }, { v: minutes, l: 'M' }, { v: seconds, l: 'S' }].map(({ v, l }) => (
        <div key={l} className="flex flex-col items-center bg-black/30 px-2 py-1 rounded min-w-[36px]">
          <span className="headline-font font-black italic text-xl text-on-surface tabular-nums leading-none">
            {String(v).padStart(2, '0')}
          </span>
          <span className="text-[8px] uppercase tracking-widest text-on-surface-variant headline-font font-bold">{l}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Race Card ───────────────────────────────────────────────────────────────────
function RaceCard({ race, isNext }: { race: DetailedCalendarRace; isNext: boolean }) {
  const { ref, isVisible } = useScrollReveal(0.15);
  const winner = race.podium.find((p) => p.position === 1);
  const winnerLastName = winner ? winner.driverName.split(' ').pop()?.toUpperCase() : null;
  const formattedDate = new Date(race.date).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric',
  });

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } h-full`}
    >
    <div
      className={`block group relative overflow-hidden rounded-2xl transition-all duration-300 h-full ${
        isNext
          ? 'border-2 border-primary-container shadow-[0_0_30px_rgba(225,6,0,0.25)] hover:shadow-[0_0_50px_rgba(225,6,0,0.4)]'
          : 'border border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]'
      }`}
      style={{
        background: isNext
          ? 'linear-gradient(135deg,rgba(225,6,0,0.12) 0%,rgba(30,10,10,0.88) 60%,rgba(16,16,16,0.92) 100%)'
          : 'rgba(14,14,14,0.9)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Full card background link for circuit */}
      <Link to={`/circuit/${race.circuitId}`} className="absolute inset-0 z-0" aria-label={`View ${race.name} circuit layout`} />
      {/* Sprint badge */}
      {race.isSprint && (
        <div className="absolute top-2.5 right-10 z-10 text-[9px] headline-font font-black italic uppercase px-2 py-0.5"
          style={{ background: 'rgba(120,80,0,0.85)', borderRadius: 4, color: '#ffd700', border: '1px solid rgba(255,215,0,0.35)' }}>
          SPRINT
        </div>
      )}

      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b ${isNext ? 'border-primary-container/30' : 'border-white/8'}`}
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <span
          className="headline-font font-black italic uppercase tracking-tight text-sm truncate pr-2"
          style={{ color: isNext ? '#e10600' : '#d8d8d8' }}
        >
          ROUND {String(race.round).padStart(2, '0')} · {race.name.toUpperCase()}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
          chevron_right
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-4 p-4">
        {/* Circuit diagram */}
        <TrackImage circuitId={race.circuitId} />

        {/* Race info */}
        <div className="flex-1 min-w-0">
          <span className="text-xl leading-none block mb-1">{race.flag}</span>

          <h3 className="headline-font font-black italic uppercase tracking-tighter text-2xl md:text-3xl leading-none text-on-surface mb-2 truncate">
            {race.location.toUpperCase()}
          </h3>

          <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-1">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>location_on</span>
            <span className="truncate">{race.location}, {race.country}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-3">
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>calendar_today</span>
            <span>{formattedDate}</span>
          </div>

          {race.completed && winner && winnerLastName ? (
            <div className="flex items-center gap-2 relative z-10">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs headline-font font-black italic uppercase tracking-tight text-white"
                style={{ background: 'linear-gradient(90deg,#b00,#e10600)', borderRadius: 6, boxShadow: '0 2px 10px rgba(225,6,0,0.45)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                WINNER: {winnerLastName}
              </div>
              
              <Link
                to={`/results?round=${race.round}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] headline-font font-bold uppercase tracking-widest text-[#29DEC9] bg-[#29DEC9]/10 hover:bg-[#29DEC9]/20 border border-[#29DEC9]/20 rounded-md transition-colors"
              >
                RESULTS
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>arrow_forward</span>
              </Link>
            </div>
          ) : isNext ? (
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-primary-container headline-font font-bold mb-1.5">NEXT RACE</div>
              <NextRaceCountdown date={race.date} time={race.time} />
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-[10px] headline-font font-bold uppercase tracking-wider text-on-surface-variant border border-white/10 rounded">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>schedule</span>
              SCHEDULED
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function SeasonCalendar() {
  useDocumentMeta('Race Calendar', 'Official Formula 1 season racing calendar, countdowns, and upcoming track layouts.');
  const [calendar, setCalendar] = useState<DetailedCalendarRace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchSeasonCalendarDetailed()
      .then((data) => { if (mounted) setCalendar(data); })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <CalendarSkeleton />;
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  const nextRace = calendar.find((r) => !r.completed);
  const completedCount = calendar.filter((r) => r.completed).length;

  return (
    <div className="pt-20 pb-20 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="headline-font font-black italic uppercase text-3xl md:text-5xl tracking-tighter text-on-surface">
          SEASON CALENDAR
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-on-surface-variant headline-font font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-[#4ade80]">
            <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            {completedCount} COMPLETED
          </span>
          <span className="opacity-20">|</span>
          <span>{calendar.length - completedCount} REMAINING</span>
          <span className="opacity-20">|</span>
          <span>{calendar.length} TOTAL ROUNDS</span>
        </div>
      </div>

      {/*
        Layout:
          mobile  → 1 column
          md      → 2 columns
          xl      → 3 columns
        Each card stretches to fill its cell with h-full on the link element.
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {calendar.map((race) => (
          <RaceCard
            key={race.round}
            race={race}
            isNext={race.round === nextRace?.round}
          />
        ))}
      </div>
    </div>
  );
}
