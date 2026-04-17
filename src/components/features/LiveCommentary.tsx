import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveStore } from '../../store/useLiveStore';
import { RaceControlMsg } from '../../services/liveApi';

// A lightweight parser to give dry FIA messages a "Cricbuzz" sports commentary flavor
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
  } else if (msg.flag === 'YELLOW') {
    icon = '🟨';
    color = 'text-yellow-400';
    bg = 'bg-yellow-500/10';
  } else if (msg.flag === 'RED') {
    icon = '🟥';
    color = 'text-red-500';
    bg = 'bg-red-500/10';
  }

  return { text, icon, color, bg };
}

export default function LiveCommentary() {
  const { commentary } = useLiveStore();

  return (
    <div className="flex flex-col h-full bg-surface/50 border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
        <h3 className="font-mono text-sm tracking-widest text-secondary font-bold">RACE COMMENTARY</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-4 no-scrollbar flex flex-col-reverse">
        <AnimatePresence>
          {commentary.map((msg, i) => {
            const parsed = parseCommentary(msg);
            
            // Format time
            const date = new Date(msg.date);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <motion.div
                key={msg.date + i}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${parsed.bg} ${parsed.color}`}>
                    {parsed.icon}
                  </div>
                  {i !== commentary.length - 1 && <div className="w-[1px] flex-1 bg-white/10 my-1" />}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex gap-2 items-baseline mb-1">
                    <span className="font-mono text-xs text-secondary">{timeStr}</span>
                    {msg.lap_number && (
                      <span className="font-mono text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">
                        Lap {msg.lap_number}
                      </span>
                    )}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">{parsed.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {commentary.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/30 font-mono text-sm p-8 text-center border border-dashed border-white/5 rounded-xl">
             <span className="text-2xl mb-2">🚥</span>
             Waiting for session updates...<br/>
             (Commentary starts when cars hit the track)
          </div>
        )}
      </div>
    </div>
  );
}
