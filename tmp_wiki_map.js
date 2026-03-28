async function getTrackMap(title) {
  try {
    // 1. Get all images on the page
    const res1 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=images&imlimit=100&format=json&origin=*`);
    const json1 = await res1.json();
    const pages = json1.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images || [];

    // Filter potential track maps
    const candidates = images
      .map(img => img.title)
      .filter(t => {
        const lower = t.toLowerCase();
        return lower.endsWith('.svg') && 
              !lower.includes('ambox') && 
              !lower.includes('flag') && 
              !lower.includes('icon') &&
              !lower.includes('logo') &&
              !lower.includes('symbol') &&
              !lower.includes('question') &&
              !lower.includes('arrow');
      });

    // Score candidates based on keywords
    let bestImage = null;
    let highestScore = -1;

    for (const img of candidates) {
      const lower = img.toLowerCase();
      let score = 0;
      if (lower.includes('circuit')) score += 2;
      if (lower.includes('map')) score += 2;
      if (lower.includes('track')) score += 2;
      if (lower.includes('layout')) score += 2;
      
      const titleLower = title.replace(/_/g, ' ').toLowerCase();
      if (lower.includes(titleLower.split(' ')[0])) score += 3; // e.g. "Monza"

      if (score > highestScore) {
        highestScore = score;
        bestImage = img;
      }
    }

    if (!bestImage) return null;

    // 2. Fetch the URL for the best image
    const res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestImage)}&prop=imageinfo&iiprop=url&format=json&origin=*`);
    const json2 = await res2.json();
    const imgPages = json2.query?.pages;
    if (!imgPages) return null;
    const imgPageId = Object.keys(imgPages)[0];
    const url = imgPages[imgPageId].imageinfo?.[0]?.url;

    return url;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function test() {
  const circuits = [
    'Silverstone_Circuit',
    'Circuit_de_Monaco',
    'Suzuka_International_Racing_Course',
    'Circuit_de_Spa-Francorchamps',
    'Autodromo_Nazionale_Monza',
    'Indianapolis_Motor_Speedway',
    'Nürburgring'
  ];

  for (const c of circuits) {
    const mapUrl = await getTrackMap(c);
    console.log(`${c} -> ${mapUrl}`);
  }
}

test();
