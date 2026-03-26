import fs from 'fs';

const titles = {
  russell: 'George_Russell_(racing_driver)',
  bearman: 'Oliver_Bearman',
  gasly: 'Pierre_Gasly',
  lawson: 'Liam_Lawson',
  arvid_lindblad: 'Arvid_Lindblad',
  hadjar: 'Isack_Hadjar',
  piastri: 'Oscar_Piastri',
  sainz: 'Carlos_Sainz_Jr.',
  bortoleto: 'Gabriel_Bortoleto',
  colapinto: 'Franco_Colapinto',
  ocon: 'Esteban_Ocon',
  hulkenberg: 'Nico_Hülkenberg',
  bottas: 'Valtteri_Bottas',
  perez: 'Sergio_Pérez',
  alonso: 'Fernando_Alonso',
  stroll: 'Lance_Stroll'
};

async function getImg(title) {
  try {
    const r = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodeURIComponent(title)}`);
    const d = await r.json();
    const page = Object.values(d.query.pages)[0];
    return page.original ? page.original.source : null;
  } catch (e) {
    return null;
  }
}

async function run() {
  const code = [];
  for (const [id, title] of Object.entries(titles)) {
    const img = await getImg(title);
    if (img) {
      code.push(`  ${id}: '${img}',`);
    } else {
      code.push(`  // ${id}: No image found for ${title}`);
    }
  }
  console.log(code.join('\n'));
}

run();
