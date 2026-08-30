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

      if (avmResult || listingPhotos.length > 0) {
        liveEstimate = {
          source: avmResult ? 'rentcast' : 'simplyrets',
          valueLow: avmResult?.valueLow ?? null,
          valueHigh: avmResult?.valueHigh ?? null,
          comps: listingPhotos, // only SimplyRETS supplies comps here — see services/listingsApiService.js header comment
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
