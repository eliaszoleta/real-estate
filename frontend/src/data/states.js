// Mirrors backend/src/config/defaults.js STATE_MEDIAN_VALUES + STATE_NAMES so the
// state comparison table and SEO state pages can render instantly without a network round-trip.
export const STATE_MEDIAN_VALUES = {
  AL: { low: 200000, high: 250000 }, AK: { low: 320000, high: 390000 },
  AZ: { low: 380000, high: 450000 }, AR: { low: 180000, high: 230000 },
  CA: { low: 650000, high: 820000 }, CO: { low: 480000, high: 560000 },
  CT: { low: 380000, high: 450000 }, DE: { low: 340000, high: 400000 },
  DC: { low: 550000, high: 650000 }, FL: { low: 350000, high: 420000 },
  GA: { low: 300000, high: 360000 }, HI: { low: 780000, high: 950000 },
  ID: { low: 400000, high: 470000 }, IL: { low: 260000, high: 320000 },
  IN: { low: 210000, high: 260000 }, IA: { low: 210000, high: 260000 },
  KS: { low: 210000, high: 260000 }, KY: { low: 200000, high: 250000 },
  LA: { low: 190000, high: 240000 }, ME: { low: 320000, high: 380000 },
  MD: { low: 370000, high: 440000 }, MA: { low: 520000, high: 620000 },
  MI: { low: 230000, high: 280000 }, MN: { low: 300000, high: 360000 },
  MS: { low: 160000, high: 210000 }, MO: { low: 220000, high: 270000 },
  MT: { low: 420000, high: 490000 }, NE: { low: 220000, high: 270000 },
  NV: { low: 400000, high: 470000 }, NH: { low: 400000, high: 470000 },
  NJ: { low: 430000, high: 510000 }, NM: { low: 260000, high: 320000 },
  NY: { low: 420000, high: 520000 }, NC: { low: 300000, high: 360000 },
  ND: { low: 250000, high: 300000 }, OH: { low: 220000, high: 270000 },
  OK: { low: 190000, high: 240000 }, OR: { low: 430000, high: 500000 },
  PA: { low: 260000, high: 320000 }, RI: { low: 400000, high: 470000 },
  SC: { low: 280000, high: 340000 }, SD: { low: 250000, high: 300000 },
  TN: { low: 300000, high: 360000 }, TX: { low: 300000, high: 370000 },
  UT: { low: 440000, high: 510000 }, VT: { low: 330000, high: 390000 },
  VA: { low: 360000, high: 430000 }, WA: { low: 520000, high: 600000 },
  WV: { low: 140000, high: 180000 }, WI: { low: 270000, high: 330000 },
  WY: { low: 300000, high: 360000 },
};

export const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'Washington DC',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export const STATE_LIST = Object.keys(STATE_NAMES).map((code) => ({
  code,
  name: STATE_NAMES[code],
  medianValueLow: STATE_MEDIAN_VALUES[code].low,
  medianValueHigh: STATE_MEDIAN_VALUES[code].high,
})).sort((a, b) => a.name.localeCompare(b.name));

export function slugToStateCode(slug) {
  const target = slug.toLowerCase().replace(/-/g, ' ');
  const entry = STATE_LIST.find((s) => s.name.toLowerCase() === target);
  return entry ? entry.code : null;
}

export function stateNameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
