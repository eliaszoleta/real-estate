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
  if (!isConfigured()) return null;

  const params = new URLSearchParams({ address });
  if (bedrooms) params.set('bedrooms', String(bedrooms));
  if (bathrooms) params.set('bathrooms', String(bathrooms));
  if (squareFootage) params.set('squareFootage', String(squareFootage));
  if (propertyType) params.set('propertyType', propertyType);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${RENTCAST_BASE_URL}/avm/value?${params.toString()}`, {
      headers: { 'X-Api-Key': process.env.RENTCAST_API_KEY, Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();

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

    return {
      source: 'rentcast',
      valueLow: data.priceRangeLow || data.price || null,
      valueHigh: data.priceRangeHigh || data.price || null,
      comps,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getLiveEstimate };
