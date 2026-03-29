// Jolpica F1 API — Free, open-source Ergast successor
// Docs: https://github.com/jolpica/jolpica-f1
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

import { syncToSupabase, fetchFromSupabase } from '../lib/supabase';

// ---------- Type Definitions ----------

export interface ApiDriver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface ApiConstructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface ApiDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: ApiDriver;
  Constructors: ApiConstructor[];
}

export interface ApiConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: ApiConstructor;
}

export interface ApiRaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: ApiDriver;
  Constructor: ApiConstructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: { rank: string; lap: string; Time: { time: string } };
}

export interface ApiCircuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: { lat: string; long: string; locality: string; country: string };
}

export interface ApiRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: ApiCircuit;
  date: string;
  time?: string;
  Results?: ApiRaceResult[];
  FirstPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
}

// ---------- Transformed Types (app-friendly) ----------

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  code: string;
  number: number;
  team: string;
  teamId: string;
  teamColor: string;
  nationality: string;
  dateOfBirth: string;
  wikiUrl: string;
  standingPosition: number;
  seasonPoints: number;
  seasonWins: number;
}

export interface Race {
  id: string;
  round: number;
  name: string;
  circuit: string;
  location: string;
  country: string;
  flag: string;
  date: string;
  time: string;
  completed: boolean;
  isSprint: boolean;
  results: RaceResult[];
}

export interface RaceResult {
  position: number;
  positionText: string;
  driverId: string;
  driverName: string;
  driverCode: string;
  team: string;
  teamId: string;
  grid: number;
  laps: number;
  status: string;
  points: number;
  time: string;
  fastestLap?: string;
}

export interface ConstructorStanding {
  position: number;
  name: string;
  constructorId: string;
  nationality: string;
  points: number;
  wins: number;
  color: string;
}

export interface DriverCareerStats {
  championships: number;
  wins: number;
  poles: number;
  seasons: {
    year: number;
    team: string;
    position: number;
    points: number;
    wins: number;
  }[];
}

// ---------- Team Colors (official-ish) ----------

const TEAM_COLORS: Record<string, string> = {
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  red_bull: '#3671C6',
  aston_martin: '#229971',
  alpine: '#2293D1',
  williams: '#1868DB',
  rb: '#6692FF',
  haas: '#B6BABD',
  audi: '#52E252',
  cadillac: '#C0C0C0',
  sauber: '#52E252',
};

function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] || '#66FCF1';
}

// ---------- Nationality → Flag Emoji ----------

const FLAGS: Record<string, string> = {
  British: '🇬🇧', Dutch: '🇳🇱', Monegasque: '🇲🇨', Spanish: '🇪🇸',
  Australian: '🇦🇺', French: '🇫🇷', German: '🇩🇪', Finnish: '🇫🇮',
  Mexican: '🇲🇽', Canadian: '🇨🇦', Thai: '🇹🇭', Japanese: '🇯🇵',
  Chinese: '🇨🇳', Italian: '🇮🇹', Brazilian: '🇧🇷', Argentine: '🇦🇷',
  'New Zealander': '🇳🇿', American: '🇺🇸', Austrian: '🇦🇹',
  Belgian: '🇧🇪', Swiss: '🇨🇭', Colombian: '🇨🇴', Danish: '🇩🇰',
  Hungarian: '🇭🇺', Indian: '🇮🇳', Indonesian: '🇮🇩', Irish: '🇮🇪',
  Korean: '🇰🇷', Malaysian: '🇲🇾', Polish: '🇵🇱', Portuguese: '🇵🇹',
  Russian: '🇷🇺', South_African: '🇿🇦', Swedish: '🇸🇪', Venezuelan: '🇻🇪',
};

export function getNationalityFlag(nationality: string): string {
  return FLAGS[nationality] || '🏁';
}

