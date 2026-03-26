import { describe, it, expect, vi, beforeEach } from 'vitest';

// Each test file gets its own module instance thanks to vi.hoisted + vi.mock
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Import AFTER stubbing fetch
import {
  fetchDriverStandings,
  fetchRaceCalendar,
  fetchRaceResults,
  fetchConstructorStandings,
  fetchCurrentSeason,
  fetchCompletedRoundCount,
  getNationalityFlag,
} from '../data/api';

// We need to reset modules between tests to clear the in-memory cache
beforeEach(() => {
  mockFetch.mockReset();
  // vitest's module cache is per-file, but the api.ts cache is a module-level Map.
  // We work around this by using unique URLs (the api module uses fixed URLs, so
  // we rely on the cache being cold on first call, then warm on repeat calls).
});

// ---------- Helper: create mock API responses ----------

function mockDriverStandingsResponse() {
  return {
    MRData: {
      StandingsTable: {
        season: '2026',
        round: '3',
        StandingsLists: [
          {
            DriverStandings: [
              {
                position: '1',
                positionText: '1',
                points: '75',
                wins: '3',
                Driver: {
                  driverId: 'verstappen',
                  permanentNumber: '1',
                  code: 'VER',
                  url: 'https://en.wikipedia.org/wiki/Max_Verstappen',
                  givenName: 'Max',
                  familyName: 'Verstappen',
                  dateOfBirth: '1997-09-30',
                  nationality: 'Dutch',
                },
                Constructors: [
                  {
                    constructorId: 'red_bull',
                    url: 'https://en.wikipedia.org/wiki/Red_Bull_Racing',
                    name: 'Red Bull',
                    nationality: 'Austrian',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };
}

function mockRaceCalendarResponse() {
  return {
    MRData: {
      RaceTable: {
        season: '2026',
        Races: [
          {
            season: '2026',
            round: '1',
            url: 'https://example.com',
            raceName: 'Australian Grand Prix',
            Circuit: {
              circuitId: 'albert_park',
              url: 'https://example.com',
              circuitName: 'Albert Park Grand Prix Circuit',
              Location: { lat: '-37.8497', long: '144.968', locality: 'Melbourne', country: 'Australia' },
            },
            date: '2026-03-15',
            time: '05:00:00Z',
          },
        ],
      },
    },
  };
}

function mockRaceResultsResponse() {
  return {
    MRData: {
      RaceTable: {
        season: '2026',
        Races: [
          {
            season: '2026',
            round: '1',
            url: 'https://example.com',
            raceName: 'Australian Grand Prix',
            Circuit: {
              circuitId: 'albert_park',
              url: 'https://example.com',
              circuitName: 'Albert Park Grand Prix Circuit',
              Location: { lat: '-37.8497', long: '144.968', locality: 'Melbourne', country: 'Australia' },
            },
            date: '2026-03-15',
            time: '05:00:00Z',
            Results: [
              {
                number: '1',
                position: '1',
                positionText: '1',
                points: '25',
                Driver: {
                  driverId: 'verstappen',
                  permanentNumber: '1',
                  code: 'VER',
                  url: 'https://example.com',
                  givenName: 'Max',
                  familyName: 'Verstappen',
                  dateOfBirth: '1997-09-30',
                  nationality: 'Dutch',
                },
                Constructor: {
                  constructorId: 'red_bull',
                  url: 'https://example.com',
                  name: 'Red Bull',
                  nationality: 'Austrian',
                },
                grid: '1',
                laps: '57',
                status: 'Finished',
                Time: { millis: '5544000', time: '1:32:24.000' },
                FastestLap: { rank: '1', lap: '42', Time: { time: '1:20.235' } },
              },
            ],
          },
        ],
      },
    },
  };
}

function mockConstructorStandingsResponse() {
  return {
    MRData: {
      StandingsTable: {
        StandingsLists: [
          {
            ConstructorStandings: [
              {
                position: '1',
                positionText: '1',
                points: '150',
                wins: '3',
                Constructor: {
                  constructorId: 'red_bull',
                  url: 'https://example.com',
                  name: 'Red Bull',
                  nationality: 'Austrian',
                },
              },
            ],
          },
        ],
      },
    },
  };
}

// ---------- Tests ----------

describe('API — fetchDriverStandings', () => {
  it('should transform raw API data into Driver objects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockDriverStandingsResponse()),
    });

    const drivers = await fetchDriverStandings();

    expect(drivers).toHaveLength(1);
    expect(drivers[0]).toMatchObject({
      id: 'verstappen',
      firstName: 'Max',
      lastName: 'Verstappen',
      code: 'VER',
      number: 1,
      team: 'Red Bull',
      teamId: 'red_bull',
      nationality: 'Dutch',
      standingPosition: 1,
      seasonPoints: 75,
      seasonWins: 3,
    });
  });
});

describe('API — fetchRaceCalendar', () => {
  it('should transform raw API data into Race objects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRaceCalendarResponse()),
    });

    const races = await fetchRaceCalendar();

    expect(races).toHaveLength(1);
    expect(races[0]).toMatchObject({
      id: 'albert_park',
      round: 1,
      name: 'Australian Grand Prix',
      circuit: 'Albert Park Grand Prix Circuit',
      location: 'Melbourne',
      country: 'Australia',
      flag: '🇦🇺',
    });
  });
});

describe('API — fetchRaceResults', () => {
  it('should transform raw API data into Race objects with results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRaceResultsResponse()),
    });

    const races = await fetchRaceResults();

    expect(races).toHaveLength(1);
    expect(races[0].results).toHaveLength(1);
    expect(races[0].results[0]).toMatchObject({
      position: 1,
      driverId: 'verstappen',
      driverName: 'M. Verstappen',
      driverCode: 'VER',
      team: 'Red Bull',
      points: 25,
      time: '1:32:24.000',
      fastestLap: '1:20.235',
    });
  });
});

describe('API — fetchConstructorStandings', () => {
  it('should transform raw API data into ConstructorStanding objects', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockConstructorStandingsResponse()),
    });

    const standings = await fetchConstructorStandings();

    expect(standings).toHaveLength(1);
    expect(standings[0]).toMatchObject({
      position: 1,
      name: 'Red Bull',
      constructorId: 'red_bull',
      points: 150,
      wins: 3,
    });
  });
});

describe('API — fetchCurrentSeason', () => {
  it('should return the season string', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRaceCalendarResponse()),
    });

    const season = await fetchCurrentSeason();
    expect(season).toBe('2026');
  });
});

describe('API — fetchCompletedRoundCount', () => {
  it('should return the round number', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockDriverStandingsResponse()),
    });

    const round = await fetchCompletedRoundCount();
    expect(round).toBe(3);
  });
});

describe('getNationalityFlag', () => {
  it('should return correct flag emoji for known nationalities', () => {
    expect(getNationalityFlag('British')).toBe('🇬🇧');
    expect(getNationalityFlag('Dutch')).toBe('🇳🇱');
    expect(getNationalityFlag('Spanish')).toBe('🇪🇸');
  });

  it('should return 🏁 for unknown nationalities', () => {
    expect(getNationalityFlag('Martian')).toBe('🏁');
  });
});
