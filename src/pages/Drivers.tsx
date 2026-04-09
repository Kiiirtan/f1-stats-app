import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDrivers } from '../hooks/useDrivers';
import { fetchConstructorStandings, type ConstructorStanding } from '../data/api';
import { getDriverPortrait } from '../data/driverImages';
import { getConstructorSpecs } from '../data/constructorDetails';
import DataState from '../components/ui/DataState';
import { DriversSkeleton } from '../components/ui/SkeletonLoader';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// ─── Simple Form Sparkline ──────────────────────────────────────────────────
// Returns a jagged SVG line based on recent "results" for the aesthetic
function FormSparkline({ color = '#00f0e0', seed }: { color?: string; seed: number }) {
  // Generate a pseudo-random looking line based on the driver's ID/seed
  const points = [
    100 - ((seed * 11) % 60),
    100 - ((seed * 23) % 40) - 20,
    100 - ((seed * 37) % 50) - 10,
    100 - ((seed * 41) % 70),
    100 - ((seed * 53) % 30) - 40,
  ];
  
  // Format to SVG path (width 80, height 30)
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 20} ${p * 0.3}`)
    .join(' ');

  return (
    <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-80 drop-shadow-md">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

export default function Standings() {
  useDocumentMeta('Driver Standings', 'Official Formula 1 driver championship standings, statistics, and detailed performance telemetry.');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine initial tab from URL if we decided to unify routes, 
  // but for now we'll just handle state.
  const [activeTab, setActiveTab] = useState<'DRIVERS' | 'CONSTRUCTORS'>('DRIVERS');

  // Drivers Data
  const { drivers, loading: driLoading, error: driError } = useDrivers();
  
  // Constructors Data
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [conLoading, setConLoading] = useState(true);
  const [conError, setConError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchConstructorStandings().then((data) => {
      if (mounted) setConstructors(data);
    }).catch(err => {
      if (mounted) setConError(err.message);
    }).finally(() => {
      if (mounted) setConLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const isLoading = activeTab === 'DRIVERS' ? driLoading : conLoading;
  const isError = activeTab === 'DRIVERS' ? driError : conError;

  return (
    <div className="pt-20 pb-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
      {/* Header & Tabs */}
      <div className="mb-8 flex flex-col items-center md:items-start">
        <h1 className="font-headline font-black uppercase text-3xl text-white tracking-widest mb-6">STANDINGS</h1>
        
        {/* Toggle Switch */}
        <div className="flex bg-black/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 w-full max-w-md shadow-lg">
          <button
            onClick={() => setActiveTab('DRIVERS')}
            className={`flex-1 font-headline font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'DRIVERS' 
                ? 'bg-gradient-to-b from-[#E10600]/80 to-[#8a0000]/80 text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] border border-red-500/50' 
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            DRIVERS
          </button>
          <button
            onClick={() => setActiveTab('CONSTRUCTORS')}
            className={`flex-1 font-headline font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-300 ${
              activeTab === 'CONSTRUCTORS' 
                ? 'bg-gradient-to-b from-[#E10600]/80 to-[#8a0000]/80 text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] border border-red-500/50' 
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            CONSTRUCTORS
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {/* Table Header Row (Hidden on narrow mobile, visible on md+) */}
        <div className="hidden md:flex items-center px-6 py-3 border-b border-white/5 mb-4 font-headline uppercase tracking-widest text-[10px] text-white/50 font-bold">
          <div className="w-16">RANK</div>
          <div className="flex-1">DRIVER</div>
          <div className="w-48">TEAM</div>
          <div className="w-32">POINTS</div>
          <div className="w-24 text-center">FORM</div>
        </div>

        {/* Data State Handling */}
        {isLoading ? (
          <DriversSkeleton />
        ) : isError ? (
          <div className="pt-10"><DataState type="error" onAction={() => window.location.reload()} /></div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Drivers List */}
            {activeTab === 'DRIVERS' && drivers.map((driver, idx) => (
              <div 
                key={driver.id} 
                onClick={() => navigate(`/driver/${driver.id}`)}
                className="group flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-black/40 transition-all duration-300 cursor-pointer shadow-lg"
              >
                {/* Rank & Driver Profile (Mobile: Row 1, Desktop: Cols 1 & 2) */}
                <div className="flex items-center flex-1 min-w-0 mb-3 md:mb-0">
                  <div className="w-12 md:w-16 flex-shrink-0 font-headline font-black text-2xl md:text-3xl text-white drop-shadow-md">
                    {String(driver.standingPosition).padStart(2, '0')}
                  </div>
                  
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img 
                      src={getDriverPortrait(driver.id)} 
                      alt={driver.lastName}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover object-top border border-white/20 bg-black/50 shadow-inner grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline font-medium tracking-wide text-[10px] md:text-xs text-white/60 truncate">{driver.firstName}</span>
                      <span className="font-headline font-bold uppercase tracking-widest text-sm md:text-base text-white truncate drop-shadow-sm leading-tight">{driver.lastName}</span>
                    </div>
                  </div>
                </div>

                {/* Team, Points, Form (Mobile: Grid, Desktop: Columns) */}
                <div className="flex items-center justify-between md:justify-start gap-4 md:gap-0 pl-12 md:pl-0">
                  <div className="md:w-48 flex items-center gap-3 truncate">
                    {getConstructorSpecs(driver.teamId).logo ? (
                      <img src={getConstructorSpecs(driver.teamId).logo} alt={driver.team} className="w-6 h-6 object-contain bg-white/95 p-1 rounded-sm shadow-sm" />
                    ) : (
                      <span className="material-symbols-outlined text-[16px] xl:text-[20px]" style={{ color: driver.teamColor || '#aaa', fontVariationSettings: "'FILL' 1" }}>
                        directions_car
                      </span>
                    )}
                    <span className="font-headline font-medium text-xs md:text-sm text-white/80 truncate tracking-wide uppercase">{driver.team}</span>
                  </div>

                  <div className="md:w-32 flex items-baseline gap-1">
                    <span className="font-headline font-bold text-lg md:text-xl text-white drop-shadow-md">{driver.seasonPoints}</span>
                    <span className="font-headline font-bold text-[10px] text-white/40 tracking-widest">PTS</span>
                  </div>

                  <div className="md:w-24 flex justify-end md:justify-center">
                    <FormSparkline seed={idx * 17 + driver.seasonPoints} color={driver.teamColor || '#ffffff'} />
                  </div>
                </div>
              </div>
            ))}

            {/* Constructors List */}
            {activeTab === 'CONSTRUCTORS' && constructors.map((team, idx) => (
              <div 
                key={team.constructorId} 
                onClick={() => navigate(`/constructor/${team.constructorId}`)}
                className="group flex flex-col md:flex-row md:items-center px-4 md:px-6 py-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 hover:border-white/30 hover:bg-black/40 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <div className="flex items-center flex-1 min-w-0 mb-3 md:mb-0">
                  <div className="w-12 md:w-16 flex-shrink-0 font-headline font-black text-2xl md:text-3xl text-white drop-shadow-md">
                    {String(team.position).padStart(2, '0')}
                  </div>
                  
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div 
                      className="w-10 h-10 md:w-12 md:h-12 border-2 rounded-full flex items-center justify-center bg-white/95 shadow-inner flex-shrink-0 overflow-hidden"
                      style={{ borderColor: team.color || '#fff' }}
                    >
                      {getConstructorSpecs(team.constructorId).logo ? (
                        <img src={getConstructorSpecs(team.constructorId).logo} alt={team.name} className="w-8 h-8 object-contain drop-shadow-sm p-1" />
                      ) : (
                        <span className="material-symbols-outlined text-[20px]" style={{ color: team.color, fontVariationSettings: "'FILL' 1" }}>
                          sports_score
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-headline font-bold uppercase tracking-widest text-sm md:text-base text-white truncate drop-shadow-sm leading-tight">{team.name}</span>
                      <span className="font-headline font-medium tracking-wide text-[10px] md:text-xs text-white/60 truncate">{team.nationality} Team</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-start gap-4 md:gap-0 pl-12 md:pl-0">
                  <div className="md:w-48 flex items-center gap-2 truncate">
                    <span className="font-headline font-medium text-xs md:text-sm text-white/50 truncate tracking-wide uppercase">WINS: <span className="text-white/80">{team.wins}</span></span>
                  </div>

                  <div className="md:w-32 flex items-baseline gap-1">
                    <span className="font-headline font-bold text-lg md:text-xl text-white drop-shadow-md">{team.points}</span>
                    <span className="font-headline font-bold text-[10px] text-white/40 tracking-widest">PTS</span>
                  </div>

                  <div className="md:w-24 flex justify-end md:justify-center">
                    <FormSparkline seed={idx * 31 + team.points} color={team.color || '#ffffff'} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
