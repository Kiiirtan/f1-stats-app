import fs from 'fs';

async function fetchDriverData() {
  const r = await fetch('https://api.jolpi.ca/ergast/f1/drivers/alonso/driverStandings.json');
  const d = await r.json();
  const lists = d.MRData.StandingsTable.StandingsLists.slice(-2); // get last 2 seasons
  console.log(JSON.stringify(lists, null, 2));
}

fetchDriverData();
