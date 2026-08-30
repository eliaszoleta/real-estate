// HomeValueCal — Default home-value estimation data
//
// DATA SOURCES (informational estimate only — not an appraisal):
//   - Methodology follows publicly published median-home-value data (U.S. Census Bureau
//     American Community Survey by state/ZCTA, Zillow Home Value Index research data)
//   - The STATE_MEDIAN_VALUES table below is a hand-compiled illustrative snapshot
//     reflecting known relative state rankings — before shipping this as a business,
//     replace it with a live pull from the free Census API (api.census.gov, ACS 5-Year
//     B25077 median value table) or wire up the optional listings API in
//     services/listingsApiService.js for live per-address AVM data.
//   - Market adjustments (bed/bath/condition/age/lot) follow standard residential
//     appraisal practice: percentage-of-value adjustments, not flat national dollar
//     amounts, since a bedroom is worth a different amount in Mississippi than Hawaii.
// Updated: 2026. Real market value depends on comps, a licensed appraisal, and current
// local conditions — always get a real comparative market analysis from a local agent
// or a licensed appraisal before making a financial decision.

// ─────────────────────────────────────────────────────────────────────────────
// STATE MEDIAN HOME VALUE — for a reference ~1,800 sqft single-family home in
// average ("move-in ready") condition, 3 bed / 2 bath, standard lot.
// ─────────────────────────────────────────────────────────────────────────────
const REFERENCE_SQFT = 1800;
const REFERENCE_BEDROOMS = 3;
const REFERENCE_BATHROOMS = 2;

