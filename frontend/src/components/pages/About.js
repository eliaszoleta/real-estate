import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 20px 64px', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8 }}>
      <Helmet><title>About | HomeValueCal</title></Helmet>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>About HomeValueCal</h1>
      <p style={{ marginBottom: 16 }}>
        HomeValueCal is a free calculator built to help homebuyers get a realistic sense of what a home is actually
        worth before they make an offer — without needing an agent login or an email signup just to see a number.
      </p>
      <p style={{ marginBottom: 16 }}>
        Our estimates combine publicly available median home value data with transparent, appraisal-style
        percentage adjustments for size, condition, age, and features — plus, when you give us an address, live
        public location data from OpenStreetMap to gauge neighborhood convenience.
      </p>
      <p>
        We're upfront about the limits: this is a planning tool, not an appraisal or a Zestimate. Every real
        purchase decision deserves a comparative market analysis from a local agent and a licensed home inspection.
        Our job is to get you into that conversation with realistic expectations.
      </p>
    </div>
  );
}
