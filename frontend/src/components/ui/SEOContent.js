import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOContent() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HomeValueCal',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    description: 'Free home value estimator with state-specific pricing and real neighborhood proximity data.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <section style={{ maxWidth: 760, margin: '64px auto', padding: '0 20px', color: 'var(--text-muted)', fontSize: 14.5, lineHeight: 1.8 }}>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
        How Much Is A Home Really Worth?
      </h2>
      <p style={{ marginBottom: 16 }}>
        Home values vary enormously by state — a typical home can be worth <strong>4-5x more in California than in
        Mississippi</strong> — and even more by neighborhood within the same city. The biggest factors are location,
        square footage, condition, and how desirable the immediate area is, not just the number of bedrooms.
      </p>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10, marginTop: 24 }}>What drives the price?</h3>
      <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
        <li><strong>Location</strong> — state and metro-area demand set the baseline; neighborhood desirability moves it further.</li>
        <li><strong>Square footage</strong> — the largest single driver within a given market.</li>
        <li><strong>Condition</strong> — a fixer-upper and a recently renovated home of the same size can differ by 40%+.</li>
        <li><strong>Bedrooms & bathrooms</strong> — valued as a percentage of the home's base value, not a fixed dollar amount, since a bedroom is worth more in an expensive market.</li>
        <li><strong>Lot size & features</strong> — a pool, view, updated kitchen, or finished basement all add measurable value.</li>
      </ul>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10, marginTop: 24 }}>How we calculate your estimate</h3>
      <p style={{ marginBottom: 16 }}>
        We start from publicly available median home value data by state, then apply transparent percentage
        adjustments for size, home type, bedrooms/bathrooms, condition, age, lot size, and features — the same kind
        of adjustments a real appraiser uses, just automated. When you enter an address, we geocode it with
        OpenStreetMap and query the Overpass API for real nearby schools, grocery stores, hospitals, and parks — live
        public map data — to suggest a neighborhood tier.
      </p>
      <p>
        This gives you a realistic planning range in seconds, completely free and without an email signup. It is not
        a substitute for a comparative market analysis from a local agent or a licensed appraisal.
      </p>
    </section>
  );
}
