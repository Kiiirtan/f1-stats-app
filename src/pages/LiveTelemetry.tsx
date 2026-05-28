import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveStore } from '../store/useLiveStore';
import { TEAM_COLORS, getTeamColor } from '../data/api';
import { RaceControlMsg } from '../services/liveApi';
import TelemetryHUD from '../components/features/TelemetryHUD';
import TelemetryChart from '../components/features/TelemetryChart';
import LiveLeaderboard from '../components/features/LiveLeaderboard';
import LiveCommentary from '../components/features/LiveCommentary';

interface RaceResultData {
  position: number;
  number: string;
  driverCode: string;
  driverName: string;
  team: string;
  teamId: string;
  grid: number;
  laps: number;
  status: string;
  points: number;
  time: string;
  fastestLap?: string;
  isFastest: boolean;
}

interface QualifyingResultData {
  position: number;
  number: string;
  driverCode: string;
  driverName: string;
  team: string;
  teamId: string;
  q1: string;
  q2?: string;
  q3?: string;
}

// Commentary icon/color helper
function parseCommentary(msg: RaceControlMsg) {
  let text = msg.message;
  let icon = '💬';
  let color = 'text-white';
  let bg = 'bg-white/5';

  const raw = text.toUpperCase();

  if (raw.includes('INVESTIGATED') || raw.includes('INVESTIGATION')) {
    icon = '⚖️';
    color = 'text-orange-400';
    bg = 'bg-orange-500/10';
    text = text.replace(/CAR (\d+) \([^)]+\)/g, 'Car $1'); // Cleanup "CAR 1 (VER)" to "Car 1"
  } else if (raw.includes('PENALTY')) {
    icon = '🛑';
    color = 'text-red-400';
    bg = 'bg-red-500/10';
  } else if (raw.includes('DRS ENABLED')) {
    icon = '🟢';
    color = 'text-green-400';
    bg = 'bg-green-500/10';
    text = "DRS Enabled! The race is on.";
  } else if (raw.includes('FASTEST LAP')) {
    icon = '⏱️';
    color = 'text-purple-400';
    bg = 'bg-purple-500/10';
  } else if (raw.includes('SAFETY CAR')) {
    icon = '🚨';
    color = 'text-yellow-400';
    bg = 'bg-yellow-500/10';
  } else if (msg.flag === 'YELLOW') {
    icon = '🟨';
    color = 'text-yellow-400';
    bg = 'bg-yellow-500/10';
  } else if (msg.flag === 'RED') {
    icon = '🟥';
    color = 'text-red-500';
    bg = 'bg-red-500/10';
  } else if (msg.flag === 'GREEN') {
    icon = '🟩';
    color = 'text-green-400';
    bg = 'bg-green-500/10';
  }

  return { text, icon, color, bg };
}

