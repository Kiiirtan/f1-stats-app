import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchModal from '../features/SearchModal';

export default function TopNavBar() {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const navLinks = [
    { label: 'News', to: '/news' },
    { label: 'Drivers', to: '/drivers' },
    { label: 'Races', to: '/races' },
    { label: 'Results', to: '/results' },
    { label: 'Constructors', to: '/constructors' },
  ];

  const mobileNavLinks = [
    { label: 'Dashboard', to: '/', icon: 'dashboard' },
    { label: 'News', to: '/news', icon: 'newspaper' },
    { label: 'Live Timing', to: '/races', icon: 'timer' },
    { label: 'Standings', to: '/drivers', icon: 'leaderboard' },
    { label: 'Archives', to: '/results', icon: 'history' },
    { label: 'Constructors', to: '/constructors', icon: 'groups' },
    { label: 'Settings', to: '/settings', icon: 'settings' },
  ];

  return (
    <>
      <header className={`fixed top-0 w-full z-50 h-16 flex justify-between items-center px-4 md:px-8 transition-all duration-300 ${
        scrolled
          ? 'bg-[#13131b]/95 backdrop-blur-xl shadow-lg border-b border-[var(--theme-accent)]/10'
          : 'bg-[#13131b]/70 backdrop-blur-xl border-b border-[var(--theme-accent)]/10'
      }`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Link to="/" className="text-xl md:text-2xl font-black italic tracking-tighter text-[var(--theme-accent)]">
            F1 STATS
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8 font-['Space_Grotesk'] uppercase tracking-wider font-bold text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors py-1 ${
                pathname === link.to || (link.to === '/drivers' && pathname.startsWith('/driver'))
                  ? 'text-[var(--theme-accent)]'
                  : 'text-[#c7c6ca] hover:text-[#e4e1ee]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors"
            aria-label="Search"
          >
            <span className="material-symbols-outlined">search</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#c7c6ca]/50 bg-[#1F2833] border border-white/10 rounded-sm">
              ⌘K
            </kbd>
          </button>

          <Link
            to="/settings"
            className="flex items-center gap-2 text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors p-1"
            aria-label="Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-[#13131b]/95 backdrop-blur-xl border-t border-[var(--theme-accent)]/10 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  pathname === link.to || (link.to === '/drivers' && pathname.startsWith('/driver'))
                    ? 'bg-[#1b1b24] text-[var(--theme-accent)] border-l-2 border-[var(--theme-accent)]'
                    : 'text-[#c7c6ca] hover:bg-[#1b1b24]/50 hover:text-[#e4e1ee]'
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest font-bold">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