// ---------- Country → Flag ----------

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: '🇦🇺', China: '🇨🇳', Japan: '🇯🇵', USA: '🇺🇸',
  Monaco: '🇲🇨', Spain: '🇪🇸', Austria: '🇦🇹', UK: '🇬🇧',
  Belgium: '🇧🇪', Hungary: '🇭🇺', Netherlands: '🇳🇱', Italy: '🇮🇹',
  Azerbaijan: '🇦🇿', Singapore: '🇸🇬', Mexico: '🇲🇽', Brazil: '🇧🇷',
  Qatar: '🇶🇦', UAE: '🇦🇪', Canada: '🇨🇦', Bahrain: '🇧🇭',
  'Saudi Arabia': '🇸🇦', France: '🇫🇷', Germany: '🇩🇪', Portugal: '🇵🇹',
  Argentina: '🇦🇷', 'South Africa': '🇿🇦', Sweden: '🇸🇪', Switzerland: '🇨🇭',
  India: '🇮🇳', Korea: '🇰🇷', Malaysia: '🇲🇾', Morocco: '🇲🇦',
  Turkey: '🇹🇷', Russia: '🇷🇺', Vietnam: '🇻🇳', Indonesia: '🇮🇩',
  'United States': '🇺🇸', 'United Kingdom': '🇬🇧',
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || '🏁';
}

// ---------- Cache ----------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;

async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  const cached = cache.get(url);
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Extract a short cache key from the full URL for Supabase storage
  const cacheKey = url.replace(BASE_URL, '');

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      cache.set(url, { data, timestamp: now });

      // ✅ SYNC: Silently push fresh data to Supabase (fire-and-forget)
      syncToSupabase(cacheKey, data).catch(() => {});

      return data as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY * Math.pow(2, attempt)));
      }
    }
  }

  // If all retries failed, return stale in-memory cache if available
  if (cached) {
    console.warn(`API failed after ${MAX_RETRIES} retries, using stale cache for: ${url}`);
    return cached.data as T;
  }

  // 🛡️ FALLBACK: Jolpica is down & no in-memory cache — try Supabase database
  console.warn(`[Fallback] Jolpica unreachable, querying Supabase for: ${cacheKey}`);
  const supabaseData = await fetchFromSupabase<T>(cacheKey);
  if (supabaseData) {
    // Populate in-memory cache so subsequent calls are instant
    cache.set(url, { data: supabaseData, timestamp: now });
    return supabaseData;
  }

  throw lastError || new Error('API request failed after retries and database fallback');
}

// ---------- API Functions ----------

export async function fetchDriverStandings(): Promise<Driver[]> {
  const data = await fetchWithCache<{
    MRData: {
      StandingsTable: {
        season: string;
        round: string;
        StandingsLists: Array<{ DriverStandings: ApiDriverStanding[] }>;
      };
    };
  }>(`${BASE_URL}/current/driverStandings.json`);

  const standings = data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];

  return standings.map((s) => ({
    id: s.Driver.driverId,
    firstName: s.Driver.givenName === 'Andrea Kimi' ? 'Kimi' : s.Driver.givenName,
    lastName: s.Driver.familyName,
    code: s.Driver.code,
    number: parseInt(s.Driver.permanentNumber, 10),
    team: s.Constructors[0]?.name || 'Unknown',
    teamId: s.Constructors[0]?.constructorId || '',
    teamColor: getTeamColor(s.Constructors[0]?.constructorId || ''),
    nationality: s.Driver.nationality,
    dateOfBirth: s.Driver.dateOfBirth,
    wikiUrl: s.Driver.url,
    standingPosition: parseInt(s.position, 10),
    seasonPoints: parseFloat(s.points),
    seasonWins: parseInt(s.wins, 10),
  }));
}

export async function fetchRaceCalendar(): Promise<Race[]> {
  const data = await fetchWithCache<{
    MRData: { RaceTable: { season: string; Races: ApiRace[] } };
  }>(`${BASE_URL}/current.json`);

  const today = new Date().toISOString().split('T')[0];

  return data.MRData.RaceTable.Races.map((r) => ({
    id: r.Circuit.circuitId,
    round: parseInt(r.round, 10),
    name: r.raceName,
    circuit: r.Circuit.circuitName,
    location: r.Circuit.Location.locality,
    country: r.Circuit.Location.country,
    flag: getCountryFlag(r.Circuit.Location.country),
    date: r.date,
    time: r.time || '',
    completed: r.date < today,
    isSprint: !!r.Sprint,
    results: [],
  }));
}

