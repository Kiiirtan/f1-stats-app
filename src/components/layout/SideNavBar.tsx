import { Link, useLocation } from 'react-router-dom';

export default function SideNavBar() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard', fill: true, match: (p: string) => p === '/' },
    { to: '/news', icon: 'newspaper', label: 'News Section', fill: false, match: (p: string) => p === '/news' },
    { to: '/calendar', icon: 'calendar_month', label: 'Season Calendar', fill: false, match: (p: string) => p === '/calendar' },
    { to: '/circuits', icon: 'map', label: 'Circuits', fill: false, match: (p: string) => p.includes('/circuit') },
    { to: '/drivers', icon: 'leaderboard', label: 'Standings', fill: false, match: (p: string) => p.includes('/driver') },
    { to: '/results', icon: 'history', label: 'Archives', fill: false, match: (p: string) => p === '/results' },
    { to: '/constructors', icon: 'groups', label: 'Constructors', fill: false, match: (p: string) => p.includes('/constructor') },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[#13131b] border-r border-[#1b1b24] hidden lg:flex flex-col z-40">
      <div className="p-6 border-b border-[#1b1b24]">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-[var(--theme-accent)] animate-pulse"></div>
          <span className="font-['Space_Grotesk'] text-xs font-medium uppercase tracking-widest text-[#e4e1ee]">PIT WALL</span>
        </div>
        <p className="text-[10px] text-[#c7c6ca] mt-1 opacity-60">Telemetry Active</p>
      </div>
      
      <nav className="flex-grow py-4">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${item.match(path) ? 'border-l-4 border-[var(--theme-accent)] bg-[#1b1b24] text-[#e4e1ee]' : 'text-[#c7c6ca] hover:bg-[#1b1b24]/50 hover:text-[var(--theme-accent)] border-l-4 border-transparent'} py-4 px-6 transition-all flex items-center space-x-4`}
          >
            <span className="material-symbols-outlined text-sm" style={item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
            <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-6 mt-auto">
        <Link 
          to="/settings" 
          className={`flex items-center space-x-4 transition-colors group ${
            path === '/settings' 
              ? 'text-[var(--theme-accent)]' 
              : 'text-[#c7c6ca] hover:text-[#e4e1ee]'
          }`}
        >
          <span className="material-symbols-outlined text-sm group-hover:rotate-45 transition-transform">settings</span>
          <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest">Settings</span>
        </Link>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[#c7c6ca]/40 text-[9px] font-['Space_Grotesk'] uppercase tracking-widest">
          <Link to="/contact" className="hover:text-[#e4e1ee] transition-colors">Contact</Link>
          <Link to="/credits" className="hover:text-[#e4e1ee] transition-colors">Credits</Link>
          <Link to="/privacy" className="hover:text-[#e4e1ee] transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-[#e4e1ee] transition-colors">Terms</Link>
          <Link to="/cookies" className="hover:text-[#e4e1ee] transition-colors">Cookies</Link>
          <span className="w-full mt-2">&copy; 2026 F1 Stats Project</span>
        </div>
      </div>
    </aside>
  );
}
