// Jolpica F1 API — Free, open-source Ergast successor
// Docs: https://github.com/jolpica/jolpica-f1
const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

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
  'New Zealander': '🇳🇿',
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
  'Saudi Arabia': '🇸🇦',
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

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      cache.set(url, { data, timestamp: now });
      return data as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_DELAY * Math.pow(2, attempt)));
      }
    }
  }

  // If all retries failed, return stale cache if available
  if (cached) {
    console.warn(`API failed after ${MAX_RETRIES} retries, using stale cache for: ${url}`);
    return cached.data as T;
  }

  throw lastError || new Error('API request failed after retries');
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