export async function fetchRaceResults(): Promise<Race[]> {
  const data = await fetchWithCache<{
    MRData: { RaceTable: { season: string; Races: ApiRace[] } };
  }>(`${BASE_URL}/current/results.json?limit=600`);

  return data.MRData.RaceTable.Races.map((r) => ({
    id: r.Circuit.circuitId,
    round: parseInt(r.round, 10),
    name: r.raceName,
    circuit: r.Circuit.circuitName,
    location: r.Circuit.Location.locality,
    country: r.Circuit.Location.country,
    flag: getCountryFlag(r.Circuit.Location.country),
    date: r.date,
    time: r.time || '',
    completed: true,
    isSprint: false,
    results: (r.Results || []).map((res) => ({
      position: parseInt(res.position, 10),
      positionText: res.positionText,
      driverId: res.Driver.driverId,
      driverName: `${res.Driver.givenName === 'Andrea Kimi' ? 'K.' : res.Driver.givenName.charAt(0)}. ${res.Driver.familyName}`,
      driverCode: res.Driver.code,
      team: res.Constructor.name,
      teamId: res.Constructor.constructorId,
      grid: parseInt(res.grid, 10),
      laps: parseInt(res.laps, 10),
      status: res.status,
      points: parseFloat(res.points),
      time: res.Time?.time || res.status,
      fastestLap: res.FastestLap?.Time?.time,
    })),
  }));
}

export async function fetchConstructorStandings(): Promise<ConstructorStanding[]> {
  const data = await fetchWithCache<{
    MRData: {
      StandingsTable: {
        StandingsLists: Array<{ ConstructorStandings: ApiConstructorStanding[] }>;
      };
    };
  }>(`${BASE_URL}/current/constructorStandings.json`);

  const standings = data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];

  return standings.map((s) => ({
    position: parseInt(s.position, 10),
    name: s.Constructor.name,
    constructorId: s.Constructor.constructorId,
    nationality: s.Constructor.nationality,
    points: parseFloat(s.points),
    wins: parseInt(s.wins, 10),
    color: getTeamColor(s.Constructor.constructorId),
  }));
}

export async function fetchCurrentSeason(): Promise<string> {
  const data = await fetchWithCache<{
    MRData: { RaceTable: { season: string } };
  }>(`${BASE_URL}/current.json`);
  return data.MRData.RaceTable.season;
}

export async function fetchCompletedRoundCount(): Promise<number> {
  const data = await fetchWithCache<{
    MRData: { StandingsTable: { round: string } };
  }>(`${BASE_URL}/current/driverStandings.json`);
  return parseInt(data.MRData.StandingsTable.round, 10);
}

export async function fetchDriverCareerStats(driverId: string): Promise<DriverCareerStats> {
  // Fetch total wins, total poles, and all active seasons
  const [winsRes, polesRes, seasonsRes] = await Promise.all([
    fetchWithCache<{ MRData: { total: string } }>(`${BASE_URL}/drivers/${driverId}/results/1.json?limit=1`).catch(() => null),
    fetchWithCache<{ MRData: { total: string } }>(`${BASE_URL}/drivers/${driverId}/qualifying/1.json?limit=1`).catch(() => null),
    fetchWithCache<{ MRData: { SeasonTable: { Seasons: { season: string }[] } } }>(`${BASE_URL}/drivers/${driverId}/seasons.json?limit=100`).catch(() => null)
  ]);

  const wins = winsRes ? parseInt(winsRes.MRData.total, 10) : 0;
  const poles = polesRes ? parseInt(polesRes.MRData.total, 10) : 0;
  const seasonYears = seasonsRes ? seasonsRes.MRData.SeasonTable.Seasons.map(s => s.season) : [];

  // Fetch driverStandings dynamically for every active season year without hitting the global endpoint that is blocked
  const standingsPromises = seasonYears.map(year =>
    fetchWithCache<{ MRData: { StandingsTable: { StandingsLists: any[] } } }>(
      `${BASE_URL}/${year}/drivers/${driverId}/driverStandings.json`
    ).catch(() => null)
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
        
        // Count total championships whenever position === 1 in the standings
        if (pos === 1) championships++;

        seasons.push({
          year: parseInt(seasonYears[i], 10),
          team: s.Constructors[0]?.name || 'Unknown',
          position: pos,
          points: parseFloat(s.points) || 0,
          wins: parseInt(s.wins, 10) || 0
        });
      }
    }
  }

  // Sort strictly with most recent year first
  seasons.sort((a, b) => b.year - a.year);

  return {
    championships,
    wins,
    poles,
    seasons
  };
}

export interface ConstructorSeasonRecord {
  year: number;
  position: number;
  points: number;
  wins: number;
}

