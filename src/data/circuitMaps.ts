// Hard-Coded Offline Circuit Maps
// Replaces unstable Wikipedia APIs with 100% reliable Official Formula 1 CDN URLs.
// Completely bypasses Wikipedia's strict cross-origin checks and 429 rate limits.

export const F1_BASE = 'https://media.formula1.com/image/upload/f_auto/q_auto/v1677244985/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/';

export const CIRCUIT_MAPS: Record<string, string> = {
  albert_park: `${F1_BASE}Australia_Circuit.png`,
  bahrain: `${F1_BASE}Bahrain_Circuit.png`,
  jeddah: `${F1_BASE}Saudi_Arabia_Circuit.png`,
  suzuka: `${F1_BASE}Japan_Circuit.png`,
  shanghai: `${F1_BASE}China_Circuit.png`,
  miami: `${F1_BASE}Miami_Circuit.png`,
  imola: `${F1_BASE}Emilia_Romagna_Circuit.png`,
  monaco: `${F1_BASE}Monaco_Circuit.png`,
  villeneuve: `${F1_BASE}Canada_Circuit.png`,
  catalunya: `${F1_BASE}Spain_Circuit.png`,
  red_bull_ring: `${F1_BASE}Austria_Circuit.png`,
  silverstone: `${F1_BASE}Great_Britain_Circuit.png`,
  hungaroring: `${F1_BASE}Hungary_Circuit.png`,
  spa: `${F1_BASE}Belgium_Circuit.png`,
  zandvoort: `${F1_BASE}Netherlands_Circuit.png`,
  monza: `${F1_BASE}Italy_Circuit.png`,
  baku: `${F1_BASE}Baku_Circuit.png`,
  marina_bay: `${F1_BASE}Singapore_Circuit.png`,
  americas: `${F1_BASE}USA_Circuit.png`,
  rodriguez: `${F1_BASE}Mexico_Circuit.png`,
  interlagos: `${F1_BASE}Brazil_Circuit.png`,
  las_vegas: `${F1_BASE}Las_Vegas_Circuit.png`,
  vegas: `${F1_BASE}Las_Vegas_Circuit.png`,
  losail: `${F1_BASE}Qatar_Circuit.png`,
  yas_marina: `${F1_BASE}Abu_Dhabi_Circuit.png`,
  madring: '/madrid_circuit.svg',
};
