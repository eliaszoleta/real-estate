// HomeValueCal — SimplyRETS integration (real listing photos)
//
// RentCast (services/listingsApiService.js) supplies the value estimate, but
// its listings data — search results AND single-listing detail — was
// confirmed via production logs (2026-08-30) to carry no photo data on our
// plan. SimplyRETS is a listings API purpose-built for IDX real estate
// sites and does return photos.
//
// Schema below is taken directly from SimplyRETS's published OpenAPI spec
// (github.com/APIs-guru/openapi-directory, APIs/simplyrets.com), not
// guessed — so this should work correctly on the first real request,
// unlike the RentCast integration which needed several rounds to map.
//
// Auth is HTTP Basic (username/password), not an API key header.
// SimplyRETS's public demo account — username "simplyrets", password
// "simplyrets" — returns fake sample listings (with real-looking photos)
// and is useful for verifying this integration end-to-end before you have
// a real MLS-backed account. A real account requires being sponsored by a
// licensed agent/broker with IDX access to an MLS, per standard real estate
// data licensing — once you have one, its data is genuine syndicated MLS
// data and displaying it (address, price, agent/office) is expected to
// carry IDX-style attribution; the demo account's fake data has no such
// obligation.

const SIMPLYRETS_BASE_URL = 'https://api.simplyrets.com';

function isConfigured() {
  return Boolean(process.env.SIMPLYRETS_USERNAME && process.env.SIMPLYRETS_PASSWORD);
}

function authHeader() {
  const token = Buffer.from(`${process.env.SIMPLYRETS_USERNAME}:${process.env.SIMPLYRETS_PASSWORD}`).toString('base64');
  return `Basic ${token}`;
}

/**
 * Finds nearby active listings with real photos. Prefers a ZIP-code filter
 * (precise and directly supported by the API) over city, since SimplyRETS
 * has no radius/lat-lng search — only a bounding-box "points" param, which
 * needs two corner coordinates we don't have from a single geocoded point.
 */
async function getNearbyListingPhotos({ zip, city, bedrooms }) {
  if (!isConfigured()) return [];
  if (!zip && !city) {
    console.log('[simplyRets] No zip or city available — skipping listing photo lookup.');
    return [];
  }

  const params = new URLSearchParams({ status: 'Active', limit: '6' });
  if (zip) params.set('postalCodes', zip);
  else params.set('cities', city);
  if (bedrooms) {
    params.set('minbeds', String(Math.max(0, bedrooms - 1)));
    params.set('maxbeds', String(bedrooms + 1));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log(`[simplyRets] Searching listings (${zip ? `zip ${zip}` : `city ${city}`})…`);
    const res = await fetch(`${SIMPLYRETS_BASE_URL}/properties?${params.toString()}`, {
      headers: { Authorization: authHeader(), Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error(`[simplyRets] Responded ${res.status} ${res.statusText}: ${bodyText.slice(0, 500)}`);
      return [];
    }

    const listings = await res.json();
    if (!Array.isArray(listings)) {
      console.error('[simplyRets] Expected an array response, got:', typeof listings);
      return [];
    }
    console.log(`[simplyRets] Got ${listings.length} listing(s)${listings.length ? `, first has ${listings[0].photos?.length || 0} photo(s)` : ''}.`);

    return listings
      .filter((l) => Array.isArray(l.photos) && l.photos.length > 0)
      .slice(0, 6)
      .map((l) => ({
        address: l.address?.full || null,
        price: l.listPrice || null,
        bedrooms: l.property?.bedrooms ?? null,
        bathrooms: l.property?.bathsFull ?? null,
        squareFootage: l.property?.area ?? null,
        photoUrl: l.photos[0],
        agentName: l.agent ? [l.agent.firstName, l.agent.lastName].filter(Boolean).join(' ') : null,
        officeName: l.office?.name || l.office?.servingName || null,
      }));
  } catch (err) {
    console.error('[simplyRets] Listing search failed:', err.message);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getNearbyListingPhotos };
