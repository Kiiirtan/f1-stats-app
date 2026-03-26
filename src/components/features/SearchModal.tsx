import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDriverStandings, fetchRaceCalendar, type Driver, type Race } from '../../data/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';

      // Load data for search
      Promise.all([fetchDriverStandings(), fetchRaceCalendar()])
        .then(([d, r]) => { setDrivers(d); setRaces(r); })
        .catch(() => {});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const filteredDrivers = q
    ? drivers.filter(
        (d) =>
          d.firstName.toLowerCase().includes(q) ||
          d.lastName.toLowerCase().includes(q) ||
          d.team.toLowerCase().includes(q) ||
          String(d.number).includes(q) ||
          d.code.toLowerCase().includes(q)
      )
    : [];

  const filteredRaces = q
    ? races.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.circuit.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      )
    : [];

  const handleDriverClick = (id: string) => { navigate(`/driver/${id}`); onClose(); };
  const handleRaceClick = (round: number) => { navigate(`/results?round=${round}`); onClose(); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-24 px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-c-30 border border-c-10/15 shadow-2xl rounded-sm animate-search-in">
        <div className="flex items-center px-6 h-16 border-b border-c-10/10">
          <span className="material-symbols-outlined text-c-10 mr-4">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find any driver, race, or circuit..."
            className="flex-1 bg-transparent text-t-bright font-body text-lg outline-none placeholder:text-t-main/40"
          />
          <button
            onClick={onClose}
            className="text-t-main/50 hover:text-c-10 transition-colors text-[10px] font-bold tracking-widest border border-c-10/15 px-2.5 py-1 rounded-sm"
          >
            ESC
          </button>
        </div>

        {q && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {filteredDrivers.length > 0 && (
              <div>
                <h3 className="text-[10px] font-label uppercase tracking-[0.2em] text-c-10/70 mb-3 px-2">Drivers</h3>
                {filteredDrivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleDriverClick(d.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-sm hover:bg-c-10/5 transition-colors text-left group"
                  >
                    <div>
                      <span className="font-headline font-bold text-t-bright uppercase group-hover:text-c-10 transition-colors">
                        {d.firstName} {d.lastName}
                      </span>
                      <span className="ml-3 text-xs text-t-main/50">{d.team}</span>
                    </div>
                    <span className="font-headline font-bold text-sm" style={{ color: d.teamColor }}>
                      #{d.number}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredRaces.length > 0 && (
              <div>
                <h3 className="text-[10px] font-label uppercase tracking-[0.2em] text-c-10/70 mb-3 px-2">Races</h3>
                {filteredRaces.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRaceClick(r.round)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-sm hover:bg-c-10/5 transition-colors text-left group"
                  >
                    <div>
                      <span className="font-headline font-bold text-t-bright group-hover:text-c-10 transition-colors">{r.name}</span>
                      <span className="ml-3 text-xs text-t-main/50">{r.circuit}</span>
                    </div>
                    <span className="text-t-main/60 text-lg">{r.flag}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredDrivers.length === 0 && filteredRaces.length === 0 && (
              <div className="text-center py-16 text-t-main/40">
                <span className="material-symbols-outlined text-5xl mb-3 block opacity-50">search_off</span>
                <p className="text-sm font-headline font-bold uppercase tracking-wider">No results found</p>
                <p className="text-xs text-t-main/30 mt-1">Try searching for a driver name, team, or circuit</p>
              </div>
            )}
          </div>
        )}

        {!q && (
          <div className="text-center py-16 text-t-main/40">
            <span className="material-symbols-outlined text-4xl mb-3 block opacity-30">bolt</span>
            <p className="text-sm">Find any driver, race, or circuit...</p>
          </div>
        )}
      </div>
    </div>
  );
}
