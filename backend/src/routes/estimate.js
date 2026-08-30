const express = require('express');
const { calculateHomeValue } = require('../services/homeValueEngine');
const { isConfigured: rentcastConfigured, getLiveEstimate } = require('../services/listingsApiService');
const { isConfigured: simplyRetsConfigured, getNearbyListingPhotos } = require('../services/simplyRetsService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = req.body || {};
    const freeEstimate = calculateHomeValue(input);

    const hasAddress = Boolean(input.address);
    console.log(`[estimate] Live data gate — RentCast configured: ${rentcastConfigured()}, SimplyRETS configured: ${simplyRetsConfigured()}, address provided: ${hasAddress}${hasAddress ? ` ("${input.address}")` : ''}`);

    let liveEstimate = null;
    if (hasAddress) {
      const [avmResult, listingPhotos] = await Promise.all([
        rentcastConfigured() ? getLiveEstimate({
          address: input.address,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          squareFootage: input.squareFootage,
          propertyType: input.homeType,
        }) : null,
        simplyRetsConfigured() ? getNearbyListingPhotos({
          zip: input.zip,
          city: input.city,
          bedrooms: input.bedrooms,
        }) : [],
      ]);

      // Sanity-filter AND rank comps against our own estimate. Listings
      // APIs — demo data especially, but real MLS feeds occasionally too —
      // can return a comp that matches on ZIP/bed count but looks nothing
      // like a home at our price point (a stone mansion "comparable" to a
      // $400K starter home undermines trust even if its price technically
      // isn't astronomical). Two passes: first drop anything wildly outside
      // a plausible range (0.4x–2.5x our estimate), then sort what's left
      // by closeness to our own midpoint — since the results screen always
      // uses the FIRST comp with a photo as the hero image, this guarantees
      // that photo is the best price match we have, not just an arbitrary
      // one from the API's response order.
      const midpoint = (freeEstimate.valueLow + freeEstimate.valueHigh) / 2;
      const plausibleComps = listingPhotos
        .filter((c) => !c.price || (c.price >= freeEstimate.valueLow * 0.4 && c.price <= freeEstimate.valueHigh * 2.5))
        .sort((a, b) => {
          if (!a.price) return 1;
          if (!b.price) return -1;
          return Math.abs(a.price - midpoint) - Math.abs(b.price - midpoint);
        });
      if (plausibleComps.length < listingPhotos.length) {
        console.log(`[estimate] Filtered out ${listingPhotos.length - plausibleComps.length} comp(s) with price too far from our estimate to display as comparable.`);
      }

      if (avmResult || plausibleComps.length > 0) {
        liveEstimate = {
          source: avmResult ? 'rentcast' : 'simplyrets',
          valueLow: avmResult?.valueLow ?? null,
          valueHigh: avmResult?.valueHigh ?? null,
          comps: plausibleComps, // only SimplyRETS supplies comps here — see services/listingsApiService.js header comment
        };
      }
    }

    res.json({
      success: true,
      data: freeEstimate,
      live: liveEstimate, // null unless at least one live data source is configured and returned data
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Estimate failed.' });
  }
});

module.exports = router;
