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

      // Sanity-filter comps against our own estimate range. Listings APIs —
      // demo data especially, but real MLS feeds occasionally too — can
      // return an outlier that shares a ZIP/bed count but is wildly off in
      // price (e.g. a $14M mansion "comparable" to a $400K starter home).
      // Generous bounds (0.25x–4x our own range) filter out only genuine
      // outliers, not real price variance between similar homes.
      const plausibleComps = listingPhotos.filter((c) => {
        if (!c.price) return true; // can't judge, don't penalize
        return c.price >= freeEstimate.valueLow * 0.25 && c.price <= freeEstimate.valueHigh * 4;
      });
      if (plausibleComps.length < listingPhotos.length) {
        console.log(`[estimate] Filtered out ${listingPhotos.length - plausibleComps.length} comp(s) with price wildly outside our estimate range.`);
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
