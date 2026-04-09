import PageTransition from '../components/ui/PageTransition';
import { useSettings } from '../context/SettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Terms() {
  useDocumentMeta('Terms of Service', 'Terms of service and usage conditions for F1 Stats.');
  const { settings } = useSettings();
  const glass = settings.glassMorphism;
  return (
    <PageTransition>
      <div className={`pt-20 pb-20 px-6 md:px-12 max-w-4xl mx-auto w-full ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-[2rem] shadow-lg mt-12 mb-12 p-8 md:p-12' : ''}`}>
        <header className="mb-12 border-b border-white/10 pb-8">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Legal Information</span>
          <h1 className="f1-heading text-4xl md:text-5xl text-white leading-tight">TERMS OF SERVICE</h1>
          <p className="text-on-surface-variant mt-4 text-sm">Last Updated: March 2026</p>
        </header>

        <article className="prose prose-invert max-w-none text-on-surface-variant space-y-8">
          <section>
            <h2 className="text-white text-xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing F1 Stats, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">2. Fair Use Policy</h2>
            <p>This application utilizes public APIs constraints. Automated crawling, scraping, or launching DDOS attacks against our routes that cause rate limit overages on upstream providers (Jolpica) is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">3. Disclaimer of Affiliation</h2>
            <p>F1 Stats is an unofficial, independent data visualization project. It is **not** associated with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V.</p>
          </section>
        </article>
      </div>
    </PageTransition>
  );
}
