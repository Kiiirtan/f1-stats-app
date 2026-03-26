import fs from 'fs';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const driverId = 'alonso';

async function fetchDriverCareerStats() {
  // Fetch total wins, poles, and seasons competed
  const [winsRes, polesRes, seasonsRes] = await Promise.all([
    fetch(`${BASE_URL}/drivers/${driverId}/results/1.json?limit=1`).then(r=>r.json()),
    fetch(`${BASE_URL}/drivers/${driverId}/qualifying/1.json?limit=1`).then(r=>r.json()),
    fetch(`${BASE_URL}/drivers/${driverId}/seasons.json?limit=100`).then(r=>r.json())
  ]);

  const wins = parseInt(winsRes.MRData.total, 10);
  const poles = parseInt(polesRes.MRData.total, 10);
  const seasonYears = seasonsRes.MRData.SeasonTable.Seasons.map(s => s.season);
  
  console.log(`Wins: ${wins}, Poles: ${poles}, Seasons: ${seasonYears.length}`);

  // Fetch standings for all these years
  const standingsPromises = seasonYears.map(year => 
    fetch(`${BASE_URL}/${year}/drivers/${driverId}/driverStandings.json`)
      .then(r => r.json())
      .catch(() => null)
  );

  const standingsResults = await Promise.all(standingsPromises);
  
  let championships = 0;
  const seasons = [];

  for (let i = 0; i < seasonYears.length; i++) {
    const res = standingsResults[i];
    if (res && res.MRData && res.MRData.StandingsTable.StandingsLists[0]) {
      const list = res.MRData.StandingsTable.StandingsLists[0];
      if (list.DriverStandings && list.DriverStandings[0]) {
        const s = list.DriverStandings[0];
        const pos = parseInt(s.position, 10);
        if (pos === 1) championships++;
        
        seasons.push({
          year: parseInt(seasonYears[i], 10),
          team: s.Constructors[0]?.name || 'Unknown',
          position: pos,
          points: parseFloat(s.points),
          wins: parseInt(s.wins, 10)
        });
      }
    }
  }

  // Sort most recent first
  seasons.sort((a, b) => b.year - a.year);
  console.log(`Championships: ${championships}`);
  console.log('Recent seasons:', seasons.slice(0, 3));
}

fetchDriverCareerStats().catch(console.error);
