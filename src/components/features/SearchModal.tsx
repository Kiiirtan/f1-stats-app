import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDriverStandings, fetchRaceCalendar, fetchConstructorStandings, type Driver, type Race, type ConstructorStanding } from '../../data/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

type SearchResultItem = 
  | { type: 'DRIVER'; id: string; title: string; subtitle: string; color: string; icon: string; route: string; badge: string }
  | { type: 'RACE'; id: string; title: string; subtitle: string; color: string; icon: string; route: string; badge: string }
  | { type: 'CONSTRUCTOR'; id: string; title: string; subtitle: string; color: string; icon: string; route: string; badge: string };

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';

      // Load data for search
      Promise.all([
        fetchDriverStandings(),
        fetchRaceCalendar(),
        fetchConstructorStandings()
      ])
        .then(([d, r, c]) => { 
          setDrivers(d); 
          setRaces(r); 
          setConstructors(c); 
        })
        .catch(() => {});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const q = query.toLowerCase().trim();

  // Unified Search Results
  let results: SearchResultItem[] = [];

  if (q) {
    const matchedDrivers = drivers
      .filter((d) =>
        d.firstName.toLowerCase().includes(q) ||
        d.lastName.toLowerCase().includes(q) ||
        d.team.toLowerCase().includes(q) ||
        String(d.number).includes(q) ||
        d.code.toLowerCase().includes(q)
      )
      .map(d => ({
        type: 'DRIVER' as const,
        id: `driver-${d.id}`,
        title: `${d.firstName} ${d.lastName}`,
        subtitle: `${d.team} • #${d.number}`,
        color: d.teamColor,
        icon: 'sports_motorsports',
        route: `/driver/${d.id}`,
        badge: 'DRIVER'
      }));

    const matchedConstructors = constructors
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q)
      )
      .map(c => ({
        type: 'CONSTRUCTOR' as const,
        id: `constructor-${c.constructorId}`,
        title: c.name,
        subtitle: `HQ: ${c.nationality} • P${c.position} in Championship`,
        color: c.color,
        icon: 'precision_manufacturing',
        route: `/constructor/${c.constructorId}`,
        badge: 'TEAM'
      }));

    const matchedRaces = races
      .filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.circuit.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      )
      .map(r => ({
        type: 'RACE' as const,
        id: `race-${r.round}`,
        title: r.name,
        subtitle: `${r.circuit}, ${r.country}`,
        color: '#29DEC9',
        icon: 'flag',
        route: `/results?round=${r.round}`,
        badge: 'RACE'
      }));

    results = [...matchedDrivers, ...matchedConstructors, ...matchedRaces];
  }

  // Handle Keyboard Navigation
  useEffect(() => {
    setActiveIndex(0); // Reset selection on query change
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[activeIndex]) {
          navigate(results[activeIndex].route);
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, results, activeIndex, navigate]);

  // Scroll active item into view
  useEffect(() => {
    if (resultRefs.current[activeIndex]) {
      resultRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const handleItemClick = (route: string) => {
    navigate(route);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[10vh] px-4 font-headline">
      {/* Background Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-2xl transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* Main Command Palette */}
      <div className="relative w-full max-w-3xl bg-[#13131b]/90 border border-white/10 shadow-[0_0_100px_rgba(41,222,201,0.1)] rounded-3xl overflow-hidden flex flex-col animate-search-in backdrop-blur-3xl">
        
        {/* Search Header Input */}
        <div className="flex items-center px-6 h-20 border-b border-white/10 shrink-0 relative bg-white/[0.02]">
          <span className="material-symbols-outlined text-[var(--theme-accent)] text-3xl mr-4 drop-shadow-[0_0_15px_rgba(41,222,201,0.5)]">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, drivers, or races..."
            className="flex-1 bg-transparent text-white font-black text-2xl md:text-3xl tracking-tighter outline-none placeholder:text-white/20"
            spellCheck="false"
          />
          <button
            onClick={onClose}
            className="hidden md:flex text-white/40 hover:text-white transition-colors text-[10px] font-bold tracking-widest border border-white/20 px-3 py-1.5 rounded-lg bg-white/5 items-center gap-1"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        {q ? (
          <div className="max-h-[60vh] overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
            {results.length > 0 ? (
              results.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    ref={el => resultRefs.current[index] = el}
                    onClick={() => handleItemClick(item.route)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 text-left group border ${
                      isActive 
                        ? 'bg-white/10 border-white/20 shadow-lg scale-[1.01]' 
                        : 'bg-transparent border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Circle */}
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                        style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}
                      >
                        <span 
                          className="material-symbols-outlined text-xl"
                          style={{ color: item.color }}
                        >
                          {item.icon}
                        </span>
                      </div>
                      
                      {/* Text */}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`font-black text-lg tracking-tight transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                            {item.title}
                          </span>
                          <span className="px-2 py-0.5 bg-black/40 rounded text-[9px] font-black tracking-widest text-white/50 border border-white/10 hidden sm:inline-block">
                            {item.badge}
                          </span>
                        </div>
                        <span className={`text-sm tracking-wide font-body ${isActive ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'}`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Right Arrow / Action Indicator */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                      isActive ? 'border-[var(--theme-accent)]/50 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]' : 'border-white/5 bg-transparent text-transparent'
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-20 text-white/40">
                <span className="material-symbols-outlined text-6xl mb-4 block opacity-30 animate-pulse">search_off</span>
                <p className="text-lg font-black tracking-tighter text-white">NO RESULTS FOUND</p>
                <p className="text-sm font-body mt-2">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gradient-to-b from-transparent to-black/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-lg mb-8">
              {[
                { label: 'DRIVERS', icon: 'sports_motorsports', color: '#E10600' },
                { label: 'TEAMS', icon: 'precision_manufacturing', color: '#FF8000' },
                { label: 'RACES', icon: 'flag', color: '#29DEC9' }
              ].map(cat => (
                <div key={cat.label} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="material-symbols-outlined text-3xl mb-2" style={{ color: cat.color }}>{cat.icon}</span>
                  <span className="text-[10px] font-black tracking-widest text-white/60">{cat.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-body text-white/40 max-w-md">
              Start typing to instantly search through the entire F1 grid, current season races, and constructor profiles.
            </p>
          </div>
        )}

        {/* Footer shortcuts */}
        <div className="h-10 bg-black/40 border-t border-white/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 opacity-50">
              <kbd className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px]">&uarr;</kbd>
              <kbd className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px]">&darr;</kbd>
              <span className="text-[10px] font-bold tracking-widest ml-1">NAVIGATE</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-50">
              <kbd className="px-1.5 h-5 flex items-center justify-center bg-white/10 rounded text-[10px]">ENTER</kbd>
              <span className="text-[10px] font-bold tracking-widest ml-1">SELECT</span>
            </div>
          </div>
          <div className="text-[10px] font-bold tracking-widest text-white/20">
            JOLPICA F1 DATA ENGINE
          </div>
        </div>

      </div>
    </div>
  );
}