export interface ConstructorProfileData {
  constructorId: string;
  name: string;
  nationality: string;
  color: string;
  wikiUrl: string;
  careerChampionships: number;
  careerWins: number;
  careerPodiums: number;
  careerPoles: number;
  careerSeasons: number;
  firstEntry: number;
  teamBase: string;
  teamPrincipal: string;
  heroImage: string;
  seasonHistory: ConstructorSeasonRecord[];
  currentSeason: {
    position: number;
    points: number;
    wins: number;
    drivers: {
      driverId: string;
      code: string;
      givenName: string;
      familyName: string;
    }[];
  };
  previousSeason: {
    year: number;
    position: number;
    points: number;
    wins: number;
    drivers: {
      driverId: string;
      code: string;
      givenName: string;
      familyName: string;
    }[];
  } | null;
}

// ─── All-Time Constructor Metadata (Historical Data) ───
// The Ergast API only provides stats per-season; fetching full history
// for every team would be too slow. These values are sourced from
// official FIA records and are correct as of end-of-2025.
interface ConstructorMeta {
  allTimeChampionships: number;
  allTimePodiums: number;
  allTimePoles: number;
  firstEntry: number;
  teamBase: string;
  teamPrincipal: string;
  heroImage: string;
}

const CONSTRUCTOR_META: Record<string, ConstructorMeta> = {
  ferrari: {
    allTimeChampionships: 16,
    allTimePodiums: 806,
    allTimePoles: 248,
    firstEntry: 1950,
    teamBase: 'Maranello, Italy',
    teamPrincipal: 'Frédéric Vasseur',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Carlos_Sainz_Chinese_GP_2024.jpg',
  },
  mclaren: {
    allTimeChampionships: 8,
    allTimePodiums: 508,
    allTimePoles: 157,
    firstEntry: 1966,
    teamBase: 'Woking, United Kingdom',
    teamPrincipal: 'Andrea Stella',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/d/df/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3805_by_Stepro.jpg',
  },
  red_bull: {
    allTimeChampionships: 6,
    allTimePodiums: 250,
    allTimePoles: 103,
    firstEntry: 2005,
    teamBase: 'Milton Keynes, United Kingdom',
    teamPrincipal: 'Christian Horner',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Max_Verstappen_2024_Chinese_GP.jpg',
  },
  mercedes: {
    allTimeChampionships: 8,
    allTimePodiums: 310,
    allTimePoles: 136,
    firstEntry: 2010,
    teamBase: 'Brackley, United Kingdom',
    teamPrincipal: 'Toto Wolff',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/5/55/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3434_by_Stepro.jpg',
  },
  aston_martin: {
    allTimeChampionships: 0,
    allTimePodiums: 18,
    allTimePoles: 1,
    firstEntry: 2021,
    teamBase: 'Silverstone, United Kingdom',
    teamPrincipal: 'Andy Cowell',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3318_by_Stepro.jpg',
  },
  alpine: {
    allTimeChampionships: 2,
    allTimePodiums: 46,
    allTimePoles: 20,
    firstEntry: 2021,
    teamBase: 'Enstone, United Kingdom',
    teamPrincipal: 'Oliver Oakes',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/40/2024_Spanish_Grand_Prix_%2853811182883%29.jpg',
  },
  williams: {
    allTimeChampionships: 9,
    allTimePodiums: 313,
    allTimePoles: 128,
    firstEntry: 1977,
    teamBase: 'Grove, United Kingdom',
    teamPrincipal: 'James Vowles',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/17/FIA_F1_Austria_2024_Nr._23_Albon.jpg',
  },
  rb: {
    allTimeChampionships: 0,
    allTimePodiums: 2,
    allTimePoles: 1,
    firstEntry: 2006,
    teamBase: 'Faenza, Italy',
    teamPrincipal: 'Laurent Mekies',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Yuki_Tsunoda_Chinese_GP_2024.jpg',
  },
  haas: {
    allTimeChampionships: 0,
    allTimePodiums: 1,
    allTimePoles: 1,
    firstEntry: 2016,
    teamBase: 'Kannapolis, United States',
    teamPrincipal: 'Ayao Komatsu',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/FIA_F1_Austria_2024_Nr._20_Magnussen.jpg',
  },
  audi: {
    allTimeChampionships: 0,
    allTimePodiums: 0,
    allTimePoles: 0,
    firstEntry: 2026,
    teamBase: 'Hinwil, Switzerland',
    teamPrincipal: 'Mattia Binotto',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3314_by_Stepro.jpg',
  },
  sauber: {
    allTimeChampionships: 0,
    allTimePodiums: 28,
    allTimePoles: 1,
    firstEntry: 1993,
    teamBase: 'Hinwil, Switzerland',
    teamPrincipal: 'Mattia Binotto',
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/2024-08-24_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3314_by_Stepro.jpg',
  },
  cadillac: {
    allTimeChampionships: 0,
    allTimePodiums: 0,
    allTimePoles: 0,
    firstEntry: 2026,
    teamBase: 'United States',
    teamPrincipal: 'TBC',
    heroImage: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?q=80&w=1600&auto=format&fit=crop',
  },
};

