// Static details mapping for 2026 Constructors
// Includes high-res 3D car renderings and technical specifications

export interface ConstructorSpec {
  teamName: string;
  carImage: string;
  logo: string;
  engine: string;
  chassis: string;
  powerUnit: string;
}

export const CONSTRUCTOR_SPECS: Record<string, ConstructorSpec> = {
  mercedes: {
    teamName: 'MERCEDES',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mercedesamgf1.com&size=128',
    engine: 'Mercedes-AMG F1 M15 E Performance',
    chassis: 'F1 W15 E Performance',
    powerUnit: 'Hybrid'
  },
  ferrari: {
    teamName: 'FERRARI',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ferrari.com&size=128',
    engine: 'Ferrari 066/12',
    chassis: 'SF-24',
    powerUnit: 'Hybrid'
  },
  red_bull: {
    teamName: 'RED BULL RACING',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://redbullracing.com&size=128',
    engine: 'Honda RBPTH002',
    chassis: 'RB20',
    powerUnit: 'Hybrid'
  },
  mclaren: {
    teamName: 'MCLAREN',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://mclaren.com&size=128',
    engine: 'Mercedes-AMG F1 M15 E Performance',
    chassis: 'MCL38',
    powerUnit: 'Hybrid'
  },
  aston_martin: {
    teamName: 'ASTON MARTIN',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://astonmartinf1.com&size=128',
    engine: 'Mercedes-AMG F1 M15',
    chassis: 'AMR24',
    powerUnit: 'Hybrid'
  },
  alpine: {
    teamName: 'ALPINE',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://alpinecars.com&size=128',
    engine: 'Renault E-Tech 23',
    chassis: 'A524',
    powerUnit: 'Hybrid'
  },
  williams: {
    teamName: 'WILLIAMS RACING',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://williamsf1.com&size=128',
    engine: 'Mercedes-AMG F1 M15',
    chassis: 'FW46',
    powerUnit: 'Hybrid'
  },
  rb: {
    teamName: 'VISA CASH APP RB',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://visacashapprb.com&size=128',
    engine: 'Honda RBPTH002',
    chassis: 'VCARB 01',
    powerUnit: 'Hybrid'
  },
  haas: {
    teamName: 'HAAS F1 TEAM',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://haasf1team.com&size=128',
    engine: 'Ferrari 066/10',
    chassis: 'VF-24',
    powerUnit: 'Hybrid'
  },
  sauber: {
    teamName: 'KICK SAUBER',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://sauber-group.com&size=128',
    engine: 'Ferrari 066/12',
    chassis: 'C44',
    powerUnit: 'Hybrid'
  },
  cadillac: {
    teamName: 'CADILLAC F1 TEAM',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://cadillac.com&size=128',
    engine: 'Ferrari 066/12 (TBC)',
    chassis: 'TBC',
    powerUnit: 'Hybrid'
  },
  audi: {
    teamName: 'AUDI F1 TEAM',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber.png',
    logo: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://audi.com&size=128',
    engine: 'Audi F1 PU',
    chassis: 'TBC',
    powerUnit: 'Hybrid'
  }
};

export function getConstructorSpecs(teamId: string): ConstructorSpec {
  return CONSTRUCTOR_SPECS[teamId] || {
    teamName: teamId.toUpperCase().replace('_', ' '),
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas.png',
    logo: '',
    engine: 'TBA Engine',
    chassis: 'TBA Chassis',
    powerUnit: 'Hybrid'
  };
}
