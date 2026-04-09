import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConstructorStandings, type ConstructorStanding } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { ConstructorsSkeleton } from '../components/ui/SkeletonLoader';
import { getConstructorSpecs } from '../data/constructorDetails';
import { useDrivers } from '../hooks/useDrivers';
import { getDriverPortrait } from '../data/driverImages';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Constructors() {
  useDocumentMeta('Constructor Standings', 'Official Formula 1 constructor championship standings, team profiles, and car telemetry.');
  const navigate = useNavigate();
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { settings } = useSettings();
  const glass = settings.glassMorphism;
  
  const { drivers } = useDrivers();

  // Group drivers by team ID
  const driversByTeam = useMemo(() => {
    const map = new Map<string, typeof drivers>();
    drivers.forEach(driver => {
      const teamId = driver.teamId;
      if (!map.has(teamId)) map.set(teamId, []);
      map.get(teamId)!.push(driver);
    });
    return map;
  }, [drivers]);

  useEffect(() => {
    let mounted = true;
    fetchConstructorStandings().then((data) => {
      if (mounted) setStandings(data);
    }).catch(err => {
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="pt-20 pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full">
      {/* List Header */}
      <h1 className="font-headline font-black uppercase text-3xl md:text-5xl text-white tracking-widest mb-10 drop-shadow-md">
        CONSTRUCTORS
      </h1>

      {/* Standings List */}
      <section className="flex flex-col gap-6">
        {loading ? (
          <ConstructorsSkeleton />
        ) : error ? (
          <DataState type="error" onAction={() => window.location.reload()} />
        ) : (
          standings.map((team) => {
            const hexColor = team.color || '#ffffff';
            const teamSpecs = getConstructorSpecs(team.constructorId);
            const teamDrivers = driversByTeam.get(team.constructorId) || [];
            
            // Limit to 2 drivers for UI styling
            const displayDrivers = teamDrivers.slice(0, 2);
            
            return (
              <div 
                key={team.constructorId} 
                onClick={() => navigate(`/constructor/${team.constructorId}`)}
                className={`group relative overflow-hidden flex flex-col p-6 rounded-3xl transition-transform duration-500 hover:scale-[1.01] cursor-pointer shadow-xl border ${
                  glass ? 'bg-black/30 backdrop-blur-xl border-white/20 hover:border-white/40' : 'bg-surface-container border-white/5 hover:border-white/20 hover:bg-surface-container-high'
                }`}
              >
                {/* Background ambient glow from team color */}
                <div 
                  className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: hexColor }}
                ></div>

                {/* Top Section: Team Name & Nav Icon */}
                <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                  <div className="flex items-center gap-4">
                    {teamSpecs.logo && (
                      <div className="bg-white/95 p-1.5 rounded-lg shadow-sm flex items-center justify-center">
                        <img 
                          src={teamSpecs.logo} 
                          alt={`${teamSpecs.teamName} Logo`} 
                          className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow"
                        />
                      </div>
                    )}
                    <h2 className="font-headline font-black italic uppercase text-3xl md:text-4xl text-white drop-shadow-md tracking-wide">
                      {teamSpecs.teamName}
                    </h2>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black/20 group-hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-white/70">chevron_right</span>
                  </div>
                </div>

                {/* Middle Content Area */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-4 mb-8 gap-8 relative z-10">
                  {/* Car Render */}
                  <div className="flex-1 w-full max-w-sm flex justify-center md:justify-start">
                    <img 
                      src={teamSpecs.carImage} 
                      alt={`${teamSpecs.teamName} Car`} 
                      className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>

                  {/* Driver Portraits */}
                  <div className="flex items-center gap-6 md:gap-10">
                    {displayDrivers.map((driver) => (
                      <div key={driver.id} className="flex flex-col items-center">
                        <div 
                          className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-3 overflow-hidden border border-white/20 relative bg-black/50"
                          style={{ boxShadow: `0 10px 30px ${hexColor}40` }}
                        >
                          <img 
                            src={getDriverPortrait(driver.id)} 
                            alt={driver.lastName}
                            className="w-full h-full object-cover object-top mask-image-bottom grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 saturate-[0.85] contrast-125"
                            style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 10%, black 50%)' }}
                          />
                        </div>
                        <span className="font-headline font-medium tracking-wide text-[10px] md:text-xs text-white/70 text-center uppercase">
                          {driver.firstName}
                        </span>
                        <span className="font-headline font-bold uppercase tracking-widest text-sm md:text-base text-white text-center drop-shadow-sm leading-tight">
                          {driver.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-white/10 mb-6 relative z-10"></div>

                {/* Bottom Technical Specs Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 text-left">
                  <div className="flex flex-col">
                    <span className="font-headline font-bold uppercase text-[10px] text-white/50 tracking-[0.2em] mb-1">ENGINE</span>
                    <span className="font-body font-medium text-sm text-white/90">{teamSpecs.engine}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline font-bold uppercase text-[10px] text-white/50 tracking-[0.2em] mb-1">CHASSIS</span>
                    <span className="font-body font-medium text-sm text-white/90">{teamSpecs.chassis}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline font-bold uppercase text-[10px] text-white/50 tracking-[0.2em] mb-1">POWER UNIT</span>
                    <span className="font-body font-medium text-sm text-white/90">{teamSpecs.powerUnit}</span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