export async function fetchConstructorProfile(constructorId: string): Promise<ConstructorProfileData | null> {
  const currentStandings = await fetchConstructorStandings();
  const currentStanding = currentStandings.find(s => s.constructorId === constructorId);

  if (!currentStanding) return null;

  const currentYearStr = await fetchCurrentSeason();
  const currentYear = parseInt(currentYearStr, 10);
  const previousYear = currentYear - 1;

  // Fetch all seasons this constructor competed in
  const seasonsRes = await fetchWithCache<{ MRData: { SeasonTable: { Seasons: { season: string }[] } } }>(`${BASE_URL}/constructors/${constructorId}/seasons.json?limit=100`).catch(() => null);
  const seasonYears = seasonsRes?.MRData.SeasonTable.Seasons.map(s => s.season) || [];

  // Fetch all-time standings for every season in parallel (last 15 seasons for performance)
  const historyYears = seasonYears.slice(-15);
  const historyPromises = historyYears.map(year =>
    fetchWithCache<{ MRData: { StandingsTable: { StandingsLists: any[] } } }>(`${BASE_URL}/${year}/constructors/${constructorId}/constructorStandings.json`).catch(() => null)
  );

  // Also get total career wins from results endpoint
  const totalWinsRes = await fetchWithCache<{ MRData: { total: string } }>(`${BASE_URL}/constructors/${constructorId}/results/1.json?limit=1`).catch(() => null);

  // Get constructor wiki URL
  const constructorInfoRes = await fetchWithCache<{ MRData: { ConstructorTable: { Constructors: any[] } } }>(`${BASE_URL}/constructors/${constructorId}.json`).catch(() => null);
  const wikiUrl = constructorInfoRes?.MRData.ConstructorTable.Constructors[0]?.url || '';

  // Drivers for current year — use driver standings to get only race drivers (excludes reserve/test drivers)
  const currentDriverStandingsRes = await fetchWithCache<{
    MRData: { StandingsTable: { StandingsLists: Array<{ DriverStandings: Array<{ Driver: ApiDriver; Constructors: ApiConstructor[] }> }> } }
  }>(`${BASE_URL}/current/driverStandings.json`).catch(() => null);

  // Previous year standings and drivers
  const prevStandingRes = await fetchWithCache<{ MRData: { StandingsTable: { StandingsLists: any[] } } }>(`${BASE_URL}/${previousYear}/constructors/${constructorId}/constructorStandings.json`).catch(() => null);
  const prevDriverStandingsRes = await fetchWithCache<{
    MRData: { StandingsTable: { StandingsLists: Array<{ DriverStandings: Array<{ Driver: ApiDriver; Constructors: ApiConstructor[] }> }> } }
  }>(`${BASE_URL}/${previousYear}/driverStandings.json`).catch(() => null);

  // Await all history
  const historyResults = await Promise.all(historyPromises);

  // Build season history
  const seasonHistory: ConstructorSeasonRecord[] = [];

  for (let i = 0; i < historyYears.length; i++) {
    const res = historyResults[i];
    const list = res?.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings;
    if (list && list.length > 0) {
      const s = list[0];
      const pos = parseInt(s.position, 10);
      seasonHistory.push({
        year: parseInt(historyYears[i], 10),
        position: pos,
        points: parseFloat(s.points) || 0,
        wins: parseInt(s.wins, 10) || 0,
      });
    }
  }
  seasonHistory.sort((a, b) => b.year - a.year);

  // Filter to only race drivers for this constructor (from standings, not the general drivers endpoint which includes reserves)
  const allCurrentStandings = currentDriverStandingsRes?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  const currentDrivers = allCurrentStandings
    .filter(ds => ds.Constructors.some(c => c.constructorId === constructorId))
    .map(ds => ({
      driverId: ds.Driver.driverId,
      code: ds.Driver.code,
      givenName: ds.Driver.givenName === 'Andrea Kimi' ? 'Kimi' : ds.Driver.givenName,
      familyName: ds.Driver.familyName,
    }));

  let previousSeasonDetails = null;
  if (prevStandingRes && prevStandingRes.MRData.StandingsTable.StandingsLists.length > 0) {
    const sList = prevStandingRes.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    if (sList && sList.length > 0) {
      const s = sList[0];
      const allPrevStandings = prevDriverStandingsRes?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
      const prevDrivers = allPrevStandings
        .filter(ds => ds.Constructors.some(c => c.constructorId === constructorId))
        .map(ds => ({
          driverId: ds.Driver.driverId,
          code: ds.Driver.code,
          givenName: ds.Driver.givenName,
          familyName: ds.Driver.familyName,
        }));
      previousSeasonDetails = {
        year: previousYear,
        position: parseInt(s.position, 10),
        points: parseFloat(s.points),
        wins: parseInt(s.wins, 10),
        drivers: prevDrivers,
      };
    }
  }

  // Retrieve hardcoded all-time metadata (official FIA records)
  const meta = CONSTRUCTOR_META[constructorId];
  const careerWinsFromApi = totalWinsRes ? parseInt(totalWinsRes.MRData.total, 10) : 0;

  return {
    constructorId: currentStanding.constructorId,
    name: currentStanding.name,
    nationality: currentStanding.nationality,
    color: currentStanding.color,
    wikiUrl,
    careerChampionships: meta?.allTimeChampionships ?? 0,
    careerWins: careerWinsFromApi,
    careerPodiums: meta?.allTimePodiums ?? 0,
    careerPoles: meta?.allTimePoles ?? 0,
    careerSeasons: seasonYears.length,
    firstEntry: meta?.firstEntry ?? (seasonYears.length > 0 ? parseInt(seasonYears[0], 10) : 0),
    teamBase: meta?.teamBase ?? '',
    teamPrincipal: meta?.teamPrincipal ?? '',
    heroImage: meta?.heroImage ?? '',
    seasonHistory,
    currentSeason: {
      position: currentStanding.position,
      points: currentStanding.points,
      wins: currentStanding.wins,
      drivers: currentDrivers,
    },
    previousSeason: previousSeasonDetails,
  };
}

