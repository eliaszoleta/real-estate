const express = require('express');
const { calculateHomeValue } = require('../services/homeValueEngine');
const { isConfigured, getLiveEstimate, getNearbyListingPhotos } = require('../services/listingsApiService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = req.body || {};
    const freeEstimate = calculateHomeValue(input);

    let liveEstimate = null;
    const keyConfigured = isConfigured();
    const hasAddress = Boolean(input.address);
    console.log(`[estimate] Live listings gate — RENTCAST_API_KEY configured: ${keyConfigured}, address provided: ${hasAddress}${hasAddress ? ` ("${input.address}")` : ''}`);

    if (keyConfigured && hasAddress) {
      const [avmResult, listingPhotos] = await Promise.all([
        getLiveEstimate({
          address: input.address,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          squareFootage: input.squareFootage,
          propertyType: input.homeType,
        }),
        // The AVM endpoint's comps don't carry photos — this is a separate
        // active-listings search that does. See listingsApiService.js.
        getNearbyListingPhotos({
          lat: input.lat,
          lng: input.lng,
          city: input.city,
          state: input.state,
          bedrooms: input.bedrooms,
        }),
      ]);

      if (avmResult || listingPhotos.length > 0) {
        liveEstimate = {
          source: 'rentcast',
          valueLow: avmResult?.valueLow ?? null,
          valueHigh: avmResult?.valueHigh ?? null,
          // Prefer real listing photos; fall back to the AVM's (photo-less) comps.
          comps: listingPhotos.length > 0 ? listingPhotos : (avmResult?.comps || []),
        };
      }
    }

    res.json({
      success: true,
      data: freeEstimate,
      live: liveEstimate, // null unless a listings API key is configured and returned data
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message || 'Estimate failed.' });
  }
});

module.exports = router;
