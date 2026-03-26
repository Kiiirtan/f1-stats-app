import fs from 'fs';

async function run() {
  const standingsRes = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json');
  const d = await standingsRes.json();
  const drivers = d.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  
  const map = {};
  for (const s of drivers) {
    const dId = s.Driver.driverId;
    const wikiUrl = s.Driver.url;
    const title = wikiUrl.split('/').pop();
    
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=600`);
      const wikiData = await wikiRes.json();
      const pages = wikiData.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        map[dId] = pages[pageId].thumbnail.source;
      } else {
        map[dId] = 'NO_IMAGE';
      }
    } catch(e) {
      map[dId] = 'ERROR';
    }
  }
  fs.writeFileSync('drivers_map.json', JSON.stringify(map, null, 2));
}
run();