export interface NewsItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link: string;
    type: string;
    length: number;
  };
}

export async function fetchLiveNews(): Promise<NewsItem[]> {
  try {
    const data = await fetchWithCache<{ items: NewsItem[] }>('https://api.rss2json.com/v1/api.json?rss_url=https://www.motorsport.com/rss/f1/news/');
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch live news:', err);
    return [];
  }
}

export interface ConstructorSeasonDetailsData {
  constructorId: string;
  name: string;
  year: number;
  position: number;
  points: number;
  wins: number;
  teamPrincipal: string;
  heroImage: string;
  color: string;
  drivers: {
    driverId: string;
    givenName: string;
    familyName: string;
    code: string;
    position: number;
    points: number;
    wins: number;
  }[];
}

export async function fetchConstructorSeasonDetails(constructorId: string, year: string): Promise<ConstructorSeasonDetailsData | null> {
  const standingsStr = `${BASE_URL}/${year}/constructors/${constructorId}/constructorStandings.json`;
  const driversStr = `${BASE_URL}/${year}/driverStandings.json`;

  const [standingsRes, driverStandingsRes] = await Promise.all([
    fetchWithCache<{ MRData: { StandingsTable: { StandingsLists: any[] } } }>(standingsStr).catch(() => null),
    fetchWithCache<{ MRData: { StandingsTable: { StandingsLists: Array<{ DriverStandings: Array<{ Driver: ApiDriver; Constructors: ApiConstructor[]; position: string; points: string; wins: string; }> }> } } }>(driversStr).catch(() => null)
  ]);

  if (!standingsRes || standingsRes.MRData.StandingsTable.StandingsLists.length === 0) {
    return null;
  }

  const constructorStandings = standingsRes.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  if (!constructorStandings || constructorStandings.length === 0) return null;

  const s = constructorStandings[0];
  const meta = CONSTRUCTOR_META[constructorId];
  
  // Extract driver details
  const allDriversInYear = driverStandingsRes?.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
  const constructorDrivers = allDriversInYear
    .filter(ds => ds.Constructors.some(c => c.constructorId === constructorId))
    .map(ds => ({
      driverId: ds.Driver.driverId,
      givenName: ds.Driver.givenName,
      familyName: ds.Driver.familyName,
      code: ds.Driver.code || ds.Driver.familyName.substring(0, 3).toUpperCase(),
      position: parseInt(ds.position, 10),
      points: parseFloat(ds.points),
      wins: parseInt(ds.wins, 10)
    }));

  return {
    constructorId: constructorId,
    name: s.Constructor.name,
    year: parseInt(year, 10),
    position: parseInt(s.position, 10),
    points: parseFloat(s.points),
    wins: parseInt(s.wins, 10),
    teamPrincipal: meta?.teamPrincipal ?? 'Data Unavailable',
    heroImage: meta?.heroImage ?? '',
    color: '#66FCF1',
    drivers: constructorDrivers,
  };
}