const STATE_MEDIAN_VALUES = {
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

const STATE_NAMES = {
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

// Major metros priced meaningfully above/below their state average. Blended
// 70/30 with the state figure when a geocoded city matches, same approach as
// our construction-cost calculator.
const METRO_ADJUSTMENTS = {
  'new york': 1.55, 'brooklyn': 1.45, 'manhattan': 2.1, 'san francisco': 1.75,
  'san jose': 1.65, 'oakland': 1.4, 'los angeles': 1.35, 'san diego': 1.3,
  'seattle': 1.3, 'boston': 1.35, 'washington': 1.25, 'honolulu': 1.3,
  'miami': 1.3, 'austin': 1.15, 'denver': 1.15, 'chicago': 1.1,
  'portland': 1.15, 'nashville': 1.2, 'atlanta': 1.1, 'dallas': 1.05,
  'houston': 0.95, 'phoenix': 1.05, 'las vegas': 1.05, 'minneapolis': 1.05,
  'detroit': 0.85, 'philadelphia': 1.1, 'charlotte': 1.1, 'columbus': 0.95,
};

// ─────────────────────────────────────────────────────────────────────────────
// HOME TYPE — multiplier vs. a single-family home of the same total sqft
// ─────────────────────────────────────────────────────────────────────────────
const HOME_TYPE_MULTIPLIERS = {
  single_family: { mult: 1.00, label: 'Single-Family Home' },
  condo:         { mult: 0.78, label: 'Condo / Apartment' },
  townhouse:     { mult: 0.88, label: 'Townhouse' },
  multi_family:  { mult: 1.15, label: 'Duplex / Multi-Family (2-4 unit)' },
  mobile_home:   { mult: 0.48, label: 'Mobile / Manufactured Home' },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONDITION — the biggest lever after size and location
// ─────────────────────────────────────────────────────────────────────────────
const CONDITION_MULTIPLIERS = {
  fixer_upper:        { mult: 0.80, label: 'Fixer-Upper', description: 'Needs significant work — systems, structure, or major cosmetic issues.' },
  needs_updates:      { mult: 0.92, label: 'Needs Updates', description: 'Livable, but kitchen/baths/finishes are dated.' },
  move_in_ready:      { mult: 1.00, label: 'Move-In Ready', description: 'Well-maintained, nothing major needed.' },
  recently_renovated: { mult: 1.10, label: 'Recently Renovated', description: 'Updated kitchen/baths within the last few years.' },
  new_construction:   { mult: 1.20, label: 'New Construction', description: 'Never lived in, built in the last year.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// AGE — distinct from condition (a well-kept older home vs. a neglected new one)
// ─────────────────────────────────────────────────────────────────────────────
const AGE_MULTIPLIERS = {
  under_10:  { mult: 1.05, label: 'Built in the last 10 years' },
  '10_30':   { mult: 1.00, label: '10–30 years old' },
  '30_50':   { mult: 0.96, label: '30–50 years old' },
  over_50:   { mult: 0.92, label: 'Over 50 years old' },
};

// ─────────────────────────────────────────────────────────────────────────────
// BEDROOMS / BATHROOMS — percent-of-value adjustment per room vs. the
// 3-bed / 2-bath reference, since a bedroom is worth a different dollar
// amount in every market.
// ─────────────────────────────────────────────────────────────────────────────
const BEDROOM_PCT_PER_ROOM = 0.045;
const BATHROOM_PCT_PER_ROOM = 0.035;

// ─────────────────────────────────────────────────────────────────────────────
// LOT SIZE
// ─────────────────────────────────────────────────────────────────────────────
const LOT_SIZE_MULTIPLIERS = {
  shared_no_yard: { mult: 0.97, label: 'Shared / No Yard' },
  small_lot:      { mult: 1.00, label: 'Small Lot (< 0.25 acre)' },
  standard_lot:   { mult: 1.03, label: 'Standard Lot (0.25–0.5 acre)' },
  large_lot:      { mult: 1.08, label: 'Large Lot (0.5–1 acre)' },
  acreage:        { mult: 1.15, label: 'Acreage (1+ acres)' },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXTRA FEATURES — flat percent value-add, multi-select
// ─────────────────────────────────────────────────────────────────────────────
const EXTRA_FEATURES = {
  updated_kitchen:  { pct: 0.04, label: 'Updated Kitchen' },
  finished_basement:{ pct: 0.05, label: 'Finished Basement' },
  garage:           { pct: 0.03, label: 'Garage' },
  pool:             { pct: 0.03, label: 'Pool' },
  view_or_waterfront:{ pct: 0.08, label: 'Notable View / Waterfront' },
  solar_panels:     { pct: 0.02, label: 'Solar Panels (Owned)' },
  home_office:      { pct: 0.015, label: 'Dedicated Home Office' },
  smart_home:       { pct: 0.015, label: 'Smart Home Features' },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEIGHBORHOOD TIER — multiplies total value, since land + structure are
// bundled in a resale price (unlike new construction, where we price them
// separately). Range reflects hyper-local desirability within a state/metro.
// ─────────────────────────────────────────────────────────────────────────────
const NEIGHBORHOOD_TIERS = {
  developing:     { mult: 0.87, label: 'Developing Area', description: 'Growing area, fewer nearby amenities.' },
  established:    { mult: 1.00, label: 'Established Suburb', description: 'Settled neighborhood with everyday conveniences nearby.' },
  desirable:      { mult: 1.12, label: 'Desirable Area', description: 'Sought-after school zone, walkable to amenities.' },
  premium:        { mult: 1.27, label: 'Premium Location', description: 'Top-rated schools, high demand, strong amenity access.' },
  luxury_enclave: { mult: 1.45, label: 'Luxury Enclave', description: 'Exclusive area, waterfront/view lots, minimal buildable land.' },
};

module.exports = {
  REFERENCE_SQFT,
  REFERENCE_BEDROOMS,
  REFERENCE_BATHROOMS,
  STATE_MEDIAN_VALUES,
  STATE_NAMES,
  METRO_ADJUSTMENTS,
  HOME_TYPE_MULTIPLIERS,
  CONDITION_MULTIPLIERS,
  AGE_MULTIPLIERS,
  BEDROOM_PCT_PER_ROOM,
  BATHROOM_PCT_PER_ROOM,
  LOT_SIZE_MULTIPLIERS,
  EXTRA_FEATURES,
  NEIGHBORHOOD_TIERS,
};
