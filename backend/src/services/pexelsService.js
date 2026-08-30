// HomeValueCal — Pexels stock photo fallback
//
// SimplyRETS (services/simplyRetsService.js) supplies a real comp photo when
// one is available, but its coverage is inherently limited — a demo account
// has one fixed sample market, and even a real MLS-backed account only
// covers active listings in your specific area at that moment. Most
// searches will find nothing.
//
// This module fills that gap with a well-matched, properly-licensed STOCK
// photo instead of falling straight to the hand-drawn illustration — a real
// photograph of a similar-style home, not a photo of any specific
// comparable property. It's honest about that distinction (see the
// isStock/photographer credit handling in ResultsScreen.js), but gives
// users something more visually concrete than a sketch far more often than
// a listings-only approach can.
//
// Auth: single header, no key format ceremony. Sign up free at
// pexels.com/api — instant API key, no application review. Free tier is
// generous (order of 200 requests/hour last we checked; confirm current
// limits in your Pexels dashboard). Pexels License permits free commercial
// use with no permission needed; attribution is not legally required but
// is good practice and is included in the returned data for that reason.
//
// Schema confirmed against Pexels's own documentation, not guessed.

const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

function isConfigured() {
  return Boolean(process.env.PEXELS_API_KEY);
}

const HOME_TYPE_QUERIES = {
  single_family: 'single family house exterior',
  condo: 'modern condo building exterior',
  townhouse: 'townhouse exterior',
  multi_family: 'duplex house exterior',
  mobile_home: 'manufactured home exterior',
};

/** Builds a search query biased toward the home's type and rough price tier. */
function buildQuery({ homeType, valueLow, valueHigh }) {
  let query = HOME_TYPE_QUERIES[homeType] || 'house exterior';
  const midpoint = valueLow && valueHigh ? (valueLow + valueHigh) / 2 : null;
  if (midpoint >= 900000) query = `luxury ${query}`;
  else if (midpoint && midpoint <= 220000) query = `small ${query}`;
  return query;
}

/**
 * Finds one representative stock photo matching the home's type/price tier.
 * Returns null if unconfigured, the request fails, or nothing comes back —
 * callers should always have the illustration ready as a final fallback.
 */
async function getStockHomePhoto({ homeType, valueLow, valueHigh }) {
  if (!isConfigured()) {
    console.log('[pexels] PEXELS_API_KEY not set — skipping stock photo, using illustration.');
    return null;
  }

  const query = buildQuery({ homeType, valueLow, valueHigh });
  const params = new URLSearchParams({ query, per_page: '3', orientation: 'landscape' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    console.log(`[pexels] Searching stock photos for "${query}"…`);
    const res = await fetch(`${PEXELS_BASE_URL}/search?${params.toString()}`, {
      headers: { Authorization: process.env.PEXELS_API_KEY },
      signal: controller.signal,
    });

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error(`[pexels] Responded ${res.status} ${res.statusText}: ${bodyText.slice(0, 300)}`);
      return null;
    }

    const data = await res.json();
    const photo = Array.isArray(data.photos) && data.photos.length > 0 ? data.photos[0] : null;
    if (!photo) {
      console.warn(`[pexels] No results for query "${query}".`);
      return null;
    }

    return {
      photoUrl: photo.src?.large || photo.src?.original || null,
      photographerName: photo.photographer || null,
      photographerUrl: photo.photographer_url || null,
      sourceUrl: photo.url || null,
    };
  } catch (err) {
    console.error('[pexels] Stock photo search failed:', err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { isConfigured, getStockHomePhoto };
