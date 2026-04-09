import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchConstructorSeasonDetails, ConstructorSeasonDetailsData } from '../data/api';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const StatBox = ({ label, value, color = '#66FCF1', glass = false }: { label: string; value: string | number; color?: string; glass?: boolean }) => (
  <div className={`border p-6 backdrop-blur-sm relative overflow-hidden group ${glass ? 'bg-black/10 border-white/20 rounded-2xl shadow-lg' : 'bg-surface-container-low border-outline-variant/10'}`}>
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent transform rotate-45 translate-x-8 -translate-y-8" />
    <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-2">{label}</span>
    <span className="font-headline text-4xl font-bold" style={{ color }}>{value}</span>
  </div>
);

function ConstructorSeasonDetails() {
  const { id, year } = useParams<{ id: string; year: string }>();
  const [details, setDetails] = useState<ConstructorSeasonDetailsData | null>(null);
  useDocumentMeta(details ? `${details.name} – ${details.year} Season` : 'Season Data', 'Detailed performance telemetry for F1 constructors across historical seasons.');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  useEffect(() => {
    async function loadData() {
      if (id && year) {
        setLoading(true);
        try {
          const data = await fetchConstructorSeasonDetails(id, year);
          setDetails(data);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [id, year]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-on-surface-variant/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="error" onAction={() => window.location.reload()} />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState 
          type="not-found" 
          title="NO SEASON DATA"
          message="We couldn't find statistics for this constructor in the selected year."
          actionLink={`/constructor/${id}`} 
          actionText="RETURN TO PROFILE" 
        />
      </div>
    );
  }

  // Generate a fallback background or use the heroImage if available
  const heroStyle = details.heroImage ? {
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 80%, #0B0E14 100%), url(${details.heroImage})`,
    } : {
      background: `linear-gradient(45deg, #0B0E14 0%, ${details.color}40 100%)`
  };

  return (
    <div className="min-h-screen pb-16">
      {/* ─── Hero Section ─── */}
      <section 
        className="relative pt-32 pb-24 px-6 md:px-8 min-h-[50vh] flex flex-col justify-end bg-cover bg-center"
        style={heroStyle}
      >
        <Link to={`/constructor/${id}`} className={`absolute top-24 left-6 md:left-8 flex items-center gap-2 text-on-surface hover:text-white transition-colors text-sm font-label uppercase tracking-widest z-10 p-2 border ${glass ? 'bg-black/40 backdrop-blur-md border-white/20 rounded-xl' : 'bg-black/40 backdrop-blur-sm border-white/10'}`}>
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Profile
        </Link>
        
        <div className="max-w-[1600px] mx-auto w-full relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 backdrop-blur-sm border text-xs font-bold uppercase tracking-widest ${glass ? 'bg-black/40 border-white/20 rounded-lg' : 'bg-surface-container/60 border-outline-variant/20'}`}>
                  {details.year} Season
                </span>
                {details.position === 1 && (
                  <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">workspace_premium</span>
                    World Champions
                  </span>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter mb-2" style={{ color: details.color }}>
                {details.name}
              </h1>
              <p className="text-xl text-on-surface-variant font-light tracking-wide max-w-2xl">
                Season Summary and Statistics
              </p>
            </div>
            
            <div className={`flex gap-8 text-right p-6 backdrop-blur-md border ${glass ? 'bg-white/5 border-white/20 rounded-2xl' : 'bg-surface-container/40 border-white/10'}`}>
              <div>
                <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Final Position</span>
                <span className="text-4xl font-headline font-bold text-white">P{details.position}</span>
              </div>
              <div className="w-px bg-white/10"></div>
              <div>
                <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Total Points</span>
                <span className="text-4xl font-headline font-bold text-white">{details.points}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content Grid ─── */}
      <section className="px-6 md:px-8 mt-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-4 space-y-12">
            <div>
              <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 pl-4 mb-6" style={{ borderColor: details.color }}>Team Details {details.year}</h2>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                  <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Team Principal</span>
                  <span className="font-bold text-right">{details.teamPrincipal}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                  <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Race Wins</span>
                  <span className="font-bold text-right">{details.wins}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                  <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Total Points</span>
                  <span className="font-bold text-right">{details.points}</span>
                </div>
                 <div className="flex justify-between items-center py-4 border-b border-outline-variant/10">
                  <span className="text-sm font-label uppercase tracking-widest text-on-surface-variant">Ranking</span>
                  <span className="font-bold text-right">P{details.position}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drivers */}
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 pl-4" style={{ borderColor: details.color }}>Main Driver Lineup</h2>
              <span className="block mt-2 pl-5 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Final Standings Contribution</span>
            </div>

            <div className="space-y-4">
              {details.drivers.sort((a,b) => a.position - b.position).map((driver, idx) => (
                <div key={driver.driverId} className={`group border transition-all duration-300 relative overflow-hidden ${glass ? 'bg-black/10 backdrop-blur-md border-white/20 rounded-2xl hover:bg-black/20' : 'bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/30'}`}>
                   {/* Driver Accent Bar */}
                   <div 
                    className="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: details.color }}
                  />
                  
                  <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="text-5xl font-black font-headline text-on-surface-variant/20 italic w-16 text-center">
                        {idx + 1}
                      </div>
                      
                      <div>
                        {driver.code && (
                           <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded inline-block mb-2 uppercase tracking-widest">
                            {driver.code}
                          </span>
                        )}
                        <h3 className="text-xl md:text-2xl font-headline font-bold uppercase tracking-wide">
                          <span className="font-light text-on-surface-variant mr-2">{driver.givenName}</span>
                          {driver.familyName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 w-full md:w-auto justify-start md:justify-end border-t border-outline-variant/10 md:border-t-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Final Position</span>
                        <span className="text-2xl font-headline font-bold">P{driver.position}</span>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Points</span>
                        <span className="text-2xl font-headline font-bold">{driver.points}</span>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">Wins</span>
                        <span className="text-2xl font-headline font-bold" style={{ color: driver.wins > 0 ? '#D4AF37' : 'inherit' }}>
                          {driver.wins}
                        </span>
                      </div>
                       <Link to={`/driver/${driver.driverId}`} className="hidden lg:flex w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high items-center justify-center transition-colors group-hover:translate-x-2">
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default ConstructorSeasonDetails;
