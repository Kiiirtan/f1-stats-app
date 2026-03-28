const circuits = [
  'Autodromo_Nazionale_Monza', // testing monza
  'Circuit_de_Spa-Francorchamps'
];

async function testImages() {
  for (const title of circuits) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=images&imlimit=50&format=json&origin=*`);
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images || [];
    
    console.log(`--- ${title} ---`);
    const svgTracks = images
      .map(img => img.title)
      .filter(t => t.toLowerCase().endsWith('.svg') && !t.includes('Ambox') && !t.includes('Flag') && !t.includes('Icon'));
    console.log('SVG Candidates:', svgTracks);
  }
}

testImages();
