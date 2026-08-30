const express = require('express');
const { geocodeAddress, getProximityData, suggestNeighborhoodTier } = require('../services/locationService');

const router = express.Router();

router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address || address.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide an address to look up.' });
    }
    const location = await geocodeAddress(address);
    if (!location) {
      return res.status(404).json({ success: false, error: 'Could not find that address. Try a nearby city or ZIP code instead.' });
    }
    res.json({ success: true, data: location });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message || 'Location lookup failed.' });
  }
});

router.get('/proximity', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ success: false, error: 'Valid lat/lng coordinates are required.' });
    }
    const proximity = await getProximityData(lat, lng);
    const suggestedTier = suggestNeighborhoodTier(proximity.convenienceScore);
    res.json({ success: true, data: { ...proximity, suggestedTier } });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message || 'Proximity lookup failed. You can still continue and pick a neighborhood tier manually.' });
  }
});

module.exports = router;
