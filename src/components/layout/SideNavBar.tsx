import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const FlipMenuItem = ({ to, icon, label, path }: { to: string; icon: string; label: string; path: string }) => {
  const isActive = path === to;
  return (
    <Link
      to={to}
      className="flip-nav-item group relative w-11 h-11 flex-shrink-0 block"
      style={{ perspective: '600px' }}
      aria-label={label}
    >
      <div
        className="flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl transition-colors duration-300 ${
            isActive
              ? 'text-white bg-white/10 border-white/20'
              : 'text-[#c7c6ca]/80 border border-transparent group-hover:border-white/5'
          }`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
            {icon}
          </span>
        </div>
        {/* Back */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl ${
            isActive
              ? 'bg-[#E10600]/20 border border-[#E10600]/40'
              : 'bg-white/[0.08] border border-white/10'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span className={`font-headline text-[7px] font-black uppercase tracking-wider text-center ${
            isActive ? 'text-[#E10600]' : 'text-white'
          }`}>
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function SideNavBar() {
  const location = useLocation();
  const path = location.pathname;
  const { settings, updateSetting } = useSettings();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMoreMenuOpen(false);
  }, [path]);

  const navItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard', fill: true, match: (p: string) => p === '/' },
    { to: '/news', icon: 'newspaper', label: 'News', fill: false, match: (p: string) => p === '/news' },
    { to: '/live', icon: 'speed', label: 'Live', fill: true, match: (p: string) => p === '/live' },
    { to: '/calendar', icon: 'calendar_month', label: 'Calendar', fill: false, match: (p: string) => p === '/calendar' },
    { to: '/circuits', icon: 'map', label: 'Circuits', fill: false, match: (p: string) => p.includes('/circuit') },
    { to: '/drivers', icon: 'leaderboard', label: 'Standings', fill: false, match: (p: string) => p.includes('/driver') },
    { to: '/archives', icon: 'history', label: 'Archives', fill: false, match: (p: string) => p === '/archives', soon: true },
    { to: '/constructors', icon: 'groups', label: 'Teams', fill: false, match: (p: string) => p.includes('/constructor') },
  ];

  if (settings.desktopNavPosition !== 'side') return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 bg-glass-heavy border-r border-white/5 hidden lg:flex flex-col z-50 items-center">
      {/* Logo */}
      <div className="pt-7 pb-5">
        <Link to="/" className="text-lg font-black italic tracking-tighter flex items-center justify-center">
          <span className="text-[#E10600]">F1</span>
        </Link>
        <div className="w-8 h-px bg-white/10 mt-4 mx-auto" />
      </div>

      {/* Nav Items */}
      <nav className="flex-grow pt-2 overflow-y-auto no-scrollbar flex flex-col items-center gap-2 px-2 w-full">
        {navItems.map((item) => {
          const isActive = item.match(path);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flip-nav-item group relative w-14 h-14 flex-shrink-0"
              style={{ perspective: '600px' }}
              aria-label={item.label}
            >
              {/* The flipper container */}
              <div
                className="flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* ─── FRONT FACE: Icon Only ─── */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-colors duration-300 ${
                    isActive
                      ? 'glow-border-red-active text-white bg-black/40'
                      : 'text-[#c7c6ca]/60 border border-transparent hover:border-white/5'
                  }`}
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] transition-colors ${isActive ? 'text-white' : 'group-hover:text-white'}`}
                    style={item.fill || isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#E10600] shadow-[0_0_8px_rgba(225,6,0,0.6)]" />
                  )}
                  {/* Soon badge */}
                  {'soon' in item && item.soon && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E10600] border border-[#0d0d16] shadow-[0_0_6px_rgba(225,6,0,0.5)]" />
                  )}
                </div>

                {/* ─── BACK FACE: Label ─── */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
                    isActive
                      ? 'bg-[#E10600]/20 border border-[#E10600]/40'
                      : 'bg-white/[0.08] border border-white/10'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <span className={`font-headline text-[9px] font-black uppercase tracking-[0.15em] ${
                    isActive ? 'text-[#E10600]' : 'text-white'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pb-3 pt-2 flex flex-col items-center gap-2 border-t border-white/5 w-full px-2 mt-auto">
        
        {/* Toggle Nav Position Button (Switch to Top) */}
        <button
          onClick={() => updateSetting('desktopNavPosition', 'top')}
          className="flip-nav-item group relative w-14 h-14 flex-shrink-0 block"
          style={{ perspective: '600px' }}
          title="Switch to Top Navigation"
        >
          <div
            className="flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl transition-colors duration-300 text-[#c7c6ca]/60 border border-transparent group-hover:border-white/5 bg-white/[0.02]"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:text-[var(--theme-accent)] transition-colors">
                vertical_align_top
              </span>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#E10600]/20 border border-[#E10600]/40"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <span className="font-headline text-[7px] font-black uppercase tracking-wider text-center text-[#E10600]">
                Top Nav
              </span>
            </div>
          </div>
        </button>

        {/* More Options */}
        <div className="relative w-full flex justify-center" ref={moreMenuRef}>
          <button
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="flip-nav-item group relative w-14 h-14 flex-shrink-0"
            style={{ perspective: '600px' }}
            aria-label="More Options"
          >
            <div
              className={`flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${moreMenuOpen ? '[transform:rotateY(180deg)]' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-colors duration-300 ${
                  moreMenuOpen
                    ? 'glow-border-red-active text-white bg-black/40' // Keep it looking active
                    : 'text-[#c7c6ca]/60 border border-transparent'
                }`}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <span
                  className={`material-symbols-outlined text-[22px] ${moreMenuOpen ? 'text-white' : 'group-hover:text-white'}`}
                >
                  more_horiz
                </span>
                {moreMenuOpen && (
                  <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#E10600] shadow-[0_0_8px_rgba(225,6,0,0.6)]" />
                )}
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
                  moreMenuOpen
                    ? 'bg-[#E10600]/20 border border-[#E10600]/40'
                    : 'bg-white/[0.08] border border-white/10'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="font-headline text-[9px] font-black uppercase tracking-[0.15em] text-white">
                  More
                </span>
              </div>
            </div>
          </button>

          {/* Popup Menu */}
          {moreMenuOpen && (
            <div className="absolute left-[75px] bottom-0 w-max rounded-xl bg-[#13131b]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] p-1.5 flex gap-1.5 animate-search-in z-50">
               <FlipMenuItem to="/contact" icon="mail" label="Contact" path={path} />
               <FlipMenuItem to="/credits" icon="workspace_premium" label="Credits" path={path} />
               <FlipMenuItem to="/privacy" icon="shield" label="Privacy" path={path} />
               <FlipMenuItem to="/terms" icon="gavel" label="Terms" path={path} />
               <FlipMenuItem to="/cookies" icon="cookie" label="Cookies" path={path} />
            </div>
          )}
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className="flip-nav-item group relative w-14 h-14 flex-shrink-0"
          style={{ perspective: '600px' }}
          aria-label="Settings"
        >
          <div
            className="flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-2xl transition-colors duration-300 ${
                path === '/settings'
                  ? 'glow-border-red-active text-white bg-black/40'
                  : 'text-[#c7c6ca]/60 border border-transparent'
              }`}
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${path === '/settings' ? 'text-white' : 'group-hover:text-white'}`}
                style={path === '/settings' ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                settings
              </span>
              {path === '/settings' && (
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#E10600] shadow-[0_0_8px_rgba(225,6,0,0.6)]" />
              )}
            </div>
            {/* Back */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
                path === '/settings'
                  ? 'bg-[#E10600]/20 border border-[#E10600]/40'
                  : 'bg-white/[0.08] border border-white/10'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <span className={`font-headline text-[9px] font-black uppercase tracking-[0.15em] ${
                path === '/settings' ? 'text-[#E10600]' : 'text-white'
              }`}>
                Settings
              </span>
            </div>
          </div>
        </Link>

        {/* Copyright */}
        <span className="text-[8px] text-white/15 font-mono">&copy; 2026</span>
      </div>
    </aside>
  );
}
