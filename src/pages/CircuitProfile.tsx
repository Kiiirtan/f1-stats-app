import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCircuitRaceHistory, getCountryFlag, type CircuitDetail } from '../data/api';
import DataState from '../components/ui/DataState';

const PODIUM_MEDALS = ['🥇', '🥈', '🥉'];
const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

// Extracts the Wikipedia page title from a URL like https://en.wikipedia.org/wiki/Silverstone_Circuit
function getWikiTitle(url: string): string {
  try {
    const parts = url.split('/wiki/');
    return parts[1] || '';
  } catch { return ''; }
}

export default function CircuitProfile() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CircuitDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [trackImageUrl, setTrackImageUrl] = useState<string | null>(null);

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

  // Fetch robust track map from Wikipedia
  useEffect(() => {
    if (!data?.circuit.wikiUrl) return;
    const title = getWikiTitle(data.circuit.wikiUrl);
    if (!title) return;

    let mounted = true;

    async function loadTrackMap() {
      try {
        // 1. Get all images on the page
        const res1 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=images&imlimit=100&format=json&origin=*`);
        const json1 = await res1.json();
        const pages = json1.query?.pages;
        if (!pages) throw new Error("No pages returned from Wiki API");
        
        const pageId = Object.keys(pages)[0];
        const images = pages[pageId].images || [];

        // Filter potential track maps
        const candidates = images
          .map((img: any) => img.title)
          .filter((t: string) => {
            const lower = t.toLowerCase();
            return lower.endsWith('.svg') && 
                  !lower.includes('ambox') && 
                  !lower.includes('flag') && 
                  !lower.includes('icon') &&
                  !lower.includes('logo') &&
                  !lower.includes('symbol') &&
                  !lower.includes('question') &&
                  !lower.includes('arrow');
          });

        let bestImage = null;
        let highestScore = -1;

        for (const img of candidates) {
          const lower = img.toLowerCase();
          let score = 0;
          if (lower.includes('circuit')) score += 2;
          if (lower.includes('map')) score += 2;
          if (lower.includes('track')) score += 2;
          if (lower.includes('layout')) score += 2;
          
          const titleLower = title.replace(/_/g, ' ').toLowerCase();
          if (lower.includes(titleLower.split(' ')[0])) score += 3;

          if (score > highestScore) {
            highestScore = score;
            bestImage = img;
          }
        }

        if (bestImage) {
          // 2. Fetch the URL for the best image
          const res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestImage)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
          const json2 = await res2.json();
          const imgPages = json2.query?.pages;
          if (imgPages) {
            const imgPageId = Object.keys(imgPages)[0];
            const url = imgPages[imgPageId].imageinfo?.[0]?.url;
            if (url && mounted) {
              setTrackImageUrl(url);
              return;
            }
          }
        }

        // 3. Fallback to summary API if no valid SVG track map was found
        const fallbackRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
        const fallbackJson = await fallbackRes.json();
        if (mounted && fallbackJson.thumbnail?.source) {
          const highRes = fallbackJson.thumbnail.source.replace(/\/\d+px-/, '/800px-');
          setTrackImageUrl(highRes);
        }

      } catch (err) {
        console.error("Failed to load track map:", err);
      }
    }

    loadTrackMap();

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
      <div className="pt-24 md:pt-32 pb-20 flex flex-col justify-center items-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 border-2 border-primary-container/20 border-t-primary-container animate-spin" style={{ borderRadius: '50%' }}></div>
        <p className="headline-font font-bold italic uppercase tracking-[0.3em] text-sm text-on-surface-variant animate-pulse">
          LOADING CIRCUIT HISTORY
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
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
    <div className="pt-24 md:pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
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
      <header className="mb-12">
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
            <div className="bg-surface-container border border-white/5 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-white/5">
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
              <div className="relative bg-black/20 flex items-center justify-center p-6 min-h-[200px]">
                <img
                  src={trackImageUrl}
                  alt={`${circuit.circuitName} Track Layout`}
                  className="max-h-[320px] w-auto object-contain"
                  onError={() => setTrackImageUrl(null)}
                />
              </div>
            </div>
          )}

          {/* Location Map */}
          <div className="bg-surface-container border border-white/5 overflow-hidden">
            <div className="p-4 flex items-center gap-2 border-b border-white/5">
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
          <div className="bg-surface-container border border-white/5 p-6">
            <h3 className="headline-font font-black italic uppercase tracking-tighter text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>query_stats</span>
              CIRCUIT STATS
            </h3>
            <div className="space-y-4">
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
            <div className="bg-surface-container border border-white/5 p-6">
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
              className="bg-surface-container border border-white/5 p-4 flex items-center gap-3 hover:bg-surface-container-high transition-colors group"
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
                  : 'bg-surface-container text-on-surface-variant border-white/10 hover:border-primary-container/30 hover:text-on-surface'
              }`}
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
                    : 'bg-surface-container text-on-surface-variant border-white/10 hover:border-primary-container/30 hover:text-on-surface'
                }`}
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
        <div className="hidden md:block overflow-x-auto w-full">
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