export default function LiveTelemetry() {
  const { connect, disconnect, isActive, selectedDriver, setSelectedDriver, commentary } = useLiveStore();
  const [activeDrivers, setActiveDrivers] = useState<{num: number, name: string, team: string}[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{name: string, status: string, isLive: boolean, error?: string}>({ 
    name: 'CONNECTING TO OPENF1...', 
    status: 'OFFLINE', 
    isLive: false 
  });

  // Offline Results states
  const [offlineLoading, setOfflineLoading] = useState(false);
  const [offlineError, setOfflineError] = useState<string | null>(null);
  const [raceResults, setRaceResults] = useState<RaceResultData[]>([]);
  const [qualyResults, setQualyResults] = useState<QualifyingResultData[]>([]);
  const [historicalCommentary, setHistoricalCommentary] = useState<RaceControlMsg[]>([]);

  // UI state for offline tabs and filters
  const [activeTab, setActiveTab] = useState<'race' | 'qualy'>('race');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentaryFilter, setCommentaryFilter] = useState<'all' | 'flags' | 'penalties' | 'drs' | 'radio'>('all');

  // Fetch active drivers and initial session info
  useEffect(() => {
    let mounted = true;
    
    // Fetch Session Info
    fetch('https://api.openf1.org/v1/sessions?session_key=latest')
      .then(res => {
        if (res.status === 429) throw new Error('API Rate Limited (Too Many Requests). Please wait a few minutes.');
        if (!res.ok) throw new Error('Connection Failed');
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const session = data[data.length - 1];
          // Determine if session is actually happening right now
          let currentlyLive = false;
          if (session.date_start && session.date_end && !session.is_cancelled) {
            const now = Date.now();
            const start = new Date(session.date_start).getTime() - (15 * 60 * 1000); // 15 mins before
            // If the scheduled end has passed, add a buffer to account for delays based on session type.
            let bufferHours = session.session_type === 'Race' ? 3 : 1.5; 
            const endOffset = new Date(session.date_start).getTime() + (bufferHours * 60 * 60 * 1000); 
            
            if (now >= start && now <= endOffset) {
               currentlyLive = true;
            }
          }

          setSessionInfo(prev => ({ 
             ...prev, 
             name: `${session.session_name} - ${session.location}${session.is_cancelled ? ' (CANCELLED)' : ''}`,
             status: session.is_cancelled ? 'CANCELLED' : (currentlyLive ? 'GREEN' : 'FINISHED'),
             isLive: currentlyLive,
             error: undefined
          }));
        }
      })
      .catch(err => {
        if (mounted) setSessionInfo(prev => ({ ...prev, name: 'OFFLINE', isLive: false, error: err.message }));
      });

    // Fetch Drivers
    fetch('https://api.openf1.org/v1/drivers?session_key=latest')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch drivers');
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const drivers = data.map((d: any) => ({
            num: d.driver_number,
            name: d.full_name,
            team: d.team_name
          }));
          setActiveDrivers(drivers);
          
          const currentSelected = useLiveStore.getState().selectedDriver;
          if (drivers.length > 0 && !currentSelected) {
             useLiveStore.getState().setSelectedDriver(drivers[0].num);
          }
        }
      })
      .catch(console.error);
      
      return () => { mounted = false; };
  }, []);

  // Fetch historical data when track is offline/completed
  useEffect(() => {
    if (sessionInfo.name === 'CONNECTING TO OPENF1...') return;
    if (sessionInfo.isLive) return;

    let mounted = true;
    setOfflineLoading(true);
    setOfflineError(null);

    Promise.all([
      fetch('https://api.jolpi.ca/ergast/f1/current/last/results.json')
        .then(res => res.json())
        .catch(err => { console.warn("Failed to fetch last race results:", err); return null; }),
      fetch('https://api.jolpi.ca/ergast/f1/current/last/qualifying.json')
        .then(res => res.json())
        .catch(err => { console.warn("Failed to fetch last qualifying results:", err); return null; }),
      fetch('https://api.openf1.org/v1/race_control?session_key=latest')
        .then(res => res.json())
        .catch(err => { console.warn("Failed to fetch race control logs:", err); return null; })
    ]).then(([raceData, qualyData, commentaryData]) => {
      if (!mounted) return;

      let parsedRace: RaceResultData[] = [];
      if (raceData?.MRData?.RaceTable?.Races?.[0]?.Results) {
        parsedRace = raceData.MRData.RaceTable.Races[0].Results.map((r: any) => ({
          position: parseInt(r.position, 10),
          number: r.number,
          driverCode: r.Driver.code || r.Driver.driverId.slice(0, 3).toUpperCase(),
          driverName: `${r.Driver.givenName.charAt(0)}. ${r.Driver.familyName}`,
          team: r.Constructor.name,
          teamId: r.Constructor.constructorId,
          grid: parseInt(r.grid, 10),
          laps: parseInt(r.laps, 10),
          status: r.status,
          points: parseFloat(r.points),
          time: r.Time?.time || r.status,
          fastestLap: r.FastestLap?.Time?.time,
          isFastest: r.FastestLap?.rank === "1"
        }));
      }

      let parsedQualy: QualifyingResultData[] = [];
      if (qualyData?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults) {
        parsedQualy = qualyData.MRData.RaceTable.Races[0].QualifyingResults.map((r: any) => ({
          position: parseInt(r.position, 10),
          number: r.number,
          driverCode: r.Driver.code || r.Driver.driverId.slice(0, 3).toUpperCase(),
          driverName: `${r.Driver.givenName.charAt(0)}. ${r.Driver.familyName}`,
          team: r.Constructor.name,
          teamId: r.Constructor.constructorId,
          q1: r.Q1,
          q2: r.Q2,
          q3: r.Q3
        }));
      }

      setRaceResults(parsedRace);
      setQualyResults(parsedQualy);
      if (Array.isArray(commentaryData)) {
        setHistoricalCommentary(commentaryData);
      }
      setOfflineLoading(false);
    }).catch(err => {
      if (mounted) {
        setOfflineError("Failed to load historical session details.");
        setOfflineLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [sessionInfo.isLive, sessionInfo.name]);

  // Derive flag color from commentary ONLY in live mode
  useEffect(() => {
    if (sessionInfo.isLive && commentary.length > 0) {
      const latestFlags = commentary.filter(c => c.category === 'Flag' || !!c.flag);
      if (latestFlags.length > 0) {
         setSessionInfo(prev => ({ ...prev, status: latestFlags[0].flag || 'GREEN' }));
      }
    }
  }, [commentary, sessionInfo.isLive]);

  // Handle live store subscription only if the session is currently live
  useEffect(() => {
    if (sessionInfo.isLive) {
      connect();
      return () => {
        disconnect(); 
      };
    }
  }, [connect, disconnect, sessionInfo.isLive]);

  // Status Banner colors
  const flagColor = sessionInfo.status.includes('RED') ? 'bg-red-500' : 
                    sessionInfo.status.includes('YELLOW') ? 'bg-yellow-400 text-black' : 
                    'bg-green-500';

  // Extract highlight stats
  const winner = raceResults.find(r => r.position === 1);
  const pole = qualyResults.find(q => q.position === 1);
  const fastest = raceResults.find(r => r.isFastest);
  const totalLaps = winner?.laps || 68;

  // Commentary filtering logic
  const filteredCommentary = historicalCommentary.filter(msg => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = msg.message.toLowerCase();
      const matchLap = msg.lap_number?.toString() === q;
      if (!matchText.includes(q) && !matchLap) return false;
    }

    if (commentaryFilter === 'flags') {
      return msg.category === 'Flag' || !!msg.flag;
    }
    if (commentaryFilter === 'penalties') {
      const m = msg.message.toUpperCase();
      return m.includes('INVESTIGAT') || m.includes('PENALTY') || m.includes('REPRIMAND') || m.includes('WARNING');
    }
    if (commentaryFilter === 'drs') {
      return msg.message.toUpperCase().includes('DRS');
    }
    if (commentaryFilter === 'radio') {
      return msg.message.toUpperCase().includes('RADIO');
    }
    return true; // 'all'
  });

  return (
    <div className="pt-24 min-h-screen px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto mb-20">
      
      {/* Global Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col md:flex-row items-center justify-between bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-lg"
      >
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={`w-3 h-3 rounded-full ${sessionInfo.isLive ? 'animate-pulse' : ''} ${flagColor}`} />
          <h1 className="text-xl font-display font-bold text-white tracking-tight uppercase">
            {sessionInfo.name}
          </h1>
          {isActive && !sessionInfo.error && (
             <span className="text-xs font-mono uppercase tracking-widest font-bold border px-2 py-1 rounded text-red-400 border-red-500/30 bg-red-500/10">
               Live Data
             </span>
          )}
          {!sessionInfo.isLive && sessionInfo.name !== 'CONNECTING TO OPENF1...' && (
             <span className="text-xs font-mono uppercase tracking-widest font-bold border px-2 py-1 rounded text-white/50 border-white/10 bg-white/5">
               Race Completed
             </span>
          )}
          {sessionInfo.error && (
             <span className="text-xs font-mono text-yellow-400 font-bold border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 rounded">
               {sessionInfo.error}
             </span>
          )}
        </div>
        
        <div className={`px-6 py-4 font-mono font-bold tracking-widest text-sm ${flagColor} ${sessionInfo.status.includes('YELLOW') ? 'text-black' : 'text-white'}`}>
           TRACK STATUS: {sessionInfo.status}
        </div>
      </motion.div>

      {/* --- LIVE MODE --- */}
      {sessionInfo.isLive && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]"
        >
          {/* Leaderboard (Scorecard) */}
          <div className="lg:col-span-3 h-full">
             <LiveLeaderboard activeDrivers={activeDrivers} />
          </div>

          {/* Commentary (Play-by-play) */}
          <div className="lg:col-span-5 h-full">
             <LiveCommentary />
          </div>

          {/* Player Focus (Telemetry & Charts) */}
          <div className="lg:col-span-4 h-full flex flex-col gap-6">
             <div className="h-2/5 shrink-0">
               <TelemetryHUD />
             </div>
             
             <div className="flex-1 shrink min-h-0 bg-surface/50 border border-white/5 rounded-2xl p-4 overflow-hidden">
                <TelemetryChart />
             </div>
          </div>
        </motion.div>
      )}

      {/* --- OFFLINE / COMPLETED MODE --- */}
      {!sessionInfo.isLive && (
        <div>
          {offlineLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-secondary/50 font-mono tracking-widest text-xs">LOADING SESSION CLASSIFICATION...</p>
            </div>
          ) : offlineError ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center max-w-md mx-auto">
              <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
              <p className="text-white font-display font-bold mb-2">{offlineError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-5 py-2.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all font-mono text-xs text-white rounded-xl uppercase tracking-wider mt-2"
              >
                Retry Fetch
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Card 1: Winner */}
                <div className="bg-surface border border-[#E10600]/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between h-32">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E10600]/20 to-transparent rounded-bl-full pointer-events-none blur-md" />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#E10600] font-bold uppercase block mb-1">RACE WINNER</span>
                    <h3 className="font-headline font-black text-2xl text-white uppercase italic truncate">
                      {winner ? winner.driverName.split('. ').pop() : 'UNKNOWN'}
                    </h3>
                    <p className="text-[11px] text-secondary font-mono tracking-wide mt-0.5">
                      {winner ? winner.team.toUpperCase() : '-'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-mono text-xs text-white/50">{winner ? winner.time : '-'}</span>
                    <span className="text-xs font-mono font-bold text-[#E10600] px-2 py-0.5 bg-[#E10600]/10 rounded border border-[#E10600]/20">
                      +{winner ? winner.points : 0} PTS
                    </span>
                  </div>
                </div>

                {/* Card 2: Pole Position */}
                <div className="bg-surface border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-32">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-bold uppercase block mb-1">POLE POSITION</span>
                    <h3 className="font-headline font-black text-2xl text-white uppercase italic truncate">
                      {pole ? pole.driverName.split('. ').pop() : 'UNKNOWN'}
                    </h3>
                    <p className="text-[11px] text-secondary font-mono tracking-wide mt-0.5">
                      {pole ? pole.team.toUpperCase() : '-'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-white/50">LAP TIME</span>
                    <span className="text-xs font-mono font-bold text-white/90 px-2 py-0.5 bg-white/5 rounded border border-white/10">
                      {pole ? (pole.q3 || pole.q2 || pole.q1) : '-'}
                    </span>
                  </div>
                </div>

                {/* Card 3: Fastest Lap */}
                <div className="bg-surface border border-purple-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-32">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full pointer-events-none blur-md" />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase block mb-1">FASTEST LAP</span>
                    <h3 className="font-headline font-black text-2xl text-white uppercase italic truncate">
                      {fastest ? fastest.driverName.split('. ').pop() : 'UNKNOWN'}
                    </h3>
                    <p className="text-[11px] text-secondary font-mono tracking-wide mt-0.5">
                      {fastest ? fastest.team.toUpperCase() : '-'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-mono text-xs text-white/50">LAP {fastest ? (raceResults.indexOf(fastest) + 1) : '-'}</span>
                    <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 bg-purple-500/10 rounded border border-purple-500/20">
                      {fastest ? fastest.fastestLap : '-'}
                    </span>
                  </div>
                </div>

                {/* Card 4: Circuit Stats */}
                <div className="bg-surface border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-32">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-bold uppercase block mb-1">RACE TRACK</span>
                    <h3 className="font-headline font-black text-2xl text-white uppercase italic truncate">
                      {sessionInfo.name.split(' - ')[1] || 'CANADA'}
                    </h3>
                    <p className="text-[11px] text-secondary font-mono tracking-wide mt-0.5 truncate">
                      {sessionInfo.name.split(' - ')[0] || 'Montreal'}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-white/50">LAPS RUN</span>
                    <span className="text-xs font-mono font-bold text-white/90 px-2 py-0.5 bg-white/5 rounded border border-white/10">
                      {totalLaps} LAPS
                    </span>
                  </div>
                </div>

              </div>

              {/* Main Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[750px]">
                
                {/* Left Side: tabbed classifications */}
                <div className="lg:col-span-7 h-full flex flex-col bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
                  
                  {/* Tabs bar */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('race')}
                        className={`px-4 py-2 font-headline font-bold text-xs uppercase tracking-widest rounded-xl transition-all border ${
                          activeTab === 'race' 
                            ? 'bg-[#E10600]/10 border-[#E10600]/30 text-white shadow-[0_0_15px_rgba(225,6,0,0.15)]' 
                            : 'border-transparent text-secondary hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Race Classification
                      </button>
                      <button
                        onClick={() => setActiveTab('qualy')}
                        className={`px-4 py-2 font-headline font-bold text-xs uppercase tracking-widest rounded-xl transition-all border ${
                          activeTab === 'qualy' 
                            ? 'bg-[#E10600]/10 border-[#E10600]/30 text-white shadow-[0_0_15px_rgba(225,6,0,0.15)]' 
                            : 'border-transparent text-secondary hover:text-white hover:bg-white/5'
                        }`}
                      >
                        Qualifying Order
                      </button>
                    </div>
                    
                    <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                      {activeTab === 'race' ? `${raceResults.length} Finishers` : `${qualyResults.length} Classified`}
                    </span>
                  </div>

                  {/* Classification list */}
                  <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    {activeTab === 'race' ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 font-mono text-[10px] text-white/30 uppercase tracking-wider">
                            <th className="pb-3 pl-3 text-center w-10">POS</th>
                            <th className="pb-3 pl-4">DRIVER</th>
                            <th className="pb-3">TEAM</th>
                            <th className="pb-3 text-center">GRID</th>
                            <th className="pb-3 text-center">LAPS</th>
                            <th className="pb-3 text-right">POINTS</th>
                            <th className="pb-3 pr-3 text-right">TIME / STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {raceResults.map((driver) => {
                            const isPodium = driver.position <= 3;
                            const podiumColor = driver.position === 1 ? 'text-yellow-400 font-bold' : 
                                                 driver.position === 2 ? 'text-gray-300 font-bold' : 
                                                 'text-amber-600 font-bold';
                            
                            return (
                              <tr 
                                key={driver.number} 
                                className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors relative"
                              >
                                {/* Position & team color strip */}
                                <td className="py-3 text-center relative">
                                  <div 
                                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r" 
                                    style={{ backgroundColor: getTeamColor(driver.teamId) }}
                                  />
                                  <span className={`font-mono text-xs ${isPodium ? podiumColor : 'text-white/60'}`}>
                                    {driver.position}
                                  </span>
                                </td>
                                
                                {/* Driver info */}
                                <td className="py-3 pl-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-white/35 w-5 text-right">{driver.number}</span>
                                    <span className="font-headline font-bold text-sm text-white tracking-wide uppercase">
                                      {driver.driverName}
                                    </span>
                                  </div>
                                </td>
                                
                                {/* Team */}
                                <td className="py-3 font-mono text-xs text-white/70">
                                  {driver.team}
                                </td>
                                
                                {/* Grid */}
                                <td className="py-3 text-center font-mono text-xs text-white/50">
                                  {driver.grid}
                                </td>
                                
                                {/* Laps */}
                                <td className="py-3 text-center font-mono text-xs text-white/50">
                                  {driver.laps}
                                </td>
                                
                                {/* Points */}
                                <td className="py-3 text-right font-mono text-xs">
                                  {driver.points > 0 ? (
                                    <span className="text-[#E10600] font-bold">+{driver.points}</span>
                                  ) : (
                                    <span className="text-white/20">0</span>
                                  )}
                                </td>

                                {/* Time/Status */}
                                <td className="py-3 pr-3 text-right font-mono text-xs">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {driver.isFastest && (
                                      <span className="text-purple-400 text-[16px] material-symbols-outlined" title={`Fastest Lap: ${driver.fastestLap}`}>
                                        timer
                                      </span>
                                    )}
                                    <span className={driver.status === 'Finished' ? 'text-white/80' : 'text-white/40'}>
                                      {driver.time}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 font-mono text-[10px] text-white/30 uppercase tracking-wider">
                            <th className="pb-3 pl-3 text-center w-10">POS</th>
                            <th className="pb-3 pl-4">DRIVER</th>
                            <th className="pb-3">TEAM</th>
                            <th className="pb-3 text-center">Q1</th>
                            <th className="pb-3 text-center">Q2</th>
                            <th className="pb-3 pr-3 text-right">Q3</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qualyResults.map((driver) => {
                            const isPodium = driver.position <= 3;
                            const podiumColor = driver.position === 1 ? 'text-yellow-400 font-bold' : 
                                                 driver.position === 2 ? 'text-gray-300 font-bold' : 
                                                 'text-amber-600 font-bold';

                            return (
                              <tr 
                                key={driver.number} 
                                className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors relative"
                              >
                                {/* Position & team color strip */}
                                <td className="py-3 text-center relative">
                                  <div 
                                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r" 
                                    style={{ backgroundColor: getTeamColor(driver.teamId) }}
                                  />
                                  <span className={`font-mono text-xs ${isPodium ? podiumColor : 'text-white/60'}`}>
                                    {driver.position}
                                  </span>
                                </td>

                                {/* Driver */}
                                <td className="py-3 pl-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-white/35 w-5 text-right">{driver.number}</span>
                                    <span className="font-headline font-bold text-sm text-white tracking-wide uppercase">
                                      {driver.driverName}
                                    </span>
                                  </div>
                                </td>

                                {/* Team */}
                                <td className="py-3 font-mono text-xs text-white/70">
                                  {driver.team}
                                </td>

                                {/* Q1 */}
                                <td className="py-3 text-center font-mono text-xs text-white/50">
                                  {driver.q1 || '-'}
                                </td>

                                {/* Q2 */}
                                <td className="py-3 text-center font-mono text-xs text-white/50">
                                  {driver.q2 || '-'}
                                </td>

                                {/* Q3 */}
                                <td className="py-3 pr-3 text-right font-mono text-xs text-white/90 font-bold">
                                  {driver.q3 || '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}

                    {raceResults.length === 0 && qualyResults.length === 0 && (
                      <div className="text-center py-20 font-mono text-white/20 text-sm">
                        No classification records found for this session.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: historical search commentary */}
                <div className="lg:col-span-5 h-full flex flex-col bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
                  
                  {/* Commentary controls */}
                  <div className="p-4 border-b border-white/5 bg-white/5 flex flex-col gap-3">
                    <h3 className="font-mono text-sm tracking-widest text-secondary font-bold">RACE TIMELINE</h3>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-white/30 material-symbols-outlined text-[18px]">
                        search
                      </span>
                      <input 
                        type="text"
                        placeholder="Search timeline (e.g. Norris, Yellow, Lap 1)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                      {[
                        { key: 'all', label: 'All' },
                        { key: 'flags', label: 'Flags' },
                        { key: 'penalties', label: 'Penalties' },
                        { key: 'drs', label: 'DRS' },
                        { key: 'radio', label: 'Radio' }
                      ].map(pill => (
                        <button
                          key={pill.key}
                          onClick={() => setCommentaryFilter(pill.key as any)}
                          className={`px-3 py-1 font-mono text-[10px] font-bold rounded-lg border transition-all shrink-0 ${
                            commentaryFilter === pill.key 
                              ? 'bg-white text-black border-white shadow'
                              : 'bg-transparent text-secondary border-white/5 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {pill.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable commentary stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {filteredCommentary.map((msg, i) => {
                      const parsed = parseCommentary(msg);
                      const date = new Date(msg.date);
                      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                      return (
                        <div key={msg.date + i} className="flex gap-4">
                          <div className="flex flex-col items-center gap-1 pt-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${parsed.bg} ${parsed.color}`}>
                              {parsed.icon}
                            </div>
                            {i !== filteredCommentary.length - 1 && <div className="w-[1px] flex-1 bg-white/10 my-1" />}
                          </div>
                          
                          <div className="flex-1 pb-2 border-b border-white/[0.02]">
                            <div className="flex gap-2 items-baseline mb-1">
                              <span className="font-mono text-[10px] text-white/40">{timeStr}</span>
                              {msg.lap_number && (
                                <span className="font-mono text-[9px] bg-white/10 text-white px-2 py-0.5 rounded-full">
                                  Lap {msg.lap_number}
                                </span>
                              )}
                            </div>
                            <p className="text-white/80 text-xs leading-relaxed">{parsed.text}</p>
                          </div>
                        </div>
                      );
                    })}

                    {filteredCommentary.length === 0 && (
                      <div className="text-center py-20 font-mono text-white/20 text-xs border border-dashed border-white/5 rounded-xl">
                        No events found matching filters.
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
