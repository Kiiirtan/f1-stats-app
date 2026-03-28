async function debugSilverstone() {
  const title = 'Silverstone_Circuit';
  
  const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=images&imlimit=100&format=json&origin=*`);
  const json = await res.json();
  const pages = json.query?.pages;
  const pageId = Object.keys(pages)[0];
  const images = pages[pageId].images || [];

  console.log('ALL images on Silverstone Wikipedia page:');
  images.forEach(img => console.log(' -', img.title));
  
  const blocklist = [
    'ambox', 'flag', 'icon', 'logo', 'symbol', 'question',
    'arrow', 'edit-clear', 'commons', 'wikimedia', 'stub',
    'star', 'lock', 'portal', 'nuvola', 'button', 'badge',
    'medal', 'pictogram', 'sign', 'wikidata', 'merge',
    'redirect', 'category', 'talk', 'move', 'protect',
  ];
  
  const svgCandidates = images
    .map(img => img.title)
    .filter(t => {
      const lower = t.toLowerCase();
      if (!lower.endsWith('.svg')) return false;
      return !blocklist.some(word => lower.includes(word));
    });

  console.log('\nFiltered SVG candidates (after blocklist):');
  svgCandidates.forEach(c => console.log(' -', c));
  
  // Score them
  for (const img of svgCandidates) {
    const lower = img.toLowerCase();
    let score = 0;
    if (lower.includes('circuit')) score += 2;
    if (lower.includes('map')) score += 2;
    if (lower.includes('track')) score += 2;
    if (lower.includes('layout')) score += 2;
    if (lower.includes('silverstone')) score += 3;
    console.log(`  Score ${score}: ${img}`);
  }
}

debugSilverstone();