// ---------- Circuit Types ----------

export interface CircuitInfo {
  circuitId: string;
  circuitName: string;
  lat: string;
  long: string;
  locality: string;
  country: string;
  wikiUrl: string;
}

export interface PodiumEntry {
  position: number;
  driverId: string;
  driverName: string;
  driverCode: string;
  team: string;
  teamId: string;
  time: string;
}

export interface CircuitRaceYear {
  season: number;
  round: number;
  raceName: string;
  date: string;
  podium: PodiumEntry[];
}

export interface CircuitDetail {
  circuit: CircuitInfo;
  totalRaces: number;
  firstRaceYear: number;
  lastRaceYear: number;
  raceHistory: CircuitRaceYear[];
}

// ---------- Season Calendar Types ----------

export interface DetailedCalendarRace {
  id: string;
  round: number;
  name: string;
  circuit: string;
  circuitId: string;
  location: string;
  country: string;
  flag: string;
  date: string;
  time: string;
  completed: boolean;
  isSprint: boolean;
  firstPractice?: { date: string; time: string };
  qualifying?: { date: string; time: string };
  sprint?: { date: string; time: string };
  podium: PodiumEntry[];
}

// ---------- Circuit API Functions ----------

export async function fetchAllCircuits(): Promise<CircuitInfo[]> {
  // Fetch all circuits with pagination (API default limit is 30)
  const firstPage = await fetchWithCache<{
    MRData: { total: string; CircuitTable: { Circuits: ApiCircuit[] } };
  }>(`${BASE_URL}/circuits.json?limit=100`);

  let allCircuits = firstPage.MRData.CircuitTable.Circuits;
  const total = parseInt(firstPage.MRData.total, 10);

  // If more than 100, fetch remaining pages
  if (total > 100) {
    const remaining = await fetchWithCache<{
      MRData: { CircuitTable: { Circuits: ApiCircuit[] } };
    }>(`${BASE_URL}/circuits.json?limit=100&offset=100`);
    allCircuits = [...allCircuits, ...remaining.MRData.CircuitTable.Circuits];
  }

  return allCircuits.map((c) => ({
    circuitId: c.circuitId,
    circuitName: c.circuitName,
    lat: c.Location.lat,
    long: c.Location.long,
    locality: c.Location.locality,
    country: c.Location.country,
    wikiUrl: c.url,
  }));
}

