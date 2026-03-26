import { Link } from 'react-router-dom';
import { useDrivers } from '../hooks/useDrivers';
import { getDriverPortrait, FALLBACK_IMAGE } from '../data/driverImages';
import { getNationalityFlag } from '../data/api';
import TelemetryVisualizer from '../components/features/TelemetryVisualizer';

export default function Drivers() {
  const { drivers, loading } = useDrivers();
  return (
    <div className="pt-24 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto w-full">
      {/* Page Title Section */}
      <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">2026 Season</span>
          <h1 className="f1-heading text-5xl md:text-7xl text-white leading-tight">THE FULL GRID</h1>
          <p className="text-on-surface-variant mt-2 max-w-xl">22 drivers competing for the world championship in the most technically advanced racing series on the planet.</p>
        </div>
      </section>
      
      {/* Driver Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-16 h-1 bg-[var(--theme-accent)] animate-pulse"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {drivers.map((driver) => {
            const hexColor = driver.teamColor || '#ffffff';
            const gradientStyle = { background: `linear-gradient(to top, ${hexColor}cc, rgba(31,31,39,0.4) 40%, transparent)` };
            
            return (
              <Link key={driver.id} to={`/driver/${driver.id}`} className="group relative bg-surface-container-low overflow-hidden cursor-pointer block aspect-[4/5]">
                <div className="absolute inset-0 overflow-hidden">
                  <img className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt={`${driver.firstName} ${driver.lastName} portrait`} src={getDriverPortrait(driver.id)} />
                </div>
                {/* Dynamically applying the team color as the gradient overlay */}
                <div className="absolute inset-0" style={gradientStyle}></div>
                <div className="absolute bottom-0 p-6 w-full flex flex-col justify-end">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="font-headline font-black text-4xl leading-none drop-shadow-md" style={{ color: driver.teamColor }}>{String(driver.standingPosition).padStart(2, '0')}</p>
                      <h3 className="font-headline font-bold text-lg leading-tight uppercase text-white drop-shadow-md mt-1">{driver.firstName}<br />{driver.lastName}</h3>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 mb-4">
                    <span className="bg-surface-container-highest/80 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-white uppercase border border-white/10 shadow-sm">{driver.team}</span>
                    <span className="text-2xl drop-shadow-md grayscale group-hover:grayscale-0 transition-all">{getNationalityFlag(driver.nationality)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/20 pt-4">
                    <div className="flex flex-col">
                      <span className="font-label font-bold italic uppercase text-[0.6rem] text-white/70 tracking-widest">Points</span>
                      <span className="font-headline font-bold text-xl text-white drop-shadow-sm">{driver.seasonPoints}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-label font-bold italic uppercase text-[0.6rem] text-white/70 tracking-widest">Wins</span>
                      <span className="font-headline font-bold text-xl text-white drop-shadow-sm">{driver.seasonWins}</span>
                    </div>
                  </div>
                  <div className="h-1 w-full mt-5" style={{ backgroundColor: driver.teamColor }}></div>
                </div>
              </Link>
            );
          })}
          
          {/* Background grid fill for visual balance not required with aspect ratio cards */}

          {/* Interactive Live Telemetry Feed */}
          <TelemetryVisualizer />
        </div>
      )}
      
    </div>
  );
}
