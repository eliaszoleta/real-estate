export const FAQS = [
  {
    q: 'How accurate is this home value estimator?',
    a: 'It gives you a realistic planning range, not an appraisal. Estimates are built from published median home value data by state (in the spirit of Census/Zillow Research methodology) adjusted for size, bedrooms/bathrooms, condition, age, and — when you enter an address — real-time neighborhood proximity data from OpenStreetMap. Actual market value depends on recent comparable sales, so always get a comparative market analysis from a local agent or a licensed appraisal before making an offer or listing decision.',
  },
  {
    q: 'Is this the same as a Zillow Zestimate?',
    a: "No. Zillow's per-address Zestimate relies on proprietary sale and listing data we don't have access to. HomeValueCal uses free public data plus transparent market adjustments instead, so treat our number as a ballpark starting range rather than a substitute for comps a real estate agent pulls from the MLS.",
  },
  {
    q: 'Why do bedrooms and bathrooms use a percentage adjustment instead of a fixed dollar amount?',
    a: "Because a bedroom is worth a very different dollar amount in Mississippi than in Hawaii. We adjust value by a percentage relative to a 3-bed/2-bath reference home, which scales naturally with your local market instead of applying the same flat number everywhere — this is closer to how real appraisers actually work.",
  },
  {
    q: 'How do you calculate the neighborhood / location data?',
    a: 'When you enter an address, we geocode it with OpenStreetMap and query nearby schools, grocery stores, hospitals, parks, and restaurants within about 2 miles using the OpenStreetMap Overpass API — real, live public map data. We turn that into a transparent 0-100 convenience score and suggest a neighborhood tier, which you can always override.',
  },
  {
    q: 'Can I see photos of comparable homes?',
    a: "Not from live listings by default — we don't have access to an MLS or listings photo feed out of the box. The results screen shows an illustrative sketch of the home type/size you described so you know roughly what you're looking at. If a real estate data API with comp photos is ever connected, this upgrades automatically.",
  },
  {
    q: 'Why does the same house cost more in one state than another?',
    a: 'Local demand, income levels, and housing supply all vary by state — sometimes by 4-5x between the least and most expensive markets. We apply a state median-value baseline (with a metro-area adjustment for major cities) so your estimate reflects your actual market, not a national average.',
  },
];
