import { useEffect, useRef, useState } from 'react';

interface NotificationsTrayProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsTray({ open, onClose }: NotificationsTrayProps) {
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const { fetchRaceCalendar, fetchDriverStandings } = await import('../../data/api');
        const [calendar, drivers] = await Promise.all([
          fetchRaceCalendar(),
          fetchDriverStandings()
        ]);
        
        const today = new Date().toISOString().split('T')[0];
        const upcomingRaces = calendar.filter(r => !r.completed && r.date >= today).sort((a,b) => a.date.localeCompare(b.date));
        const pastRaces = calendar.filter(r => r.completed || r.date < today).sort((a,b) => b.date.localeCompare(a.date));
        
        const nextRace = upcomingRaces[0];
        const lastRace = pastRaces[0];
        const leader = drivers[0];
        
        const newNotifications = [];
        
        if (nextRace) {
          const raceDate = new Date(nextRace.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          newNotifications.push({
            id: 1,
            title: `UPCOMING: ${nextRace.name}`,
            message: `Next race at ${nextRace.circuit} is approaching on ${raceDate}.`,
            time: 'Upcoming',
            icon: 'event',
            color: 'text-green-400',
            bg: 'bg-green-400/10'
          });
        }
        
        if (lastRace) {
          newNotifications.push({
            id: 2,
            title: 'Race Results Update',
            message: `Official classification for the ${lastRace.name} is available.`,
            time: 'Recent',
            icon: 'sports_score',
            color: 'text-[var(--theme-accent)]',
            bg: 'bg-[var(--theme-accent)]/10'
          });
        }
        
        if (leader) {
          newNotifications.push({
            id: 3,
            title: 'Championship Leader',
            message: `${leader.firstName} ${leader.lastName} leads with ${leader.seasonPoints} pts.`,
            time: 'Current Season',
            icon: 'emoji_events',
            color: 'text-amber-400',
            bg: 'bg-amber-400/10'
          });
        }
        
        // Add system notice too just for flavour
        newNotifications.push({
            id: 4,
            title: 'System Notice',
            message: 'All telemetry channels are operating optimally.',
            time: 'Just now',
            icon: 'radar',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        });

        setNotifications(newNotifications);
        setHasLoaded(true);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    
    if (open && !hasLoaded) {
      loadNotifications();
    }
  }, [open, hasLoaded]);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        ref={trayRef}
        className={`fixed top-0 right-0 z-[60] w-full max-w-sm h-full bg-[#13131b] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(19, 19, 27, 0.98), rgba(25, 25, 35, 0.98))'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--theme-accent)]">notifications_active</span>
            <h2 className="headline-font font-black italic uppercase text-lg text-on-surface">Notifications</h2>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-white/50 text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            <>
              {notifications.map(note => (
                <div key={note.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex gap-4 items-start">
                  <div className={`p-2 rounded-full ${note.bg} flex-shrink-0`}>
                     <span className={`material-symbols-outlined text-sm ${note.color}`}>{note.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white mb-1">{note.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-2">{note.message}</p>
                    <div className="text-[10px] uppercase tracking-wider text-white/40">{note.time}</div>
                  </div>
                </div>
              ))}
              <div className="mt-8 text-center text-xs text-on-surface-variant opacity-60">
                End of notifications
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-10">
              <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
              <p className="text-sm font-['Space_Grotesk'] text-on-surface-variant">You're all caught up!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <button 
            onClick={() => setNotifications([])}
            disabled={notifications.length === 0}
            className={`w-full py-3 rounded-lg headline-font font-black italic uppercase text-sm transition-all ${
              notifications.length > 0 
                ? 'bg-[var(--theme-accent)] text-[#13131b] hover:brightness-110'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
