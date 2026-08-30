import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 20px 64px', color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.8 }}>
      <Helmet><title>Terms of Service | HomeValueCal</title></Helmet>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Terms of Service</h1>
      <p style={{ marginBottom: 16 }}>
        HomeValueCal provides home value estimates for informational and planning purposes only. Estimates are
        generated from publicly available data and general market adjustments — they are <strong>not</strong> an
        appraisal, a Zestimate, a guarantee of sale price, or a substitute for a comparative market analysis.
      </p>
      <p style={{ marginBottom: 16 }}>
        Actual market value depends on recent comparable sales, current buyer demand, the true condition of the
        property, and local market conditions at the time of sale. Always work with a licensed real estate agent
        and get a professional home inspection before making an offer or accepting one.
      </p>
      <p>
        By using this site you agree that HomeValueCal is not liable for decisions made based on the estimates provided.
      </p>
    </div>
  );
}
