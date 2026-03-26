import { Link } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  navLinks: { label: string; to: string }[];
  pathname: string;
}

export default function MobileMenu({ open, onClose, navLinks, pathname }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-c-30 z-[999] shadow-2xl border-l border-c-10/10 transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-6 h-16 border-b border-c-10/10">
          <span className="text-c-10 font-headline font-black italic text-lg tracking-tight">MENU</span>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-t-main hover:text-c-10 transition-colors p-1"
            aria-label="Close menu"
          >
            close
          </button>
        </div>

        <nav className={`flex flex-col p-6 space-y-1 ${open ? 'stagger-in' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={`font-headline uppercase tracking-wider font-bold text-lg py-3 px-4 transition-all rounded-sm flex items-center gap-3 ${
                pathname === link.to
                  ? 'text-c-10 bg-c-10/10 border-l-2 border-c-10'
                  : 'text-t-main hover:text-t-bright hover:bg-c-60/50 border-l-2 border-transparent'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom tagline & Legal */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-c-10/10 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-[9px] font-['Space_Grotesk'] uppercase tracking-widest text-t-main/60">
            <Link to="/contact" onClick={onClose} className="hover:text-c-10 transition-colors">Contact</Link>
            <Link to="/credits" onClick={onClose} className="hover:text-c-10 transition-colors">Credits</Link>
            <Link to="/privacy" onClick={onClose} className="hover:text-c-10 transition-colors">Privacy</Link>
            <Link to="/terms" onClick={onClose} className="hover:text-c-10 transition-colors">Terms</Link>
            <Link to="/cookies" onClick={onClose} className="hover:text-c-10 transition-colors">Cookies</Link>
          </div>
          <p className="text-[10px] text-t-main/30 uppercase tracking-widest text-center">
            &copy; 2026 F1 Stats • Live Data
          </p>
        </div>
      </div>
    </>
  );
}