export async function fetchCircuitRaceHistory(circuitId: string): Promise<CircuitDetail> {
  // Fetch P1, P2, P3 results separately — much fewer rows than fetching all results
  // e.g., Silverstone has ~60 winners vs 1385 total result rows
  const [p1Data, p2Data, p3Data, circuitData] = await Promise.all([
    fetchWithCache<{
      MRData: { RaceTable: { Races: ApiRace[] } };
    }>(`${BASE_URL}/circuits/${circuitId}/results/1.json?limit=200`),
    fetchWithCache<{
      MRData: { RaceTable: { Races: ApiRace[] } };
    }>(`${BASE_URL}/circuits/${circuitId}/results/2.json?limit=200`),
    fetchWithCache<{
      MRData: { RaceTable: { Races: ApiRace[] } };
    }>(`${BASE_URL}/circuits/${circuitId}/results/3.json?limit=200`),
    fetchWithCache<{
      MRData: { CircuitTable: { Circuits: ApiCircuit[] } };
    }>(`${BASE_URL}/circuits/${circuitId}.json`),
  ]);

  const circuitInfo = circuitData.MRData.CircuitTable.Circuits[0];

  // Build a map of season → podium entries
  const podiumMap = new Map<string, { race: ApiRace; podium: PodiumEntry[] }>();

  const processResults = (races: ApiRace[]) => {
    for (const race of races) {
      const key = `${race.season}-${race.round}`;
      if (!podiumMap.has(key)) {
        podiumMap.set(key, { race, podium: [] });
      }
      const entry = podiumMap.get(key)!;
      for (const res of race.Results || []) {
        const pos = parseInt(res.position, 10);
        if (pos <= 3 && !entry.podium.some(p => p.position === pos)) {
          entry.podium.push({
            position: pos,
            driverId: res.Driver.driverId,
            driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
            driverCode: res.Driver.code || res.Driver.familyName.substring(0, 3).toUpperCase(),
            team: res.Constructor.name,
            teamId: res.Constructor.constructorId,
            time: res.Time?.time || res.status || '',
          });
        }
      }
    }
  };

  processResults(p1Data.MRData.RaceTable.Races);
  processResults(p2Data.MRData.RaceTable.Races);
  processResults(p3Data.MRData.RaceTable.Races);

  const raceHistory: CircuitRaceYear[] = Array.from(podiumMap.values()).map(({ race, podium }) => ({
    season: parseInt(race.season, 10),
    round: parseInt(race.round, 10),
    raceName: race.raceName,
    date: race.date,
    podium: podium.sort((a, b) => a.position - b.position),
  }));

  // Sort by season descending (most recent first)
  raceHistory.sort((a, b) => b.season - a.season);

  const seasons = raceHistory.map((r) => r.season);

  return {
    circuit: {
      circuitId: circuitInfo.circuitId,
      circuitName: circuitInfo.circuitName,
      lat: circuitInfo.Location.lat,
      long: circuitInfo.Location.long,
      locality: circuitInfo.Location.locality,
      country: circuitInfo.Location.country,
      wikiUrl: circuitInfo.url,
    },
    totalRaces: raceHistory.length,
    firstRaceYear: seasons.length > 0 ? Math.min(...seasons) : 0,
    lastRaceYear: seasons.length > 0 ? Math.max(...seasons) : 0,
    raceHistory,
  };
}

// ---------- Season Calendar API ----------

export async function fetchSeasonCalendarDetailed(): Promise<DetailedCalendarRace[]> {
  // Fetch both the calendar (with session times) and results in parallel
  const [calendarData, resultsData] = await Promise.all([
    fetchWithCache<{
      MRData: { RaceTable: { season: string; Races: ApiRace[] } };
    }>(`${BASE_URL}/current.json`),
    fetchWithCache<{
      MRData: { RaceTable: { Races: ApiRace[] } };
    }>(`${BASE_URL}/current/results.json?limit=600`),
  ]);

  const calendarRaces = calendarData.MRData.RaceTable.Races;
  const resultRaces = resultsData.MRData.RaceTable.Races;

  // Build a map of round → results
  const resultsMap = new Map<string, ApiRace>();
  for (const r of resultRaces) {
    resultsMap.set(r.round, r);
  }

  const today = new Date().toISOString().split('T')[0];

  return calendarRaces.map((r) => {
    const resultRace = resultsMap.get(r.round);
    const podium: PodiumEntry[] = [];

    if (resultRace && resultRace.Results) {
      for (const res of resultRace.Results) {
        const pos = parseInt(res.position, 10);
        if (pos <= 3) {
          podium.push({
            position: pos,
            driverId: res.Driver.driverId,
            driverName: `${res.Driver.givenName} ${res.Driver.familyName}`,
            driverCode: res.Driver.code || res.Driver.familyName.substring(0, 3).toUpperCase(),
            team: res.Constructor.name,
            teamId: res.Constructor.constructorId,
            time: res.Time?.time || res.status || '',
          });
        }
      }
      podium.sort((a, b) => a.position - b.position);
    }

    return {
      id: r.Circuit.circuitId,
      round: parseInt(r.round, 10),
      name: r.raceName,
      circuit: r.Circuit.circuitName,
      circuitId: r.Circuit.circuitId,
      location: r.Circuit.Location.locality,
      country: r.Circuit.Location.country,
      flag: getCountryFlag(r.Circuit.Location.country),
      date: r.date,
      time: r.time || '',
      completed: r.date < today,
      isSprint: !!r.Sprint,
      firstPractice: r.FirstPractice ? { date: r.FirstPractice.date, time: r.FirstPractice.time } : undefined,
      qualifying: r.Qualifying ? { date: r.Qualifying.date, time: r.Qualifying.time } : undefined,
      sprint: r.Sprint ? { date: r.Sprint.date, time: r.Sprint.time } : undefined,
      podium,
    };
  });
}
