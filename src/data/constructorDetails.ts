// Static details mapping for 2026 Constructors
// Includes high-res car renderings and technical specifications
// Updated for 2026 regulation changes (new PU era)

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
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedeslogowhite',
    engine: 'Mercedes-AMG F1 M16 E Performance',
    chassis: 'W17',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  ferrari: {
    teamName: 'FERRARI',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/ferrari/2026ferrarilogowhite',
    engine: 'Ferrari 067',
    chassis: 'SF-26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  red_bull: {
    teamName: 'RED BULL RACING',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing.png',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracinglogowhite',
    engine: 'Red Bull Powertrains-Ford DM01',
    chassis: 'RB22',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  mclaren: {
    teamName: 'MCLAREN',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarenlogowhite',
    engine: 'Mercedes-AMG F1 M16',
    chassis: 'MCL40',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  aston_martin: {
    teamName: 'ASTON MARTIN',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartincarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartinlogowhite',
    engine: 'Honda RA626H',
    chassis: 'AMR26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  alpine: {
    teamName: 'ALPINE',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/alpine/2026alpinecarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/alpine/2026alpinelogowhite',
    engine: 'Mercedes-AMG F1 M16',
    chassis: 'A526',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  williams: {
    teamName: 'WILLIAMS RACING',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/williams/2026williamscarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/williams/2026williamslogowhite',
    engine: 'Mercedes-AMG F1 M16',
    chassis: 'FW48',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  rb: {
    teamName: 'RACING BULLS',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullscarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullslogowhite',
    engine: 'Red Bull Powertrains-Ford DM01',
    chassis: 'VCARB 03',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  haas: {
    teamName: 'HAAS F1 TEAM',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamcarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/haasf1team/2026haasf1teamlogowhite',
    engine: 'Ferrari 067',
    chassis: 'VF-26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  sauber: {
    teamName: 'AUDI F1 TEAM',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/audi/2026audicarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/audi/2026audilogowhite',
    engine: 'Audi AFR 26 Hybrid',
    chassis: 'R26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  cadillac: {
    teamName: 'CADILLAC F1 TEAM',
    carImage: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas.png',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaclogowhite',
    engine: 'Ferrari 067',
    chassis: 'MAC-26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
  },
  audi: {
    teamName: 'AUDI F1 TEAM',
    carImage: 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1024,q_auto/v1740000001/common/f1/2026/audi/2026audicarright',
    logo: 'https://media.formula1.com/image/upload/c_lfill,w_96/q_auto/v1740000001/common/f1/2026/audi/2026audilogowhite',
    engine: 'Audi AFR 26 Hybrid',
    chassis: 'R26',
    powerUnit: 'Hybrid (2026 PU Regulations)'
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
