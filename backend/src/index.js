require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const estimateRouter = require('./routes/estimate');
const locationRouter = require('./routes/location');
const statesRouter = require('./routes/states');
const { isConfigured: rentcastConfigured } = require('./services/listingsApiService');
const { isConfigured: simplyRetsConfigured } = require('./services/simplyRetsService');

const app = express();
const PORT = process.env.PORT || 3001;

// Vercel (and most hosts) put this app behind a reverse proxy that sets
// X-Forwarded-For. Express doesn't trust that header by default (a client
// could otherwise spoof its IP), which makes express-rate-limit refuse to
// use it for rate-limit keys — trusting exactly one hop (the platform's own
// proxy) is the standard fix and keeps rate limiting accurate per-visitor.
app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  'http://localhost:3000',
  'https://homevaluecal.com',
  'https://www.homevaluecal.com',
  /\.vercel\.app$/,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait a moment.' },
});
app.use('/api', apiLimiter);

app.use('/api/estimate', estimateRouter);
app.use('/api/location', locationRouter);
app.use('/api/states', statesRouter);

app.get('/health', (req, res) => res.json({
  status: 'ok',
  service: 'HomeValueCal API',
  version: '1.0.0',
  rentcastConfigured: rentcastConfigured(),
  simplyRetsConfigured: simplyRetsConfigured(),
}));

app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`HomeValueCal API running on port ${PORT}`);
});

module.exports = app;
