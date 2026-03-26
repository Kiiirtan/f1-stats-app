import fs from 'fs';
async function getImg(title) {
  const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${title}`);
  const d = await r.json();
  const page = Object.values(d.query.pages)[0];
  return page.original ? page.original.source : 'None';
}
(async () => {
const obj = {
  albon: await getImg('Alex_Albon'),
  antonelli: await getImg('Kimi_Antonelli')
};
fs.writeFileSync('urls.json', JSON.stringify(obj, null, 2));
})();
