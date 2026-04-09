import PageTransition from '../components/ui/PageTransition';
import { useSettings } from '../context/SettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Credits() {
  useDocumentMeta('Credits', 'Acknowledgments and data attribution for the F1 Stats application.');
  const { settings } = useSettings();
  const glass = settings.glassMorphism;
  const credits = [
    { title: "Developer", desc: "Built and designed by Kirtan Patidar as a premium F1 data dashboard.", link: "https://github.com/Kiiirtan" },
    { title: "Jolpica F1 API", desc: "The open-source API powering all live timing, standings, and historical data.", link: "https://jolpi.ca/" },
    { title: "Wikimedia Commons", desc: "Providing premium, globally accessible driver portraits and constructor hero imagery.", link: "https://commons.wikimedia.org/" },
    { title: "Motorsport.com", desc: "Direct source for live F1 news feeds and article previews.", link: "https://www.motorsport.com/" },
    { title: "Vite & React", desc: "The lightning-fast frontend tooling and component architecture.", link: "https://vitejs.dev/" },
    { title: "Google Fonts & Unsplash", desc: "Serving official typography and dynamic fallback racing photography.", link: "https://unsplash.com/" }
  ];

  return (
    <PageTransition>
      <div className="pt-20 px-6 lg:px-12 max-w-4xl mx-auto w-full pb-20">
        <header className="mb-12">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Attributions</span>
          <h1 className="f1-heading text-5xl md:text-7xl text-white leading-tight">CREDITS</h1>
          <p className="text-on-surface-variant mt-6 text-lg max-w-2xl">F1 Stats is made possible by incredible open-source communities and APIs. We extend our deepest gratitude to the following projects.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credits.map((credit, i) => (
            <a key={i} href={credit.link} target="_blank" rel="noreferrer" className={`block p-8 border border-white/5 hover:border-[var(--theme-accent)]/50 transition-colors group ${glass ? 'bg-transparent backdrop-blur-[2px] border border-white/20 rounded-2xl shadow-lg' : 'bg-surface-container-highest'}`}>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--theme-accent)] transition-colors">{credit.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{credit.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
