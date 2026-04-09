import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllCircuits, getCountryFlag, type CircuitInfo } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { CircuitsSkeleton } from '../components/ui/SkeletonLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Circuits() {
  useDocumentMeta('Circuit Encyclopedia', 'Explore official Formula 1 circuit layouts, history, and physical track data.');
  const [circuits, setCircuits] = useState<CircuitInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  useEffect(() => {
    let mounted = true;
    fetchAllCircuits().then((data) => {
      if (mounted) {
        setCircuits(data);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Get unique countries for the filter
  const countries = ['ALL', ...Array.from(new Set(circuits.map((c) => c.country))).sort()];

  // Filter circuits
  const filtered = circuits.filter((c) => {
    const matchesSearch = searchQuery === '' ||
      c.circuitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'ALL' || c.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  if (loading) {
    return <CircuitsSkeleton />;
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
      {/* Header */}
      <header className={`mb-12 ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg p-8 md:p-12' : ''}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-2 h-8 bg-tertiary-container"></div>
          <span className="headline-font text-sm font-bold italic uppercase tracking-[0.3em] text-tertiary">CIRCUIT ENCYCLOPEDIA</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black italic uppercase headline-font tracking-tighter leading-none mb-4 text-on-surface">
          ALL CIRCUITS
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl">
          Every circuit that has hosted an official FIA Formula One World Championship race, from 1950 to present day.
        </p>
        <div className="flex items-center gap-4 headline-font font-bold italic uppercase tracking-widest text-sm flex-wrap mt-6">
          <span className="bg-surface-container text-on-surface px-3 py-1.5 border border-white/10">
            {circuits.length} CIRCUITS
          </span>
          <span className="bg-surface-container text-on-surface px-3 py-1.5 border border-white/10">
            {new Set(circuits.map(c => c.country)).size} COUNTRIES
          </span>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 w-full">
        <div className="relative flex-1 w-full md:max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
          <input
            type="text"
            placeholder="Search circuits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 text-on-surface headline-font text-sm focus:outline-none focus:border-primary-container/50 transition-colors placeholder:text-on-surface-variant/40 ${glass ? 'bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl' : 'bg-surface-container border border-white/10'}`}
          />
        </div>

        <div className="relative w-full md:w-auto">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`w-full md:w-auto px-4 py-3 text-on-surface headline-font text-sm focus:outline-none focus:border-primary-container/50 appearance-none pr-10 cursor-pointer min-w-[180px] ${glass ? 'bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl' : 'bg-surface-container border border-white/10'}`}
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Countries' : `${getCountryFlag(c)} ${c}`}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">expand_more</span>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] headline-font font-bold mb-6">
        Showing {filtered.length} of {circuits.length} circuits
      </p>

      {/* Circuit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((circuit, idx) => (
          <Link
            key={circuit.circuitId}
            to={`/circuit/${circuit.circuitId}`}
            className={`group relative overflow-hidden transition-all duration-400 block ${glass ? 'bg-black/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-black/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(225,6,0,0.08)]' : 'bg-surface-container-low border border-white/5 hover:bg-surface-container hover:border-primary-container/30 hover:shadow-[0_0_30px_rgba(225,6,0,0.08)]'}`}
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            {/* Map Preview */}
            <div className="relative h-36 bg-black/30 overflow-hidden">
              <iframe
                title={circuit.circuitName}
                className="w-full h-full pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(circuit.long) - 0.03}%2C${parseFloat(circuit.lat) - 0.02}%2C${parseFloat(circuit.long) + 0.03}%2C${parseFloat(circuit.lat) + 0.02}&layer=mapnik&marker=${circuit.lat}%2C${circuit.long}`}
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent pointer-events-none"></div>
              {/* Country flag badge */}
              <div className="absolute top-3 right-3 text-2xl drop-shadow-lg">
                {getCountryFlag(circuit.country)}
              </div>
            </div>

            {/* Circuit Info */}
            <div className="p-5">
              <h3 className="headline-font font-black italic uppercase tracking-tighter text-base leading-tight mb-2 group-hover:text-primary-fixed-dim transition-colors line-clamp-2">
                {circuit.circuitName}
              </h3>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="truncate">{circuit.locality}, {circuit.country}</span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 headline-font font-bold">View Details</span>
                <span className="material-symbols-outlined text-sm text-primary-container/40 group-hover:text-primary-container group-hover:translate-x-1 transition-all">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && !loading && !error && (
        <DataState 
          type="empty" 
          onAction={() => {
            setSearchQuery('');
            setSelectedCountry('ALL');
          }} 
        />
      )}
    </div>
  );
}
