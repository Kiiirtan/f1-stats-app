import PageTransition from '../components/ui/PageTransition';
import { useSettings } from '../context/SettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Cookies() {
  useDocumentMeta('Cookie Policy', 'Cookie policy and tracking information for F1 Stats.');
  const { settings } = useSettings();
  const glass = settings.glassMorphism;
  return (
    <PageTransition>
      <div className={`pt-20 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg mt-12 mb-12 p-8 md:p-12' : ''}`}>
        <header className="mb-12 border-b border-white/10 pb-8">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Preferences</span>
          <h1 className="f1-heading text-4xl md:text-5xl text-white leading-tight">COOKIE POLICY</h1>
          <p className="text-on-surface-variant mt-4 text-sm">Last Updated: March 2026</p>
        </header>

        <article className="prose prose-invert max-w-none text-on-surface-variant space-y-8">
          <section>
            <h2 className="text-white text-xl font-bold mb-4">Zero Tracking Assurance</h2>
            <p className="mb-4">F1 Stats operates as a highly optimized, stateless Single Page Application (SPA). Because we prioritize speed and user privacy, **we do not use any analytical or tracking cookies.**</p>
            <div className="bg-[#1b1b24] p-6 border-l-4 border-[var(--theme-accent)]">
              <h3 className="text-white font-bold mb-2">Local Storage</h3>
              <p className="text-sm">We strictly utilize your browser's `localStorage` or `sessionStorage` purely for temporary API caching (to prevent spamming upstream servers during high traffic data queries). None of this data is transmitted back to our servers.</p>
            </div>
          </section>
        </article>
      </div>
    </PageTransition>
  );
}
