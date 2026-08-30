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

/**
 * Confirmed via production logs (2026-08-30): RentCast's /avm/value endpoint
 * returns comparables used for the valuation math, but those comps do NOT
 * include photos — it's an AVM endpoint, not a listings feed. Real photos
 * require a separate call to RentCast's active sale-listings search, which
 * pulls from actual for-sale inventory (MLS-sourced) and does carry photos.
 *
 * IMPORTANT: same caveat as getLiveEstimate — this endpoint path and
 * response shape reflect RentCast's documented Sale Listings API as of this
 * writing, but is UNVERIFIED against a live response. If the log line below
 * ("Raw RentCast listings response") shows a different shape than expected,
 * adjust the mapping accordingly — that's exactly what happened with the
 * AVM endpoint, so treat this one the same way: ship it, read the log line
 * from the first real request, fix the mapping once.
 */
async function getNearbyListingPhotos({ lat, lng, city, state, bedrooms, radiusMiles = 2 }) {
  if (!isConfigured()) return [];
  if (!(lat && lng) && !(city && state)) {
    console.log('[listingsApi] No coordinates or city/state available — skipping nearby-listings photo lookup.');
    return [];
  }

  const params = new URLSearchParams({ status: 'Active', limit: '8' });
  if (lat && lng) {
    params.set('latitude', String(lat));
    params.set('longitude', String(lng));
    params.set('radius', String(radiusMiles));
  } else {
    params.set('city', city);
    params.set('state', state);
  }
  if (bedrooms) params.set('bedrooms', String(bedrooms));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log(`[listingsApi] Searching nearby active listings (${lat && lng ? `${lat},${lng} within ${radiusMiles}mi` : `${city}, ${state}`})…`);
    const res = await fetch(`${RENTCAST_BASE_URL}/listings/sale?${params.toString()}`, {
      headers: { 'X-Api-Key': process.env.RENTCAST_API_KEY, Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error(`[listingsApi] Listings search responded ${res.status} ${res.statusText}: ${bodyText.slice(0, 500)}`);
      return [];
    }

    const data = await res.json();
    const listings = Array.isArray(data) ? data : Array.isArray(data.listings) ? data.listings : [];
    console.log(`[listingsApi] Raw RentCast listings response: ${Array.isArray(data) ? `array of ${data.length}` : `object with keys ${Object.keys(data || {})}`}`);

    if (listings.length > 0) {
      console.log('[listingsApi] First listing object (for field mapping):', JSON.stringify(listings[0]).slice(0, 2000));
    }

    // Try every plausible field name/shape a photo could live under —
    // providers vary, and some only include media behind extra params.
    const extractPhotoUrl = (l) => {
      const candidates = [l.photos, l.images, l.photoUrls, l.pictures, l.imageUrls, l.media];
      for (const c of candidates) {
        if (Array.isArray(c) && c.length > 0) {
          const first = c[0];
          if (typeof first === 'string') return first;
          if (first && typeof first === 'object') return first.url || first.href || first.src || null;
        }
        if (typeof c === 'string' && c) return c;
      }
      return null;
    };

    const withPhotos = listings
      .map((l) => ({ l, photoUrl: extractPhotoUrl(l) }))
      .filter((x) => x.photoUrl)
      .slice(0, 6)
      .map(({ l, photoUrl }) => ({
        address: l.formattedAddress || l.address || null,
        price: l.price || l.listPrice || null,
        bedrooms: l.bedrooms || null,
        bathrooms: l.bathrooms || null,
        squareFootage: l.squareFootage || null,
        photoUrl,
      }));

    if (listings.length > 0 && withPhotos.length === 0) {
      console.warn('[listingsApi] Found listings but no photo field matched any known name — see the full first-listing object logged above to find the real field name (or this plan/endpoint may not include photos at all), then update extractPhotoUrl().');
    }
    return withPhotos;
  } catch (err) {
    console.error('[listingsApi] Nearby listings search failed:', err.message);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getLiveEstimate, getNearbyListingPhotos };
