import axios from 'axios';

// Empty string = relative "/api/..." requests. This works out of the box against:
//  - CRA's dev proxy (frontend/package.json "proxy" field) during `npm start`
//  - Vercel's multi-service rewrites (root vercel.json) in production
// Set REACT_APP_API_BASE only if the backend is deployed on a separate origin (e.g. Railway).
const API_BASE = process.env.REACT_APP_API_BASE || '';

const client = axios.create({ baseURL: API_BASE, timeout: 20000 });

function unwrap(promise) {
  return promise
    .then((res) => res.data)
    .catch((err) => {
      const message = err.response?.data?.error || err.message || 'Something went wrong.';
      throw new Error(message);
    });
}

export function postEstimate(payload) {
  return unwrap(client.post('/api/estimate', payload));
}

export function getStates() {
  return unwrap(client.get('/api/states'));
}

export function geocodeAddress(address) {
  return unwrap(client.get('/api/location/geocode', { params: { address } }));
}

export function getProximity(lat, lng) {
  return unwrap(client.get('/api/location/proximity', { params: { lat, lng } }));
}
