import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchConstructorProfile, type ConstructorProfileData, type ConstructorSeasonRecord, getNationalityFlag } from '../data/api';
import { getDriverPortrait } from '../data/driverImages';
import { getConstructorSpecs } from '../data/constructorDetails';
import { useSettings } from '../context/SettingsContext';
import DataState from '../components/ui/DataState';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

function StatBox({ label, value, color, large }: { label: string; value: string | number; color?: string; large?: boolean }) {
  return (
    <div className="p-8 border border-outline-variant/10 bg-surface-container-low flex flex-col gap-3 group hover:bg-surface-container transition-colors">
      <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant">{label}</span>
      <span
        className={`font-headline font-black italic leading-none ${large ? 'text-6xl' : 'text-5xl'}`}
        style={{ color: color || 'white' }}
      >
        {value}
      </span>
    </div>
  );
}

export default function ConstructorProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ConstructorProfileData | null>(null);
  useDocumentMeta(profile ? `${profile.name} Profile` : 'Team Profile', 'Official Formula 1 constructor profile, history, and statistics.');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  const glass = settings.glassMorphism;

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    fetchConstructorProfile(id)
      .then((data) => {
        if (mounted) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20 pb-20 flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-1 bg-primary-container animate-pulse"></div>
          <span className="font-label text-xs text-on-surface-variant uppercase tracking-widest">Loading team data…</span>
        </div>
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

  if (!profile) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <DataState type="not-found" actionLink="/constructors" actionText="Return to Constructors" />
      </div>
    );
  }

  const teamColor = profile.color || '#66FCF1';
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative z-10 pt-20 w-full">

      {/* ─── Hero with Real Team Car Image ─── */}
      <section className="relative h-[85vh] min-h-[720px] flex flex-col justify-end pb-20 overflow-hidden border-b border-white/10">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          {profile.heroImage && (
            <img
              src={profile.heroImage}
              alt={`${profile.name} F1 car`}
              className="w-full h-full object-cover object-center"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {/* Overlay gradients */}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, var(--md-sys-color-background) 0%, transparent 40%), linear-gradient(to right, var(--md-sys-color-background) 0%, transparent 60%)` }}></div>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 55% 20%, ${teamColor}25 0%, transparent 65%)` }}></div>
          <div className="absolute inset-0 bg-background/40"></div>
        </div>

        <div className="relative z-10 w-full px-8 max-w-[1600px] mx-auto">
          {/* Meta row */}
          <div className="flex items-center gap-6 mb-8">
            <span className="font-headline font-black text-[8rem] md:text-[10rem] opacity-15 italic leading-none select-none" style={{ color: teamColor }}>
              {String(profile.currentSeason.position).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
              <span className="font-label text-xs tracking-[0.3em] uppercase text-on-surface-variant">
                {profile.nationality} Constructor {getNationalityFlag(profile.nationality)}
              </span>
              <span className="font-mono text-[10px] bg-white/5 border border-white/10 px-3 py-1 w-max text-white uppercase tracking-widest">
                {profile.constructorId.toUpperCase().replace(/_/g, ' ')}
              </span>
              {profile.wikiUrl && (
                <a
                  href={profile.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-label uppercase tracking-widest text-primary hover:underline w-max mt-1"
                >
                  Wikipedia <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mb-10">
            {getConstructorSpecs(profile.constructorId).logo && (
              <div className="bg-white/95 p-3 rounded-2xl shadow-xl flex items-center justify-center border border-white/20">
                <img src={getConstructorSpecs(profile.constructorId).logo} alt={`${profile.name} Logo`} className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
              </div>
            )}
            <h1 className="font-headline text-5xl md:text-[7rem] font-black italic uppercase leading-[0.85] tracking-tighter max-w-5xl">
              {profile.name}
            </h1>
          </div>

          {/* Hero quick-stats */}
          <div className="flex flex-wrap gap-10 mt-8 pt-8 border-t border-white/10">
            {[
              { label: `${currentYear} Points`, value: profile.currentSeason.points },
              { label: `${currentYear} Wins`, value: profile.currentSeason.wins },
              { label: 'Championships', value: profile.careerChampionships },
              { label: 'All-Time Wins', value: profile.careerWins },
              { label: 'Seasons', value: profile.careerSeasons },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="block font-label text-[10px] uppercase tracking-widest mb-1 text-on-surface-variant">{label}</span>
                <span className="font-headline text-4xl font-black italic" style={{ color: teamColor }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Team Information Panel ─── */}
      <section className={`px-6 md:px-8 py-20 border-b border-outline-variant/10 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-surface-container'}`}>
        <div className="max-w-[1600px] mx-auto">
          <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6 mb-12" style={{ borderColor: teamColor }}>
            Team Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Team Principal */}
            {profile.teamPrincipal && (
              <div className="p-8 bg-surface-container-low border border-outline-variant/10">
                <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: teamColor }}>person</span>
                <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-2">Team Principal</span>
                <span className="font-headline text-xl font-bold text-white">{profile.teamPrincipal}</span>
              </div>
            )}
            {/* Team Base */}
            {profile.teamBase && (
              <div className="p-8 bg-surface-container-low border border-outline-variant/10">
                <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: teamColor }}>location_on</span>
                <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-2">Team Base</span>
                <span className="font-headline text-xl font-bold text-white">{profile.teamBase}</span>
              </div>
            )}
            {/* First Entry */}
            {profile.firstEntry > 0 && (
              <div className="p-8 bg-surface-container-low border border-outline-variant/10">
                <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: teamColor }}>flag</span>
                <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-2">First Entry</span>
                <span className="font-headline text-xl font-bold text-white">{profile.firstEntry}</span>
              </div>
            )}
            {/* Nationality */}
            <div className="p-8 bg-surface-container-low border border-outline-variant/10">
              <span className="material-symbols-outlined text-2xl mb-4 block" style={{ color: teamColor }}>public</span>
              <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-2">Nationality</span>
              <span className="font-headline text-xl font-bold text-white">{profile.nationality} {getNationalityFlag(profile.nationality)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── All-Time Career Statistics ─── */}
      <section className={`px-6 md:px-8 py-20 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-surface-container-low'}`}>
        <div className="max-w-[1600px] mx-auto">
          <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6 mb-4" style={{ borderColor: teamColor }}>
            All-Time Record
          </h2>
          <span className="block pl-7 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em] mb-12">Official FIA Statistics</span>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatBox label="World Titles" value={profile.careerChampionships} color={profile.careerChampionships > 0 ? '#FFD700' : undefined} large />
            <StatBox label="Race Wins" value={profile.careerWins} color={teamColor} large />
            <StatBox label="Podiums" value={profile.careerPodiums} />
            <StatBox label="Pole Positions" value={profile.careerPoles} />
            <StatBox label="Seasons" value={profile.careerSeasons} />
            <StatBox label="First Entry" value={profile.firstEntry > 0 ? profile.firstEntry : '—'} />
          </div>
        </div>
      </section>

      {/* ─── Current Season Stats Grid ─── */}
      <section className={`px-6 md:px-8 py-20 border-t border-outline-variant/10 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-background'}`}>
        <div className="max-w-[1600px] mx-auto">
          <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6 mb-12" style={{ borderColor: teamColor }}>
            {currentYear} Season
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Championship Position" value={`P${profile.currentSeason.position}`} color={teamColor} />
            <StatBox label="Points Scored" value={profile.currentSeason.points} />
            <StatBox label="Race Victories" value={profile.currentSeason.wins} />
            <StatBox label="Active Drivers" value={profile.currentSeason.drivers.length} />
          </div>
        </div>
      </section>

      {/* ─── Driver Lineup (Current) ─── */}
      <section className={`px-6 md:px-8 py-24 border-t border-outline-variant/10 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-surface-container'}`}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-12">
            <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: teamColor }}>Driver Lineup</h2>
            <span className="block mt-2 pl-7 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Current Season</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {profile.currentSeason.drivers.length > 0 ? (
              profile.currentSeason.drivers.map(d => (
                <Link
                  to={`/driver/${d.driverId}`}
                  key={d.driverId}
                  className="group relative block bg-surface-container-low border border-outline-variant/20 hover:border-white/40 transition-all duration-500 h-[550px] overflow-hidden"
                >
                  {/* Driver portrait */}
                  <div className="absolute right-0 bottom-0 w-2/3 h-[115%] z-0">
                    <img
                      src={getDriverPortrait(d.driverId)}
                      alt={`${d.givenName} ${d.familyName}`}
                      className="w-full h-full object-cover object-bottom opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0 origin-bottom"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="absolute left-0 top-0 w-full h-full p-10 flex flex-col justify-between z-10 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent">
                    <span className="font-headline text-[7rem] font-black italic leading-none opacity-10 select-none" style={{ color: teamColor }}>{d.code}</span>
                    <div>
                      <h3 className="font-headline text-5xl font-black italic uppercase leading-[0.9] tracking-tighter text-white mb-2">
                        {d.givenName}<br />
                        <span style={{ color: teamColor }}>{d.familyName}</span>
                      </h3>
                      <div className="mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform w-max text-white">
                        <span className="text-[10px] font-bold italic uppercase tracking-widest">View Profile</span>
                        <span className="material-symbols-outlined text-sm" style={{ color: teamColor }}>arrow_forward_ios</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-on-surface-variant font-mono text-sm">No driver data available for current season.</div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Previous Season ─── */}
      {profile.previousSeason && (
        <section className={`px-6 md:px-8 py-24 border-t border-outline-variant/10 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-background'}`}>
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12">
              <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: teamColor }}>{profile.previousSeason.year} Season</h2>
              <span className="block mt-2 pl-7 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Previous Season Recap</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Previous season stats */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <StatBox label="Final Position" value={`P${profile.previousSeason.position}`} color={teamColor} />
                <StatBox label="Total Points" value={profile.previousSeason.points} />
                <div className="col-span-2">
                  <StatBox label="Race Wins" value={profile.previousSeason.wins} />
                </div>
              </div>

              {/* Previous drivers */}
              <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant/10 p-10">
                <span className="font-label text-[10px] tracking-widest uppercase text-on-surface-variant block mb-8">{profile.previousSeason.year} Driver Lineup</span>
                <div className="flex flex-col md:flex-row gap-6">
                  {profile.previousSeason.drivers.map((d, idx) => (
                    <div key={idx} className="flex-1 flex gap-5 items-center bg-surface p-5 border border-outline-variant/5">
                      <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: teamColor }}>
                        <img
                          src={getDriverPortrait(d.driverId)}
                          alt={d.familyName}
                          className="w-full h-full object-cover object-top grayscale"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'; }}
                        />
                      </div>
                      <div>
                        <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant block">{d.code}</span>
                        <span className="font-headline text-xl font-bold uppercase italic mt-1 block">{d.givenName} {d.familyName}</span>
                      </div>
                    </div>
                  ))}
                  {profile.previousSeason.drivers.length === 0 && (
                    <p className="text-on-surface-variant text-sm font-mono">Driver data unavailable for this season.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Season History Table ─── */}
      {profile.seasonHistory.length > 0 && (
        <section className={`px-6 md:px-8 py-24 border-t border-outline-variant/10 ${glass ? 'bg-transparent backdrop-blur-[2px]' : 'bg-surface-container-low'}`}>
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12">
              <h2 className="font-headline text-3xl font-bold uppercase tracking-widest border-l-4 pl-6" style={{ borderColor: teamColor }}>Season History</h2>
              <span className="block mt-2 pl-7 font-label text-[10px] text-on-surface-variant uppercase tracking-[0.5em]">Last {profile.seasonHistory.length} Seasons</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    {['Year', 'Position', 'Points', 'Wins', 'Actions'].map(h => (
                      <th key={h} className={`py-5 px-4 font-label text-[10px] uppercase tracking-widest text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {(profile.seasonHistory as ConstructorSeasonRecord[]).map((s) => (
                    <tr key={s.year} className="group hover:bg-surface-container transition-colors">
                      <td className="py-5 px-4 font-headline text-xl font-bold text-white">{s.year}</td>
                      <td className="py-5 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 font-bold text-sm ${
                            s.position === 1 ? 'bg-[#FFD700] text-black' :
                            s.position <= 3 ? 'bg-white/20 text-white' :
                            'text-on-surface-variant'
                          }`}
                        >
                          {s.position}
                        </span>
                      </td>
                      <td className="py-5 px-4 font-mono text-sm text-white/80">{s.points}</td>
                      <td className="py-5 px-4 font-mono text-sm" style={{ color: s.wins > 0 ? teamColor : 'rgba(255,255,255,0.4)' }}>
                        {s.wins > 0 ? s.wins : '—'}
                      </td>
                      <td className="py-5 px-4 text-right">
                        <Link 
                          to={`/constructor/${profile.constructorId}/season/${s.year}`}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-container-high transition-all font-label text-[10px] uppercase tracking-widest"
                          style={{ color: teamColor }}
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Footer notice */}
      <section className="px-6 md:px-8 pb-24 pt-16 bg-background border-t border-outline-variant/10">
        <div className="max-w-[1600px] mx-auto text-center">
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
            Data sourced from Jolpica F1 API &amp; Official FIA Records
          </p>
        </div>
      </section>
    </div>
  );
}
