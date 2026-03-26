import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="lg:ml-64 w-full border-t border-[#1b1b24] py-12 bg-[#0d0d16] flex flex-col items-center justify-center space-y-8 px-4 mt-auto">
      <div className="text-lg font-black text-[var(--theme-accent)]">F1 STATS</div>
      <div className="flex flex-wrap justify-center gap-8">
        <Link to="/privacy" className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors">Terms of Service</Link>
        <Link to="/cookies" className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors">Cookie Preferences</Link>
        <Link to="/contact" className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors">Contact</Link>
        <Link to="/credits" className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] hover:text-[var(--theme-accent)] transition-colors">Credits</Link>
      </div>
      <div className="text-center">
        <p className="font-['Inter'] text-[10px] uppercase tracking-[0.2em] text-[#c7c6ca] opacity-50">
          © 2026 F1 STATS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
