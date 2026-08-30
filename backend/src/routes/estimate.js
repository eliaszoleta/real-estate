const express = require('express');
const { calculateHomeValue } = require('../services/homeValueEngine');
const { isConfigured: simplyRetsConfigured, getNearbyListingPhotos } = require('../services/simplyRetsService');
const { isConfigured: pexelsConfigured, getStockHomePhoto } = require('../services/pexelsService');

// RentCast's AVM value (services/listingsApiService.js) is deliberately NOT
// called here: its result was never wired into anything the frontend
// displays, so every call was pure wasted API quota. The integration is
// still there and working (confirmed against a live key) if you want to
// actually surface its number later — see that file's header comment.

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = req.body || {};
    const freeEstimate = calculateHomeValue(input);

    const hasAddress = Boolean(input.address);
    console.log(`[estimate] Live data gate — SimplyRETS configured: ${simplyRetsConfigured()}, Pexels configured: ${pexelsConfigured()}, address provided: ${hasAddress}${hasAddress ? ` ("${input.address}")` : ''}`);

    let liveEstimate = null;

    // Tier 1: a real comp photo from SimplyRETS, when an address is given
    // and one is actually available (see that service's coverage caveats).
    if (hasAddress && simplyRetsConfigured()) {
      const listingPhotos = await getNearbyListingPhotos({
        zip: input.zip,
        city: input.city,
        bedrooms: input.bedrooms,
      });

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

      if (plausibleComps.length > 0) {
        liveEstimate = { source: 'simplyrets', comps: plausibleComps };
      }
    }

    // Tier 2: no real comp photo found (or SimplyRETS isn't configured) —
    // try a well-matched, properly-licensed stock photo instead of jumping
    // straight to the illustration. Not location-dependent, so this works
    // even without an address.
    if (!liveEstimate && pexelsConfigured()) {
      const stockPhoto = await getStockHomePhoto({
        homeType: input.homeType,
        valueLow: freeEstimate.valueLow,
        valueHigh: freeEstimate.valueHigh,
      });
      if (stockPhoto) {
        liveEstimate = { source: 'pexels', stockPhoto };
      }
    }

    res.json({
      success: true,
      data: freeEstimate,
      live: liveEstimate, // null unless a live photo source is configured and returned something usable
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Estimate failed.' });
  }
});

module.exports = router;
