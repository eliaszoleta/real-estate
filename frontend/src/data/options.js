// Client-side mirror of backend/src/config/defaults.js option labels/descriptions,
// used to render the calculator steps. Pricing itself always comes from the API.

export const HOME_TYPES = [
  { value: 'single_family', label: 'Single-Family Home', description: 'A standalone home on its own lot.' },
  { value: 'condo', label: 'Condo / Apartment', description: 'Individually owned unit in a shared building.' },
  { value: 'townhouse', label: 'Townhouse', description: 'Multi-level, shares one or more walls.' },
  { value: 'multi_family', label: 'Duplex / Multi-Family', description: '2–4 unit building.' },
  { value: 'mobile_home', label: 'Mobile / Manufactured Home', description: 'Factory-built, on owned or leased land.' },
];

export const CONDITION_OPTIONS = [
  { value: 'fixer_upper', label: 'Fixer-Upper', description: 'Needs significant work — systems, structure, or major cosmetic issues.' },
  { value: 'needs_updates', label: 'Needs Updates', description: 'Livable, but kitchen/baths/finishes are dated.' },
  { value: 'move_in_ready', label: 'Move-In Ready', description: 'Well-maintained, nothing major needed.' },
  { value: 'recently_renovated', label: 'Recently Renovated', description: 'Updated kitchen/baths within the last few years.' },
  { value: 'new_construction', label: 'New Construction', description: 'Never lived in, built in the last year.' },
];

export const AGE_OPTIONS = [
  { value: 'under_10', label: 'Built in the last 10 years' },
  { value: '10_30', label: '10–30 years old' },
  { value: '30_50', label: '30–50 years old' },
  { value: 'over_50', label: 'Over 50 years old' },
];

export const LOT_SIZE_OPTIONS = [
  { value: 'shared_no_yard', label: 'Shared / No Yard' },
  { value: 'small_lot', label: 'Small Lot (< 0.25 acre)' },
  { value: 'standard_lot', label: 'Standard Lot (0.25–0.5 acre)' },
  { value: 'large_lot', label: 'Large Lot (0.5–1 acre)' },
  { value: 'acreage', label: 'Acreage (1+ acres)' },
];

export const EXTRA_FEATURES = [
  { value: 'updated_kitchen', label: 'Updated Kitchen' },
  { value: 'finished_basement', label: 'Finished Basement' },
  { value: 'garage', label: 'Garage' },
  { value: 'pool', label: 'Pool' },
  { value: 'view_or_waterfront', label: 'Notable View / Waterfront' },
  { value: 'solar_panels', label: 'Solar Panels (Owned)' },
  { value: 'home_office', label: 'Dedicated Home Office' },
  { value: 'smart_home', label: 'Smart Home Features' },
];

export const NEIGHBORHOOD_TIERS = [
  { value: 'developing', label: 'Developing Area', description: 'Growing area, fewer nearby amenities.' },
  { value: 'established', label: 'Established Suburb', description: 'Settled neighborhood, everyday conveniences nearby.' },
  { value: 'desirable', label: 'Desirable Area', description: 'Sought-after schools, walkable to amenities.' },
  { value: 'premium', label: 'Premium Location', description: 'Top-rated schools, high demand.' },
  { value: 'luxury_enclave', label: 'Luxury Enclave', description: 'Exclusive area, waterfront/view lots.' },
];
