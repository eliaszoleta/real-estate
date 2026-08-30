// HomeValueCal — Optional live listings/AVM upgrade slot
//
// By default HomeValueCal runs entirely on the free public-data model in
// homeValueEngine.js — no API key, no cost, no rate limits. If you sign up
// for a real estate data API that provides an automated valuation model
// (AVM) and comparable-listing photos — RentCast (rentcast.io) is a
// reasonable starting point with a limited free developer tier, last we
// checked — set RENTCAST_API_KEY in the environment and this module takes
// over automatically; routes/estimate.js tries it first and falls back to
// the free engine if it's unset, errors, or times out.
//
// IMPORTANT: the exact endpoint path and response shape below reflect
// RentCast's publicly documented Value Estimate (AVM) API as of this
// writing, but this file has NOT been tested against a live key (this
// project has no key configured). Verify against RentCast's current API
// docs and adjust the request/response mapping below before relying on it
// in production.

const RENTCAST_BASE_URL = 'https://api.rentcast.io/v1';

function isConfigured() {
  return Boolean(process.env.RENTCAST_API_KEY);
}

/**
 * Attempts a live value estimate for a specific address. Returns null if no
 * API key is configured, the request fails, or it times out — callers
 * should always have a free-engine fallback ready.
 */
async function getLiveEstimate({ address, bedrooms, bathrooms, squareFootage, propertyType }) {
  if (!isConfigured()) {
    console.log('[listingsApi] RENTCAST_API_KEY not set — skipping live lookup, using free engine only.');
    return null;
  }
  if (!address) {
    console.log('[listingsApi] No address provided — skipping live lookup (state-only estimates always use the free engine).');
    return null;
  }

  const params = new URLSearchParams({ address });
  if (bedrooms) params.set('bedrooms', String(bedrooms));
  if (bathrooms) params.set('bathrooms', String(bathrooms));
  if (squareFootage) params.set('squareFootage', String(squareFootage));
  if (propertyType) params.set('propertyType', propertyType);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log(`[listingsApi] Requesting live estimate for "${address}"…`);
    const res = await fetch(`${RENTCAST_BASE_URL}/avm/value?${params.toString()}`, {
      headers: { 'X-Api-Key': process.env.RENTCAST_API_KEY, Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error(`[listingsApi] RentCast responded ${res.status} ${res.statusText}: ${bodyText.slice(0, 500)}`);
      return null;
    }

    const data = await res.json();
    console.log('[listingsApi] Raw RentCast response keys:', Object.keys(data || {}));

    // Best-effort mapping of RentCast's documented response shape — confirm
    // field names against a live response before trusting this in production.
    const comps = Array.isArray(data.comparables) ? data.comparables.slice(0, 6).map((c) => ({
      address: c.formattedAddress || c.address || null,
      price: c.price || c.lastSalePrice || null,
      bedrooms: c.bedrooms || null,
      bathrooms: c.bathrooms || null,
      squareFootage: c.squareFootage || null,
      photoUrl: Array.isArray(c.photos) && c.photos.length ? c.photos[0] : null,
      distanceMiles: c.distance || null,
    })) : [];

    if (comps.length === 0) {
      console.warn('[listingsApi] Response parsed OK but yielded 0 comps — the field-mapping in this file likely does not match RentCast\'s actual response shape. Log the raw response above and adjust the mapping.');
    } else if (!comps.some((c) => c.photoUrl)) {
      console.warn('[listingsApi] Got comps but none had a photo — this RentCast plan/endpoint may not return photos.');
    }

    return {
      source: 'rentcast',
      valueLow: data.priceRangeLow || data.price || null,
      valueHigh: data.priceRangeHigh || data.price || null,
      comps,
    };
  } catch (err) {
    console.error('[listingsApi] Live estimate request failed:', err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getLiveEstimate };
