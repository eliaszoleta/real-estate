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
| Live per-address AVM + comp photos (optional) | Pluggable in `backend/src/services/listingsApiService.js` | Off by default. Set `RENTCAST_API_KEY` to enable — see that file's header comment for important caveats about verifying the API contract against RentCast's current docs before production use |

## Why No Real Comp Photos By Default

An accurate "here's a photo of a similar house" feature requires either a licensed MLS/
listings data feed or a paid real estate API with photo access — neither of which this
project has by default. Rather than showing a misleading photo, the results screen shows
a labeled, hand-drawn illustration of the home type/size described (clearly marked as
illustrative, not an actual listing). If you configure `RENTCAST_API_KEY`, real comparable
listings with photos appear automatically alongside the free estimate.

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
RENTCAST_API_KEY=            # enables live AVM + comp photos

# Frontend
REACT_APP_API_BASE=          # only needed if backend is on a separate origin
```

## Roadmap

Ships as a standalone free estimator, matching HomeCostCal's launch approach. A blog
targeting home-buying search queries (home value estimator, how to negotiate price,
first-time buyer guides, etc.) is a natural fast-follow, along with wiring up a real
listings API if/when one is available.
