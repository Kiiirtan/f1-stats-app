import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import SearchModal from '../features/SearchModal';
import NotificationsTray from '../features/NotificationsTray';
import AuthModal from '../features/AuthModal';

// --- Desktop Header Flip Nav Item ---
const TopFlipNavItem = ({ to, icon, label, path }: { to: string; icon: string; label: string; path: string }) => {
  const isActive = path === to || (to === '/drivers' && path.includes('/driver')) || (to === '/circuits' && path.includes('/circuit')) || (to === '/constructors' && path.includes('/constructor'));
  return (
    <Link
      to={to}
      className="flip-nav-item group relative w-12 h-12 flex-shrink-0 block pointer-events-auto"
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
              ? 'glow-border-red-active text-white bg-black/40'
              : 'text-[#c7c6ca]/60 border border-transparent hover:bg-white/5 group-hover:border-white/5'
          }`}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
            {icon}
          </span>
          {/* Active dot indicator bottom */}
          {isActive && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-[#E10600] shadow-[0_0_8px_rgba(225,6,0,0.6)]" />
          )}
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
          <span className={`font-headline text-[7px] font-black uppercase tracking-wider text-center px-0.5 ${
            isActive ? 'text-[#E10600]' : 'text-white'
          }`}>
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function TopNavBar() {
  const { pathname } = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [pathname]);

  // Close profile menu on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileMenuOpen]);

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

  const mobileNavLinks = [
    { label: 'Dashboard', to: '/', icon: 'dashboard' },
    { label: 'Live', to: '/live', icon: 'speed' },
    { label: 'News', to: '/news', icon: 'newspaper' },
    { label: 'Calendar', to: '/calendar', icon: 'calendar_month' },
    { label: 'Circuits', to: '/circuits', icon: 'map' },
    { label: 'Standings', to: '/drivers', icon: 'leaderboard' },
    { label: 'Archives', to: '/archives', icon: 'history' },
    { label: 'Constructors', to: '/constructors', icon: 'groups' },
    { label: 'Settings', to: '/settings', icon: 'settings' },
  ];

  // Get user initials for avatar
  const userInitial = user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?';

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setProfileMenuOpen(!profileMenuOpen);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
  };

  const { settings, updateSetting } = useSettings();

  return (
    <>
      <header className={`fixed top-0 w-full z-40 h-24 flex justify-between items-center px-4 md:px-12 transition-all duration-300 pointer-events-none`}>
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors p-2 bg-glass rounded-full"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          <Link to="/" className="lg:hidden text-xl font-black italic tracking-tighter text-[var(--theme-accent)] bg-glass px-4 py-2 rounded-full">
            F1 STATS
          </Link>
        </div>
        
        {/* Desktop Header Nav Links */}
        {settings.desktopNavPosition === 'top' ? (
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-2 pointer-events-none z-50">
             <div className="bg-glass border border-white/5 rounded-[1.5rem] p-1.5 flex gap-1 shadow-[0_0_40px_rgba(0,0,0,0.3)] pointer-events-auto backdrop-blur-3xl">
               <button
                 onClick={() => updateSetting('desktopNavPosition', 'side')}
                 className="flip-nav-item group relative w-12 h-12 flex-shrink-0 block pointer-events-auto"
                 style={{ perspective: '600px' }}
                 title="Switch to Sidebar Navigation"
               >
                 <div
                   className="flip-nav-inner relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                   style={{ transformStyle: 'preserve-3d' }}
                 >
                   <div
                     className="absolute inset-0 flex items-center justify-center rounded-xl transition-colors duration-300 text-[#c7c6ca]/60 border border-transparent group-hover:border-white/5 bg-white/[0.02]"
                     style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                   >
                     <span className="material-symbols-outlined text-[20px] group-hover:text-[var(--theme-accent)] transition-colors">
                       view_sidebar
                     </span>
                   </div>
                   <div
                     className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#E10600]/20 border border-[#E10600]/40"
                     style={{
                       backfaceVisibility: 'hidden',
                       WebkitBackfaceVisibility: 'hidden',
                       transform: 'rotateY(180deg)',
                     }}
                   >
                     <span className="font-headline text-[7px] font-black uppercase tracking-wider text-center text-[#E10600]">
                       Side Nav
                     </span>
                   </div>
                 </div>
               </button>
               <div className="w-px h-8 bg-white/10 self-center mx-1" />
               {mobileNavLinks.map((link) => (
                 <TopFlipNavItem 
                   key={link.to}
                   to={link.to} 
                   icon={link.icon} 
                   label={link.label} 
                   path={pathname} 
                 />
               ))}
             </div>
          </div>
        ) : (
          <div className="hidden lg:block flex-1"></div>
        )}

        <div className="flex items-center space-x-4 pointer-events-auto">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-glass hover:bg-white/10 transition-colors border border-white/10"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-[#e4e1ee] text-[20px]">search</span>
          </button>

          <button
            onClick={() => setNotificationsOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-glass hover:bg-white/10 transition-colors border border-white/10 relative"
            aria-label="Notifications"
          >
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[var(--theme-accent)] rounded-full border-[1.5px] border-[#13131b] animate-pulse"></span>
            <span className="material-symbols-outlined text-[#e4e1ee] text-[20px]">notifications</span>
          </button>

          {/* Profile / Auth Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className={`w-10 h-10 rounded-full border overflow-hidden transition-all duration-200 flex items-center justify-center ${
                isAuthenticated
                  ? 'border-[var(--theme-accent)]/40 hover:border-[var(--theme-accent)] hover:scale-105'
                  : 'border-white/10 hover:border-[var(--theme-accent)] hover:scale-105'
              }`}
              aria-label={isAuthenticated ? 'Profile menu' : 'Sign in'}
            >
              {isAuthenticated ? (
                <div className="w-full h-full bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] flex items-center justify-center">
                  <span className="text-white font-headline font-black text-sm">{userInitial}</span>
                </div>
              ) : (
                <div className="w-full h-full bg-glass flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/50 text-[20px]">person</span>
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-12 w-64 rounded-xl bg-[#1a1a24] border border-white/10 shadow-2xl overflow-hidden animate-search-in z-50">
                {/* User info */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-headline font-black text-sm">{userInitial}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-headline font-bold text-sm text-white truncate">
                        {user?.displayName || 'F1 Fan'}
                      </p>
                      <p className="text-[10px] text-white/40 font-body truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <Link
                    to="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">settings</span>
                    <span className="text-xs font-headline font-bold tracking-wider">SETTINGS</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    <span className="text-xs font-headline font-bold tracking-wider">SIGN OUT</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Notifications Tray */}
      <NotificationsTray open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-[#13131b]/95 backdrop-blur-xl border-t border-[var(--theme-accent)]/10 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${pathname === link.to || (link.to === '/drivers' && pathname.startsWith('/driver'))
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

            {/* Mobile auth button */}
            {!isAuthenticated && (
              <button
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true); }}
                className="flex items-center space-x-4 p-4 rounded-lg text-[var(--theme-accent)] bg-[var(--theme-accent)]/5 border border-[var(--theme-accent)]/20 mt-4"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest font-bold">
                  Sign In
                </span>
              </button>
            )}

            {/* Extra Mobile Links */}
            <div className="h-px bg-white/10 my-4 mx-2" />
            <div className="px-2 pb-6 pt-2 flex flex-wrap gap-x-6 gap-y-4 justify-center">
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-['Space_Grotesk'] font-bold text-[#c7c6ca]/70 hover:text-[var(--theme-accent)] tracking-widest uppercase">Contact</Link>
              <Link to="/credits" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-['Space_Grotesk'] font-bold text-[#c7c6ca]/70 hover:text-[var(--theme-accent)] tracking-widest uppercase">Credits</Link>
              <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-['Space_Grotesk'] font-bold text-[#c7c6ca]/70 hover:text-[var(--theme-accent)] tracking-widest uppercase">Privacy</Link>
              <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-['Space_Grotesk'] font-bold text-[#c7c6ca]/70 hover:text-[var(--theme-accent)] tracking-widest uppercase">Terms</Link>
              <Link to="/cookies" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-['Space_Grotesk'] font-bold text-[#c7c6ca]/70 hover:text-[var(--theme-accent)] tracking-widest uppercase">Cookies</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
