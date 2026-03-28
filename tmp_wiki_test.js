const circuits = [
  'Silverstone_Circuit',
  'Circuit_de_Monaco',
  'Suzuka_International_Racing_Course',
  'Circuit_de_Spa-Francorchamps',
  'Autodromo_Nazionale_Monza'
];

async function testCircuits() {
  for (const c of circuits) {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${c}`);
    const json = await res.json();
    console.log(`Circuit: ${c}`);
    console.log(`Thumbnail:`, json.thumbnail?.source);
  }
}

testCircuits().catch(console.error);
