const express = require('express');
const { STATE_NAMES, STATE_MEDIAN_VALUES } = require('../config/defaults');

const router = express.Router();

router.get('/', (req, res) => {
  const states = Object.keys(STATE_NAMES).map((code) => ({
    code,
    name: STATE_NAMES[code],
    medianValueLow: STATE_MEDIAN_VALUES[code].low,
    medianValueHigh: STATE_MEDIAN_VALUES[code].high,
  })).sort((a, b) => a.name.localeCompare(b.name));

  res.json({ success: true, data: states });
});

module.exports = router;
