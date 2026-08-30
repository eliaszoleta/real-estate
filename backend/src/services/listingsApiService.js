// HomeValueCal — Optional live value-estimate upgrade slot
//
// By default HomeValueCal runs entirely on the free public-data model in
// homeValueEngine.js — no API key, no cost, no rate limits. If you sign up
// for RentCast (rentcast.io — has a limited free developer tier, last we
// checked) and set RENTCAST_API_KEY, this module blends its automated
// valuation (AVM) into the estimate automatically.
//
// NOTE ON PHOTOS: RentCast was originally meant to also supply comp photos
// here, but production testing (2026-08-30) confirmed its /avm/value comps
// AND its /listings/sale search AND single-listing detail endpoint all
// return no photo data whatsoever on our plan — this is an AVM/valuation
// product, not primarily a photo/listings feed. Real listing photos come
// from services/simplyRetsService.js instead (schema confirmed against
// SimplyRETS's published OpenAPI spec, not guessed).

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
    console.log('[listingsApi] RENTCAST_API_KEY not set — skipping live estimate, using free engine only.');
    return null;
  }
  if (!address) {
    console.log('[listingsApi] No address provided — skipping live estimate (state-only estimates always use the free engine).');
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

    return {
      source: 'rentcast',
      valueLow: data.priceRangeLow || data.price || null,
      valueHigh: data.priceRangeHigh || data.price || null,
    };
  } catch (err) {
    console.error('[listingsApi] Live estimate request failed:', err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getLiveEstimate };
