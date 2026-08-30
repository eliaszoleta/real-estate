// HomeValueCal — Core home value estimation engine (free public-data model)

const {
  REFERENCE_SQFT, REFERENCE_BEDROOMS, REFERENCE_BATHROOMS,
  STATE_MEDIAN_VALUES, STATE_NAMES, METRO_ADJUSTMENTS,
  HOME_TYPE_MULTIPLIERS, CONDITION_MULTIPLIERS, AGE_MULTIPLIERS,
  BEDROOM_PCT_PER_ROOM, BATHROOM_PCT_PER_ROOM,
  LOT_SIZE_MULTIPLIERS, EXTRA_FEATURES, NEIGHBORHOOD_TIERS,
} = require('../config/defaults');

function round(n) { return Math.round(n / 500) * 500; }
function scale(range, factor) { return { low: range.low * factor, high: range.high * factor }; }

function resolveLocationAdjustment(state, city) {
  const cityKey = (city || '').trim().toLowerCase();
  const metroMult = METRO_ADJUSTMENTS[cityKey];
  if (!metroMult) return { multiplier: 1.0, source: 'state' };
  return { multiplier: (metroMult * 0.7) + (1.0 * 0.3), source: 'metro' };
}

function calculateHomeValue(input) {
  const {
    state,
    city = null,
    homeType = 'single_family',
    squareFootage,
    bedrooms = REFERENCE_BEDROOMS,
    bathrooms = REFERENCE_BATHROOMS,
    condition = 'move_in_ready',
    age = '10_30',
    lotSize = 'small_lot',
    extraFeatures = [],
    neighborhoodTier = 'established',
  } = input;

  if (!state || !STATE_MEDIAN_VALUES[state]) throw new Error('A valid state is required.');
  const sqft = Number(squareFootage);
  if (!sqft || sqft < 300 || sqft > 25000) throw new Error('Square footage must be between 300 and 25,000.');

  const breakdown = [];
  const stateMedian = STATE_MEDIAN_VALUES[state];
  const { multiplier: metroMult, source: locationSource } = resolveLocationAdjustment(state, city);

  let value = scale(stateMedian, metroMult);
  breakdown.push({ label: `${STATE_NAMES[state]} median value (reference ${REFERENCE_SQFT.toLocaleString()} sqft home)`, low: round(value.low), high: round(value.high) });

  // Square footage scaling relative to the reference home size
  const sqftFactor = sqft / REFERENCE_SQFT;
  value = scale(value, sqftFactor);
  breakdown.push({ label: `Adjusted for size — ${sqft.toLocaleString()} sqft`, low: round(value.low), high: round(value.high) });

  // Home type
  const homeTypeInfo = HOME_TYPE_MULTIPLIERS[homeType] || HOME_TYPE_MULTIPLIERS.single_family;
  if (homeTypeInfo.mult !== 1) {
    value = scale(value, homeTypeInfo.mult);
    breakdown.push({ label: homeTypeInfo.label, low: round(value.low), high: round(value.high) });
  }

  // Bedrooms / bathrooms vs. reference
  const bedDelta = (Number(bedrooms) || REFERENCE_BEDROOMS) - REFERENCE_BEDROOMS;
  if (bedDelta !== 0) {
    const bedMult = 1 + (bedDelta * BEDROOM_PCT_PER_ROOM);
    value = scale(value, bedMult);
    breakdown.push({ label: `${bedDelta > 0 ? '+' : ''}${bedDelta} bedroom${Math.abs(bedDelta) > 1 ? 's' : ''} vs. typical`, low: round(value.low), high: round(value.high) });
  }
  const bathDelta = (Number(bathrooms) || REFERENCE_BATHROOMS) - REFERENCE_BATHROOMS;
  if (bathDelta !== 0) {
    const bathMult = 1 + (bathDelta * BATHROOM_PCT_PER_ROOM);
    value = scale(value, bathMult);
    breakdown.push({ label: `${bathDelta > 0 ? '+' : ''}${bathDelta} bathroom${Math.abs(bathDelta) > 1 ? 's' : ''} vs. typical`, low: round(value.low), high: round(value.high) });
  }

  // Condition
  const conditionInfo = CONDITION_MULTIPLIERS[condition] || CONDITION_MULTIPLIERS.move_in_ready;
  value = scale(value, conditionInfo.mult);
  breakdown.push({ label: `Condition — ${conditionInfo.label}`, low: round(value.low), high: round(value.high) });

  // Age
  const ageInfo = AGE_MULTIPLIERS[age] || AGE_MULTIPLIERS['10_30'];
  if (ageInfo.mult !== 1) {
    value = scale(value, ageInfo.mult);
    breakdown.push({ label: ageInfo.label, low: round(value.low), high: round(value.high) });
  }

  // Lot size
  const lotInfo = LOT_SIZE_MULTIPLIERS[lotSize] || LOT_SIZE_MULTIPLIERS.small_lot;
  if (lotInfo.mult !== 1) {
    value = scale(value, lotInfo.mult);
    breakdown.push({ label: lotInfo.label, low: round(value.low), high: round(value.high) });
  }

  // Extra features
  const featureList = Array.isArray(extraFeatures) ? extraFeatures : [];
  let featurePct = 0;
  for (const key of featureList) {
    const feature = EXTRA_FEATURES[key];
    if (!feature) continue;
    featurePct += feature.pct;
  }
  if (featurePct > 0) {
    value = scale(value, 1 + featurePct);
    breakdown.push({ label: `Features: ${featureList.map((k) => EXTRA_FEATURES[k]?.label).filter(Boolean).join(', ')}`, low: round(value.low), high: round(value.high) });
  }

  // Neighborhood tier
  const tier = NEIGHBORHOOD_TIERS[neighborhoodTier] || NEIGHBORHOOD_TIERS.established;
  value = scale(value, tier.mult);
  breakdown.push({ label: `Neighborhood — ${tier.label}`, low: round(value.low), high: round(value.high) });

  const valueLow = round(value.low);
  const valueHigh = round(value.high);

  return {
    state,
    stateName: STATE_NAMES[state] || state,
    city,
    locationMultiplier: Math.round(metroMult * 100) / 100,
    locationSource,
    squareFootage: sqft,
    pricePerSqftLow: Math.round(valueLow / sqft),
    pricePerSqftHigh: Math.round(valueHigh / sqft),
    breakdown,
    valueLow,
    valueHigh,
    neighborhoodTier,
    neighborhoodLabel: tier.label,
    bedrooms: Number(bedrooms) || null,
    bathrooms: Number(bathrooms) || null,
    homeType,
    homeTypeLabel: homeTypeInfo.label,
    conditionLabel: conditionInfo.label,
    ageLabel: ageInfo.label,
  };
}

module.exports = { calculateHomeValue, resolveLocationAdjustment };
