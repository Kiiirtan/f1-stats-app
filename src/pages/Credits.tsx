import PageTransition from '../components/ui/PageTransition';

export default function Credits() {
  const credits = [
    { title: "Jolpica F1 API", desc: "The open-source API powering all live timing, standings, and historical data.", link: "https://jolpi.ca/" },
    { title: "Wikimedia Commons", desc: "Providing premium, globally accessible driver portraits and hero imagery.", link: "https://commons.wikimedia.org/" },
    { title: "Vite & React", desc: "The lightning-fast frontend tooling and component architecture.", link: "https://vitejs.dev/" },
    { title: "Google Fonts", desc: "Serving Space Grotesk and Inter for the official typography.", link: "https://fonts.google.com/" }
  ];

  return (
    <PageTransition>
      <div className="p-6 lg:p-12 max-w-4xl pt-24 lg:pt-12">
        <header className="mb-12">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Attributions</span>
          <h1 className="f1-heading text-5xl md:text-7xl text-white leading-tight">CREDITS</h1>
          <p className="text-on-surface-variant mt-6 text-lg max-w-2xl">F1 Stats is made possible by incredible open-source communities and APIs. We extend our deepest gratitude to the following projects.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credits.map((credit, i) => (
            <a key={i} href={credit.link} target="_blank" rel="noreferrer" className="block p-8 bg-surface-container-highest border border-white/5 hover:border-[var(--theme-accent)]/50 transition-colors group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--theme-accent)] transition-colors">{credit.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{credit.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
