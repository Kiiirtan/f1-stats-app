import { useEffect, useRef } from 'react';

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

  const MOCK_NOTIFICATIONS = [
    {
      id: 1,
      title: 'LIVE: Miami GP',
      message: 'Telemetry sync established. Live timing is now active.',
      time: 'Just now',
      icon: 'radar',
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    {
      id: 2,
      title: 'Race Results Published',
      message: 'Official classification for the Japanese Grand Prix has been updated.',
      time: '2 hours ago',
      icon: 'sports_score',
      color: 'text-[var(--theme-accent)]',
      bg: 'bg-[var(--theme-accent)]/10'
    },
    {
      id: 3,
      title: 'System Notice',
      message: 'Server maintenance scheduled for tomorrow at 04:00 UTC.',
      time: '1 day ago',
      icon: 'build',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    }
  ];

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
          {MOCK_NOTIFICATIONS.map(note => (
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
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-[var(--theme-accent)] text-[#13131b] headline-font font-black italic uppercase text-sm hover:brightness-110 transition-all"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
