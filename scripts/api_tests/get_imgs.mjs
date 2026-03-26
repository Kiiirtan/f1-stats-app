import fs from 'fs';

async function getImg(title) {
  const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${title}`);
  const d = await r.json();
  const page = Object.values(d.query.pages)[0];
  console.log(`${title}: ${page.original ? page.original.source : 'None'}`);
}

await getImg('Andrea_Kimi_Antonelli');
await getImg('Alex_Albon');
