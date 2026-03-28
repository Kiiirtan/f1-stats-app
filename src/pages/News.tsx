import { useState, useEffect } from 'react';
import { fetchLiveNews, type NewsItem } from '../data/api';
import DataState from '../components/ui/DataState';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=1600&auto=format&fit=crop";

function getNewsImage(article: NewsItem): string {
  // 1. Prefer RSS enclosure (usually highest quality)
  if (article.enclosure?.link && article.enclosure.link.startsWith('http')) {
    return article.enclosure.link;
  }

  // 2. Use thumbnail if provided
  if (article.thumbnail && article.thumbnail.startsWith('http')) {
    // Motorsport.com thumbnails are sometimes low-res — try upgrading
    return article.thumbnail.replace(/\/s\d+\//, '/s1200/').replace(/w_\d+/, 'w_1200');
  }

  // 3. Extract first <img> src from HTML content as last resort
  if (article.content) {
    const imgMatch = article.content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1] && imgMatch[1].startsWith('http')) {
      return imgMatch[1];
    }
  }

  // 4. Fallback to a generic F1 themed image
  return FALLBACK_IMG;
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchLiveNews()
      .then((data) => {
        if (mounted) {
          if (data && data.length > 0) {
            setNews(data);
          } else {
            setError(true);
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex justify-center items-center min-h-[80vh]">
        <div className="w-16 h-1 bg-primary-container animate-pulse"></div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <DataState 
          type="error" 
          title="FEED UNAVAILABLE" 
          message="Unable to load live news from Motorsport F1 feed right now. Please try again later."
          onAction={() => window.location.reload()}
          actionText="RETRY"
        />
      </div>
    );
  }

  const featuredArticle = news[0];
  const gridArticles = news.slice(1);

  return (
    <div className="pt-24 pb-20 px-6 max-w-[1600px] mx-auto w-full relative z-10">
      
      <div className="mb-12 border-b border-surface-container-high pb-4 flex items-center justify-between">
        <h1 className="font-headline font-black uppercase italic text-4xl text-white tracking-widest">Live Updates</h1>
        <span className="bg-primary/20 text-primary border border-primary/40 px-3 py-1 font-mono text-[10px] tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Motorsport.com Feed
        </span>
      </div>

      {featuredArticle && (
        <a href={featuredArticle.link} target="_blank" rel="noopener noreferrer" className="block mb-16 outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="relative group overflow-hidden rounded-sm cursor-pointer border border-outline-variant/10">
            <div className="absolute inset-0 z-0">
              <img 
                src={getNewsImage(featuredArticle)} 
                alt={featuredArticle.title}
                className="w-full h-full object-cover origin-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            
            <div className="relative z-10 p-8 md:p-16 flex flex-col justify-end min-h-[500px] md:min-h-[600px] max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-white text-black px-3 py-1 font-label text-[10px] font-black tracking-[0.2em] uppercase">
                  BREAKING
                </span>
                <span className="font-mono text-sm text-white/70">
                  {new Date(featuredArticle.pubDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              
              <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter text-white mb-6 group-hover:text-primary transition-colors duration-500">
                {featuredArticle.title}
              </h1>
              
              <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed mb-8 max-w-3xl line-clamp-3 md:line-clamp-none">
                {stripHtml(featuredArticle.description)}
              </p>
              
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform w-max">
                Read Full Story
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </div>
            </div>
          </div>
        </a>
      )}

      {/* Grid Articles */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {gridArticles.map((article: NewsItem, idx: number) => (
          <a
            href={article.link}
            target="_blank" 
            rel="noopener noreferrer"
            key={idx} 
            className="group flex flex-col bg-surface-container-low border border-outline-variant/10 cursor-pointer hover:border-primary/50 hover:bg-surface transition-all duration-300 relative overflow-hidden h-full focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative h-64 overflow-hidden bg-surface-container-highest">
              <img 
                src={getNewsImage(article)} 
                alt={article.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
              />
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] text-primary block">
                  {new Date(article.pubDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                {article.author && (
                  <span className="font-label text-[9px] uppercase tracking-widest text-white/30 truncate max-w-[120px]">
                    BY {article.author}
                  </span>
                )}
              </div>
              
              <h3 className="font-headline text-2xl font-black italic uppercase leading-tight mb-4 group-hover:text-primary transition-colors text-white line-clamp-3">
                {article.title}
              </h3>
              
              <p className="font-body text-sm text-on-surface-variant font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                {stripHtml(article.description)}
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-label text-[10px] uppercase tracking-widest text-white/40">Read on Motorsport</span>
                <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">call_made</span>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500 ease-out"></div>
          </a>
        ))}
      </section>
    </div>
  );
}
