// F1 Stats — Automatic Supabase Sync Script
// Fetches all key Jolpica F1 API endpoints and upserts them into the Supabase api_cache table.
// Designed to be run by GitHub Actions on a cron schedule (every 30 minutes).

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

// These are the critical endpoints that power 90%+ of the app
const ENDPOINTS = [
  '/current/driverStandings.json',
  '/current.json',
  '/current/results.json?limit=600',
  '/current/constructorStandings.json',
];

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

async function upsertToSupabase(endpoint, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/api_cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      endpoint,
      data,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upsert failed for ${endpoint}: ${res.status} ${text}`);
  }
}

async function syncEndpoint(endpoint) {
  const url = `${JOLPICA_BASE}${endpoint}`;
  console.log(`⏳ Fetching: ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Jolpica API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  // Use the endpoint path (without query params for cleaner keys) as the cache key
  const cacheKey = endpoint;
  
  await upsertToSupabase(cacheKey, data);
  console.log(`✅ Synced: ${cacheKey}`);
}

async function main() {
  console.log('🏎️  F1 Stats — Starting database sync...');
  console.log(`📅 Time: ${new Date().toISOString()}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const endpoint of ENDPOINTS) {
    try {
      await syncEndpoint(endpoint);
      successCount++;
    } catch (err) {
      console.error(`❌ Failed: ${endpoint} — ${err.message}`);
      failCount++;
    }
    // Small delay to be respectful to the API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('');
  console.log(`🏁 Sync complete: ${successCount} succeeded, ${failCount} failed`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

main();
