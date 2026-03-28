async function getTrackMapViaWikidata(title) {
  try {
    // 1. Get Wikidata ID from Wikipedia title
    const res1 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${title}&format=json&origin=*`);
    const json1 = await res1.json();
    const pages = json1.query?.pages;
    if (!pages) return null;
    const pageId = Object.keys(pages)[0];
    const wikidataId = pages[pageId].pageprops?.wikibase_item;
    
    if (!wikidataId) return null;

    // 2. Fetch Wikidata entity
    const res2 = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
    const json2 = await res2.json();
    const entity = json2.entities?.[wikidataId];
    if (!entity) return null;

    // P3311 is "route map", P18 is "image". Fallback to P18 if route map isn't found.
    const routeMapClaim = entity.claims?.P3311?.[0] || entity.claims?.P18?.[0];
    if (!routeMapClaim) return null;

    const filename = routeMapClaim.mainsnak?.datavalue?.value;
    if (!filename) return null;

    // 3. Construct direct file path
    return `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
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
    const mapUrl = await getTrackMapViaWikidata(c);
    console.log(`${c} -> ${mapUrl}`);
  }
}

test();
