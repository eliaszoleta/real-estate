// HomeValueCal — Location intelligence service
//
// Geocoding: OpenStreetMap Nominatim (nominatim.openstreetmap.org) — free, no API key.
// Proximity/amenities: OpenStreetMap Overpass API (overpass-api.de) — free, no API key.
// Both are real, live public datasets, which is what lets us give a genuine
// "how close is this to a school/store" answer for any US address.

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'HomeValueCal/1.0 (home value estimator; contact via app)';

const AMENITY_QUERIES = [
  { key: 'school', label: 'School', filter: '["amenity"="school"]' },
  { key: 'grocery', label: 'Grocery Store', filter: '["shop"~"supermarket|grocery|convenience"]' },
  { key: 'hospital', label: 'Hospital / Urgent Care', filter: '["amenity"~"hospital|clinic|doctors"]' },
  { key: 'park', label: 'Park', filter: '["leisure"="park"]' },
  { key: 'restaurant', label: 'Restaurant / Cafe', filter: '["amenity"~"restaurant|cafe"]' },
];

function toRad(deg) { return (deg * Math.PI) / 180; }

/** Haversine distance in miles between two lat/lng points */
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeAddress(query) {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&countrycodes=us&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error('Geocoding service unavailable.');
  const results = await res.json();
  if (!results.length) return null;

  const r = results[0];
  const addr = r.address || {};
  return {
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    displayName: r.display_name,
    city: addr.city || addr.town || addr.village || addr.hamlet || null,
    state: addr.state || null,
    zip: addr.postcode || null,
  };
}

/**
 * Query Overpass for amenities within `radiusMeters` of a point, and compute
 * a transparent 0-100 convenience score from distance-weighted density.
 */
async function getProximityData(lat, lng, radiusMeters = 3200) {
  const clauses = AMENITY_QUERIES
    .map(({ filter }) => `nwr${filter}(around:${radiusMeters},${lat},${lng});`)
    .join('\n');
  const query = `[out:json][timeout:15];(${clauses});out center 40;`;

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': USER_AGENT },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error('Proximity data service unavailable.');
  const data = await res.json();

  const byCategory = {};
  for (const { key, label } of AMENITY_QUERIES) byCategory[key] = { label, nearest: null, count: 0 };

  for (const el of data.elements || []) {
    const elLat = el.lat ?? el.center?.lat;
    const elLon = el.lon ?? el.center?.lon;
    if (elLat == null || elLon == null) continue;
    const dist = distanceMiles(lat, lng, elLat, elLon);

    for (const { key } of AMENITY_QUERIES) {
      const tagMatch = matchesFilter(el.tags || {}, key);
      if (!tagMatch) continue;
      const cat = byCategory[key];
      cat.count += 1;
      if (cat.nearest === null || dist < cat.nearest) cat.nearest = dist;
    }
  }

  for (const key of Object.keys(byCategory)) {
    if (byCategory[key].nearest !== null) {
      byCategory[key].nearest = Math.round(byCategory[key].nearest * 10) / 10;
    }
  }

  const score = computeConvenienceScore(byCategory);
  return { amenities: byCategory, convenienceScore: score.value, convenienceLabel: score.label };
}

function matchesFilter(tags, key) {
  switch (key) {
    case 'school': return tags.amenity === 'school';
    case 'grocery': return ['supermarket', 'grocery', 'convenience'].includes(tags.shop);
    case 'hospital': return ['hospital', 'clinic', 'doctors'].includes(tags.amenity);
    case 'park': return tags.leisure === 'park';
    case 'restaurant': return ['restaurant', 'cafe'].includes(tags.amenity);
    default: return false;
  }
}

/**
 * Transparent scoring formula: each category contributes up to 20 points,
 * scaled down as the nearest example gets farther away (full credit within
 * 0.5mi, zero credit beyond 2.5mi), so a walkable, amenity-dense area scores
 * near 100 and a remote lot scores near 0.
 */
function computeConvenienceScore(byCategory) {
  const CATEGORY_WEIGHT = 20;
  const FULL_CREDIT_MILES = 0.5;
  const ZERO_CREDIT_MILES = 2.5;

  let total = 0;
  for (const key of Object.keys(byCategory)) {
    const nearest = byCategory[key].nearest;
    if (nearest === null) continue;
    const t = Math.max(0, Math.min(1, (ZERO_CREDIT_MILES - nearest) / (ZERO_CREDIT_MILES - FULL_CREDIT_MILES)));
    total += CATEGORY_WEIGHT * t;
  }
  const value = Math.round(total);
  let label = 'Remote';
  if (value >= 80) label = 'Extremely Walkable';
  else if (value >= 60) label = 'Very Convenient';
  else if (value >= 40) label = 'Moderately Convenient';
  else if (value >= 20) label = 'Car-Dependent';
  return { value, label };
}

/** Suggests a neighborhood tier from the convenience score, for pre-filling the calculator */
function suggestNeighborhoodTier(convenienceScore) {
  if (convenienceScore >= 80) return 'premium';
  if (convenienceScore >= 55) return 'desirable';
  if (convenienceScore >= 30) return 'established';
  return 'developing';
}

module.exports = { geocodeAddress, getProximityData, suggestNeighborhoodTier, distanceMiles };
