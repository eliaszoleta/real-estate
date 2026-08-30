# 🏡 HomeValueCal — Home Value Estimator

A free, full-stack calculator that estimates what a home is worth — by state, size, home
type, condition, age, and neighborhood — for people who are buying (or thinking about
buying). Built as the "buy" sibling to [HomeCostCal](https://github.com/eliaszoleta/Housing-Cost),
which estimates the cost to *build* a new home.

## What It Does

A step-by-step estimator that produces:
- A value range based on public median-home-value data, adjusted for size, condition,
  age, bedrooms/bathrooms, lot size, and features
- A live "convenience score" from real nearby schools, grocery stores, hospitals, and parks
- An illustrative sketch of what a home matching the description typically looks like
- A full breakdown of every adjustment that went into the number

## Project Structure

```
real-estate/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/    # State median values, all adjustment tables (defaults.js)
│   │   ├── routes/    # /api/estimate, /api/location, /api/states
│   │   └── services/  # Value engine + location/proximity service + optional listings API adapter
│   └── .env.example
└── frontend/         # React app
    └── src/
        ├── components/
        │   ├── calculator/  # Step-by-step wizard + results screen
        │   ├── ui/          # Header, footer, SEO content, state table, FAQ
        │   └── pages/       # About, Contact, Privacy, Terms, per-state SEO pages
        └── data/            # Client-side mirrors of option labels & state list
```

## Getting Started

```bash
npm run install:all
npm run dev:backend    # Terminal 1 — API on :3001
npm run dev:frontend   # Terminal 2 — app on :3000
```

No configuration is required to run it — every feature works with zero API keys.

## Data Sources & Methodology

| Data | Source | Notes |
|------|--------|-------|
| Median home value by state | Hand-compiled snapshot reflecting known relative state rankings (methodology follows Census ACS / Zillow Research) | **Before relying on this for a real business, replace `STATE_MEDIAN_VALUES` in `backend/src/config/defaults.js` with a live pull from the free [Census API](https://api.census.gov) (ACS 5-Year table B25077) or the optional listings API below.** |
| Market adjustments (bed/bath/condition/age/lot/features) | Standard residential appraisal practice — percentage-of-value, not flat dollar amounts | Documented inline in `defaults.js` |
| Geocoding | [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org) | Free, no API key required |
| Nearby amenities | [OpenStreetMap Overpass API](https://overpass-api.de) | Free, no API key, real live map data |
| Real comparable-listing photos (optional, tier 1) | Pluggable in `backend/src/services/simplyRetsService.js` | Off by default. Set `SIMPLYRETS_USERNAME`/`SIMPLYRETS_PASSWORD` to enable (HTTP Basic Auth, not an API key). Schema confirmed against SimplyRETS's published OpenAPI spec. Their public demo account (`simplyrets`/`simplyrets`) works with no signup and returns fake sample listings fixed to Katy, TX / 77430 — useful for testing before you have a real MLS-backed account, but has essentially zero real-world coverage. |
| Stock photo fallback (optional, tier 2) | Pluggable in `backend/src/services/pexelsService.js` | Off by default. Set `PEXELS_API_KEY` to enable (free, instant, self-serve — no application review, unlike MLS/IDX access). Used only when no real comp photo is found, which is most searches given tier 1's narrow coverage. Returns a properly-licensed, keyword-matched stock photo (by home type + rough price tier) — not a photo of any specific comparable property, and labeled as such. |
| RentCast AVM value (unused) | `backend/src/services/listingsApiService.js` | Integration works (confirmed against a live key) but is **not called** — its value was never wired into anything the frontend displays, so calling it was pure wasted API quota. Kept as a working starting point if you want to actually surface its number later. |

## Why No Real Comp Photos By Default

An accurate "here's a photo of a similar house" feature ideally needs a listings data
feed with photo access — but real MLS/IDX coverage is inherently narrow (a specific
market, active listings only, and getting a real account requires a licensed agent or
broker to sponsor your access; see the SimplyRETS FAQ discussion in project history for
why "just sign up" isn't realistic for most people). So the results screen uses a
three-tier fallback, each one clearly labeled for what it actually is:

1. **A real comp photo** (SimplyRETS) — an actual nearby listing, when coverage happens
   to include one within a plausible price range of the estimate.
2. **A stock photo** (Pexels) — a properly-licensed, real photograph matched to the
   home's type and price tier, used whenever tier 1 finds nothing (the common case).
   Not a photo of any specific comparable property, and captioned as such, with
   photographer credit per Pexels's license terms.
3. **The hand-drawn illustration** — final fallback if neither photo source is
   configured or both come up empty.

**Compliance note:** a real (non-demo) SimplyRETS account returns genuine MLS-syndicated
data. Displaying real listing details (address, price, agent/office) publicly is expected
to carry IDX-style attribution ("Listing courtesy of [agent], [brokerage]") — this app
surfaces `agentName`/`officeName` on each comp for that purpose, but you're responsible
for confirming your specific MLS/IDX agreement's exact display requirements before going
live with real data. The public demo account's fake listings carry no such obligation,
and Pexels's stock photos require no MLS/IDX relationship at all.

## Key Calculation Formula

```
base_value = state_median_value(state) × metro_adjustment
sqft_adjusted = base_value × (your_sqft / 1800)   // 1800 = reference home size
adjusted = sqft_adjusted
         × home_type_multiplier
         × (1 + bedroom_delta × 4.5%) × (1 + bathroom_delta × 3.5%)
         × condition_multiplier × age_multiplier × lot_size_multiplier
         × (1 + sum(feature_percentages))
         × neighborhood_tier_multiplier
```

## Design

Same deep forest green + warm gold palette as our other cost/value calculators, Poppins
for headings / Inter for body text, hand-drawn SVG illustrations (no external image
assets), and [lucide-react](https://lucide.dev) icons throughout.

## Deploy

Vercel multi-service (frontend + backend on one domain, `/api/*` routed to the backend
service automatically — see root `vercel.json`). `railway.toml`/`railpack.json` are
included as a fallback if you'd rather split the backend onto Railway.

### Environment Variables (all optional)

```
# Backend
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
SIMPLYRETS_USERNAME=         # tier 1: real comp listing photos (narrow coverage)
SIMPLYRETS_PASSWORD=
PEXELS_API_KEY=               # tier 2: stock photo fallback (broad coverage)
# RENTCAST_API_KEY=           # integration exists but is unused — see table above

# Frontend
REACT_APP_API_BASE=          # only needed if backend is on a separate origin
```

## Roadmap

Ships as a standalone free estimator, matching HomeCostCal's launch approach. A blog
targeting home-buying search queries (home value estimator, how to negotiate price,
first-time buyer guides, etc.) is a natural fast-follow, along with wiring up a real
listings API if/when one is available.
