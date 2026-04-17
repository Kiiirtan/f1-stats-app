import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLiveStore } from '../store/useLiveStore';
import TelemetryHUD from '../components/features/TelemetryHUD';
import TelemetryChart from '../components/features/TelemetryChart';
import LiveLeaderboard from '../components/features/LiveLeaderboard';
import LiveCommentary from '../components/features/LiveCommentary';

export default function LiveTelemetry() {
  const { connect, disconnect, isActive, selectedDriver, setSelectedDriver, commentary } = useLiveStore();
  const [activeDrivers, setActiveDrivers] = useState<{num: number, name: string, team: string}[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{name: string, status: string, isLive: boolean, error?: string}>({ name: 'CONNECTING TO OPENF1...', status: 'OFFLINE', isLive: false });

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

  // Derive global flag from latest commentary if it exists
  useEffect(() => {
    if (commentary.length > 0) {
      const latestFlags = commentary.filter(c => c.category === 'Flag' || !!c.flag);
      if (latestFlags.length > 0) {
         setSessionInfo(prev => ({ ...prev, status: latestFlags[0].flag || 'GREEN' }));
      }
    }
  }, [commentary]);

  useEffect(() => {
    connect();
    return () => {
      disconnect(); 
    };
  }, [connect, disconnect]);

  // Status Banner colors
  const flagColor = sessionInfo.status.includes('RED') ? 'bg-red-500' : 
                    sessionInfo.status.includes('YELLOW') ? 'bg-yellow-400 text-black' : 
                    'bg-green-500';

  return (
    <div className="pt-24 min-h-screen px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto mb-20">
      
      {/* Global Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col md:flex-row items-center justify-between bg-surface border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center gap-4 px-6 py-4">
          <div className={`w-3 h-3 rounded-full ${sessionInfo.isLive ? 'animate-pulse' : ''} ${flagColor}`} />
          <h1 className="text-xl font-display font-bold text-white tracking-tight uppercase">
            {sessionInfo.name}
          </h1>
          {isActive && !sessionInfo.error && (
             <span className={`text-xs font-mono uppercase tracking-widest font-bold border px-2 py-1 rounded ${sessionInfo.isLive ? 'text-red-400 border-red-500/30 bg-red-500/10' : 'text-gray-400 border-gray-500/30 bg-gray-500/10'}`}>
               {sessionInfo.isLive ? 'Live Data' : 'Replay Data'}
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

      {/* Main 3-Column Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]"
      >
        {/* Column 1: Leaderboard (Scorecard) */}
        <div className="lg:col-span-3 h-full">
           <LiveLeaderboard activeDrivers={activeDrivers} />
        </div>

        {/* Column 2: Commentary (Play-by-play) */}
        <div className="lg:col-span-5 h-full">
           <LiveCommentary />
        </div>

        {/* Column 3: Player Focus (Telemetry & Charts) */}
        <div className="lg:col-span-4 h-full flex flex-col gap-6">
           <div className="h-2/5 shrink-0">
             <TelemetryHUD />
           </div>
           
           <div className="flex-1 shrink min-h-0 bg-surface/50 border border-white/5 rounded-2xl p-4 overflow-hidden">
              <TelemetryChart />
           </div>
        </div>
      </motion.div>
    </div>
  );
}
