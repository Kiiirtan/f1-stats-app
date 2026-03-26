import PageTransition from '../components/ui/PageTransition';

export default function Privacy() {
  return (
    <PageTransition>
      <div className="p-6 lg:p-12 max-w-3xl pt-24 lg:pt-12">
        <header className="mb-12 border-b border-white/10 pb-8">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Legal Information</span>
          <h1 className="f1-heading text-4xl md:text-5xl text-white leading-tight">PRIVACY POLICY</h1>
          <p className="text-on-surface-variant mt-4 text-sm">Last Updated: March 2026</p>
        </header>

        <article className="prose prose-invert max-w-none text-on-surface-variant space-y-8">
          <section>
            <h2 className="text-white text-xl font-bold mb-4">1. Data Collection</h2>
            <p>At F1 Stats, we prioritize the privacy of our users. We do not require account creation, and we do not collect personally identifiable information (PII) during your standard browsing of race telemetry and statistics.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">2. Usage Diagnostics</h2>
            <p>To ensure high-performance API routing, we may securely log anonymous telemetry regarding page load times, API latency, and UI rendering speeds automatically via secure HTTPS.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-bold mb-4">3. Third-Party Services</h2>
            <p>Our application heavily relies on third-party APIs (Jolpica F1 API, Wikimedia). When you load driver portraits or live timing, your client makes direct HTTP requests to these providers. Please refer to their respective privacy policies regarding IP logging.</p>
          </section>
        </article>
      </div>
    </PageTransition>
  );
}
