import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchDriverStandings, fetchRaceResults, fetchDriverCareerStats, getNationalityFlag, type Driver, type Race, type DriverCareerStats } from '../data/api';
import { getDriverPortrait } from '../data/driverImages';
import DataState from '../components/ui/DataState';

export default function DriverProfile() {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverRaces, setDriverRaces] = useState<{ race: Race; result: any }[]>([]);
  const [careerStats, setCareerStats] = useState<DriverCareerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;

    Promise.all([
      fetchDriverStandings(),
      fetchRaceResults(),
      fetchDriverCareerStats(id).catch(() => null) // Failsafe if history fails
    ]).then(([standingsData, racesData, statsData]) => {
      if (mounted) {
        const foundDriver = standingsData.find(d => d.id === id) || null;
        setDriver(foundDriver);
        setCareerStats(statsData);

        if (foundDriver) {
          const dRaces: { race: Race; result: any }[] = [];
          racesData.forEach(r => {
            const res = r.results.find(res => res.driverId === foundDriver.id);
            if (res) dRaces.push({ race: r, result: res });
          });
          dRaces.sort((a, b) => a.result.position - b.result.position);
          setDriverRaces(dRaces);
        }

        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (mounted) setError(err.message);
    }).finally(() => {
      if (mounted) setLoading(false);
    });

    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-1 bg-primary-container animate-pulse"></div>
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

  if (!driver) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <DataState type="not-found" actionLink="/drivers" actionText="RETURN TO GRID" />
      </div>
    );
  }

  const bestResults = driverRaces.slice(0, 4);

  return (
    <div className="relative z-10 pt-20 w-full">
      {/* Hero Section */}
      <section className="relative h-[921px] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            alt={`${driver.firstName} ${driver.lastName} Profile`} 
            className="w-full h-full object-cover grayscale opacity-60" 
            src={getDriverPortrait(driver.id)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r via-transparent to-transparent" style={{ '--tw-gradient-from': `${driver.teamColor}66` } as React.CSSProperties}></div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l to-transparent skew-x-[-15deg] translate-x-1/2" style={{ '--tw-gradient-from': `${driver.teamColor}33` } as React.CSSProperties}></div>
        </div>
        
        <div className="relative z-10 w-full px-8 pb-24 md:pb-32 grid grid-cols-12 max-w-[1600px] mx-auto">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-primary/20 text-white border border-primary/40 px-3 py-1 font-label text-xs tracking-[0.3em] uppercase backdrop-blur-sm" style={{ borderColor: `${driver.teamColor}66`, backgroundColor: `${driver.teamColor}33`}}>
                {driver.team}
              </span>
              <div className="h-[1px] w-24" style={{ backgroundColor: driver.teamColor }}></div>
            </div>
            <h1 className="font-headline text-7xl md:text-9xl font-black italic uppercase leading-[0.85] tracking-tighter mb-8 -ml-1">
              {driver.firstName} {getNationalityFlag(driver.nationality)}<br/>
              <span className="text-glow" style={{ color: driver.teamColor }}>{driver.lastName}</span>
            </h1>
            <div className="flex items-baseline gap-6 bg-surface-container/40 p-6 backdrop-blur-md border-l-4 inline-flex" style={{ borderColor: driver.teamColor }}>
              <span className="font-headline text-6xl font-light italic" style={{ color: driver.teamColor }}>{driver.number}</span>
              <div className="flex flex-col">
                <span className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant">World Standing</span>
                <span className="font-headline text-2xl font-bold uppercase">POSITION {String(driver.standingPosition).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Current Season Stats Grid */}
      <section className="bg-surface-container-low px-8 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: `${driver.teamColor}1a` }}></div>
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: driver.teamColor }}>Current Season</h2>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">2026</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-l border-t border-outline-variant/10">
            {/* Season Wins */}
            <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/40 backdrop-blur-sm hover:!bg-surface-container-high">
              <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Season Wins</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-7xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>{driver.seasonWins}</span>
              </div>
            </div>
            {/* Points */}
            <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/40 backdrop-blur-sm hover:!bg-surface-container-high">
              <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Season Points</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-7xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>{driver.seasonPoints}</span>
              </div>
            </div>
            {/* Best Finish */}
            <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/40 backdrop-blur-sm hover:!bg-surface-container-high">
              <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Best Finish</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-7xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>P{bestResults[0]?.result.position || '-'}</span>
              </div>
            </div>
            {/* Races */}
            <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/40 backdrop-blur-sm hover:!bg-surface-container-high">
              <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Races Completed</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-7xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>{driverRaces.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Overview Section */}
      {careerStats && (
        <section className="bg-background px-6 md:px-8 py-24 relative overflow-hidden border-t border-outline-variant/10">
          <div className="max-w-[1600px] mx-auto relative z-10">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: driver.teamColor }}>Career Overview</h2>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">All-Time</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-l border-t border-outline-variant/10">
              <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/20 hover:!bg-surface-container-high">
                <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">World Championships</span>
                <span className="font-headline text-6xl font-black italic" style={{ color: careerStats.championships > 0 ? '#FFD700' : 'inherit' }}>
                  {careerStats.championships}
                </span>
              </div>
              <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/20 hover:!bg-surface-container-high">
                <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Career Wins</span>
                <span className="font-headline text-6xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                  {careerStats.wins}
                </span>
              </div>
              <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/20 hover:!bg-surface-container-high">
                <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Pole Positions</span>
                <span className="font-headline text-6xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                  {careerStats.poles}
                </span>
              </div>
              <div className="p-12 border-r border-b border-outline-variant/10 group transition-all duration-500 bg-surface/20 hover:!bg-surface-container-high">
                <span className="font-label text-xs tracking-widest text-on-surface-variant uppercase block mb-6">Seasons Competed</span>
                <span className="font-headline text-6xl font-bold transition-colors" style={{ color: 'inherit' }} onMouseEnter={(e) => (e.currentTarget.style.color = driver.teamColor)} onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}>
                  {careerStats.seasons.length}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Season History Section */}
      {careerStats && careerStats.seasons.length > 0 && (
        <section className="px-6 md:px-8 py-24 bg-surface-container-low relative border-t border-outline-variant/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: driver.teamColor }}>Season History</h2>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Historical Standings</span>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="py-6 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Year</th>
                    <th className="py-6 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Constructor</th>
                    <th className="py-6 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Final Position</th>
                    <th className="py-6 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Points</th>
                    <th className="py-6 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right">Wins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {careerStats.seasons.map((season) => (
                    <tr key={season.year} className="group hover:bg-surface-container-high transition-colors">
                      <td className="py-6 px-4 font-headline text-xl font-bold">{season.year}</td>
                      <td className="py-6 px-4 font-['Space_Grotesk'] text-sm uppercase tracking-wider">{season.team}</td>
                      <td className="py-6 px-4">
                        <span className={`inline-flex items-center justify-center w-10 h-10 font-bold ${season.position === 1 ? 'text-[#000] bg-[#FFD700]' : season.position <= 3 ? 'text-white bg-on-surface-variant' : 'text-on-surface-variant bg-transparent'}`}>
                          {season.position}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right font-mono text-sm">{season.points}</td>
                      <td className="py-6 px-4 text-right font-mono text-sm">{season.wins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
      
      {/* Top Results Section (Current Season) */}
      {bestResults.length > 0 && (
        <section className="px-6 md:px-8 py-24 bg-surface-container relative border-t border-outline-variant/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: driver.teamColor }}>Best Performances</h2>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Current Season</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestResults.map((dr, idx) => (
                <div key={idx} className="group relative overflow-hidden aspect-[4/5] bg-surface-container-high border border-outline-variant/10">
                  <div className="absolute inset-0 bg-surface-container-lowest opacity-40 group-hover:bg-surface-container-highest transition-colors duration-700"></div>
                  <div className="absolute top-0 p-8 w-full flex justify-end">
                    <span className="font-headline text-6xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: driver.teamColor }}>P{dr.result.position}</span>
                  </div>
                  <div className="absolute bottom-0 p-8 w-full z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{dr.race.flag}</span>
                      <span className="font-label text-[10px] uppercase tracking-widest font-bold" style={{ color: driver.teamColor }}>{dr.race.country} {dr.race.flag}</span>
                    </div>
                    <h4 className="font-headline text-xl font-bold uppercase leading-tight">{dr.race.name}</h4>
                    <p className="font-mono text-xs text-secondary mt-2">Grid: P{dr.result.grid} / Pts: {dr.result.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Data Notice */}
      <section className="px-8 pb-32 pt-24 bg-background">
        <div className="max-w-[1600px] mx-auto text-center border-t border-outline-variant/20 pt-16">
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
            Data sourced dynamically from Jolpica F1 API
          </p>
        </div>
      </section>
    </div>
  );
}
