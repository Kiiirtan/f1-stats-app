import PageTransition from '../components/ui/PageTransition';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('submitting');
    try {
      const response = await fetch("https://formsubmit.co/ajax/formula1.stats.company@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: "New F1 Stats Contact Submission"
        })
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  return (
    <PageTransition>
      <div className="p-6 lg:p-12 max-w-4xl pt-24 lg:pt-12">
        <header className="mb-12">
          <span className="font-['Space_Grotesk'] font-bold italic uppercase tracking-[0.3em] text-[var(--theme-accent)] text-xs mb-2 block">Reach Out</span>
          <h1 className="f1-heading text-5xl md:text-7xl text-white leading-tight">CONTACT US</h1>
        </header>

        <section className="bg-surface-container-highest p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Get in Touch</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Have questions about the F1 telemetry data, spot a bug, or just want to discuss the world championship? Reach out to our technical team.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[var(--theme-accent)] mt-1">mail</span>
                  <div>
                    <h3 className="text-white font-medium">Email Support</h3>
                    <p className="text-on-surface-variant text-sm mt-1">formula1.stats.company@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[var(--theme-accent)] mt-1">code</span>
                  <div>
                    <h3 className="text-white font-medium">Developer Relations</h3>
                    <p className="text-on-surface-variant text-sm mt-1">formula1.stats.company@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-['Space_Grotesk'] uppercase tracking-wider text-on-surface-variant mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1b1b24] border border-white/10 p-3 text-white focus:outline-none focus:border-[var(--theme-accent)] transition-colors" 
                  placeholder="Kirtan" 
                />
              </div>
              <div>
                <label className="block text-xs font-['Space_Grotesk'] uppercase tracking-wider text-on-surface-variant mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#1b1b24] border border-white/10 p-3 text-white focus:outline-none focus:border-[var(--theme-accent)] transition-colors" 
                  placeholder="Kirtan@mclaren.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-['Space_Grotesk'] uppercase tracking-wider text-on-surface-variant mb-2">Message</label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#1b1b24] border border-white/10 p-3 text-white focus:outline-none focus:border-[var(--theme-accent)] transition-colors resize-none" 
                  placeholder="We need more downforce..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="bg-[var(--theme-accent)] text-white px-8 py-3 font-['Space_Grotesk'] uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-4 border-l-4 border-green-500 bg-green-500/10">
                  <p className="text-green-400 text-xs font-bold tracking-widest uppercase">
                    Transmission Successful. Data beamed to the pitwall!
                  </p>
                </div>
              )}
              {status === 'error' && (
                <div className="mt-4 p-4 border-l-4 border-[var(--theme-accent)] bg-[var(--theme-accent)]/10">
                  <p className="text-[var(--theme-accent)] text-xs font-bold tracking-widest uppercase">
                    Failed to send transmission. Please check your connection.
                  </p>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
