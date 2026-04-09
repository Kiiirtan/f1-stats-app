import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCircuitRaceHistory, getCountryFlag, type CircuitDetail } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { CIRCUIT_MAPS } from '../data/circuitMaps';

const PODIUM_MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

// Extracts the Wikipedia page title from a URL like https://en.wikipedia.org/wiki/Silverstone_Circuit
function getWikiTitle(url: string): string {
  try {
    const parts = url.split('/wiki/');
    return parts[1] || '';
  } catch { return ''; }
}

interface CircuitPhysicalStats {
  length: string | null;
  turns: string | null;
  lapRecord: string | null;
  lapRecordHolder: string | null;
  lapRecordYear: string | null;
}

export default function CircuitProfile() {
  const { id } = useParams<{ id: string }>();
  useDocumentMeta('Circuit Profile', 'Explore F1 circuit layout, history, and physical statistics.');
  const [data, setData] = useState<CircuitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [trackImageUrl, setTrackImageUrl] = useState<string | null>(null);
  const [circuitStats, setCircuitStats] = useState<CircuitPhysicalStats | null>(null);
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  // Filter state — decade-based filter
  const [selectedDecade, setSelectedDecade] = useState<string>('RECENT');

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(false);

    fetchCircuitRaceHistory(id)
      .then((result) => {
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [id]);

  // Fetch robust track map from Official F1 CDN
  useEffect(() => {
    if (!data?.circuit.circuitId) return;
    const url = CIRCUIT_MAPS[data.circuit.circuitId];
    if (url) {
      setTrackImageUrl(url);
    } else {
      setTrackImageUrl(null);
    }
  }, [data?.circuit.circuitId]);

  // Fetch circuit physical stats (length, turns, lap record) from Wikipedia infobox HTML
  useEffect(() => {
    if (!data?.circuit.wikiUrl) return;
    const title = getWikiTitle(data.circuit.wikiUrl);
    if (!title) return;

    let mounted = true;

    async function loadCircuitStats() {
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${title}`);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Helper: find a value in the infobox table by its label (th text)
        function getInfoboxValue(label: string): string | null {
          const ths = Array.from(doc.querySelectorAll('table.infobox th, table th'));
          for (const th of ths) {
            const text = th.textContent?.trim().toLowerCase() || '';
            if (text.includes(label.toLowerCase())) {
              const td = th.nextElementSibling;
              if (td) {
                // Remove reference tags like [1], [2] etc.
                const clone = td.cloneNode(true) as HTMLElement;
                clone.querySelectorAll('sup').forEach(s => s.remove());
                return clone.textContent?.replace(/\s+/g, ' ').trim() || null;
              }
            }
          }
          return null;
        }

        const rawLength = getInfoboxValue('circuit length') || getInfoboxValue('length');
        const rawTurns = getInfoboxValue('turns') || getInfoboxValue('corners');
        const rawRecord = getInfoboxValue('race lap record');

        // Extract lap record time, holder name, year
        let lapRecord: string | null = null;
        let lapRecordHolder: string | null = null;
        let lapRecordYear: string | null = null;

        if (rawRecord) {
          // Time format: 1:27.097
          const timeMatch = rawRecord.match(/(\d+:\d{2}\.\d+)/);
          if (timeMatch) lapRecord = timeMatch[1];

          // Year: 4-digit year
          const yearMatch = rawRecord.match(/\b(20\d{2}|19\d{2})\b/);
          if (yearMatch) lapRecordYear = yearMatch[1];

          // Holder: name is usually between time and year
          // Remove time, year, team name clutter, just grab first recognizable name chunk
          const cleaned = rawRecord
            .replace(/\d+:\d{2}\.\d+/g, '')
            .replace(/\b(20|19)\d{2}\b/g, '')
            .replace(/F1|Formula One|DHL/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          // Take first 30 characters as a rough name
          if (cleaned.length > 2) {
            lapRecordHolder = cleaned.split('(')[0].trim().slice(0, 40);
          }
        }

        // Clean length: extract km value
        let length = rawLength;
        if (length) {
          // Prefer km value like "5.891 km"
          const kmMatch = length.match(/([\d.]+)\s*km/i);
          if (kmMatch) length = `${kmMatch[1]} km`;
          else {
            const miMatch = length.match(/([\d.]+)\s*mi/i);
            if (miMatch) length = `${(parseFloat(miMatch[1]) * 1.60934).toFixed(3)} km`;
          }
        }

        // Clean turns: just take the first integer
        let turns = rawTurns;
        if (turns) {
          const numMatch = turns.match(/(\d+)/);
          if (numMatch) turns = numMatch[1];
        }

        if (mounted) {
          setCircuitStats({
            length: length || null,
            turns: turns || null,
            lapRecord: lapRecord || null,
            lapRecordHolder: lapRecordHolder || null,
            lapRecordYear: lapRecordYear || null,
          });
        }
      } catch (err) {
        console.warn('Failed to load circuit physical stats:', err);
      }
    }

    loadCircuitStats();
    return () => { mounted = false; };
  }, [data?.circuit.wikiUrl]);

  // Compute available decades for the filter
  const decades = useMemo(() => {
    if (!data) return [];
    const decadeSet = new Set<number>();
    for (const race of data.raceHistory) {
      decadeSet.add(Math.floor(race.season / 10) * 10);
    }
    return Array.from(decadeSet).sort((a, b) => b - a);
  }, [data]);

  // Filter race history based on selected decade
  const filteredHistory = useMemo(() => {
    if (!data) return [];
    if (selectedDecade === 'RECENT') {
      return data.raceHistory.slice(0, 10);
    }
    const decade = parseInt(selectedDecade, 10);
    return data.raceHistory.filter(r => r.season >= decade && r.season < decade + 10);
  }, [data, selectedDecade]);

  if (loading) {
    return (
      <div className="pt-20 pb-20 flex flex-col justify-center items-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 border-2 border-primary-container/20 border-t-primary-container animate-spin" style={{ borderRadius: '50%' }}></div>
        <p className="headline-font font-bold italic uppercase tracking-[0.3em] text-sm text-on-surface-variant animate-pulse">
          LOADING CIRCUIT HISTORY
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="not-found" actionLink="/circuits" actionText="VIEW ALL CIRCUITS" />
      </div>
    );
  }

  const { circuit, totalRaces, firstRaceYear, lastRaceYear, raceHistory } = data;

  // Find most successful driver at this circuit
  const driverWins: Record<string, { name: string; wins: number }> = {};
  for (const race of raceHistory) {
    const winner = race.podium.find((p) => p.position === 1);
    if (winner) {
      if (!driverWins[winner.driverId]) {
        driverWins[winner.driverId] = { name: winner.driverName, wins: 0 };
      }
      driverWins[winner.driverId].wins++;
    }
  }
  const topDrivers = Object.values(driverWins).sort((a, b) => b.wins - a.wins).slice(0, 5);

  return (
    <div className="pt-20 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link to="/circuits" className="hover:text-primary-fixed-dim transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          All Circuits
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-on-surface">{circuit.circuitName}</span>
      </div>

      {/* Header */}
      <header className={`mb-12 ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2.5rem] shadow-lg p-8 md:p-12' : ''}`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{getCountryFlag(circuit.country)}</span>
          <div className="w-2 h-8 bg-tertiary-container"></div>
          <span className="headline-font text-sm font-bold italic uppercase tracking-[0.3em] text-tertiary">{circuit.locality}, {circuit.country}</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black italic uppercase headline-font tracking-tighter leading-none mb-4 text-on-surface">
          {circuit.circuitName}
        </h1>
      </header>

      {/* Track Layout + Map + Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-16">
        {/* Track Layout Image + Location Map */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Track Layout Image from Wikipedia */}
          {trackImageUrl && (
            <div className={`overflow-hidden ${glass ? 'bg-black/10 backdrop-blur-md border border-white/20 rounded-[2rem]' : 'bg-surface-container border border-white/5'}`}>
              <div className={`p-4 flex items-center justify-between border-b ${glass ? 'border-white/10' : 'border-white/5'}`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-lg">route</span>
                  <span className="headline-font font-black italic uppercase tracking-tighter text-sm">TRACK LAYOUT</span>
                </div>
                <a
                  href={circuit.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-on-surface-variant hover:text-tertiary transition-colors uppercase tracking-widest headline-font font-bold flex items-center gap-1"
                >
                  Source: Wikipedia
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
              <div className="relative bg-black/10 flex items-center justify-center p-4 min-h-[200px]">
                <img
                  src={trackImageUrl}
                  alt={`${circuit.circuitName} Track Layout`}
                  className="max-h-[340px] w-auto object-contain drop-shadow-lg p-4"
                  loading="lazy"
                  onError={() => setTrackImageUrl(null)}
                  style={{
                    filter: 'grayscale(1) invert(1) brightness(2) contrast(1.8)',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className={`overflow-hidden ${glass ? 'bg-black/10 backdrop-blur-md border border-white/20 rounded-[2rem]' : 'bg-surface-container border border-white/5'}`}>
            <div className={`p-4 flex items-center gap-2 border-b ${glass ? 'border-white/10' : 'border-white/5'}`}>
              <span className="material-symbols-outlined text-primary-fixed-dim text-lg">location_on</span>
              <span className="headline-font font-black italic uppercase tracking-tighter text-sm">LOCATION</span>
            </div>
            <div className="relative h-[280px] md:h-[350px]">
              <iframe
                title={`${circuit.circuitName} Map`}
                className="w-full h-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(circuit.long) - 0.015}%2C${parseFloat(circuit.lat) - 0.01}%2C${parseFloat(circuit.long) + 0.015}%2C${parseFloat(circuit.lat) + 0.01}&layer=mapnik&marker=${circuit.lat}%2C${circuit.long}`}
                style={{ border: 0 }}
              ></iframe>
            </div>
            <div className="p-4 flex items-center justify-between bg-black/20">
              <span className="text-sm text-on-surface-variant">
                {circuit.lat}°, {circuit.long}°
              </span>
              <a
                href={`https://www.google.com/maps?q=${circuit.lat},${circuit.long}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-primary-fixed-dim hover:text-primary transition-colors headline-font font-bold uppercase tracking-wider"
              >
                Open in Google Maps
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-4">
          {/* Key Stats */}
          <div className={`p-6 ${glass ? 'bg-black/15 backdrop-blur-md border border-white/20 rounded-[2rem]' : 'bg-surface-container border border-white/5'}`}>
            <h3 className="headline-font font-black italic uppercase tracking-tighter text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
              CIRCUIT STATS
            </h3>
            <div className="space-y-4">
              {/* Physical specs from Wikipedia */}
              {circuitStats?.length && (
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary">straighten</span>
                    Length
                  </span>
                  <span className="headline-font font-black italic text-lg text-tertiary">{circuitStats.length}</span>
                </div>
              )}
              {circuitStats?.turns && (
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary">360</span>
                    Turns
                  </span>
                  <span className="headline-font font-black italic text-lg text-tertiary">{circuitStats.turns}</span>
                </div>
              )}
              {circuitStats?.lapRecord && (
                <div className="border-b border-white/5 pb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#FFD700]">timer</span>
                      Lap Record
                    </span>
                    <span className="headline-font font-black italic text-lg text-[#FFD700]">{circuitStats.lapRecord}</span>
                  </div>
                  {(circuitStats.lapRecordHolder || circuitStats.lapRecordYear) && (
                    <p className="text-[10px] text-on-surface-variant/60 text-right uppercase tracking-wider">
                      {circuitStats.lapRecordHolder}{circuitStats.lapRecordYear ? ` · ${circuitStats.lapRecordYear}` : ''}
                    </p>
                  )}
                </div>
              )}
              {/* Historical stats */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-on-surface-variant">Total GPs Hosted</span>
                <span className="headline-font font-black italic text-xl text-on-surface">{totalRaces}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-on-surface-variant">First Race</span>
                <span className="headline-font font-black italic text-xl text-on-surface">{firstRaceYear}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-on-surface-variant">Last Race</span>
                <span className="headline-font font-black italic text-xl text-on-surface">{lastRaceYear}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-sm text-on-surface-variant">Active Span</span>
                <span className="headline-font font-black italic text-xl text-on-surface">{lastRaceYear - firstRaceYear + 1} yrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Location</span>
                <span className="text-sm text-on-surface text-right">{circuit.locality}, {circuit.country}</span>
              </div>
            </div>
          </div>

          {/* Most Successful Drivers */}
          {topDrivers.length > 0 && (
            <div className={`p-6 ${glass ? 'bg-black/15 backdrop-blur-md border border-white/20 rounded-[2rem]' : 'bg-surface-container border border-white/5'}`}>
              <h3 className="headline-font font-black italic uppercase tracking-tighter text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFD700]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                MOST WINS HERE
              </h3>
              <div className="space-y-3">
                {topDrivers.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="headline-font font-black italic text-lg w-8 text-center" style={{ color: i < 3 ? PODIUM_COLORS[i] : '#666' }}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm headline-font font-bold truncate">{d.name}</span>
                    <span className="headline-font font-black italic text-primary-fixed-dim text-sm">{d.wins}W</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wikipedia Link */}
          {circuit.wikiUrl && (
            <a
              href={circuit.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 flex items-center gap-3 transition-colors group ${glass ? 'bg-black/15 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-black/30' : 'bg-surface-container border border-white/5 hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-tertiary">language</span>
              <span className="flex-1 text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Wikipedia Article</span>
              <span className="material-symbols-outlined text-sm text-on-surface-variant/40 group-hover:translate-x-1 transition-transform">open_in_new</span>
            </a>
          )}
        </div>
      </div>

      {/* Race History / Podium Table */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="headline-font font-black italic uppercase text-2xl tracking-tighter flex items-center gap-4">
            <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            PODIUM HISTORY
          </h2>

          {/* Decade Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDecade('RECENT')}
              className={`px-3 py-1.5 text-xs headline-font font-bold uppercase tracking-wider transition-all border ${
                selectedDecade === 'RECENT'
                  ? 'bg-primary-container text-on-primary-container border-primary-container'
                  : `${glass ? 'bg-black/20 backdrop-blur-sm' : 'bg-surface-container'} text-on-surface-variant border-white/10 hover:border-primary-container/30 hover:text-on-surface`
              }`}
              style={{ borderRadius: glass ? '0.75rem' : '0' }}
            >
              Recent 10
            </button>
            {decades.map((decade) => (
              <button
                key={decade}
                onClick={() => setSelectedDecade(String(decade))}
                className={`px-3 py-1.5 text-xs headline-font font-bold uppercase tracking-wider transition-all border ${
                  selectedDecade === String(decade)
                    ? 'bg-primary-container text-on-primary-container border-primary-container'
                    : `${glass ? 'bg-black/20 backdrop-blur-sm' : 'bg-surface-container'} text-on-surface-variant border-white/10 hover:border-primary-container/30 hover:text-on-surface`
                }`}
                style={{ borderRadius: glass ? '0.75rem' : '0' }}
              >
                {decade}s
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] headline-font font-bold mb-4">
          Showing {filteredHistory.length} of {raceHistory.length} races
          {selectedDecade !== 'RECENT' && ` • ${selectedDecade}s decade`}
        </p>

        {/* Desktop Table */}
        <div className={`hidden md:block overflow-x-auto w-full ${glass ? 'bg-black/10 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-xl p-8' : ''}`}>
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-primary-container/30">
                <th className="headline-font font-black italic uppercase tracking-tighter text-sm py-4 px-4 text-on-surface-variant">YEAR</th>
                <th className="headline-font font-black italic uppercase tracking-tighter text-sm py-4 px-4 text-on-surface-variant">GRAND PRIX</th>
                <th className="headline-font font-black italic uppercase tracking-tighter text-sm py-4 px-4 text-center">
                  <span className="text-[#FFD700]">🥇 WINNER</span>
                </th>
                <th className="headline-font font-black italic uppercase tracking-tighter text-sm py-4 px-4 text-center">
                  <span className="text-[#C0C0C0]">🥈 2ND</span>
                </th>
                <th className="headline-font font-black italic uppercase tracking-tighter text-sm py-4 px-4 text-center">
                  <span className="text-[#CD7F32]">🥉 3RD</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((race, idx) => (
                <tr
                  key={`${race.season}-${race.round}`}
                  className={`border-b border-white/5 hover:bg-surface-container transition-colors ${idx % 2 === 0 ? 'bg-surface-container-low/50' : ''}`}
                >
                  <td className="py-4 px-4">
                    <span className="headline-font font-black italic text-lg text-primary-fixed-dim">{race.season}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="headline-font font-bold text-sm">{race.raceName}</div>
                    <div className="text-[10px] text-on-surface-variant mt-0.5">
                      {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </div>
                  </td>
                  {[1, 2, 3].map((pos) => {
                    const entry = race.podium.find((p) => p.position === pos);
                    return (
                      <td key={pos} className="py-4 px-4 text-center">
                        {entry ? (
                          <div>
                            <div className="headline-font font-bold text-sm">{entry.driverName}</div>
                            <div className="text-[10px] text-on-surface-variant uppercase tracking-wider">{entry.team}</div>
                          </div>
                        ) : (
                          <span className="text-on-surface-variant/30 text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredHistory.map((race) => (
            <div key={`${race.season}-${race.round}`} className="bg-surface-container-low border border-white/5 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="headline-font font-black italic text-2xl text-primary-fixed-dim">{race.season}</span>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className="text-xs text-on-surface-variant headline-font font-bold uppercase tracking-wider">{race.raceName.replace('Grand Prix', 'GP')}</span>
              </div>
              <div className="space-y-2">
                {race.podium.map((p) => (
                  <div key={p.position} className="flex items-center gap-3 bg-black/20 px-3 py-2" style={{ borderLeft: `3px solid ${PODIUM_COLORS[p.position - 1]}` }}>
                    <span className="text-lg">{PODIUM_MEDALS[p.position - 1]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="headline-font font-bold text-sm block truncate">{p.driverName}</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{p.team}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="bg-surface-container-low border border-white/5 pb-10">
            <DataState 
              type="empty" 
              title="NO RACES IN ERA" 
              message={`Telemetry confirms no official races occurred at this circuit during the ${selectedDecade}s.`} 
              onAction={() => setSelectedDecade('RECENT')}
              actionText="VIEW RECENT RACES"
            />
          </div>
        )}
      </section>
    </div>
  );
}
