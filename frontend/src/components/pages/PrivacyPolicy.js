import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 20px 64px', color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.8 }}>
      <Helmet><title>Privacy Policy | HomeValueCal</title></Helmet>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Privacy Policy</h1>
      <p style={{ marginBottom: 16 }}><strong>Last updated:</strong> {new Date().getFullYear()}</p>
      <p style={{ marginBottom: 16 }}>
        HomeValueCal does not require an account or email address to use the estimator. The inputs you enter (state,
        address, home details) are sent to our backend solely to calculate your estimate and are not sold to third parties.
      </p>
      <p style={{ marginBottom: 16 }}>
        When you enter an address, it is sent to OpenStreetMap's Nominatim geocoding service and Overpass API to look up
        nearby amenities. These are third-party public services with their own privacy practices. If a live listings
        API is configured, your address may also be sent to that provider to retrieve comparable listings.
      </p>
      <p>
        We may use privacy-respecting analytics to understand aggregate usage of the site. If you have questions about
        this policy, contact us at hello@homevaluecal.com.
      </p>
    </div>
  );
}
