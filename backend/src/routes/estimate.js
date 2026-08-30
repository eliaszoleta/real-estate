const express = require('express');
const { calculateHomeValue } = require('../services/homeValueEngine');
const { isConfigured, getLiveEstimate } = require('../services/listingsApiService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const input = req.body || {};
    const freeEstimate = calculateHomeValue(input);

    let liveEstimate = null;
    if (isConfigured() && input.address) {
      liveEstimate = await getLiveEstimate({
        address: input.address,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        squareFootage: input.squareFootage,
        propertyType: input.homeType,
      });
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
